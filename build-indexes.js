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

function titleCase(slug) {
  const names = {
    "node-npm": "Node, npm & the Modern JavaScript Toolchain",
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

async function exists(filePath) {
  return fs.access(filePath).then(() => true, () => false);
}

async function getEpisodeTitle(scriptPath) {
  const source = await fs.readFile(scriptPath, "utf8");
  const heading = source.match(/^#\s+(.+)$/m)?.[1] ?? "Untitled episode";
  return heading.replace(/^Episode\s+\d+\s*(?::|[—-])\s*/, "");
}

function page({ title, eyebrow, introduction, content, homeHref, stylesheetHref }) {
  const homeLink = homeHref
    ? `<p><a href="${homeHref}">← All podcast series</a></p>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — Okay, But Why?</title>
  <link rel="stylesheet" href="${escapeHtml(stylesheetHref)}">
</head>
<body class="index-page">
  <header>${homeLink}<p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1><p class="intro">${escapeHtml(introduction)}</p></header>
  <main>${content}</main>
  <footer>Okay, But Why? — Tech concepts without the ceremonial fog.</footer>
</body>
</html>`;
}

async function getSeries() {
  const entries = await fs.readdir(EPISODES_DIRECTORY, { withFileTypes: true });
  const series = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const seriesDirectory = path.join(EPISODES_DIRECTORY, entry.name);
    const episodeEntries = await fs.readdir(seriesDirectory, { withFileTypes: true });
    const episodeNumbers = episodeEntries
      .filter((candidate) => candidate.isDirectory() && /^\d{2}$/.test(candidate.name))
      .map((candidate) => candidate.name)
      .sort();

    if (episodeNumbers.length > 0) {
      series.push({ slug: entry.name, directory: seriesDirectory, episodeNumbers });
    }
  }

  return series.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function buildSeriesIndex(series) {
  const items = [];

  for (const episodeNumber of series.episodeNumbers) {
    const episodeDirectory = path.join(series.directory, episodeNumber);
    const scriptPath = path.join(episodeDirectory, "master-script.md");
    const title = await getEpisodeTitle(scriptPath);
    const audioName = `${series.slug}-${episodeNumber}.wav`;
    const hasAudio = await exists(path.join(episodeDirectory, audioName));

    items.push(`<li><a class="card" href="${episodeNumber}/companion.html"><strong>Episode ${Number(episodeNumber)}: ${escapeHtml(title)}</strong><span class="meta">${hasAudio ? "Audio and transcript" : "Draft transcript"}</span></a></li>`);
  }

  const seriesTitle = `${titleCase(series.slug)} Series`;
  const html = page({
    title: seriesTitle,
    eyebrow: "Episode guide",
    introduction: `Start at Episode 1 or jump directly to any ${titleCase(series.slug)} topic. Each page includes the audio, transcript, and code cards.`,
    content: `<ul>${items.join("\n")}</ul>`,
    homeHref: "../index.html",
    stylesheetHref: "../styles.css",
  });

  await fs.writeFile(path.join(series.directory, "index.html"), html, "utf8");
  console.log(`Built episodes/${series.slug}/index.html with ${items.length} episodes.`);
}

async function main() {
  const allSeries = await getSeries();

  for (const series of allSeries) {
    await buildSeriesIndex(series);
  }

  const items = allSeries.map((series) => {
    const name = titleCase(series.slug);
    const count = series.episodeNumbers.length;
    return `<li><a class="card" href="${series.slug}/index.html"><strong>${escapeHtml(name)}</strong><span class="meta">${count} ${count === 1 ? "episode" : "episodes"}</span></a></li>`;
  });

  const html = page({
    title: "Episode Guides",
    eyebrow: "Okay, But Why?",
    introduction: "Choose a series to hear the episodes and follow its transcripts, examples, and code cards.",
    content: `<ul>${items.join("\n")}</ul>`,
    stylesheetHref: "styles.css",
  });

  await fs.writeFile(path.join(EPISODES_DIRECTORY, "index.html"), html, "utf8");
  console.log(`Built episodes/index.html with ${items.length} series.`);
}

main().catch((error) => {
  console.error(`Index build stopped: ${error.message}`);
  process.exitCode = 1;
});
