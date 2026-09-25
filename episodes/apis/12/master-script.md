# Episode 12: REST Isn't the Only Option

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Unrecorded; final timing depends on performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

JULES: I brought alternatives.

PARISA: To REST or to software development?

JULES: GraphQL, RPC, gRPC, WebSockets, and Server-Sent Events.

PARISA: That's a conference schedule, not a sentence.

JULES: Each solves a different problem.

PARISA: Good. Because if this becomes “old thing bad, new thing good,” I'm replacing the microphone with a fax machine.

[STING]

## These Aren't All Choices on the Same Axis

JULES: Welcome to Okay, But Why? First, a warning about the comparison itself. REST is an architectural style. GraphQL defines a query language and execution model. RPC is an interaction approach. gRPC is a specific RPC framework. WebSockets and Server-Sent Events address communication patterns and transport behavior.

PARISA: So lining them up as five interchangeable replacements is like comparing a restaurant layout, a menu language, and a delivery van.

JULES: Exactly. A system can use several. GraphQL can run over HTTP. An application can expose resource-oriented endpoints and also maintain a WebSocket connection.

PARISA: Our job is to identify which problem each option addresses, not crown the newest acronym.

## GraphQL: Let the Client Describe the Data Shape

JULES: Suppose our order screen needs an order status, selected item names, and a delivery estimate. One endpoint returns far more than that, or several endpoints must be combined.

PARISA: Overfetching means getting data we don't need. Underfetching means the response lacks something we need, leading to more requests. Those are descriptions of a particular API and client relationship, not unavoidable laws of REST.

JULES: Correct. A well-designed HTTP API can offer tailored representations. GraphQL provides a systematic way for clients to select fields from a server-defined schema.

PARISA: The schema says what types and fields exist and which operations are available. The client can't simply name a private database column and demand it.

JULES: Exactly. Server-side execution resolves the requested fields using application logic. The schema is the exposed interface, not a raw database invitation.

[CODE CARD: An illustrative GraphQL query]
```graphql
query OrderSummary {
  order(id: "42") {
    id
    status
    estimatedMinutes
  }
}
```

PARISA: For listeners: ask for order 42 and select three fields. The response's data shape follows that selection. This is GraphQL syntax, not JavaScript or JSON.

JULES: The query itself doesn't establish permission. The server must enforce access to that order and fields. The schema also has to define the operation in the first place.

## The Selection Doesn't Make the Work Cheap

PARISA: If I request a small shape, is the backend automatically efficient?

JULES: No. Resolving nested fields can trigger many database calls. The common N-plus-one problem happens when retrieving a list leads to another lookup for each item. Batching and careful data access can help.

PARISA: And a client can request an expensive shape. We need limits and cost controls, not merely valid syntax.

JULES: Exactly. GraphQL's flexibility shifts design work toward schema evolution, resolver performance, authorization, query complexity, and caching strategies.

PARISA: A typed schema also isn't the same as TypeScript in the browser. It defines the API's type system and validation rules. Generated client types can help, but they don't remove runtime or permission concerns.

JULES: Right. GraphQL also defines mutations for state-changing operations and subscriptions for ongoing updates. The exact transport and implementation choices matter.

PARISA: And responses can include partial data alongside errors. A client needs to understand that model rather than treating every HTTP 200 as “all fields succeeded.”

## When GraphQL Helps, and When It Adds Work

JULES: It can help when several clients need different combinations of a connected data model and a team benefits from a discoverable schema and selection mechanism.

PARISA: It can add unnecessary complexity for a tiny integration with three stable operations. We shouldn't build an elaborate schema just because a dashboard needs one extra field.

JULES: Exactly. Ask about client needs, backend cost, caching, and the team's ability to maintain the schema. Flexibility is useful when it answers an actual requirement.

PARISA: Also, hiding everything behind one HTTP endpoint doesn't reduce authorization to one check. The meaningful operations and data accesses still need protection.

## RPC: Ask for an Operation

JULES: RPC means Remote Procedure Call. The interface is organized around operations that resemble calling functions on another system.

PARISA: EstimateDelivery, CancelOrder, GenerateDailyReport. It can be more direct than pretending every business action is an ordinary replacement of a resource.

JULES: Exactly. RPC isn't inherently new, and it isn't inherently binary. JSON-RPC, for example, describes structured request and response messages using JSON.

PARISA: The client sends an operation name and arguments according to a contract. The service returns a result or an error.

JULES: Right. That can be natural for command-oriented domains. The tradeoff is that each operation may require more application-specific knowledge, rather than relying as heavily on uniform HTTP resource semantics.

PARISA: And a remote call still isn't a local call. It can time out after work happened, fail because the other system is unavailable, or incur substantial latency.

JULES: Exactly. Function-like syntax must not hide those operational facts from our design. Cancellation, retries, and idempotency remain relevant.

## gRPC: A Particular RPC Toolset

JULES: gRPC provides a framework for defining services and calling their methods across systems. Protocol Buffers commonly describe the messages and service contract, and tooling generates client and server code.

PARISA: Generated code gives developers language-appropriate methods and message types, reducing hand-written request glue. Both sides work from a shared definition.

JULES: Exactly. gRPC commonly uses HTTP/2 and supports unary calls, server streaming, client streaming, and bidirectional streaming.

PARISA: Unary means one request message and one response message. Server streaming means a request can receive a sequence of responses. The other modes change which direction carries a sequence.

JULES: Right. That can fit internal service communication, multilingual systems, and streaming use cases where its tooling and contract model are valuable.

PARISA: Costs include maintaining the interface definitions, generating code, understanding compatibility rules, and operating the infrastructure. Browser access often needs gRPC-Web or another supported bridge rather than assuming an ordinary browser can use every native gRPC capability directly.

JULES: Exactly. “Uses HTTP” doesn't mean “works like a simple fetch of JSON in every browser.”

PARISA: And a compact binary representation can be efficient while being less casually readable in a network inspector. Tooling becomes part of the developer experience.

## Persistent Communication Solves a Different Problem

JULES: Now suppose our delivery dashboard needs updates as drivers move. Repeated isolated requests may not be the interaction we want.

PARISA: We might want a connection that stays open and carries updates over time. That's a different dimension from whether our data model uses resources or remote procedures.

JULES: Exactly. A persistent connection doesn't mean information is automatically fresh, authorized, or reliable forever. It gives us a channel; we still design its messages and lifecycle.

PARISA: Connections drop. Devices sleep. Proxies time out. A laptop closes because somebody has correctly decided to stop working.

JULES: And the client needs a plan for reconnecting and catching up.

## WebSockets: Both Sides Can Send

JULES: WebSockets establish a channel where both sides can send messages after the connection is established. That can be useful for chat, collaboration, games, or other interactive bidirectional updates.

PARISA: But WebSocket doesn't define our order-update schema. We still decide what each message means, how it's versioned, and how errors are reported.

JULES: Correct. Authentication at connection time and authorization for subscriptions or actions still matter. A connection being open doesn't entitle it to every customer's updates.

PARISA: And browser WebSockets don't use CORS in the same way fetch does. The server should validate relevant Origin information and protect the handshake and application messages appropriately.

JULES: Exactly. Don't assume the browser's fetch boundary covers every other communication mechanism.

PARISA: What about a slow client?

JULES: The application needs limits and a strategy for handling data faster than it can process it. The classic browser WebSocket API doesn't automatically provide the kind of backpressure control some streaming interfaces do.

PARISA: A permanent firehose is not automatically a premium feature.

## Server-Sent Events: One Direction May Be Enough

JULES: Server-Sent Events, often SSE, let a server stream text events to a client over HTTP. The browser's EventSource API provides a standard client interface with reconnection behavior.

PARISA: The stream goes server to client. The client can still make ordinary HTTP requests separately when it needs to send a command.

JULES: Exactly. For a dashboard receiving status updates, that asymmetry may be sufficient and simpler than designing bidirectional messaging.

PARISA: Reconnection doesn't automatically mean no missed events. Event IDs and server support for resuming can help, but the application must actually retain or reconstruct the relevant history.

JULES: Right. And buffering by servers or proxies, connection limits, authentication choices, and resource use need attention. Native EventSource also has interface constraints, such as not offering arbitrary custom request headers in the same way fetch does.

PARISA: So “stream over HTTP” doesn't erase deployment details. It changes what we need from them.

## Streaming Isn't Always a Live Subscription

JULES: A response can also stream the result of one request, such as generated text arriving incrementally. That's different from subscribing indefinitely to future order events.

PARISA: Both arrive in pieces, but the lifecycle and meaning differ. One response eventually finishes; the subscription may continue until disconnected or cancelled.

JULES: Exactly. We'll see that distinction again with AI APIs. Avoid assuming every streaming response is a WebSocket or every stream is SSE.

PARISA: Inspect the actual protocol. Our vocabulary should help us ask better questions, not help us guess more confidently.

## Choose for the Problem in Front of You

JULES: Let's give the pizza business four requirements. A public menu that changes infrequently. An internal service calculating delivery routes. A dashboard receiving status updates. A collaborative dispatch board where several staff members edit live.

PARISA: The menu may be well served by an ordinary cacheable HTTP representation. The route calculator might fit a resource-oriented API or RPC, depending on its operations and clients.

JULES: The status dashboard may need only SSE or even moderate polling. The collaborative board might justify WebSockets and a carefully designed synchronization model.

PARISA: And GraphQL might help a collection of clients select different parts of a shared domain model, if that flexibility is worth the backend and tooling cost.

JULES: Exactly. These are candidate fits, not automatic verdicts. Requirements such as offline behavior, organizational ownership, latency, and team experience can change the answer.

PARISA: The useful question is what complexity we remove and what complexity we accept. Every option moves work somewhere.

## You Can Combine Them Without Collecting Them

JULES: A system may use HTTP resource operations for most tasks, a webhook for provider events, and SSE for browser notifications.

PARISA: That's a coherent combination if each piece solves a real need. It isn't an invitation to install one of everything so our architecture diagram looks like a sticker-covered laptop.

JULES: Exactly. Start with the simplest design that meets the actual requirements. Add a communication pattern when the existing one creates a concrete problem.

PARISA: And document the boundaries. Which channel carries authoritative changes? How do clients recover after a disconnect? Are repeated commands safe? Which identity can subscribe to which updates?

JULES: Those questions matter more than which technology won an online argument this week.

## One Screen, Three Plausible Designs

PARISA: Let's make the choice less abstract. A support screen shows an order, the customer's permitted contact details, and the last three delivery updates. How could we serve it?

JULES: One resource-oriented endpoint could return a deliberately designed support summary. Or several endpoints could supply the pieces. Or a GraphQL query could select the related fields from an exposed schema.

PARISA: So GraphQL doesn't uniquely make one request possible. We can design a tailored HTTP representation too.

JULES: Correct. GraphQL's benefit can be giving many consumers flexible selection within one schema, rather than requiring a new tailored endpoint for every combination.

PARISA: But that flexibility has to be implemented efficiently and securely. If the support screen is our only consumer and its needs are stable, the tailored endpoint may be simpler.

JULES: Exactly. If a website, mobile app, staff dashboard, and partner integration all need different shapes, a schema-based approach may become more valuable. We need evidence about the actual consumers.

PARISA: And the backend can still use shared domain functions underneath either interface. Choosing an external query shape doesn't require duplicating every business rule.

## A Command That Doesn't Want to Be a Table

JULES: Now the dispatcher asks the system to propose a delivery route for twelve stops under several constraints.

PARISA: That's an operation with inputs and a computed result. An RPC method named proposeRoute might communicate the intention clearly.

JULES: Right. We could also model route proposals as resources, especially if they're saved, have a lifecycle, or are computed asynchronously. The domain can justify either approach.

PARISA: The distinction is whether treating the result as an identifiable thing helps consumers. We shouldn't create fake lifecycle complexity solely to avoid a function-like operation.

JULES: Exactly. Conversely, exposing every database helper as an RPC method can leak internals and make compatibility difficult. Operation-oriented doesn't mean design-free.

PARISA: We still document units, constraints, errors, authorization, and whether repeated requests can create effects. A method called calculate sounds harmless until it also reserves drivers.

JULES: Right. Names and contracts must reveal meaningful side effects. Remote calls should not disguise a consequential operation as a trivial getter.

## A Connection Drops During a Dispatch Shift

PARISA: Our dashboard uses WebSockets. The connection drops for thirty seconds. When it reconnects, are we automatically up to date?

JULES: No. The application needs a recovery protocol. It might fetch a fresh snapshot, request events after a known sequence, or combine a snapshot with subsequent updates.

PARISA: If we only listen for future events after reconnecting, we can miss everything that happened during the gap.

JULES: Exactly. The channel doesn't supply the entire synchronization model. We also need to avoid applying old events over newer state and handle duplicate messages where relevant.

PARISA: SSE's reconnection features help manage the connection, but the same question remains: can the server actually resume from the last event ID, and what happens if that history is no longer available?

JULES: Right. A fresh snapshot can be a sensible fallback. The UI should indicate when information is stale or disconnected rather than pretending the dashboard is still live.

PARISA: A little green dot is not a freshness guarantee. It needs to reflect something meaningful about the connection and data state.

## Persistence Has an Operational Bill

JULES: A long-lived connection consumes resources over time. Servers and intermediaries need suitable limits, timeouts, and behavior under load.

PARISA: Which changes deployment planning compared with a simple short request. Scaling, connection routing, graceful restarts, and slow consumers become part of the design.

JULES: Exactly. You also need a strategy for credentials expiring or permissions changing during a connection. A user who loses access shouldn't keep receiving private updates indefinitely because the handshake happened earlier.

PARISA: So authorization can need ongoing enforcement at subscriptions or messages, not merely one check when the socket opens.

JULES: Right. And a persistent connection isn't automatically more efficient. If updates are rare and modest polling meets the needs, the simpler approach might have a lower total cost.

PARISA: We measure the whole system and user experience, not just the number of request lines in a diagram.

## Compatibility Exists in Every Style

PARISA: Does choosing a schema-driven tool remove versioning problems?

JULES: It can make some compatibility rules explicit and enable useful tooling. But changing field meaning, deleting an operation, or introducing an unsupported required input can still break consumers.

PARISA: Generated clients may make a mismatch visible earlier, but they don't guarantee every deployed client updates at the same time.

JULES: Exactly. With binary schemas, you need to follow that format's evolution rules. With GraphQL, deprecation and field evolution need a policy. With WebSocket messages, you still need a defined contract for message types and versions.

PARISA: The transport doesn't absolve us of maintaining agreements. We have simply chosen a different way to express them.

JULES: Right. Which is why understanding APIs broadly is more durable than learning one fashionable request syntax.

## The Team Is Part of the System

PARISA: Suppose gRPC fits technically, but nobody on a small team has operated it, and the main consumer is a browser. Does technical fit settle the decision?

JULES: No. Tooling, browser integration, support burden, deployment, and learning costs all belong in the comparison. A theoretically elegant choice can be impractical for the actual team.

PARISA: Conversely, familiar isn't automatically best if the existing approach creates a severe, measured problem. We can learn a new tool when its benefits justify the work.

JULES: Exactly. Avoid both trend worship and reflexive refusal. Write down the concrete requirement the change serves and how we'll know it helped.

PARISA: Fewer round trips for a measured workflow, a needed streaming capability, stronger contract tooling across languages. Those are arguments. “Everyone's moving to it” is a weather report.

## A Small Decision Conversation

JULES: The product asks for delivery updates within roughly a minute. We have a small number of active users, and the provider only supports polling. What do you choose?

PARISA: Probably bounded polling with sensible intervals, pause behavior when appropriate, and clear stale-state handling. We can't manufacture provider webhooks by wanting them.

JULES: Now hundreds of dispatchers need rapid two-way coordination and the application already has a maintained real-time infrastructure.

PARISA: A persistent bidirectional design becomes a stronger candidate. We still specify message semantics, access checks, reconnection, and conflict handling.

JULES: Exactly. The requirement changed, so the tradeoff changed. The earlier choice wasn't foolish just because a different problem needs something else.

PARISA: That's the habit we're building. Name the problem, understand the mechanism, and choose the cost we're willing to carry.

## The Interface Idea Survives

PARISA: GraphQL shapes data requests through a schema. RPC organizes remote operations as calls. gRPC supplies a particular contract and tooling ecosystem. WebSockets support bidirectional messaging; SSE supports server-to-client event streams.

JULES: And all still expose defined ways for software to interact. Inputs, outputs, authority, failure, and compatibility remain our concerns.

PARISA: REST wasn't wrong. It was one answer with particular properties. Alternatives can solve different problems without making every existing endpoint embarrassing.

JULES: Next time, API design as developer experience. How can an interface be technically functional and still make people hate every minute of using it?

PARISA: Finally, my collection of unhelpful error messages has academic value.

[OUTRO MUSIC]

## Production References

- GraphQL concepts: https://graphql.org/learn/
- gRPC introduction: https://grpc.io/docs/what-is-grpc/introduction/
- JSON-RPC specification: https://www.jsonrpc.org/specification
- WebSockets: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
- Server-Sent Events: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- Technologies are compared by the problems they address, not treated as interchangeable alternatives on one axis. Query is illustrative and requires a matching server schema and access policy.