# Episode 8: Oh, So There IS a Backend

**Series:** Next.js
**Runtime:** Approximately 30-minute target; confirm with the recorded read.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: Last episode we removed some form endpoint plumbing.

JULES: Correct.

PARISA: This episode we're adding an endpoint.

JULES: For a different caller.

PARISA: I would like everyone listening to appreciate that the reason is doing actual work in that sentence.

[STING]

## An Interface Other Clients Understand

JULES: Welcome to Okay, But Why? A Server Component can read data directly. A Server Action can handle a UI mutation. But DemoCon's lobby display wants the public schedule as JSON.

PARISA: It's a separate client. It doesn't need our component tree, and it shouldn't depend on a framework-specific action invocation protocol.

JULES: Exactly. A Route Handler lets us define an HTTP endpoint with methods, status codes, headers, and response bodies. That's a contract many kinds of clients understand.

PARISA: So an API remains useful when there is an actual boundary to expose: another app, an integration, a webhook, a downloadable representation, or browser code that needs a particular HTTP contract.

JULES: Right. We aren't undoing the lesson about unnecessary self-fetching. The page and endpoint can share a server data helper. The endpoint exists for clients that need the transport boundary.

## A Route File Answers HTTP

JULES: Our public endpoint will be slash api slash sessions. In App Router, a route file exports functions named for the HTTP methods it handles.

[CODE CARD]
~~~js
// app/api/sessions/route.js
import { getCachedPublicSessions } from '../../lib/cached-sessions';

export async function GET() {
  const sessions = await getCachedPublicSessions();
  return Response.json({ sessions });
}
~~~

PARISA: Route dot js is Next's file convention. Export and async are JavaScript. GET is the named export the framework recognizes for the HTTP method. Response.json is a Web API, not JSX and not a React rendering function.

JULES: Exactly. The helper is the cached public reader we introduced earlier. The response shape is an object with a sessions property. The caller receives JSON, not a React component.

PARISA: The api folder is a naming convention we chose. App Router handlers aren't restricted to a folder literally named api.

JULES: Correct. A handler can serve an appropriate route elsewhere. We use api because it clearly distinguishes our machine-facing path from slash sessions, the human-facing page.

PARISA: And we don't put page and route files at the exact same route and ask Next to guess whether the caller wanted HTML or JSON. We give the two interfaces distinct paths here.

## The Same Data, Different Representation

JULES: The public page calls getCachedPublicSessions to render links. The handler calls it to serialize public data. Neither calls the other.

PARISA: The shared helper is the reusable operation. Rendering and HTTP serialization are different adapters around it.

JULES: Exactly. That makes it easier to keep the published-only rule consistent without coupling the page to a network request to itself.

PARISA: But sharing the helper doesn't mean we can blindly expose every field it ever gains. An API response is a public contract. We should deliberately select and document its fields.

JULES: Yes. If our helper later returns internal data for another use, the handler mustn't accidentally broaden its response. A separate public representation or explicit mapping is a useful guard.

PARISA: “The browser doesn't display it” still isn't a privacy policy. Neither is “it's only in JSON.”

## Methods Have Meaning

JULES: GET retrieves a representation. It shouldn't publish a proposal or delete a session. POST commonly creates a resource or performs a submitted operation. Other methods have their own semantics.

PARISA: A state-changing GET is especially dangerous because browsers, crawlers, prefetchers, and intermediaries may request it without a deliberate destructive action.

JULES: Exactly. Method semantics help clients and infrastructure reason about requests. Don't treat the method name as decoration around an arbitrary function.

PARISA: And a successful response should have an appropriate status. An invalid request isn't a 200 with the word error buried in an object unless there's a deliberate protocol reason.

JULES: Right. Status codes, headers, and body shape work together. A client should be able to distinguish malformed input, unauthenticated access, forbidden access, a missing resource, and a server failure where relevant.

PARISA: While being careful not to reveal private record existence unnecessarily. Sometimes a missing-style response is the appropriate public behavior even if the server knows more.

JULES: Exactly. HTTP gives us vocabulary; application security determines what we disclose.

## Input Is Still Untrusted

JULES: Suppose the lobby display requests a track filter through the query string. We can read it from the request URL using URL and URLSearchParams.

[CODE CARD]
~~~js
export async function GET(request) {
  const url = new URL(request.url);
  const track = url.searchParams.get('track');
  const allowedTracks = new Set(['web', 'platform']);

  if (track !== null && !allowedTracks.has(track)) {
    return Response.json({ error: 'Unknown track.' }, { status: 400 });
  }

  // An application helper must implement filtering and public-field selection.
  const sessions = await getPublicSessionsForTrack(track);
  return Response.json({ sessions });
}
~~~

PARISA: A standalone handler illustration, not an addition beside the previous GET in the same file. We would import or implement that helper. URL and URLSearchParams are Web APIs; Set and null are JavaScript.

JULES: Correct. Here, null means no filter. A real contract should decide what repeated query keys mean and enforce query limits. We don't let an arbitrary string become a database instruction.

PARISA: The allowlist doesn't replace safe database parameterization. It's a product validation rule layered with safe storage access.

JULES: Exactly. For a JSON body, request.json parses it, but parsing isn't schema validation. It can throw on malformed JSON, and a successfully parsed object may still contain nonsense.

PARISA: TypeScript can describe the shape we expect. Runtime code must establish that the request actually has that shape.

## Cache Policy Has Two Places

JULES: Our first handler reads an explicitly cached public function. That is one reuse policy. HTTP response caching is another.

PARISA: So returning JSON doesn't automatically decide whether a browser or CDN can store the response. We need appropriate response headers and hosting behavior.

JULES: Correct. And Route Handler rendering behavior depends on the Next configuration. With Cache Components enabled, GET handlers follow its prerendering model; supported cached work can be prepared, while runtime inputs and uncached work affect that path.

PARISA: Which is why “GET handlers are always uncached” and “GET handlers are always cached” are both bad blanket advice.

JULES: Exactly. Without Cache Components, current handlers have their own explicit caching options and defaults. Always name the model. Also, a route handler isn't a React UI tree, so we don't wrap its Response in a Suspense component.

PARISA: We can use a cached helper inside it. We don't turn the JSON into a component because the rest of the app uses components.

JULES: Right. And private responses need suitable cache controls. Never mark a personalized result publicly cacheable merely because that makes a benchmark happy.

## The Backend for This Frontend

PARISA: BFF. Backend for frontend, not best friend forever, though ours is trying.

JULES: A BFF adapts backend services to the needs of a particular frontend. It may combine data, keep upstream credentials on the server, normalize responses, or simplify browser calls.

PARISA: DemoCon might have a scheduling service and a speaker-profile service. Our handler could combine their public data into one representation the lobby display needs.

JULES: Exactly. But every extra layer adds work and a failure point. Don't aggregate everything by default. Ask whether the client contract benefits enough to justify it.

PARISA: If the same backend serves many unrelated clients, stuffing every business rule into a frontend-specific handler can make ownership awkward.

JULES: Right. Shared domain rules may belong in a service independent of this web app. The BFF should adapt the contract, not become a secret second implementation of critical business rules.

PARISA: That is the distinction between useful glue and a second backend pretending it's just glue.

## Do Not Build an Open Proxy

JULES: Keeping an upstream API credential on the server is useful. But a handler that accepts any destination URL and fetches it with our credentials is dangerous.

PARISA: We have given strangers a server-side network client wearing our badge. They might target internal addresses or unintended services.

JULES: Exactly. Restrict destinations and operations, validate input, use minimal credentials, and don't blindly forward sensitive incoming headers to arbitrary upstreams.

PARISA: Also control request sizes, timeouts, and response sizes where appropriate. Otherwise an endpoint designed to list twenty talks can become a resource-exhaustion service.

JULES: Right. And errors returned to the caller should be useful without exposing upstream tokens or internal topology.

PARISA: Security belongs in the design of the proxying operation, not a checkbox after the fetch statement.

## CORS Is Not Authorization

JULES: If a different website calls our endpoint from browser JavaScript, cross-origin policy enters the picture. CORS controls which cross-origin browser reads are allowed.

PARISA: It doesn't stop a command-line client or server from sending a request. It is not an authentication system.

JULES: Exactly. A public schedule endpoint may intentionally allow broad reading. A private organizer endpoint needs actual authentication and authorization, regardless of CORS headers.

PARISA: And credentialed cross-origin browser access has stricter rules. We should allow the intended origins, not spray wildcard headers around until the error disappears.

JULES: Correct. Cookies also raise cross-site request concerns for mutations. Framework action protections aren't automatically identical to whatever custom protocol we create in a Route Handler.

PARISA: Each exposed operation needs the protections appropriate to how it's called. Reusing the same repository doesn't mean every boundary has the same behavior.

## Webhooks Reverse the Direction

JULES: A webhook is an incoming request from another system announcing an event. For example, a trusted content service tells DemoCon that published schedule data changed.

PARISA: We verify that the request really came from the expected source and hasn't been tampered with. Merely containing a field called secret-looking-event isn't evidence.

JULES: Right. Many providers sign the raw request body. Verify according to their protocol before parsing or acting, using the exact bytes they signed. Also consider replay protection and duplicate delivery.

PARISA: Webhooks are often retried. The handler should be idempotent where necessary, and it should acknowledge success according to the provider's contract.

JULES: After a verified schedule-change event, a handler can revalidate the public cache. It cannot call updateTag, which is Server Action-only. It can use revalidateTag with the freshness behavior we intend.

PARISA: Max profile if stale-while-revalidate is acceptable; explicit immediate expiration if that is required and supported. Again, pick the behavior rather than the nicest-sounding verb.

## A Handler Is Not an Infinite Worker

PARISA: Could we generate a two-hour conference video inside a Route Handler?

JULES: A deployment may impose execution time, memory, body-size, and connection limits. A request handler is generally a poor place for long-running durable work.

PARISA: Better to validate and enqueue the job, then return an appropriate response and provide a way to inspect progress.

JULES: Exactly, if the product needs that work. We're not adding a queue to DemoCon's small schedule example. We are identifying where request handlers stop being a good fit.

PARISA: And realtime connections depend on hosting support. A framework file convention doesn't guarantee a platform supports a persistent WebSocket server.

JULES: Correct. Runtime and deployment capabilities are part of the design. Next's backend facilities don't replace every kind of backend infrastructure.

## Check the HTTP Contract

JULES: What should we verify for the public schedule endpoint?

PARISA: A normal GET returns the documented shape and only public fields. A valid filter does what it says. An invalid filter returns an appropriate error. Private or unpublished information never appears. Upstream failure produces a safe response rather than a fake empty schedule.

JULES: And caching?

PARISA: Check the freshness policy and response headers in the actual deployment. If a publication event invalidates data, verify the endpoint eventually or immediately reflects it according to that policy.

JULES: What about clients?

PARISA: A client checks the status before trusting the body, handles a slow or failed response, and doesn't assume an empty array means the network worked unless the contract says so.

JULES: That's enough for a focused check. No need to audit every endpoint pattern ever invented.

## Choosing the Interface

PARISA: Let me choose among our three tools. A Server Component needs initial public data: call the shared server helper. A proposal form in our React UI changes state: a Server Action may simplify that flow. A lobby display wants JSON: Route Handler.

JULES: Exactly. Different callers and contracts, same underlying domain where appropriate.

PARISA: If we need a public integration API with independent clients, we design versioning, access, limits, and compatibility intentionally. We don't tell partners to reverse-engineer a React action request.

JULES: Correct. Server Actions are application UI machinery, not a substitute for every public API contract.

PARISA: And if the backend already exists independently, Next can consume it without annexing it.

JULES: Absolutely. Integration doesn't require ownership of every service.

## The Lobby Display Has Its Own Failure Story

PARISA: The lobby screen asks for the schedule. Our handler returns a successful JSON response. What does the display need to do before showing it?

JULES: Check the response status, parse the body, and verify the expected representation. Then render the public sessions. It should also have a plan for a slow request or unavailable service.

PARISA: If it retains the last successful schedule during an outage, it should communicate that appropriately. A frozen display labeled live can be misleading.

JULES: Exactly. The API's cache policy and the client's refresh behavior cooperate to determine freshness. Neither alone tells us what attendees are seeing.

PARISA: We should also avoid synchronized polling from a hundred screens every exact second if that creates needless load. The refresh schedule should fit the need and capacity.

JULES: Right. A tiny endpoint can become popular. Rate, payload size, and caching decisions matter even when the handler itself is three lines long.

## A Contract Can Evolve Carefully

PARISA: We add a room field to the public response. Existing clients may ignore it. But what if we rename title to name?

JULES: That can break clients expecting title. An API contract includes field names and meaning, not just “it returns JSON.”

PARISA: So a separate client creates a compatibility obligation. We can't refactor the response casually as if every caller deploys in the same commit.

JULES: Exactly. For a small internal integration, coordination may be enough. A public API may need explicit versioning and deprecation practices. The scale of the process follows the callers and promises.

PARISA: Another reason not to expose our complete database model. Public representations should change according to consumer needs, not every internal schema refactor.

JULES: Right. Stable identifiers are useful too. A client should not infer identity solely from a title that an editor may change.

## Pagination Is About Resource Boundaries

JULES: Our demonstration has a small list, so returning all public sessions is reasonable. What changes if the endpoint covers years of conferences?

PARISA: We need bounded responses. Pagination or another clear limit prevents an ordinary request from demanding an unbounded query and enormous payload.

JULES: Exactly. Validate page size and cursor inputs. A caller asking for a billion records shouldn't override our resource policy.

PARISA: Sorting must also be stable enough for the pagination strategy. Otherwise records can repeat or vanish between pages as data changes.

JULES: Right. Those are data-contract concerns, not Next-specific syntax. Route Handlers give us a place to implement the HTTP boundary; they don't design pagination automatically.

PARISA: We keep the demo small but recognize where the simple all-records response stops fitting.

## Status Codes Are Part of the Conversation

JULES: Suppose the client asks for an unsupported track. Our example returns 400. Why not return an empty list?

PARISA: Because an unknown input differs from a valid filter with no matches. The client may have a bug or stale configuration. We should make that distinguishable.

JULES: Exactly. Suppose an upstream service fails. A safe server-error response communicates failure. A fake successful empty schedule hides it.

PARISA: And if the endpoint accepts a mutation, a successful creation can identify the new resource. The response should let the caller know what happened, not merely emit a cheerful Boolean.

JULES: Correct. We don't need a huge error taxonomy for this demo, but the statuses and body should agree.

PARISA: “Status 200, success false, error null, message maybe” is less a protocol than a cry for help.

## A Webhook Must Survive Repetition

JULES: The content service sends a schedule-change event twice. What should happen?

PARISA: The handler verifies both requests, recognizes or safely tolerates the duplicate, and doesn't perform a harmful operation twice. Revalidating the same public tag again may be harmless, but publishing or charging twice wouldn't be.

JULES: Exactly. The operation determines how important deduplication is. Signature verification proves something about the sender and message integrity, not that the event has never been processed.

PARISA: And checking a signature over parsed and reserialized JSON can change the bytes. If the provider signs the raw body, we preserve that exact input for verification.

JULES: Right. Follow the provider's protocol, including timestamp or replay checks where required. Don't invent a vaguely similar signature algorithm because it seems simpler.

PARISA: An incoming event is still an untrusted request until verified. The word webhook doesn't confer friendship.

## Test From Outside the UI

JULES: Why call the endpoint directly during verification instead of only loading the React page?

PARISA: Because the page doesn't necessarily use the endpoint at all. We intentionally share the helper beneath both. A working page can't prove the HTTP method, headers, or response body are correct.

JULES: Exactly. The independent client needs its own contract check. Send valid and invalid requests and inspect the actual response.

PARISA: For protected endpoints, try an unauthenticated call and an authenticated caller without the required permission. The absence of a visible button isn't part of that test.

JULES: Correct. And verify that errors don't leak internals. A handler can work on the happy path and still expose sensitive details when its dependency fails.

PARISA: That's a focused boundary check, not an invitation to audit the whole internet.

## The Backend Has a Doorbell

JULES: Route Handlers exist because some work needs an explicit HTTP interface. They use familiar web concepts inside Next's routing and deployment system.

PARISA: The framework handles dispatch. We still own method semantics, inputs, permissions, response shape, errors, and appropriate limits.

JULES: Exactly. A small endpoint can be simple without being careless.

PARISA: Next time, images, fonts, metadata, loading, errors, redirects, deployment, and Proxy. The framework has apparently rented the entire building.

JULES: We'll inspect which rooms are useful.

PARISA: And whether we are paying for a ballroom to store one chair.

[OUTRO MUSIC]

## Production References

- https://nextjs.org/docs/app/getting-started/route-handlers
- https://nextjs.org/docs/app/api-reference/file-conventions/route
- https://nextjs.org/docs/app/guides/backend-for-frontend
- https://nextjs.org/docs/app/api-reference/functions/revalidateTag
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
- Handler cards are alternative teaching examples, not two GET exports for one file. The recurring endpoint is /api/sessions.

