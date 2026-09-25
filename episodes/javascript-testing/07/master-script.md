# Episode 7: React Testing — Stop Interrogating the Furniture

**Series:** JavaScript Testing • Episode 7 of 10
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — The Hook Was Called

[INTRO MUSIC]

JULES: The test says the state setter was called.

PARISA: Did the cart update?

JULES: It doesn't check that.

PARISA: Then we know somebody rang the doorbell. We don't know whether anybody opened the door.

JULES: Fair.

PARISA: Welcome to *Okay, But Why?*. Today we're testing React components without demanding sworn testimony from every hook.

JULES: We'll render the component, interact with its output, and observe behavior. Plus rerenders, async updates, providers, snapshots, and what these tests still miss.

## What React Adds to the Previous Episode

JULES: Last episode we mounted a plain DOM widget ourselves. In React, components describe UI and React manages rendering and updates.

PARISA: But the user's goal hasn't changed. They still want to add a pizza, understand the result, and operate the interface without knowing our state variable names.

JULES: Exactly. React Testing Library helps render React components for tests and provides access to the same family of DOM queries.

PARISA: It isn't a second React implementation. We should let real React state and rendering run in the component test.

JULES: Right. Replacing useState with a mock just to count setter calls bypasses important behavior. A test can pass while the component renders the wrong result.

PARISA: We want to observe what the component's public inputs and interactions produce. Props, user events, visible output, meaningful effects at boundaries.

JULES: Exactly. “Avoid implementation details” doesn't mean never inspect anything technical. It means don't couple a test to internal structure that isn't part of the intended contract.

## A Component We Can Hear

JULES: Our CartCounter starts at zero. It has an Add pizza button. The status says how many pizzas are in the cart.

[CODE CARD: JSX/React component with JavaScript state update — CartCounter.jsx]
```jsx
import { useState } from 'react';

export function CartCounter() {
  const [count, setCount] = useState(0);
  return (
    <section aria-label="Pizza cart">
      <button type="button" onClick={() => setCount(current => current + 1)}>
        Add pizza
      </button>
      <p role="status">{count} {count === 1 ? 'pizza' : 'pizzas'} in cart</p>
    </section>
  );
}
```

PARISA: Syntax checkpoint. Import and export are JavaScript. The array destructuring gets the current count and setter from the value returned by useState. UseState itself is a React API.

JULES: The angle-bracket markup is JSX. The braces inside JSX embed JavaScript expressions. The conditional choosing pizza or pizzas is JavaScript, not a React-only operator.

PARISA: And onClick is a React event prop. The arrow passes a handler; it doesn't update the count while we're merely rendering the component.

JULES: The inner updater function receives the previous state and returns the next value. That uses React's functional update form, expressed with a JavaScript function.

PARISA: None of this is TypeScript. The file is JSX-bearing JavaScript. Please label the costume before the audience wonders whether they missed an entire language.

JULES: Audio behavior: each button activation increases the count by one and updates the status, with singular wording at one.

## Render, Interact, Observe

[CODE CARD: React Testing Library; Vitest; jest-dom; user-event]
```jsx
// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { CartCounter } from './CartCounter.jsx';

afterEach(cleanup);

test('two additions update the cart count', async () => {
  const user = userEvent.setup();
  render(<CartCounter />);
  const addButton = screen.getByRole('button', { name: 'Add pizza' });

  await user.click(addButton);
  expect(screen.getByRole('status')).toHaveTextContent('1 pizza in cart');
  await user.click(addButton);
  expect(screen.getByRole('status')).toHaveTextContent('2 pizzas in cart');
});
```

JULES: We render the real component, activate its button twice, and check the intermediate and final status.

PARISA: This test intentionally describes a short stateful interaction sequence. We aren't measuring how many times React called the component function or which hook stored the count.

JULES: Exactly. If we later reorganize the state internally while preserving this behavior, the test should still pass.

PARISA: Render is the React Testing Library helper. The JSX element passed to it identifies the component. Screen is a query helper, not React's screen object, because React doesn't have such a thing here.

JULES: Cleanup unmounts rendered components after each test. Some setups register cleanup automatically, but explicit registration here makes the lifecycle clear with our imported Vitest hooks.

PARISA: And the test file needs the project's JSX transform configured. The environment comment supplies jsdom; it doesn't by itself explain every JSX processing choice.

## The Environment Needs the Right Pieces

JULES: In an existing React/Vite project, use its established configuration. For an isolated exercise, the React plugin is a straightforward way to configure React JSX support.

[CODE CARD: JavaScript configuration; Vite React plugin; Vitest options]
```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom' },
});
```

PARISA: DefineConfig is a tooling helper. Export default and the object syntax are JavaScript. Plugins and test are configuration keys interpreted by the tools.

JULES: Yes. The exercise needs compatible React, React DOM, React Testing Library, the React plugin, Vitest, jsdom, user-event, and jest-dom dependencies. It should live in a practice project, not be installed into the podcast audio builder.

PARISA: In a real application, merge intentionally with the existing config. Don't replace aliases and other plugins with this small card and then wonder where the application went.

JULES: Exactly. Minimal examples explain a need; they aren't universal replacement files for every project.

## Why Not Read the State Directly?

PARISA: If I could inspect count directly, wouldn't that be simpler?

JULES: It might be narrower, but it misses whether the state reaches the output correctly. A setter can be invoked with the right value while the UI renders stale text or the wrong variable.

PARISA: So a component test earns its value by letting the component actually perform its job.

JULES: Right. Extracted pure logic can have unit tests. The component can have behavior tests. We don't need to force all assertions through the UI or all assertions through private internals.

PARISA: If calculating a discount is complicated, test that calculation directly with many examples. Then a smaller number of component tests can check the connection and presentation.

JULES: Exactly. That's complementary scope. The component shouldn't need forty click sequences to exercise every arithmetic boundary if the decision has a clear pure function.

PARISA: But at least one connection test matters. Otherwise the perfectly tested discount function can sit unused while the component does its own wrong arithmetic.

## Props Are Part of the Public Contract

JULES: Suppose a MenuItem component receives a soldOut prop. When true, the add button is disabled and the item communicates that it's unavailable.

PARISA: Test the disabled state and understandable message. If the prop changes from false to true, a rerender test can verify the updated output.

JULES: React Testing Library provides rerender for updating the rendered element in the same test context.

PARISA: That is different from unmounting and mounting a new component. If we're testing how an existing component responds to changed props, preserve the lifecycle we actually mean.

JULES: Exactly. Similarly, if a new prop is only used to initialize state, changing it later may not update state automatically. The intended behavior needs a design decision.

PARISA: A test can expose the ambiguity. Should an edited draft preserve local changes when fresh server data arrives, or reset? That isn't something React can decide for the product.

JULES: Right. Write the expected transition before turning it into an assertion.

PARISA: And disabled controls need meaningful context. “Can't click it” isn't always enough to help the user understand why.

## Act Is Not a Sleep Spell

JULES: React has a testing helper called act that helps apply pending updates before assertions. Testing Library wraps many of its helpers with the appropriate React testing support.

PARISA: Act the React API versus Act in Arrange, Act, Assert. Similar word, different level of specificity.

JULES: Exactly. An act warning often means some update happened outside the expected test interaction or wasn't properly awaited. Don't silence it blindly.

PARISA: First check whether we awaited user interactions and the async state we're actually testing. Are there timers, promise resolutions, or subscriptions continuing after the test?

JULES: Right. Sometimes explicit act is appropriate for directly triggering an update, but it isn't a general replacement for waiting on a meaningful result.

PARISA: Nor should we wrap everything in arbitrary delays until the warning disappears. We need to understand what work is pending.

JULES: Episode Eight handles controlled promises and timing. Here, our awaited user actions and synchronous state updates keep the example straightforward.

PARISA: And a warning can reveal a missing assertion. Maybe the test ends before the final state ever appears, so it never checks the behavior it claims to check.

## Effects, Strict Mode, and Counting the Wrong Thing

JULES: React development behavior can include extra checks, such as Strict Mode's additional setup and cleanup cycle for effects. Tests configured with Strict Mode may expose missing cleanup.

PARISA: Then “this effect runs exactly once” can be a misleading expectation unless the contract and environment really require that.

JULES: Exactly. Test the externally meaningful behavior and proper cleanup. If an effect subscribes to something, verify the lifecycle where it matters instead of treating a development invocation count as a user requirement.

PARISA: We should also avoid claiming that every test automatically uses Strict Mode. That's a rendering/configuration choice.

JULES: Correct. Make it explicit. And don't disable useful development checks merely because they exposed an effect that assumes setup can never repeat.

PARISA: A receipt sent directly from a mount effect deserves a serious design conversation. Rendering a component should not casually trigger irreversible business behavior.

JULES: Especially when the actual intent is tied to an explicit user action or server-side workflow.

## Mock the Network Boundary, Not React

PARISA: Our menu component fetches availability. Where do we replace things?

JULES: Often at the network boundary or a defined data-access dependency. Let the component render and update for real, but provide controlled success, error, or delayed responses.

PARISA: That lets us test loading, success, empty, and failure states without mocking useEffect into pretending it worked.

JULES: Exactly. Network interception tools can preserve more of the request path than directly replacing a hook, but still provide a controlled response. Choose the seam based on what the test is supposed to include.

PARISA: And state clearly whether the real fetching adapter runs. If it's replaced, its serialization and response parsing need other coverage.

JULES: Right. Avoid tests that replace the custom hook with “loading false, data pizza” and then claim the asynchronous loading workflow works. That test only covers rendering for supplied hook state.

PARISA: Which can still be useful if honestly scoped. The problem is the inflated claim.

## Providers and Routers Are Context

JULES: Components may require theme, router, localization, or data providers. A custom render helper can supply them consistently.

PARISA: Useful incidental setup. But don't hide decisive scenario information. If the user role changes what the component shows, make the selected role obvious in the test.

JULES: Exactly. A default admin provider can accidentally make every authorization-related UI test run as the most privileged user.

PARISA: And UI role gating isn't the server's authorization boundary. Hiding the staff button doesn't prevent a direct request.

JULES: Correct. Test both responsibilities at their appropriate scopes.

PARISA: Routers have similar nuance. A component test can verify navigation intent or route behavior within a memory-based router. It doesn't necessarily prove deep links load correctly through the deployed server.

JULES: That's a great integration boundary for a browser or deployment check.

## Snapshots: A Receipt, Not an Opinion

JULES: What about snapshot tests? They save an expected representation and compare later output against it.

PARISA: That can show changes, but it doesn't know whether the saved representation was correct. Someone had to review it.

JULES: Exactly. Small focused snapshots can be useful. Huge component-tree snapshots often produce noisy diffs that people approve without understanding.

PARISA: If the workflow is “snapshot failed, press update,” we've created an expensive way to record whatever happened today.

JULES: Review the change against intent. Use explicit assertions for important behavior, especially things a reader should understand immediately.

PARISA: A snapshot isn't automatically a screenshot either. Many snapshot tools serialize text or DOM structure. Visual regression tools compare rendered images and have different tradeoffs.

JULES: Right. Know what was captured. A serialized tree won't tell you whether text is clipped on a phone.

## A Refactor That Should Be Boring

JULES: We replace our internal count state with a reducer. Same button, same status, same increments. What happens to our test?

PARISA: It should still pass. It describes user behavior and public output, not the choice of state-management hook.

JULES: We rename the CSS class on the section?

PARISA: Same. Our role and name queries don't depend on that class.

JULES: We accidentally remove the button text and leave only an unlabeled icon?

PARISA: The named query should fail. That's useful because we lost the accessible name. A CSS selector might have kept passing while the control became less usable.

JULES: We replace the button with a clickable div?

PARISA: The role query fails, and keyboard behavior needs checking too. The failure is not automatically test brittleness; it may be a genuine semantic regression.

JULES: So the goal isn't “tests never fail during refactors.” It's “tests fail when meaningful behavior changes, and stay stable when incidental structure changes.”

## Listener Workshop — Loading Isn't Empty

JULES: A menu component initially has no items because its request is pending. Later the response contains an empty list. Should those states look the same?

PARISA: Usually no. Loading means we don't know yet. Empty means the request completed and there are no items. Failure is another state. The product decides the wording, but the distinction matters.

JULES: What would a good test arrange?

PARISA: A controlled pending response, then a controlled empty success. Assert the initial loading state, resolve the response, and assert the empty-state message. Use a separate failure scenario too.

JULES: Would a mock hook returning an empty array throughout prove that transition?

PARISA: No. It could test empty rendering, but not the actual transition from pending. Keep the claim aligned with what runs.

JULES: And what accessibility question belongs here?

PARISA: Whether state changes are communicated understandably and whether focus remains useful. A DOM test can verify relevant structure and text, with real assistive-technology evaluation for the experience.

## A Component Is Also Someone Else's Dependency

PARISA: We've been talking about the end user, but a reusable component also has a developer using its API. Is testing a callback prop an implementation detail?

JULES: Not necessarily. If a component promises to call onSelect with the selected item, that's part of its public contract. Render the component, perform the selection, and observe the callback argument.

PARISA: So callback assertions can be appropriate at the component boundary, like the receipt interaction in Episode Five. We just shouldn't replace the component's own state behavior and then claim it worked.

JULES: Exactly. For a controlled component, the parent owns the value and receives change notifications. A test might use a small real parent to exercise the full controlled interaction, or focus specifically on the callback contract.

PARISA: Explain controlled in ordinary terms.

JULES: The component receives its current value through props instead of being the sole owner of that value. It reports a requested change, and the parent supplies the updated value. The division of responsibility affects what a test should observe.

PARISA: If I render a controlled input with a fixed value and a mock change callback, typing may call the callback while the displayed value remains fixed. That isn't necessarily a component bug; I didn't provide a parent that updates the prop.

JULES: Exactly. The test must model the intended ownership. Otherwise it can mistake a deliberately fixed test setup for broken interaction.

PARISA: A small parent harness can be useful, but don't let it reimplement the entire application. Keep the state flow visible.

## Empty, Error, Success: Different Stories

JULES: Let's review a menu component with four states. Pending request, successful list, successful empty list, failed request.

PARISA: Start each test with the dependency behavior that creates the state. Don't use one giant test that mutates the mock through every possible response unless the transitions themselves are the question.

JULES: For success, assert useful menu content. For empty, assert an understandable empty-state message. For failure, assert a recoverable message and any retry control the product provides.

PARISA: Then a dedicated retry test can begin with failure, activate Retry, resolve a later request successfully, and verify that the error gives way to the menu.

JULES: Exactly. That's a meaningful sequence, like our two-addition counter test. The sequence itself expresses the behavior.

PARISA: What happens to the old content while retrying? Does it disappear, remain with a loading indicator, or become unavailable? That's another design decision, not something the test should guess.

JULES: And whether the retry control is disabled while a request is pending can matter for duplicate requests. Test the intended behavior instead of assuming every application should handle it identically.

PARISA: For a read-only menu refresh, duplicate requests may be wasteful. For placing an order, duplicates can be much more serious. Similar-looking buttons, different risk.

JULES: Good reason to keep testing tied to the domain, not just a generic component checklist.

## Unmounting Is an Observable Lifecycle

PARISA: Suppose the user leaves the page while a request is pending. What does a component test do with that?

JULES: If the component owns cancellation or subscriptions, we can test the specified cleanup behavior. Render it, begin the operation, unmount it, and observe the relevant boundary or absence of stale updates where appropriate.

PARISA: But don't claim “no memory leaks” because one cancellation callback was invoked. That's another much larger property.

JULES: Correct. We verify a specific lifecycle responsibility. The request adapter or subscription system may have its own tests.

PARISA: And a request can complete after unmount. The implementation might ignore the result instead of aborting the underlying operation. Both can be legitimate depending on the contract.

JULES: Exactly. Test the desired effect: don't apply stale state, release owned subscriptions, avoid an unwanted follow-up action. Don't force one internal mechanism without a reason.

PARISA: React warnings also change across versions. The absence of a familiar warning isn't proof the lifecycle is correct.

JULES: Right. Assertions should observe the intended responsibility, not depend solely on whether the framework complains.

## The Refactor Review Meeting

JULES: A colleague says our test is too tied to the UI because it searches for Add pizza. They want to use a test ID so wording changes don't fail it.

PARISA: I'd ask whether the wording is part of what we intend to protect. A named control is meaningful. If copy changes intentionally, updating a small clear test is reasonable.

JULES: But if the test's purpose is unrelated to the exact wording?

PARISA: A suitable stable query may be appropriate. The decision isn't “text always good, IDs always bad.” It's which contract the test should express.

JULES: Another colleague wants to assert that the DOM contains exactly three nested divs.

PARISA: Unless that structure has a real requirement, that's probably incidental. A layout refactor could preserve behavior and break the test needlessly.

JULES: A third wants to remove the status-role assertion because the text still appears.

PARISA: If the status semantics are intentional, losing them may matter. Behavioral tests can include accessibility relationships, not only visible strings.

JULES: So a good review asks why each observation belongs, rather than applying a universal rule about which selector looks modern.

PARISA: Exactly. React testing is still testing. The framework doesn't exempt us from choosing a meaningful question.

## What the Counter Does Not Claim

JULES: Our counter test passes. Have we tested cart persistence?

PARISA: No. This component owns an in-memory count. Reloading would reset it. Persistence isn't implemented or promised in the example.

JULES: Server pricing?

PARISA: Also no. A count displayed in React isn't an authoritative accepted order. Those responsibilities belong to the real application boundaries we discussed elsewhere.

JULES: That's worth saying because small examples can look like complete features when stripped from their explanation.

PARISA: Exactly. The example demonstrates real React interaction and rendering. It's useful for that purpose without quietly becoming a production shopping cart.

## Okay, That's Why

JULES: React component tests are useful when they let real components render, accept interactions, and reveal meaningful outcomes.

PARISA: Separate JavaScript, JSX, React APIs, and testing APIs. Don't mock the very state behavior you're trying to verify. Keep providers and async boundaries understandable.

JULES: Next: asynchronous tests. Promises, errors, timers, races, and why “wait a bit” isn't a synchronization strategy.

PARISA: My least favorite test helper is called maybeTuesday.

[OUTRO MUSIC]

## Production Notes

- Existing React setup is a prerequisite. Example configuration is an isolated exercise baseline, not a replacement for a project's configuration.
- Explicit cleanup is included to avoid relying on runner globals. No React internals are mocked.
- Syntax labels deliberately distinguish JavaScript, JSX/React, and testing/tooling.

## Production References

- React Testing Library example: https://testing-library.com/docs/react-testing-library/example-intro/
- React Testing Library API and cleanup: https://testing-library.com/docs/react-testing-library/api/
- React act: https://react.dev/reference/react/act
- React Strict Mode: https://react.dev/reference/react/StrictMode
- React state updater functions: https://react.dev/reference/react/useState
