# Modern CMS Development — validation report

Verified September 17, 2026.

All ten approved titles and episode folders are present. The ten no-audio parser checks passed. No audio was generated.

| Episode | Spoken words | Dialogue turns | Code/terminal cards | Source links |
| --- | ---: | ---: | ---: | ---: |
| 01 | 2033 | 85 | 2 | 2 |
| 02 | 2130 | 89 | 2 | 6 |
| 03 | 1951 | 85 | 2 | 4 |
| 04 | 1943 | 86 | 2 | 4 |
| 05 | 1929 | 79 | 3 | 6 |
| 06 | 1995 | 77 | 8 | 7 |
| 07 | 1751 | 70 | 9 | 6 |
| 08 | 1810 | 74 | 4 | 6 |
| 09 | 1902 | 78 | 3 | 6 |
| 10 | 2088 | 87 | 1 | 7 |

**Total spoken words: 19,532.** Counts exclude speaker labels, code cards, and companion notes.

Timing: these are concise, topic-complete scripts. At 130–160 spoken words per minute, the individual scripts estimate roughly 11–17 minutes before music and pauses. They are not verified 30-minute recordings; no audio timing was measured.

## Checks

- Exact approved titles and ordering.
- One h1, one main, and one expected future-audio player per companion.
- Shared stylesheet links resolve; no inline styles or new CSS system.
- Unique IDs and working internal navigation.
- All dialogue and code cards preserved exactly and in order.
- Companion terminology, review prompts, and clickable sources present.
- Existing scripts, companions, other series indexes, and shared styles preserved byte-for-byte.
- Global index change adds only the new series card relative to the start-of-task snapshot.
- PHP and JavaScript examples syntax-checked; YAML parsing passed.

## Limits

No Drupal or WordPress instance was installed or exercised. Syntax checks do not establish framework integration, deployment success, or accessibility of the illustrative application examples. The examples identify their prerequisites and limitations. Current-source checks support the version-sensitive claims; sources are linked per companion.

## Syntax results

- 02 card 1: php syntax passed
- 02 card 2: php syntax passed
- 05 card 2: php syntax passed
- 06 card 1: YAML parsed
- 06 card 4: YAML parsed
- 06 card 7: javascript syntax passed
- 07 card 2: YAML parsed
- 07 card 3: YAML parsed
- 07 card 4: YAML parsed
- 07 card 5: php syntax passed
- 07 card 6: php syntax passed
- 07 card 8: php syntax passed
- 07 card 9: php syntax passed
- 08 card 3: php syntax passed
- 09 card 1: javascript syntax passed
- 09 card 2: YAML parsed

## Issues

None in the automated structural, preservation, transcript, link, and available syntax checks.

## Visual check

Episode 6 was inspected in the browser at desktop and 390-pixel viewport widths. The shared styling, transcript, and reference table displayed correctly, with no page-wide horizontal overflow at the narrow size. This is a representative layout check, not a claim of a complete accessibility audit.
