# Episode 6: Testing the DOM Without a Browser — Mostly

**Series:** JavaScript Testing • Episode 6 of 10
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — The Button Is a Div

[INTRO MUSIC]

JULES: The test can't find the button.

PARISA: Is there a button?

JULES: Visually, yes.

PARISA: That answer has a trench coat on. What's the element?

JULES: A div with a click handler.

PARISA: Then perhaps the test has found a product problem while looking for a button.

JULES: Welcome to *Okay, But Why?*. Today: DOM Testing Library, jsdom, meaningful queries, and the difference between simulating an interaction and running an actual browser.

PARISA: My traditional HTML knowledge has entered the chat, carrying a native button.

## We Need to Observe the Interface

JULES: Our calculation tests can prove a fee rule for selected inputs. They don't prove the interface presents it or lets someone interact with it.

PARISA: For that, we need to create DOM content, perform an action, and inspect the result. The DOM is the document object model: the objects representing document structure that JavaScript can work with.

JULES: Exactly. DOM Testing Library provides utilities for finding and waiting for elements in that structure. It doesn't replace the runner, and it doesn't create a full browser by itself.

PARISA: So in our setup, Vitest runs the test. Jsdom supplies many browser-like document APIs inside Node. Testing Library helps us query that document. User-event simulates interactions.

JULES: And jest-dom adds useful DOM-specific matchers, despite its name also working with Vitest when configured appropriately.

PARISA: Five names, distinct jobs. Suddenly the package pile is less mysterious.

JULES: You don't need all of them for a pure function. Here the behavior actually involves a document.

## A Simulated DOM Isn't a Rendering Engine

PARISA: What can jsdom tell us?

JULES: It implements many web standards and supports working with a document in Node. It is useful for structural and interaction-oriented tests. It doesn't lay out and paint the page like a full browser.

PARISA: So a test can find a button and activate its handler, but cannot establish that the button is visible at the right position on a narrow phone screen.

JULES: Correct. Layout, real browser behavior, some APIs, and visual rendering require other evidence. Even a matcher named visible operates within the environment's available information.

PARISA: It isn't doing a human visual inspection. We should not read the English matcher name as a universal claim.

JULES: Exactly. A real-browser test can cover capabilities absent from jsdom, though it still only covers the conditions and assertions we choose.

PARISA: That makes “without a browser” a practical description of this setup, not a promise that we can replace all browser testing.

## A Small Real Widget

JULES: Let's write a plain JavaScript cart widget. No React yet. It starts empty and has an Add pizza button. Clicking updates a status message.

[CODE CARD: JavaScript and native HTML — mount-cart.js]
```javascript
export function mountCart(root) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Add pizza';

  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.textContent = 'Cart is empty';

  button.addEventListener('click', () => {
    status.textContent = '1 pizza in cart';
  });

  root.replaceChildren(button, status);
}
```

PARISA: Audio description: a native button named Add pizza, followed by a status paragraph. The click changes the status to one pizza in cart. This deliberately demonstrates a single add action, not a full cart counter.

JULES: Yes. The DOM methods are web-platform APIs used from JavaScript. The arrow function is JavaScript. The role attribute is HTML accessibility semantics, not a testing decoration.

PARISA: Native button gives us keyboard behavior without recreating it. Type button avoids accidental form submission if we later place it inside a form.

JULES: And textContent inserts text rather than interpreting it as HTML. That is a useful habit when displaying text that could eventually come from data.

PARISA: We aren't claiming this tiny widget is a complete accessible checkout. It has a meaningful control and a status region, which are relevant choices at this boundary.

## Arrange a Document, Then Use It

[CODE CARD: Vitest jsdom environment; DOM Testing Library and user-event]
```javascript
// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { mountCart } from './mount-cart.js';

afterEach(() => document.body.replaceChildren());

test('adding a pizza updates the cart status', async () => {
  const user = userEvent.setup();
  const root = document.createElement('main');
  document.body.append(root);
  mountCart(root);

  await user.click(screen.getByRole('button', { name: 'Add pizza' }));

  expect(screen.getByRole('status')).toHaveTextContent('1 pizza in cart');
});
```

JULES: The first comment is a Vitest environment directive. We still need jsdom installed in the practice project. The imports identify the libraries supplying queries, interactions, and matchers.

PARISA: Screen doesn't mean a physical screen or screenshot. It's a Testing Library query object bound to the document body. The test asks for a button with the accessible name Add pizza.

JULES: Then it simulates a click and waits for that interaction helper to finish. Finally it checks the status text.

PARISA: Async and await are JavaScript. User.click is a library API returning asynchronous work. ToHaveTextContent is from jest-dom, not a built-in Vitest matcher by default.

JULES: Exactly. AfterEach removes the test document contents. This widget has no global event listener or timer, but more complicated components need cleanup for those resources too.

PARISA: Removing DOM nodes alone doesn't cancel every external subscription someone created.

## Why Query by Role?

JULES: We could find the button by a CSS class. Why use role and name?

PARISA: Because “button named Add pizza” describes the control's meaning. A class like blue-wide-button describes styling or implementation. Refactoring CSS shouldn't necessarily break the behavioral test.

JULES: And if the accessible name disappears, the query may fail, which can reveal an actual usability problem.

PARISA: Accessible name means the name exposed for the control, derived through browser accessibility rules. Visible button text often supplies it, but labels and ARIA can affect it.

JULES: So getByRole with a name is closer to the semantic interaction we intend than a chain of nested selectors.

PARISA: Closer doesn't mean identical to using a screen reader. It doesn't test the real announcement timing, navigation mode, or every assistive-technology interaction.

JULES: Right. It encourages meaningful markup and catches some semantic regressions. It isn't an accessibility certification.

PARISA: If a role query fails, inspect the actual markup and accessible name before adding a test ID. Sometimes the test is showing us that the interface has no usable label.

## Labels Are Not Placeholders

JULES: What about a delivery-address field?

PARISA: Give it a persistent label. A placeholder can provide an example, but it shouldn't be the only way someone learns what the field means.

JULES: In a test, getByRole textbox with the label's accessible name, or getByLabelText where appropriate, can target it.

PARISA: An input with an associated label is ordinary HTML. The test query recognizes the relationship; it doesn't create it.

JULES: Exactly. If someone replaces the label with visually adjacent text that isn't programmatically associated, a meaningful query can expose the regression.

PARISA: But we shouldn't slap an aria-label on everything solely to appease a test. Use native visible labels where they suit the interface. ARIA has real meaning and can override other naming sources.

JULES: And if several controls have the same name, the query ambiguity may reflect a real design issue or a need to scope to a meaningful region.

PARISA: Two Add pizza buttons for two menu cards could be legitimate. Then identify the relevant card or give controls enough context. Don't just grab the first match and hope the DOM order stays friendly.

## Get, Query, Find

JULES: Testing Library has different query families. GetBy looks for a match now and throws if the expected single match isn't available. QueryBy can return null when absent, which is useful for checking absence. FindBy waits asynchronously for a match.

PARISA: And the single-element versions complain about multiple matches. That's helpful ambiguity, not the library being picky for sport.

JULES: Right. AllBy variants are available when multiple elements are intended. But don't use getAllBy and select index zero just to silence a query that should be specific.

PARISA: For something that should already exist, use get. For something expected not to exist, query. For something that appears after asynchronous work, await find. That's a useful starting distinction.

JULES: Exactly. We'll go deeper into waiting in Episode Eight. A find query isn't a substitute for understanding when the state should change.

PARISA: And a missing element can mean wrong scope, wrong accessible name, wrong timing, or a real rendering bug. Read the diagnostic DOM output.

JULES: Tests are easier to debug when the query expresses the thing we actually want.

## Simulating a User Is More Than Dispatching Click

PARISA: Why user-event instead of calling dispatchEvent myself?

JULES: User-event models interactions at a higher level, including related events and checks where supported. A click or typed input can involve more than one low-level event.

PARISA: So it helps avoid a test that dispatches an impossible isolated event and skips important behavior.

JULES: Yes. Low-level event utilities still have uses, particularly for cases the higher-level helper doesn't support. But choose the abstraction that matches the action.

PARISA: And await the user-event methods used here. If we don't wait for the interaction helper, assertions may race with its work.

JULES: Right. UserEvent.setup creates an interaction session. Keeping the same session for related actions can model state such as held keys.

PARISA: Yet it's still a simulation in our chosen environment. It doesn't prove a physical device or a real browser follows every path identically.

JULES: Correct. Use real-browser checks for behavior that depends on actual browser implementation, layout, or device conditions.

## A Keyboard Check With a Purpose

PARISA: Let's test keyboard access to our one-button widget. With the new document, tab once to the button, then press Enter.

[CODE CARD: Keyboard interaction with the same imports and cleanup]
```javascript
test('the add action works from the keyboard', async () => {
  const user = userEvent.setup();
  const root = document.createElement('main');
  document.body.append(root);
  mountCart(root);

  await user.tab();
  expect(screen.getByRole('button', { name: 'Add pizza' })).toHaveFocus();
  await user.keyboard('{Enter}');

  expect(screen.getByRole('status')).toHaveTextContent('1 pizza in cart');
});
```

JULES: The braces around Enter are user-event's keyboard notation inside an ordinary JavaScript string. They aren't JSX or JavaScript object syntax here.

PARISA: And the scenario assumes this isolated fixture has one focusable control. In the real page, the tab sequence is larger and needs its own appropriate checks.

JULES: This catches replacing the native button with a non-focusable click-only div in this widget. It doesn't prove the focus indicator has adequate contrast or isn't clipped.

PARISA: Nor does it prove the status is announced correctly by every screen reader. That's a separate real interaction to examine.

## Test IDs Have a Job Too

JULES: Are test IDs forbidden?

PARISA: No. Sometimes a meaningful semantic or text query isn't suitable. A stable test identifier can be an explicit contract between the interface and the test.

JULES: Better than a fragile CSS path through seven wrappers.

PARISA: Often, yes. But if a button lacks an accessible name, adding data-testid doesn't repair the button. It only gives the test another handle.

JULES: Exactly. Use the best query for the reason you're testing. A chart canvas might need a different strategy from a labelled text field.

PARISA: And don't make tests resistant to every meaningful UI change. If the label changes from “Place order” to something misleading, maybe we want a test or review to notice.

JULES: Resilience means surviving incidental changes, not ignoring product behavior.

## The DOM Can Tell a Security Story

PARISA: Suppose the server gives us an error containing text that looks like HTML. If we insert it as text, a DOM test can verify that it's displayed as text rather than creating an element.

JULES: That can protect a specific rendering decision. It doesn't replace a complete injection review or prove all output contexts are safe.

PARISA: And don't teach innerHTML with untrusted strings merely because it makes fixture setup shorter. Static trusted fixture markup is different from rendering user-controlled values.

JULES: Right. Our widget uses textContent for content. Real applications need context-appropriate safe rendering and validation at trust boundaries.

PARISA: Also don't put live secrets into document fixtures. Test output often prints the DOM on failure. That's convenient until the DOM contains something private.

JULES: Synthetic fixtures keep those reports easier to share safely.

## Listener Workshop — A Missing Error

JULES: A form rejects an invalid delivery address. The test uses getByText immediately after clicking Submit, but the error arrives after a request. It fails intermittently. First thought?

PARISA: Understand the async boundary. Await the interaction, then wait for the meaningful error state using an appropriate async query. Don't add an arbitrary two-second nap.

JULES: What should the query express?

PARISA: Ideally the actual user-facing error or relevant role and text. If the error is associated with a field, test the relationship where appropriate, not only that a red div exists.

JULES: What still needs human or real-browser evaluation?

PARISA: Whether focus behavior is useful, whether the message is understandable, whether it's announced appropriately, and whether the layout remains usable. Some of those can have automated checks too, but this one assertion doesn't cover them all.

JULES: Good. That's the point: let each test make a clear claim.

## Follow the Failed Query

JULES: Let's return to the missing button. The test asks for a button named Add pizza. It finds none. What do you inspect first?

PARISA: The rendered document. Did the widget mount? Is the content inside the document body that screen searches? Is the element actually a button, and what accessible name does it have?

JULES: Suppose it's a native button, but an aria-label says “plus.”

PARISA: Then that accessible name may override the visible Add pizza text. We need to decide whether plus is a useful name. Usually describing the action is clearer than naming the icon shape.

JULES: So the test failure can start a markup review, not just a selector rewrite.

PARISA: Exactly. If the intended accessible name is Add pizza, fix the interface. If the requirement changed intentionally, update the test. Don't automatically chase the current implementation.

JULES: Suppose there are three matching buttons because the menu contains three items.

PARISA: Then our fixture or query is ambiguous. Scope to a named item region where that structure makes sense, or provide distinctive action names. Don't use the first match just because it happens to be Mushroom today.

JULES: Testing Library's within helper can scope queries to a chosen container.

PARISA: That's a library utility. The product still needs meaningful structure. A test-only wrapper with no relationship to the real interface might hide the problem rather than explain it.

JULES: And if the element lives in a detached container, screen won't necessarily see it because screen queries the body.

PARISA: Then attach it appropriately or query the intended container explicitly. Again, understand the environment before deciding the application is broken.

## Removal Is a Transition Too

JULES: We've mostly tested things appearing. What about removing a pizza from the cart?

PARISA: First assert the pizza is present, then perform the removal, then assert it's absent. Otherwise an absence assertion can pass because we never rendered it in the first place.

JULES: That's a useful pattern. Establish the initial state so the test proves a transition, not merely a final snapshot.

PARISA: And if removal is asynchronous, wait for disappearance using the appropriate library helper or a retrying assertion. An immediate query might still find the old state.

JULES: What else should we observe?

PARISA: The cart total updates, if that's within scope. The empty-state message appears when the last item is removed. Focus remains somewhere useful if the focused Remove button disappeared.

JULES: Focus is often forgotten because the DOM looks correct afterward.

PARISA: Exactly. A keyboard user needs a sensible next location, not just the correct number of elements. We can automate a specific focus expectation, then evaluate whether the chosen behavior actually feels usable in a real browser.

JULES: And a status message can communicate the removal without moving focus unnecessarily.

PARISA: Yes, depending on the design. We shouldn't use focus movement as an announcement mechanism by default. Define the interaction deliberately.

## Forms Have Built-In Behavior

JULES: Suppose the Add pizza button sits in a form and accidentally submits it. A click test only checks the cart text, so it still passes.

PARISA: Then we've missed another meaningful effect. Native form behavior matters. Button type, submit handlers, validation, and keyboard submission should be considered in the component's actual context.

JULES: A standalone button fixture can miss that context.

PARISA: Right. Isolated tests are useful, but the integration into a form deserves a check if that's how the widget is used. The test boundary should include the behavior we're worried about.

JULES: Would you directly call the submit handler?

PARISA: For a unit test of extracted handler logic, perhaps. For form interaction, use the form through meaningful controls. Calling the handler bypasses native event behavior and may omit the actual user path.

JULES: Same reason not to set an input's value property and assume you've reproduced typing and its events.

PARISA: Exactly. The state update may depend on an event. Use the interaction helper appropriate to the user action, then verify the result. If a low-level event is intentional, explain why.

## When the DOM Test Is the Wrong Instrument

JULES: The dropdown options are clipped behind an overflow container. Can our jsdom test catch it?

PARISA: Not through real layout. Use a browser and inspect the rendered behavior at relevant sizes. A structural test can verify options exist while every customer still can't see them.

JULES: The text contrast is too low?

PARISA: A role query won't establish contrast. Use appropriate accessibility checks and visual evaluation. The test shouldn't claim more than it observes.

JULES: The keyboard focus indicator is removed by CSS?

PARISA: ToHaveFocus can still pass because the element has focus. Visibility of the indicator is another property. That distinction is a perfect example of why matcher names need interpretation.

JULES: The status message appears in the DOM but isn't announced as expected by a screen reader?

PARISA: We need real assistive-technology evaluation for that experience. Verify the markup and update pattern, but don't assume a DOM assertion has listened to the announcement.

JULES: So the efficient strategy is not to force everything into jsdom. Use it for the things it can tell us clearly, and choose other checks for the rest.

PARISA: Exactly. The simulated environment earns its place by giving useful fast feedback. It doesn't need to pretend to be a browser, a screen reader, and a human with opinions about button placement.

## Read the Page Like a Listener

PARISA: Here's an audio-first way to design the test. Describe the interface without pointing. “There is a button named Add pizza. Activating it changes the cart status to one pizza.”

JULES: That description maps naturally to our query, action, and assertion. It avoids relying on “the blue thing over there.”

PARISA: If the description requires visual position, ask whether that position is actually the behavior under test. Sometimes it is, such as a layout issue. Then choose a browser-based visual check. Otherwise, find the semantic relationship.

JULES: For a delivery field, say its label. For a menu item, identify the item and its action. For an error, say what the user needs to learn.

PARISA: This doesn't mean every interface can be reduced to simple text. It means our test should express a meaningful interaction rather than an accidental DOM address.

JULES: It also helps when localization changes copy. We can decide which tests verify exact language and which verify the broader interaction with controlled translations.

PARISA: Don't casually use an English regular expression in every test and then call the interface language-independent. The fixture's language is part of the scenario.

JULES: And keep query precision appropriate. A vague match for “add” might find Add address instead of Add pizza once the interface grows.

PARISA: The failure we want is informative. The pass we want is specific. Both start with saying what the person is trying to do.

JULES: Which brings us back to ordinary web fundamentals.

PARISA: Yes. The new tool is useful partly because it encourages us to preserve things the web already knew how to express.

## Okay, That's Why

JULES: DOM tests let us exercise interface behavior quickly in a controlled document environment. Testing Library encourages queries based on meaning, and user-event models interactions above the single-event level.

PARISA: Jsdom isn't a complete browser. Meaningful queries help accessibility, but they aren't an accessibility audit. Native HTML remains an excellent collaborator.

JULES: Next: React testing. Same user-oriented questions, with React handling the rendering and state updates.

PARISA: The button may acquire JSX. It will still need to be a button.

[OUTRO MUSIC]

## Production Notes

- Practice-project dependencies in addition to Vitest: jsdom, @testing-library/dom, @testing-library/user-event, @testing-library/jest-dom. Install only for a DOM exercise.
- First test card includes imports, environment directive, and cleanup shared by the keyboard card.
- Widget intentionally supports one demonstration action; repeated-item arithmetic belongs to a different contract.

## Production References

- Testing Library queries: https://testing-library.com/docs/queries/about/
- Role/name queries: https://testing-library.com/docs/queries/byrole/
- user-event setup and interactions: https://testing-library.com/docs/user-event/intro/
- jsdom capabilities and limitations: https://github.com/jsdom/jsdom
- jest-dom Vitest integration: https://github.com/testing-library/jest-dom#with-vitest
