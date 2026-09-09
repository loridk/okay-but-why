# Web Architecture — Okay, But Why?

Status: Finished scripts; audio not generated or timed.

Series position: after React & Modern Front-End Frameworks; immediately before the separate Cybersecurity series.

## Start here

Every numbered folder contains `master-script.md` and its generated `companion.html`. The companion preserves the spoken transcript and visual cards. The audio player points to the expected future `web-architecture-NN.wav`; audio files are intentionally absent.

These are complete dialogue scripts, not outlines or prompts for improvisation. Production notes and references are not spoken. Code cards supplement spoken explanations; listeners do not need to see them.

The scripts target an approximately half-hour conversation. `validation-report.md` records spoken-word counts and transparent estimated ranges. Actual runtime depends on performance, pauses, music, and TTS delivery; no recorded runtime is claimed.

## Episode guide and continuity log

| Episode | Main question and concepts established | Carry forward |
| --- | --- | --- |
| [01 — What Even Is Web Architecture?](01/master-script.md) | Responsibilities, boundaries, request paths, ownership, infrastructure versus code organization, operational constraints | Introduces fictional Nervous Robot Pizza Delivery; purple arrow and diagram weather; simple baseline is conditional, not universal |
| [02 — Client vs Server](02/master-script.md) | Execution environment, trust, authority, client/server validation, shared cart conflicts, deployment compatibility | Browser estimates; server validates and accepts. JavaScript async/await/const, Fetch API, and TypeScript checking explicitly separated |
| [03 — Request/Response Cycle](03/master-script.md) | URL, DNS, transport, TLS, HTTP methods/status/headers/body, cookies, redirects, diagnostics, uncertain outcomes | One task can span many requests; HTTP/3 differs from TCP-based HTTP; timeout does not mean rollback |
| [04 — Static Sites/Server Rendering/Old Web](04/master-script.md) | Prepared files, build time, request time, templates, forms, progressive enhancement, editorial workflow | Native HTML has behavior; static delivery can be part of a dynamic system; PHP experience remains valuable |
| [05 — How We Got SPAs](05/master-script.md) | AJAX history, client routing, URL/UI/server state, request races, accessibility, long-lived clients, optimistic updates | Sabrina helps define dispatch-board needs; React is not synonymous with SPA; offline acceptance is a separate promise |
| [06 — APIs](06/master-script.md) | Contracts, resources, operations, REST boundaries, errors, compatibility, pagination, CORS, GraphQL/RPC/webhooks overview, idempotency | API schema is not full semantics; TypeScript is not runtime validation; CORS is not authorization |
| [07 — Authentication/Sessions/Cookies/Tokens](07/master-script.md) | Authentication versus authorization, session lifecycle, opaque/signed tokens, JWT limits, cookies, CSRF, OIDC, guest capabilities, roles | Recognition is not permission; token format and transport are distinct; dedicated Cybersecurity series remains next |
| [08 — Databases and Application State](08/master-script.md) | State lifetime, relational/document/key-value choices, transactions, constraints, races, optimistic concurrency, state machines, indexes, migrations, restore | Accepted historical price differs from current catalog price; database transaction does not include an external provider |
| [09 — Monoliths](09/master-script.md) | Deployable unit, modular boundaries, coupling/cohesion, data ownership, incremental refactoring, workers, replicas, extraction criteria | Monolith can remain a valid final architecture; no compulsory progression to services |
| [10 — Microservices](10/master-script.md) | Independence, service/data boundaries, commands/events, queues, outbox, saga, duplicates, observability, retries, orchestration/choreography, migration | Sabrina runs failure cards; exactly-once claims require scope; network boundaries have ongoing costs |
| [11 — Caching/CDNs](11/master-script.md) | Copies, keys, freshness, validation, HTTP directives, ETags, immutable assets, privacy, invalidation, stampedes, cold-cache behavior | Cache-Control examples are separate policies; no-cache permits storage with validation; no-store is not retroactive deletion |
| [12 — Scaling](12/master-script.md) | Workload measurement, vertical/horizontal capacity, shared state, database limits, queues/backpressure, autoscaling, availability, cost, load testing | Thought-experiment numbers are not benchmarks; scaling does not imply microservices; kitchen capacity remains real |
| [13 — SSR/CSR/SSG/Hydration](13/master-script.md) | Timing/location of rendering, matching initial HTML, native interaction, streaming, islands, Server Components, privacy, hybrid freshness | Sabrina helps compare pages; JavaScript/JSX/React/DOM/tooling explicitly labeled; no version-specific framework recipe |
| [14 — Build an Architecture in Your Head](14/master-script.md) | Requirements-to-design synthesis, trust/data/failure review, payment flow, growth triggers, catering exercise, recovery, documentation | Cybersecurity is immediately next; containers/infrastructure are not teased as the next series |

## Established example and character continuity

- Nervous Robot uses they/them. Pizza Delivery is a fictional teaching system, not a claim about an existing product or deployment.
- Initial constraints: one neighborhood shop, small team, modest needs. Growth scenarios are hypothetical exercises, not facts about a real business.
- Parisa and Jules are peers. Parisa leads with traditional-web, data, accessibility, and maintenance experience; Jules contributes modern tooling and client-application context. Neither is the designated incompetent person.
- Sabrina appears only in Episodes 05, 10, and 13. She contributes requirements, failure reasoning, and rendering distinctions. No new specialist guest or personal career history is invented.
- Core recurring situations: browser-edited price, lost confirmation, duplicate order/payment risk, last available capacity, stale staff view, failed email, shared private cache, and a slow dependency.
- Visual jokes: diagram weather, purple arrow, database-shaped calzone. These are new script continuity, not retroactive claims about prior episodes.

## Technical and editorial boundaries

Start with the simplest architecture that solves the actual problem. Correctness, accessibility, security, durability, and recovery are part of that problem; omitting them is not simplicity.

API implementation, custom authentication, cryptography, provider-specific payment recipes, production infrastructure configuration, and a dedicated cybersecurity curriculum are deliberately deferred. The scripts explain relevant decisions without pretending to supply complete implementation recipes.

Current primary references are included at each relevant script's end. Framework-specific behavior must be checked against the chosen framework/version when implementing. Examples are illustrative, and the dialogue states material limitations.

## Continuity source

The uploaded `.gdoc` was a pointer, not the Bible's text. The live [Okay, But Why? — Show Bible](https://docs.google.com/document/d/17Z5o2adWsBfzvFXfaIZ7xVh-Osfr2yioxgvAGSCsydY) was read through the connected Google Drive tool on 2026-09-06. It still treated much of the later-series knowledge as planned, so existing TypeScript, Node/npm, Modern CSS, and React/framework scripts supplied additional structural continuity.

This local guide records this series' continuity additions. The synced source pointer and live Google Doc were not edited.

## No-audio verification

From the podcast repository:

~~~powershell
1..14 | ForEach-Object {
  node generate-gemini.js web-architecture ('{0:D2}' -f $_) --check
}
~~~

Expected: fourteen successful script checks. This proves parsing/chunking only, not a recorded runtime or listening quality. Companion generation uses the existing shared builder and stylesheet.
