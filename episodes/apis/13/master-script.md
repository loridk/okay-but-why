# Episode 13: API Design: Don't Make Other Developers Hate You

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Unrecorded; final timing depends on performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: The request failed.

JULES: What's the error?

PARISA: Error.

JULES: Anything else?

PARISA: Error code seven.

JULES: What does seven mean?

PARISA: According to the documentation, an error occurred.

JULES: Technically correct.

PARISA: A phrase responsible for an extraordinary amount of human suffering.

[STING]

## A Working Endpoint Can Still Be Miserable

JULES: Welcome to Okay, But Why? API design is developer experience. Someone is trying to accomplish a task through the interface we expose, and our choices can make that task understandable or exhausting.

PARISA: The someone may be me six months later. Future me has no memory of why I named a field stateCode2 and deserves basic compassion.

JULES: Exactly. Good design reduces guessing. It explains what callers can do, what they must provide, what comes back, and how to recover when something goes wrong.

PARISA: That doesn't require making every operation look identical. It requires making differences meaningful and predictable.

JULES: Right. Our fictional pizza service now has customers, orders, delivery estimates, and integrations. We need a coherent interface rather than a museum of whichever developer wrote each route.

## Consistency Saves More Than Typing

PARISA: One endpoint returns orderId, another returns order_id, and a third returns ID. I can handle that, but why am I handling that?

JULES: Every inconsistency requires a special case or a fresh check. Choose conventions for naming, identifiers, dates, pagination, and errors, then use them consistently unless a real requirement justifies a difference.

PARISA: Same for singular versus plural collections, parameter names, and whether a missing value is null or omitted. The choice can matter less than making the choice deliberate and stable.

JULES: And consistency includes meaning. If estimatedMinutes means minutes until arrival in one response and minutes until dispatch in another, matching capitalization won't save us.

PARISA: Names should carry the distinction. EstimatedArrivalMinutes and estimatedDispatchMinutes make the ambiguity harder to miss. Better yet, perhaps a timestamp serves the clients more clearly, with a documented timezone convention.

JULES: Exactly. Design around what callers need to understand, not merely the database column name that already exists.

## Design One Real Workflow First

JULES: How would you begin designing the order API?

PARISA: With a concrete consumer task. A customer checks an order. What do they know? An order identifier and their authenticated session. What do they need? A permitted summary, with enough information to explain the current status.

JULES: Then consider the next task, such as updating delivery instructions before dispatch.

PARISA: Right. What inputs are allowed? What states permit the change? What if another person changes the order at the same time? What response lets the caller explain what happened?

JULES: That workflow reveals requirements more effectively than starting with every table and generating generic CRUD routes.

PARISA: CRUD means create, read, update, delete. Useful operations, but not a complete business model. “Refund an order” can involve rules that don't fit “set arbitrary database fields.”

JULES: Exactly. A supported interface should expose useful capabilities while preserving the business invariants it must enforce.

## Errors Need Two Audiences

PARISA: Return to our error code seven. What would help?

JULES: A stable machine-readable identifier, an appropriate HTTP status, a safe human-readable explanation, and structured details where useful. The client should not have to parse a prose sentence to decide which field to highlight.

PARISA: If we change “postal code is invalid” to “please check the postal code,” the application shouldn't break. The stable code and field reference carry the programmatic meaning.

JULES: Exactly. Problem Details for HTTP APIs is one standardized format for describing errors. It defines fields such as type, title, status, detail, and instance, and supports extensions.

[CODE CARD: Illustrative Problem Details-style validation response]
```json
{
  "type": "https://api.example/problems/validation",
  "title": "Some fields need attention",
  "status": 422,
  "detail": "Check the highlighted delivery fields.",
  "errors": [
    {
      "field": "deliveryInstructions",
      "code": "too_long",
      "message": "Use 500 characters or fewer."
    }
  ]
}
```

PARISA: For listeners: this response says validation failed, identifies the delivery-instructions field, provides a stable too-long code, and explains the allowed length. The errors array is our chosen extension, not a universal field required by the standard.

JULES: Correct. A real response would use the appropriate content type, application/problem+json, and an actual matching HTTP status. The example type URL is fictional; production documentation should explain the problem type.

PARISA: The frontend can connect field errors to controls and provide a summary people can navigate. A good API error supports an accessible user experience even though the API itself isn't a screen.

## Don't Leak the Interesting Internal Bits

JULES: An internal exception might contain a query, filesystem path, credential, or private record. That isn't automatically suitable error detail for the caller.

PARISA: A safe public message and a request identifier can help users report a problem. Restricted logs can carry the diagnostic detail the maintainers need, with secrets and unnecessary personal data excluded.

JULES: Exactly. And not every error should reveal whether a resource exists. Access-denial policy needs to consider disclosure.

PARISA: Helpful doesn't mean indiscreet. “You don't have access to customer Alice's private refund investigation” would be an extremely informative mistake.

JULES: Right. Explain the caller's next step without exposing someone else's information.

## Lists Eventually Get Big

JULES: Our support dashboard requests all orders. There are now two million.

PARISA: A success story with an unfortunate response body.

JULES: Pagination divides a collection into manageable pieces. Offset pagination asks for a range based on a position, such as skip the first fifty and return the next fifty.

PARISA: Easy to understand, and sometimes enough. But if new orders arrive between requests, positions can shift. The client may see duplicates or miss items while moving through pages.

JULES: Large offsets can also be expensive depending on the storage and query plan. Cursor pagination gives the client a continuation marker associated with the ordering or position.

PARISA: An opaque cursor means the client treats it as a token to return, not as a format it should reverse-engineer and modify.

JULES: Exactly. A stable sort with a tie-breaker matters. If several orders share a timestamp, an identifier can help define deterministic ordering.

PARISA: Cursor pagination doesn't automatically create a perfect snapshot of changing data. The API needs to document its consistency behavior.

JULES: Right. Also cap page sizes and return a clear indication of whether more results exist. An unbounded limit parameter can turn a small request into a large resource-consumption problem.

## Filtering and Sorting Are Contracts Too

PARISA: Let the caller filter by status, sort by creation time, and request a reasonable page size. Helpful. Let the caller submit arbitrary SQL fragments as filters. Less helpful.

JULES: Exactly. Define supported fields, operators, and sort orders. Validate values and enforce resource limits. The server translates the public contract into safe internal queries.

PARISA: Unknown filters shouldn't silently do something surprising. Reject them or document deliberate behavior. Otherwise a typo can return a much broader dataset than the caller intended.

JULES: And authorization applies before data is exposed. A filter isn't a permission boundary. Asking for customerId 17 doesn't prove the caller may see customer 17.

PARISA: Also document whether omitted filters mean all permitted results or some default subset. Defaults are behavior, not absence of design.

## Rate Limits Need an Understandable Recovery Path

JULES: Rate limiting constrains how much activity a caller can perform over time. It can protect capacity, reduce abuse, and allocate shared resources.

PARISA: But the unit matters. Per user, API key, account, IP address, operation, or some combination. An IP-based rule can affect many legitimate users behind one network.

JULES: Exactly. Explain the policy as far as appropriate and provide usable feedback. HTTP 429 indicates too many requests. A Retry-After value can tell clients when to try again, when the server provides one.

PARISA: The client should respect that instead of starting ten simultaneous retries as a form of negotiation.

JULES: Backoff with jitter can help spread retries for transient conditions. Jitter means adding some randomness so every client doesn't retry at precisely the same moment.

PARISA: Still, don't retry every error. Invalid input won't become valid after a nap. And a non-idempotent operation needs more care than a repeated read.

JULES: Correct. Reliable client behavior depends on meaningful server responses and a documented retry policy.

## Idempotency Makes Uncertain Outcomes Manageable

PARISA: We submit an order. The connection fails before the response reaches us. We don't know whether an order exists. This is our Episode Three problem coming back with a receipt.

JULES: An API can support a client-generated idempotency key for a logical operation. Repeated attempts with the same key and matching request can refer to the same intended operation rather than creating new ones.

PARISA: The server must implement that guarantee. Sending a header called Idempotency-Key to an endpoint that ignores it does nothing.

JULES: Exactly. Define the key's scope, retention period, response behavior, and what happens if a caller reuses it with a different payload. Concurrent requests also need atomic handling.

PARISA: And the client keeps the same key while retrying one uncertain operation. A fresh key on every retry would identify fresh operations and defeat the point.

JULES: Right. But a genuinely new order needs a new logical key. We aren't permanently deduplicating every identical pizza purchase. Some of us eat lunch more than once.

PARISA: An ambitious lifestyle.

JULES: The database record of the key and the business effect need reliable coordination. Otherwise we can still crash between doing the work and recording that it happened.

## Backward Compatibility Includes Meaning

PARISA: Our first release calls the field status. We rename it orderStatus. Is that a breaking change?

JULES: For clients expecting status, yes. Removing fields, changing types, requiring new request fields, or changing established meanings can break consumers.

PARISA: What about adding a field?

JULES: Often compatible if clients tolerate unknown fields, but not universally. Strict validators or generated consumers may reject unexpected data. Document compatibility expectations and test actual consumers where possible.

PARISA: Adding a new enum value can also break clients with exhaustive assumptions. The application needs a defined way to handle statuses it doesn't recognize.

JULES: Exactly. A new value is structurally a string but can be behaviorally breaking. Compatibility is more than whether the JSON still parses.

PARISA: And changing default sorting can make pagination or workflows behave differently even when the schema is untouched.

JULES: Right. Treat observable behavior as part of the contract.

## Versioning Is a Migration Tool

JULES: Versions can separate incompatible contracts. Some APIs put a version in the path, others use headers or another scheme.

PARISA: The location of the version is less important than the policy. What changes inside a version? How long is an old version supported? How do callers learn that it will be retired?

JULES: Exactly. Versioning doesn't remove maintenance. Supporting several versions means testing and operating several sets of expectations.

PARISA: So avoid breaking changes when you can, provide a migration path when you can't, and don't announce retirement by letting somebody's production integration discover a 404 at midnight.

JULES: Deprecation should give consumers meaningful notice, replacement documentation, and enough time appropriate to the ecosystem. A mobile app may update much more slowly than a website.

PARISA: And if we don't know who consumes an internal endpoint, that's a reason to improve ownership and observability, not proof that nobody will notice.

## Documentation Is Part of the Product

JULES: What should documentation help a developer do first?

PARISA: Complete one real task. Establish access, make a valid request, understand the response, and handle common failures. Then provide a reference with exact fields and rules.

JULES: Examples need realistic values, safe placeholders, units, nullability, and clear environment boundaries. A copied example should not teach secret exposure or insecure defaults.

PARISA: Explain whether timestamps are UTC, whether amounts are minor units, whether an operation can be retried, and whether results are eventually consistent. These are not decorative footnotes.

JULES: OpenAPI can provide a machine-readable description of an HTTP API. Tools can use it for documentation, clients, and validation-related workflows.

PARISA: But generating a schema from code doesn't automatically explain why the operation exists or how to recover after a timeout. A field list isn't a complete learning experience.

JULES: Exactly. Narrative task guidance and precise reference information complement each other.

PARISA: And documentation must match the actual service. A perfect example for an endpoint that no longer exists is historical fiction.

## Security and Good Experience Reinforce Each Other

JULES: A narrowly scoped operation with clear inputs is often easier to secure and easier to use. The caller knows what it does; the server knows what to validate.

PARISA: Useful error distinctions reduce random retries. Predictable permission rules reduce accidental data exposure. Bounded pages reduce surprise memory explosions.

JULES: Exactly. Security doesn't have to be an incomprehensible wall that appears after design. It's part of defining a trustworthy interface.

PARISA: But convenience can conflict with least privilege. A universal endpoint that executes arbitrary queries might make a demo fast while creating a huge authority problem.

JULES: Right. The goal is useful capability within understandable limits. Not giving every client maximum power so nobody has to think about access design.

## Test the Consumer's Experience

PARISA: How do we evaluate whether our design is any good before a partner has a miserable week?

JULES: Build a small consumer against the documented contract. Have someone unfamiliar with the implementation attempt a real workflow. Notice where they must guess or ask questions.

PARISA: Also exercise failures. An API can have a delightful quickstart and an error model that requires a séance.

JULES: Contract tests can check promised shapes and behavior. Integration tests can verify actual access boundaries and persistence. Compatibility checks can detect certain breaking schema changes.

PARISA: None replaces judgment about meaning. A machine may not flag that estimatedMinutes quietly changed from arrival to dispatch. That's where clear documentation and review matter.

JULES: Exactly. Monitor support patterns too. If every consumer asks the same question, the interface or documentation probably owes them an answer.

## A Consumer Walkthrough Finds the Missing Contract

PARISA: Let's pretend I'm a new developer integrating the order list. I read the quickstart, request the first page, and receive twenty orders plus a nextCursor. What questions might the documentation have forgotten?

JULES: Whether the cursor expires, whether it can be reused, whether filters must remain the same, and whether results are a snapshot or a moving view.

PARISA: Exactly. If I change the sort order but reuse the old cursor, what happens? If I request a page size of zero or a million, what happens? If there's no next page, do I get null, an omitted property, or an empty string?

JULES: Those are small contract details with a large effect on the client's control flow. Decide them and show the normal termination case in an example.

PARISA: A quickstart that only fetches page one can hide the hardest part of the integration. Help the developer finish the actual task, not just produce one successful request.

## Backward Compatibility Can Fail Quietly

JULES: Suppose we keep every field but change orders from oldest-first to newest-first. The response still passes its schema.

PARISA: A consumer importing records in chronological order can now behave incorrectly without a parsing error. That's a semantic change, and it deserves compatibility review.

JULES: Or we change a previously optional request field's default. Existing callers omit it and suddenly get a different effect.

PARISA: The absence of a diff in the JSON shape doesn't mean the interface stayed compatible. We need examples and tests around observable behavior, including defaults and ordering.

JULES: Exactly. Record the intended semantics so reviewers can distinguish an internal refactor from a contract change.

## A Helpful Error Must Be Actionable and Honest

PARISA: The service returns try again later for every failure. Friendly wording. Good design?

JULES: Not if the problem is permanent. If the field is invalid, the caller needs to change it. If permission is missing, repeating the request won't help. If the operation already happened, retrying might be harmful unless the contract controls it.

PARISA: So recovery advice is itself a promise. Don't recommend an action merely because it sounds reassuring.

JULES: Exactly. Provide stable categories clients can map to useful experiences, and explain uncertain outcomes where they matter.

PARISA: I'd rather hear “we couldn't confirm whether this completed; check the order before resubmitting” than get false certainty that encourages duplicate purchases.

## The Smallest Useful Design Improvement

JULES: If a team already has a messy API, must it redesign everything before improving developer experience?

PARISA: No. Start with a concrete source of friction. Clarify one ambiguous field, document a missing error case, add a bounded page size, or make a response consistent where compatibility permits.

JULES: Exactly. Larger changes may need versioning and migration, but useful improvements can be incremental.

PARISA: And preserve the consumers who already depend on the current behavior. Making the API more elegant by unexpectedly breaking them is a strange interpretation of kindness.

JULES: Right. Good design includes how we change the design. The relationship with consumers continues after the first release.

## A Better Version of Error Seven

JULES: Let's replay the opening. Your update failed because the delivery instructions exceed the allowed length. The API returns a stable validation type, the field name, a too-long code, and the documented limit.

PARISA: My client connects that error to the textarea, preserves what the user entered, and explains how to fix it. Nobody has to inspect server code or search a forum for the spiritual meaning of seven.

JULES: If the order changed and is no longer editable, the response communicates that conflict instead. If the service is temporarily unavailable, it provides a safe failure and recovery guidance where possible.

PARISA: Same basic endpoint. Very different experience because the contract acknowledges reality.

## The Kindness Is Concrete

JULES: Good API design makes behavior predictable. Consistent names, meaningful errors, bounded collections, clear retry rules, thoughtful versioning, and accurate documentation reduce unnecessary work.

PARISA: The kindness is technical. I don't need the response to tell me I'm doing amazing. I need to know whether this request created an order and whether retrying will create another one.

JULES: Exactly. Developer experience isn't frosting. It affects correctness, support burden, reliability, and the user experience built on top.

PARISA: Next time, the final episode: AI APIs, tool calling, and MCP. What remains familiar, and what genuinely changes when the thing choosing an operation is a model?

JULES: Familiar boundaries, new decision-making challenges.

PARISA: And hopefully better errors than seven.

[OUTRO MUSIC]

## Production References

- Problem Details for HTTP APIs: https://www.rfc-editor.org/rfc/rfc9457.html
- HTTP semantics: https://www.rfc-editor.org/rfc/rfc9110.html
- OpenAPI specification: https://spec.openapis.org/oas/latest.html
- OWASP API Security: https://owasp.org/API-Security/
- Error response and domains are fictional. Pagination, idempotency-key behavior, compatibility, rate limits, and deprecation policies require explicit service-specific contracts.