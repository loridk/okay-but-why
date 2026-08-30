const fs = require("node:fs/promises");
const path = require("node:path");

const VOICEBOX_URL = "http://localhost:17493";
const TRANSCRIPT_PATH = path.join(__dirname, "transcript.txt");
const POLL_DELAY_MS = 1_000;

const CAST = {
  PARISA: {
    profileId: "4e72e845-99ec-4ca4-9a13-8da82d25a755",
    preset: "River",
  },
  JULES: {
    profileId: "533256ff-2cc3-4580-a559-f5346af053fb",
    preset: "Aoede",
  },
};

function parseTranscript(source) {
  return source
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line, index) => {
      const match = line.match(/^([A-Z]+):\s+(.+)$/);

      if (!match) {
        throw new Error(`Line ${index + 1} must use SPEAKER: dialogue format.`);
      }

      const [, speaker, text] = match;

      if (!CAST[speaker]) {
        throw new Error(`Line ${index + 1} uses unknown speaker ${speaker}.`);
      }

      return { speaker, text };
    });
}

async function readJson(response, description) {
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`${description} failed (${response.status}): ${body}`);
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`${description} returned unexpected data: ${body}`);
  }
}

async function generateTurn(turn) {
  const voice = CAST[turn.speaker];
  const response = await fetch(`${VOICEBOX_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile_id: voice.profileId,
      text: turn.text,
      language: "en",
      engine: "kokoro",
    }),
  });

  return readJson(response, `${turn.speaker} generation request`);
}

function parseStatusBody(body) {
  const dataLines = body
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim());
  const json = dataLines.at(-1) ?? body;

  try {
    return JSON.parse(json);
  } catch {
    throw new Error(`Status check returned unexpected data: ${body}`);
  }
}

async function getStatus(generationId) {
  const response = await fetch(
    `${VOICEBOX_URL}/generate/${generationId}/status`,
  );
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Status check failed (${response.status}): ${body}`);
  }

  return parseStatusBody(body);
}

async function waitForCompletion(generationId) {
  while (true) {
    const result = await getStatus(generationId);

    if (result.status === "completed") {
      return result;
    }

    if (result.status === "failed" || result.status === "cancelled") {
      throw new Error(result.error ?? `Generation ${result.status}.`);
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_DELAY_MS));
  }
}

async function main() {
  const source = await fs.readFile(TRANSCRIPT_PATH, "utf8");
  const turns = parseTranscript(source);

  console.log(`Found ${turns.length} transcript turns.\n`);

  for (const [index, turn] of turns.entries()) {
    const voice = CAST[turn.speaker];
    console.log(
      `[${index + 1}/${turns.length}] ${turn.speaker} (${voice.preset}): ${turn.text}`,
    );

    const generation = await generateTurn(turn);
    console.log(`  Requested: ${generation.id}`);

    const completed = await waitForCompletion(generation.id);
    console.log(`  Completed: ${completed.duration ?? "unknown"} seconds\n`);
  }

  console.log("All turns completed. Listen to them in Voicebox.");
}

main().catch((error) => {
  console.error(`\nPrototype stopped: ${error.message}`);
  process.exitCode = 1;
});
