# Episode 11: Caching and CDNs — Yesterday's Pizza, Today's Problem

**Series:** Web Architecture • Episode 11 of 14
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — We Fixed It Yesterday

[INTRO MUSIC]

PARISA: The menu price is wrong.

JULES: We changed it yesterday.

PARISA: The browser disagrees.

JULES: Which cache is serving it?

PARISA: I miss when a difficult question contained fewer invisible copies.

JULES: Welcome to *Okay, But Why?*. Today: caching. Faster answers, with a freshness policy attached.

## Why Keep a Copy?

JULES: A cache stores something so we can reuse it instead of repeating expensive work. That might be a response, a file, a database query result, or a computation.

PARISA: For Nervous Robot, every visitor doesn't need us to regenerate the same logo or recalculate the same public menu description from scratch.

JULES: A cache hit finds a usable stored result. A miss means we need to obtain or compute it. Reuse can reduce latency, server work, and bandwidth.

PARISA: But a copy can become stale when the underlying information changes. So the question isn't just “can we cache this?” It's “under what conditions may we reuse this answer?”

JULES: Exactly. For a logo with a versioned filename, a long lifetime may be fine. For current order status, freshness matters more. For private data, who may receive the copy matters enormously.

PARISA: The cache key and policy are part of correctness. A fast answer to the wrong question is not an optimization.

## Several Places Can Remember

JULES: The browser may cache HTTP responses. A CDN can cache responses near users. Our application might cache query results. The database has its own internal caching too.

PARISA: And a service worker can implement additional browser-side behavior. We don't need all those layers just because they exist.

JULES: Right. Each has different controls and visibility. Clearing one doesn't necessarily clear the others.

PARISA: That's how “I hard-refreshed” can fail to resolve a stale CDN response. The browser went back to the network, and the network enthusiastically supplied its old copy.

JULES: Diagnose which layer answered. Inspect relevant response headers and configuration instead of clearing caches at random until the problem feels spiritual.

PARISA: Cache debugging benefits from the request-path map we built in Episode 3. Which intermediary could have answered without reaching the origin?

## What a CDN Does

JULES: A content delivery network provides geographically distributed infrastructure that can deliver content closer to users and offload work from an origin service.

PARISA: The origin is the source service behind it. The CDN's edge locations can answer some requests from stored content, depending on policy.

JULES: CDNs can also provide routing and other features, but caching is the part we're focusing on. A miss may cause the edge to fetch from the origin.

PARISA: It doesn't make our private order database globally consistent by standing nearby. Nor does it automatically speed up every dynamic operation.

JULES: Exactly. Public images and static assets are common candidates. Personalized responses need deliberate handling, often avoiding shared caching.

PARISA: And if the origin is down, the CDN may still serve eligible cached content, depending on configuration. That doesn't mean checkout is working.

JULES: Another reason public information and transactional availability can differ.

## Freshness Is Permission to Reuse

PARISA: Let's explain time-to-live without implying it knows when the data actually changes.

JULES: A freshness lifetime says how long a stored response may be treated as fresh under the caching rules. It isn't a notification from the database that nothing changed.

PARISA: If I permit five minutes of reuse and change the menu a minute later, some people may still see the earlier version until it expires or is invalidated.

JULES: That's a tradeoff we've chosen. For a menu description it might be acceptable. For final pricing, the server still validates at checkout.

PARISA: And the interface needs a policy for a changed price. Caching doesn't excuse silently charging something different from the displayed agreement.

JULES: Short lifetimes reduce potential staleness but increase requests. Long lifetimes reduce work but require confidence that reuse is acceptable or a reliable invalidation strategy.

## Cache-Control Without the Folklore

JULES: HTTP Cache-Control is a header carrying caching directives. `max-age` describes freshness in seconds. `private` prevents shared caches from storing a response under standard semantics while allowing a private cache, such as the browser's.

PARISA: And the confusing pair: `no-cache` does not mean don't store. It means the stored response must be validated before reuse.

JULES: `no-store` instructs caches not to store the response. It doesn't retroactively erase every existing copy everywhere.

PARISA: So names are not sufficient documentation. We should read the actual semantics.

JULES: `s-maxage` can specify freshness for shared caches. Other directives support additional behaviors. We'll keep the examples narrow rather than assemble a random protective incantation.

[CODE CARD: HTTP response headers, not JavaScript]
~~~http
Cache-Control: public, max-age=31536000, immutable

Cache-Control: no-cache

Cache-Control: no-store
~~~

PARISA: Those are three separate examples, not three headers to paste together. The first suits genuinely immutable versioned public assets under an appropriate deployment policy. The second requires validation before reuse. The third says don't store.

JULES: A private order page may need no-store depending on the application's requirements. Don't copy a public asset policy onto authenticated content.

## Validation Can Save the Body

PARISA: What does “validate before reuse” look like?

JULES: The cache can send a conditional request using a validator, such as an ETag from the earlier response. It asks whether its stored representation is still current.

PARISA: If it is, the server can return 304 Not Modified, allowing reuse of the stored body. We've still made a network request, but may avoid sending the full content again.

JULES: Exactly. If it changed, the server returns the new representation. Validation and freshness are different mechanisms.

PARISA: And an ETag isn't necessarily a human-readable version number or a universal hash contract. Treat it as the validator the server defined.

JULES: Right. It can also participate in conditional updates in some API designs, but today we're using it to understand cache validation.

## Version the Asset, Not the Customer's Patience

JULES: For CSS or JavaScript build output, a filename containing a content-derived fingerprint can let a new version have a new URL.

PARISA: The HTML points to the new filename. The old asset can remain cached safely because its contents won't change at that URL.

JULES: That's why long caching can work for immutable assets while HTML often needs a different freshness policy.

PARISA: If the HTML itself stays cached too long, it may keep pointing at old code. And if deployment deletes old assets immediately, a still-open page might later request a missing old chunk.

JULES: So asset retention and deployment consistency matter. Caching strategy and release strategy are connected.

PARISA: Fingerprinted files are tooling output. The filename convention isn't TypeScript syntax or a browser language feature. The browser simply requests the URL it was given.

## The Wrong Customer's Order

JULES: Let's make the dangerous mistake explicit. We cache GET slash account by URL alone in a shared cache.

PARISA: Customer A's response is stored. Customer B asks for the same URL. If our policy and keying are wrong, B could receive A's account information.

JULES: That's a confidentiality failure, not just stale content. Shared caches require appropriate response policy and careful variation rules.

PARISA: Vary can tell caches that selected request headers affect the representation, but it isn't a universal authorization fix. Don't casually invent a cache key containing a session token and assume every privacy concern is solved.

JULES: Exactly. For our baseline, avoid shared caching of private order pages. Keep the policy simple and verify it with different sessions.

PARISA: Same warning applies to application caches. A function called getOrders that caches only by query name may accidentally reuse one customer's result for another.

JULES: The cache key must represent every input relevant to the result and permission context, or the design must avoid that caching altogether.

## Invalidating Copies

PARISA: We update the menu. How do copies learn?

JULES: Options include waiting for expiration, explicitly removing affected entries, changing versioned keys, or validating on reuse. The right choice depends on freshness requirements and control over the layers.

PARISA: Purging a CDN may not instantly clear every browser's private cache. So choose lifetimes and versioning with the entire path in mind.

JULES: Application-level cache invalidation can also race with writes. If we update the database and then forget to invalidate, stale data persists until some other mechanism fixes it.

PARISA: Or one request refills the cache with old data while another is updating it. That's why caching mutable business data deserves real design, not just a decorator named fast.

JULES: Sometimes the best initial choice is not to cache that operation. Optimize the query and measure before adding another consistency mechanism.

## Cache Stampedes

PARISA: The popular menu entry expires. A thousand requests arrive. All miss. All ask the database to rebuild it.

JULES: A cache stampede. A cache can reduce normal load but create a sharp burst when many callers miss together.

PARISA: So mechanisms like coordinating one refill, spreading expiration times, or serving stale content during refresh can help where appropriate.

JULES: Stale-while-revalidate permits some stale reuse while refreshing under a defined policy. It trades freshness for responsiveness and reduced load.

PARISA: Great for an eligible public description. Potentially unacceptable for a sensitive permission decision or a final inventory reservation.

JULES: Exactly. The policy should match the consequence of staleness. “Stale” isn't a single severity level.

## A Cache Should Be Replaceable—Usually

PARISA: We often say the cache isn't the source of truth. What does that buy us?

JULES: If it is truly derived and reconstructible, losing it should affect performance rather than destroy the only copy of important information.

PARISA: But if our so-called cache contains the only record of pending orders, it isn't merely a cache. The label doesn't reduce the durability requirement.

JULES: Also, cold-cache behavior matters. Can the origin handle traffic after a cache restart, or does the entire system collapse because it depended on every hit?

PARISA: Test that before the cache has an unscheduled identity crisis.

JULES: Measure hit ratio, latency, origin load, error rates, and whether stale answers cause user problems. A high hit ratio on the wrong data is not success.

## A Menu Update Travels Through the Copies

JULES: Let's follow a price change at two in the afternoon. The editor saves the new menu price in the source system.

PARISA: First, does the page read that source at request time, or must a build publish a new file? That determines when the origin has a new representation to offer.

JULES: Then the CDN may still have an earlier response within its freshness lifetime.

PARISA: And a browser may have its own earlier response. We need to account for both. Purging the edge doesn't necessarily tell an already-open tab to update its in-memory menu.

JULES: So “the website has the new price” can mean several different things.

PARISA: Exactly. New source value, new origin representation, new shared-cache copy, new browser response, and updated visible state. Those are stages, not synonyms.

JULES: At checkout the server uses the current accepted pricing policy and returns a quote that the customer reviews.

PARISA: Yes. That gives us a correctness boundary despite a possibly stale browsing view. But if price changes are frequent and consequential, we may need a fresher menu display too. We shouldn't rely on checkout correction to excuse a chronically misleading page.

JULES: The policy follows the product's tolerance for stale information.

PARISA: Exactly. Five minutes isn't inherently right or wrong. Explain what could happen during those five minutes and whether that's acceptable.

## Query Parameters and Cache Keys

JULES: Our menu can be filtered by location. Same path, different query parameter. What if the CDN ignores the query in its cache key?

PARISA: Then it may reuse one location's menu for another. The key no longer represents the question that produced the response.

JULES: Conversely, including every irrelevant tracking parameter can create lots of separate cache entries for identical content.

PARISA: Exactly. That hurts hit rate and can increase origin work. We need to decide which inputs actually affect the representation and configure the cache accordingly.

JULES: Language preferences can matter too.

PARISA: Yes. If a request header changes the representation, HTTP variation rules can help, but we must understand the actual cache implementation. Don't assume a default key contains every input the application uses.

JULES: So cache design begins with the function, in a conceptual sense: given these inputs, we produce this output.

PARISA: Right. If an output also depends on hidden state, time, or identity, that needs a freshness or keying strategy—or no cache for that operation.

## Negative Results Can Be Remembered

JULES: We publish a new menu page, but a visitor still sees not found. Could that be cached?

PARISA: Some negative responses can be cached under HTTP rules and configuration. If the missing response was stored before the page existed, it may remain reusable for a period.

JULES: So not-found isn't necessarily evidence the new deployment lacks the file.

PARISA: Correct. Inspect where the answer came from. Again, caching can preserve errors as efficiently as success when policy allows it.

JULES: That suggests we should consider lifetimes for negative results and deployment timing too.

PARISA: Yes. And avoid changing rules blindly during an incident. Identify the layer and the relevant response policy, then correct the cause.

JULES: Is turning off every cache a useful diagnostic?

PARISA: Sometimes a controlled bypass can isolate a layer. But disabling caching globally under heavy load can overload the origin. A diagnostic action has consequences too.

## Application Caches Have Their Own Rules

JULES: Suppose we store the menu query result in application memory for a minute. Is Cache-Control involved?

PARISA: Not automatically. That's application-level caching. Our code or library defines its lifetime and invalidation. HTTP headers control HTTP caches, not every in-memory map inside the server.

JULES: With three app instances, each might have a different cached copy.

PARISA: Exactly. Updating one process doesn't necessarily invalidate the other two. A shared cache can centralize some behavior but adds another dependency and network call.

JULES: For a tiny menu query, the shared-cache infrastructure might cost more complexity than it saves.

PARISA: That's why we measure. The database may already serve the query efficiently. Adding a cache because “databases are slow” is not analysis.

JULES: And if the result is cheap to compute but enormous to serialize, storing it differently may not solve the bottleneck we thought we had.

PARISA: Correct. Find the expensive part. Cache the right thing only when the benefit is real.

## Memory Is Finite

JULES: What happens when the cache fills up?

PARISA: An eviction policy decides what to remove, depending on the implementation. Recently used entries may be favored, or other rules may apply. Expiration and eviction aren't the same event.

JULES: An entry can disappear before its freshness lifetime ends because space is needed.

PARISA: Exactly. Code should handle misses. A cache isn't a durable promise that a value will remain available until its timestamp.

JULES: That's another reason not to store the only copy of pending work there.

PARISA: Yes. If we require durable work storage, choose and configure something for that purpose. Calling it cache doesn't lower the stakes.

JULES: And unbounded keys can consume memory, particularly if arbitrary user input creates a new entry every time.

PARISA: Validate and bound the use. Performance features need resource limits just like endpoints do.

## Revalidation Versus Refetching in the UI

JULES: A frontend data library says it revalidates. Is that always an HTTP conditional request?

PARISA: Not necessarily. Libraries may use that word for refreshing their own cached data. It might make a full request, use HTTP caching indirectly, or follow a custom policy.

JULES: So the same word can describe different layers.

PARISA: Exactly. Read the tool's behavior. Does it refetch on focus? After an interval? After a mutation? Does it share results across components? Those choices affect user experience and server load.

JULES: For the staff board, refetching when the tab becomes active could help catch up.

PARISA: Yes, but a sudden replacement shouldn't erase an in-progress edit or move focus. Fresh data and stable interaction need coordination.

JULES: And we still validate the operation on the server even if the frontend believes its cache is fresh.

PARISA: Always. A fetched value can become outdated immediately after receipt. Freshness reduces uncertainty; it doesn't grant a reservation on reality.

## Test the Policy With Two People and a Clock

JULES: What's a useful verification exercise for our caching design?

PARISA: Load public content, change it, and observe when each relevant layer shows the update. Then use two separate customer sessions to verify private responses don't cross between them.

JULES: Test a cold cache as well as a warm one.

PARISA: Yes. And test the origin unavailable if serving stale content is part of the intended behavior. Confirm which pages remain useful and which operations correctly report unavailable.

JULES: We should inspect headers, not just screenshots.

PARISA: Both can help. Headers explain policy and provenance; the visible result tells us what the person experiences. An apparently correct header doesn't prove every application cache is correct.

JULES: So caching QA is behavioral, not merely checking whether the word max-age appears.

PARISA: Exactly. We are testing an agreement about reuse, privacy, and freshness.

## Choose Policies for the Pizza Site

PARISA: Logo and fingerprinted CSS: public, long-lived when immutable. Public menu descriptions: a freshness policy compatible with updates. Private orders: avoid shared caching.

JULES: Final order acceptance: validate against authoritative current rules. We don't accept an old cached “in stock” answer as a reservation.

PARISA: Staff board: maybe show last known information while refreshing, but make stale state visible and let the server reject conflicting actions.

JULES: Those are different policies because they represent different promises. One global cache setting would be convenient but wrong.

## A Performance Win We Can Trust

JULES: The cache reduced origin requests dramatically. What else must be true before we celebrate?

PARISA: Users still receive appropriate content, private data stays private, updates become visible within the promised window, and misses or cache failure don't destroy the system.

JULES: We should also check whether the complexity is manageable. Can the next developer find the policy?

PARISA: Exactly. Put it somewhere understandable and document why different resource types differ. A global setting with twenty undocumented exceptions is an incident waiting for a new teammate.

JULES: If a cached query no longer matters, remove it?

PARISA: Yes. Optimizations can become obsolete. Keeping unnecessary caches preserves invalidation work and debugging confusion for no benefit.

JULES: So simplification is part of performance maintenance too.

PARISA: Absolutely. Sometimes the fastest route to a reliable answer is fewer copies. Sometimes it's a carefully managed copy close to the user. We choose based on the actual cost and freshness requirement.

JULES: Nervous Robot's logo can live happily at the edge. Their customer's address does not need to tour the CDN.

PARISA: A geographically restrained address. Excellent privacy posture for a pizza metaphor.

## The Copy We Shouldn't Make

JULES: Could we cache whether a staff member is allowed to refund orders?

PARISA: Potentially under a carefully designed policy, but permission changes have consequences. If access is revoked, how quickly must that revocation take effect? A cached allow decision can outlive the underlying permission.

JULES: So a performance optimization can change the security guarantee.

PARISA: Exactly. That's why we shouldn't treat every repeated lookup as an obvious cache candidate. The cost of being wrong matters alongside the cost of recomputing.

JULES: For our baseline, keep the authorization mechanism straightforward and use its supported behavior.

PARISA: Yes. Measure before optimizing it, and preserve the required revocation semantics if you do. “It was faster” isn't a complete justification for stale authority.

JULES: Same category as stale stock versus a stock reservation.

PARISA: Right. A cached observation can inform an interface. A consequential decision may need stronger current evidence or coordination. Knowing the difference is the useful part of this episode.

## Closing — Reuse With Conditions

PARISA: A cache is a copy plus rules about reuse. A CDN can place eligible content closer to users and reduce origin work.

JULES: Freshness, validation, invalidation, cache keys, privacy, and failure behavior determine whether that reuse is correct.

PARISA: Next time: scaling. When doing less isn't enough, how do we handle more work without just buying more rectangles?

JULES: Did you fix the menu price?

PARISA: Yes. I can now explain which copy was wrong. Personal growth, with headers.

[OUTRO MUSIC]

## Production Notes

- Header examples are separate HTTP policies, not a combined production recommendation.
- Distinguishes no-cache from no-store; no-store is not presented as retroactive global deletion.
- No CDN vendor or price recommendation is made.

## Production References

- MDN, HTTP caching: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching
- MDN, Cache-Control: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control
- RFC 9111, HTTP Caching: https://www.rfc-editor.org/rfc/rfc9111
