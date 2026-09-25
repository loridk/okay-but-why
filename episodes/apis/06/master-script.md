# Episode 6: Calling an API From JavaScript

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Unrecorded; final timing depends on performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: I wrote a loading spinner.

JULES: Does it stop?

PARISA: That's the next milestone.

JULES: What happens if the request fails?

PARISA: The spinner develops a long-term relationship with the customer.

JULES: Today: how to make a request, understand the result, and release the customer from spinner marriage.

[STING]

## The Code Follows the Story

JULES: Welcome to Okay, But Why? We know the underlying story now. Ask the service for order 42. Receive an HTTP response. Read the body. Interpret the data. Show something useful.

PARISA: Which means the code shouldn't be a collection of ceremonial words. Each step exists because something real happens between our button and our pizza status.

JULES: Exactly. We'll use browser JavaScript and a fictional same-origin endpoint at slash api slash orders slash 42. Same-origin means we're contacting the same scheme, host, and port as the page. CORS gets its own episode.

PARISA: The server must authenticate the customer and authorize access. Our example assumes that server-side contract exists. The number 42 is not a permission slip.

JULES: And this is plain JavaScript. No React, TypeScript, or framework is necessary to explain the request.

## A Promise Is a Future Result

PARISA: Start with fetch returning a promise. Why not return the data?

JULES: Because the data isn't available yet. The environment needs time to perform the request. A promise represents an operation that is pending, then either fulfilled with a value or rejected with a reason.

PARISA: So fetch gives my code something it can use to arrange what happens later, instead of making the whole page stop while the network thinks.

JULES: Exactly. The promise isn't the data itself. And fulfilled doesn't mean “every business objective succeeded.” Fetch can fulfill with an HTTP error response because a response arrived.

PARISA: The result of the request mechanism and the result described by the server are different layers. We've earned that distinction now.

JULES: Promises can be handled with then and catch. Async and await provide another syntax for working with them. The underlying waiting hasn't disappeared.

PARISA: Await looks sequential. It doesn't turn the network into a synchronous local function call.

## Async and Await Belong to JavaScript

JULES: Marking a function async makes it return a promise. Inside it, await pauses that function's continuation until the awaited value settles. The surrounding environment can keep doing other work.

PARISA: It doesn't freeze the browser. And it doesn't make CPU-heavy JavaScript automatically move to another thread.

JULES: Exactly. It's a way to express asynchronous control flow, not a general performance spell.

PARISA: If the awaited promise rejects, that behaves like an exception at the await point, so a try/catch can handle it.

JULES: Right. But if fetch fulfills with a 404 response, nothing has rejected yet. We need to inspect the response ourselves.

PARISA: This is where copying four lines without understanding the layers creates very confident bugs.

## A Small Request Function

[CODE CARD: Retrieve and check a fictional order summary]
```javascript
async function getOrderSummary(signal) {
  const response = await fetch("/api/orders/42", {
    headers: { Accept: "application/json" },
    signal
  });

  if (!response.ok) {
    throw new Error(`Order request failed (${response.status}).`);
  }

  const order = await response.json();
  const allowedStatuses = ["preparing", "baking", "out-for-delivery", "delivered"];

  if (
    order === null ||
    typeof order !== "object" ||
    Array.isArray(order) ||
    order.id !== 42 ||
    !allowedStatuses.includes(order.status)
  ) {
    throw new Error("The order response had an unexpected shape.");
  }

  return order;
}
```

JULES: For listeners: start a request, reject unsuccessful HTTP responses, parse the JSON, check the fields this small example relies on, and return the checked result.

PARISA: That's several meaningful stages. The browser performs the request. Response.ok checks the HTTP status range. Json reads and parses the body. Our own conditions check whether the value resembles the contract we need.

JULES: Exactly. Those checks are deliberately small, not a complete schema for a production ordering system. If we use more fields, we need to validate those too.

PARISA: The signal argument lets a caller request cancellation through an AbortController. And the standalone word signal in the options object is modern JavaScript property shorthand. It means the property named signal gets the value of the variable named signal.

JULES: Good catch. The backtick string is a JavaScript template literal. It inserts the response status into the error message. Neither syntax is TypeScript.

PARISA: And throw makes the async function's promise reject. A caller awaiting getOrderSummary can then handle that failure.

## Why Two Awaits?

PARISA: We await fetch and then await response.json. Explain that without saying “because the docs do it.”

JULES: Fetch provides a Response when status and headers are available. The body may still be arriving. Reading it completely and parsing it is another asynchronous operation.

PARISA: So the first wait is for the response object. The second wait is for the body consumption and parsing result.

JULES: Right. Body consumption generally isn't something you casually repeat on the same response. If you consume the body once, you can't assume it's still unread for another parser.

PARISA: Useful when somebody adds a debugging read and accidentally empties the body before the real code gets it.

JULES: Exactly. And our endpoint contract says success returns JSON. If we were calling an operation returning 204 No Content, we'd handle that outcome instead of blindly parsing an absent body.

PARISA: The request helper should fit the actual operation. We aren't building one magic function that assumes every successful response in the universe is JSON.

## What the Options Mean

JULES: Fetch uses GET by default here. Accept says we can accept JSON. It doesn't force a server to obey, and it doesn't prove the response is valid.

PARISA: For a request that sends JSON, we choose an appropriate method, set Content-Type to application/json, and use JSON.stringify for the body.

[CODE CARD: Illustrative request options for a server-defined operation]
```javascript
const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  body: JSON.stringify({ menuItemId: "margherita", quantity: 1 })
};
// Add the application's required authentication and CSRF protection.
// Use only with an endpoint that defines and accepts this request.
```

JULES: This card only illustrates options. It doesn't execute a purchase, supply complete security, or define what the server must charge.

PARISA: A real cookie-authenticated state change needs the application's CSRF protections. We shouldn't copy this into checkout and assume Content-Type is the security department.

JULES: Correct. And browser fetch includes same-origin credentials by default where applicable. Cross-origin credential behavior has additional options and rules; adding include everywhere isn't a general fix.

PARISA: We will earn that discussion in the authentication and CORS episodes.

## Loading Is a User-Visible State

JULES: Now the request function needs an interface. The user should know a check is in progress and whether it finished.

PARISA: A real button. A status region that can announce concise updates. A result that doesn't rely on color alone. And we keep the rest of the page usable.

[CODE CARD: A small accessible interaction]
```html
<button id="check-order" type="button">Check order status</button>
<p id="order-status" role="status" aria-atomic="true">Ready to check.</p>
<script src="order-status.js" defer></script>
```

[CODE CARD: order-status.js, alongside getOrderSummary]
```javascript
const button = document.querySelector("#check-order");
const status = document.querySelector("#order-status");
const labels = {
  preparing: "Your order is being prepared.",
  baking: "Your pizza is in the oven.",
  "out-for-delivery": "Your order is out for delivery.",
  delivered: "Your order has been delivered."
};

if (button && status) {
  button.addEventListener("click", async function () {
    button.disabled = true;
    status.textContent = "Checking your order…";
    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, 10000);

    try {
      const order = await getOrderSummary(controller.signal);
      status.textContent = labels[order.status];
    } catch (error) {
      status.textContent = controller.signal.aborted
        ? "The check took too long. Please try again."
        : "We couldn't check your order. Please try again.";
    } finally {
      clearTimeout(timer);
      button.disabled = false;
    }
  });
}
```

PARISA: For listeners, pressing the button announces checking, starts a bounded wait, and then presents the result or a useful failure message. Finally restores the button whether the operation succeeded or failed.

JULES: The ten-second timeout is an illustrative product choice, not an HTTP requirement. AbortController requests cancellation of the client operation. It doesn't guarantee that remote work was undone.

PARISA: This particular interaction retrieves data, so retrying doesn't intentionally create another order. We would think much harder about retries for a purchase.

JULES: Exactly. The native disabled state prevents another click while this one is in progress. The live status region announces the text update without us moving focus into it.

PARISA: And we should test this with keyboard and assistive technology in the real page. Adding an ARIA attribute isn't the end of accessibility work.

## Failure Has Several Addresses

JULES: Let's diagnose four different failures. First, the device is offline. Fetch can't provide the response. The operation rejects.

PARISA: Second, the server returns 403. Fetch provides the response; our explicit status check throws. The app may need a more specific message about permission.

JULES: Third, the server returns an HTML login page after a redirect. The final status may be successful, but parsing as JSON fails.

PARISA: Fourth, valid JSON arrives with an unsupported status field. Our shape check rejects it. Different causes, same broad user-facing failure in this intentionally small example.

JULES: A larger application should preserve useful diagnostic distinctions internally and choose appropriate user messages. For example, an expired session may invite sign-in, while a temporary outage may invite retry later.

PARISA: But don't put stack traces, secrets, or private payloads into a visible error box. The person checking dinner doesn't need our infrastructure's autobiography.

JULES: Exactly. Diagnostics for maintainers and communication for users have different audiences.

## A Race You Can Lose While Everything Succeeds

PARISA: Our button disables during the check. What about a search field that starts a request as the user types?

JULES: Two requests may finish out of order. The result for the older query could arrive last and overwrite the newer result.

PARISA: Both servers succeeded. The application still shows the wrong thing.

JULES: Exactly. You can cancel obsolete requests and, where necessary, track which request is current so an old response cannot overwrite the active state. Cancellation alone isn't a complete proof against every race.

PARISA: Which is why asynchronous code requires thinking about time, not merely writing await in the correct places.

JULES: Right. A component framework can help organize state, and a data library can manage caching and requests. But those tools embody policies. We still need to understand which result belongs to which interaction.

PARISA: And if the last known order status is useful, a refresh failure might preserve it while saying it couldn't be updated. Our tiny example replaces the message for clarity; a production design should choose intentionally.

## Test the Outcomes, Not Just the Happy Path

JULES: What would you check before calling this interaction finished?

PARISA: Success, a slow response, a rejected request, an HTTP error, invalid JSON, and valid JSON with an unexpected shape. I'd verify that the button becomes usable again in every case.

JULES: Also that the status announcement makes sense, keyboard focus remains sensible, and unexpected order text isn't treated as executable markup.

PARISA: Our example uses textContent and known labels. It doesn't insert the response directly as HTML. Good default for plain status text.

JULES: And we don't need to hit a live paid service to exercise every UI state. Controlled responses can test those branches.

PARISA: The important test isn't whether fetch appears in the source. It's whether the application behaves honestly when the network isn't having a perfect day.

## Read the Timeline, Not Just the Indentation

PARISA: Let's narrate our function in time. I call getOrderSummary. What exists immediately?

JULES: A promise returned by the async function. The function begins running and reaches its first await. While it waits for fetch, the caller can await that promise or arrange other handling.

PARISA: If I write const order equals getOrderSummary without await, order holds the promise, not the eventual order data.

JULES: Exactly. That's a common source of logging something unexpected or trying to read a property before the value exists. The name order doesn't transform the value into an order.

PARISA: Then fetch fulfills, the function resumes, and we inspect the HTTP status. If that check passes, we start reading the body and wait again.

JULES: Right. After parsing and validation, return order fulfills the async function's promise with that result. If a step throws and isn't handled inside the function, the promise rejects.

PARISA: This lets us separate the data operation from the UI. The helper doesn't need to know which paragraph shows the error; it reports a result or failure to the caller.

JULES: Exactly. That separation can make testing easier without introducing a framework. One function knows the endpoint contract; another coordinates the interaction on the page.

## Catch and Finally Have Different Jobs

PARISA: If catch handles errors, why also finally?

JULES: Catch runs when control reaches it through a thrown error in the try block. Finally runs when that try-and-catch sequence exits, whether the operation succeeded or failed. It's useful for cleanup that must happen either way.

PARISA: Such as clearing our timer and restoring the button. Otherwise the happy path might work while the failed path leaves the button disabled forever.

JULES: Exactly. You could duplicate the cleanup in both success and failure branches, but finally makes the shared responsibility visible.

PARISA: And the failure message should reflect what we know. If we timed out waiting, we shouldn't claim the server is definitely offline. We know our operation didn't complete within the chosen time.

JULES: Right. Good error wording avoids pretending we have information the client doesn't possess.

PARISA: What if an error happens inside the catch block itself?

JULES: It can propagate too. Error-handling code is ordinary code and can fail. Keep it simple, and avoid introducing complicated operations that obscure the original problem.

## Two Requests That Don't Depend on Each Other

JULES: Suppose the screen needs a public menu and the customer's order summary. Neither request depends on the other's result. Must we wait for one before starting the other?

PARISA: No. Starting both can avoid an unnecessary waterfall. But we should decide how the UI behaves if one succeeds and the other fails.

JULES: Exactly. Promise.all is a JavaScript tool for awaiting several operations together. It rejects if one rejects, but it doesn't automatically cancel the others. Promise.allSettled lets us inspect each outcome separately.

PARISA: Those are language tools, not fetch options. And concurrency is useful only when the operations are actually independent.

JULES: Right. If we need the result of the first request to construct the second, pretending they're parallel doesn't remove that dependency.

PARISA: Nor should we start fifty requests at once because parallel sounds fast. We can overwhelm the service, hit rate limits, or create a bad experience on a constrained device.

JULES: Exactly. Coordination includes resource use, not just syntax. Sometimes one endpoint returning the right representation is better than a burst of small requests.

## Don't Turn Every Failure Into a Retry

PARISA: The fetch failed. Should our helper automatically try again?

JULES: It depends on the operation and the failure. A transient retrieval failure may justify a small, bounded retry policy. A forbidden request probably needs a permission decision, not repeated identical requests.

PARISA: And a malformed body will remain malformed until we fix it. Waiting half a second isn't schema validation.

JULES: Correct. Rate-limit responses may provide retry guidance. State-changing operations require particular care because the server may have performed the action before the response was lost.

PARISA: Our status check is a read. A checkout submission is not interchangeable just because both use fetch. A generic retry helper can erase that distinction if we design it carelessly.

JULES: Exactly. Keep the operation's semantics visible. Where the API supports idempotency keys, use them according to its contract. Don't assume a header has magical effects the server never implemented.

## The User Has Left the Page

PARISA: What happens if the user navigates away while the request is in progress?

JULES: The surrounding application may cancel the request or ignore its result. In a component-based application, cleanup often ensures that obsolete work doesn't update a view that no longer represents the original request.

PARISA: Our plain page example doesn't need a component lifecycle, but the principle still applies: a response belongs to a particular interaction and context.

JULES: Exactly. If the user changes accounts or selects another order, an old result shouldn't overwrite the new state. Track which request is current and clear sensitive data appropriately when identity changes.

PARISA: That's both correctness and privacy. Showing the previous customer's order for a moment after an account switch is not merely a cosmetic flicker.

JULES: Right. Client state needs to respect the same identity boundaries as the requests that populate it.

## Walk Through a Failure Without Blaming the User

PARISA: Let's say a customer presses Check order on a train. The connection drops. What should they experience?

JULES: Immediate feedback that a check started, then a clear failure or timeout message. The action becomes available again. If we retain an older status, identify it as the last known result rather than pretending it was freshly retrieved.

PARISA: And if they use a screen reader, the message should be announced appropriately without dragging focus away from their current task. A retry button should have a meaningful label and remain keyboard accessible.

JULES: Exactly. The browser's network condition isn't a moral failing. “Invalid user request” would be a terrible message if the actual problem was connectivity.

PARISA: If the server instead returns a session-expired response, we can explain that sign-in is needed and preserve relevant work. Different failure, different recovery.

JULES: Right. Our small example uses a general message because it introduces the structure. A production interface should refine the outcomes it can reliably distinguish.

## The Helper Isn't a Whole Data Platform

PARISA: Should we immediately turn getOrderSummary into a configurable request factory with eighteen options?

JULES: No. We have one small operation. Keep it understandable. Repeated, genuinely shared requirements may later justify an abstraction or a maintained data-fetching library.

PARISA: Such as coordinating caching, deduplication, background refresh, and many screens. But adding those before they're needed can make one request harder to understand than the network itself.

JULES: Exactly. Learn the underlying behavior first. Then a library becomes a set of useful policies you can evaluate rather than a curtain hiding the entire process.

## The Incantation Becomes a Story

JULES: Fetch starts a request. A promise represents its future result. Async and await let us write the sequence clearly. The response has a status and a body; those need separate handling.

PARISA: Parsing JSON gives us values, not permission to trust them. Runtime checks establish the shape we need. The UI communicates waiting, success, and failure, and cleans up after all three.

JULES: That's the mental model behind the familiar few lines.

PARISA: My spinner now has a retirement plan.

JULES: Next time, the other side. What code receives the request and builds the response?

PARISA: A server written by people who also occasionally forget the finally block.

[OUTRO MUSIC]

## Production References

- Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- Async functions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
- AbortController: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- Status role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role
- Examples require a real same-origin service implementing the documented private-order contract. No service is supplied or contacted. POST options are illustrative and incomplete without application security controls.