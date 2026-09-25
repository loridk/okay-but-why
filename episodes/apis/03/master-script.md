# Episode 3: HTTP: The Thing Underneath the API

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Target approximately 30 minutes; final timing depends on the recorded performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: The API is broken.

JULES: What happened?

PARISA: I asked it for something and I didn't get the thing.

JULES: Did the request leave the browser?

PARISA: Unclear.

JULES: Did the server respond?

PARISA: Also unclear.

JULES: What was the status?

PARISA: Emotionally? Deteriorating.

JULES: Today we're giving that sentence some more useful nouns.

PARISA: Good. Because “the API is broken” is currently doing the work of nine separate incident reports and a small scream.

[STING]

## HTTP Is an Agreement About Messages

JULES: Welcome to Okay, But Why? We know why a program might ask a web service for data. Now let's follow the request. HTTP stands for Hypertext Transfer Protocol.

PARISA: Expand protocol before we wave respectfully at it and move on.

JULES: A protocol is an agreed set of communication rules. HTTP defines things about requests and responses: how an operation is identified, how information accompanies it, and how the result is described.

PARISA: So if our order service has an API, HTTP supplies a common messaging model underneath that service's specific meaning.

JULES: Exactly. HTTP can tell us that we're making a GET request and that the server returned a successful response. Our application's contract tells us what an order is and what its status field means.

PARISA: HTTP has no opinion about whether extra pineapple is a cry for help.

JULES: Neither do we. This is a supportive podcast.

PARISA: Fine. The protocol remains neutral on fruit.

JULES: HTTP also carries ordinary webpages, images, downloads, and many other things. HTTP and API aren't synonyms. A local library API doesn't inherently use HTTP, and an HTTP response doesn't have to be an API's JSON result.

PARISA: We are keeping the layers apart so we can understand where a problem lives.

## Client and Server Are Roles

JULES: For an HTTP exchange, the client initiates a request. The server handles it and returns a response.

PARISA: The client could be a browser, a phone app, a command-line tool, or another server-side program. It's a role in this conversation.

JULES: Right. Our order application can act as a server when answering the customer's browser, then act as a client when it contacts another service.

PARISA: One program can have both jobs. We don't have to repaint the computer every time it changes roles.

JULES: And “server” might mean the software handling requests, not just a particular physical box. There can be intermediaries such as proxies and caches along the way.

PARISA: Which means a response can come from something other than the exact application process I imagined. A cache might satisfy a request. A gateway might return an error before our route handler runs.

JULES: Yes. We'll keep the simple request-response picture, but we shouldn't mistake it for a complete map of the infrastructure.

PARISA: The point for debugging is that “I got a response” and “my application code definitely ran” are different claims.

## Start With a Specific Question

JULES: Our fictional Nervous Robot Pizza Delivery customer wants the status of order 42. The service contract says an authorized customer can retrieve an order summary at a particular URL.

PARISA: Uniform Resource Locator. An address identifying where we're asking for something. Please don't make me memorize what every letter stands for before dinner.

JULES: You won't have to. Listen to the pieces in this example: HTTPS, orders dot example, slash orders slash 42, and an optional query asking for a summary view.

[CODE CARD: An illustrative URL]
```text
https://orders.example/orders/42?view=summary

scheme: https
host: orders.example
path: /orders/42
query: view=summary
```

PARISA: The example domain is fictional. Nobody should expect it to deliver actual pizza or actual data.

JULES: The scheme tells us the kind of access. HTTPS is HTTP using transport protection. The host identifies the service's host name. The path identifies the resource within that service. The query carries additional parameters according to the application's rules.

PARISA: And view equals summary is our invented API contract. HTTP itself doesn't define that query's meaning.

JULES: Exactly. Another service could use different parameter names, or no query at all. A URL can also include a port. HTTPS normally uses port 443 when none is specified.

PARISA: What about the hash bit, the fragment, like section two at the end of a page link?

JULES: The fragment isn't sent as part of the HTTP request target. Browsers often use it for a location within a document, and applications can use it in other client-side ways.

PARISA: So if I put an API parameter after a hash and expect the server to see it, I've mailed a letter with the important instruction still on my desk.

JULES: Correct. And URLs are poor places for secrets. They may show up in logs, browser history, copied links, and other surfaces.

PARISA: HTTPS protects transport. It does not make every place we store or display a URL private.

## The Method Says What Kind of Request

JULES: The URL isn't the whole request. We also choose an HTTP method, sometimes called a verb. For retrieving the order summary, we use GET.

PARISA: GET asks to retrieve a representation. A representation is some transferable description of the thing, not the physical pizza and not necessarily our database row.

JULES: Right. POST asks the target to process submitted content according to its semantics. It's often used to create something, but “POST means create” is too narrow as a definition.

PARISA: PUT and PATCH commonly appear when changing things. DELETE requests removal of the target's association with its current functionality. We'll use less stiff language when we explore actual design choices next episode.

JULES: Yes. Today the key is that methods have defined semantics. They're not arbitrary colored labels you can swap without consequences.

PARISA: A GET request should not mean “charge this customer's card.” Browsers, crawlers, caches, and other software may treat retrieval differently from an operation that deliberately changes state.

JULES: Exactly. GET is defined as safe: the client isn't requesting a state change as its purpose. Incidental effects, such as logging, don't change that meaning.

PARISA: And choosing the correct method does not authenticate anyone. A DELETE request from an unauthorized caller still needs to be rejected.

JULES: Right. Method semantics and permission checks solve different problems.

PARISA: Here's a practical surprise for newcomers: the same path can support different methods with different operations. The address alone may not identify the whole endpoint behavior.

JULES: Yes. When reporting an issue, include the method as well as the URL, with sensitive details removed.

## Headers Add Context

JULES: Headers carry additional information about the request or response. Think of them as named pieces of context attached to the message.

PARISA: Such as what kind of content is being sent, what kind the client prefers to receive, or instructions affecting caching.

JULES: Exactly. A request can have an Accept header indicating acceptable response formats. A message with a JSON body can use Content-Type to identify that body's format as JSON.

PARISA: Let me keep those straight. Accept describes what I can accept back. Content-Type describes the content in this message. They aren't two interchangeable ways of announcing enthusiasm for JSON.

JULES: Correct. And a GET request without a body generally doesn't need a Content-Type header just because the client hopes to receive JSON.

PARISA: Because there is no request body whose type we're describing.

JULES: Right. Responses have headers too. The server can use Content-Type to identify its response body, or cache-related headers to describe permitted reuse.

PARISA: Credentials may travel in headers as well, depending on the authentication mechanism. That means headers aren't automatically harmless debugging text. Don't paste a real authorization value into a public issue.

JULES: And browser JavaScript doesn't have unrestricted control over every header. The browser manages some details itself.

PARISA: Which is reasonable. “It's a JavaScript option” should not mean “you may impersonate every part of the networking stack.”

## The Body Carries Content

JULES: A request can also have a body containing content for the operation. An order submission might include selected menu items and delivery details.

PARISA: In an ordinary form, the browser might encode form fields. In another request, our code might send JSON. A file upload uses different considerations. HTTP isn't married to one format.

JULES: Exactly. The receiving service must know which formats it accepts and interpret the content accordingly.

PARISA: And validate it. Content-Type saying JSON doesn't mean the body is well-formed, reasonable, or authorized.

JULES: Right. Nor does it mean the numbers are truthful. Our server should calculate trusted prices from trusted rules instead of accepting the client's total as a commandment.

PARISA: A body can describe a requested change. It does not appoint the caller chief financial officer.

JULES: For our simple GET request, we aren't sending a body. The path identifies order 42; a documented query can choose the view. GET request bodies don't have generally defined semantics, and browser fetch doesn't allow a GET or HEAD body.

PARISA: So we shouldn't teach a GET body as a cute place to tuck extra parameters. Use the interface the service actually defines.

JULES: Correct. And not every response has a body either. Some outcomes deliberately return none. We'll come back to that when parsing enters the story.

## Put the Request Together

[CODE CARD: Simplified HTTP/1.1-style request for discussion]
```http
GET /orders/42?view=summary HTTP/1.1
Host: orders.example
Accept: application/json
```

PARISA: For listeners, that card says: retrieve the summary of order 42 from our fictional host; we'd like JSON. It leaves credentials out of the illustration. The real private-order operation still needs authorization.

JULES: Exactly. This is a readable HTTP/1.1-style sketch, not a complete capture and not the literal wire format for every HTTP version. HTTP/2 and HTTP/3 carry the concepts differently.

PARISA: We don't have to learn every transport detail to follow the message. But we also shouldn't think all HTTP traffic is literally a few lines of text floating through a cable.

JULES: Right. The enduring mental model is a target, a method, headers, and content when appropriate.

PARISA: And when I use fetch, I usually don't assemble that whole message by hand. The browser does work based on the URL, options, environment, and its rules.

JULES: Exactly. An API for making requests saves us from writing the entire protocol implementation.

## What Happens Between Here and There?

PARISA: We have a request in our minds. How does it reach the service?

JULES: At a high level, the browser determines where to connect, often using DNS to resolve a host name. It establishes or reuses suitable connections and, for HTTPS, uses a protected connection with server identity checks.

PARISA: Often and reuses are doing honest work there. We don't necessarily do a fresh DNS lookup and a brand-new connection for every request.

JULES: Exactly. Caches, connection reuse, proxies, and browser features can change the physical path. Some requests may be satisfied without a fresh trip to the origin server.

PARISA: The important point is that fetch asks the environment to perform an operation. It doesn't teleport into the database.

JULES: Right. When a request reaches the application, routing chooses the code responsible for that method and path. That code can inspect credentials, enforce permission, validate inputs, and perform the relevant work.

PARISA: Maybe a database lookup. Maybe an in-memory value. Maybe another service call. HTTP doesn't require a database to be present.

JULES: Then the server constructs the response: an outcome status, headers, and a body if appropriate.

PARISA: Somebody wrote that server code. We will meet that somebody, conceptually, in Episode Seven. No wizard behind the status field.

## Read the Response in Layers

[CODE CARD: Simplified response with fictional order data]
```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{"id":42,"status":"baking","estimatedMinutes":18}
```

JULES: For listeners: the request succeeded. The content is identified as JSON. The response instructs caches not to store it. The body describes order 42 as baking, with an estimate of eighteen minutes.

PARISA: This is still a simplified sketch. But it gives me three different questions. What was the HTTP outcome? How should I interpret the content? What does the application data say?

JULES: Exactly. Two hundred doesn't mean the pizza has arrived. It means this HTTP request succeeded according to its semantics. The body tells us the order's situation.

PARISA: And the application's contract must define eighteen minutes until what. Until delivery, in our example. It's an estimate, not a guarantee that the driver can bend spacetime.

JULES: Right. This is where our API-specific agreement adds meaning that HTTP cannot supply.

PARISA: Also, no-store is a caching instruction, not a way to stop an authorized recipient from remembering information they've received.

JULES: Correct. It doesn't replace access control or make the response invisible to the receiving program.

## Status Codes Are Categories, Not a Personality Test

JULES: HTTP status codes describe the response outcome. Broadly, the one hundreds are informational; two hundreds indicate success; three hundreds involve redirection or related follow-up handling; four hundreds indicate a problem associated with the request; five hundreds indicate a server-side failure to fulfill an apparently valid request.

PARISA: And four hundred doesn't mean the human is morally responsible. Bad frontend code can produce a bad request. An expired session can happen during ordinary use.

JULES: Exactly. Names and categories guide handling; they don't assign blame in a meeting.

PARISA: Give us a few useful landmarks rather than a phone book.

JULES: Two hundred commonly accompanies successful retrieval. Two oh one means created. Two oh four means successful with no response content. Four hundred is a bad request. Four oh one indicates missing or invalid authentication credentials, despite its historical name Unauthorized.

PARISA: Then four oh three is forbidden: the server refuses the request. Often that's an access decision, although we shouldn't reduce every possible reason to one sentence.

JULES: Right. Four oh four means the target wasn't found or the server isn't willing to disclose that it exists. Five hundred is a generic internal server error. Other codes provide more specific information.

PARISA: What about a redirect?

JULES: A response can direct the client elsewhere. Browsers often follow redirects automatically. That can make an API debugging problem sneaky: a request might end up at an HTML login page when your code expected JSON.

PARISA: The final response can look successful at the HTTP level and still be the wrong kind of content for what our code is doing.

JULES: Exactly. Status alone isn't the entire contract.

## Fetch Does Not Mean JSON

PARISA: Let's finally press the JavaScript button. What happens conceptually when code calls fetch?

JULES: In a browser, fetch is the interface we use to request a resource. It returns a promise, a JavaScript object representing a future result. We can arrange to handle the response when it's available.

PARISA: The promise is modern JavaScript machinery. Fetch is an environment-provided API, also available in some other runtimes. It is not a TypeScript keyword or a React feature.

JULES: Exactly. A successful fetch promise gives us a Response object. That object gives us access to the status, allowed headers, and the body.

PARISA: It isn't automatically our order object.

JULES: Right. Reading and interpreting the body is another step. Calling response.json asks to read the body and parse it as JSON. That operation is asynchronous too.

PARISA: Which means “the response headers arrived” and “I have fully read and parsed the body” are separate moments.

JULES: Yes. Bodies can be streamed. We don't need to learn streaming implementation today, but the distinction explains why there are multiple asynchronous steps in familiar fetch examples.

PARISA: And parsing JSON can fail independently. A login page, malformed content, an empty body—none of those become valid JSON through optimism.

JULES: Precisely. We should not call json on a deliberate no-content response and act surprised when there is no JSON to parse.

## The Error That Was Actually a Response

JULES: Here's the fetch detail that causes an impressive amount of confusion: an HTTP error status doesn't ordinarily make fetch reject its promise.

PARISA: A four oh four is still a response that arrived.

JULES: Exactly. Fetch can fulfill with a Response whose status is 404 or 500. Your code needs to inspect it. The ok property is true for statuses from 200 through 299.

PARISA: So catch alone doesn't mean “all unsuccessful HTTP outcomes handled.”

JULES: Correct. Rejection can happen for reasons such as a network failure, a browser policy failure, or an aborted request. The exact error depends on what happened.

PARISA: And even when fetch fulfills, a later body-read or parse operation can fail. Several stages, several possible failures.

JULES: Yes. Episode Six will turn this into a small useful coding pattern. Today, remember the distinction between “a response reporting failure arrived” and “the request operation couldn't provide a usable response.”

PARISA: Which also explains why I should look in the browser's network tools instead of assuming every red message means the same thing.

JULES: Exactly. Check the request URL and method, the status if there is one, the response content type, and the body where it's safe to inspect it.

PARISA: Redact credentials and private order details before sharing. Debugging does not need to become an accidental data export.

## A Timeout Can Leave an Awkward Question

PARISA: Suppose we send an order-creation request. The browser waits and eventually gives up. Did the order get created?

JULES: We may not know from that failure alone. The request might never have reached the server. Or the server might have created the order and the response was lost or delayed.

PARISA: So “I didn't receive success” is not always “nothing happened.”

JULES: Exactly. That's a crucial distributed-systems distinction. The client observes its side of communication, not every event on the other side.

PARISA: Which makes blindly retrying a purchase dangerous. We might accidentally ask for the operation twice.

JULES: Right. API designs can provide ways to handle retries safely, including idempotency mechanisms we'll explore later. Today we just need to recognize the ambiguity.

PARISA: And cancelling the browser's wait doesn't guarantee the server rolls back everything it was doing.

JULES: Correct. Cancellation is useful, but you can't assume it erases remote effects.

PARISA: I like that this falls out of the mental model. Two systems exchanging messages can lose contact between “work happened” and “the caller learned it happened.” That's not a weird JavaScript quirk.

## One Request Is Not a Whole Page

JULES: There's another debugging habit worth building. Loading a page may cause many HTTP requests: document, stylesheets, scripts, images, and later application data.

PARISA: The page existing doesn't prove the order-status request worked. The stylesheet loading doesn't prove the API is healthy. Each exchange has its own result.

JULES: Exactly. In the network panel, identify the specific request associated with the failed interaction.

PARISA: If our button handler never starts a request, staring at the server logs may not help. If the server returned the correct data but the UI didn't update, changing the route may not help either.

JULES: Follow the chain: user action, client code, request, processing, response, interpretation, presentation.

PARISA: And caches or service workers may influence that chain. We can investigate those when evidence points there, rather than beginning every bug with a ritual purge of everything.

JULES: You mean “clear cache and pray” isn't a root-cause analysis?

PARISA: It's a spiritual practice. Different department.

## Why a Shared Protocol Helps

JULES: Why is it valuable that so many different systems use HTTP?

PARISA: Shared tools and expectations. A browser, a command-line client, a proxy, and our application can agree about basic message semantics even when they don't know each other's implementation language.

JULES: Exactly. We gain infrastructure and tooling around common behavior. But our particular API still has to define its operations, fields, permissions, and errors clearly.

PARISA: HTTP doesn't force the application to be RESTful, consistent, or pleasant. It gives us a shared foundation to build on.

JULES: And it isn't the answer to every communication problem. Later we'll compare approaches involving different interaction patterns and protocols. Ordinary request-response HTTP is useful, not universally sufficient.

PARISA: Good. No protocol worship. Just understand what it does and where it fits.

## Follow the Pizza One Last Time

JULES: The customer asks to check order 42. Our browser code calls fetch using the service's URL and appropriate request options.

PARISA: The request identifies what we're targeting and what kind of operation we want. Headers add context. A body is included when the operation calls for one.

JULES: The service receives the request, checks access, performs the lookup, and constructs a response.

PARISA: The response status tells us about the HTTP outcome. Headers describe things like content type. The body contains our application's representation when a body is appropriate.

JULES: Our code checks the outcome, reads and interprets the body, and updates the page with understandable feedback.

PARISA: Or it handles the failure at the stage where the failure actually happened. No more filing everything under “internet warehouse sad.”

JULES: What changed in your mental model?

PARISA: Fetch stopped being a spell that returns data. It asks the environment to perform an HTTP operation. The operation produces a response or fails to provide one. Then my application still has interpretation and presentation work to do.

JULES: Exactly.

PARISA: And the HTTP protocol isn't our whole API. It carries the conversation. Our order service's contract supplies the meaning of that conversation.

JULES: Next episode, REST. Why resources and conventions became such a common way to organize these conversations, and why people use the word more loosely than its original architectural meaning.

PARISA: Finally. I've seen enough arguments about whether a URL is RESTful to suspect there's a ceremonial mountain involved.

JULES: We are not climbing the mountain.

PARISA: Good. My pizza is eighteen minutes away, subject to the limitations of distributed estimation.

[OUTRO MUSIC]

## Production References

- IETF RFC 9110, HTTP Semantics: https://www.rfc-editor.org/rfc/rfc9110.html
- MDN, Overview of HTTP: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview
- MDN, Using the Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- MDN, HTTP response status codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
- HTTP message cards are simplified HTTP/1.1-style teaching sketches, not complete production requests or literal HTTP/2 or HTTP/3 frames. Credentials are intentionally absent from the illustration; order access still requires authorization.
- orders.example is fictional. estimatedMinutes means estimated minutes until delivery in this series' example, not a guaranteed arrival time.