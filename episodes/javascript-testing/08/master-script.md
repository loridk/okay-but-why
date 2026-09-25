# Episode 8: Async Tests — The Test Finished Before the Bug Arrived

**Series:** JavaScript Testing • Episode 8 of 10
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — Congratulations, Nothing Happened Yet

[INTRO MUSIC]

PARISA: My test passed.

JULES: Did the request finish?

PARISA: Not yet.

JULES: Then what did it check?

PARISA: Apparently that JavaScript can begin an activity.

JULES: A strong start, but not our acceptance criteria.

PARISA: Welcome to *Okay, But Why?*. Today the bug arrives after the test has already gone home.

JULES: Promises, awaiting assertions, controlled responses, fake timers, and races. We'll make completion part of the test instead of hoping it happens quickly enough.

## The Runner Needs a Finish Line

JULES: A synchronous test callback finishes when it returns or throws. If it starts asynchronous work and doesn't connect that work to its result, the runner may consider the test done too early.

PARISA: So an assertion buried in an unreturned promise callback can run after the test's lifetime. Depending on the tool, we might get a late failure, an unhandled error, or misleading results.

JULES: Exactly. Return the promise or use an async callback and await the work that matters. Then the runner can wait for fulfillment or rejection.

PARISA: Async and await are JavaScript features. An async function returns a promise. Await pauses that function's continuation until the awaited value settles; it doesn't freeze the entire runtime.

JULES: Right. Promise-aware matchers are testing APIs, but the scheduling mechanism is ordinary JavaScript.

PARISA: If I write await before something that doesn't represent the work I need, I haven't magically synchronized the test. I need the right promise or observable condition.

JULES: Exactly. “There is an await somewhere” isn't enough.

## A Request Boundary Small Enough to Explain

JULES: Let's write a function that loads the menu through an injected request function. It expects an HTTP-like response with ok and json. We'll validate a small payload shape before returning names.

[CODE CARD: JavaScript async function — load-menu.js]
```javascript
export async function loadMenu(request) {
  const response = await request('/api/menu');
  if (!response.ok) throw new Error('Menu request failed');

  const items = await response.json();
  if (!Array.isArray(items) || !items.every(item =>
    item !== null && typeof item === 'object' && typeof item.name === 'string'
  )) {
    throw new Error('Invalid menu response');
  }
  return items.map(item => item.name);
}
```

PARISA: Audio version: request the menu, reject an unsuccessful HTTP response, parse its body, require a list of objects with string names, and return those names.

JULES: The arrows passed to every and map are JavaScript callbacks. Array.isArray and typeof are runtime JavaScript checks. This is not TypeScript validation appearing by magic.

PARISA: And this is deliberately limited payload validation. A real menu may need IDs, availability, prices, length limits, and other rules.

JULES: Correct. We're testing a small adapter contract, not presenting a complete network client.

## Await the Result You Care About

[CODE CARD: Vitest async test with a controlled request dependency]
```javascript
import { expect, test, vi } from 'vitest';
import { loadMenu } from './load-menu.js';

test('returns menu names from a successful response', async () => {
  const request = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{ name: 'Mushroom' }],
  });

  const names = await loadMenu(request);

  expect(names).toEqual(['Mushroom']);
  expect(request).toHaveBeenCalledWith('/api/menu');
});
```

PARISA: MockResolvedValue is Vitest's way to make the double return a fulfilled promise with this value. The async arrow used for json is plain JavaScript returning a promise.

JULES: The real loadMenu function runs. It performs its checks and maps the response. The network dependency is replaced.

PARISA: The awaited call is our finish line. If loadMenu rejects unexpectedly, the async test rejects and fails. If it succeeds, we assert the returned names.

JULES: And we verify the request path because that's part of this adapter's responsibility. We haven't contacted a real server or verified its response format.

PARISA: Good. Our double models the response shape we need; it isn't pretending to implement all of Fetch.

## Fulfillment, HTTP Failure, and Network Failure

JULES: Fetch-style requests distinguish an HTTP error response from a network rejection. A response with an unsuccessful status can still be a fulfilled request promise, so code needs to inspect status or ok as appropriate.

PARISA: Which means we need separate scenarios. A rejected request and a fulfilled response saying unavailable are not the same mechanics.

[CODE CARD: Vitest rejection assertions — always await them]
```javascript
test('rejects an unsuccessful HTTP response', async () => {
  const request = vi.fn().mockResolvedValue({ ok: false });
  await expect(loadMenu(request)).rejects.toThrow('Menu request failed');
});

test('propagates a request failure', async () => {
  const request = vi.fn().mockRejectedValue(new Error('Network unavailable'));
  await expect(loadMenu(request)).rejects.toThrow('Network unavailable');
});

test('rejects a malformed payload', async () => {
  const request = vi.fn().mockResolvedValue({
    ok: true, json: async () => ({ name: 'Not an array' }),
  });
  await expect(loadMenu(request)).rejects.toThrow('Invalid menu response');
});
```

PARISA: Rejects and ToThrow are assertion APIs here. Await is JavaScript and waits for the assertion's asynchronous result. Without it, we risk finishing before the assertion finishes.

JULES: Exactly. Also consider malformed JSON, which would make response.json reject. Our function currently propagates that error. Whether to translate it is a product/API design decision.

PARISA: A user-facing component should generally show an understandable message rather than exposing raw implementation errors. The adapter's error contract and the interface's wording can have different tests.

## The Catch Block Trap

JULES: A common flawed rejection test uses try, awaits the call, and only asserts inside catch.

PARISA: If the call unexpectedly succeeds, catch never runs. The test may finish without any assertion.

JULES: Promise rejection matchers express the expectation more directly. In manual try-catch patterns, ensure unexpected success fails and the expected assertion path actually executes.

PARISA: Assertion-count checks can help in certain callback or branching tests, but they don't make weak assertions meaningful.

JULES: Correct. And don't combine callback completion mechanisms with returned promises unless the runner explicitly supports that pattern. Usually choose one completion contract.

PARISA: Older callback-style APIs might use a done callback provided by a runner. Then errors must reach the runner and done must be invoked correctly. Promise-based tests are often easier to compose when the API allows them.

JULES: Exactly. The goal is an unambiguous finish line, not maximizing the number of asynchronous styles in one function.

## Wait for a Condition, Not a Superstition

PARISA: Why not wait two seconds before checking the menu? Surely it will be done by then.

JULES: On a fast machine, you wasted nearly two seconds. On a slow or overloaded machine, it might still not be done. A fixed sleep ties correctness to a guess about timing.

PARISA: Wait for the meaningful condition instead. A menu item appears, a status changes, a promise settles.

JULES: Testing Library's findBy queries wait for an element. WaitFor can retry an assertion until it stops throwing or reaches a timeout.

PARISA: The callback must throw to signal that it isn't satisfied. Returning false isn't the same contract.

JULES: Exactly. And keep actions out of retrying assertion callbacks. If you click Submit inside waitFor, it may click multiple times while retrying.

PARISA: Arrange once, act deliberately, then wait for the observation. We don't repeatedly place orders until the confirmation feels convinced.

JULES: Also don't catch the assertion error inside the wait callback. That can make the callback look successful before the condition is true.

PARISA: The waiting helper is still bounded. A timeout failure means the expected condition didn't become observable within the configured window, not necessarily that the product can never work.

## Loading Needs a Deliberately Pending Response

JULES: If our mock resolves immediately, we may never reliably observe a loading state. We need control over when it resolves.

PARISA: So use a deferred promise: create a promise and keep a function that can settle it later. That's an ordinary JavaScript pattern, not a special testing keyword.

[CODE CARD: JavaScript controlled promise helper]
```javascript
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}
```

JULES: The test supplies the pending promise, triggers the operation, verifies loading, then resolves or rejects it and waits for the final state.

PARISA: The promise executor runs immediately, so the helper captures the settlement functions before returning. The return uses JavaScript object-property shorthand.

JULES: Exactly. Don't leave the operation pending forever after the test. Complete or cancel the lifecycle and clean up subscriptions or timers.

PARISA: And in React tests, directly settling a controlled promise may need React's act support around the update, depending on how the helper triggers it. We still wait for the meaningful output.

JULES: Right. Our helper controls timing; it doesn't replace the component's rendering lifecycle.

## Races: The Older Answer Arrives Last

JULES: A customer searches for mushroom, then quickly changes the query to margherita. The mushroom request finishes last.

PARISA: If the interface blindly uses whichever response arrives most recently, it shows results for the old query. Two individually successful requests, wrong combined behavior.

JULES: That's a race condition: the result depends on the timing or ordering of operations in a way the code hasn't handled correctly.

PARISA: A deterministic test can create two controlled promises, trigger both searches, resolve the new one first, then the old one, and assert that the current query's results remain.

JULES: Exactly. The test doesn't need random network delays to reproduce the race. It chooses the problematic order intentionally.

PARISA: The implementation might cancel the previous request or ignore stale results using an identity check. The public behavior is that old results mustn't overwrite the current search.

JULES: Cancellation itself has limits. Aborting a client request doesn't prove the server rolled back work. For a read-only search, ignoring stale results may be the main concern. For order submission, uncertain outcomes need more design.

PARISA: Good architecture callback. A timeout is not a receipt saying nothing happened.

## Fake Timers Control Scheduled Time

JULES: A debounced search waits until typing pauses before making a request. We can test that policy with fake timers rather than actually waiting through every delay.

PARISA: Fake timers are runner tooling that replaces selected timer APIs. They don't make the real network faster or control every source of asynchronous work.

JULES: Exactly. Here's a small scheduling example, separate from network requests.

[CODE CARD: Vitest timer controls; JavaScript setTimeout]
```javascript
import { afterEach } from 'vitest';

afterEach(() => vi.useRealTimers());

test('does not notify before the scheduled delay', async () => {
  vi.useFakeTimers();
  const notify = vi.fn();
  setTimeout(notify, 300);

  await vi.advanceTimersByTimeAsync(299);
  expect(notify).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(1);
  expect(notify).toHaveBeenCalledTimes(1);
});
```

PARISA: This card demonstrates timer control itself, not a production debounce implementation. For that, call the real debounce code and test repeated inputs and the final argument too.

JULES: Right. The JavaScript timer schedules notify. Vitest advances the controlled clock and runs the due work. We verify both before and at the boundary, then restore real timers.

PARISA: Why async timer advancement?

JULES: It can accommodate asynchronous work scheduled from timers according to the tool's semantics. We still need to await the operation or condition our actual test cares about.

PARISA: Fake time isn't a universal flush-the-universe button.

## Timers and User Interactions Can Collide

JULES: User-event can use timers internally. Combining it with fake timers needs the library's supported timer-advancement configuration.

PARISA: Otherwise the simulated interaction can wait for a timer that our frozen clock never advances. The test hangs and somebody adds a larger timeout, which changes nothing fundamental.

JULES: Exactly. Follow the current user-event fake-timer guidance. Restore clocks and clear owned resources after each scenario. Don't make globally concurrent tests fight over one fake clock.

PARISA: And setting the system time isn't the same as advancing scheduled timers. A date-based expiration rule and a debounce timer have related but distinct needs.

JULES: Right. For a pure expiration function, passing the current time as an argument can be simpler than replacing global time.

PARISA: Explicit inputs remain suspiciously useful.

## Flaky Tests Are Unresolved Information

JULES: A flaky test changes outcome without a relevant intended code change. Timing is one cause, but not the only one.

PARISA: Shared state, random data, real services, order dependence, locale, time zones, resource exhaustion, and leftover async work can all do it.

JULES: Retries can reduce disruption or help collect evidence, but a passing retry doesn't explain the failure.

PARISA: Don't delete the first failure from the story. Record it and investigate. A flaky test might expose a real product race, or it might have a broken test harness.

JULES: If a test must be quarantined, keep an owner and follow-up so quarantine doesn't become permanent retirement without anyone noticing.

PARISA: And prefer a deterministic reproduction. Control the relevant variable instead of rerunning until luck produces the state we want.

## Listener Workshop — The Save That Timed Out

JULES: A Save button starts a request. The request times out. The test expects “Nothing was saved.” What's wrong?

PARISA: A timeout doesn't establish that. The server might have saved the data and the response was lost or delayed. The product needs an uncertainty-aware message or reconciliation behavior.

JULES: What should the test do?

PARISA: Model the actual contract. Verify loading ends appropriately, controls reach the intended state, and the message doesn't make an unsupported claim. If retry is allowed, test duplicate-handling behavior at the appropriate server boundary too.

JULES: And if the test checks the message immediately after clicking?

PARISA: It's observing too early. Await the interaction and control the timeout or rejected promise deliberately. Then wait for the resulting UI state.

JULES: So async testing isn't just punctuation around a test. It makes time, completion, and uncertainty explicit parts of the scenario.

## Walk the Race in Slow Motion

PARISA: I want to walk through the search race as if we were controlling the stage lights. It's easy to nod at “stale response” without seeing where the test catches it.

JULES: We prepare two separate deferred responses. The first belongs to the old query, mushroom. The second belongs to the current query, margherita. Neither has resolved yet.

PARISA: We trigger mushroom through the real search behavior, then change the query to margherita. The real code now has two operations in flight, according to the behavior we're testing.

JULES: We resolve margherita first and wait until its results appear. That establishes that the new query has successfully reached the interface.

PARISA: Then we resolve mushroom. If the implementation blindly accepts every response, it overwrites the current results with mushroom. Our assertion should reject that.

JULES: Exactly. We wait for the relevant completion path and verify margherita remains the current result. Depending on the implementation, we may also verify cancellation or an ignored stale response through a defined boundary.

PARISA: The essential point is that resolving the old promise isn't enough by itself. We must give the code a chance to process it before asserting it had no effect.

JULES: Right. Otherwise the test can pass simply because the stale update hasn't run yet. The observation window matters again.

PARISA: And we should test the normal order too if it's useful: old response first, new response later. The race test focuses on the dangerous ordering, but it doesn't excuse breaking ordinary updates.

JULES: Correct. We have turned an intermittent timing bug into a repeatable sequence. No random delays, no hoping CI is slow enough to reproduce it.

PARISA: That's the part I like. Control isn't about making the world unrealistically easy. It lets us reproduce a difficult real possibility deliberately.

## A Rejection That Happens Before You Listen

JULES: Another async trap: create a promise that rejects, wait for something unrelated, and only later attach a rejection assertion.

PARISA: The runtime may report an unhandled rejection before the test gets around to observing it. Attach the intended handling promptly and await the resulting assertion or operation.

JULES: Exactly. A controlled rejection should be part of a lifecycle the test has already connected to. Don't create abandoned rejected promises as background scenery.

PARISA: Similarly, if a test starts two operations and only awaits one, the other may still be running when cleanup begins.

JULES: Use the completion strategy that matches the scenario. If both should finish, await both. If one should be cancelled, trigger and observe cancellation as appropriate. If failure should short-circuit, test that contract explicitly.

PARISA: Promise.all is JavaScript, not a runner feature. It waits for all fulfillment values but rejects when one input rejects. That doesn't automatically cancel the other operations.

JULES: Correct. That distinction matters in tests and production. A rejected aggregate promise doesn't mean every underlying task stopped.

PARISA: So teardown must account for resources still active after a failure. Timers, listeners, server connections, and requests can outlive the first rejected promise.

JULES: Exactly. A clean test ends the lifecycle it created, not merely its last assertion line.

## Timeouts Are a Diagnostic Boundary

PARISA: The test times out. Should I raise the timeout?

JULES: First ask why it didn't finish. Did we forget to resolve a deferred promise? Are fake timers frozen? Is the query waiting for a state the component never produces? Is a server unavailable?

PARISA: If the operation legitimately needs more time in this environment, changing the bound can be appropriate. But a longer timeout won't fix a promise nobody can resolve.

JULES: Exactly. And a very large timeout can turn a clear fast failure into an expensive delay. Use bounds that fit the expected operation and investigate changes in behavior.

PARISA: Test timeout and product timeout are also different things. One limits how long the test runner waits. The other is part of the application's handling of a slow dependency.

JULES: Great distinction. To test the product's timeout behavior, control the dependency and clock where appropriate, then assert the product's resulting state. Don't confuse the runner giving up with the application handling the timeout correctly.

PARISA: A red test saying timed out doesn't prove our UI displayed the right timeout message. It may prove we never reached any message at all.

## Debounce Is More Than Waiting Once

JULES: Our earlier timer card demonstrated a single scheduled callback. What would a real debounce test add?

PARISA: Repeated inputs. Type or call with mushroom, advance part of the delay, then provide margherita. The earlier scheduled call should be cancelled or superseded according to the contract.

JULES: Then advance to just before the new deadline and verify no request yet. Advance to the deadline and verify one request with the latest query.

PARISA: Exactly. If we only test one input, an implementation that never cancels old timers can still pass. The defining behavior is how repeated inputs affect scheduling.

JULES: What about an empty query?

PARISA: Decide the product rule. Maybe cancel pending work and clear results. Maybe send no request. That's a separate useful case because it can reveal an old delayed request firing after the field is cleared.

JULES: And unmount?

PARISA: If the component owns the timer, cleanup should prevent an unwanted later action. Test that lifecycle at the appropriate boundary.

JULES: So the test cases come from what debounce is for, not just from the existence of setTimeout.

PARISA: Exactly. We test the behavior that solves the problem. The timer API is the mechanism.

## The Completion Question to Keep Asking

PARISA: I want a debugging question I can carry into any async test.

JULES: Ask: what tells this test that the relevant work is finished? Then point to the actual promise, event, or observed state that answers it.

PARISA: If the answer is “the machine is probably fast enough,” we haven't established completion. If it's “I awaited the click,” ask whether the click helper's completion also includes the later network response.

JULES: Exactly. It often doesn't. Wait for the result of that response separately. Different operations have different finish lines.

PARISA: For a negative assertion, ask when the forbidden action would have had a chance to occur. Checking before that moment can create a false sense of protection.

JULES: And for teardown, ask whether any owned work is still pending. A test that passes but leaks timers or subscriptions can destabilize the rest of the suite.

PARISA: This makes async code less mysterious. We don't need to memorize every event-loop detail before writing a useful test, but we do need to understand the lifecycle we're observing.

JULES: Yes. When a deeper scheduling issue arises, investigate that mechanism. Start with an explicit dependency and completion contract rather than scattering awaits as decoration.

PARISA: Await confetti is not synchronization.

JULES: Another mug.

PARISA: At this point our fictional merchandise operation needs integration tests.

## Okay, That's Why

JULES: Async tests need a meaningful finish line. Await or return the relevant promises, test rejection paths, and wait for conditions rather than arbitrary sleeps.

PARISA: Control responses and clocks when timing is part of the question. Don't confuse fake timers with the network, or a successful retry with an explained failure.

JULES: Next: unit, integration, and end-to-end. Which wires are connected, and how much confidence do we get from each view?

PARISA: The bug can arrive late. Our test no longer leaves the party before checking its coat.

[OUTRO MUSIC]

## Production Notes

- loadMenu uses an injected HTTP-like request dependency; it does not itself perform a real network call in the examples.
- Timer card shares expect, test, and vi imports from the first test card and adds afterEach. It demonstrates timer mechanics, not a tested production debounce utility.
- React controlled-promise use requires appropriate update handling; no arbitrary sleep is recommended.

## Production References

- Jest async completion and rejection patterns: https://jestjs.io/docs/asynchronous
- Testing Library async methods: https://testing-library.com/docs/dom-testing-library/api-async/
- Vitest timers: https://vitest.dev/guide/mocking/timers.html
- user-event fake-timer configuration: https://testing-library.com/docs/user-event/options/#advancetimers
- Fetch response/error distinction: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
