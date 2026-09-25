# JavaScript Testing — Okay, But Why?

Status: Complete dialogue scripts and generated listening companions. Audio not generated or timed.

## Start here

Each numbered folder contains `master-script.md` and the generated `companion.html`. Open [the series index](index.html) for all ten listening companions. Pages use the existing `../../styles.css`, transcript sections, keyboard-accessible code cards, skip link, and expected future `javascript-testing-NN.wav` player.

This is the complete ten-episode JavaScript Testing series requested from “Nextjs Series Proposal.” It is a separate series; no Next.js scripts or application are implied. Parisa and Jules remain peers throughout. Sabrina was not needed for these conversations.

Scripts follow the existing Web Architecture metadata/heading convention and existing Modern JavaScript/Cybersecurity speaker and cue conventions. Every spoken turn starts with `PARISA:` or `JULES:`. Code cards supplement explanations that work without the screen. Production notes and references are unspoken and omitted from the generated listener transcript by the established builder.

## Episode guide and continuity log

| Episode | Question and concepts established | Carry forward |
| --- | --- | --- |
| [01 — Why Are We Testing Code That Already Works?](01/master-script.md) | Repeatable examples, regressions, independent expectations, refactoring confidence, manual exploration, meaningful failures | A memory we can run; fictional delivery-fee rule; tests make bounded claims |
| [02 — Unit Tests — How Tiny Is Tiny?](02/master-script.md) | Behavioral boundaries, pure functions, runtime guards, representative inputs, equality, mutation, legacy seams | Whole cents, explicit contract, TypeScript is not runtime validation |
| [03 — Arrange, Act, Assert — The Testing Sandwich](03/master-script.md) | Clear setup/action/outcome, names, fixtures, hooks, table-driven tests, independent state | One coherent behavior may need several observations; decisive facts stay visible |
| [04 — Jest, Vitest, and Who Actually Runs This Stuff?](04/master-script.md) | Runner/assertion/environment/transform distinctions, npm scripts, discovery, watch vs run, CI, Node runner | Explicit API imports; isolated practice setup; existing project conventions take priority |
| [05 — Mocks, Stubs, Spies, and Other Lies We Tell Our Code](05/master-script.md) | Controlled dependencies, injection, interaction contracts, cleanup, module mocking limits, contract drift | The subject remains real; a spy may call through; local call count is not distributed exactly-once delivery |
| [06 — Testing the DOM Without a Browser — Mostly](06/master-script.md) | jsdom, DOM Testing Library, role/name/label queries, user-event, keyboard/focus, query timing | Native button; textContent; simulated DOM cannot establish layout or real screen-reader experience |
| [07 — React Testing — Stop Interrogating the Furniture](07/master-script.md) | Real state/rendering, props, controlled components, effects, cleanup, providers, snapshots | Explicit JavaScript vs JSX vs React vs testing/tooling syntax; public behavior over hook implementation |
| [08 — Async Tests — The Test Finished Before the Bug Arrived](08/master-script.md) | Promise completion, rejections, HTTP errors, payload checks, deferred responses, races, timers, debounce | Await the actual finish line; no arbitrary sleeps; timeout is not proof of rollback |
| [09 — Unit, Integration, End-to-End — Which Wires Are Connected?](09/master-script.md) | Scope vs environment, API/database boundaries, isolated data, browser journeys, risk-based strategy | State what runs for real and what is replaced; Playwright card is a hypothetical fixture application |
| [10 — One Hundred Percent of What?](10/master-script.md) | Coverage denominator/metrics, assertion strength, mutation/property-based testing, reporting and limits | Green means a specific claim; no unapproved future series promise |

## Example contracts

- Episodes 1–3: fictional delivery fee is 300 cents below a 2000-cent subtotal and 0 at or above it. Episode 2 adds runtime validation for nonnegative safe-integer cents. Tax, discounts, currencies, and real business limits are explicitly separate requirements. Episode 10's `>` version is intentionally wrong to demonstrate a missing boundary check.
- Episode 5: `requestReceipt` is synchronous and returns whether it invoked the supplied sender. It does not claim successful email delivery. All data is synthetic.
- Episode 6: `mountCart` demonstrates one add action, semantic markup, text updates, and keyboard activation; it is not a complete quantity calculator.
- Episode 7: `CartCounter` uses real React state but has no persistence, server pricing, or payment behavior.
- Episode 8: `loadMenu` uses an injected HTTP-like request, validates only the documented small payload shape, and returns item names. The timer card demonstrates tooling mechanics rather than a complete debounce implementation.
- Episode 9: Playwright journey requires a separate isolated fixture app, baseURL, seeded menu, and order backend. It was not run against the podcast repository. It uses pickup, separate from the delivery-fee example.

## Practice setup and syntax

Plain JavaScript examples use ESM imports/exports. Most test cards use Vitest APIs; Episode 4 compares Node's built-in test APIs, and Episode 9 identifies Playwright APIs. React code cards use JSX and require an existing compatible React transform. DOM/React exercises identify their extra dependencies in production notes; they are not installed in this podcast project.

Commands and configuration snippets are explained examples for a separate practice project. Merge into existing configuration intentionally. Check the installed tool version's documentation before installation or migration.

## Production and verification

See [validation-report.md](validation-report.md) for measured dialogue counts, transparent pacing estimates, parser results, companion checks, and the limits of code-example verification. No recorded runtime, generated audio, or live-service test is claimed.

From the podcast root, regenerate a companion with `node build-companion.js javascript-testing 01`, check audio-parser readiness with `node generate-gemini.js javascript-testing 01 --check`, and regenerate navigation with `node build-indexes.js`.

The local guide records this series' continuity. The live Google Show Bible was not edited in this task.
