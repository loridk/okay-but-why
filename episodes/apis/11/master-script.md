# Episode 11: Webhooks: What If the API Calls You?

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Unrecorded; final timing depends on performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: Has the payment completed?

JULES: Not yet.

PARISA: Has the payment completed?

JULES: Still no.

PARISA: Has the payment completed?

JULES: You've invented polling and destroyed our friendship in nine seconds.

PARISA: What if you just tell me when it happens?

JULES: And now you've invented the motivation for webhooks.

[STING]

## Polling Is a Reasonable Starting Point

JULES: Welcome to Okay, But Why? Polling means asking repeatedly whether something changed. Our application could request an order or payment status every few seconds.

PARISA: It's straightforward. The client controls when it asks, and it can work even if the other service doesn't support notifications.

JULES: Right. But frequent polling generates requests when nothing happened. Infrequent polling delays discovery. Multiply that by many clients and the tradeoff becomes noticeable.

PARISA: We shouldn't claim polling is always wrong. A low-volume background check every hour can be perfectly sensible. But checking a payment ten times a second because we're nervous is expensive emotional regulation.

JULES: Exactly. Webhooks offer another arrangement: the system where an event happens sends an HTTP request to a receiving system.

PARISA: An event-driven notification. “The payment completed,” rather than “did it complete?” repeated until morale improves.

## The Roles Reverse

JULES: In a webhook exchange, the event provider acts as the HTTP client. Your receiving application acts as the HTTP server.

PARISA: Still ordinary request and response. The provider sends a request to a callback URL we registered. Our endpoint receives it and responds.

JULES: Exactly. Webhook isn't a magical new transport. It's a common integration pattern built around HTTP notifications.

PARISA: And callback URL here means the network address the provider should call later. It isn't a JavaScript callback function being teleported to another company.

JULES: Correct. Our webhook receiver usually lives in a server environment reachable by the provider. A random tab on a customer's laptop isn't normally a stable public receiving endpoint.

PARISA: So if the browser needs to learn about the result, our server may receive the webhook and then update the browser through a separate mechanism. Two different hops.

## Register the Notification You Need

JULES: Suppose our fictional pizza service uses a payment provider. We configure a callback URL and select relevant event types, such as a confirmed payment event.

PARISA: The provider controls the exact event names, payload shape, signing scheme, and retry behavior. We read that contract rather than inventing a universal webhook schema.

JULES: Exactly. Our receiver might be at slash webhooks slash payments. When the event occurs, the provider sends a POST with information about it.

[CODE CARD: Fictional event payload, not a provider schema]
```json
{
  "eventId": "evt_demo_42",
  "type": "payment.confirmed",
  "occurredAt": "2026-09-15T12:00:00Z",
  "data": {
    "orderId": 42,
    "paymentId": "pay_demo_42"
  }
}
```

PARISA: For listeners: the message identifies an event, says what happened and when, and points to the relevant order and payment. Those example identifiers are fictional.

JULES: Some providers send substantial resource data. Others send a notification that prompts you to fetch the current resource through their API. The contract determines which.

PARISA: An event describes something that happened. It doesn't necessarily tell us the resource's complete current state forever after.

## Why the Browser's Success Page Isn't Enough

JULES: Why not mark the order paid when the customer returns to a success page?

PARISA: Because the browser might close, lose connectivity, or never follow the redirect. And we can't trust a client-controlled URL parameter saying payment successful.

JULES: Exactly. The backend needs reliable evidence from the payment system and must verify the relevant payment details. A verified event can participate in that process.

PARISA: Amount, currency, account, order relationship, and the provider's actual payment state matter. A message containing our order number isn't enough by itself.

JULES: Right. We should follow the provider's fulfillment guidance and authoritative state model. Some payment methods settle asynchronously; naming a UI screen Success doesn't change that.

PARISA: The pizza should enter the oven because the backend established the relevant business condition, not because a browser looked cheerful.

## Anyone Can Knock on the Endpoint

JULES: If our webhook URL is reachable, a stranger may send it a request. How do we distinguish a provider notification from somebody's improvised JSON?

PARISA: Verify the provider's authentication mechanism. Many webhook systems sign the payload, often using an HMAC with a shared secret or another defined signature scheme.

JULES: The receiver verifies the signature using the provider's documented procedure. Frequently the exact raw request bytes matter, so parsing and re-serializing the JSON before verification can break the check.

PARISA: Whitespace changes can change the bytes while preserving the apparent data. We need the original representation where the scheme requires it.

JULES: Exactly. Use the provider's maintained verification library where available, and configure body handling correctly. Don't invent a cryptographic comparison because it looks short.

PARISA: A timestamp in the signed material can support replay protection. The receiver needs an appropriate freshness policy and reliable time handling according to the provider's guidance.

JULES: And secrets must be protected and rotated. HTTPS protects the transport; signature verification establishes the message evidence defined by the webhook contract.

## Verification Isn't the Whole Business Decision

PARISA: A valid signature means this message passed the provider's authenticity check. It doesn't mean every field should trigger unlimited behavior.

JULES: Right. Validate the event type and structure. Check the relevant account and resource. Apply your business rules. Ignore or safely record event types you don't support.

PARISA: And keep environments separate. A legitimate test event shouldn't fulfill a real customer's order.

JULES: Exactly. Configuration and resource relationships matter. An authentic message can still be irrelevant to the operation you're considering.

PARISA: This is our recurring lesson: proving one property doesn't prove all properties. Valid JSON, valid signature, valid business action—different checks.

## Retries Mean Duplicates Are Normal

JULES: The provider sends an event. Our application processes it, but the response gets lost. What should the provider conclude?

PARISA: It doesn't know whether we accepted it. It may retry according to its delivery policy.

JULES: Exactly. Even if our first attempt completed successfully, the same event can arrive again. Webhook consumers generally need to tolerate duplicate delivery.

PARISA: Which means “send a pizza every time this handler runs” is an excitingly bad implementation.

JULES: We want an idempotent effect: repeated notification of the same event doesn't repeat fulfillment. A stable event identifier can help deduplicate deliveries.

PARISA: But we need to record that reliably. Two copies might arrive at nearly the same time. Checking a list and then adding to it in separate unprotected steps can race.

JULES: Exactly. A database uniqueness constraint or another atomic mechanism can help ensure only one acceptance of the same event. The processing design must coordinate the event record and its effects.

PARISA: If we mark processed before doing the work, a crash can lose the work. If we do the work first and crash before marking it, a retry can repeat the effect. The placement matters.

## Acknowledge What You've Actually Accepted

JULES: Providers often expect a timely successful HTTP response. Doing slow business work directly in the request handler can cause timeouts and more retries.

PARISA: A common design verifies the event, validates enough to accept it, stores it durably or places it in a durable queue, then acknowledges. A worker performs the slower processing.

JULES: Right. Durable means the accepted work survives the failure scenarios the system promises to handle. Merely starting an in-memory background function and immediately returning success may lose the work when the process exits.

PARISA: Our acknowledgment should mean something real. If we told the provider we accepted the event, we'd better have a reliable path to processing it.

[CODE CARD: Conceptual receiver and worker responsibilities]
```text
Receiver:
  read bounded raw body
  verify provider signature and freshness
  validate event and environment
  durably accept event with duplicate protection
  return the provider's expected success response

Worker:
  load accepted event
  check current business state
  apply an idempotent transition
  record outcome and retry recoverable failures
```

JULES: That's an architecture sketch, not a complete implementation. The transaction or queue semantics determine whether those promises are actually true.

## Events Can Arrive Out of Order

PARISA: Suppose we receive a payment update and then an older event. Does the second arrival mean we should roll the order backward?

JULES: Not automatically. Delivery order may not match event order. Providers differ in their guarantees, but consumers should not assume more than the documented contract.

PARISA: An event timestamp can help interpret chronology, but it's not a universal substitute for a version or authoritative state lookup.

JULES: Exactly. Depending on the provider and event model, we may fetch current state before deciding what transition is appropriate. Our own state machine should reject impossible regressions.

PARISA: If an order is already fulfilled, an old payment-pending notification shouldn't put the pizza back into theoretical existence.

JULES: Correct. Events are evidence to process under rules, not commands to overwrite everything blindly.

## What If the Notification Never Arrives?

JULES: Webhooks improve notification efficiency. They don't guarantee that every integration remains perfectly configured and reachable forever.

PARISA: Our endpoint can be down, the secret can be wrong, the subscription can be disabled, or retries can eventually stop. We need monitoring and a recovery strategy.

JULES: Provider dashboards often show deliveries and support replay. Our system can track accepted and failed events and reconcile important state against the provider's API.

PARISA: Reconciliation means comparing what we believe with the authoritative source and repairing gaps. A periodic check can complement webhooks rather than compete with them.

JULES: Exactly. Polling and webhooks aren't rival religions. A webhook can provide quick notification while a scheduled reconciliation catches missed changes.

PARISA: The critical business outcome deserves more than “we assume the POST probably arrived.”

## GitHub Events Follow the Same Shape

JULES: Payments are one example. A repository service can send notifications when a pull request opens or a push occurs. Another system can start a build, update a dashboard, or record an audit event.

PARISA: Same pattern: subscribe, receive a request, verify it, interpret the event, and perform an allowed action reliably.

JULES: Exactly. But the downstream authority matters. A webhook triggering a build should not blindly execute arbitrary instructions from an untrusted contribution with unrestricted secrets.

PARISA: The notification being authentic doesn't make every piece of content inside the repository trustworthy. More nested boundaries.

JULES: Right. We always ask where each piece of information originated and what power we're about to give it.

## Test the Delivery Contract

PARISA: What do we test besides one happy-path event?

JULES: Invalid signatures, malformed bodies, unknown event types, duplicate delivery, simultaneous duplicates, old timestamps, out-of-order events, dependency failures, and retry recovery.

PARISA: Also environment mismatch and the case where we accepted the event but a worker crashed. Does the work resume without repeating the external effect?

JULES: Exactly. Provider test tools can help, but the application must still test its own business behavior. Passing signature verification isn't a fulfillment test.

PARISA: And logs should identify deliveries without dumping unnecessary personal or payment-related information. We need useful evidence, not a second uncontrolled database.

## Two Copies Arrive at the Same Time

PARISA: Let's pressure-test deduplication. Two workers receive the same event ID. Both ask the database whether it was processed. Both hear no. Then both fulfill the order.

JULES: That's the race hidden in a simple check-then-act design. The deduplication claim needs an atomic operation, such as inserting a uniquely constrained event record, coordinated with the processing strategy.

PARISA: Atomic here means the relevant operation doesn't split into separately observable pieces that let both workers claim the same right to proceed.

JULES: Exactly. But a unique event row alone doesn't magically coordinate every external effect. If fulfillment calls another service, that service may need its own idempotency mechanism or a workflow designed to recover safely.

PARISA: We should be suspicious of promising exactly once across several systems just because one table has a unique index.

JULES: Right. The useful goal is a correctly controlled business effect under the failures we actually face. Delivery attempts can repeat while the application avoids repeating the effect.

## Event Identity and Business Identity Differ

PARISA: Could two different event IDs refer to the same underlying payment?

JULES: Depending on the provider's event model, yes. A resource may generate multiple events as it changes. Event-ID deduplication prevents reprocessing the same delivery event, but business rules still determine whether a payment should trigger fulfillment.

PARISA: So the order's state also matters. If we've already fulfilled this paid order, another relevant notification shouldn't create a second shipment merely because its event ID is new.

JULES: Exactly. Deduplicate delivery and enforce valid business transitions. Those are complementary layers.

PARISA: A good state transition might say fulfill only if this payment is confirmed, matches the expected order and amount, and the order hasn't already been fulfilled.

JULES: Right. The exact implementation depends on the provider and domain, but the distinction is general. An event is a notification about the world, not a command to repeat every side effect from scratch.

## Fast Acknowledgment Isn't Careless Acknowledgment

JULES: We suggested acknowledging after durable acceptance. What if the queue is unavailable?

PARISA: Then we haven't durably accepted the work. Returning success anyway could tell the provider to stop retrying while we lose the event.

JULES: Exactly. Respond according to the provider's delivery contract and the actual outcome. A retriable failure can let the provider try again when our receiving path recovers.

PARISA: What if the signature is invalid?

JULES: Reject it without performing the business action. Don't enqueue an unauthenticated payload for a later worker to treat as trusted just because the receiver was trying to be fast.

PARISA: So the acceptance boundary has a minimum set of checks. Speed comes from moving slower work behind a reliable boundary, not from skipping the boundary.

JULES: Correct. And bound request size and processing resources so the verification endpoint itself isn't easy to overwhelm with arbitrary input.

## An Event's Snapshot Can Be Old

PARISA: The payload says payment pending, but by the time we process it the provider says confirmed. Which is true?

JULES: Both can describe different moments. A payload may be a snapshot at event creation. The current resource may have advanced. The provider's event contract determines how to interpret that relationship.

PARISA: That means we shouldn't automatically overwrite our current state with every old snapshot. We need transition rules or an authoritative lookup appropriate to the workflow.

JULES: Exactly. Version numbers, sequence information, timestamps, or current-state queries can help where supported. Don't assume a timestamp alone provides a total ordering of every related event.

PARISA: And if the authoritative lookup temporarily fails, keep the accepted event available for retry. Don't mark the business work completed merely because the webhook handler finished.

JULES: Right. Receiving, accepting, processing, and completing are different milestones. Useful operational records distinguish them.

## Replay Is a Recovery Tool With Consequences

JULES: The provider dashboard offers Replay event. Should we press it freely during an incident?

PARISA: Only with an understanding of what our receiver will do. A properly idempotent design should make replay manageable, but we still need to verify the event, environment, and intended recovery.

JULES: Exactly. Replaying production notifications against a test endpoint, or test notifications against production, can create confusion if boundaries aren't clear.

PARISA: And a replay may arrive long after its original occurrence. Verification libraries and providers may distinguish a new delivery signature from an old captured request. Follow their actual replay model rather than disabling freshness checks globally.

JULES: Right. Security checks should support documented recovery mechanisms, not be abandoned whenever an event is inconveniently old.

## Observe the Whole Path

PARISA: What would you put on an operational dashboard for the integration?

JULES: Counts of accepted deliveries, verification failures, processing failures, queue age, and business outcomes where appropriate. Alerts should focus on conditions that threaten the intended workflow, such as accepted events waiting too long.

PARISA: An endpoint returning 200 isn't enough if the worker has been dead since breakfast.

JULES: Exactly. Track the journey from delivery to confirmed effect. Use correlation identifiers without storing unnecessary sensitive payloads everywhere.

PARISA: And maintain a recovery procedure. Which events can be replayed? How do we reconcile orders? Who can access the provider dashboard? An incident is a poor time to discover nobody knows where the integration lives.

JULES: Right. A webhook is small to demonstrate and still an operational dependency once the business relies on it.

## Local Development Without Fooling Ourselves

PARISA: A provider can't normally call my laptop's localhost address from its own servers. How do developers test receivers?

JULES: Providers may offer local forwarding tools, test environments, or controlled tunneling workflows. Use supported tooling and understand which environment's credentials and events you're handling.

PARISA: Don't expose an unrestricted development server with powerful production secrets merely to receive one sample notification.

JULES: Exactly. And a local sample proves parsing and some handler behavior, not production reachability, TLS configuration, retry handling, or queue durability.

PARISA: We test those layers separately. A successful test event isn't a certificate that every future network failure will be graceful.

## Choose Notification When It Solves the Problem

JULES: If our application only needs a daily summary, polling once a day may be simpler. If it needs prompt notification across many resources, webhooks can reduce unnecessary requests.

PARISA: But receiving webhooks means operating a reachable endpoint and handling delivery semantics. The cost doesn't disappear; it moves from repeated asking to reliable receiving.

JULES: Exactly. Choose based on timeliness, volume, provider support, and operational capacity. Use reconciliation for critical state where appropriate.

PARISA: We started with “tell me when it happens.” We finish with “tell me when it happens, and I'll design for the fact that messages can be late, repeated, or interrupted.” That's the grown-up version of the convenience.

## The API Called, but It's Still HTTP

JULES: A webhook is one system sending an HTTP request to another when an event happens. It reduces repeated checking when timely notifications are useful.

PARISA: Register a callback, understand the payload, verify the sender, acknowledge responsibly, and expect retries and duplicates. Design effects to be idempotent and handle ordering and recovery deliberately.

JULES: Exactly. The convenience is real. So is the delivery engineering.

PARISA: Next time, REST isn't the only option. GraphQL, RPC, streaming connections, and the question every shiny tool must answer.

JULES: What problem does this solve, and does that problem apply here?

PARISA: The podcast's official procurement policy.

[OUTRO MUSIC]

## Production References

- Stripe webhook delivery and verification guidance: https://docs.stripe.com/webhooks
- GitHub webhook documentation: https://docs.github.com/en/webhooks
- Payload and processing sketch are fictional. Signature algorithms, raw-body requirements, retries, event identifiers, ordering, and acknowledgment expectations are provider-specific.