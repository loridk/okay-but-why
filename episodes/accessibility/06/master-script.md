# Episode 6: Your Lighthouse Score Is Not an Accessibility Audit

**Series:** Accessibility
**Runtime:** Target approximately 30 minutes; final timing depends on the recorded performance.
**Hosts:** Parisa, Jules; Sabrina joins for the tooling discussion.

[INTRO MUSIC]

JULES: Good news. Our checkout got one hundred.

PARISA: One hundred what?

JULES: Accessibility. Lighthouse. Big green number.

PARISA: Can you close the address dialog with the keyboard?

JULES: Not in this deliberately broken teaching example.

PARISA: Can you read the error message at four hundred percent zoom?

JULES: Also no.

PARISA: Then congratulations on one hundred of whatever we actually measured.

JULES: That sounded suspiciously like our testing-series finale.

PARISA: It has returned with a browser extension and a clipboard.

[STING]

## A Result Needs a Scope

JULES: Welcome to Okay, But Why? We've spent five episodes connecting people, browser semantics, interaction, ARIA, and visual design. Today we ask what testing tools can establish and where human evaluation still matters.

PARISA: Not a tool-shaming episode. I like tools. I would prefer software catches an empty button name before a customer has to report it.

JULES: The problem is interpreting a useful automated result as a much larger claim. Lighthouse's accessibility score summarizes its scored automated accessibility checks. It doesn't include every accessibility requirement or every possible state of the application.

PARISA: And a score of one hundred isn't a percentage of disabled people who can use the site. Or a percentage of WCAG we've fulfilled. Or a certificate that the checkout works.

JULES: Manual checks aren't included in that score. A result can be valuable within its scope and incomplete for the real task.

PARISA: Like a smoke alarm. A quiet alarm is welcome. It doesn't certify that the stairs lead somewhere.

JULES: Our opening checkout is a fictional example, not a report of a measured live site. We're illustrating bugs that a clean automated run can leave undiscovered.

PARISA: Which brings us to the question from the testing series: one hundred percent of what?

## What the Machine Can Ask

JULES: Automated tools can inspect many properties of a rendered page. Depending on the engine and configuration, they can detect missing names, invalid ARIA values, some relationship problems, and many contrast failures.

PARISA: Those are real defects. I don't want the limitations discussion to become an excuse to ignore an automated report.

JULES: Exactly. But a rule has to be something the software can determine from the information it has. It can ask whether a control has a name more reliably than whether that name makes sense to a person doing this task.

PARISA: An icon-only Remove button named “Button seven” has acquired a string without acquiring usefulness.

JULES: Some tools catch certain suspicious text patterns, but meaningful quality remains contextual. The same applies to alternative text.

PARISA: If a product image has alternative text “image,” we technically supplied text and practically shrugged. If it's decorative and repeats nearby information, empty alternative text may be appropriate. The right answer depends on the image's purpose here.

JULES: A chart may need a fuller explanation or data alternative. An image used as a link needs a name that communicates the link's purpose. An attribute-presence check can't settle all that.

PARISA: And an automatically generated description can accurately say “a pizza on a table” while missing the important information: this image distinguishes the gluten-free option. Context decides usefulness.

JULES: Automation can also flag structural issues around headings, but it can't reliably tell whether the hierarchy expresses the content clearly.

PARISA: Three technically valid headings called “Stuff,” “More stuff,” and “Final stuff” are not an information architecture triumph.

## Lighthouse Is One Useful View

JULES: Lighthouse is useful for a quick automated snapshot and for repeatable checks in development workflows. Its accessibility category draws on automated rules, including axe-based checks.

PARISA: Which means running Lighthouse and another axe-based tool doesn't necessarily give us two completely independent sets of evidence.

JULES: Right. Different products can expose different subsets, settings, and reporting, but shared engines mean overlap. We shouldn't add their scores together like scientific confidence points.

PARISA: And the page state matters. If the address dialog is closed when we scan, we haven't necessarily evaluated its open state, its fields, or what happens after validation.

JULES: Authentication, viewport, loaded content, and tool configuration also affect scope. Save enough context to know what you tested.

PARISA: “Checkout, signed-in test account, dialog open, error state, browser version” tells a colleague something reproducible. “Website got green” tells them your screen had a color.

JULES: The report may list items requiring manual review. Those aren't decorative caveats below the number. They're work the score doesn't perform for you.

PARISA: Use the report to find defects and guide investigation. Don't turn it into a trophy that discourages further questions.

## axe-core Is an Engine, Not a Human Evaluator

JULES: Let's bring Sabrina in for tooling. She's been looking at how these checks fit into normal development.

SABRINA: Hello. I have arrived with a pull request, which is how interns materialize now.

PARISA: Does it contain a giant screenshot of a green number?

SABRINA: No. It contains reproducible checks, because I suspected you'd ask what the number meant.

JULES: Start with axe versus axe-core.

SABRINA: Axe-core is the open-source automated accessibility testing engine. It can be integrated into browser testing and development tools. Products such as axe DevTools provide interfaces around accessibility testing, but the engine is useful beyond clicking an extension after launch.

PARISA: So it can participate in tests for the actual component states we build.

SABRINA: Yes. Open the dialog, wait for the relevant content to render, run a scan. Trigger validation, then scan that state. You can catch recurring machine-detectable problems before a change ships.

JULES: Does passing the scan prove the dialog's keyboard behavior?

SABRINA: No. We need interaction assertions and manual checks too. The scan can inspect certain properties of the open dialog, but it doesn't replace walking the workflow.

PARISA: Same engine, several useful entry points. None of them secretly becomes an experienced screen-reader user because it runs in continuous integration.

SABRINA: Also read the result categories. Something marked incomplete or requiring review isn't a clean pass. The engine may need a human to determine the outcome.

JULES: And don't casually suppress a rule to get a green build.

SABRINA: If we need an exception, document the specific reason and scope. Otherwise we can make the report cleaner while leaving the interface worse.

## Source Checks Catch a Different Moment

PARISA: Where do linters fit?

SABRINA: Earlier. A linter analyzes source patterns. For example, JSX accessibility lint rules can catch some missing attributes or suspicious interaction patterns while we edit or in a build check.

JULES: JSX is the markup-like syntax used with React and other tooling. The lint rule is tooling inspecting it; this isn't TypeScript secretly checking the human experience.

SABRINA: Exactly. A custom component might require configuration so the linter understands which native element it represents. Otherwise a component named AccessibleButton could render almost anything.

PARISA: A suspiciously confident name, given Episode 2.

SABRINA: Static checking can't generally know every runtime label, conditional branch, fetched value, CSS effect, or interaction outcome. Framework warnings can help, but the rendered page still matters.

JULES: So we get layers: source checks, rendered-page scans, interaction tests, and human evaluation.

PARISA: Not four competing religions. Different observations of the same product.

SABRINA: My useful default is small and repeatable: check the components and important states we're changing. Expand coverage based on the actual journeys and risks. Don't install six overlapping products because the settings page looks reassuring.

PARISA: You may keep the pull request.

SABRINA: Excellent. I'm returning to the place where the build tells me which line I broke.

## WAVE Makes Structure Visible

JULES: WAVE is another useful approach. It annotates a page with accessibility information, errors, alerts, and structural details.

PARISA: Which can help me connect a finding to the interface, rather than reading an abstract list of selectors and wondering which rectangle has offended it.

JULES: It also supports human review of things like alternative text and headings. An alert means investigate the context, not necessarily that the element is definitively wrong.

PARISA: So neither “everything marked is broken” nor “only red errors matter” is a good interpretation.

JULES: Right. Learn what the tool's categories mean. Use them to examine the page rather than treating the icon count as an accessibility score.

PARISA: If I'm testing private or authenticated pages, I also need to understand where the tool runs and what data it sends. Tool selection includes privacy, not just rule coverage.

JULES: WAVE offers browser extensions as well as its web service. Choose the method that fits your content and organizational rules, and check the current tool documentation.

PARISA: We're not uploading customer checkout data to a public service as a side quest in accessibility.

## Ask the Browser What It Knows

JULES: Browser accessibility inspectors bring us directly back to Episode 2. Select an element and inspect its computed accessibility information.

PARISA: Role, name, state, description, and relationships where the browser exposes them. Also whether the element is included or ignored in the accessibility tree.

JULES: For our delivery disclosure, inspect the button before and after activation. Does expanded change with the panel? Does the name stay useful? Does its controls reference point to the correct panel?

PARISA: If the name is wrong, inspect the source the browser used. A forgotten aria-label might be overriding perfectly good visible text. Fixing the actual cause is better than attaching another attribute on top.

JULES: Browser panels differ, so the companion links documentation rather than promising a menu item will live in exactly one place forever.

PARISA: And the inspector isn't a recording of everything a screen reader will say. It's evidence about the browser's exposed information.

JULES: Exactly. If the tree is wrong, investigate the markup and browser interpretation. If the tree looks right but the experience is wrong, consider interaction, announcement timing, and the particular assistive-technology combination.

PARISA: This is an excellent debugging boundary. I can stop treating “accessibility bug” as one giant category of ghosts.

## Put Away the Mouse and Complete the Task

JULES: Now the manual pass. Start with an actual task: review the order, edit the delivery address, recover from a validation error, and submit a simulated order.

PARISA: Use safe test data and a test payment path. Accessibility testing does not require accidentally ordering forty pizzas.

JULES: Run the automated checks in relevant states first, then navigate with the keyboard. Reach every essential action, use the expected keys, and verify the result.

PARISA: Check visible focus and order. Open the dialog, move forward and backward, close it, and find where focus returns. Check error recovery. Don't stop after proving Tab reaches the first button.

JULES: A button might be focusable but fail to activate. A dialog might open but trap you without an exit. A menu might respond to one arrow key and break when options change.

PARISA: Or a native button might fire twice because somebody added a key handler beside click. The semantics can look wonderful while the order submits twice.

JULES: The actual application outcome belongs in the test. “Received a click” is weaker than “performed the expected action once and communicated its result.”

PARISA: We don't need to automate every manual observation immediately. First understand the failure. Then add a regression check at a useful level if it can reliably protect the behavior.

## Enlarge, Reflow, and Change the Conditions

JULES: Next, zoom and text resizing. Does the journey still work when content grows and the effective viewport narrows?

PARISA: Last episode's vanished Place order button is a perfect target. We check labels, help, errors, action buttons, dialogs, and sticky content. We don't merely inspect the header at a different size.

JULES: Check text contrast and essential non-text cues, including alternate themes and states. Automated contrast checks can be limited by complex backgrounds and other rendering details, so investigate what wasn't evaluated.

PARISA: Check whether color carries exclusive meaning. A tool may measure the red text perfectly while missing that red is the only clue something failed.

JULES: Try reduced-motion settings for the relevant interactions, and check touch target size and spacing on touch interfaces.

PARISA: We don't need an infinite matrix before making a useful finding. We need deliberate representative conditions, clear scope, and follow-up when evidence points to a gap.

JULES: And repeat after meaningful changes. A global typography change can break layouts without altering a single accessibility attribute.

PARISA: Which is why “the component was accessible when we bought it” isn't a lifetime warranty.

## A Screen Reader Is a Tool to Learn

JULES: Then try a screen reader. The goal isn't to turn yourself into an expert in five minutes. It's to inspect an important dimension of the actual experience.

PARISA: Pick a supported browser and screen-reader combination, learn its basic commands, and use it on a familiar, well-structured page first. Otherwise you can mistake your unfamiliarity with the tool for a bug in every site.

JULES: On Windows, NVDA is a common starting option; VoiceOver is built into Apple platforms. Those are examples, not a promise that testing one combination covers every user.

PARISA: Learn how to start and stop speech, navigate headings, move through controls, and switch between reading content and interacting with form fields. The exact keys depend on the screen reader and configuration.

JULES: Screen-reader browsing often uses navigation commands beyond Tab. Tabbing only through controls won't tell you whether headings, paragraphs, and order information are readable and organized.

PARISA: Nor should we demand an exact spoken sentence from every combination. A useful test expectation can be that the correct name, role, and state are available and the action is understandable.

JULES: Follow the task. Can you find the order summary? Distinguish similarly named controls? Understand the required field? Discover the error? Hear or otherwise access the successful result?

PARISA: And distinguish missing information from announcements you interrupted yourself. If you move focus immediately after an update, you may have changed what gets spoken. Reproduce carefully.

JULES: Document the browser, screen-reader version, relevant mode, and steps when reporting a failure. That gives another person a chance to reproduce it.

PARISA: Developer testing complements testing with experienced users. It doesn't replace their expertise or make one developer's success proof of universal usability.

## A Worked Failure with More Than One Cause

JULES: Let's walk one example through the layers. The address dialog has a Close button and passes an automated name check, but the customer can't finish editing.

PARISA: First question: what exactly happened?

JULES: Keyboard focus went behind the dialog after the last field. Escape did nothing. Clicking the visible cross worked.

PARISA: That's an interaction failure. Inspecting the tree might show role dialog and a good name, but those semantics didn't implement modality or an exit.

JULES: We correct the dialog behavior and add an interaction regression check for focus containment and closing. Then test it manually again.

PARISA: Now the screen-reader pass reveals that the postal-code field's description still contains yesterday's error even after correction.

JULES: Different failure: stale state or a stale relationship. Update the error lifecycle so the current field state and description agree.

PARISA: Then zoom reveals the Close button is clipped. Different layer again. We fix the layout and check the full enlarged dialog.

JULES: None of those fixes makes the automated engine useless. It can still protect useful properties. But the collection of evidence becomes stronger when each check makes a specific claim.

PARISA: We didn't run the same scan nine times and expect the tenth to become a human.

## Make the Report Useful to the Next Person

JULES: A good issue report should identify the affected task and the barrier, not only quote a rule identifier.

PARISA: “After opening Edit address, Tab moves into the page behind the modal, so a keyboard user loses the active context.” That's a problem someone can reason about.

JULES: Include expected behavior, actual behavior, steps, environment, and relevant evidence. Link the component or criterion when helpful.

PARISA: If the automated report catches it, attach the finding. If it doesn't, say which manual observation established it. We don't need a machine's permission to report a real barrier.

JULES: Prioritize by impact and reach, including whether the problem blocks an essential task and whether a shared component spreads it across the site.

PARISA: A focus bug in the only payment path is not automatically less important than a pile of low-impact findings just because there are fewer screenshots of it.

JULES: After fixing it, verify the original reproduction and the relevant neighboring states. The regression test should protect the behavior, not merely assert the exact markup you just wrote.

PARISA: That last sentence also survived our testing series. We are getting excellent mileage from understanding what a test claims.

## Accessibility During Development

JULES: Where should all this fit in a normal team's workflow?

PARISA: At the decisions. Design reviews consider labels, order, error states, motion, and enlargement. Implementation starts with semantic HTML and appropriate interaction. Tests grow around real behavior.

JULES: Automated scans and linting catch repeatable issues early. Manual checks cover the changed journey. Broader evaluation and user involvement help address what the narrower checks don't establish.

PARISA: It's not build everything, run Lighthouse Friday afternoon, panic, and ask someone to sprinkle ARIA on the wreckage.

JULES: A shared component fix can prevent the same problem across many pages. But page composition and content remain important, so component testing doesn't replace journey testing.

PARISA: For existing problems, keep a concrete backlog with ownership. A baseline can help teams avoid new failures while fixing old ones, but it shouldn't become an invisible closet where all known barriers live forever.

JULES: And keep reports honest. Say which pages, states, tools, and manual checks were covered. Say what remains untested.

PARISA: That's not pessimism. It's useful engineering evidence.

## What Would We Put in the Pull Request?

JULES: Let's make our development workflow concrete. We've changed the delivery disclosure and address dialog. What evidence would we put in the pull request?

PARISA: First, state the behavior that changed. The delivery button opens details and reports the current expanded state. The address dialog keeps a usable focus path through validation and returns the user to the checkout when closed.

JULES: Then list the meaningful checks, without pretending we tested the whole site.

PARISA: Exactly. An interaction test can open the disclosure, confirm the content appears, and confirm the expanded state agrees. Close it and check both again. That's protecting observable behavior rather than merely checking that an attribute appears in the source.

JULES: For the dialog, test opening, initial focus, the relevant Tab sequence, dismissal, and return. Trigger validation so the test doesn't only cover the easiest path.

PARISA: And make sure the test environment can establish the thing you're claiming. A simulated DOM can be useful for component behavior, but it doesn't reproduce actual visual layout or every browser focus detail.

JULES: So browser tests and manual checks provide different evidence. We shouldn't claim the close button survives zoom based on a unit test that never lays out a page.

PARISA: Correct. Run the automated accessibility scan in the open dialog and error state. Record the configuration. Then manually complete the keyboard journey and inspect enlarged layout.

JULES: How much do we write?

PARISA: Enough for a reviewer to understand scope. “Checked checkout disclosure and address dialog: automated scan in open/error states; keyboard entry, validation, dismissal, and return; enlarged layout; name/state inspection.” Then note the screen-reader combination if it was actually tested.

JULES: If it wasn't tested, don't borrow credibility from a checklist item sitting nearby.

PARISA: Precisely. “Not yet checked with a screen reader” is a useful remaining task. “Accessibility verified” is an unsupported promotion.

JULES: Suppose the scan reports a pre-existing issue elsewhere in the checkout. It isn't caused by this change.

PARISA: Record and triage it. Determine whether it blocks the changed journey or release expectations. Don't silently disable the entire rule. A narrow documented exception, when justified, preserves much more information than a global suppression.

JULES: And if our regression suite takes screenshots but doesn't exercise the error state, we shouldn't assume the screenshots protect that state.

PARISA: Right. Every test has setup and assertions. The thing we didn't arrange and didn't observe is not covered just because the page appeared during the run.

JULES: This also helps avoid unnecessary duplication. We don't need three near-identical scans if they inspect the same state with the same engine and configuration.

PARISA: Spend that effort on the missing state or manual journey. More tool runs aren't automatically more distinct evidence.

JULES: What about a small text-only change to the dialog instructions?

PARISA: Scope the checks to the change. Review clarity, naming/description relationships if affected, and layout with the new text. We don't need to rerun every test in the history of the internet because one sentence changed.

JULES: But a shared focus-management change has a wider impact and needs broader checking.

PARISA: Exactly. Match validation to what can plausibly break. That's how accessibility becomes sustainable engineering work instead of a ceremony nobody has time to repeat.

JULES: And the reviewer can ask targeted questions: why this focus destination, why this name, what happens on failure?

PARISA: Which is much better than asking whether we remembered to make it accessible. We've made the claim concrete enough to inspect.

## Back to the Person Ordering Dinner

JULES: Our companion has a developer checklist covering automation, keyboard and focus, zoom, browser inspection, screen-reader use, and human judgment. It's a practical pass, not a formal audit methodology or a conformance certificate.

PARISA: The series began with one person trying to order dinner. Different input and output methods, same underlying task.

JULES: HTML gave the browser meaning. Keyboard behavior gave people a path. ARIA filled semantic gaps. Design preserved perceivable, understandable information. Testing helped us discover where the combined experience still failed.

PARISA: And the recurring question, “What does the browser know right now?” has a partner: “Can the person actually do what they came here to do?”

JULES: A tool can establish particular facts. It can't certify the whole human experience from a scan.

PARISA: That's today's “ohhh.” Accessibility tools find detectable problems. A clean report is useful evidence within its scope. It is not proof that the website is completely accessible.

JULES: We can use the platform well, test as we build, and keep learning from actual use.

PARISA: Nervous Robot's checkout is allowed to remain ordinary. In fact, ordinary buttons have had an outstanding series.

JULES: Any final words for the big green number?

PARISA: Thank you for your contribution. Please stop claiming to be the entire department.

[OUTRO MUSIC]

## Production References

- Chrome Developers, Lighthouse accessibility scoring: https://developer.chrome.com/docs/lighthouse/accessibility/scoring
- Deque, axe-core: https://github.com/dequelabs/axe-core
- WebAIM, WAVE help: https://wave.webaim.org/help
- Chrome DevTools, Accessibility reference: https://developer.chrome.com/docs/devtools/accessibility/reference
- eslint-plugin-jsx-a11y: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y
- NV Access, NVDA User Guide: https://download.nvaccess.org/documentation/userGuide.html
- W3C WAI, Evaluating Web Accessibility: https://www.w3.org/WAI/test-evaluate/
- Editorial scope: fictional checkout outcomes illustrate testing limits; no live Lighthouse score, executed axe test, screen-reader pass, or conformance claim is asserted. Sabrina appears only in the tooling segment. Finale does not promise an unplanned next series.
