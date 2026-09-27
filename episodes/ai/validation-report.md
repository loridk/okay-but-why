# AI series — validation report

Validated September 26, 2026. Technical research and Show Bible read performed September 25, 2026.

## Delivered

12 complete master scripts, 12 generated HTML companions, 12 companion reference source files, a series index, continuity guide, three small TypeScript teaching examples, and an example eval dataset. The root episode index now includes AI after Containers & Infrastructure.

The finale includes the complete conceptual Support Assistant architecture, problem-to-solution decision map, FDE delivery workflow, qualified role comparison, questions before adding AI, and glossary with links to Episodes 1–11.

## Verification results

- All 12 existing `generate-gemini.js ai NN --check` parser/chunk checks passed. Only no-audio checks were invoked.
- Every generated transcript preserves its script's speaker, dialogue text, and order.
- Every companion has one main heading, an audio player pointing at the expected future WAV, shared stylesheet, unique IDs, valid local links/anchors, and semantic table captions/header scopes where applicable.
- All 12 companions reuse the existing stylesheet. No CSS or design system was added.
- JSON cards and the eval fixture parse; the series index contains all 12 companions.
- 15 behavior checks passed for the three TypeScript examples: response/error/shape handling, empty-evidence behavior and evidence forwarding, permitted lookup, cross-tenant denial, missing permission, and invalid tool arguments.
- Existing episodes and text assets match their pre-installation hashes; existing audio/media sizes and modification times are unchanged. Only the two builders and root episode index changed among pre-existing files.
- Zero AI audio files generated. No application, model service, MCP server, or cloud infrastructure was deployed.

## Spoken length

Total: **14,865 spoken words**. Counts exclude headings and companion material. At 130–160 words per minute, these scripts are roughly 7–12 minutes each before transitions and pauses; these are estimates, not recorded runtimes. They were not padded to 30 minutes.

| Episode | Spoken words | Dialogue turns | Parser chunks |
|---|---:|---:|---:|
| 01 | 1329 | 68 | 12 |
| 02 | 1311 | 62 | 10 |
| 03 | 1250 | 59 | 10 |
| 04 | 1212 | 61 | 22 |
| 05 | 1218 | 52 | 9 |
| 06 | 1208 | 55 | 9 |
| 07 | 1118 | 56 | 9 |
| 08 | 1129 | 52 | 22 |
| 09 | 1168 | 54 | 22 |
| 10 | 1200 | 57 | 9 |
| 11 | 1215 | 53 | 17 |
| 12 | 1507 | 68 | 30 |

## Editorial and technical scope

All twelve settled topics are represented. Parisa and Jules are experienced peers; Sabrina appears selectively in 01, 04, 08, 09, 11, and 12. Support Assistant stays fictional and develops cumulatively. The examples distinguish JavaScript from TypeScript and compile-time types from runtime checks. Security and accessibility occur at the relevant data, tool, and UI boundaries.

MCP reference material targets protocol 2026-07-28 and names compatibility limits. Agent terminology is presented as a working architectural distinction rather than a universal definition. Hosted/local/open-weight choices and role descriptions avoid universal claims. Companion links provide sources and further reading. No measured production benefits or professional qualifications are claimed.

## Limits

- Visual browser QA was attempted but blocked by the browser tool's local-file URL security policy. No desktop/mobile rendering or screen-reader audit is claimed. HTML structure and local links were checked directly.
- Node 24 executed the TypeScript examples with type stripping and mocked dependencies. This does not constitute a TypeScript compiler check or live provider integration test.
- The MCP message is illustrative; no live protocol conformance test was run. The agent loop is explicitly labeled pseudocode.
- Eval cases are examples, not evaluation results for a functioning Support Assistant.
- No audio generation, listening QA, or publication was performed.
- The live Show Bible remains unchanged. `series-guide.md` records the new continuity and the resulting local 14-series / 155-episode catalog.
