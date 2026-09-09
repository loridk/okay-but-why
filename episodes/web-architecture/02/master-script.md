# Episode 2: Client vs Server — Whose Computer Is This?

**Series:** Web Architecture • Episode 2 of 14
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — A Very Affordable Pizza

[INTRO MUSIC]

PARISA: Good news. I used the browser developer tools and made every pizza cost one cent.

JULES: On your screen.

PARISA: An important market.

JULES: Does the server agree?

PARISA: The server has declined my economic reforms.

JULES: Today on *Okay, But Why?*: why your browser isn't in charge of the restaurant.

PARISA: I'm Parisa.

JULES: I'm Jules. Last time we mapped Nervous Robot Pizza Delivery. Now we're drawing the line between the client and the server.

PARISA: A line that got visually confusing when everybody started writing JavaScript on both sides.

## Roles, Not Species of Computer

JULES: A client requests something from a service. A server provides the service. For our website, the browser is a client of the web application.

PARISA: Those are roles. A server doesn't have to be a particular shape of metal box. My laptop can run a development server.

JULES: And our application server can itself be a client when it asks a payment provider to do something.

PARISA: So a single program can answer requests in one relationship and make requests in another. It's not born into the server caste.

JULES: Exactly. Also, people use “server” to mean the program, the machine running it, or an entire hosted service. Ask which meaning matters in the conversation.

PARISA: “The server is down” is often the beginning of an investigation masquerading as the conclusion.

JULES: We have a browser on the customer's device, application code in our controlled environment, and a database service. For today's purposes, that's the main division.

PARISA: Controlled doesn't mean invulnerable. It means we deploy that code, configure its permissions, and decide what it is supposed to enforce.

JULES: Meanwhile the customer's browser belongs to the customer. They can change code, send different requests, use a different client, or never load our interface at all.

PARISA: Which is normal. The interface isn't a security checkpoint everybody must politely walk through.

## A Useful Division of Labor

PARISA: The browser is very good at reacting to a human. Focus, typing, opening menus, showing a selected topping immediately.

JULES: Yes. It has the document, input events, and local display. Sending every keystroke to a server just to decide whether a help panel should open would be unnecessary work and delay.

PARISA: The server is the right place for authoritative rules. Is this item available? Is the shop accepting orders? What does it cost? May this person view order 417?

JULES: It can access resources the browser shouldn't have, like database credentials and private service keys. Its answers still depend on correct code and configuration.

PARISA: Then some work happens in both places. Input validation, for example.

JULES: The browser can immediately say a delivery address is missing. That saves a trip over the network and helps the customer correct it.

PARISA: The server must check too, because a request can arrive without our browser checks ever running.

JULES: Same business rule, different purpose. Client validation helps interaction. Server validation protects the operation.

PARISA: And server-side validation isn't automatically accessible feedback. We still have to return the errors in a form people can understand and associate with the fields.

JULES: Keep entered values where appropriate, identify the specific problem, and make the errors discoverable. Don't erase the entire form because someone forgot an apartment number.

PARISA: “Incorrect form” is not feedback. It's a disappointed fortune cookie.

## The Price Is an Estimate Until the Server Confirms It

JULES: Imagine the browser displays a subtotal as toppings change. That's useful local calculation.

PARISA: But the request should describe what I'm buying, not demand that the server accept the total my tab invented.

JULES: Exactly. Send the item identifiers and quantities. The server looks up current prices and rules, calculates the accepted amount, and returns it.

PARISA: What if the price changed while the customer was deciding?

JULES: Then the product needs a policy. Maybe the server returns the revised quote and asks for confirmation. Maybe there is a time-limited quote identifier. The important thing is to avoid silently charging an amount the customer didn't agree to.

PARISA: So “the server decides” doesn't excuse bad communication. We need agreement between the human and the system, not merely agreement between two machines.

JULES: That's why architecture and user experience meet at boundaries. What is a preview? What is an accepted commitment? What happens if those differ?

PARISA: I used to do this in PHP. Validate the form, look up prices, write the order, render a result. The shape isn't new.

JULES: The browser might now update more of the interface locally. The authority question is still the same.

## Same Language, Different Environment

[STING: WAIT, THAT'S JUST JAVASCRIPT]

PARISA: Let's make the modern JavaScript confusion explicit. If I see an async function, have I crossed into Node?

JULES: No. `async` and `await` are JavaScript language syntax. They can appear in browser code and server code. They describe how a function works with promises, not where it's running.

PARISA: The promise represents an eventual result or failure. Await pauses that async function's continuation until the promise settles; it doesn't freeze the whole browser while pizza travels across the internet.

JULES: Exactly. `fetch` is an API for making requests, available in modern browsers and also in environments such as Node. Seeing it doesn't locate the program either.

PARISA: But `document.querySelector` points toward a browser document environment. Node doesn't normally have the browser's document object.

JULES: And access to the server filesystem is an environment capability. A browser page can't simply import a Node filesystem module and read arbitrary files on the hosting machine.

PARISA: TypeScript annotations don't change any of that. They help the development-time checker reason about values. They don't provide runtime authority or magically make network data trustworthy.

JULES: Let's look at a tiny function as a reading aid. No one needs to memorize it.

[CODE CARD: JavaScript request example, not a complete ordering interface]
~~~javascript
async function readMenu() {
  const response = await fetch('/api/menu');
  if (!response.ok) {
    throw new Error('The menu could not be loaded.');
  }
  return response.json();
}
~~~

PARISA: In words, request the menu, check whether the HTTP response reports success, and parse the body as JSON. The caller still needs to handle failures and validate the returned data before relying on its shape.

JULES: Correct. `const` declares a binding we won't reassign. The dot calls and function declaration are JavaScript. JSON is a data format. The URL names an application endpoint. None of this is JSX or TypeScript.

PARISA: And a successful HTTP status doesn't mean the parsed data is what we expected. That check belongs at the boundary too.

JULES: Exactly. The short example illustrates the request, not an entire resilient data layer.

## The File Is Not the Boundary

PARISA: Here's where modern frameworks make me suspicious. A file looks like a component, but apparently some of it runs on the server.

JULES: Frameworks can arrange for different modules or functions to execute in different environments. Their conventions vary. You need the framework's actual rules, not a guess based on whether the file contains JavaScript.

PARISA: So a server-only function may read a secret. But if it returns that secret as part of the data sent to a component in the browser, we still leaked it.

JULES: Exactly. “It ran on the server” doesn't mean “nothing it produces is public.” HTML, JSON, serialized component data, and browser bundles can all carry information to the client.

PARISA: Same with environment variables in frontend tooling. Some are deliberately substituted into the browser bundle during a build. Calling a value an environment variable doesn't promise secrecy.

JULES: The practical check is: does this value end up in anything sent to the browser? If yes, assume the recipient can inspect it.

PARISA: Minification isn't encryption. It's just code with a bad haircut.

JULES: And a private API key doesn't become safe because the variable name contains SECRET in capital letters.

PARISA: That is merely shouting during the incident.

## Private Operations Need a Trustworthy Door

JULES: Why not let the browser talk directly to the order database?

PARISA: Some platforms support carefully constrained client access through a service with access rules. But shipping broad database credentials to a browser is a disaster.

JULES: Right. If you choose a client-access platform, the service and its policies still enforce the boundary. The browser didn't become trusted. You moved where the enforcement happens.

PARISA: For our baseline, the application receives the operation, validates it, checks the current user's permission, and uses limited database access to perform it.

JULES: That also gives us somewhere to enforce cross-field rules. A delivery order needs a deliverable address. A pickup order shouldn't require one just because the form had a field.

PARISA: It gives us a place to decide what data comes back, too. The staff view might include delivery details. The public menu certainly shouldn't.

JULES: A response should include what that recipient needs, not an entire database record because serialization was convenient.

PARISA: “The frontend doesn't display that field” does not mean the field wasn't disclosed. The network response is already on the customer's computer.

## Latency Is Part of the Experience

PARISA: Suppose every topping click waits for the server before the interface reacts. We have technically centralized all the logic and emotionally lost the customer.

JULES: Network round trips take time and can fail. Local interaction can be immediate. That's a reason to keep some state and behavior in the browser.

PARISA: But not a reason to pretend the server has accepted something before it has.

JULES: We can show a tentative update. For example, the cart can display the chosen topping immediately, then reconcile with the server's quote.

PARISA: Optimistic interface behavior. We predict success to make the interaction feel responsive, with a plan if the prediction is wrong.

JULES: Exactly. Appropriate for some reversible changes. More delicate for payments or scarce inventory. You wouldn't announce “paid” merely because the button was clicked.

PARISA: And a pending state should say what's happening. Not lock the screen in a spinner with no explanation and no recovery.

JULES: Status updates should be available to assistive technology without announcing every tiny change. The user needs to know that submission started, succeeded, or needs attention.

PARISA: Architecture decides whether we even have those states to communicate. The interface can't explain a distinction the backend refuses to represent.

## A Request Is Not a Remote Function Call With Perfect Manners

JULES: Within one process, a function call has certain expectations. Across a network, we gain new uncertainty.

PARISA: The request can disappear. The response can disappear. The service can be slow. The client can give up while the server keeps working.

JULES: And cancelling a browser request doesn't necessarily undo work already started on the server.

PARISA: That one deserves a second. I close the tab after pressing order. The restaurant doesn't necessarily unmake the pizza.

JULES: Correct. A transport cancellation and a business cancellation are different operations. Cancelling an order needs an explicit rule and server-side handling.

PARISA: This is where remote-procedure-call abstractions can be pleasant but dangerous if they hide the network in our mental model.

JULES: You may write code that resembles calling a local function. It still crosses a boundary with latency, authorization, serialization, and failure.

PARISA: We can use convenient tools and still remember what they are doing. That's the whole show, frankly.

## Development Can Hide the Distance

PARISA: On my laptop, the browser, development server, application, and database might all be nearby. Everything feels instant.

JULES: Then production puts the customer on a slow phone and the server across a continent. Assumptions change.

PARISA: A development proxy might also make browser requests look same-origin while the deployed frontend and API have different origins. Suddenly we meet CORS.

JULES: Which we'll explain properly in the API episode. For now, origin means the scheme, host, and port combination. Browser rules care about that boundary.

PARISA: And the deployment needs to match the intended request path. “It worked through my development proxy” isn't proof that the production URLs and credentials behave the same way.

JULES: Test the actual interaction in something representative. Slow the connection. Refresh a route. Expire a session. Use the keyboard. Read the resulting messages.

PARISA: Not as punishment. As a way to expose assumptions while they are still cheap to change.

## A Cart in Two Tabs

JULES: Let's test the boundary with a situation that feels mundane. The customer opens two tabs. In one, they add mushrooms. In the other, they remove cheese.

PARISA: First question: are these two independent drafts or two views of one shared cart? The product must decide. Otherwise each developer invents an answer locally.

JULES: Suppose it's one account cart shared across tabs and devices.

PARISA: Then browser memory alone isn't enough. Each tab has a local representation, and some server-side operation coordinates the shared cart. Updates can conflict or arrive in an unexpected order.

JULES: We could send the entire cart every time.

PARISA: Then an old tab might overwrite newer changes. Or we could send operations like add this item, but those need well-defined behavior too. Repeating “add one” is different from repeating “set quantity to two.”

JULES: That's idempotence showing up before the final purchase.

PARISA: Exactly. The right design depends on the experience. We might use versions to reject stale changes, or merge certain operations. But we should not accidentally pretend two computers share one memory object.

JULES: What if the cart is only local to this device?

PARISA: That's simpler and can be acceptable if the product says so. Persisting a draft in browser storage can help survive refresh, but people may clear it and it doesn't automatically appear on another device.

JULES: So even “save my cart” needs a definition.

PARISA: Yes. Save where, for whom, for how long, and with what conflict rules? The verb is doing an unreasonable amount of unpaid work.

## Validation Has More Than One Layer

JULES: You said basic shape validation and business validation. Can we separate those with a quantity example?

PARISA: A request says quantity is the string banana. That's the wrong kind of value for our operation. Another says quantity is negative three. It may be numeric but outside the allowed range.

JULES: Another asks for three pizzas when only two can be accepted.

PARISA: That's a current business constraint. It may require coordinated access to server-side state, not merely checking a static schema.

JULES: And another asks to change a completed order belonging to someone else.

PARISA: Authorization and state-transition rules. A request can be perfectly well shaped and still be forbidden or no longer valid.

JULES: So runtime schemas can help with structure, but they don't magically answer every business question.

PARISA: Exactly. TypeScript helps us write the code. Runtime validation checks actual values. Authorization checks permission. Business rules check whether the operation is allowed in the current situation. They cooperate.

JULES: Can we share validation code between client and server?

PARISA: Sometimes, if it's pure and suitable for both environments. But the server remains responsible, and browser bundles should not include private dependencies or rules that expose secrets. Shared source isn't the same as shared trust.

JULES: Also the client may be running an older deployed version.

PARISA: Important. A tab can stay open across a server deployment. The server can't assume every request was created by today's frontend code.

## The Boundary During a Deployment

JULES: We changed the order form yesterday, but someone has an old tab open. They submit today.

PARISA: The backend should handle compatible old input or return a clear recoverable response. If we removed a required option without planning, the customer can lose work or hit a confusing failure.

JULES: That sounds like API compatibility, even for our own frontend.

PARISA: It is. Browser code is distributed to users. We don't get to replace every copy simultaneously just because we clicked deploy.

JULES: So a simple server-rendered flow may reduce some long-lived client-code concerns, while a rich client needs deliberate version transitions.

PARISA: Though server-rendered forms can also be old when submitted. The general rule is that inputs may reflect an earlier view of the world.

JULES: We can return a message explaining that the menu changed and let the customer review, rather than crashing because a field disappeared.

PARISA: Exactly. It's another reason to represent business outcomes explicitly. “This quote expired” is more useful than “undefined is not a function.”

## The Convenient Public Key Question

JULES: Some services give us a key they explicitly call publishable. Doesn't that contradict keeping keys out of the browser?

PARISA: No. The important distinction is the authority the value grants. Some identifiers or narrowly scoped public keys are designed to be exposed. A private credential is not.

JULES: So don't infer secrecy from the word key alone. Read the provider's intended usage and restrictions.

PARISA: And don't infer safety from seeing somebody else's tutorial put a key in a component. We need to know what that value can do, not whether it has attractive naming.

JULES: The browser may need public configuration such as an endpoint URL. Hiding that URL doesn't secure the endpoint.

PARISA: Precisely. The server protects operations through real controls. Security by hoping nobody opens the Network panel is a very short-lived strategy.

## Divide the Pizza Work

JULES: Let's do a classification round. Open and close the topping selector.

PARISA: Browser. Native controls where possible. No request needed just to reveal some options.

JULES: Determine whether this customer may view an order.

PARISA: Server-side authorization for every relevant request. Hiding the link in the browser is helpful interface behavior, not enforcement.

JULES: Check that the address field isn't empty.

PARISA: Both. Browser for immediate feedback, server because requests are untrusted. And whether an address is required depends on pickup versus delivery.

JULES: Send a receipt using a private email-service credential.

PARISA: Server environment. Probably follow-up work after the order is safely recorded, as we discussed last time.

JULES: Remember which accordion was open.

PARISA: Probably client state. Unless the product has a real reason to synchronize that preference across devices, don't put every twitch in the database.

JULES: Calculate the final payable amount.

PARISA: Server authority. Browser can preview it, but the accepted quote and payment must agree.

JULES: Render the menu HTML.

PARISA: Could happen before deployment, at request time on a server, or in the browser. We need the freshness and experience requirements before choosing.

JULES: That's the interesting answer. Client-versus-server isn't a universal rule assigning all presentation to one side.

PARISA: It's a set of tradeoffs under a very firm trust distinction.

## When More Client Work Helps, and When It Doesn't

JULES: Rich local interaction helps when people manipulate substantial temporary state: maps, editors, complex filtering, dispatch planning.

PARISA: It can reduce repeated full-page navigation and keep work responsive. But it also means downloading and running code on devices we don't control.

JULES: More server work can reduce browser code and keep data access close to the database. But requests introduce waiting, and server capacity isn't infinite.

PARISA: Neither “everything in the browser” nor “everything on the server” is a virtue by itself. We choose where each responsibility belongs.

JULES: Our customer ordering flow may be mostly server-rendered, with small browser enhancements. Our dispatch screen may justify more client state. Both can talk to the same application.

PARISA: Which avoids rebuilding the business rules twice merely because one page is more interactive.

JULES: And a shared language can help with some shared data descriptions or pure calculations, but it doesn't eliminate runtime validation or different security responsibilities.

PARISA: TypeScript can help us agree on what we expect. The server still needs to verify what actually arrived.

## Closing — Follow the Value

PARISA: When code looks confusing, ask where it runs, what capabilities it has, what information it sends out, and who can change its inputs.

JULES: The browser manages the human interaction. The server enforces the authoritative operation. Some calculations and validation happen in both places for different reasons.

PARISA: And the same language on both sides doesn't dissolve the network into a pleasant JavaScript soup.

JULES: Next time, we follow an actual request: URL, DNS, connection, HTTP, response, and all the places your page load can take an unexpected lunch break.

PARISA: My one-cent pizza experiment has been rejected, but I now understand the appeal process.

JULES: There isn't one.

PARISA: Terrible API design.

[OUTRO MUSIC]

## Production Notes

- Syntax labels: async/await and const are JavaScript; fetch is an environment API; JSON is a data format; TypeScript checking does not validate runtime network input. No JSX is used.
- The code card is intentionally a small request-reading example, with missing caller/error/data-validation responsibilities stated in dialogue.
- Next episode expands HTTP; Episode 6 expands CORS; Episode 7 expands authorization and sessions.

## Production References

- MDN, Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- MDN, CORS guide: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
