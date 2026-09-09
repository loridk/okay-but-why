# Episode 5: JavaScript Finally Learned How to Wait

Status: Draft

**CAST**

PARISA — Experienced millennial web developer. Learned JavaScript before ES6 and has strong traditional web fundamentals. Suspicious of unexplained punctuation.

JULES — Gen Z developer who entered development when modern JavaScript syntax was already normal. Parisa's peer, not her professor.

[MUSIC]

## Cold Open

PARISA: JavaScript has one thread.

JULES: Generally, your main JavaScript execution context runs one call stack, yes.

PARISA: Then explain how it can wait for a network request without freezing the entire universe.

JULES: The environment helps.

PARISA: I knew there was staff.

## Who Asked for This?

JULES: Web applications constantly deal with things that take time: timers, network requests, user events, file operations in some environments.

PARISA: And you cannot stop the main thread until the internet feels ready.

JULES: Exactly. The browser provides asynchronous capabilities, and JavaScript schedules what should happen when those operations complete.

## Callbacks: The Original Arrangement

JULES: Callbacks are just functions passed to be called later.

[CODE CARD]
```js
button.addEventListener("click", function () {
  console.log("clicked");
});
```

PARISA: Nothing wrong with callbacks themselves.

JULES: Correct. The trouble came when complex asynchronous workflows became deeply nested or difficult to coordinate and handle errors across.

PARISA: Callback hell wasn't “callbacks bad.” It was “our control flow now resembles a haunted staircase.”

## Promises Give the Future a Container

JULES: A Promise represents the eventual result of an asynchronous operation: pending, then fulfilled or rejected.

[CODE CARD]
```js
fetch("/api/user")
  .then(response => response.json())
  .then(user => console.log(user))
  .catch(error => console.error(error));
```

PARISA: So instead of handing every function another callback, we get an object representing the future outcome and attach reactions to it.

JULES: Exactly.

## Async and Await

JULES: `async` and `await` arrived after ES2015 and let promise-based code read more like sequential code.

[CODE CARD]
```js
async function loadUser() {
  const response = await fetch("/api/user");
  const user = await response.json();
  return user;
}
```

PARISA: Important question. Does `await` block JavaScript?

JULES: It pauses **that async function's continuation** until the promise settles. It doesn't freeze the browser's whole event loop.

PARISA: So “await makes asynchronous code synchronous” is a useful-looking lie.

JULES: Better to say it gives asynchronous code sequential-looking control flow.

## The Event Loop Without a PhD

PARISA: Give me the event loop version I can keep in my head.

JULES: JavaScript runs work on the call stack. The host environment handles things like timers and network activity. When asynchronous work is ready, callbacks or promise reactions become eligible to run. The event loop coordinates getting queued work onto the stack when the stack is available.

PARISA: So JavaScript isn't secretly doing five things on one stack.

JULES: Right. The environment and scheduling model are doing a lot of the work around it.

PARISA: One cashier, kitchen staff in back, and a system for telling the cashier when an order is ready.

JULES: Good enough until we start discussing workers and runtime internals.

## Fetch Is Not the Same Thing as Async

[STING]

PARISA: `fetch` is JavaScript?

JULES: Careful. `fetch` is a Web API in browsers and is also provided by modern Node environments. `async` and `await` are JavaScript language syntax.

PARISA: There it is. Language versus environment again.

JULES: Exactly.

## Error Handling

JULES: With `async`/`await`, rejected promises can be handled with `try`/`catch`.

[CODE CARD]
```js
try {
  const response = await fetch("/api/user");

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const user = await response.json();
} catch (error) {
  console.error(error);
}
```

PARISA: And `fetch` doesn't reject merely because the server returned a 404 or 500.

JULES: Correct. Network failure and HTTP error status are different things. Check `response.ok` when HTTP status matters.

PARISA: That is exactly the kind of tiny fact that eats an afternoon.

## Parallel Work: Don't Await Too Early

JULES: If two operations don't depend on each other, awaiting the first before starting the second can unnecessarily serialize them.

[CODE CARD]
```js
const userPromise = fetch("/api/user");
const postsPromise = fetch("/api/posts");

const [userResponse, postsResponse] =
  await Promise.all([userPromise, postsPromise]);
```

PARISA: Start both, then wait for both.

JULES: Right. `await` is readable, but placement still affects behavior.

## Please Don't Do This: Floating Promises

PARISA: If I call an async function and ignore the promise?

JULES: Sometimes that's intentional, but unhandled rejection paths can become bugs. Know who owns the error.

PARISA: “Fire and forget” should not mean “fire and become emotionally unavailable.”

## What Did We Actually Learn?

PARISA: Callbacks didn't disappear. Promises gave asynchronous outcomes a standard abstraction.

JULES: `async`/`await` is syntax built on promises.

PARISA: `await` pauses the async function's continuation, not the entire JavaScript runtime.

JULES: And the host environment plus event loop are essential to understanding how asynchronous work fits around JavaScript's call stack.

PARISA: Next: modules. Because apparently we eventually decided one enormous global script file was bad.

