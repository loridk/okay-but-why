# Accessibility — Series Guide

Status: Six finished scripts and generated HTML companions. Audio generation, listening QA, and publication are separate stages.

## Episodes and continuity

1. **Accessibility - Episode 1 - Who Is This Actually For?** Different ways of perceiving and operating one checkout; overlapping barriers; assistive technology; permanent, temporary, and situational limitations without equating experiences; WCAG, POUR, levels, and conformance versus usability. Establishes the recurring question: What does the browser know right now?
2. **Accessibility - Episode 2 - HTML Was Already Doing This** DOM-to-accessibility-tree mental model; native semantics and behavior; links/buttons, headings, lists, landmarks, labels, groups, and tables. Visually identical interfaces can expose different information. Native delivery choices connect meaning to interaction.
3. **Accessibility - Episode 3 - Throw Away Your Mouse** Keyboard patterns, focus versus its indicator and order, tabindex, skip links, dialogs, dynamic changes, SPA navigation, and composite-widget responsibilities. A worked validation flow follows focus through errors, success, nested popups, and history navigation.
4. **Accessibility - Episode 4 - ARIA: What Is This Shit Actually For?** Native-first decisions; roles, states, properties, names, descriptions, relationships, live regions, and hiding. A synchronized disclosure and decision clinic distinguish semantic claims from behavior. Companion includes the practical ARIA decision guide and quick reference.
5. **Accessibility - Episode 5 - Your Design Is Lying to You** Contrast, color-independent meaning, zoom, reflow, text spacing, reduced motion, target size, persistent labels, useful errors, and cognitive load. A four-state checkout review tests design assumptions. Precise selected WCAG reference values live in the companion.
6. **Accessibility - Episode 6 - Your Lighthouse Score Is Not an Accessibility Audit** Lighthouse, axe/axe-core, WAVE, browser inspectors, static tooling, interaction tests, keyboard/focus, zoom, screen-reader testing, and human judgment. Sabrina joins only the tooling discussion. Companion includes a developer testing checklist and issue-report template. Ends with accessibility throughout development rather than an unplanned next-series promise.

## Established decisions

- Parisa already knows and practices accessibility and semantic HTML; Jules is a competent peer. Neither is an all-knowing lecturer.
- Nervous Robot Pizza Delivery remains fictional. Nervous Robot uses they/them pronouns. No new host biography or disability is asserted.
- Thesis: the web platform contains accessibility machinery our choices can preserve, improve, or break. Semantics, behavior, visual design, and task success must agree.
- Supporting callback: the JavaScript Testing series' question, “One hundred percent of what?”
- No exhaustive WCAG course, legal/compliance advice, document/native-mobile accessibility, or formal audit methodology.
- Reference notes use the existing companion-notes.html input; generated companions use episodes/styles.css and existing series/global navigation. Audio players use accessibility-NN.wav as the future recording path.

## Focused verification — 2026-09-17

| Episode | Spoken words | Spoken dialogue lines | Estimated speech at 120–140 wpm |
| --- | ---: | ---: | --- |
| 1 | 3,476 | 161 | 24.8–29.0 minutes |
| 2 | 3,374 | 159 | 24.1–28.1 minutes |
| 3 | 3,393 | 147 | 24.2–28.3 minutes |
| 4 | 3,477 | 160 | 24.8–29.0 minutes |
| 5 | 3,394 | 152 | 24.2–28.3 minutes |
| 6 | 3,505 | 163 | 25.0–29.2 minutes |

Total: 20,619 spoken words. Estimates exclude music and conversational pauses; recorded duration is not yet established.

- All six generate-gemini.js accessibility NN --check runs passed. No API/audio generation was invoked.
- Six scripts, six companion-note sources, six generated companions, and the series index exist. Global index includes Accessibility as the twelfth series.
- Each companion has one h1, one visible WAV player, the shared stylesheet, opening dialogue first, complete matching dialogue, valid local navigation/anchors, unique IDs, and its reference notes. No inline style blocks or Cold Open navigation.
- Both inline JavaScript teaching cards parsed successfully. This is syntax validation, not a claim of browser or screen-reader execution.
- Episode 4 guide and Episode 6 checklist are present in generated output.
- Existing unrelated checkout changes were retained. The only builder edit for this series adds accessibility to the existing future-WAV-player list; build-indexes.js was used with the accessibility filter.
- No live-site audit, screen-reader test, conformance assessment, recording, or publication is claimed.
