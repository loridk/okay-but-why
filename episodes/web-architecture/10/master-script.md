# Episode 10: Microservices — Congratulations, Your Function Call Has Weather

**Series:** Web Architecture • Episode 10 of 14
**Hosts:** Parisa, Jules; Sabrina joins the failure exercise
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — The Pizza Is Distributed

[INTRO MUSIC]

PARISA: We split the application into services.

JULES: Why?

PARISA: I wanted the order module to stop borrowing my charger.

JULES: That is not a deployment requirement.

PARISA: Now the menu works, payments are unavailable, and dispatch says the order is both cancelled and on a bicycle.

JULES: Today on *Okay, But Why?*: distributed systems, but with dinner.

## What We Hope to Gain

JULES: Microservices organize capabilities into separately deployable services with defined interfaces. The word micro doesn't prescribe an exact line count.

PARISA: The meaningful promise is independence: a service can evolve, deploy, and sometimes scale with less coordination, when its boundary is well chosen.

JULES: A team might own delivery routing while another owns ordering. They can choose suitable implementation details behind stable contracts.

PARISA: There can also be resource or failure isolation. Heavy route calculations don't have to compete directly with checkout in one process.

JULES: Those are benefits worth considering. But they depend on actual boundaries. Splitting files into separate containers doesn't automatically produce them.

PARISA: And a small team can end up responsible for twelve deployments, twelve sets of logs, and twelve ways to have a bad evening.

## What the Network Adds

JULES: A local call becomes a request to another process. Now it can time out, arrive late, fail independently, or return after the caller has given up.

PARISA: We must serialize data, authenticate callers, authorize operations, manage versions, and observe behavior across the boundary.

JULES: And we can't assume one shared transaction covers all services. Each may control its own data and commit separately.

PARISA: The neat arrow is an agreement between independently failing participants. It's not a function call that moved to a nicer neighborhood.

JULES: Exactly. Good service design tries to make those agreements coarse enough and stable enough to be worthwhile.

PARISA: If one customer request needs forty tiny calls between services, we may have cut through the middle of a cohesive operation.

## Boundaries Follow Capabilities

JULES: “One service per database table” is usually a poor starting rule. Tables aren't automatically independent business capabilities.

PARISA: Orders and order items need to cooperate closely. Splitting them because they have different plural nouns can create constant network chatter and consistency problems.

JULES: Better questions: what does this capability own? Which decisions can it make? What data is authoritative there? Can its interface remain stable while its internals change?

PARISA: Delivery optimization might accept a set of deliveries and constraints, then return a proposed route. That's a clearer boundary than a service that answers one field at a time.

JULES: And its output can be a suggestion rather than an order-acceptance dependency. Staff can fall back to manual assignment if it's unavailable.

PARISA: A failure boundary earns its keep when the rest of the system can behave sensibly around it.

## Data Ownership Is the Hard Part

JULES: If services each own data, other services should use their interfaces or published information rather than freely modifying their tables.

PARISA: Otherwise changes remain tightly coupled through the database, even if the applications deploy separately.

JULES: That doesn't necessarily require separate physical database machines for every service. It does require deliberate ownership and access boundaries.

PARISA: But shared storage arrangements can still create coupling and failure risks. We should be honest about them rather than declaring independence because there are separate connection strings.

JULES: And once facts are copied between services, we must define how updates propagate and what stale data means.

PARISA: A reporting service can tolerate being a few minutes behind under some requirements. Authorizing a refund from stale payment state is a different concern.

## Commands and Events

JULES: A command asks for something to happen: reserve this delivery slot. An event says something happened: order accepted.

PARISA: The names should reflect that distinction. “Please send a receipt” is a request for work. “Order accepted” can interest several independent consumers.

JULES: Services can communicate synchronously, waiting for responses, or asynchronously through messages. Neither style is universally better.

PARISA: Synchronous calls can be easier to follow but create waiting and availability dependencies. Asynchronous messages can decouple timing, but now we need pending states, retries, and visibility into delayed work.

JULES: A queue holds work for consumers. If the email provider is slow, queued receipt work can wait without holding open the customer's checkout request.

PARISA: But the work has to be durably recorded. Starting an untracked background promise and returning success isn't the same as reliable queuing.

JULES: And a queue doesn't guarantee the work succeeds. It gives us a mechanism to manage delivery and processing under defined semantics.

## Save the Order and Remember the Message

PARISA: Here's an awkward gap. We save the order, then publish “order accepted.” The process crashes between those steps. No message.

JULES: Or we publish first, then the database write fails. Now somebody heard about an order that wasn't committed.

PARISA: This is where an outbox pattern can help. Save the order and a record of the message to send in the same local database transaction. A separate publisher reads that durable outbox and delivers the message.

JULES: It closes the gap between local state and the intent to publish. It doesn't automatically make message delivery exactly once.

PARISA: The publisher can deliver, crash before marking completion, then deliver again. Consumers need to tolerate duplicates or deduplicate based on stable identifiers.

JULES: That is a concrete additional responsibility. We didn't say “event-driven” and gain perfect coordination.

PARISA: We gained a place to store the unfinished responsibility, which is useful and more honest.

## Sabrina Pulls the Plug

[STING: ASK THE INTERN]

SABRINA: I have three failure cards. First: the payment service took the request, but our call timed out.

JULES: Unknown outcome. Don't blindly create another charge. Use the provider's supported idempotency and status mechanisms, and reconcile the result.

PARISA: The order can show payment pending while we resolve it. The customer shouldn't be told it's paid or definitely uncharged without evidence.

SABRINA: Second: the receipt worker receives the same message twice.

PARISA: The handler should avoid harmful duplicate effects. Track processing as appropriate, use stable operation identifiers, and understand the email provider's behavior.

JULES: Deduplication records and side effects need careful coordination. “Check then send then mark” still has crash windows, so guarantees depend on the whole path.

SABRINA: Third: a cancellation event arrives before an older acceptance event.

JULES: Don't apply events by arrival order without considering their meaning. Versioning or a valid state-transition model can help detect stale updates.

PARISA: The system mustn't resurrect the order because an older message finally found parking.

SABRINA: Excellent. My fourth card is that nobody knows which service failed.

JULES: You said three.

SABRINA: Distributed counting.

## Observability Is Part of the Cost

PARISA: We need logs, metrics, and traces that let us follow an operation across services. Otherwise every team sees its own success and the customer sees no pizza.

JULES: A trace can connect spans of work across the request path. Correlation identifiers help link related messages and logs, while avoiding unnecessary sensitive data.

PARISA: Metrics should include business outcomes and delays, not just whether processes are alive. Orders stuck in payment pending, queue age, failed deliveries of work.

JULES: And ownership. Who responds when a message repeatedly fails? Where does it go after bounded retries? How can an operator inspect and safely replay it?

PARISA: A dead-letter queue is a place for problematic messages, not a retirement home where work goes to be forgotten.

JULES: Exactly. The operational procedure is part of the architecture.

## Retries Can Make an Outage Worse

PARISA: Service is slow, so every caller retries immediately. The service now has more work because it was struggling with the original work.

JULES: A retry storm. Use timeouts, bounded retries, backoff, and often jitter so clients don't synchronize their next attempts.

PARISA: Jitter means some random variation in timing, not a new JavaScript framework, although give it a week.

JULES: Only retry operations that are safe under the defined semantics. A circuit breaker can temporarily stop calls to a failing dependency and let the system use a fallback or fail promptly.

PARISA: A fallback must be honest. “Recommendations unavailable” can be fine. “Payment approved by optimistic imagination” cannot.

JULES: Bulkheads isolate resources so one failing dependency doesn't consume every worker or connection. The ship metaphor fits the containment idea, not the literal implementation.

PARISA: All of these patterns have configuration and testing costs. That's the price of making independent failures manageable.

## Sagas and Compensation

JULES: An order workflow across services may use a sequence of local transactions, with compensating actions if later steps fail. That's often called a saga.

PARISA: Compensation isn't time travel. Refunding a payment is a new business action, not erasing the fact that the charge happened.

JULES: Exactly. Releasing a reservation, requesting a refund, notifying staff—each can also fail and need follow-up.

PARISA: So the workflow should have explicit states and recovery paths. We should be able to explain what happens if it stops halfway.

JULES: And sometimes the best answer is not to distribute that tightly coordinated transaction in the first place. Keeping related work together may be simpler.

PARISA: That's allowed. Learning the advanced pattern doesn't obligate us to manufacture the problem it solves.

## Security Doesn't End at the Internal Network

JULES: Services need identities and appropriately limited permissions. “It's internal” doesn't mean every caller may do everything.

PARISA: Especially if one compromised component could otherwise issue refunds, read all customer data, and change staff roles.

JULES: Protect service credentials, rotate them according to the platform and policy, and authorize operations. Minimize the data in messages as well as responses.

PARISA: Every extra service and queue can create another place customer information is stored. Data minimization and retention become coordination problems too.

JULES: Which is a reason to include security in the design, not a reason to avoid every service architecture. The costs should be visible.

## The Checkout Chain We Should Question

JULES: Imagine checkout synchronously calls customer service, menu service, discount service, inventory service, payment service, and delivery service before it can answer.

PARISA: First, customer service should get a less confusing name. Second, we have made a chain of dependencies part of the critical path.

JULES: Even if each one is usually fast, the combined path can be slow. And if any required step is unavailable, checkout may fail.

PARISA: We shouldn't multiply made-up reliability percentages and call it a forecast, because failures may be correlated. But the qualitative issue is clear: more mandatory dependencies create more ways to be unable to finish.

JULES: Could we make all calls in parallel?

PARISA: Only if they're actually independent. Payment may depend on the accepted amount. Delivery availability may depend on the address and time. Parallel execution isn't a way to ignore data dependencies.

JULES: Could some information be local or cached?

PARISA: Perhaps, if its freshness and authority requirements permit it. But copying discount rules into every service can create another consistency problem. We need to examine the capability boundary, not merely accelerate a poor split.

JULES: So the first question is whether all those separate services should exist for this workflow.

PARISA: Exactly. A tightly coordinated order operation might belong together. A recommendation system can fail independently without blocking dinner. That distinction is much more useful than “every noun gets an endpoint.”

## Who Coordinates the Workflow?

JULES: With several services, something has to connect the steps. Do we use one coordinator?

PARISA: One option is orchestration: a component explicitly manages the sequence and tracks progress. It asks for payment, reservation, or cancellation according to the workflow.

JULES: Another is choreography, where services react to events and publish their own results.

PARISA: Both can work. Orchestration can make the overall flow visible, but the coordinator can become too knowledgeable or important. Choreography can reduce central control, but the complete behavior may be harder to trace across subscriptions.

JULES: So “event-driven” doesn't tell us whether the workflow is understandable.

PARISA: Correct. Someone should be able to explain why an order is stuck and which participant is responsible for the next step. If the answer requires interviewing six teams, the design has an operational cost.

JULES: We can document the states and transitions regardless of style.

PARISA: Yes. A business process exists even if no single file contains it. Distributed implementation makes that documentation more valuable, not less.

## A Duplicate Message Is Not Necessarily a Duplicate Effect

JULES: Let's distinguish delivery guarantees from business outcomes. A broker may deliver a message more than once.

PARISA: The consumer can aim to make repeated processing produce the same intended result. For example, recording that order 417 is accepted shouldn't create another order every time the event is received.

JULES: A unique event identifier can help recognize repeats.

PARISA: Yes, but the deduplication record and the business change need appropriate coordination. If we mark the event processed before doing the work and crash, we may skip unfinished work on retry.

JULES: If we do the work first and crash before marking it, we may repeat it.

PARISA: Exactly. For local database effects, a transaction can often group the deduplication record with the change. For external effects, the downstream system's supported idempotency matters too.

JULES: So “exactly once” needs a scope. Exactly once in which system, during which interval, and for which effect?

PARISA: Precisely. A message system's guarantee doesn't automatically cover an email or a card charge outside it. Ask where the guarantee ends before relying on it.

## The Event Contract Changes Too

JULES: We rename order_total to total_cents in an event. Is that easier than changing an HTTP response because messages are asynchronous?

PARISA: Not automatically. Consumers may still expect the old field. Old messages may remain in queues or be replayed later. The schema has a compatibility lifetime beyond the latest deployment.

JULES: So we need versioning or compatible evolution and a clear meaning for fields.

PARISA: Yes. Units, currency, identifiers, event time, and version matter. And an event should communicate the necessary business fact without dumping every private field from the database.

JULES: What if a consumer is offline for a day?

PARISA: Its catch-up behavior must be defined. Are messages retained long enough? Can it rebuild state from another source? What happens if it misses history? The answer depends on the system's guarantees.

JULES: This is a different maintenance burden from a local function call updated in the same release.

PARISA: Exactly. Independence is useful, but the contracts become more durable commitments.

## Testing Without Recreating the Entire Internet

JULES: If every developer needs twelve services running locally, the development setup can become painful.

PARISA: Good boundaries can let teams test much of a service in isolation, with realistic contract tests and selected integration tests. But a mock that always returns success won't reveal real failure behavior.

JULES: We should test timeouts, duplicates, invalid messages, and unavailable dependencies where those affect the service's responsibilities.

PARISA: And have a smaller number of end-to-end tests for critical business paths. The goal isn't every test launching the whole fleet, nor every service passing isolated tests while the actual workflow fails.

JULES: Contract tests can catch incompatible expectations between producer and consumer.

PARISA: Yes, with the same limitation we discussed for APIs: they verify the agreed contract, not every emergent behavior. Observability and controlled rollout still matter.

JULES: We can also rehearse recovery from a failed consumer.

PARISA: Exactly. Can it resume without losing or duplicating consequential work? That's a much more meaningful test than “the process starts.”

## The Cost of Ownership

JULES: A service has an owning team. What does ownership include beyond writing its code?

PARISA: Understanding its contracts, deployments, alerts, capacity, security permissions, data retention, and recovery procedures. If it fails during a critical workflow, someone must know how to respond.

JULES: So creating a service creates ongoing work even when its business logic is small.

PARISA: Yes. A forty-line service can have a substantial operational footprint. Line count is a poor proxy for total complexity.

JULES: A platform team can provide common deployment and monitoring infrastructure.

PARISA: That can reduce repeated work, but it's another capability the organization must fund and maintain. Large organizations may benefit enormously. A two-person pizza team probably shouldn't pretend those resources already exist.

JULES: We should count the humans and systems needed to keep the design healthy.

PARISA: Exactly. Architecture diagrams often make labor invisible. The invoice eventually corrects that omission.

## Extract One Capability Safely

JULES: Suppose route optimization really deserves separation. What's a sensible migration path?

PARISA: Clarify the existing module interface and data needs. Build the new service against that contract. Compare results using safe representative inputs where appropriate. Introduce the network path gradually with a fallback and monitoring.

JULES: We shouldn't let both old and new implementations independently commit conflicting assignments.

PARISA: Correct. Be explicit about which path is authoritative. Shadow computation can compare suggestions, but shadow writes to real business state require much more care.

JULES: Then retire the old path once the new one is proven and the rollback plan is understood.

PARISA: Yes. Migration includes cleanup. Keeping both forever can preserve all the complexity and none of the clarity we wanted.

JULES: And if the measured benefit doesn't appear?

PARISA: Reconsider. Architecture isn't a loyalty program. We can decide the service boundary wasn't worth its cost and simplify again.

## Is It Worth It for Our Shop?

PARISA: Two developers, one neighborhood, straightforward ordering. Do we split the core into microservices now?

JULES: No convincing reason yet. A modular monolith and perhaps a durable background-work mechanism meet the needs with less operational overhead.

PARISA: If we eventually have independent teams, distinct workloads, clear ownership, and mature operations, the calculation may change.

JULES: We could extract one capability at a time, preserving compatibility and observing whether the expected benefit actually arrives.

PARISA: Not a grand rewrite in which we replace every local call with a network incident simultaneously.

JULES: And no universal traffic threshold says “at this number, microservices.” Team structure, failure needs, data boundaries, and release demands all matter.

PARISA: If the only reason is “large companies use them,” ask which problem those companies were solving and whether we share it.

## The Decision We Would Decline

JULES: A team proposes a separate service for toppings, one for crusts, and one for sizes. What would you ask?

PARISA: Whether they have independent ownership, release needs, workloads, and meaningful contracts. If every menu change must update all three together, we may have split one cohesive capability into several deployment chores.

JULES: What if each is very small?

PARISA: Small code isn't the goal. Useful independence is. Three tiny services can be harder to operate than one clear module containing the same rules.

JULES: Could the right answer still be services in a much larger business?

PARISA: Perhaps, under different constraints. We shouldn't ridicule a design without knowing its context. But for our stated shop, the proposal hasn't shown a benefit that pays for the network and operations.

JULES: So the review can be firm without turning into “microservices are stupid.”

PARISA: Exactly. “This boundary doesn't solve our current problem” is a defensible conclusion. “Every organization should use my favorite architecture” is a podcast we are not making.

JULES: We can leave a clear module interface and revisit if ownership changes.

PARISA: Yes. That's a reasonable next step, not a consolation prize.

## Closing — Independence Has an Invoice

JULES: Microservices can support independent deployment, ownership, scaling, and failure isolation. They introduce distributed coordination and operations work.

PARISA: Good boundaries create benefits. Merely increasing the process count creates processes.

JULES: Next time: caching and CDNs. How doing less repeated work helps, and how to avoid serving yesterday's truth to the wrong person.

PARISA: Our functions will remain indoors until the forecast improves.

[OUTRO MUSIC]

## Production Notes

- Sabrina appears for a bounded failure exercise. No new specialist character is invented.
- Commands/events, outbox, saga, circuit breaker, and jitter are architectural concepts, not language syntax.
- Exactly-once effects are not promised; deduplication and crash windows are explicitly discussed.

## Production References

- James Lewis and Martin Fowler, Microservices: https://martinfowler.com/articles/microservices.html
- AWS, Transactional outbox pattern: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html
- AWS Builders' Library, Timeouts, retries, and backoff with jitter: https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
