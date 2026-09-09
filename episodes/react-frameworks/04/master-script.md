# Episode 4: Hooks and useEffect — Stop Synchronizing Nothing

**Series:** React / Modern Front-End Frameworks
**Runtime:** Determined by the final recorded read; coverage takes priority over a fixed length.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: I have a confession.

JULES: This feels unsafe.

PARISA: When I first learned React, I thought useEffect meant “code that runs after the component.”

JULES: Common.

PARISA: So whenever I did not know where code belonged, I put it in an effect.

JULES: Extremely common.

PARISA: My components became haunted.

JULES: Today we perform an exorcism.

[STING: PLEASE DON’T DO THIS]

## What Is a Hook?

JULES: Hooks are React functions that let components use React features such as state, context, refs, and effects.

PARISA: The use prefix is a convention with enforcement behind it.

JULES: Yes. Hooks rely on being called consistently so React can associate each call with the right stored information.

PARISA: Rules of Hooks: call them at the top level of a component or another Hook, not inside conditions, loops, or random nested functions.

JULES: Correct.

PARISA: Why?

JULES: React uses call order as part of matching Hook state between renders. If a condition causes a Hook call to appear or disappear, later calls can shift positions.

PARISA: The coat-check tickets all move one slot and somebody goes home wearing context.

JULES: Disturbing but serviceable.

## Hooks Did Not Invent Closures

PARISA: A custom Hook is just a function?

JULES: It is a JavaScript function whose name begins with use and that may call other Hooks. The function syntax, closures, arrays, objects, and destructuring are JavaScript. The Hook contract is React.

PARISA: Custom Hooks share logic, not one magical shared state value.

JULES: Important. Each call gets its own state unless the Hook connects to some shared external store or context.

PARISA: Extracting useWindowWidth does not make every caller share a private width box by React telepathy.

## Effects Are for External Synchronization

JULES: An effect lets a component synchronize with a system outside React.

PARISA: Outside means?

JULES: A browser API, network connection, timer, event subscription, third-party widget, media playback, or another imperative system React does not control.

PARISA: The DOM is not always outside, because React controls the DOM it renders.

JULES: Right. You do not need an effect merely to calculate JSX from props or state.

PARISA: Say that again.

JULES: If a value can be calculated during rendering, calculate it during rendering.

[AIR HORN]

PARISA: We are printing that on the wall.

## Anatomy of an Effect

[CODE CARD]

~~~jsx
useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();

  return () => connection.disconnect();
}, [roomId]);
~~~

PARISA: Labels.

JULES: Arrow functions, block syntax, const, method calls, return, and the array literal are JavaScript. useEffect and the meaning React assigns to the setup function, cleanup function, and dependency list are React.

PARISA: On commit, React runs the setup when needed. Before re-running due to changed dependencies, it cleans up the previous synchronization. It also cleans up when the component is removed.

JULES: That is the useful model.

PARISA: roomId is a dependency because the effect reads it.

JULES: Yes. Reactive values used inside the effect belong in the dependency list.

## The Dependency Array Is Not a Schedule

PARISA: Empty array means run once?

JULES: It often behaves like setup on mount and cleanup on unmount in production, but “run once” is a brittle mental model.

PARISA: Because Strict Mode in development may intentionally run an extra setup-cleanup cycle.

JULES: To expose effects that do not clean up correctly.

PARISA: So if sending a payment twice would be catastrophic, the answer is not “turn off Strict Mode.”

JULES: Correct. A purchase belongs in an explicit user event with server-side idempotency and validation, not a mount effect.

PARISA: Empty dependency array means the effect does not depend on changing reactive values, not “please promise the universe executes this line exactly once.”

JULES: Excellent.

PARISA: Give me all three versions before the brackets become folklore.

JULES: With no dependency array, the effect runs after every committed render of that component. With an empty array, it sets up when the component is added and cleans up when it is removed—plus the extra development Strict Mode check we just discussed. With dependencies in the array, React re-synchronizes when one of those values differs from the previous render.

PARISA: Compared using Object.is, which is why a newly created object or function can count as different even when its contents look familiar.

JULES: Right. The array does not let us choose our favorite schedule. It describes which reactive values the synchronization depends on.

## Event or Effect?

PARISA: User clicked Buy.

JULES: Event handler.

PARISA: Component is visible and must maintain a chat connection for the selected room.

JULES: Effect.

PARISA: User submitted a form.

JULES: Event handler.

PARISA: Page title should reflect the current document name.

JULES: Effect, because you are synchronizing an external browser API with React state.

PARISA: Filtered list from items and query.

JULES: Calculate during render.

PARISA: Save first name plus last name into fullName state.

JULES: No effect. Derive it.

PARISA: Fetch search results every time query changes?

JULES: Possibly an effect in a simple client-only example, but real data frameworks or query libraries may handle cancellation, caching, deduplication, server rendering, and race conditions more robustly.

## The Derived-State Effect Trap

[STING: PLEASE DON’T DO THIS]

[CODE CARD]

~~~jsx
useEffect(() => {
  setFullName(firstName + " " + lastName);
}, [firstName, lastName]);
~~~

PARISA: Why is this bad?

JULES: React renders with the old fullName, commits, runs the effect, updates state, and renders again—just to calculate a value already available during the first render.

PARISA: Extra state, extra render, temporary inconsistency.

JULES: Instead:

[CODE CARD]

~~~jsx
const fullName = firstName + " " + lastName;
~~~

PARISA: Just JavaScript.

[GAME-SHOW BELL]

## Cleanup Is Part of Setup

JULES: If setup subscribes, cleanup unsubscribes. If setup starts a timer, cleanup clears it. If setup opens a connection, cleanup closes it.

PARISA: Cleanup is not merely “when the component dies.”

JULES: Right. It also runs before an effect re-synchronizes with changed dependencies.

PARISA: Room A connection closes before Room B becomes the current connection.

JULES: Exactly.

PARISA: Missing cleanup causes duplicate listeners, stale connections, memory leaks, and updates from work nobody wants anymore.

JULES: And development Strict Mode makes some of those bugs obvious sooner.

## Fetching and Race Conditions

PARISA: The classic effect fetch:

JULES: Query changes from cats to caterpillars. The cats request is slow. Caterpillars returns first. Then cats arrives and overwrites the newer result.

PARISA: The interface confidently answers the wrong question.

JULES: Cleanup can ignore stale results or abort a request where supported. But fetching has more concerns: errors, loading, caching, retries, duplicate requests, navigation, server rendering, and request waterfalls.

PARISA: So useEffect can fetch; that does not mean hand-written effect fetching is the best architecture.

JULES: Precisely. Modern React frameworks often provide route-level data loading. Client query libraries offer cache and synchronization primitives.

PARISA: Choose those because the problem exists, not because Episode Five sells accessories.

## Dependencies and the Linter

PARISA: I removed a dependency to stop the effect running.

JULES: You have not fixed the dependency. You have lied about it.

PARISA: Harsh.

JULES: If the effect reads a reactive value, omitting it can make the effect use a stale snapshot. The Hooks linter is pointing at a design mismatch.

PARISA: Better questions: Should this be an effect? Can the work happen in an event? Can I derive the value? Should the function be declared inside the effect? Is the object recreated every render?

JULES: Exactly. Restructure before suppressing.

PARISA: But dependency equality uses Object.is, so freshly created object and function references can trigger re-runs.

JULES: Yes. Sometimes move creation inside the effect. Sometimes stabilize a value with useMemo or useCallback when there is a demonstrated need. Sometimes the effect itself is unnecessary.

PARISA: Memoization is not holy water.

## useRef: A Persistent Box

JULES: useRef returns an object whose current property persists across renders.

PARISA: Updating current does not request a render.

JULES: Correct. Useful for DOM references, timer IDs, or mutable values that do not affect visible output.

PARISA: If the UI should update, state. If React does not need to re-render for it, maybe a ref.

JULES: Good default distinction.

PARISA: Direct DOM manipulation?

JULES: Use refs for legitimate imperative actions like focusing an input or integrating a third-party widget. Avoid fighting React by manually rewriting DOM it owns.

## useMemo and useCallback

PARISA: Hooks tutorial speed round.

JULES: useMemo caches a calculated value between renders subject to dependencies. useCallback caches a function reference.

PARISA: Performance tools, not semantic requirements.

JULES: Generally. They add complexity and are not free. Use them when referential stability is required by an integration or when measurement shows useful optimization.

PARISA: Not around every array map because a blog post looked stern.

JULES: Correct. React’s compiler-era tooling may reduce some manual memoization needs in supported setups, but understanding identity and renders still matters.

PARISA: Current-tech footnote without pretending every project has the newest compiler configured.

JULES: Exactly.

## useContext

JULES: useContext reads a value provided above the component in the tree.

PARISA: Useful for themes, current user presentation data, localization, shared services.

JULES: Potentially. But context is not automatically a complete state-management solution, and broad frequently changing context can re-render many consumers.

PARISA: Also, putting an authorization flag in context still does not enforce authorization.

JULES: The server remains employed.

## Custom Hooks as Named Policies

PARISA: What makes a good custom Hook?

JULES: A repeated or complex piece of stateful behavior with a meaningful name and a clear interface.

PARISA: useOnlineStatus can hide subscription details and expose a boolean.

JULES: Yes. It packages the synchronization policy. Components remain focused on what they render.

PARISA: But a custom Hook can still contain terrible effects.

JULES: Abstraction can hide a mess; it cannot redeem one.

## Accessibility and Effects

PARISA: Effects sometimes manage focus.

JULES: Yes, for example focusing a dialog’s initial control after it opens or restoring focus when it closes. But use a robust accessible dialog pattern rather than inventing one from three effects and optimism.

PARISA: Announcing asynchronous status may use a live region in the rendered HTML, not an effect that yells through a random API.

JULES: Correct. Prefer semantic output first.

PARISA: And do not move focus on every render because a dependency array got creative.

## The Effect Decision

[MUSIC BED]

PARISA: Before writing useEffect, ask whether I am synchronizing with something outside React.

JULES: If no, you probably do not need an effect.

PARISA: If the work is caused by a specific user action, it probably belongs in that event.

JULES: If a value can be calculated from current props and state, calculate it during render.

PARISA: If I do need an effect, list its real dependencies and provide symmetrical cleanup.

JULES: Design it so setup, cleanup, and setup again are safe.

PARISA: Hooks are React APIs. Closures and destructuring are JavaScript. The weirdness often lives at their border.

JULES: You have completed the exorcism.

PARISA: My component is still making a noise.

JULES: That is the ecosystem approaching.

PARISA: It has seventeen packages.

[OUTRO MUSIC]

## Production Notes

- Companion material should contrast event handlers, render-time derivation, and effects.
- Preserve the nuance that development Strict Mode may run an extra setup/cleanup cycle.
- Avoid presenting hand-written effect fetching as the default for framework applications.
- Include cleanup, race-condition, ref, context, and measured-memoization examples.
