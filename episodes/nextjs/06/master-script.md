# Episode 6: Caching: Why Is My Website Lying to Me?

**Series:** Next.js
**Runtime:** Approximately 30-minute target; confirm with the recorded read.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: I moved the talk to Room B.

JULES: The database agrees.

PARISA: The website says Room A.

JULES: It's remembering.

PARISA: So am I, and I'm becoming less pleasant about it.

[STING]

## Reuse Is a Promise About Freshness

JULES: Welcome to Okay, But Why? A cache stores a result so later work can reuse it. That can save time, computation, and pressure on a database or service.

PARISA: It also creates another place containing a version of the truth. That version can become old.

JULES: Exactly. Caching isn't just “make it fast.” We decide which result can be reused, how to identify it, how long to trust it, and what event makes it obsolete.

PARISA: For DemoCon, the public abstract can probably tolerate some delay. A last-minute room assignment deserves a different conversation. A booking operation must verify availability even if the display looked fresh.

JULES: Right. The cache policy follows the product's requirements. A correct cached response isn't always the newest possible value; it's a value within the freshness contract we've deliberately chosen.

PARISA: But if we never chose that contract, “eventual consistency” can become an elegant name for surprising people.

## Name the Model First

JULES: Next.js caching advice changes across versions and configuration. Our explicit choice today is Next.js 16 with Cache Components enabled. That choice is not universal to all Next 16 apps.

PARISA: Until this episode, our examples used the ordinary App Router baseline. We are changing configuration now, not retroactively pretending the earlier pages already used this mode.

[CODE CARD]
~~~js
// next.config.mjs
const nextConfig = {
  cacheComponents: true,
};

export default nextConfig;
~~~

JULES: The object and export are JavaScript. CacheComponents is a Next configuration option. Use cache, the directive we'll add to a function, belongs to Next's caching system. It is not React's cache function and not a generic JavaScript keyword.

PARISA: This choice also affects rendering. Uncached asynchronous or request-dependent work needs an appropriate boundary, while reusable work can be included in prepared output.

JULES: Exactly. Enabling a flag isn't permission to mix every older route-level cache recipe into the new model. Some segment options used without Cache Components are disabled or unsupported with it.

PARISA: So if a tutorial gives me export const dynamic equals force-dynamic, I first check which model it teaches. I don't keep adding contradictory flags until the build becomes too intimidated to argue.

## Cache One Public Read

JULES: We'll wrap the existing public query rather than cache every operation in the module. Mutations and private reads should not accidentally inherit the same policy.

[CODE CARD]
~~~js
// app/lib/cached-sessions.js
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { getPublicSessions } from './sessions';

export async function getCachedPublicSessions() {
  'use cache';
  cacheLife('minutes');
  cacheTag('public-sessions');
  return getPublicSessions();
}
~~~

PARISA: GetPublicSessions is our application database helper from last time. This new function says its result may be reused, assigns the named minutes lifetime profile, and attaches a tag describing what should invalidate it.

JULES: Correct. The profile is a collection of timing settings, not a plain-English guarantee that every caller sees a value refreshed precisely each minute.

PARISA: And the tag is not the cache key.

JULES: Exactly. The framework identifies cached work using the function identity and supported inputs, including relevant captured values. A tag lets us find related entries for invalidation. Many entries can share one tag.

PARISA: Like attaching “public schedule” labels to several saved results so a schedule edit can invalidate the relevant family. The label doesn't decide whether two different function arguments are the same request.

JULES: Right. If a cached detail reader takes a slug, different slugs can have different entries. We might attach a per-session tag as well as a broader schedule tag.

## What the Lifetime Describes

JULES: CacheLife profiles distinguish several ideas, including client reuse, server revalidation, and expiration. Those aren't interchangeable timers.

PARISA: Give me the conceptual difference without dictating a table of numbers that might change.

JULES: Client staleness guidance affects when cached navigation content can be reused without checking the server. Revalidation governs when server-side cached data should refresh. Expiration establishes when stale reuse must give way to waiting for a fresh result.

PARISA: So a lifetime profile describes behavior at multiple points. I should inspect the current profile definition and pick it deliberately.

JULES: Exactly. Our minutes profile is a teaching choice for ordinary public schedule data, not a guarantee about urgent room changes. An explicit invalidation event is useful when we know a write just happened.

PARISA: And cache storage depends on deployment. A cached function isn't a promise that one durable entry survives every restart and appears instantly on every server instance.

JULES: Right. Self-hosting and distributed deployments need a coherent cache strategy if they depend on shared invalidation. We'll return to deployment in Episode Nine.

## A Room Change, Step by Step

PARISA: At ten o'clock, someone loads our public schedule. The cache stores Room A. At ten past, the organizer changes the room in the database. What happens automatically?

JULES: The database change doesn't inherently notify every cache in the application. We must connect the write to the appropriate invalidation policy, or wait for the configured freshness mechanism.

PARISA: So “the database is correct” doesn't prove “the read path will show the new value.”

JULES: Exactly. For a user mutation where the person should see their own change on the next read, updateTag is designed to expire matching entries immediately. In Next 16, it is restricted to Server Actions.

PARISA: We will teach the full action next episode. For now, the order is authorize, validate, persist successfully, then expire affected cached data.

JULES: Correct. Don't invalidate first and claim the edit succeeded if the database write later fails.

[CODE CARD]
~~~js
// Inside an authorized Server Action, after a successful write:
updateTag('public-sessions');
~~~

PARISA: This is an excerpt, not a complete action. UpdateTag must be imported from next slash cache. It doesn't save the room, authenticate the organizer, or push a message to every open tab.

JULES: Exactly. It affects subsequent reads of that cached data. Other tabs don't become live subscribers merely because we invalidated an entry.

## Stale While Revalidating Is Another Contract

JULES: RevalidateTag with the max profile marks matching data stale so a subsequent request can trigger background revalidation while receiving the previous value.

PARISA: A useful choice when serving a slightly old result quickly is acceptable. Not the same promise as “your edit is visible on the very next read.”

[CODE CARD]
~~~js
// For background freshness where briefly stale content is acceptable:
revalidateTag('public-sessions', 'max');
~~~

JULES: This can be used from supported server contexts including Route Handlers. The invalidation call doesn't eagerly regenerate every page. Visits drive the refresh work.

PARISA: And the old one-argument revalidateTag examples are deprecated behavior. We shouldn't teach them as the default Next 16 recipe.

JULES: Correct. When a Route Handler needs immediate expiration and updateTag is unavailable, the current API supports an explicit expire-zero profile. That choice means a subsequent read blocks for fresh data instead of receiving a stale result.

PARISA: So pick the semantic behavior: tolerate stale while updating, or require fresh after invalidation. Then pick the API allowed in that context.

JULES: Exactly. Names alone are not enough. Revalidate and update sound similar until someone is standing at the wrong room.

## Paths and Tags Answer Different Questions

PARISA: Where does revalidatePath fit?

JULES: It targets a path or a route pattern's rendered data relationship. Tags identify data that may be shared across routes. A public session can appear on its own page and in a list, so data-oriented tagging can express that relationship.

PARISA: Revalidating one detail path doesn't automatically mean every other page showing the same session gets the same treatment.

JULES: Right. Think about all the views affected by the write. Avoid both under-invalidation, where stale views remain, and unnecessarily broad invalidation, where one small edit throws away unrelated reusable work.

PARISA: And router refresh?

JULES: A client router refresh requests updated server-rendered output for the current route. It doesn't inherently invalidate the underlying server data cache. If the server reuses the same cached value, the refreshed view can still show that value.

PARISA: So “I refreshed it” is not evidence that I asked the original source for fresh data.

JULES: Exactly. We need to know which layer the refresh reached.

## The Layers We Might Be Seeing

JULES: There can be reuse during a render, server cached data or output, client router memory, and browser or intermediary HTTP caches. An external API may have its own cache too.

PARISA: Which means changing a Next tag won't purge an unrelated CDN cache unless our deployment connects those operations.

JULES: Correct. Neither will it invalidate a third-party query library's client cache automatically. Similar names don't create a shared nervous system.

PARISA: Our debugging question becomes “which saved result supplied this screen?” rather than “why is caching evil?”

JULES: Exactly. Check the database value, the application read, any server cache, the route response, and the client state. Find the first place where the expected update disappears.

PARISA: That's much calmer than deleting every cache directory in the county.

## Keep Private Information Out of Shared Public Results

JULES: Our cached function returns published session data. It doesn't read the current user's cookies or combine private preferences into a result shared with everyone.

PARISA: The public schedule and my favorite state are different data classes. Mixing them inside one shared cached result would be a very bad shortcut.

JULES: Exactly. Ordinary use cache scopes can't directly read runtime request APIs such as cookies and headers. Runtime values can be read outside and passed as arguments where appropriate, but that requires careful keying and privacy design.

PARISA: We aren't teaching a private caching variant today. Our deliberately simple design leaves personalized work uncached and under an appropriate Suspense boundary.

JULES: Right. Separating public reusable data from authenticated request-specific data makes the policy understandable. And an authorization check still belongs near protected access even if some public data is cached.

PARISA: A correct cache key doesn't prove permission. It merely separates entries according to inputs. A malicious caller can still ask for somebody else's identifier unless the operation checks.

## Adapt the Page to the Chosen Model

JULES: After enabling Cache Components, our sessions page can use the explicit cached public helper. A fresh request-specific region should sit below a boundary that can wait.

[CODE CARD]
~~~jsx
import { Suspense } from 'react';
import { getCachedPublicSessions } from '../lib/cached-sessions';

async function SessionList() {
  const sessions = await getCachedPublicSessions();
  return <ul>{sessions.map(s => <li key={s.id}>{s.title}</li>)}</ul>;
}

export default function SessionsPage() {
  return (
    <main id="main-content">
      <h1>DemoCon sessions</h1>
      <Suspense fallback={<p role="status">Loading sessions…</p>}>
        <SessionList />
      </Suspense>
    </main>
  );
}
~~~

PARISA: This card simplifies the list markup to focus on caching and the boundary. In our actual page design, the session titles remain links as established earlier.

JULES: Exactly. Cached work can participate in prepared output. The boundary also gives us a place to wait when needed. It doesn't itself invalidate anything.

PARISA: For the dynamic detail route, route params and any uncached read also need treatment consistent with the mode. We can't just flip the flag and assume every earlier example is a complete migration.

JULES: Correct. A detail page can place the params-reading async child below Suspense, or prepare known params as appropriate. The rule is to account for the dependency, not silence the diagnostic.

## What If Cache Components Is Off?

PARISA: Listeners will open existing Next 16 projects without this flag. What should they remember?

JULES: Don't assume every server fetch is persistently cached by default. Current fetch defaults differ from early App Router tutorials. Without Cache Components, explicit fetch cache and revalidation options and route-level behavior matter.

PARISA: But “fetch isn't persistently cached by default” also doesn't prove the page always reads fresh data on every visit. The route might have been prepared during the build.

JULES: Exactly. Fetch-level reuse and route output reuse are different. Consult the documentation for the model actually in use. Server fetch cache options also describe framework caching, not simply the browser HTTP cache of the same name.

PARISA: This is why we named our model before presenting code. Otherwise a listener merges two reasonable tutorials into one unreasonable configuration.

## Test the Freshness Story

JULES: Let's design a small check for our room change without building a testing empire.

PARISA: Warm the public schedule read, change a room through the authorized write path, and observe the next read under the chosen policy. If we chose immediate expiration, we expect fresh data after the successful mutation. If we chose stale-while-revalidate, we explicitly allow the first stale result and verify eventual refresh.

JULES: Also inspect a second route showing the same data. That's how we catch a missing shared tag.

PARISA: And another open tab, so nobody mistakes invalidation for live push. We should understand when that tab requests new content.

JULES: Test production behavior, not only development hot reload. Development caching and prefetch behavior can differ in ways that make a manual experiment misleading.

PARISA: If we run multiple server instances, our check must eventually include that deployment shape. A perfect single-process result doesn't prove distributed invalidation works.

JULES: Exactly. Keep the check proportionate to the feature and environment.

## Failure and Truthfulness

PARISA: What if refreshing the cached result fails because the database is temporarily unavailable?

JULES: We need to understand the mechanism's failure behavior and decide what the product can tolerate. A stale public abstract might still be useful. A stale permission decision may be unacceptable.

PARISA: So the interface can communicate a last-updated value when that helps, but a timestamp isn't permission to misrepresent critical information.

JULES: Right. And cache invalidation isn't a substitute for a transactional write. If two organizers edit the same room, the database operation still needs whatever concurrency rules the product requires.

PARISA: The cache is a copy. It isn't the referee for concurrent updates.

## A Timeline With Two Different Policies

JULES: Let's use an imaginary sequence. An attendee loads the schedule and receives Room A. The organizer successfully changes it to Room B. We invalidate the public tag with a stale-while-revalidate policy.

PARISA: The next read may still receive Room A while triggering fresh work. A later read can receive Room B after that work finishes. That's expected under the policy, not necessarily a broken invalidation.

JULES: Correct. Now use immediate expiration after the action. The next cache read must obtain fresh data rather than reuse that expired Room A entry.

PARISA: But an already-open browser tab isn't automatically notified. If it never requests anything again, its DOM can remain old.

JULES: Exactly. Server cache freshness and client refresh scheduling are separate. Live updates would need an additional mechanism, such as deliberate polling or another supported update channel.

PARISA: We don't need to add that to our demo. We need to stop promising it as a side effect of a tag function.

## Keys, Tags, and Collisions

JULES: Suppose a cached detail helper accepts a slug. Boring-deployments and accessible-forms should identify distinct results.

PARISA: Inputs help distinguish cache entries. If we accidentally use a helper with no relevant argument and read changing external context invisibly, we make its reuse contract harder to reason about.

JULES: Exactly. Make the inputs explicit. Tags then express which entries a mutation affects. A shared tag can cover both list and detail data if that matches our design.

PARISA: A per-session tag can narrow an individual edit, while a list tag handles membership or ordering changes. We shouldn't invalidate a detail entry and forget the list still contains the old title.

JULES: Right. Nor should we assume giving two entries the same tag merges their values. Tags organize invalidation; they aren't an alternative keying system.

PARISA: That's the distinction I want on the mental index card. Key: which result? Tag: which group should stop being trusted after this event?

## A Successful Write With Failed Follow-Up Work

PARISA: What if the database write succeeds but a later cache-related operation fails? The user sees an error and retries.

JULES: We need to distinguish persistence success from response or follow-up failure. The write may already be committed. A retry-safe mutation and clear recovery behavior matter.

PARISA: So cache invalidation doesn't turn a multi-step operation into a database transaction. If there are separate systems involved, there can be a gap between them.

JULES: Exactly. For a small app, a straightforward write-then-invalidate path may be enough. More demanding systems may need durable event handling or reconciliation. The point is to recognize the gap, not add infrastructure before it's justified.

PARISA: If we log the failure, we should retain enough safe context to repair it. “Something happened” is not a useful operational message.

JULES: Correct. An identifier and operation name can help without dumping sensitive submitted content into logs.

## Development Can Mislead Us

JULES: Imagine you change code, reload, and see fresh data. What have you established?

PARISA: That this development path produced fresh data at that moment. Not that the production cache expires correctly after an organizer edit.

JULES: Exactly. Hot reload can change the circumstances. A production build may prepare output, prefetch routes differently, or reuse data in a way the development experiment didn't exercise.

PARISA: Our meaningful check warms the relevant cache, performs the actual write path, then reads through the path users use. Otherwise we might test only cold misses and declare invalidation perfect.

JULES: Right. A cache that has never stored anything cannot demonstrate whether we invalidated the correct entry.

PARISA: And clearing everything manually before every test removes the exact condition we're trying to investigate.

## Shared Public Data Is the Easy Case

JULES: Public session descriptions are a relatively simple cache case because all visitors are allowed to receive the same representation.

PARISA: Private organizer views complicate the dimensions: user, permission, perhaps organization, and changes to those permissions. We deliberately avoid caching those views in this teaching example.

JULES: Exactly. If a real product needs private caching, it requires an explicit model for identity, authorization, storage scope, and invalidation. We don't infer safety from a user identifier appearing in an argument.

PARISA: Because permission can change even if the identifier doesn't. A former organizer mustn't keep access merely because a cached result remembers a more generous time.

JULES: Correct. Public caching is not a template to copy blindly into protected data access.

## How Much Staleness Can Humans Tolerate?

PARISA: The abstract changing from “practical” to “very practical” can wait. A cancellation or accessibility-related venue change may need a much stronger freshness policy.

JULES: That's a useful product distinction. We can separate data or invalidation paths when their freshness needs differ, rather than giving the whole schedule one arbitrary duration.

PARISA: We should also avoid displaying an unjustified “live” badge. If the page refreshes only on navigation, live would imply something we haven't built.

JULES: Exactly. A last-updated timestamp can help if its meaning is accurate: when the underlying schedule changed, not merely when we formatted the page.

PARISA: This is the point where caching becomes communication. The interface should tell the truth about what it knows and how current it is.

## Why Keep the Cache at All?

JULES: Because not every request needs to repeat every expensive operation. Public schedule data can be reused many times, reducing load and improving response time.

PARISA: We earn those benefits by being specific: public data only, named lifetime, tags tied to real write events, and known client refresh behavior.

JULES: Exactly. If data is cheap and must always be current, leaving it uncached can be the simpler answer. Caching isn't mandatory homework.

PARISA: And if we can't explain why a stale result is acceptable, we shouldn't casually choose a policy that serves one.

JULES: That's the episode. The website isn't intentionally lying; it's honoring a reuse policy we may have failed to understand or connect to mutations.

PARISA: Next time, mutations. We're going to put a server function near a component and ask whether the backend has moved into the furniture.

[OUTRO MUSIC]

## Production References

- https://nextjs.org/docs/app/getting-started/caching
- https://nextjs.org/docs/app/api-reference/directives/use-cache
- https://nextjs.org/docs/app/api-reference/functions/cacheLife
- https://nextjs.org/docs/app/api-reference/functions/cacheTag
- https://nextjs.org/docs/app/api-reference/functions/updateTag
- https://nextjs.org/docs/app/api-reference/functions/revalidateTag
- https://nextjs.org/docs/app/api-reference/functions/revalidatePath
- https://nextjs.org/docs/app/api-reference/functions/fetch
- Baseline checked September 11, 2026: Next.js 16, explicitly enabled Cache Components. No cache timing is presented as a measured DemoCon result.

