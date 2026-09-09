# Episode 6: APIs — A Boundary With a Job Description

**Series:** Web Architecture • Episode 6 of 14
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — I Have a JSON URL

[INTRO MUSIC]

PARISA: I have made an API.

JULES: What does it promise?

PARISA: Curly braces.

JULES: And beyond that?

PARISA: A field named data. Inside it, more data. I am considering data two.

JULES: Welcome to *Okay, But Why?*. Today, why an API is more than a URL that spits out JSON.

## An Interface Between Programs

JULES: API stands for application programming interface. It's a defined way for software to interact with other software.

PARISA: A library's functions can be an API. The browser's DOM interface is an API. Today we're mainly discussing web APIs across a network.

JULES: Right. They expose operations or resources through an agreed request and response model.

PARISA: “Agreed” is doing work. The caller needs to know what it can ask, which inputs are accepted, what success means, and how failure is represented.

JULES: And what it isn't allowed to do. For Nervous Robot, customers can create orders and view their own permitted information. Staff have other operations. Neither should receive unrestricted database access.

PARISA: The interface lets us offer meaningful business actions while keeping internal storage and implementation details behind a boundary.

JULES: Which can change independently, within compatibility limits. The database table can be reorganized without every client learning the new column layout.

PARISA: Unless we made the API an accidental photocopy of the tables. Then we've exported our remodeling problem to everybody.

## Why Separate Frontend and Backend?

JULES: A browser application can use an API to retrieve data and request operations. A mobile application might use the same capabilities. An authorized partner might use a carefully scoped interface too.

PARISA: So multiple clients can share business rules. The rule “don't accept orders after closing” shouldn't have separate authoritative versions in three interfaces.

JULES: Separate teams may also need a stable contract. But separation adds a network boundary, versioning concerns, and coordination.

PARISA: For one modest server-rendered site, we don't have to create a public JSON API solely to call it from our own server code.

JULES: Exactly. Internal functions may be enough. An API becomes useful when there's a consumer or boundary that benefits from it.

PARISA: Public, partner, and internal APIs can have different audiences and commitments. “We have an endpoint” doesn't mean we promised to support strangers integrating with it forever.

JULES: But once clients depend on it, even internally, compatibility matters.

## Resources, Endpoints, and Methods

PARISA: Let's read a small resource-oriented design.

JULES: GET slash menu retrieves a menu representation. POST slash orders requests a new order. GET slash orders slash 417 retrieves an authorized representation of that order.

PARISA: The endpoint is the address and operation we can call. The resource is the thing the interface models, such as an order. The response is a representation of it, not the physical pizza.

JULES: REST is an architectural style with constraints, including a uniform interface and stateless interactions. Many APIs described as REST are more loosely resource-oriented HTTP APIs.

PARISA: So using GET and JSON doesn't by itself prove full REST compliance. We can be precise without turning lunch into a certification exam.

JULES: Exactly. The practical lesson is to use HTTP semantics consistently and make the interface understandable.

PARISA: And not every business action is a trivial create-read-update-delete operation. Cancelling an order has rules. It might be allowed before preparation starts and forbidden after dispatch.

JULES: The API should express that operation deliberately, whether through a status transition or an action-oriented endpoint. The important part is clear semantics and server enforcement.

[CODE CARD: Example HTTP interface; resource names are application design]
~~~text
GET  /menu          -> available menu representation
POST /orders        -> validated order creation request
GET  /orders/417    -> authorized order representation
POST /orders/417/cancellation -> request a permitted cancellation
~~~

PARISA: That card is interface notation, not JavaScript, TypeScript, or a framework's routing syntax. And the numbers are examples, not access credentials.

## A Contract Includes the Awkward Parts

JULES: What does POST slash orders accept?

PARISA: Item identifiers, quantities, delivery or pickup choice, required contact details, maybe an agreed quote reference and an operation key. Not an arbitrary trusted price from the browser.

JULES: What does it return?

PARISA: A stable order identifier and a clearly defined state. If it only queued work, don't call the order complete. If validation failed, identify the problems in a form the client can map to fields.

JULES: What about a sold-out item?

PARISA: A business conflict with enough information to let the customer revise the order. Avoid dumping internal stack traces or database errors into the response.

JULES: What about a server outage?

PARISA: A distinguishable failure, with a retry policy that respects whether the operation could already have happened.

JULES: That's the contract. Inputs, outputs, authorization, errors, timing, and side effects. Documentation needs examples of failure as well as the attractive success response.

PARISA: An API that only documents sunny weather is a holiday brochure.

## TypeScript Isn't a Border Guard

[STING: WAIT, THAT'S JUST JAVASCRIPT]

JULES: Suppose both frontend and backend share a TypeScript type for an order request.

PARISA: Helpful for catching mistakes while writing code. But the server can receive a request from anything. The type declaration isn't carried across the network as an enforcement officer.

JULES: Exactly. Parse and validate actual input at runtime. Check quantities, allowed fields, formats, and business constraints.

PARISA: And check authorization separately. “This is a valid order identifier” doesn't mean “this user may view that order.”

JULES: JSON itself has strings, numbers, booleans, null, arrays, and objects. A date often arrives as a string under an agreed format. It doesn't turn into a JavaScript Date object by wishing.

PARISA: Nor does naming a field cents guarantee it's an integer or the correct currency. The contract should state units and meaning.

JULES: Good example. A total without currency is an argument scheduled for later.

PARISA: And a field named status with undocumented possible values is a scavenger hunt.

## Compatibility Is a Promise Over Time

JULES: We add a new optional response field. Often compatible. We rename an existing field or change its meaning. Potentially breaking.

PARISA: Even adding a value to a status enumeration can surprise clients that assume they've seen every possible value.

JULES: So compatibility isn't just whether JSON parses. It's whether existing consumers can still behave correctly.

PARISA: We can document change policy, test important consumers, and use versioning where needed. A version number doesn't rescue an undocumented semantic change inside the same version.

JULES: Nor does changing every endpoint to version two solve the migration. Old clients may remain active, particularly installed mobile apps.

PARISA: Which is why public APIs create an ongoing maintenance obligation. We should choose that scope deliberately.

## Lists Need Boundaries Too

JULES: GET all orders sounds convenient until there are several million.

PARISA: Or until it accidentally includes other customers' orders. Start by defining whose list it is and what they may see.

JULES: Then pagination, filtering, and sorting. Limit the amount returned and document how to request more.

PARISA: Cursor-based pagination can be useful for changing datasets; offset pagination can be simpler for some uses. Neither is automatically the correct answer for every list.

JULES: Stable ordering matters. If new orders appear while paging, clients need a coherent way to move through results.

PARISA: And performance controls aren't merely defensive. A bounded list is easier to display accessibly and less likely to freeze a phone while it renders every pizza ordered since civilization began.

## CORS, the Misunderstood Bouncer

PARISA: Now the inevitable question. My API works from a command-line client but the browser complains about CORS.

JULES: Cross-Origin Resource Sharing is a browser-enforced mechanism. It lets a server indicate which other origins may read its responses through browser scripts, under specific conditions.

PARISA: Origin is scheme, host, and port. Our frontend on one origin and API on another means those browser rules apply.

JULES: Some requests trigger a preflight, an OPTIONS request asking whether the proposed method and headers are allowed before the browser sends the actual request.

PARISA: But not every cross-origin request is preflighted. Some can be sent even when the calling script isn't allowed to read the response.

JULES: Exactly. That is why CORS isn't a general authorization system and isn't a complete CSRF defense. Non-browser clients don't have to enforce it.

PARISA: If the API contains private orders, it needs real authentication and authorization, regardless of allowed origins.

JULES: For credentialed cross-origin browser requests, configure the intended origin and credentials behavior carefully. A wildcard origin is not compatible with exposing credentialed responses in the ordinary CORS model.

PARISA: And don't use no-cors as a magic repair. An opaque response you can't read doesn't solve an API integration that needs the data.

JULES: Sometimes a same-origin deployment or backend-for-frontend reduces browser integration complexity. But don't add a proxy without understanding what responsibility it will own.

## A Backend for This Frontend

PARISA: Explain that phrase before it breeds another acronym.

JULES: A backend-for-frontend is a server layer shaped around a particular client's needs. It can aggregate calls, keep credentials server-side, and return a response suited to the interface.

PARISA: For our small shop, the existing web application might already do that job. We don't need a separately deployed service just to earn the abbreviation.

JULES: Exactly. The pattern is a responsibility, not necessarily another machine. At larger scale, separate client needs can justify separate implementations.

PARISA: It also creates a place to avoid exposing every downstream service directly to the browser. But it can become a bottleneck or an overgrown coordinator if we aren't careful.

## Alternatives Have Reasons

JULES: GraphQL lets clients ask for data through a typed schema and select fields. That can help when clients need different combinations of related information.

PARISA: It still needs authorization, query-cost controls, caching strategy, and runtime handling. A schema doesn't make every request cheap or permitted.

JULES: RPC-style APIs focus on named operations. They can be natural for commands that don't fit neatly into resource editing.

PARISA: Again, network calls remain network calls. Convenient generated clients don't remove timeouts or compatibility concerns.

JULES: Webhooks reverse the direction: a service sends a notification to an endpoint you provide when an event happens.

PARISA: Such as a payment provider telling our server that a payment changed state. Verify the notification's authenticity, handle duplicates, and don't assume delivery order is perfect.

JULES: We won't implement those protocols here. The lesson is to choose an interface style based on consumers and operations, not because one acronym is newer.

## Retrying Without Ordering Dinner Twice

PARISA: Our recurring missing confirmation. What's the API-level solution?

JULES: Give the creation attempt a stable key and define how repeated requests with that key behave. The server records the operation and its outcome so a retry can retrieve the same result rather than create another order.

PARISA: It must scope that key appropriately, handle simultaneous retries, and reject or otherwise define reuse with different input. Just attaching a UUID to the request doesn't implement the policy.

JULES: Correct. The durable server-side handling is what matters. And the client needs to keep the same key for the same attempt, not generate a fresh one every time it retries.

PARISA: The API contract can also provide status lookup. Then uncertain delivery of a response doesn't leave the human guessing forever.

JULES: This is a good example of interface design shaping reliability. The endpoint isn't just a path; it's an agreement about repeated actions and outcomes.

## Design the Error Before the Success Demo

JULES: Let's pretend I'm implementing the frontend and you're defining the endpoint. I submit an order with two unavailable items. What do you give me?

PARISA: A structured result that identifies the unavailable items and what the client may do next. Maybe the customer needs to revise the order. The exact status and fields are contract choices, but the meaning should be stable.

JULES: Could you just return a sentence?

PARISA: A human-readable message is useful, but the client may also need stable machine-readable identifiers to associate errors with controls. Don't make the frontend parse English prose to discover which field failed.

JULES: So the code might be item_unavailable while the displayed wording can improve or be translated.

PARISA: Exactly. That's an application-defined error code, not JavaScript syntax. Keep the categories meaningful. We don't need seven hundred codes that differ only in punctuation.

JULES: What about unexpected internal errors?

PARISA: Return a safe message and a reference that support can use where appropriate. Keep sensitive internal detail in controlled diagnostics, not the public response. A customer doesn't need a database hostname to learn that ordering is temporarily unavailable.

JULES: And I should preserve their input and offer a recovery action consistent with the outcome.

PARISA: Yes. The API and UI should agree on whether retrying is safe, whether revision is required, or whether we must check an uncertain operation first.

## Authentication and Authorization in the Contract

JULES: Do we document permission requirements per endpoint?

PARISA: Absolutely. “Authenticated” is too broad if customers and staff have different capabilities. Say which identities may perform which operations and what object-level checks apply.

JULES: Suppose the client sends a customer ID in the request body.

PARISA: We don't automatically accept it as the identity of the requester. Derive or verify the relevant identity through the authenticated context and policy. Otherwise a perfectly valid field can become an impersonation mechanism.

JULES: What if the endpoint is public, like the menu?

PARISA: Public means the information is intended for that audience. It doesn't mean inputs are unbounded or every operation is permitted. Filtering and pagination still need validation and resource limits.

JULES: So even unauthenticated endpoints have contracts and constraints.

PARISA: Yes. An API isn't either completely locked or completely lawless. Scope the capability to the actual need.

## Evolving an Order Status

JULES: Our first version has pending, accepted, and completed. Later we add preparing and out-for-delivery. What breaks?

PARISA: A client that assumes every unknown value means completed could lie. A client with an exhaustive local mapping may crash or show nothing. We need a compatibility plan.

JULES: Maybe a stable coarse status plus more detailed optional progress information?

PARISA: That could work if the semantics are clear. Or version the contract and support a transition. The design depends on what consumers need and how independently they update.

JULES: We should test older consumers against the changed response.

PARISA: Exactly. Contract tests can verify agreed examples and constraints. They don't prove every business behavior, but they catch certain integration breaks before deployment.

JULES: Generated client code can help too.

PARISA: Yes, when generated from a maintained schema. But code generation doesn't resolve semantic ambiguity. If status means something different after deployment, the types may still compile beautifully.

JULES: Type-safe misunderstanding.

PARISA: Very fashionable. Still a misunderstanding.

## The Cost of a Chatty Interface

JULES: My frontend makes a request for the order, another for each item's description, another for prices, another for delivery details, and another for permissions.

PARISA: Some separation may be useful, but examine the request chain. If calls depend on previous results, latency accumulates. If permissions are merely displayed client-side, the server still needs to enforce them independently.

JULES: Could the API return the information needed for the view in one response?

PARISA: Often, yes. A representation designed around the consumer's task can reduce round trips without exposing internal tables. Don't make the client reconstruct a business record from twenty tiny fragments for no reason.

JULES: But returning everything for every screen wastes bandwidth and exposes unnecessary data.

PARISA: Exactly. Coarse enough to be useful, limited enough to be appropriate. That's an interface design tradeoff, not a universal one-request rule.

JULES: A backend-for-frontend can shape that response if several downstream systems exist.

PARISA: Yes, though our baseline application can often do it directly. Introduce a separate layer only when it has a clear responsibility that outweighs its overhead.

## Rate Limits and Fairness

JULES: The API limits requests. Is that just to stop attackers?

PARISA: It can protect capacity, control cost, and keep one consumer from starving others. Legitimate clients can also accidentally generate excessive traffic through bugs or aggressive polling.

JULES: The contract should explain limits and how to respond when they're reached.

PARISA: Where practical, yes. A client should back off appropriately, not immediately retry in a tight loop. And limits should fit the operation—reading a menu and creating a payment attempt have different consequences.

JULES: We can also avoid sending requests that aren't useful. Debounce a search, stop polling when the view isn't active where appropriate, and don't refetch unchanged data constantly.

PARISA: Debouncing is a programming technique that waits for a pause in repeated activity before acting. It isn't built into HTTP, and it isn't a security boundary. The server still enforces its own limits.

## What Makes an API Pleasant to Use?

JULES: If you were the consumer, what would you appreciate most?

PARISA: Predictable naming, clear examples, stable meaning, explicit units, useful errors, and a way to try the intended flow without risking real transactions. Also documentation that says what happens on retries.

JULES: Not just a list of fields.

PARISA: Fields are necessary, but a worked sequence is often what makes the system understandable. Create an attempt, follow payment, retrieve status, handle cancellation. Show how operations connect.

JULES: That's our series pattern again: thing, problem, mechanism, example, tradeoff.

PARISA: Exactly. Good API documentation should let another developer form a correct mental model. Curly braces are merely the packaging.

## A Contract Review at the Restaurant

JULES: Before we call the API finished, can we read one operation as a complete promise?

PARISA: “Create an order from these items and this fulfillment choice, for this authorized context, using the agreed pricing policy. If accepted, return a durable identifier and explicit state. If rejected, return a reason the client can handle. If the caller retries the same attempt, follow the documented duplicate policy.”

JULES: That includes much more than the schema.

PARISA: Yes. The schema says what values look like. The contract says what the operation means. Both matter.

JULES: What if the server starts asynchronous work and immediately returns an identifier?

PARISA: Then the promise is that work was durably accepted for processing, if that's what we've implemented. The client needs a status endpoint or notification mechanism and a definition of terminal outcomes.

JULES: Terminal meaning no more automatic progress is expected, not something involving a command line.

PARISA: Correct. Completed, rejected, or requiring human attention could be distinct outcomes. Don't leave consumers polling forever because no one defined failure after acceptance.

JULES: And cancellation of pending work?

PARISA: Another explicit operation with rules. The server may not be able to cancel once a downstream action has begun. Explain whether cancellation is requested, accepted, or completed.

JULES: Those distinctions seem fussy until the action costs money.

PARISA: Or affects someone's dinner plans. Precision is useful even at modest stakes. The UI can only be honest if the API gives it an honest state.

JULES: What would you leave out of the first API?

PARISA: Bulk export, arbitrary query languages, partner integrations, and administrative operations nobody currently needs. Each one creates validation, permissions, documentation, and support work.

JULES: We can add them when a consumer has a real use case.

PARISA: Exactly. A small API with clear behavior is a better foundation than a huge API whose endpoints all mean “we'll see what happens.”

JULES: I withdraw data two.

PARISA: The contract thanks you.

## Closing — Ask What It Promises

PARISA: A useful API exposes meaningful capabilities, validates inputs, checks permission, defines outcomes, and stays understandable as it changes.

JULES: It can separate clients from internal implementation. That flexibility costs documentation, compatibility work, and careful boundary handling.

PARISA: Our pizza API is small because our needs are small. It has enough rules to be trustworthy, not enough endpoints to impress a diagram.

JULES: Next time: identity. How the server connects a request to a session, and why cookies, tokens, and authentication aren't synonyms.

PARISA: I have renamed data two to contractual uncertainty.

JULES: Finally, an honest field name.

[OUTRO MUSIC]

## Production Notes

- API notation is not framework code. TypeScript compile-time checking is explicitly separated from runtime parsing, validation, and authorization.
- CORS explanation is deliberately bounded; actual configuration depends on origins, credentials, and deployment.
- REST is identified as an architectural style rather than a synonym for JSON-over-HTTP.

## Production References

- MDN, CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
- Fielding, REST: https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
- GraphQL, Learn: https://graphql.org/learn/
