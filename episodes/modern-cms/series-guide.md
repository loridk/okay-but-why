# Modern CMS Development

Finished ten-episode series for **Okay, But Why?**, produced September 2026.

Start with [the series index](index.html). Each numbered folder contains:

- `master-script.md`: the complete audio-first dialogue and embedded visual code cards.
- `companion.html`: the generated listening companion, using the existing shared stylesheet.
- `companion-notes.html`: companion-only terminology, example mapping, practical prompts, and source links, included by the companion builder.

## Production and continuity

The approved ten-episode order and titles are unchanged. Parisa and Jules remain peers; Sabrina joins Episodes 6 and 9 for components and frontend/API tradeoffs. No new guest or personal cast lore is introduced.

Bellweather University, Moss After Dark, and the Greenhouse are fictional examples introduced here. Person, Department, Program, Course, Event, News Article, and Location carry the model across the series. Course means a catalog record, not student enrollment or a scheduled class section. “Translate the Drupal” connects specialized terms to programming and database concepts.

The central progression is CMS purpose → WordPress architecture → Drupal entities → content modeling → queries/rendering/caching → frontend/SDC → module extension → configuration/deployment → APIs/decoupling → architectural choice. Modern concepts are explained where they arise, with existing procedural code and documented exceptions retained in the picture.

Version-sensitive research was checked September 16, 2026. Sources are linked in each companion. The separate [API series](../apis/index.html) is linked from Episode 9; its publication/recording status is not assumed.

## Regeneration

From the actual podcast repository, run the existing commands, substituting episode numbers 01 through 10:

```sh
node build-companion.js modern-cms 01
node generate-gemini.js modern-cms 01 --check
node build-indexes.js modern-cms
```

The optional companion-notes source is appended by the companion builder and excluded from audio extraction. Keep the `companion-reference` heading ID when editing it so its navigation link continues to work. Existing code-card captions use numbering; the companion-only file/example guide maps those numbers to source files and example scopes.

No audio was generated. The player points to each expected `modern-cms-NN.wav`; the series index marks audio pending. No Drupal or WordPress installation was created. Examples identify prerequisites and were syntax-checked where supported, not framework-integration tested.

See [validation-report.md](validation-report.md) for exact word counts, checks, and timing limitations. These concise scripts do not claim a verified 30-minute runtime.
