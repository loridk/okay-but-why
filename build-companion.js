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
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseMasterScript(source) {
  const lines = source.split(/\r?\n/);
  const content = [];
  const navigation = [];
  let title = "Okay, But Why?";
  let cardType = null;
  let cardCount = 0;
  let terminalCount = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    const speaker = line.match(/^(PARISA|JULES):\s+(.+)$/);

    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const id = slugify(text);

      if (level === 1) {
        title = text;
      } else if (level === 2) {
        navigation.push({ id, text });
      }

      content.push(`<h${level} id="${id}">${inlineMarkdown(text)}</h${level}>`);
      continue;
    }

    if (line === "[CODE CARD]") {
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

    if (line.startsWith("```") && cardType) {
      const language = line.slice(3) || "text";
      const codeLines = [];

      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
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
      const speakerName = speaker[1][0] + speaker[1].slice(1).toLowerCase();
      content.push(`
        <p class="dialogue ${speaker[1].toLowerCase()}">
          <strong>${speakerName}</strong>
          <span>${inlineMarkdown(speaker[2])}</span>
        </p>`);
    }
  }

  return { title, content, navigation, cardCount, terminalCount };
}

function createPage(episode, hasAudio, slug) {
  const navigation = episode.navigation
    .map(({ id, text }) => `<li><a href="#${id}">${escapeHtml(text)}</a></li>`)
    .join("\n");
  const audio = hasAudio
    ? `<audio controls preload="metadata"><source src="${escapeHtml(slug)}.wav" type="audio/wav">Your browser does not support the audio player.</audio>`
    : `<p class="notice">Audio has not been generated for this draft yet.</p>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(episode.title)} — Listening Companion</title>
  <style>
    :root { color-scheme: dark; --bg: #11131a; --panel: #1b1f2a; --text: #f4f1e8; --muted: #c8c2b5; --gold: #ffd166; --blue: #8ecae6; --pink: #ffafcc; --border: #495164; }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; background: var(--bg); color: var(--text); font: 1rem/1.65 system-ui, sans-serif; }
    a { color: var(--blue); }
    a:focus-visible, audio:focus-visible, pre:focus-visible { outline: 3px solid var(--gold); outline-offset: 4px; }
    .skip-link { position: absolute; left: 1rem; top: -5rem; background: var(--gold); color: #111; padding: .75rem 1rem; z-index: 3; }
    .skip-link:focus { top: 1rem; }
    header, main, nav { width: min(75rem, calc(100% - 2rem)); margin-inline: auto; }
    header { padding: 2.5rem 0 1rem; }
    header p { color: var(--muted); max-width: 68ch; }
    audio { width: 100%; margin-top: 1rem; }
    nav { background: var(--panel); border: 1px solid var(--border); border-radius: .75rem; padding: 1rem 1.25rem; }
    nav ul { columns: 2; padding-left: 1.25rem; }
    main { padding-block: 1rem 5rem; }
    h1 { font-size: clamp(2rem, 7vw, 4.5rem); line-height: 1.05; margin: 0; max-width: 18ch; }
    h2 { color: var(--gold); border-top: 1px solid var(--border); padding-top: 2.5rem; margin-top: 3.5rem; }
    h3 { color: var(--blue); }
    .dialogue { display: grid; grid-template-columns: 6rem 1fr; gap: 1rem; max-width: 70rem; margin: .65rem 0; }
    .dialogue strong { text-transform: uppercase; letter-spacing: .08em; font-size: .8rem; padding-top: .25rem; }
    .dialogue.parisa strong { color: var(--pink); }
    .dialogue.jules strong { color: var(--blue); }
    .dialogue span { max-width: 72ch; }
    code { font-family: ui-monospace, "Cascadia Code", Consolas, monospace; }
    .dialogue code { background: #292f3d; padding: .08em .3em; border-radius: .25rem; }
    .card { margin: 2rem 0; border: 2px solid var(--gold); border-radius: .8rem; overflow: hidden; background: #0a0c11; }
    .card.terminal { border-color: var(--blue); }
    figcaption { display: flex; justify-content: space-between; gap: 1rem; background: var(--panel); padding: .65rem 1rem; font-weight: 700; }
    figcaption span { color: var(--muted); font-weight: 400; }
    pre { margin: 0; padding: 1.25rem; overflow-x: auto; line-height: 1.5; }
    .notice { padding: 1rem; border-left: 4px solid var(--gold); background: var(--panel); }
    footer { color: var(--muted); border-top: 1px solid var(--border); padding: 2rem 1rem; text-align: center; }
    @media (max-width: 42rem) { nav ul { columns: 1; } .dialogue { grid-template-columns: 1fr; gap: 0; } }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
  </style>
</head>
<body>
  <a class="skip-link" href="#script">Skip to script</a>
  <header>
    <p>Okay, But Why? — Listening Companion</p>
    <h1>${escapeHtml(episode.title)}</h1>
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
  const audioPath = path.join(episodeDirectory, `${slug}.wav`);
  const outputPath = path.join(episodeDirectory, "companion.html");
  const source = await fs.readFile(scriptPath, "utf8");
  const episode = parseMasterScript(source);
  const hasAudio = await fs.access(audioPath).then(() => true, () => false);

  await fs.writeFile(outputPath, createPage(episode, hasAudio, slug), "utf8");
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
