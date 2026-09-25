# Episode 5: Why Am I Fetching My Own Data Over HTTP?

**Series:** Next.js
**Runtime:** Approximately 30-minute target; confirm with the recorded read.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: Our server component calls our API, which calls our database, which sends data back to our API, which sends it back to the server component.

JULES: A complete journey.

PARISA: It's standing in its own kitchen and ordering delivery from itself.

JULES: Did it at least tip?

PARISA: It added latency.

[STING]

## The Browser Needed a Door

JULES: Welcome to Okay, But Why? Why are we fetching our own data over HTTP? Sometimes there's a good reason. Sometimes we're carrying a browser-era habit into server code without revisiting it.

PARISA: In a browser application, I can't safely put database credentials into the bundle and connect every visitor directly to our database. An HTTP API is the boundary between the untrusted browser and trusted server operations.

JULES: Exactly. It receives requests, validates them, applies access rules, and returns an appropriate representation. The browser needs that door because it lives outside the server's trust boundary.

PARISA: But our Server Component already runs in a server environment. It can call an application data-access function directly, assuming it has legitimate access to the resource.

JULES: Right. It doesn't need a Route Handler in the same app just to call that same function through HTTP. We can share the underlying data-access function instead.

PARISA: We preserve the rules. We remove an unnecessary transport detour.

JULES: That's the key distinction. Direct access does not mean bypass validation or permissions. It means put those rules in an appropriate server layer that both callers can use.

## Async Is JavaScript

JULES: A Server Component can be an async function. It can await data, then return JSX describing the UI.

[CODE CARD]
~~~jsx
// app/sessions/page.jsx
import Link from 'next/link';
import { getPublicSessions } from '../lib/sessions';

export default async function SessionsPage() {
  const sessions = await getPublicSessions();
  return (
    <main id="main-content">
      <h1>DemoCon sessions</h1>
      <ul>
        {sessions.map(session => (
          <li key={session.id}>
            <Link href={`/sessions/${session.slug}`}>{session.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
~~~

PARISA: Async and await are JavaScript, not TypeScript or a Next invention. Map is an array method. The arrow function describes what to return for each item. The backtick string inserts the slug into a URL.

JULES: JSX describes the elements, key helps React identify list items, and Link is from Next. Our data helper isn't built in. It belongs in app slash lib slash sessions in this example.

PARISA: The stable database identifier is a better key than the list position if ordering can change. And the helper should return only published, public session information.

JULES: Exactly. This example is the default App Router model before our explicit Cache Components switch. Later we'll put uncached reads below suitable Suspense boundaries or cache them intentionally.

PARISA: Good. We're teaching one thing at a time without pretending configuration never affects the example.

## Put Rules Where Callers Cannot Forget Them

JULES: What should getPublicSessions actually do?

PARISA: Query published sessions, order them consistently, select public fields, and return a shape our interface understands. Database-specific details stay inside the data module.

JULES: Right. For illustration, imagine a query builder with a session table. We won't install an ORM just to make a point about where the read happens.

[CODE CARD]
~~~js
// app/lib/sessions.js — illustrative database adapter
import 'server-only';
import { db } from './db';

export async function getPublicSessions() {
  return db.session.findMany({
    where: { published: true },
    select: { id: true, slug: true, title: true, abstract: true },
    orderBy: { title: 'asc' },
  });
}
~~~

PARISA: This is a database-adapter example, not a Next API. Db is infrastructure we'd supply. The JavaScript object describes options to that hypothetical adapter. Server-only helps catch an accidental client import.

JULES: Exactly. A SQL implementation could use a parameterized query. A CMS-backed implementation could call the CMS. The page shouldn't care which storage engine produced the public representation.

PARISA: But abstraction has a limit. We don't need a repository factory factory because there are two reads. One clear function is fine.

JULES: Very fine. If we later expose the same public data through a Route Handler, that handler can call this function. We don't need the page to call the handler to achieve reuse.

PARISA: Share the operation beneath the transport. That principle works in many languages and frameworks.

## Direct Does Not Mean Unrestricted

PARISA: What if the helper reads unpublished proposals for organizers?

JULES: Then it needs server-enforced identification and authorization appropriate to that operation. Don't assume a protected-looking layout means every data caller has been authorized.

PARISA: A person could trigger a different route or operation. The helper itself should have a clear access contract, and protected data access should enforce it close to the read.

JULES: Yes. Public and organizer representations should be intentionally different. Selecting safe fields early also reduces accidental disclosure.

PARISA: What about a slug in a query? It came from a route, but that doesn't make it trustworthy.

JULES: Validate its expected shape where useful, use safe query parameterization, and handle a missing record. If the record exists but isn't public, don't return it merely because the slug is correct.

PARISA: Obscurity is not authorization. Somebody guessing the title of a talk should not get the speaker's private notes.

## When HTTP Is the Right Boundary

JULES: Direct access isn't a rule against APIs. Suppose DemoCon uses a separate scheduling service owned by another team. Its HTTP API is the supported contract.

PARISA: Calling that service over HTTP makes sense. Reaching directly into its database could violate the ownership boundary and bypass rules its API enforces.

JULES: Exactly. Or we're using an external CMS. Or multiple independent clients need a stable representation. Or the backend deploys and scales separately.

PARISA: Those are actual reasons. “All data must be fetched from slash api because that's where data lives” isn't.

JULES: Right. The question is whether the network boundary represents a real architectural boundary. If it does, respect it. If it merely loops back to the same application code, consider a direct call.

PARISA: There can also be build-time trouble with self-requests. During a build, our application server might not be running at the URL we try to fetch.

JULES: Correct. A direct data function avoids assuming a live copy of our own app exists during prerendering. It still needs access to its underlying data source, which is a real deployment requirement.

## Fetch Is a Web API With Framework Integration

JULES: When we do call HTTP, fetch returns a response. We need to check its status before treating it as successful data.

[CODE CARD]
~~~js
export async function getRemoteSessions(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Session service unavailable');
  const data = await response.json();
  return data;
}
~~~

PARISA: This is a transport illustration, not production validation. Fetch and Response are Web APIs available in modern server environments too. Await and throw are JavaScript. Next integrates server fetching with its rendering and cache facilities.

JULES: Correct. Fetch rejects for failures such as network errors, but a response with a 404 or 500 status isn't automatically a rejected promise. Check response.ok or handle the specific status.

PARISA: Parsing JSON only proves that the body is parseable JSON. It doesn't prove it is an array of public sessions with valid fields.

JULES: Exactly. Validate the external response shape at runtime before trusting it. TypeScript annotations don't inspect incoming bytes.

PARISA: And the URL in a real helper should be controlled or validated. A public user mustn't be able to make our server fetch arbitrary internal addresses by supplying a convenient parameter.

JULES: Yes. Restrict destinations. Add an appropriate timeout or cancellation policy. Decide what error information the user should see without exposing internal details.

## The Waterfall We Accidentally Built

PARISA: Now imagine we need sessions and speakers. I await sessions, then await speakers. Both queries take time, but neither needs the other's result.

JULES: That sequence makes the second start after the first finishes. It's a waterfall created by our code, not by the product's dependencies.

PARISA: If the operations take two hundred and three hundred milliseconds in an illustrative world, sequential waiting is roughly their sum. Starting independently can make the combined wait closer to the slower one, plus overhead.

JULES: Exactly. Those are explanatory numbers, not measurements from DemoCon.

[CODE CARD]
~~~js
const [sessions, speakers] = await Promise.all([
  getPublicSessions(),
  getPublicSpeakers(),
]);
~~~

PARISA: Promise.all is JavaScript. It observes several promises together. The function calls start the work; Promise.all isn't a scheduler that makes synchronous code parallel by wishful thinking.

JULES: Right. The destructuring assigns the results in input order, not completion order. If one promise rejects, Promise.all rejects, and it doesn't automatically cancel the other operation.

PARISA: Useful when we need both results. If one optional result fails, we might want separate handling or separate streaming boundaries rather than losing the whole page.

JULES: Exactly. Concurrency and failure policy belong together.

## Not Every Sequence Is a Mistake

PARISA: Suppose I need the session record before I know the speaker's identifier. That's a real dependency.

JULES: Yes. You can't start the second query with information you don't yet have. You might restructure the database query to include the speaker, but that's a data-model decision, not a reason to lie to Promise.all.

PARISA: And if we map over fifty sessions and make one speaker query for each, we've potentially created an N-plus-one problem.

JULES: Correct. A batch query or join can be more appropriate than launching fifty independent requests. Concurrently doing unnecessary work doesn't make the work necessary.

PARISA: Nor does unlimited concurrency respect database connection limits. “Everything at once” is a load test wearing a feature request.

JULES: Exactly. Start with the smallest data shape and sensible query plan. Then use concurrency where dependencies allow and resources can support it.

## Memoization Is Not Persistent Caching

JULES: Another source of confusion: repeated reads during rendering can sometimes be deduplicated or memoized. That is not the same as persisting data across requests for minutes.

PARISA: So if two components ask for the same thing during one render, avoiding duplicate work doesn't imply tomorrow's visitor receives yesterday's answer.

JULES: Correct. React's cache function can memoize suitable server work within its supported request lifecycle. Next's persistent caching mechanisms address a different timescale. The similarly named tools solve different problems.

PARISA: We'll reserve the explicit use cache directive for the next episode. We shouldn't tell people an imported React function and a Next directive are interchangeable because both contain the word cache.

JULES: Exactly. Also, deduplication depends on the API and call shape. Don't assume arbitrary database reads magically collapse into one because they return similar data.

PARISA: Observe repeated queries if performance matters. An architectural explanation is not evidence that a particular deployment executed one query.

## Streaming and Fetching Cooperate

JULES: If session details and optional recommendations can load separately, a Suspense boundary around the recommendation component can let the details arrive first.

PARISA: But if the parent awaits recommendations before returning that child, we've defeated the boundary before it exists.

JULES: Right. Place the waiting work under the boundary. And don't confuse streaming with parallel fetching: one concerns delivery, the other when independent operations start.

PARISA: They can cooperate. Start independent work appropriately, and let regions arrive according to the interface's needs.

JULES: Exactly. The visual result should remain understandable. A missing optional sidebar shouldn't masquerade as an empty result. Distinguish loading, empty, failed, and complete.

PARISA: An empty schedule means there are no sessions. A failed schedule read means we don't know. Those require different words.

## Where the Data Is Still Matters

PARISA: Calling a database directly sounds local, but it could be on another continent.

JULES: Correct. Direct means no unnecessary application HTTP layer, not zero network latency. Deployment regions, database placement, connection pooling, and runtime limits still matter.

PARISA: And a serverless environment may create many function instances. Opening a fresh unbounded database connection from each request can overwhelm the database.

JULES: Yes. Use the connection strategy supported by the database and hosting environment. We don't need to build it in this series, but we mustn't imply importing db solved operations.

PARISA: Static preparation also moves the requirement earlier. If the build queries the database, the build environment needs an appropriate, limited way to reach the intended data.

JULES: Exactly. Don't give every build broad production write access just because it needs to read public sessions.

## A Practical Data Review

JULES: Let's review the path for our public list. What are the checkpoints?

PARISA: The page calls getPublicSessions. The helper reads published records and selects public fields. The page renders semantic links with stable identifiers. If the read fails, the error experience should say the data couldn't load, not claim the conference is empty.

JULES: And if another client needs JSON?

PARISA: A Route Handler can call the same helper and provide an HTTP representation. The page doesn't have to call that handler merely to share logic.

JULES: If speakers and sessions are independent?

PARISA: Consider starting both before awaiting both, with an appropriate failure policy. But check whether a better query eliminates redundant work first.

JULES: If someone says their TypeScript type validates the CMS response?

PARISA: Ask where the runtime validation happens. A type assertion is not a customs officer inspecting the incoming package.

## Compare the Two Call Paths

PARISA: Let's follow the unnecessary loop once, because I want to know what we're actually removing. The Server Component creates an HTTP request to our own endpoint. That endpoint parses the request, calls a helper, serializes the result, and sends it back. The component parses the response and renders.

JULES: Exactly. With a direct helper call, the component awaits the operation and receives its result. We avoid the extra transport and serialization layer between two parts of the same application.

PARISA: But if authorization existed only in the endpoint, moving to the helper could accidentally bypass it.

JULES: That's why the refactor must preserve the access contract. Put shared rules in the appropriate server operation rather than assuming removing transport removes the need for those rules.

PARISA: So the performance improvement isn't permission to make the data layer less safe. We remove redundant travel, not the checks at the destination.

JULES: Correct. And if the endpoint is actually another service with its own ownership, the travel isn't redundant. The service interface may be the only supported way to access that data.

## What Does Parallel Actually Mean Here?

PARISA: Promise.all doesn't make JavaScript execute two ordinary synchronous loops on separate CPU cores.

JULES: Right. It lets us await multiple promises together. Independent asynchronous I/O can overlap while the environment handles the operations. That's different from parallel CPU execution.

PARISA: If getPublicSessions starts a database request when called, calling it before we await another result lets that request begin earlier.

JULES: Exactly. But if a helper merely returns a function that starts work later, the behavior differs. Know what your API does, rather than treating Promise.all as an acceleration sticker.

PARISA: And a failed promise doesn't cancel the others. If cancellation matters, the underlying APIs need a supported cancellation mechanism.

JULES: Correct. For an optional external service, we might use a timeout and separate failure handling so it doesn't indefinitely delay the essential page.

PARISA: We should also consider load. Ten concurrent requests might improve one page while making the shared database unhappy under a thousand visitors.

JULES: Exactly. Individual latency and system capacity are related, but improving one without considering the other can move the bottleneck.

## The Public Representation Is a Design Tool

JULES: What fields does the session list need?

PARISA: Identifier, slug, title, perhaps speaker and time. Probably not the full abstract of every talk if the list doesn't display it. Definitely not organizer notes.

JULES: Returning only those fields can reduce database transfer, serialization, and client payload. It's also easier to understand what the interface is allowed to know.

PARISA: The detail page can request its own suitable representation. We don't need one enormous universal session object for every context.

JULES: Exactly. But we also shouldn't create fifteen nearly identical abstractions prematurely. Start with the public list and detail needs we actually have.

PARISA: A useful interface names the intent. GetPublicSessions tells me something about the data contract. GetStuff tells me the author had a meeting in two minutes.

JULES: Names can't enforce privacy, but they can make the policy easier to inspect. The actual query and returned fields must match the name.

## Empty Is a Successful Answer

PARISA: Suppose the database responds successfully with no published sessions. The page says the schedule hasn't been announced yet. That's an empty state.

JULES: Correct. Suppose the database connection fails. Returning an empty array from a broad catch would make the same message appear, but it would be false.

PARISA: The conference might have fifty talks. We just failed to read them. So we should let the failure reach an appropriate error path or return a deliberately distinct result.

JULES: Exactly. Don't erase failure information merely to keep a return type convenient. The user needs an honest state, and operators need enough diagnostics to investigate.

PARISA: What about a missing individual session?

JULES: A successful lookup with no permitted public result can go to not-found handling. A transport failure is different. Our helper contract should let callers distinguish those outcomes.

PARISA: That small distinction improves the page, the endpoint, and our debugging. It's not an abstraction for its own sake.

## A Read Must Remain a Read

JULES: Server rendering can happen in contexts such as prerendering, retries, or navigation preparation. Why does that matter to the data helper?

PARISA: It shouldn't mutate important state merely because it was called during rendering. Reading the session should not increment a billable counter, publish a proposal, or reserve a seat.

JULES: Exactly. Rendering work should be safe to repeat. Put intentional mutations in the appropriate action or endpoint with explicit semantics.

PARISA: Analytics also needs thought. Counting every render invocation as a unique human visit can produce nonsense because rendering isn't equivalent to a completed user visit.

JULES: Right. Choose an observation point that matches the metric. The framework's internal execution count isn't automatically a product event.

## A Practical Slow-Page Investigation

PARISA: If the public schedule is slow, I start with evidence. Is time spent in the database, an external service, rendering, transfer, or browser work?

JULES: Exactly. If the database dominates, inspect query shape and indexes. If requests are unnecessarily sequential, fix the dependency chain. If the result is enormous, reduce it.

PARISA: If the server is fast but the browser waits on a giant script, rewriting the database helper won't solve the observed problem.

JULES: Correct. And if the same expensive public result is read repeatedly, an explicit cache may help, with the freshness policy we'll discuss next.

PARISA: We can improve a small app without installing an observability cathedral. A focused trace and a reproducible request can answer the first question.

JULES: Right. Measure enough to identify the cause, make the targeted change, and verify that the user's path improved.

## The Kitchen Is Open

JULES: Async Server Components let us perform suitable reads in the server environment and render the result. They remove the need for some client fetching and some self-HTTP detours.

PARISA: They don't remove data-access design. We still choose safe queries, enforce access, validate outside data, manage dependencies, and think about failures.

JULES: Exactly. Sometimes the API is the right boundary. Sometimes a plain function call is the right boundary. Follow the ownership and trust relationships.

PARISA: Next time, caching. Our schedule will be fast, inexpensive, and possibly wrong about which room contains the talk.

JULES: We'll make the freshness policy explicit.

PARISA: Please. I don't want our optimization to strand people outside a broom cupboard.

[OUTRO MUSIC]

## Production References

- https://nextjs.org/docs/app/getting-started/fetching-data
- https://nextjs.org/docs/app/guides/backend-for-frontend
- https://react.dev/reference/react/cache
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- Database and remote-service cards illustrate contracts; adapters, runtime schema validation, and infrastructure are not supplied by Next.js.

