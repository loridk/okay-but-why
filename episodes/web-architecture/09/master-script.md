# Episode 9: Monoliths — One Application, Several Responsibilities

**Series:** Web Architecture • Episode 9 of 14
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — The Monolith Has Entered the Chat

[INTRO MUSIC]

PARISA: Someone called our application a monolith.

JULES: Technically reasonable.

PARISA: They said it like we'd found a damp patch behind the fridge.

JULES: Does it work?

PARISA: Yes.

JULES: Can we maintain it?

PARISA: Yes.

JULES: Then perhaps the damp patch is in the discourse.

PARISA: Welcome to *Okay, But Why?*. Today: one deployable application, and the astonishing possibility of organizing it.

## What the Word Means Here

JULES: We're using monolith to mean an application whose major capabilities are packaged and deployed together. It's a deployment description, not a diagnosis of code quality.

PARISA: A monolith can be small or large, tidy or tangled. It can have modules. It can expose an API. It can serve a React interface or ordinary HTML.

JULES: And it can run multiple copies behind a load balancer. One deployable unit doesn't mean exactly one running process on one machine forever.

PARISA: Nor does it mean the database must be installed on the same machine. Those are separate deployment choices.

JULES: Exactly. People sometimes collapse code organization, deployment, and hardware into one word. Then the argument gets very confident and very confused.

PARISA: Our pizza application has menu handling, ordering, staff access, and payment integration. We deploy that application together. That's our baseline monolith.

## Why Starting Together Can Help

JULES: A new product's boundaries aren't always clear yet. Keeping related work in one application lets us learn without committing every uncertain boundary to a network protocol.

PARISA: If order creation and pricing need to change together, we can modify both and test them in one change. We don't need three compatible service releases to discover that coupons are awful.

JULES: Local function calls are simpler than network calls. They don't have independent network timeouts or message serialization between modules in the same process.

PARISA: Still possible to fail, obviously. But fewer categories of failure.

JULES: A shared database can support transactions across related data. Development and debugging may be easier because the important path is in one codebase and process.

PARISA: For a small team, that matters. Operational simplicity is capacity we can spend on the actual product.

JULES: It can also make deployment easier: one coordinated application version. Though database migrations still require care, as we discussed last time.

PARISA: “One deploy” doesn't exempt us from compatibility or recovery. It just reduces some coordination.

## Modular Doesn't Mean Microservice

JULES: A modular monolith keeps strong internal responsibilities while deploying them together.

PARISA: Menu owns menu behavior. Ordering owns order acceptance. Payments coordinates payment-related work. Staff access has appropriate authorization boundaries.

JULES: These modules expose intentional interfaces to each other. One module shouldn't reach into another's internal data and rewrite it casually.

PARISA: For example, the route handler shouldn't calculate a price, insert payment rows, and toggle kitchen status all by itself. It should ask the relevant business operation to do the job.

JULES: That separates HTTP details from business decisions. The same order operation could serve a form handler and an API endpoint.

PARISA: Which is reuse with a reason. Not three abstraction layers because somebody told us every function needs a manager.

JULES: Exactly. We can start with straightforward modules and refine as responsibilities become clear.

## A Call Through the Application

PARISA: Trace an order inside the monolith.

JULES: The HTTP handler receives the request and validates its basic shape. It identifies the current session and calls the order-creation operation with the relevant identity and inputs.

PARISA: That operation checks business rules, asks pricing for the accepted calculation, and uses the data layer to write the order consistently.

JULES: Then the handler translates the result into HTML, a redirect, or JSON for the client.

PARISA: The business operation shouldn't need to know which CSS class the error message uses. The template shouldn't be deciding whether a refund is permitted.

JULES: Boundaries make changes easier to reason about. A new interface can call the same operation without duplicating the rule.

[CODE CARD: Responsibility map; not a required folder structure]
~~~text
HTTP handler -> Order operation -> Pricing rules
                               -> Order persistence
Response     <- Explicit result
~~~

PARISA: If you're listening, that's one handler asking one business operation to coordinate pricing and persistence, then translating the result for the client. No network between those modules is required.

## Layers and Features Are Different Views

JULES: Should we organize by technical layer—controllers, services, repositories—or by feature—orders, menu, payments?

PARISA: Depends on the application. Technical layers describe kinds of work. Feature modules group related business behavior. You can combine those ideas without making a directory for every noun.

JULES: The test is whether the structure helps someone make a change safely. Where would we change cancellation rules? Can we find the code that enforces them?

PARISA: And can we tell what depends on it? A beautiful folder tree with unrestricted imports can still become tightly coupled.

JULES: Tools can enforce some import boundaries. Code review and tests can protect behavior. But architecture requires people to understand why the boundary exists.

PARISA: Otherwise the next emergency adds a shortcut, then the shortcut becomes a highway, then everybody says monoliths are inherently bad.

## Shared Database, Deliberate Ownership

JULES: If modules share a database, how do we stop them from treating every table as public property?

PARISA: Establish ownership and access through defined operations. The orders module changes order state. Another module asks it to make a valid transition rather than issuing an arbitrary update.

JULES: Some teams use schemas or database permissions to reinforce that separation. Others begin with application-level boundaries. The degree of enforcement should fit the risk and team.

PARISA: A transaction across related modules can still be useful within the shared database. But we should be conscious of which business operation owns that coordination.

JULES: If we later extract a service, direct cross-module table access becomes migration pain. Clear boundaries today give us options without requiring extraction today.

PARISA: That's different from building fake network calls inside the process “for future flexibility.” We can preserve a meaningful interface without paying distributed-system costs early.

## Tests at the Right Boundaries

JULES: What would we test?

PARISA: Pricing rules for known cases. Order acceptance under invalid inputs and closed-shop conditions. Authorization for protected operations. Persistence behavior where concurrency or constraints matter.

JULES: And an end-to-end path proving the customer can submit and staff can see the accepted order.

PARISA: We don't need to test every getter merely because it exists. Focus on behavior and risk. A fast isolated rule test and a database integration test answer different questions.

JULES: That makes failures easier to locate. If a rule test fails, inspect the rule. If the full path fails, use the narrower tests and logs to investigate.

PARISA: Also test module boundaries with meaningful scenarios. If cancelling an order should release a reservation, verify that behavior rather than asserting that three private functions were called in a particular order.

JULES: Tests should help refactoring, not preserve accidental implementation details in amber.

## What Goes Wrong in a Monolith?

PARISA: Let's be fair. Shared deployment can become a bottleneck when many teams need independent releases.

JULES: And one expensive operation can consume resources needed by others. A CPU-heavy report can slow order handling if they're competing in the same process.

PARISA: A bug or memory leak can affect the whole application. The failure boundary may be larger than we'd like.

JULES: Builds and test suites can become slow. Unclear ownership can make every change require broad coordination.

PARISA: But diagnosis matters. Some problems can be improved by better modules, queries, tests, or moving long-running jobs to a worker process from the same codebase.

JULES: Exactly. Separately executing a background worker doesn't automatically require a microservice organization. You can deploy a web process and worker using the same application release.

PARISA: The change should target the bottleneck. If the problem is one slow report, extracting all customers into a new service is an impressively indirect response.

## Scaling a Monolith

JULES: Suppose request traffic grows. Can we run several application instances?

PARISA: Yes, if shared state and external dependencies are handled appropriately. Sessions, uploads, jobs, and database connections all need attention.

JULES: A load balancer can distribute requests. The instances may share the database and other necessary storage.

PARISA: They don't each become separate business services just because there are three copies. They're replicas of the same application.

JULES: Good distinction. Horizontal scaling and microservices are different axes. We'll give scaling a full episode.

PARISA: And database capacity can become the bottleneck no matter how many app copies we add. Architecture labels don't expand the database connection limit by applause.

## A Boundary That Might Deserve Extraction

JULES: Let's imagine a future requirement. Delivery-route optimization becomes expensive, has a clear input and output, and a separate team needs to release it independently.

PARISA: Now we have reasons to investigate a separate service: resource isolation, ownership, release independence, a meaningful contract.

JULES: We would still consider communication costs and failure behavior. If optimization is unavailable, can staff assign manually? Does ordering continue?

PARISA: Exactly. A useful extraction gives us a smaller, understandable failure area. It shouldn't turn every checkout into a mandatory call to an experimental routing engine.

JULES: We can first make the module boundary clear, then extract when the benefits justify the operational cost.

PARISA: We don't earn bonus points for extracting it before we know what it does.

## The Distributed Monolith Warning

JULES: What if we split into services but every change requires deploying all of them together?

PARISA: Then we've kept much of the coupling and added the network. People often call that a distributed monolith.

JULES: Not a precise formal category, but a useful warning. Separate processes alone don't create independent ownership or evolution.

PARISA: If service A reaches directly into service B's tables, or every request chains through six tightly coupled services, the boundaries may not be doing the job we expected.

JULES: Which is why a clear modular monolith can be easier to evolve than a poorly divided service system.

PARISA: Better boundaries first. More deployment units only when they help.

## Refactor a Tangled Order Handler

JULES: Let's make modularity concrete. We inherited one route handler that reads form fields, calculates discounts, writes rows, sends email, builds HTML, and checks staff permissions.

PARISA: A busy little function. I wouldn't begin by turning each paragraph into a service. First identify behavior we can test and responsibilities we can name.

JULES: Pricing could become a function that takes the relevant inputs and returns a result.

PARISA: Yes, if it can be expressed clearly without reaching into unrelated state. The order operation can coordinate validation and persistence. The response rendering can present the result.

JULES: Email becomes follow-up work rather than a condition for showing confirmation.

PARISA: If that's the business policy, and we record the work durably. We don't just move it into a function called later and hope the process remains alive.

JULES: How do we avoid a giant rewrite?

PARISA: Move one responsibility at a time, preserve behavior, and verify the important paths. Refactoring means changing structure without unintentionally changing behavior. If we also change policy, make that explicit.

JULES: The result may still be a handful of straightforward files.

PARISA: Excellent. Modularity isn't measured in directory depth. The improvement is that pricing can change without editing HTTP response markup, and the order rule has one authoritative implementation.

## A Module Interface Is a Small Promise

JULES: What should the order module expose?

PARISA: Meaningful operations, such as create an order from validated inputs or request cancellation under a known actor. Return explicit results. Don't expose every internal table and helper just because they're available.

JULES: Would you pass the whole HTTP request object into it?

PARISA: Usually I'd prefer the specific data and identity context it needs. Otherwise the business operation becomes coupled to a web framework and can start reading arbitrary headers or response methods.

JULES: That makes testing simpler too.

PARISA: Yes, and it makes the dependency visible. “This operation needs the customer's identity and the selected items” is easier to reason about than “this operation gets the universe.”

JULES: What if the operation needs the current time?

PARISA: Make that dependency understandable. Time affects opening hours and deadlines. Tests should be able to exercise those rules without waiting until midnight or changing the system clock.

JULES: We don't necessarily need a giant dependency-injection framework for that.

PARISA: Correct. A simple explicit argument or small dependency can be enough. Use the least machinery that makes the behavior clear and testable.

## Coupling Isn't Always Bad

JULES: We keep warning about coupling. But related things need to communicate.

PARISA: Exactly. Coupling means a relationship where changes or behavior depend on one another. Some coupling reflects the actual business. Order totals depend on pricing rules; that's not a design failure.

JULES: We want the relationship to be intentional and limited.

PARISA: Yes. Avoid accidental knowledge of internals. The order operation can ask pricing for a quote without knowing every private helper pricing uses.

JULES: And cohesion?

PARISA: How strongly the things inside a module belong together. If several pieces change for the same business reason, keeping them near each other can help.

JULES: So maximizing separation isn't the goal.

PARISA: Correct. Separate things that benefit from independence; keep related work understandable. Over-separation can scatter one simple change across fifteen files with names like AbstractPizzaStrategyFactory.

JULES: I was saving that for my next package.

PARISA: Please save it somewhere with no publish button.

## The Shared Release Tradeoff in Practice

JULES: The menu team wants a new photo layout, while the ordering team is changing cancellation rules. In a monolith, are they forced to wait for each other?

PARISA: Not necessarily for development, but deployment may be coordinated. Good tests, small changes, and clear ownership can reduce friction. If release coordination becomes a persistent measured problem, investigate it.

JULES: Could feature flags help?

PARISA: Sometimes. They can separate deployment from exposure of behavior, but they add configuration and cleanup responsibilities. Don't use flags as a permanent substitute for understanding dependencies.

JULES: A flag can hide an unfinished interface while compatible backend work is deployed.

PARISA: Yes, if the paths are tested and the flag's lifecycle is managed. A forest of forgotten flags becomes another architecture nobody can explain.

JULES: Again, a tool helps a specific coordination problem, not every problem by default.

## Failure Isolation Without Rewriting the Business

JULES: A nightly PDF report consumes lots of memory and crashes the web process. What would you try?

PARISA: First inspect the report's behavior and whether it can be bounded or streamed. Then consider moving that job to a worker process with appropriate resource limits, using the same application code if practical.

JULES: That gives process isolation while keeping one release model.

PARISA: Exactly. We can separate execution without pretending the reporting capability is independently owned and versioned. Architectural dimensions can change separately.

JULES: The web process queues a job and returns a pending report state.

PARISA: With authorization, durable job tracking, and a way to retrieve the result. We have introduced a real asynchronous workflow, so we must support failure and cleanup.

JULES: Still less disruption than splitting the entire order model into services.

PARISA: If it solves the actual problem, yes. The smallest targeted change is often easier to verify.

## A Future Extraction Rehearsal

JULES: How do clear modules help if we really do extract delivery optimization later?

PARISA: We know the inputs and outputs already. We can identify data access, callers, and failure assumptions. Then explicitly adapt the local interface to a network contract, rather than discovering hidden dependencies during deployment.

JULES: The local call may have assumed immediate success or shared objects.

PARISA: Exactly. Network serialization means we exchange representations, not references to the same in-memory object. Timeouts and partial failure become possible. We must revisit those assumptions.

JULES: So extraction isn't just changing an import into fetch.

PARISA: Correct. That's the visible edit, not the whole design. But a coherent module gives us a better starting point than tangled access to every table.

JULES: We preserve the option without paying the whole cost until there's a reason.

PARISA: That's the sort of future-proofing I can defend: clarity now, choices later.

## Document the Decision Without Writing a Novel

JULES: What should our architecture decision note say?

PARISA: Context: small team, one shop, related ordering workflow. Decision: one modular application with a primary relational database. Reasons: simple deployment, local coordination, familiar maintenance.

JULES: Consequences: shared release and failure boundary; need to protect module ownership. Revisit if a measured workload or team boundary justifies separation.

PARISA: That's enough to preserve the reasoning. Future developers can see why it was reasonable instead of assuming the original team had never heard of services.

JULES: And if circumstances change, the decision can change. A good decision under old constraints isn't retroactively foolish because the business grew.

PARISA: Architecture is allowed to have a history. It's not a prophecy contest.

## The Maintenance Test

JULES: Imagine we need to change the maximum number of pizzas per order. How do we know our modular design helped?

PARISA: We can find the authoritative rule, update its behavior and relevant tests, and see which interfaces need adjusted guidance. We don't discover four conflicting limits scattered across templates, routes, and database helpers.

JULES: The browser may still have a matching constraint for immediate feedback.

PARISA: Yes, but the server rule remains authoritative. If the two briefly differ during deployment, the server responds clearly rather than accepting invalid input.

JULES: Another change: a new receipt layout.

PARISA: That should mostly affect presentation. If it requires editing order-acceptance logic, perhaps responsibilities are too entangled.

JULES: Another: introduce a new payment provider.

PARISA: More consequential. A clear integration boundary helps, but providers can have different semantics. We must revisit lifecycle, idempotency, notifications, and reconciliation—not assume a shared method name makes them interchangeable.

JULES: So abstraction helps expose the differences, not erase them.

PARISA: Exactly. A useful interface captures what the application needs while admitting meaningful provider behavior. A fake universal interface can hide the very details that matter.

JULES: What if the app is already tangled? Is it too late to remain a monolith?

PARISA: No. Improve boundaries incrementally around real changes. Extract a rule, clarify an operation, reduce direct table access, add a meaningful test. You can make substantial progress without changing deployment architecture.

JULES: That's reassuring in a practical way. We don't have to announce a rewrite before improving one thing.

PARISA: Exactly. A small verified structural improvement is real work. A migration slide deck is still a proposal.

JULES: And if we later split, those improvements weren't wasted.

PARISA: They make the split easier to reason about. Or they may solve enough of the problem that we no longer need it. Both are useful outcomes.

## A Monolith Is Allowed to Stay

JULES: We often describe a modular monolith as a stepping stone. Does it have to become services eventually?

PARISA: No. If it continues to meet the business and team's needs, it can remain the architecture. Growth doesn't create a moral obligation to distribute the code.

JULES: So clear boundaries are useful even if we never extract anything.

PARISA: Absolutely. They help maintenance, testing, onboarding, and reasoning about change. Future extraction is one possible benefit, not their only purpose.

JULES: And the reverse can happen too: a team may consolidate services when the boundaries or overhead no longer make sense.

PARISA: Yes. Architecture can move in either direction. The right question is whether the current arrangement helps the work, not whether the diagram has more arrows than last year.

JULES: That makes this less like an evolutionary ladder.

PARISA: Exactly. We aren't waiting for our application to grow legs and crawl into Kubernetes. We are maintaining software under constraints.

JULES: A slightly less cinematic story.

PARISA: But one where the pizza arrives. I remain committed to that outcome.

## Closing — One Home, Several Rooms

JULES: A monolith packages major capabilities together. A modular monolith gives them deliberate internal boundaries.

PARISA: It can be scalable, testable, and maintainable. It can also become tangled. The deployment label alone doesn't decide.

JULES: Next time: microservices. When independent services help, and why a network boundary is not a free wall.

PARISA: Our monolith will remain here, accepting orders and declining to apologize for it.

[OUTRO MUSIC]

## Production Notes

- Diagram is responsibility notation, not required source architecture or framework syntax.
- Worker separation, horizontal replicas, and microservices are deliberately distinguished.
- No fictional growth scenario is presented as an actual company case study.

## Production References

- Martin Fowler, Monolith First: https://martinfowler.com/bliki/MonolithFirst.html
- James Lewis and Martin Fowler, Microservices: https://martinfowler.com/articles/microservices.html
