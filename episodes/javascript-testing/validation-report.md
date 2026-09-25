# JavaScript Testing — Production Check

All ten complete scripts and generated HTML companions are present. Total: 30,102 spoken words and 26 code cards.

- All ten scripts passed `generate-gemini.js javascript-testing NN --check`.
- Generated companions preserve every dialogue turn and code card, with valid section anchors, shared stylesheet links, skip links, and one expected future WAV player per episode.
- All ten pages were checked in a desktop browser. A mobile page and keyboard skip link were checked; representative screenshots were visually reviewed.
- Delivery-fee, receipt-request, and async-menu implementation cards were exercised with Node assertions. The plain DOM implementation's keyboard interaction was exercised in a browser.
- Framework-specific Vitest/React test cards were reviewed but not executed in an installed practice project. The Playwright journey is explicitly hypothetical and requires its own fixture application.
- No audio was generated. At 110–130 spoken words per minute, episodes contain approximately 23–28 minutes of dialogue, before music and pauses. The approximately 30-minute production target requires a recorded read to confirm.

| Episode | Spoken words |
| --- | ---: |
| 01 | 3,007 |
| 02 | 3,051 |
| 03 | 2,996 |
| 04 | 2,980 |
| 05 | 2,997 |
| 06 | 3,035 |
| 07 | 3,025 |
| 08 | 2,957 |
| 09 | 3,007 |
| 10 | 3,047 |

Checks above were completed during authoring on September 10, 2026. Parser success is production-format verification, not recorded audio QA. The live Google Show Bible was not changed.
