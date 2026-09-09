const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");

const MODEL = "gemini-3.1-flash-tts-preview";
const POSITIONAL_ARGUMENTS = process.argv
  .slice(2)
  .filter((argument) => !argument.startsWith("--"));
const SERIES_SLUG = POSITIONAL_ARGUMENTS[0] ?? "typescript";
const EPISODE_NUMBER = POSITIONAL_ARGUMENTS[1] ?? "01";

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(SERIES_SLUG)) {
  throw new Error(
    `Invalid series "${SERIES_SLUG}". Use a slug such as typescript or modern-css.`,
  );
}

if (!/^\d{2}$/.test(EPISODE_NUMBER)) {
  throw new Error(
    `Invalid episode number "${EPISODE_NUMBER}". Use two digits, such as 02.`,
  );
}

const EPISODE_SLUG = `${SERIES_SLUG}-${EPISODE_NUMBER}`;
const EPISODE_DIRECTORY = path.join(
  __dirname,
  "episodes",
  SERIES_SLUG,
  EPISODE_NUMBER,
);
const SCRIPT_PATH = path.join(EPISODE_DIRECTORY, "master-script.md");
const OUTPUT_PATH = path.join(EPISODE_DIRECTORY, `${EPISODE_SLUG}.wav`);
const PARTS_DIRECTORY = path.join(EPISODE_DIRECTORY, "audio-parts");
const MAX_CHUNK_CHARACTERS = 1000;
const SILENCE_BETWEEN_CHUNKS_MS = 400;

const CAST = {
  PARISA: "Pulcherrima",
  JULES: "Erinome",
  SABRINA: "Leda",
};

function getSpeakers(dialogue) {
  return [...new Set(dialogue.map((line) => line.match(/^([A-Z]+):/)?.[1]).filter(Boolean))];
}

function createSpeechConfig(dialogue) {
  const speakers = getSpeakers(dialogue);

  if (speakers.length === 0 || speakers.length > 2) {
    throw new Error(
      `Each audio chunk must contain one or two speakers; found ${speakers.length}.`,
    );
  }

  if (speakers.length === 1) {
    return {
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: CAST[speakers[0]] },
      },
    };
  }

  return {
    multiSpeakerVoiceConfig: {
      speakerVoiceConfigs: speakers.map((speaker) => ({
        speaker,
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: CAST[speaker] },
        },
      })),
    },
  };
}

function removeMarkdown(text) {
  return text.replace(/`([^`]+)`/g, "$1").replace(/\*([^*]+)\*/g, "$1");
}

function extractSections(source) {
  const sections = [];
  let currentSection = { title: "Opening", dialogue: [] };

  for (const [index, line] of source.split(/\r?\n/).entries()) {
    const heading = line.match(/^##\s+(.+)$/);

    if (heading) {
      if (currentSection.dialogue.length > 0) {
        sections.push(currentSection);
      }

      currentSection = { title: heading[1], dialogue: [] };
      continue;
    }

    const match = line.match(/^([A-Z]+):\s+(.+)$/);

    if (!match) {
      continue;
    }

    const [, speaker, text] = match;

    if (!CAST[speaker]) {
      throw new Error(
        `Line ${index + 1} uses unknown speaker ${speaker}. Add the speaker to CAST first.`,
      );
    }

    currentSection.dialogue.push(`${speaker}: ${removeMarkdown(text)}`);
  }

  if (currentSection.dialogue.length > 0) {
    sections.push(currentSection);
  }

  if (sections.length === 0) {
    throw new Error(
      "The master script contains no PARISA: or JULES: dialogue.",
    );
  }

  return sections;
}

function buildChunks(sections) {
  const chunks = [];
  let current = { titles: [], dialogue: [] };

  function flush() {
    if (current.dialogue.length > 0) {
      chunks.push(current);
      current = { titles: [], dialogue: [] };
    }
  }

  for (const section of sections) {
    for (const line of section.dialogue) {
      const splitLength = current.dialogue.join("\n").length;
      const nextLength =
        splitLength + (current.dialogue.length ? 1 : 0) + line.length;
      const nextSpeakers = getSpeakers([...current.dialogue, line]);

      if (
        current.dialogue.length > 0 &&
        (nextLength > MAX_CHUNK_CHARACTERS || nextSpeakers.length > 2)
      ) {
        flush();
      }

      if (current.titles.length === 0) {
        current.titles.push(section.title);
      }

      current.dialogue.push(line);
    }

  }

  flush();
  return chunks;
}

function addWavHeader(pcm, sampleRate = 24_000) {
  const header = Buffer.alloc(44);
  const channels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * channels * (bitsPerSample / 8);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(channels * (bitsPerSample / 8), 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

function getPcmData(audio) {
  if (audio.subarray(0, 4).toString() !== "RIFF") {
    return audio;
  }

  let offset = 12;

  while (offset + 8 <= audio.length) {
    const chunkId = audio.subarray(offset, offset + 4).toString();
    const chunkSize = audio.readUInt32LE(offset + 4);
    const dataStart = offset + 8;

    if (chunkId === "data") {
      return audio.subarray(dataStart, dataStart + chunkSize);
    }

    offset = dataStart + chunkSize + (chunkSize % 2);
  }

  throw new Error("A generated WAV part has no readable audio data.");
}

function chunkFileName(chunk, index) {
  const fingerprint = createHash("sha256")
    .update(MODEL)
    .update(JSON.stringify(CAST))
    .update(chunk.dialogue.join("\n"))
    .digest("hex")
    .slice(0, 10);

  return `${String(index + 1).padStart(2, "0")}-${fingerprint}.wav`;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generateConversation(dialogue, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const transcript = dialogue.join("\n");
  const prompt = `
Generate speech for the exact transcript below. Do not add, remove, or paraphrase words.

DIRECTOR'S NOTES
Overall: A candid, funny technology podcast between close friends. Make it sound
like a real conversation, not an audiobook, presentation, or commercial. React
to the meaning of each line and use natural conversational timing.

Parisa: An experienced web developer. Grounded, mature, skeptical, dry, warm,
and understated. Measured but not slow. Her jokes are tossed off, not performed.

Jules: Parisa's knowledgeable adult peer. Slightly brighter and quicker, with
genuine enthusiasm, but never bubbly, childish, or announcer-like.

Sabrina: A competent, enthusiastic developer in her early twenties. Current,
quick, and confident, but never childish, frantic, or a caricature of Gen Z.

TRANSCRIPT
${transcript}
`.trim();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: createSpeechConfig(dialogue),
      },
    }),
  });
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Gemini request failed (${response.status}): ${body}`);
  }

  const result = JSON.parse(body);
  const parts = result.candidates?.[0]?.content?.parts ?? [];
  const audioPart = parts.find((part) => part.inlineData?.data);

  if (!audioPart) {
    throw new Error("Gemini completed the request but returned no audio.");
  }

  return {
    audio: Buffer.from(audioPart.inlineData.data, "base64"),
    mimeType: audioPart.inlineData.mimeType ?? "",
  };
}

async function main() {
  const source = await fs.readFile(SCRIPT_PATH, "utf8");
  const sections = extractSections(source);
  const chunks = buildChunks(sections);
  const lineCount = sections.reduce(
    (total, section) => total + section.dialogue.length,
    0,
  );

  if (process.argv.includes("--check")) {
    console.log(
      `Script check passed: ${lineCount} spoken lines in ${chunks.length} audio chunks.`,
    );
    chunks.forEach((chunk, index) => {
      console.log(
        `  ${index + 1}. ${chunk.dialogue.length} lines, ${chunk.dialogue.join("\n").length} characters — ${chunk.titles.join(" / ")}`,
      );
    });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in this terminal session.");
  }

  console.log(
    `Preparing ${lineCount} lines in ${chunks.length} chunks with Parisa (${CAST.PARISA}) and Jules (${CAST.JULES}).`,
  );
  await fs.mkdir(PARTS_DIRECTORY, { recursive: true });

  const pcmParts = [];
  const silence = Buffer.alloc(
    Math.round(24_000 * 2 * (SILENCE_BETWEEN_CHUNKS_MS / 1_000)),
  );

  for (const [index, chunk] of chunks.entries()) {
    // Add a 2-second delay between chunks to prevent hitting rate limits
    if (index > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    const fileName = chunkFileName(chunk, index);
    const partPath = path.join(PARTS_DIRECTORY, fileName);
    let wav;

    if (await fileExists(partPath)) {
      console.log(`[${index + 1}/${chunks.length}] Reusing ${fileName}.`);
      wav = await fs.readFile(partPath);
    } else {
      console.log(
        `[${index + 1}/${chunks.length}] Generating ${chunk.titles.join(" / ")}...`,
      );
      const { audio } = await generateConversation(
        chunk.dialogue,
        apiKey,
      );
      wav =
        audio.subarray(0, 4).toString() === "RIFF"
          ? audio
          : addWavHeader(audio);
      await fs.writeFile(partPath, wav);
      console.log(`  Saved ${fileName}.`);
    }

    if (pcmParts.length > 0) {
      pcmParts.push(silence);
    }

    pcmParts.push(getPcmData(wav));
  }

  const episodeWav = addWavHeader(Buffer.concat(pcmParts));
  await fs.writeFile(OUTPUT_PATH, episodeWav);
  console.log(`Combined all parts into ${path.basename(OUTPUT_PATH)}.`);
}

main().catch((error) => {
  console.error(`\nGemini generation stopped: ${error.message}`);
  process.exitCode = 1;
});
