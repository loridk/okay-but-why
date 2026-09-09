# Episode 3: The Request/Response Cycle — I Pressed Enter, Now What?

**Series:** Web Architecture • Episode 3 of 14
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — The Internet Is Thinking

[INTRO MUSIC]

PARISA: I pressed Enter. The browser is spinning.

JULES: Which part is slow?

PARISA: The internet part.

JULES: Excellent incident report. I'll notify the internet department.

PARISA: This is why we're doing the episode, isn't it?

JULES: Welcome to *Okay, But Why?*. I'm Jules.

PARISA: I'm Parisa, and today we turn “the website is broken” into several more useful sentences.

## Start With the Address

JULES: Our fictional address is HTTPS, pizza dot example, slash menu, question mark category equals vegetarian, hash specials.

PARISA: The example domain is deliberately fictional. Please do not send it your dinner money.

JULES: The scheme is HTTPS. It tells the browser the kind of access involved, including using HTTP over a secure connection. The hostname identifies where we're trying to go. The path is menu. The query carries category equals vegetarian.

PARISA: And the fragment, specials, is normally for the browser. It isn't sent as part of the HTTP request target. It might identify a section of the document, or be used by client-side code.

JULES: Right. The server sees the path and query, not that fragment. A port can also appear in the URL; if omitted, the scheme implies a default.

PARISA: This is why two addresses can look similar but be different origins. Scheme, hostname, and port together matter. Different paths on the same origin aren't different origins.

JULES: Also, a path that ends in slash menu doesn't require a physical file named menu. The server can route that path to application behavior.

PARISA: We did that long before frontend routers. A URL is an address the server interprets, not necessarily a tour of its filesystem.

[CODE CARD: URL anatomy; data notation, not JavaScript]
~~~text
https://pizza.example/menu?category=vegetarian#specials
scheme  hostname      path query               fragment
~~~

## Find a Place to Connect

JULES: The browser needs a network destination for the hostname. DNS helps resolve names to records such as addresses.

PARISA: Often using cached information. We are not starting a fresh expedition to the root of DNS every time I click a link.

JULES: Exactly. The operating system, browser, and resolver can have relevant caches. If an answer isn't cached, a resolver can work through the DNS hierarchy to find it.

PARISA: Like looking up a destination, with an important limitation: DNS doesn't retrieve the webpage or choose the application's menu route.

JULES: And the answer may lead to a CDN or load balancer rather than directly to the machine running our application code.

PARISA: So DNS tells us how to reach a service endpoint, not necessarily where the pizza database lives.

JULES: Correct. If DNS fails, we might not reach HTTP at all. The application cannot return a helpful error page for a request that never found its way there.

PARISA: That's already one useful diagnostic distinction. “The server returned an error” and “we couldn't find a destination” are different things.

## Establish the Conversation

JULES: Next we need a connection, unless an appropriate existing one can be reused. The exact sequence depends on the HTTP version and network state.

PARISA: Give us the useful version without pretending every page load is identical.

JULES: HTTP/1.1 and HTTP/2 commonly use TCP, with TLS for HTTPS. HTTP/3 uses QUIC over UDP and integrates TLS-based security. They differ in transport mechanics, but we're still exchanging HTTP requests and responses.

PARISA: So “first TCP, then TLS” is a helpful description for some connections, not a universal law for all modern HTTP.

JULES: Exactly. HTTPS provides encryption in transit and authenticates the server endpoint through certificate checks. It doesn't certify that the business is honest or that the application has no bugs.

PARISA: An encrypted scam remains a scam. It just has excellent transport privacy.

JULES: And if a CDN terminates the customer's secure connection, the connection from that edge to the origin is another part of the architecture to configure securely.

PARISA: Terminate here means handle the end of that connection, not murder the internet.

JULES: Important vocabulary clarification.

## The Request Has a Shape

PARISA: We've reached HTTP. What are we actually sending?

JULES: A method, a target, headers, and sometimes a body. Think of a request for the menu: GET, the menu path and query, plus metadata about the request.

PARISA: HTTP method names are protocol vocabulary, not JavaScript functions. GET asks to retrieve a representation. POST commonly submits something for processing, such as creating an order.

JULES: Headers carry metadata: which formats the client accepts, credentials in appropriate cases, caching conditions, and so on. The body carries submitted data when the operation uses one.

PARISA: An HTML form might send form-encoded fields. A script might send JSON. Neither is automatically safer because of the format.

JULES: And a GET request should not be used to perform an action like deleting an order. Links can be prefetched, crawled, and followed in ways you didn't personally click.

PARISA: Safety here is an HTTP semantic idea: retrieving shouldn't be asking for a business-state change. Logging the request doesn't invalidate that intent, but “GET slash delete-everything” certainly does.

JULES: Idempotence is related but different. Repeating an operation has the same intended effect as doing it once. It doesn't mean every response must have the same bytes.

PARISA: Deleting an already-deleted resource may return a different status, while the final state is still that it's deleted. Creating a new order twice with a naive POST may produce two orders.

JULES: Which is why retries need thought. We can design an order-creation operation with a deduplication key, but POST doesn't give that to us automatically.

## Through the Front Door

PARISA: The request might hit a reverse proxy before our application.

JULES: A service standing in front of the application, handling incoming requests and forwarding them. It might deal with secure connections, routing, compression, or load distribution.

PARISA: It can also reject or answer a request without the application seeing it. So an error response doesn't always originate in our route handler.

JULES: Exactly. The application receives the request, matches the route, checks what it's allowed to do, performs the work, and constructs a response.

PARISA: For a menu request, maybe read current menu data and render HTML. For an order submission, validate inputs, check the shop, calculate the amount, store the result.

JULES: For a static asset, the application code might not participate at all. A file server or cache can return the CSS directly.

PARISA: The diagram's same arrow can hide very different handling, depending on the resource.

## The Response Has a Shape Too

JULES: A response includes a status code, headers, and usually a body, though some responses don't have one.

PARISA: Two hundreds generally indicate successful handling. Three hundreds cover redirection and related cases such as cache validation. Four hundreds indicate a client-side request problem in HTTP terms. Five hundreds indicate server-side failure.

JULES: “Client error” doesn't mean blame the human. The frontend could have sent a malformed request, or the request may lack required credentials.

PARISA: Four-oh-four means the resource wasn't found. Four-oh-one means authentication is required or wasn't accepted. Four-oh-three means the request is forbidden. Applications sometimes deliberately conceal whether a protected resource exists.

JULES: And five-oh-two or five-oh-four can come from an intermediary having trouble with an upstream service. The exact status helps narrow the problem, but it isn't the whole diagnosis.

PARISA: The Content-Type header tells the recipient what kind of body it is receiving. HTML, JSON, an image. “It returned text” isn't enough to determine how it should be interpreted.

JULES: A successful network transfer can carry an HTTP error. For example, browser fetch doesn't reject its promise merely because the response status is four-oh-four. Application code needs to inspect that status.

PARISA: Which we showed last episode with response dot ok. Fetch is the request API; HTTP status is part of its result.

[CODE CARD: Simplified HTTP/1.1 notation; not application source code]
~~~http
GET /menu HTTP/1.1
Host: pizza.example
Accept: text/html

HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<h1>Menu</h1>
~~~

JULES: Read that as “please retrieve the menu as HTML,” followed by “success, here's HTML.” The card shows the readable HTTP/1.1 form for teaching; newer HTTP versions encode messages differently.

## One Page Is Usually Many Requests

PARISA: The HTML arrives. We aren't necessarily done.

JULES: The browser parses it and discovers stylesheets, images, scripts, fonts, and other resources. It may request those, reuse cached copies, and begin rendering while more work continues.

PARISA: So that waterfall in developer tools isn't nineteen websites. It may be one document and the things it needs.

JULES: And the page can trigger additional requests after JavaScript starts. In a client-rendered app, meaningful content may depend on a sequence: download code, run it, request data, update the document.

PARISA: The total experience isn't just “our API responded in fifty milliseconds.” The user had to reach the point where the API request could even begin.

JULES: Exactly. A slow image, render-blocking work, a long JavaScript task, or a chain of dependent requests can all delay usefulness.

PARISA: This is why a loading investigation needs to ask what milestone we're measuring. First response? First content? Able to interact? Order confirmed?

JULES: Those are different measurements. Pick the one that corresponds to the user's problem.

## Stateless Protocol, Stateful Application

PARISA: People say HTTP is stateless, and then websites remember my shopping cart for six months. Explain the apparent betrayal.

JULES: HTTP doesn't inherently turn a series of requests into a persistent application session. The application uses mechanisms to connect them, such as a cookie carrying a session identifier.

PARISA: The server can send Set-Cookie in a response. The browser stores the cookie according to its rules and sends it on matching later requests.

JULES: The application can use that identifier to look up session state. The protocol still has requests and responses; we've built continuity above it.

PARISA: Which isn't the same as keeping one network connection alive. A reused connection is a transport optimization, not proof of who the customer is.

JULES: Great distinction. Session identity must survive normal changes in connections, and a connection isn't a substitute for authentication.

PARISA: We'll spend an entire episode on cookies and sessions. For today, they are part of the metadata story, not supernatural memory.

## Redirects and Form Submissions

JULES: You submit an order form. The server creates the order and may respond with a redirect to its confirmation page.

PARISA: The browser then makes a new request for that page. That's the Post/Redirect/Get pattern, often using a 303 response to direct a GET after the POST.

JULES: It means refreshing the confirmation page normally retrieves the page rather than resubmitting the form body.

PARISA: Helpful, but not a guarantee against duplicate orders. Double-clicking or losing a response can still cause retries before that neat sequence finishes.

JULES: Correct. Server-side duplicate prevention addresses the operation itself. The redirect improves navigation behavior.

PARISA: And a redirect isn't a server internally calling another function. The response tells the client to go somewhere, and the client makes another request.

JULES: Sometimes several times, if you've built a redirect maze.

PARISA: A website with a foyer, a second foyer, and a hallway that returns you to the first foyer.

## The Missing Answer Problem

PARISA: Let's replay our unreliable phone. POST the order. The server saves it. The response vanishes.

JULES: The browser sees a timeout or connection failure. It cannot infer whether the business operation happened.

PARISA: A timeout means we stopped waiting, not that the universe rolled back.

JULES: Exactly. This is why status lookup and stable operation identifiers matter. A retry can refer to the same attempted order rather than inventing another one.

PARISA: The message could say we haven't confirmed the result and are checking. We shouldn't confidently say “nothing was charged” unless we know that.

JULES: Nor should we display an endless spinner. If automatic checking fails, give a clear recovery path and an order reference if available.

PARISA: That is accessibility and reliability sharing a desk. People need a meaningful state they can perceive and act on.

## A Diagnostic Walk Through the Waterfall

JULES: Let's make the listener the detective. The browser says it cannot resolve the hostname.

PARISA: Investigate the name and DNS path. Don't begin by rewriting the checkout component.

JULES: It reports a certificate error.

PARISA: The secure connection wasn't accepted. Investigate certificates, hostnames, validity, and the environment. Don't teach people to bypass the warning as the solution.

JULES: The request returns a four-oh-four.

PARISA: We reached something speaking HTTP. Check the requested path, deployment routing, and which service returned it.

JULES: The HTML is fast but content appears five seconds later.

PARISA: Inspect subsequent resources and browser work. Maybe a large bundle or a request chain. The server's first response time isn't the entire page load.

JULES: The POST returns success, but the staff screen never shows the order.

PARISA: Now we need application-level tracing. What did success promise? Was the order saved? Is the staff view stale? Did a later handoff fail?

JULES: A correlation identifier can help connect the request to logs across relevant components. Keep sensitive customer information out of casual logs.

PARISA: And don't post an unredacted network capture in a public issue. Headers and bodies can contain credentials and personal data.

## Read One Request Like a Story

JULES: Let's imagine the listener has developer tools open. They click the order submit button and see a network entry. Where do they begin?

PARISA: The requested URL and method. Did the browser contact the intended endpoint? Did it send POST, or did a form unexpectedly use GET because the markup was wrong?

JULES: Then the request payload. Does it contain the expected fields and values?

PARISA: Carefully, because the payload can contain private data. This is local debugging, not an invitation to paste the entire request into a public chat.

JULES: Next the status and response body. Maybe the server returned validation errors successfully, but the frontend treated every non-two-hundred status as the same generic failure.

PARISA: Or it returned HTML because the session redirected to login, while our JavaScript expected JSON. The parsing error is real, but the underlying story is an expired session.

JULES: That's a good one. “Unexpected token” can be the last symptom in a longer chain.

PARISA: Exactly. Read the response's content type and the actual route history. Don't start by changing JSON parsing until you know what arrived.

JULES: Then timing. Was time spent establishing a connection, waiting for the first response bytes, or downloading a large body?

PARISA: And be cautious about interpretation. A long wait for the first byte could include server processing and network effects. It suggests where to investigate, not a complete diagnosis from one number.

JULES: Finally, compare the network result with the visible interface.

PARISA: If the server returned a useful error and the page showed nothing, that's an interface-handling problem. If the request never left because client validation blocked it, the backend didn't reject it. Different locations, different fixes.

## Headers Are Not a Secret Compartment

JULES: Sometimes people move sensitive values from a URL into a header and assume they are now invisible.

PARISA: Headers aren't hidden from the client sending them or from the services receiving them. HTTPS protects the transport, but logs and debugging tools may still expose values at endpoints.

JULES: URLs have additional risks because they can appear in history, logs, and sharing. So don't casually put credentials or personal details into query strings.

PARISA: But choosing a body or header doesn't remove the need for secure handling. The complete path matters: collection, transmission, storage, logs, and access.

JULES: The same applies to response headers. They are metadata with defined semantics, not merely a place to stash whatever didn't fit in JSON.

PARISA: And if a proxy or framework sets headers for us, we should know which ones matter to our behavior. Content type, caching, cookie attributes, security policy—those can change how the browser handles the response.

## Reusing Connections Without Mixing Up People

JULES: We said a browser can reuse connections. Does that mean one request must finish before the next begins?

PARISA: The details differ by HTTP version. Modern protocols can support multiple exchanges efficiently over a connection. We don't need to reproduce the transport machinery here to understand that a connection and an application session are separate concepts.

JULES: So ten resources may share transport infrastructure without becoming one HTTP response or one business operation.

PARISA: Exactly. And one user action may trigger several requests. The boundary of the business task isn't necessarily the boundary of a single network message.

JULES: That matters for a checkout with a quote, payment step, and confirmation lookup.

PARISA: Yes. We should identify what each request promises and how they fit into the overall state. A trace of multiple requests can reveal the workflow; one isolated response can be misleading.

## The Difference Between Slow and Stuck

JULES: A request has been pending for a long time. Should the interface wait forever?

PARISA: Usually no. Define a timeout or recovery policy appropriate to the operation. But remember that stopping the wait doesn't prove the server stopped the work.

JULES: For a menu read, a retry button might be enough. For an order submission, checking the existing attempt is safer than creating another one.

PARISA: And the message should match our knowledge. “Still checking your order” is different from “please submit again.” We should not offload an unresolved distributed-system problem onto the customer with a cheerful button.

JULES: What about the browser's own loading indicator?

PARISA: It tells the user something about navigation, but our application may have asynchronous work beyond that. We need our own meaningful status where the task requires it.

JULES: So a page can be fully loaded while an order is still pending.

PARISA: Correct. Document loaded, request completed, payment settled, and pizza delivered are four different milestones. We should avoid giving all of them a variable called done.

## A Small HTTP Design Review

JULES: Last exercise. The menu endpoint returns two hundred with a body saying error true whenever the server breaks. Is that useful?

PARISA: It can confuse monitoring and clients if the status no longer reflects the handling. Design consistent semantics. We don't need to force every business condition into a different status, but the contract should be deliberate.

JULES: The cancellation operation is a GET link.

PARISA: Change the design. Retrieval semantics shouldn't request a consequential mutation. Also enforce authorization and relevant cross-site request protections.

JULES: A created order returns a reference and an explicit pending-payment state.

PARISA: Good, if that's the actual state and the client knows how to reach a final outcome. The response should not call it confirmed merely because the database insert succeeded.

JULES: We can now review behavior without implementing a web server from scratch.

PARISA: Which was the goal. Understanding the protocol should make our work clearer, not give us a new unpaid infrastructure project.

## When This Knowledge Helps

JULES: You don't need to implement DNS or TLS to write a pizza site. But knowing the stages lets you locate a problem and ask the right question.

PARISA: It also makes performance advice less mystical. Reuse a cached resource, reduce an unnecessary round trip, avoid waiting for code that doesn't help the current task.

JULES: And it helps distinguish network success from business success. HTTP can report that a request was accepted for later processing without promising that the later work is complete.

PARISA: If our API uses 202 Accepted, the interface needs a pending state and some way to learn the eventual result. The status isn't a shortcut to “done.”

JULES: Exactly. Protocol semantics support the design; they don't replace it.

## Closing — A More Useful Spinner

PARISA: We started with an address, found a destination, established a connection, sent an HTTP request, ran the relevant handling, received a response, and fetched whatever else the page needed.

JULES: With caches, reused connections, and different transports making the real path vary.

PARISA: The browser spinner now contains distinguishable problems. A terrible slogan, but a useful skill.

JULES: Next time, we build on the document response: static sites, server rendering, and why the old web still has several good ideas.

PARISA: I shall bring my PHP experience and one tasteful historical grievance.

JULES: Only one?

PARISA: Per request.

[OUTRO MUSIC]

## Production Notes

- URL, HTTP, and HTML examples are explicitly protocol/data/document notation, not JavaScript or TypeScript.
- DNS and transport descriptions are intentionally conceptual; the script does not claim every navigation makes a new DNS lookup or TCP connection.
- HTTP status examples describe semantics, not a complete error-handling policy.

## Production References

- MDN, Overview of HTTP: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview
- MDN, HTTP/3: https://developer.mozilla.org/en-US/docs/Glossary/HTTP_3
- MDN, HTTP response status codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
- MDN, 303 See Other: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/303
