const fs = require("node:fs/promises");
const path = require("node:path");

const EPISODES_DIRECTORY = path.join(__dirname, "episodes");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inlineMarkdown(value) {
  // Protect inline code before interpreting emphasis: code may contain asterisks.
  return value.split(/(`[^`]+`)/g).map((part) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return "<code>" + escapeHtml(part.slice(1, -1)) + "</code>";
    }
    return escapeHtml(part).replace(
      /\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*]+)\*/g,
      (_, both, strong, emphasis) => both !== undefined
        ? "<strong><em>" + both + "</em></strong>"
        : strong !== undefined
          ? "<strong>" + strong + "</strong>"
          : "<em>" + emphasis + "</em>",
    );
  }).join("");
}

function plainMarkdown(value) {
  return inlineMarkdown(value).replace(/<\/?(?:code|strong|em)>/g, "");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatSeriesName(slug) {
  const names = {
    "modern-css": "Modern CSS — Wait, CSS Does That Now?",
    "node-npm": "Node, npm & the Modern JavaScript Toolchain",
    "react-frameworks": "React & Modern Front-End Frameworks",
    typescript: "TypeScript",
  };

  if (names[slug]) {
    return names[slug];
  }

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseMasterScript(source) {
  const lines = source.split(/\r?\n/);
  const content = [];
  const navigation = [];
  const usedIds = new Set(["script"]);
  let lastSpeaker = null;
  let title = "Okay, But Why?";
  let cardType = null;
  let cardCount = 0;
  let terminalCount = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    const speaker = line.match(/^(PARISA|JULES|SABRINA):\s+(.+)$/);

    if (heading) {
      const level = heading[1].length;
      const text = heading[2];

      if (level === 2 && /^Production (?:Notes|References)/.test(text)) {
        break;
      }

      // Production cues are not listener-facing sections.
      if (/^Cold Open(?:$|\s|[—–:-])/i.test(text)) continue;

      const baseId = slugify(text);
      let id = baseId;
      let suffix = 2;
      while (usedIds.has(id)) id = baseId + "-" + suffix++;
      usedIds.add(id);
      lastSpeaker = null;

      if (level === 1) {
        title = text;
        continue;
      } else if (level === 2) {
        navigation.push({ id, text });
      }

      content.push(`<h${level} id="${id}">${inlineMarkdown(text)}</h${level}>`);
      continue;
    }

    if (line === "[CODE CARD]" || line.startsWith("[CODE CARD:")) {
      cardType = "code";
      continue;
    }

    if (line === "[TERMINAL]") {
      cardType = "terminal";
      continue;
    }

    if (line === "[END]" || line.startsWith("Status:")) {
      continue;
    }

    const fence = line.match(/^(```|~~~)(.*)$/);

    if (fence && cardType) {
      const marker = fence[1];
      const language = fence[2] || "text";
      const codeLines = [];

      index += 1;
      while (index < lines.length && !lines[index].startsWith(marker)) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (cardType === "code") {
        cardCount += 1;
      } else {
        terminalCount += 1;
      }

      const number = cardType === "code" ? cardCount : terminalCount;
      const label = cardType === "code" ? "Code card" : "Terminal output";
      content.push(`
        <figure class="card ${cardType}" aria-label="${label} ${number}">
          <figcaption>${label} ${number}<span>${escapeHtml(language)}</span></figcaption>
          <pre tabindex="0"><code>${escapeHtml(codeLines.join("\n"))}</code></pre>
        </figure>`);
      cardType = null;
      continue;
    }

    if (speaker) {
      lastSpeaker = speaker[1];
      const speakerName = speaker[1][0] + speaker[1].slice(1).toLowerCase();
      content.push(`
        <p class="dialogue ${speaker[1].toLowerCase()}">
          <strong>${speakerName}</strong>
          <span>${inlineMarkdown(speaker[2])}</span>
        </p>`);
    } else if (lastSpeaker && line.trim() && !line.startsWith("[")) {
      const speakerName = lastSpeaker[0] + lastSpeaker.slice(1).toLowerCase();
      content.push(`
        <p class="dialogue ${lastSpeaker.toLowerCase()}">
          <strong>${speakerName}</strong>
          <span>${inlineMarkdown(line)}</span>
        </p>`);
    }
  }

  return { title, content, navigation, cardCount, terminalCount };
}

function createPage(episode, slug, seriesSlug, existingAudio) {
  const navigation = episode.navigation
    .map(({ id, text }) => `<li><a href="#${id}">${inlineMarkdown(text)}</a></li>`)
    .join("\n");
  // A comment-only placeholder is invisible; show the local player until published.
  if (["modern-javascript", "web-architecture", "cybersecurity"].includes(seriesSlug) && !/<(?:audio|iframe|script)\b/i.test(existingAudio ?? "")) {
    existingAudio = `<audio controls preload="metadata" aria-label="Episode audio"><source src="${escapeHtml(slug)}.wav" type="audio/wav">Your browser does not support the audio player.</audio>
    <!-- Replace the local player with this episode's RedCircle embed when published. -->`;
  }
  const audio = existingAudio ?? `<audio controls preload="metadata"><source src="${escapeHtml(slug)}.mp3" type="audio/mpeg">Your browser does not support the audio player.</audio>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${plainMarkdown(episode.title)} — Listening Companion</title>
  <link rel="stylesheet" href="../../styles.css">
</head>
<body class="companion-page">
  <a class="skip-link" href="#script">Skip to script</a>
  <header>
    <p><a href="../index.html">← Back to ${escapeHtml(formatSeriesName(seriesSlug))} episodes</a></p>
    <p>Okay, But Why? — Listening Companion</p>
    <h1>${inlineMarkdown(episode.title)}</h1>
    <p>Play the episode and follow the complete transcript. Code and terminal cards appear exactly where they are discussed.</p>
    ${audio}
  </header>
  <nav aria-label="Episode sections"><h2>Episode sections</h2><ul>${navigation}</ul></nav>
  <main id="script">${episode.content.join("\n")}</main>
  <footer>${episode.cardCount} code cards · ${episode.terminalCount} terminal cards</footer>
</body>
</html>`;
}

async function buildEpisode(seriesSlug, episodeNumber) {
  const slug = `${seriesSlug}-${episodeNumber}`;
  const episodeDirectory = path.join(
    EPISODES_DIRECTORY,
    seriesSlug,
    episodeNumber,
  );
  const scriptPath = path.join(episodeDirectory, "master-script.md");
  const outputPath = path.join(episodeDirectory, "companion.html");
  const source = await fs.readFile(scriptPath, "utf8");
  const episode = parseMasterScript(source);
  let existingAudio;
  try {
    const existing = await fs.readFile(outputPath, "utf8");
    // Keep the existing embed/player/placeholder after the header description.
    existingAudio = existing.match(/<\/h1>\s*<p>[\s\S]*?<\/p>([\s\S]*?)<\/header>/i)?.[1].trim();
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await fs.writeFile(
    outputPath,
    createPage(episode, slug, seriesSlug, existingAudio),
    "utf8",
  );
  console.log(
    `Built ${path.relative(__dirname, outputPath)} with ${episode.cardCount} code cards and ${episode.terminalCount} terminal cards.`,
  );
}

const seriesSlug = process.argv[2];
const episodeNumber = process.argv[3];

if (!seriesSlug || !episodeNumber) {
  console.error("Usage: node build-companion.js typescript 01");
  process.exitCode = 1;
} else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(seriesSlug)) {
  console.error("Series must be a lowercase slug such as typescript or modern-css.");
  process.exitCode = 1;
} else if (!/^\d{2}$/.test(episodeNumber)) {
  console.error("Episode number must use two digits, such as 01 or 02.");
  process.exitCode = 1;
} else {
  buildEpisode(seriesSlug, episodeNumber).catch((error) => {
    console.error(`Companion build stopped: ${error.message}`);
    process.exitCode = 1;
  });
}
