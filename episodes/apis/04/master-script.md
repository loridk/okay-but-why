# Episode 4: REST: Who Asked for This?

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Unrecorded; final timing depends on performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: I named the endpoint getOrder. Somebody said it wasn't RESTful.

JULES: What did you do?

PARISA: Changed it to orders. Somebody else said it still wasn't RESTful.

JULES: What did you do then?

PARISA: Briefly considered carpentry. You can argue about a shelf, but nobody demands that the shelf use hypermedia.

JULES: Today we're separating useful conventions from the architectural style they partially resemble.

PARISA: Excellent. I'd like to know what problem we're solving before the URL spelling bee begins.

[STING]

## A Shared Way to Ask

JULES: Welcome to Okay, But Why? Last time, HTTP gave us methods, addresses, headers, and responses. That still leaves enormous freedom in how we design an application interface.

PARISA: I could invent getOrder, removeOrder, changeOrder, and retrieveOrderButWithTheOtherFields. Another team could invent four completely different conventions.

JULES: Each interface might work. But clients and infrastructure have less common behavior to rely on. REST explores what happens when we constrain that freedom to support a system like the web: many components, different owners, independent evolution.

PARISA: REST stands for Representational State Transfer. Which sounds like a very organized haunting.

JULES: Roy Fielding described it as an architectural style. A style is a collection of constraints shaping how components interact. It isn't a package you install or a synonym for JSON over HTTP.

PARISA: And it wasn't invented because somebody disliked verbs in a URL.

JULES: Correct. The motivations include scalability, visibility of interactions, reuse through caching, and letting components change independently. Constraints bring tradeoffs as well as benefits.

PARISA: Good. A design decision with a bill. Those I recognize.

## Start With a Resource

JULES: A resource is something we identify and interact with. In our fictional pizza service, an order is a resource. A menu can be a resource. A collection of orders can be a resource.

PARISA: Not necessarily a database row. A current delivery estimate can be computed from several sources. It still makes sense to identify it and request a representation.

JULES: Exactly. The resource is the thing we're talking about. A representation is a description we transfer. Order 42 may have a JSON representation for a client and an HTML representation for a human-facing page.

PARISA: Neither is the pizza. I'm emphasizing that because my lunch remains stubbornly non-serializable.

JULES: The URL identifies the resource. The HTTP method communicates the operation's general meaning. That lets us reuse familiar semantics across very different kinds of resources.

PARISA: Instead of embedding a whole custom command language into every address.

[CODE CARD: Illustrative resource-oriented operations]
```text
GET    /orders/42     Retrieve an order representation
POST   /orders        Submit a new order to the collection
PUT    /preferences   Replace the preferences representation
PATCH  /orders/42     Apply a documented partial change
DELETE /saved-addresses/7  Request removal of a saved address
```

JULES: These are proposed operations in our fictional application, not universal route definitions. Each still needs a documented contract and permission checks.

PARISA: And plural nouns are a common convention. The architectural style doesn't crumble because a team chooses a singular name. Consistency and behavior matter more than winning a naming argument.

## GET Should Be Safe to Ask

JULES: GET retrieves a representation. Its semantics are safe: the caller isn't requesting a state change as the purpose of the operation.

PARISA: The server can still log the request. Safe doesn't mean no microscopic side effect anywhere. It means following a retrieval link shouldn't secretly cancel dinner.

JULES: Exactly. Browsers, crawlers, and caches can handle retrieval based on that understanding. A URL like cancel-order that performs cancellation when fetched violates the meaning of GET, even if the implementation seems convenient.

PARISA: Because another system might fetch it without sharing our assumption that a human deliberately pressed a scary button.

JULES: Right. Safety also differs from authorization. A GET can expose private information if the server fails to check access. Safe method semantics do not mean public data.

PARISA: Two different questions: is the operation intended to change state, and is this caller allowed to perform it?

## POST Isn't Just Create

JULES: POST asks the target to process submitted content according to that resource's semantics. Creating an order through an orders collection is a common use.

PARISA: The server chooses the new order identifier, validates the items, computes trusted prices, and returns an appropriate result. Often 201 Created, possibly with a Location header identifying the new resource.

JULES: But POST can represent other processing too. An operation may initiate a report or submit a cancellation request. Reducing POST to create loses that flexibility.

PARISA: Is a cancellation request allowed to be a resource?

JULES: Certainly. You could model cancellation as a resource with its own status. Or choose an explicitly action-oriented interface if that better fits the problem. The important thing is to describe what you're doing honestly.

PARISA: We shouldn't twist the business into a bizarre sculpture solely to remove a verb from an address.

JULES: Exactly. REST is a particular style, not a requirement that every remote operation must fit it perfectly.

## PUT and PATCH Are Different Promises

PARISA: Here's the distinction that people wave away as “both update.” PUT and PATCH.

JULES: PUT requests creation or replacement of the target's state using the supplied representation. For a preferences resource, the contract might define the complete set of writable preferences the client supplies.

PARISA: Complete according to the API's representation, not “dump every internal server column into the request.” Server-generated fields and ownership rules still exist.

JULES: Correct. PATCH applies partial modifications using a defined patch format or documented change representation. It isn't automatically “send whatever fields you feel like.”

PARISA: The server needs to know whether an omitted field means leave it alone, clear it, or reject the request. And different patch formats have different rules.

JULES: Exactly. Setting deliveryInstructions to a new string and appending an item to an array are different kinds of changes. The format must express them unambiguously.

PARISA: Also, allowing partial updates shouldn't mean accepting every property somebody sends. If the caller adds isAdmin, we don't congratulate their initiative.

JULES: We allow only supported fields and enforce their permissions. A method name never performs that validation for us.

## Repeating Yourself Without Repeating the Effect

JULES: That brings us to idempotency. An operation is idempotent when repeating the same request has the same intended effect as doing it once.

PARISA: Like setting the porch light to on, compared with toggling it. Set on twice: still on. Toggle twice: now off and everyone is annoyed.

JULES: Exactly. PUT and DELETE are defined as idempotent methods. GET is idempotent too. POST and PATCH don't carry that general guarantee, although particular operations can be designed to have it.

PARISA: A patch that sets instructions to “side door” may be idempotent. A patch that adds another pizza each time may not be. We have to inspect the operation.

JULES: Yes. And idempotency doesn't mean every response is identical. Delete a saved address once and it is gone. A repeated request could report not found, but its intended effect remains that the association is removed.

PARISA: So it's about the effect, not a promise that logs, timestamps, and status codes are frozen in amber.

JULES: Exactly. This matters when a network failure leaves a caller unsure whether an operation happened. Retrying an idempotent operation can be safer, though permissions, changed state, and application rules still matter.

## Stateless Does Not Mean Amnesia

PARISA: REST is stateless. Yet order 42 clearly exists in a database. Explain before somebody deletes persistence.

JULES: The constraint concerns the interaction. Each request carries the information necessary to understand it without depending on server-held conversational session context from earlier requests.

PARISA: Resource state remains on the server. The order can remember that it's baking. What we avoid is a request saying “now do the next thing with that one I selected earlier,” where only one server process knows what that means.

JULES: Exactly. Identify the target and supply the relevant context. That makes individual requests easier to understand and can make distributing work among servers simpler.

PARISA: But it may repeat information. Constraints aren't free.

JULES: Right. And authentication designs deserve precision here. A traditional server-side session is useful, but server-held conversational session state doesn't satisfy the strict REST stateless constraint simply because the request contains a session cookie.

PARISA: Nor does switching to a JWT automatically make the entire architecture RESTful. One token format doesn't settle every interaction rule.

JULES: Exactly. We can describe an HTTP API as resource-oriented without falsely claiming it satisfies every REST constraint.

## The Parts the URL Debate Leaves Out

JULES: REST also involves a client-server separation, responses marked for caching or not caching, a layered system, and a uniform interface. Downloadable code is an optional constraint.

PARISA: That's already more than plural nouns and GET.

JULES: The uniform interface includes identifying resources, manipulating them through representations, making messages sufficiently self-descriptive, and hypermedia guiding application state.

PARISA: Hypermedia is the word people drop like a smoke bomb. Make it ordinary.

JULES: Think of a webpage that provides links and forms showing available next steps. You don't need to hardcode every future page address into the browser. The representation supplies controls you can follow according to understood meanings.

PARISA: In our order example, a representation might advertise a supported cancellation link or action while cancellation is available, instead of the client inventing a URL by guessing the server's layout.

JULES: Yes. The client still needs to understand the media type and the meaning of the controls. Arbitrary URLs sprinkled into JSON don't magically teach a program the whole business domain.

PARISA: But discoverable controls can reduce the amount of navigation knowledge baked into the client.

JULES: Exactly. Many APIs casually called REST APIs use fixed routes documented elsewhere and don't embody this full interaction model. Common industry shorthand is broader than the original style.

## Caching and Layers Solve Real Problems

PARISA: Let's make the less glamorous constraints earn their keep. Caching?

JULES: If a representation can be reused, a client or intermediary may avoid repeating work and waiting on the origin. But the response must communicate suitable reuse rules. A public menu and a private live order view need different policies.

PARISA: A cache serving one customer's order to another is not an optimization. It's an incident.

JULES: Correct. Freshness and privacy both matter. Layers let clients interact through intermediaries without needing a complete map of every service behind them.

PARISA: A gateway or cache can sit in the path. The client follows the interface instead of knowing which internal machine owns today's order lookup.

JULES: Right. That flexibility can help scale and evolve a system. It also adds operational complexity and sometimes latency. We should explain the trade, not just admire the boxes.

## Two People Edit the Same Thing

PARISA: Here's a problem clean URLs don't solve. Two staff members load the same delivery instructions. Both edit. The second save silently overwrites the first.

JULES: That's a concurrency problem. An API can use conditional requests: a response identifies a version, perhaps with an ETag, and an update uses If-Match to say “apply this only if the version still matches.”

PARISA: Then a mismatch can be rejected so the client can refresh or help resolve the conflict. We don't just assume the representation we read is still current.

JULES: Exactly. This is an example of using HTTP capabilities meaningfully. The method and address are only the beginning of the contract.

PARISA: And the UI needs to explain the conflict. “Precondition failed” may be accurate protocol language and still terrible wording for someone trying to correct a gate code.

## When the Style Helps

JULES: A resource-oriented HTTP interface can be a good fit when clients retrieve and manipulate identifiable things, shared semantics are useful, and ordinary HTTP infrastructure serves the interaction well.

PARISA: It may be a less natural fit for tightly specialized commands, very chatty internal calls, or continuous bidirectional communication. We'll explore alternatives later.

JULES: Exactly. The question is which properties we need, not whether we can win a label.

PARISA: If a team says REST API, I can now ask useful follow-ups. What resources? What method semantics? What caching? How do clients find next steps? What request context is required?

JULES: Much more productive than inspecting the URL and announcing a verdict.

PARISA: Though I reserve the right to object to GET slash delete-everything.

JULES: Please do.

## Design Review at the Pizza Counter

PARISA: Let's do an actual design review. Someone proposes GET slash orders slash 42 slash cancel. They say it's simple because the frontend can just follow a link.

JULES: The simplicity is hiding a mismatch. GET's meaning permits retrieval-oriented behavior by other software. Cancellation is an intentional state change. We need a state-changing operation and the corresponding access and request protections.

PARISA: So the objection isn't that cancel is an impure English verb. It's that the method says one thing while the application does another.

JULES: Exactly. Now suppose they propose POST slash orders slash 42 slash cancellation-requests. The body supplies a reason, and the response describes the cancellation request's state.

PARISA: That could be reasonable if cancellation is a process with eligibility checks, possible rejection, or later completion. We have modeled a meaningful thing instead of merely renaming a command.

JULES: Right. But if the operation is a very simple immediate command, forcing an elaborate lifecycle onto it may add confusion. Design should reflect the actual domain.

PARISA: Then another developer proposes PATCH order 42 with status cancelled.

JULES: That may also be a reasonable public contract if the server interprets it as a requested transition and enforces the rules. It must not mean the client can set arbitrary lifecycle states without checks.

PARISA: I can't send status refunded and thereby summon money. The server decides whether the requested transition is allowed and performs the required work.

JULES: Exactly. Several interface shapes can express related intent. We compare their clarity, semantics, and consequences rather than assuming there's one sacred spelling.

PARISA: What would make us reject a design even if the URLs looked beautiful?

JULES: Ambiguous effects, unsafe retries, missing authorization, inconsistent response meanings, or forcing clients to understand internal implementation details. Those problems survive a perfect noun collection.

PARISA: Good. The design review has become useful again. I was worried we would spend forty minutes pluralizing cancellation.

## Replacement Deserves a Concrete Example

JULES: Let's make PUT's replacement meaning tangible. Our preferences representation has contactlessDelivery and notificationChannel. The contract requires both in a replacement request.

PARISA: I read contactless true and channel email. I change the channel to text and PUT the complete writable representation. The service validates both fields and replaces those preferences according to its contract.

JULES: Exactly. Now imagine you send only notificationChannel because you assumed PUT meant merge whatever fields are present.

PARISA: The server might reject the incomplete representation. Or a differently defined representation might reset omitted values. Either way, I shouldn't infer partial-update semantics from the vague word update.

JULES: Right. That's why method semantics and documented representation rules work together. PATCH can express a partial change, but we still need a defined patch format.

PARISA: Suppose a patch says remove deliveryInstructions. Is that identical to setting it to null?

JULES: Not necessarily. The patch format and resource contract decide. One operation may remove a property; another may retain it with an explicit null value. Clients and servers must agree.

PARISA: And if I'm editing an old representation, replacement can accidentally overwrite somebody else's newer preference. That's where the conditional request we discussed earns its keep.

JULES: Exactly. Include a version condition, reject a stale update, and give the client a way to resolve it. Choosing PUT doesn't by itself prevent lost updates.

## What the Client Is Allowed to Assume

PARISA: Imagine I call the order endpoint and get a link labeled receipt. Do I follow it because the URL contains the word receipt?

JULES: In a hypermedia-oriented design, the relationship or control meaning is what matters. The client understands that relation through the media type or contract and uses the supplied target.

PARISA: So the server could change the receipt's actual address without forcing the client to reconstruct a new URL pattern, provided the interface preserves the relation and behavior.

JULES: Exactly. That's one kind of decoupling the model aims for. It doesn't eliminate every dependency; it changes which facts the client must know in advance.

PARISA: A browser can follow links without knowing every website's route design. But it still understands HTML's controls and conventions. That's the familiar example hiding under the intimidating term.

JULES: Right. For machine clients, designing useful media types and control semantics is work. That's one reason many practical JSON APIs choose a narrower, explicitly documented route contract instead.

PARISA: We can discuss that trade without pretending those APIs satisfy the full style. Precise names should clarify decisions, not become a way to insult someone's functioning service.

## Don't Let the Label Pick the Deployment

JULES: One more assumption to dismantle: a REST-oriented API doesn't require microservices.

PARISA: Our single application can expose resources, honor method semantics, and send meaningful cache information. We don't need six deployable processes to make a URL plural.

JULES: Exactly. Nor does a monolith require session-dependent interactions. Deployment boundaries and interaction constraints are different dimensions.

PARISA: And an application can use different interface styles for different purposes. Public resource access may use familiar HTTP semantics while an internal operation uses an explicit command interface.

JULES: Right. We should document the differences and avoid accidental inconsistency, but consistency doesn't demand pretending fundamentally different workflows are identical.

PARISA: The question becomes which assumptions help callers and infrastructure here. If a convention helps them reason correctly, use it. If a label is making us distort the problem, examine the trade instead of obeying the label.

## The Useful Part of the Argument

PARISA: REST exists because many independent systems benefit from common interaction rules. Resources and representations give us a way to talk about things without exposing all their internals. Standard semantics let clients and intermediaries make useful assumptions.

JULES: And the full architectural style includes more than the conventions people often mean by REST API. Recognizing that difference lets us discuss design accurately without turning every project into a purity test.

PARISA: GET retrieves. POST processes. PUT replaces according to the target's representation contract. PATCH applies defined partial changes. DELETE requests removal. None of those automatically checks permission, validates input, or makes our documentation kind.

JULES: Exactly. Useful conventions, real responsibilities.

PARISA: Next time, JSON. The thing people call a JavaScript object while it is, inconveniently, a string.

JULES: Wait, That's Just JavaScript gets a small identity crisis.

PARISA: A JSON identity crisis. Please use double quotes around it.

[OUTRO MUSIC]

## Production References

- Roy Fielding, REST architectural style: https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
- HTTP method and conditional request semantics: https://www.rfc-editor.org/rfc/rfc9110.html
- PATCH method: https://www.rfc-editor.org/rfc/rfc5789
- Routes are fictional teaching examples. Strict REST constraints and common resource-oriented HTTP API usage are intentionally distinguished.