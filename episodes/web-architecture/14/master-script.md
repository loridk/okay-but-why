# Episode 14: Build an Architecture in Your Head — Reasons Before Rectangles

**Series:** Web Architecture • Episode 14 of 14
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — The Whiteboard Is Empty

[INTRO MUSIC]

JULES: I brought a blank architecture diagram.

PARISA: Finally. A system with no known incidents.

JULES: We need to design Nervous Robot Pizza Delivery.

PARISA: Before you draw a cloud, tell me who is hungry.

JULES: Welcome to the Web Architecture finale of *Okay, But Why?*. Today we put the pieces together.

PARISA: Not by including all of them. That's a buffet, not a design.

## The Requirements Meeting

JULES: Fictional scenario. One neighborhood restaurant. Small development team. Customers browse a menu, choose pickup or delivery, review a price, and place an order. Staff accept and fulfill it.

PARISA: Clarify “accept.” Does submitting guarantee the kitchen will make it, or is staff approval required?

JULES: Let's say the system accepts only while the shop has capacity, and accepted orders become a commitment. Staff can handle exceptions through an explicit cancellation process.

PARISA: Good. That's a business promise we can represent. Payment?

JULES: Online payment through a specialist provider, with its supported hosted or integrated payment flow. We don't store raw card details ourselves.

PARISA: Accounts?

JULES: Guest ordering is allowed. Optional customer accounts for history. Staff must authenticate, with permissions appropriate to their tasks.

PARISA: Availability?

JULES: The business needs orders recorded reliably and clear communication when ordering is unavailable. We haven't been given a global availability target or unlimited budget.

PARISA: Then we shouldn't invent one. We document recovery expectations with the business before committing to an elaborate design.

## Identify the Critical Facts

JULES: What must the system know?

PARISA: Current menu and prices. Accepted order contents and amount. Fulfillment choice and needed contact details. Payment state. Order status. Staff permissions.

JULES: Which facts are temporary?

PARISA: The browser's draft selections, open panels, and possibly a tentative delivery slot. They aren't accepted commitments until the server says so.

JULES: Which facts need historical snapshots?

PARISA: What was ordered and at what accepted price. Updating today's menu mustn't rewrite yesterday's receipt.

JULES: Which data can we avoid collecting?

PARISA: Anything not needed for fulfillment, support, or another justified purpose. Pickup shouldn't demand a delivery address out of habit. Retention needs a policy too.

JULES: Good. The data model begins with meaning, not whichever fields a checkout template included.

## Choose a Modest Baseline

PARISA: One modular web application, a relational database, maintained authentication/session tooling, and the payment provider integration. Public information can be static or cached. Ordering uses server-rendered pages with useful enhancements.

JULES: Why a monolith?

PARISA: Small team, closely related workflow, straightforward deployment, local coordination. No demonstrated need for independent service releases yet.

JULES: Why a relational database?

PARISA: Orders and items have relationships, and local transactional integrity matters. It's a sensible fit, not a claim that every other database is wrong.

JULES: Why not a full customer-facing SPA?

PARISA: Basic browsing and checkout can work well with documents and forms. We'll add local interaction where it improves a real task. The staff dispatch area may justify more later.

JULES: Why use a payment provider?

PARISA: Payments are a specialist capability with requirements we shouldn't casually recreate. But we still own our integration, order state, and handling of uncertain outcomes.

## Walk the Happy Path Slowly

JULES: Customer opens the menu.

PARISA: Browser requests the page. Public content can come from eligible cached or prepared output. The browser gets semantic HTML and styles. Any enhancement code has a specific job.

JULES: Customer chooses items and quantity.

PARISA: Browser keeps the draft and can show an estimate. Server checks current availability and calculates the amount used for the actual agreement.

JULES: Customer proceeds to payment.

PARISA: The application creates an appropriate pending order or checkout record, following the provider's supported flow. It tracks a stable identifier so retries refer to the same attempt.

JULES: The payment result returns.

PARISA: We verify the provider's authoritative information. Don't trust a browser redirect alone as proof of payment. The application transitions the order according to the confirmed outcome and business rules.

JULES: Staff see an accepted order.

PARISA: Through an authenticated, authorized view of durable order state. We show clear statuses, useful errors, and an accessible interaction path.

JULES: Receipt email follows.

PARISA: Record that follow-up durably if we promise it. A background worker can deliver it without making checkout wait for email. We don't need a whole microservice team for that responsibility.

## Draw Only the Needed Boxes

[CODE CARD: Baseline responsibility map, not deployment instructions]
~~~text
Customer / staff browser
          |
     Web application ---- Payment provider
          |
     Order database
          |
     Durable follow-up work -> Receipt delivery
~~~

JULES: For listeners, there is a browser talking to our application. The application uses the order database and payment provider. Durable follow-up work supports receipt delivery. The diagram doesn't require every line to be a separate service.

PARISA: We still need hosting, secure connections, backups, logs, and deployment. We can show those in a deployment view rather than cramming them into this responsibility map.

JULES: What about a CDN?

PARISA: Use it if the hosting arrangement provides it or measured delivery needs justify it. Public asset caching is useful, but it isn't a prerequisite for understanding the order transaction.

## Now Break the Happy Path

JULES: The customer's connection drops after submission.

PARISA: The outcome may be uncertain. Use the stable attempt identifier and status lookup. Don't create a fresh order automatically just because the response was lost.

JULES: Payment succeeds but our notification processing is delayed.

PARISA: Keep a pending state and reconcile through supported provider mechanisms. Staff and customers need truthful information. Alert when orders remain stuck beyond an acceptable period.

JULES: The email provider fails.

PARISA: Keep the accepted order. Retry durable receipt work within a bounded policy and expose repeated failures to an operator. Email isn't the only proof the order exists.

JULES: Database unavailable.

PARISA: Don't claim to accept orders we cannot record reliably. Public information may remain available. Ordering shows an understandable unavailable state and a business-approved alternative if one exists.

JULES: Customer requests another person's order identifier.

PARISA: Server-side authorization denies access. Identifier obscurity and hidden UI controls are not the policy.

JULES: Two customers buy the last available slot.

PARISA: Enforce the capacity rule atomically with appropriate database coordination. Return a meaningful conflict to the one whose request cannot be accepted.

## Accessibility Is in the Flow

JULES: The team says they'll add accessibility after the API is done.

PARISA: Then the API may already be missing the states we need. Validation errors should identify fields. Pending and uncertain outcomes need distinct representations. The interface needs to explain what happened.

JULES: Use labels and semantic controls. Support keyboard operation. Manage focus when navigation or errors require it. Don't communicate status only with color.

PARISA: Allow review before a consequential action. Keep the accepted price visible. If it changes, ask for renewed agreement instead of silently replacing it.

JULES: Staff workflows matter too. A map-only interface or frantic auto-updating list can make the work difficult or impossible for some staff.

PARISA: An architecture is successful when people can complete the task, not merely when the endpoint returns two hundred.

## The First Growth Scenario

JULES: More people read the menu after a local article. Ordering volume grows modestly. What's our first response?

PARISA: Measure. Cache eligible public content, optimize expensive repeated queries, serve appropriately sized images, and inspect the actual bottleneck.

JULES: If the application needs more capacity?

PARISA: Consider vertical resources or additional replicas. Make sure sessions, uploads, and jobs aren't tied accidentally to one process. Respect database and provider limits.

JULES: Do we split into services?

PARISA: Not merely because traffic increased. Replicating the monolith and improving queries may solve the problem with less change.

JULES: And if the kitchen is overwhelmed?

PARISA: Change capacity controls and delivery promises. Servers cannot expand oven space.

## The Second Growth Scenario

JULES: The shop opens several locations. Delivery optimization becomes expensive. A dedicated team wants to improve it independently.

PARISA: Now investigate that boundary. It has a distinct workload, ownership, and release cadence. Define inputs, outputs, failure behavior, and data needs.

JULES: Extract it as a service?

PARISA: Maybe. First verify the benefit and make the internal interface clear. If extracted, keep ordering able to proceed with an appropriate fallback when route suggestions fail.

JULES: What does the service own?

PARISA: Its optimization behavior and relevant state. It shouldn't directly rewrite orders behind the ordering module's back. Accepted assignments still need a defined authoritative operation.

JULES: So we add the network boundary for a reason, along with monitoring, authorization, timeouts, and compatibility work.

PARISA: Exactly. Complexity arrives with a job description and an owner.

## The Third Growth Scenario

JULES: The public menu changes frequently, the editorial team wants fast publication, and the static build is getting slow.

PARISA: Revisit that rendering workflow. Maybe selective regeneration, request-time rendering with caching, or a different publication strategy fits better.

JULES: We don't have to rewrite the order system just because content publishing changed.

PARISA: Correct. Rendering strategy and service decomposition are different choices. Good boundaries let us change the relevant part.

JULES: And we test freshness: how long until a published change is visible, what happens on rebuild failure, and whether private information can enter public output.

PARISA: The requirement is timely accurate content, not allegiance to SSG.

## Reject a Design for Reasons

JULES: I propose globally distributed microservices, multiple specialized databases, a message bus, and a fully client-rendered public menu.

PARISA: Which requirement needs each one?

JULES: Future scale.

PARISA: Which kind, and when?

JULES: Unspecified.

PARISA: Then we haven't justified the cost. We can record possible future needs without implementing all of them.

JULES: What if I propose a single script that trusts browser prices, stores passwords as text, and writes orders to a temporary file?

PARISA: Also rejected. Simplicity must still satisfy correctness, security, durability, and accessibility. Incomplete isn't the same as simple.

JULES: So the principle has two halves: meet the actual problem, and avoid unnecessary complexity.

PARISA: Exactly. Either half alone produces bad advice.

## A Listener Design Challenge

JULES: Let's give listeners a fresh scenario inside the same business. Nervous Robot wants a public catering inquiry form. No payment, no instant booking. A person reviews the request and replies later.

PARISA: Before we answer, think about which parts of our ordering architecture still apply and which promises are different. You can pause if you want; we're going to work through it together.

[PAUSE: brief thinking beat]

JULES: My first instinct is a form on a server-rendered page. The submission is validated and recorded. A confirmation says the inquiry was received, not that catering is booked.

PARISA: Good. The distinction between receipt and acceptance matters. What data do we need?

JULES: Contact information, event date, approximate group size, and relevant details. Avoid asking for information we don't need at this stage.

PARISA: How does staff learn about it?

JULES: An authenticated inquiry list, perhaps with a notification as follow-up work. The database record remains the source of the inquiry, so email failure doesn't erase it.

PARISA: What if the customer submits twice after a timeout?

JULES: A stable attempt identifier and appropriate duplicate handling can help. Even though it isn't a payment, duplicates waste staff time and confuse customers.

PARISA: Does it need microservices or a full SPA?

JULES: No requirement we've stated demands them. Use the existing application's clear module boundary unless evidence suggests otherwise.

PARISA: That's the transfer we want. We didn't memorize pizza endpoints. We learned how to identify the promise and build the path around it.

## A Different Problem Deserves a Different Answer

JULES: Now suppose the business wants a collaborative seating planner for large events. Several staff edit a layout together, with frequent visual changes.

PARISA: That may justify a richer client application and a real-time coordination design. The task has changed substantially.

JULES: We'd need to define concurrent editing behavior, permissions, persistence, and what happens when someone disconnects.

PARISA: And an accessible alternative to purely visual dragging. The data model should support meaningful operations independent of mouse gestures.

JULES: A simple form-only flow might be awkward for the core task.

PARISA: Exactly. “Start simple” doesn't mean force every problem into the first architecture we liked. It means choose the least complexity that actually meets the need.

JULES: We might still keep the authoritative backend in the same application initially.

PARISA: Yes. Rich client interaction doesn't imply a distributed backend. Separate the decisions and justify each one.

## What Evidence Would Change Our Minds?

JULES: Let's make the revisit triggers more concrete. The order list is slow.

PARISA: Gather query timings and request traces with representative data. If an N-plus-one query dominates, fix the query. If a resource is saturated after sensible optimization, consider capacity. Don't jump from symptom to service architecture.

JULES: Deployments are blocked by unrelated teams.

PARISA: Examine module ownership, test structure, and release dependencies. If a capability has a stable boundary and genuinely needs independent deployment, extraction may help.

JULES: Customers complain that the menu is outdated.

PARISA: Measure publication-to-visibility time across build, origin, CDN, and browser layers. Adjust the content workflow or caching policy. Rewriting authentication would be an unusual response.

JULES: Staff miss orders because the screen updates unpredictably.

PARISA: Observe the workflow. Improve update communication, sorting stability, and acknowledgment behavior. More frequent polling may make the problem worse if the list keeps jumping.

JULES: So evidence doesn't merely tell us that change is needed. It tells us which responsibility to change.

PARISA: Exactly. Otherwise every incident becomes an excuse to implement whichever technology we wanted to try anyway.

## Make a Recovery Plan Reviewable

JULES: We said we need recovery. What would a concrete review include?

PARISA: A documented restore process tested in an appropriate environment, a way to identify unresolved payment attempts, a procedure for failed follow-up work, and clear ownership for incidents.

JULES: Also a way to pause new orders if fulfillment or recording is unreliable.

PARISA: Yes. A controlled unavailable state can be safer than accepting commitments we cannot honor. The business should know who may activate it and how customers are informed.

JULES: What should we avoid claiming?

PARISA: Don't say backups are proven unless a restore was tested. Don't say payments are exactly once without a scoped guarantee. Don't say the site is accessible because we used a framework with an accessibility page.

JULES: Evidence for the actual implementation.

PARISA: Exactly. Good architecture language is precise about what we know, what we assume, and what still needs verification.

## The Smallest Useful Documentation Pack

JULES: We don't want a hundred-page document nobody reads. What would you keep?

PARISA: A responsibility map, a deployment view when needed, the critical order sequence, a short data-ownership description, and decision notes for consequential choices. Plus recovery procedures people can actually follow.

JULES: And the API contract if there are consumers depending on it.

PARISA: Yes. Include errors and lifecycle behavior, not just happy-path fields. Keep the documentation close enough to the work that changes can update it.

JULES: How do we know a diagram is too complicated?

PARISA: If it can't answer its intended question. A detailed deployment view may be appropriate for operations, while a simple request path is better for onboarding. Different views aren't dishonesty; they're focus.

JULES: Label what each view leaves out.

PARISA: Exactly. “Logical responsibilities, not physical machines” can prevent a surprising amount of confusion.

## A Handoff to the Next Developer

JULES: Imagine someone new joins the team. What's the first explanation?

PARISA: Follow an order from browser submission to accepted record and staff display. Show where validation and authorization happen, where prices are calculated, and how uncertain payments are resolved.

JULES: Then let them make a small change?

PARISA: Yes. Perhaps improve a validation message or add a clearly defined menu field. They should see how the architecture guides the change and how verification catches mistakes.

JULES: That teaches the system through behavior instead of making them memorize directories.

PARISA: Exactly. The directory map becomes meaningful once they know what the pieces do. The same way these fourteen episodes are supposed to make the vocabulary useful.

## The Complexity Budget

JULES: I like the idea that complexity has a budget, even if we can't measure it in a perfect unit.

PARISA: Every extra deployment, data copy, asynchronous state, framework convention, and operational dependency asks for attention. Some of that attention buys real capability. Some buys nothing we currently need.

JULES: So we spend complexity where it protects an important promise or improves a real task.

PARISA: Yes. Durable order handling earns its place. Authorization earns its place. A distributed recommendation fleet for one restaurant probably needs to make a stronger case.

JULES: And we can remove complexity too.

PARISA: Absolutely. Retire unused endpoints, obsolete flags, duplicate stores, and abandoned paths. Simplifying a system after learning more is progress, not defeat.

JULES: The final architecture won't be the smallest possible drawing.

PARISA: It should be the clearest workable design for the actual promises. Sometimes that needs more boxes. We just want to know why each one is there.

## Explain It in an Interview or Review

JULES: Give me the thirty-second version of our architecture.

PARISA: We use one modular application and a relational database because the team and workflow are small and closely related. The browser manages interaction; the server validates and authorizes operations and records accepted orders. Public content can be cached, while private and transactional data has stricter rules. Payment uses a specialist provider, and durable follow-up work handles receipts. We would add capacity or extract a capability only after identifying a specific bottleneck or ownership need.

JULES: That explains choices, not just technologies.

PARISA: Then if someone asks about failure, I can trace an uncertain payment or duplicate submission and describe recovery. That's stronger than reciting a stack list.

JULES: And if you don't know an implementation detail?

PARISA: Say what you need to verify. “I'd check the provider's retry guarantees” is professional. Inventing exactly-once payment semantics is not confidence; it's fiction with consequences.

## The Reusable Mental Checklist

JULES: Before drawing, identify people, tasks, constraints, and promises. Then trace one important operation.

PARISA: For each fact, ask who owns it and how long it must survive. For each boundary, ask what crosses it, who is trusted, and what happens if it fails.

JULES: For each optimization, identify the measured cost it reduces and the new complexity it creates.

PARISA: For each choice, write the reason and the conditions that would make you revisit it. Then verify the design through real behavior, not just diagram aesthetics.

JULES: That's enough to begin understanding an unfamiliar system too. You don't have to recognize every vendor logo before asking where the order goes.

## One Last Check Before Shipping

JULES: The design review ends. What makes us ready to implement rather than keep drawing?

PARISA: We understand the critical workflow, the main risks, and a small first increment we can verify. We don't need every future detail, but we need enough clarity to make the next change safely.

JULES: For our example, that could be browsing the menu and submitting a validated order in a test environment, with durable storage and a clear result.

PARISA: Yes. Then add the next required capability, verify it, and keep the architecture explanation current. Working behavior teaches us things a diagram can't.

JULES: And if implementation reveals an assumption was wrong?

PARISA: Update the decision. That's learning, not architectural failure. The failure would be defending an unsuitable choice because we already drew it in expensive colors.

JULES: The purple arrow finally faces accountability.

PARISA: It has been invited to explain its business value.

## Closing — We Know Why the Boxes Exist

PARISA: We began with nineteen unexplained rectangles. Now we can name what they do, what they own, and whether we need them.

JULES: Client and server. HTTP. Documents and SPAs. APIs. Sessions and authorization. Durable data. Monoliths and services. Caches. Scaling. Rendering.

PARISA: Not a ladder where each newer thing replaces the previous thing. A set of options for different problems.

JULES: Start with the simplest architecture that solves the actual problem. Add complexity only for an explainable reason.

PARISA: Next in the show is Cybersecurity, handled as its own series. We have already drawn trust boundaries and followed data. That gives us somewhere concrete to ask what can go wrong and how to protect people.

JULES: For now, Nervous Robot has an ordering system we can explain.

PARISA: And enough restraint to leave several boxes unpurchased.

JULES: Ohhh. That's why architecture exists.

PARISA: So dinner arrives, the records make sense, and nobody has to debug a purple arrow at midnight.

[OUTRO MUSIC]

## Production Notes

- Final synthesis, not a production implementation or claim of a deployed system.
- Cybersecurity explicitly follows next; containers/infrastructure remain later, with no contradictory immediate-next-series tease.
- The recurring example and decisions are hypothetical and constrained; no invented metrics or product claims.
- Preserve the concise design explanation as a companion study reference.
