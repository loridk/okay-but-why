# AI — production and continuity guide

Status: 12 written episodes and companion references. Support Assistant is fictional; no application or audio is produced by this package.

## Settled progression

1. What the Hell Is AI, Actually? — scope and taxonomy; start with the support problem.
2. How Does a Machine Learn Anything? — training, parameters, data quality, inference.
3. LLMs: Extremely Fancy Autocomplete? — tokens, generation, attention, context, uncertainty.
4. Prompts, Context & Talking to the Robot — clear briefs, context limits, structured output.
5. Putting AI in Software: Models, APIs & SDKs — ordinary web architecture and secure boundaries.
6. RAG: Giving AI a Filing Cabinet — retrieval, embeddings, chunking, current evidence.
7. Tools & Function Calling: Letting the Robot Do Things — proposed calls and controlled execution.
8. MCP: Why Does AI Need Another Damn Protocol? — integration roles and trust boundaries.
9. Agents: Apparently the Robot Has a Job Now — variable paths, bounded loops, state.
10. Evals, Hallucinations & Keeping the Robot From Ruining Tuesday — measurable behavior and enforced controls.
11. From Demo to Production: Oh Shit, People Are Actually Using It — operating costs, reliability, hosting choices.
12. Forward Deployed: Turning 'We Should Use AI' Into Something Useful — applied delivery, roles, adoption.

## Continuity established here

- Main hosts: Parisa and Jules as experienced peers. Sabrina appears in 01, 04, 08, 09, 11, and 12; no new specialist guest or personal cast history.
- Support Assistant begins with scattered internal documents and records. It gains context, an application boundary, retrieval, constrained tools, optional MCP, and optional bounded investigation. These are conceptual stages, not claimed deployments.
- Brenda's 40,000 documents enter in 04, motivate retrieval in 06, and return as an ownership/archiving payoff in 12. Brenda is an off-mic fictional operations colleague, not a new voice.
- “Just train it” is examined in 02 and revisited in 06. “Is this actually an agent?” and the humble if statement belong in 09 and the finale.
- Episode 05 includes a conceptual Chef Nervous Robot callback without inventing its implementation details. Episode 11 recalls Containers & Infrastructure responsibility questions without reteaching deployment.
- The map metaphor for embeddings explicitly stops at learned, high-dimensional similarity, not human-labeled axes or objective meaning. The USB-C metaphor explicitly stops at common connectivity, not universal compatibility or trust.
- Ending: technology is not the requirement; the problem is the requirement. No next series is promised.

## Sources and examples

The live Show Bible was read on September 25, 2026 and recorded 13 written series / 143 episodes before this work. These 12 episodes extend the local catalog to 14 series / 155 episodes. The live Show Bible itself was not edited; this guide supplies the new continuity record for a later narrow update.

Companion references include source links. Current checks focused on MCP protocol 2026-07-28, agent terminology, evaluation practice, local/open-weight tooling, and factual role emphases. Other links are foundational further reading. No provider-specific model SDK is required; the TypeScript examples use application-owned interfaces and controlled fakes in checks. MCP JSON is an illustrative message, not a working server. Pseudocode is labeled as such.

## Files and rebuilding

- `01–12/master-script.md`: audio-first dialogue.
- `01–12/companion-notes.html`: reference material kept outside spoken text.
- `01–12/companion.html`: generated transcript plus references with shared CSS.
- `05/request-example.ts`, `06/rag-example.ts`, `07/tool-example.ts`: small teaching functions.
- `10/eval-cases.json`: example fixtures and evaluation criteria, not measured results.

From the podcast checkout, run `node build-companion.js ai 01` for one companion and `node build-indexes.js ai` for the AI and root indexes. Run `node generate-gemini.js ai 01 --check` for parser/chunk readiness without generating audio. Substitute the two-digit episode number as needed.

Recording, listening QA, provider integration testing, and publication remain separate. Runtime is determined by delivery, not padded to a target.
