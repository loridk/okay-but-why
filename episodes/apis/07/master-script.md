# Episode 7: Building an API

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Unrecorded; final timing depends on performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

JULES: Today we reveal what lives behind the endpoint.

PARISA: Please be a person writing an if statement.

JULES: A person writing several if statements.

PARISA: I knew it. Every time somebody says “the platform handles that,” I picture a tired developer deciding whether a value is null.

JULES: There's also a database query.

PARISA: Luxury infrastructure.

[STING]

## The Other End Is Code

JULES: Welcome to Okay, But Why? We've sent requests. Now we receive one. Building an API means implementing the behavior promised by that interface.

PARISA: Not buying an API-shaped appliance. A server receives a request, runs code, and produces a response. My traditional PHP background is suddenly looking suspiciously relevant.

JULES: Very relevant. A PHP script that reads request information, validates it, performs a query, and returns JSON can implement a web API. So can a route handler in many other languages and frameworks.

PARISA: The HTTP client doesn't need to know which language did the work. It needs the response to fulfill the contract.

JULES: Exactly. We'll follow an authorized request for order 42, then discuss an update. The code card is pseudocode: a readable description of responsibilities, not a particular framework you can paste into production.

PARISA: Excellent. No invented package named makeBackendSecure.

## Routing Gets the Request to the Right Code

JULES: A route associates an incoming request pattern with a handler. A handler is the function or code responsible for dealing with a matching request.

PARISA: Method and path matter. GET slash orders slash 42 can mean retrieve an order. A different method at the same path may mean something else or be rejected.

JULES: A route pattern might use a parameter placeholder, such as orderId, to capture the identifier from the path. The framework's exact syntax varies.

PARISA: The incoming text 42 becomes a route parameter. It doesn't become trustworthy merely because the router extracted it.

JULES: Exactly. Parse and validate it according to the contract. If identifiers must be positive integers within a supported range, check that. If they are opaque strings, don't invent numeric assumptions.

PARISA: And don't casually use a permissive parser that turns 42banana into 42. Decide what counts as a valid identifier, then enforce it.

## Three Places Input Can Arrive

JULES: Route parameters identify something in the path. Query parameters appear after the question mark and commonly influence things like filtering, sorting, or pagination. Request bodies carry content submitted for an operation.

PARISA: Our order ID might be in the path. A view choice could be a query parameter. Updated delivery instructions might be in a body.

JULES: Right. Those are design conventions, not a security ranking. Every one of those inputs can be controlled by a caller.

PARISA: Including hidden form fields, disabled controls, and values our own JavaScript generated. Somebody can bypass our interface and send a different request.

JULES: Exactly. Headers can carry relevant input too. The server must understand and constrain what it accepts, not simply trust whatever the usual frontend sends.

PARISA: And some parsers interpret duplicate query parameters differently. We should choose what happens if sort appears twice rather than letting accidental library behavior define a contract.

## Validate in Layers

JULES: First, can we even read the request? Is the body within size limits? Is its media type supported? Is it syntactically valid?

PARISA: Then shape. Is quantity an integer? Is deliveryInstructions a string of an allowed length? Are required fields present? Are unexpected fields rejected or deliberately ignored?

JULES: Then business meaning. Does the menu item exist? Is it available? Is this order still editable? Those questions require more than a string-versus-number check.

PARISA: And access. Is this authenticated caller allowed to read or change this particular order? That's a separate decision even if every field is perfectly shaped.

JULES: Exactly. A valid request to someone else's order is still unauthorized.

PARISA: TypeScript on the server can help developers call their own functions correctly. It doesn't inspect an arbitrary request that arrived over the network. Runtime validation is real work we still have to perform.

JULES: A schema library may help organize that work. But it doesn't decide all business rules or permissions unless we actually encode those checks.

## Follow a Retrieval

[CODE CARD: Framework-neutral pseudocode, not runnable JavaScript]
```text
handle GET /orders/{orderId}:
    principal = authenticate(request)
    orderId = validateOrderIdentifier(request.path.orderId)
    order = repository.findOrderVisibleTo(principal, orderId)

    if order is absent:
        return response(404, { error: "order_not_found" })

    summary = {
        id: order.id,
        status: order.status,
        estimatedMinutes: order.estimatedMinutes
    }

    return response(200, summary, contentType = "application/json")
```

PARISA: For listeners: establish the caller, check the identifier, fetch only an order visible to that caller, and return an intentionally selected summary. If there's no visible order, return an appropriate not-found response.

JULES: The helper names describe responsibilities. Authenticate is not a standard magic function. The application must actually verify credentials. The repository must actually enforce the visibility rule.

PARISA: And returning not found for inaccessible resources can be a deliberate disclosure policy. Other interfaces may use forbidden in appropriate situations. We should choose based on what the caller is allowed to learn.

JULES: Exactly. Consistent policy matters more than mechanically revealing whether every identifier exists.

PARISA: Notice the response isn't the entire database object. We create the public shape deliberately, so a future internal column doesn't quietly become a public field.

## Business Logic Isn't Just Glue

JULES: Now suppose the customer updates delivery instructions. What does the server need to know beyond whether the new value is a string?

PARISA: Whether the order belongs to them, whether its current state allows an update, and whether the operation is still valid at the moment we save it. Once the driver has completed delivery, changing the gate code is more of a memoir.

JULES: Exactly. Business logic expresses those domain rules. A route handler can coordinate the request while a separate function handles the rule.

PARISA: Separate responsibilities can make code easier to test and reuse. But we don't need sixteen layers for one small endpoint.

JULES: Right. The purpose is understandable boundaries: request interpretation, business decisions, data access, and response construction. The organization can be modest.

PARISA: If the website, mobile app, and internal tool all update instructions, the authoritative server rule should apply to all of them. We don't copy the only enforcement into three clients and hope they agree.

JULES: The clients can provide helpful early feedback. The server still enforces the rule.

## The Database Has Its Own Boundary

JULES: A data-access layer or repository wraps how the application reads and writes stored information. It may use a database driver's API.

PARISA: Another interface inside our interface. The browser calls our service; our server calls a database library; that library communicates with the database.

JULES: Exactly. Each boundary has inputs, outputs, and failure possibilities. Our external API shouldn't force clients to understand every internal table and join.

PARISA: And database queries need parameterization. We don't concatenate a caller's text into SQL and hope validation caught every possible problem.

JULES: Correct. Validation checks what inputs mean; parameterized queries separate data from query structure. They complement each other.

PARISA: Access checks can also influence the query. If this caller may only see their orders, constrain the lookup accordingly rather than fetching everything and relying on the frontend to hide the rest.

JULES: Exactly. Defense belongs at the trusted boundary.

## A Check Can Become Stale

PARISA: Here's a race. We read the order and see preparing. We decide instructions can change. Meanwhile another process dispatches it. Then we save the instructions.

JULES: The earlier check may no longer describe current state. We need the database operation or transaction design to enforce the relevant condition when the update occurs.

PARISA: A transaction groups operations according to the database's guarantees. It isn't a blanket promise that every race disappears; the isolation level and actual query conditions matter.

JULES: Exactly. A conditional update might change the row only if its version or allowed status still matches. If it doesn't, the application returns a conflict or another documented outcome.

PARISA: Which the client can explain as “this order changed; refresh before trying again.” Better than confidently reporting success for something we didn't do.

JULES: This is where API design and data consistency meet. A beautiful response schema cannot repair a lost update.

## Construct a Useful Response

JULES: A response needs an appropriate status, headers, and body when applicable. For a successful retrieval, 200 with a documented representation is common. Creation can use 201. Successful operations with no content can use 204.

PARISA: Validation problems should produce a useful client-facing error, not a database exception pasted into the body. The exact status might depend on the failure and the contract.

JULES: Right. A malformed body differs from a well-formed request violating a business rule. We should choose and document a consistent error scheme.

PARISA: If a field is invalid, identify the field and give a useful message. If the system failed internally, don't leak SQL, filesystem paths, secrets, or stack traces.

JULES: A request or correlation identifier can help support connect a public error to restricted logs. It should be safe to share and not itself expose credentials.

PARISA: The customer needs to know what they can do next. The maintainer needs enough evidence to investigate. Those are related but different outputs.

## The Handler May Not Be the Whole Story

JULES: Frameworks often let shared code run around route handlers. You may hear middleware, filters, or hooks, depending on the framework.

PARISA: Shared authentication, request IDs, body limits, or error handling can live there. But “we have middleware” isn't evidence that every route is protected.

JULES: Exactly. Route registration, ordering, and exemptions matter. Test the actual protected operation with missing credentials, wrong permissions, and valid access.

PARISA: And define what happens when a dependency fails. If the database is unavailable, our handler should fail predictably rather than leaving requests open indefinitely.

JULES: Timeouts, resource limits, and graceful errors belong to reliable service behavior. We don't need a vast platform to recognize those responsibilities.

## Try to Break the Promise

PARISA: What would you test for our order endpoint?

JULES: An allowed user reading their order, an unauthenticated request, another user's order, malformed identifiers, missing orders, and a dependency failure. For an update, invalid fields, forbidden state changes, and concurrent changes.

PARISA: I'd also check the response shape. No internal notes or private fields. And test that an added request property doesn't get written just because our code spreads the body into a database update.

JULES: Exactly. Convenient object copying can become mass assignment: letting the caller set properties we never intended to expose.

PARISA: Modern JavaScript syntax can be elegant while doing an extremely bad thing. The spread operator doesn't know our permission model.

JULES: Explicitly choose supported fields. Small and boring can be very good here.

## Building the Endpoint Isn't Operating It

PARISA: One last distinction. We wrote a handler. Are we done running an API?

JULES: Not necessarily. Deployment, configuration, transport protection, monitoring, capacity, and dependency health still matter. The handler is the behavior at the center, not the whole operational environment.

PARISA: But we also shouldn't mystify it. “API infrastructure” doesn't mean the request skips ordinary application code.

JULES: Exactly. Understanding the handler gives us a foundation for understanding the operational concerns later.

PARISA: Same as a traditional server-rendered application. Returning data instead of a page changes some responsibilities, but it doesn't remove the database, validation, or the person answering the incident.

## A Request Is Not a Function Argument You Control

PARISA: In our own program, I might know that a helper always receives a number because all its callers are in the same codebase. An HTTP request is a different situation.

JULES: Exactly. The caller can be an old client, a buggy client, a malicious client, or a perfectly reasonable client following documentation we accidentally made ambiguous.

PARISA: So the boundary code translates messy external input into a well-defined internal form. That makes the business function easier to reason about.

JULES: Right. After validating an identifier, we can pass a trusted internal representation to the next layer. That doesn't mean the whole request is trusted; it means this specific property passed the required checks.

PARISA: A good distinction. Trust is not a sticker we attach to the entire request after the first if statement.

JULES: Exactly. Authentication establishes a principal. Validation establishes input properties. Authorization establishes an allowed action. Each result has a scope.

## A Tiny Update With Several Real Decisions

PARISA: Let's receive new delivery instructions for order 42. The body says leave it by the side door. What happens first?

JULES: The request reaches the appropriate route. The server applies relevant body limits and parsing, establishes the caller, validates the identifier and writable fields, then checks whether the caller can update that order.

PARISA: The exact ordering can depend on the framework and threat model, but all those responsibilities need a home. We don't need to perform an expensive database lookup on an absurdly large invalid body.

JULES: Correct. Then the business operation checks that the order is still in an editable state and performs a conditional update or transaction that preserves the rule under concurrency.

PARISA: If successful, we might return the updated representation. That helps the client display what the server actually accepted, including any documented normalization.

JULES: Exactly. If the service rejects the update, it returns a meaningful outcome without silently discarding the user's work on the client.

PARISA: Normalization deserves care. Trimming irrelevant surrounding whitespace might be useful. Silently changing the meaning of someone's address because we dislike punctuation is not.

JULES: Right. Validation and normalization should reflect the domain, not arbitrary tidiness preferences.

## Database Failure Is Not Customer Error

JULES: Suppose the input is valid, the caller is allowed, but the database connection fails. What status should we choose?

PARISA: An appropriate server-side failure, not a validation error blaming deliveryInstructions. The specific code depends on what happened and what we can truthfully report.

JULES: Exactly. We also avoid reporting success before the required durable work completed. If the endpoint promises the instructions were saved, the response needs evidence for that promise.

PARISA: If the work is asynchronous, we can instead define a response saying the operation was accepted and provide a way to check its progress. Accepted is not the same word as completed.

JULES: Right. That distinction is useful for slow exports, report generation, or operations involving other systems.

PARISA: And a timeout doesn't necessarily mean the database did nothing. The application may need to determine the actual outcome before blindly repeating a state-changing operation.

JULES: Exactly. The uncertainty we saw from the client's side can also exist between the server and its dependencies.

## Framework Features Are Conveniences With Boundaries

PARISA: A framework automatically parses JSON and converts route parameters. Can we stop checking those things?

JULES: We can rely on documented, configured framework behavior for the properties it actually enforces. We still need application-specific checks. A parsed object isn't a valid order update merely because the parser returned it.

PARISA: And automatic error responses may need adaptation to match our public contract. We don't want one route returning a useful structured error while another returns a framework's default HTML page.

JULES: Exactly. Centralized error handling can make those outcomes consistent. But avoid catching every exception and converting it into an HTTP 200 with success false just to simplify one frontend branch.

PARISA: Because then HTTP-aware monitoring and clients lose useful outcome information. We can use the protocol's semantics and a meaningful body together.

JULES: Right. And if a framework updates, verify the behavior we depend on instead of assuming an implementation detail was a permanent guarantee.

## The Boundary Helps Testing

JULES: Separating a business rule from HTTP handling can let us test the rule directly. For example, which order states permit delivery-instruction changes?

PARISA: Then integration tests check that the route actually obtains the right identity, calls the rule, persists the result, and returns the promised response. Both kinds of test have useful jobs.

JULES: Exactly. A unit test of canEditOrder doesn't prove the route remembers to call it. A happy-path HTTP test doesn't explore every state transition.

PARISA: And access tests need more than “missing token returns an error.” Test two different users. Make sure one can't read or update the other's resources by changing identifiers.

JULES: Right. Also test tenant boundaries if the service supports multiple organizations. A valid staff role in one organization shouldn't grant access to another organization's orders.

PARISA: This is where realistic negative cases protect the actual promise. We aren't writing tests merely to prove our if statement contains the same condition as itself.

## Keep the External Contract Smaller Than the Implementation

JULES: Why not expose a generic endpoint that lets authorized callers choose a table, field, and update value?

PARISA: Because authorized to use the application isn't authorized to manipulate every internal detail. We would need an enormous policy surface, and clients would become coupled to our storage layout.

JULES: Exactly. A narrow operation like update delivery instructions captures a useful capability and gives us a manageable set of rules.

PARISA: It can evolve internally. We might move instructions into a separate table or add an audit record without changing the client's request shape.

JULES: Right. That's the interface benefit from Episode One reappearing on the server side. We preserve the supported behavior while changing how it is implemented.

PARISA: And if a change must become visible, we handle it as a contract change. We don't shrug and tell the mobile team to read the migration file.

## The Familiar PHP Connection

PARISA: If I were implementing this in PHP, I'd still need request parsing, validation, access checks, business logic, safe queries, and response construction. The language changes the syntax and libraries, not the existence of the work.

JULES: Exactly. Node doesn't make an API inherently modern, and PHP doesn't make it inherently old-fashioned. The contract and implementation quality matter.

PARISA: A framework can organize the responsibilities, but it can't decide whether a customer should be allowed to edit a dispatched order. That's our domain decision.

JULES: Right. The architecture is less mysterious when we separate generic server capabilities from rules belonging to our particular application.

## The Magic Was a Function

JULES: A route identifies the relevant handler. The handler interprets input, enforces identity and permissions, applies business rules, interacts with storage, and constructs a response.

PARISA: Those responsibilities can be arranged clearly without a forest of abstractions. And they're familiar backend work. An API is a deliberate interface around it.

JULES: Exactly. When you call an endpoint, somebody wrote code on the other side. Understanding that makes both consuming and debugging it less mysterious.

PARISA: Next time, identity and access. How does that code know who the hell I am?

JULES: And why “we have a token” is the beginning of several questions.

PARISA: Excellent. I've been meaning to interrogate the token.

[OUTRO MUSIC]

## Production References

- HTTP semantics and responses: https://www.rfc-editor.org/rfc/rfc9110.html
- OWASP API Security risks: https://owasp.org/API-Security/
- OWASP SQL Injection Prevention: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- Code is explicitly framework-neutral pseudocode. Authentication, authorization, validation, storage, transactions, and responses must be implemented in the selected server environment.