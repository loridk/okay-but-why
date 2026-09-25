# Episode 9: Next.js Ate My Web Stack

**Series:** Next.js
**Runtime:** Approximately 30-minute target; confirm with the recorded read.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: Routing, components, data, forms, endpoints. Surely we've reached the edge of the framework.

JULES: It would like to discuss your images.

PARISA: Of course it would.

JULES: Also fonts, metadata, and deployment.

PARISA: Does it need an emergency contact? It appears to live here now.

[STING]

## Integration Has a Practical Reason

JULES: Welcome to Okay, But Why? A production page isn't finished when the component returns JSX. Images must load sensibly, fonts affect layout, metadata describes the page, errors need recovery, and something must run the application.

PARISA: These are old web responsibilities. Next integrates tools for them into its routing and build system. The question is whether that integration saves us useful work.

JULES: Exactly. Today isn't a list of features to enable. We'll follow DemoCon from a speaker portrait to the deployed request and identify where each facility earns its place.

PARISA: If the framework offers a ballroom, we can still decide our one chair belongs in the kitchen.

## Images Are Often the Actual Performance Problem

JULES: Our session page has a speaker portrait. Sending a giant original image to a small phone wastes bandwidth. Reserving no space can make the page jump when it loads.

PARISA: Neither problem requires a novel rendering acronym. They require an appropriately sized image and predictable layout.

JULES: Next's Image component helps integrate responsive image delivery and optimization. We still choose dimensions, sizes, alternative text, and loading behavior appropriate to the actual image.

[CODE CARD]
~~~jsx
import Image from 'next/image';

<Image
  src="/speakers/morgan.jpg"
  alt="Morgan Chen"
  width={320}
  height={320}
  sizes="(max-width: 40rem) 40vw, 160px"
/>
~~~

PARISA: Image is Next-specific, and the element syntax is JSX. Width and height establish intrinsic dimensions and aspect ratio. CSS still controls the rendered layout, so sizes must match the space the design really gives the image.

JULES: Exactly. This card assumes a layout displaying the portrait at forty percent of viewport width on smaller screens and around one hundred sixty pixels otherwise. Copying sizes without matching the layout can cause poor resource choices.

PARISA: The alt text also depends on context. If the adjacent text already names Morgan and the portrait adds no useful information, an empty alt may avoid repetition. If identifying the person is the image's purpose, a concise name may fit.

JULES: Correct. The component can't decide that for us. Nor does optimization excuse a decorative image from having the right semantics.

## Choose the Important Image Deliberately

PARISA: Should we preload every speaker portrait because faster is good?

JULES: No. Preloading everything creates competition for resources. Prioritize only when appropriate for the actual important image. In Next 16, older examples using the priority prop need updating; preload is the clearer current prop replacing that deprecated usage.

PARISA: And loading strategy can also involve normal eager loading or fetch priority depending on the case. We shouldn't turn one replacement prop into a universal prescription.

JULES: Exactly. Measure the page. A below-the-fold speaker portrait generally doesn't deserve to compete with essential initial resources just because we discovered preload.

PARISA: Remote images need an explicit source policy too. Otherwise an optimization service can end up fetching things we never intended it to fetch.

JULES: Right. Configure allowed remote patterns carefully. Image optimization also consumes server or platform resources. It's an integration with costs and configuration, not free compression sprinkled into HTML.

## Fonts Are Layout Decisions

JULES: Next's font facilities integrate font loading with the application and can help reduce layout shifts. Local fonts can be served from the project, and supported Google font integration prepares font assets during the build rather than requiring a visitor's browser to fetch them directly from Google.

PARISA: Which changes who makes the request and when. It doesn't eliminate the build's dependency on obtaining those assets, nor does it override licensing responsibilities.

JULES: Correct. A system font stack may be the simplest choice. If DemoCon needs a custom font, load only the weights and subsets the design uses.

PARISA: Six weights, three italics, and a novelty display face for a one-day conference is not a personality. It's a payload.

JULES: And test fallback behavior. Text must remain readable. A font isn't successful if it looks lovely after a long invisible interval.

PARISA: Again, the framework gives us machinery. Typography, readability, and restraint remain design decisions.

## Metadata Describes the Page

JULES: A session needs a meaningful document title and description. Next's metadata API connects that information to routes and layouts.

[CODE CARD]
~~~js
// app/sessions/page.jsx — alongside the page component
export const metadata = {
  title: 'Sessions | DemoCon',
  description: 'Browse the public DemoCon session schedule.',
};
~~~

PARISA: That's a JavaScript object exported under a name Next recognizes. It isn't JSX. For dynamic session metadata, generateMetadata can use the route data rather than giving every talk the same title.

JULES: Exactly. Use public information and the correct async params contract. Avoid duplicating expensive reads needlessly, and handle missing sessions consistently with the page.

PARISA: Titles help browser tabs, history, and assistive technology as well as search. This isn't only an SEO trick.

JULES: Right. Canonical URLs and social preview metadata also need accurate deployment information. A beautiful preview pointing at localhost is a very limited marketing strategy.

PARISA: And robots metadata is not access control. A private organizer page needs real authorization even if we ask crawlers politely to go away.

JULES: Correct. Nor does metadata guarantee ranking. It helps communicate what the page is; it doesn't purchase relevance from the universe.

## Loading, Empty, Missing, Failed

PARISA: Four states people often compress into one spinner.

JULES: Loading means work is pending. Empty means the read succeeded and there are no items. Missing means the requested resource isn't available. Failed means the operation couldn't complete normally.

PARISA: The session list being empty is different from the database being unavailable. The user should not have to infer which happened from our minimalist aesthetic.

JULES: Exactly. Next provides conventions such as loading, not-found, and error files. We choose meaningful content and recovery actions within them.

PARISA: Error boundaries handle errors in the subtree they wrap, not necessarily everything imaginable in the route. Event-handler errors and expected form validation need their own handling.

JULES: Correct. Next's error UI is a Client Component. Its recovery control can attempt to render again, but retrying doesn't repair a permanently invalid input or a broken database.

PARISA: And a boundary in a segment doesn't catch failures in that same segment's layout above it. Placement matters. Root-level failures may need the global-error convention.

JULES: Exactly. We don't need every file in DemoCon immediately. We need a deliberate boundary around failures the user can understand and recover from.

## Recovery Is an Interaction

PARISA: A useful error message might say “We couldn't load the schedule. Try again,” with an actual button. It shouldn't dump an internal stack trace.

JULES: Right. Keep technical diagnostics on the server where appropriate, with safe correlation information if useful. Don't put credentials or personal data into either logs or error output casually.

PARISA: Focus and announcements matter when content changes. A user operating with a keyboard shouldn't lose their place because an optional panel failed and rebuilt half the page.

JULES: Exactly. An accessible fallback includes meaningful headings, real controls, visible focus, and a clear explanation of what remains usable.

PARISA: Loading UI should also avoid unnecessary movement, especially for users requesting reduced motion. The framework didn't require our skeleton to perform a tiny disco.

## Redirects Change the Address

JULES: Suppose DemoCon renames a route from slash talks to slash sessions. A redirect tells the client to request a different location, and the visible address changes.

PARISA: Useful for preserving old links. We choose whether the move is temporary or permanent based on reality, not which number sounds most authoritative.

JULES: Next offers configuration redirects and programmatic redirect facilities. Their status behavior depends on context, such as a form action versus an ordinary route response.

PARISA: So don't memorize one status and claim every redirect function always produces it. Understand the intended method and navigation behavior.

JULES: Exactly. Redirect targets also need validation when influenced by input. A login return URL should not become an open redirect to an arbitrary external destination.

PARISA: “It came from a query string” is a reason to check it, not a reason to trust it.

## Rewrites Keep the Visible Address

JULES: A rewrite serves content from a different destination while preserving the visible requested URL. That differs from telling the browser to navigate elsewhere.

PARISA: It can help migrations or route traffic to another service behind a stable public address.

JULES: Yes. But it introduces another place to understand routing, headers, caching, and failures. An external rewrite isn't a security policy by itself.

PARISA: A URL staying pretty doesn't mean the request stopped crossing a network boundary.

JULES: Exactly. Use configuration for straightforward stable rules. Don't introduce request-time code when a simple configured redirect or rewrite solves the problem.

## Middleware Is Called Proxy Here

PARISA: Time for the renamed feature. Older tutorials say middleware. What do Next 16 examples call it?

JULES: Proxy. The middleware file convention is deprecated in favor of proxy. The name emphasizes request-boundary work before a request completes, such as selective redirects, rewrites, or header decisions.

PARISA: Next's proxy file is not automatically an nginx installation, and it isn't synonymous with every reverse proxy in our deployment.

JULES: Correct. It's a framework convention. In this model Proxy runs in the Node.js runtime. Don't copy older claims that middleware always runs at the edge and assume they describe the renamed feature.

[CODE CARD]
~~~js
// proxy.js — beside app/, or beside src/app/ inside src/
import { NextResponse } from 'next/server';

export function proxy(request) {
  return NextResponse.redirect(new URL('/sessions', request.url));
}

export const config = {
  matcher: '/talks',
};
~~~

PARISA: A deliberately small illustration of the file and function names. URL is a Web API. NextResponse is a Next extension. The matcher keeps this example scoped to the old talks path.

JULES: And a configuration redirect would be simpler for this fixed rule. We're showing the convention, not recommending Proxy for every redirect.

PARISA: We definitely don't redirect every request, including assets, back to sessions and call the resulting loop “centralized routing.”

JULES: Exactly. Match narrowly. Keep work limited. Database queries and slow business operations don't belong here merely because it runs before the page.

## Proxy Is Not Our Only Access Check

PARISA: Could Proxy redirect unauthenticated users away from organizer pages?

JULES: It can participate in an optimistic early routing check, but it must not be the only authorization enforcement. Protected reads, Server Actions, and handlers need their own checks.

PARISA: Because routes and operations can be reached through different paths, and the operation itself knows what permission is required.

JULES: Exactly. A quick cookie presence check doesn't establish that a session is valid or that the caller can publish a particular proposal.

PARISA: Security needs to survive someone calling the operation without clicking through our intended UI.

## Build Tools Are Not the Runtime

JULES: Next's build tooling transforms modules, separates server and client work, and produces output for deployment. In Next 16, Turbopack is the default bundler for development and builds.

PARISA: Turbopack is tooling. React is the UI model. Node is a runtime. The browser is another environment. Keeping those labels separate helps when a failure occurs before the app is even running.

JULES: Exactly. A successful build tells us something valuable, but it doesn't prove production secrets, database access, cache coordination, or reverse proxy behavior are correct.

PARISA: Nor does a development server prove the production bundle works. We need a proportionate production check.

## We Can Deploy Without a Vendor Vow

JULES: Next can run as a Node server or in a Docker container. Static export supports a limited feature set. Platform adapters provide other hosting integrations with varying support.

PARISA: Vercel is one option, not a requirement of learning Next. We compare actual feature support, operations, and cost.

JULES: Correct. Our DemoCon version with Server Actions and request-time data requires suitable server support. A static export can't execute those operations on an ordinary static file host.

PARISA: We could keep a static public site and use a separate backend, but that would be a different deployment arrangement, not the same application magically running without a server.

JULES: Exactly. Image optimization, cache persistence, streaming, and background work also depend on the runtime and platform configuration.

PARISA: A reverse proxy might buffer a streamed response. A cache might be local to one instance. A database might be far away. “Deployed successfully” doesn't answer those questions.

## A Small Operational Checklist in Conversation

JULES: If we actually shipped DemoCon, what would you check first?

PARISA: The deployed public list and detail routes. A missing slug. A real form submission under the intended account. Rejection of an unauthorized publication. A successful authorized update followed by the expected cache behavior. The public JSON endpoint.

JULES: Then resources and navigation?

PARISA: Images at phone sizes, readable fonts, titles, keyboard operation, old-route redirects, and error recovery. Also whether the environment has only the secrets and permissions it needs.

JULES: And the infrastructure?

PARISA: Logs without sensitive leakage, database connections appropriate to the runtime, a known update process, and cache coordination if there are multiple instances. We don't need an enterprise platform for a small conference, but we do need to understand what is running.

JULES: Exactly. The framework can reduce integration work. It doesn't remove the responsibility to operate the features we use.

## Follow a Cold Visit

JULES: Someone opens a session on a phone they've never used to visit DemoCon. Which optimizations can help that first visit?

PARISA: Useful HTML, a modest client bundle, correctly sized images, readable text, and a server that responds promptly. A cache already in that particular browser can't help because it doesn't exist yet.

JULES: Exactly. Server or CDN reuse may help, depending on the deployment. But a fast repeat visit in our browser isn't evidence about this cold path.

PARISA: A portrait with dimensions reserves space. Appropriate responsive sources reduce unnecessary transfer. A sensible font strategy lets the words appear. These improvements can matter more than an elaborate component refactor.

JULES: Right. We should optimize the observed bottleneck. The framework provides tools across the stack because a page's cost is distributed across the stack.

PARISA: And we still need clear content. A page can arrive instantly and fail to tell someone where the talk is.

## The Image Pipeline Has an Origin

JULES: Suppose speaker portraits come from a content service. What should we configure besides the Image component?

PARISA: Which remote source patterns are allowed, what dimensions the design uses, and whether the deployment supports the intended optimization path. We should also understand the source images' rights and privacy.

JULES: Exactly. If an image requires authentication, don't assume a public optimization request can fetch it safely with the same browser credentials. The request path and access model need deliberate design.

PARISA: And we shouldn't expose an internal image URL merely to make the optimizer happy. Public and protected media may need different delivery arrangements.

JULES: Right. An image helper simplifies part of delivery; it doesn't make all sources equivalent.

## Metadata Can Disagree With the Page

PARISA: Imagine the visible session title updates, but the social preview still has the old title. Where do we look?

JULES: At the metadata data source, its caching, the generated tags, and the external service's own cached preview. Updating our page doesn't necessarily purge a social platform's saved preview.

PARISA: Another case of multiple copies with different lifetimes. We should inspect the actual metadata response before blaming the component displaying the heading.

JULES: Exactly. Also keep canonical URLs and deployment base URLs correct. A staging address shouldn't leak into production metadata because we copied a configuration file without checking it.

PARISA: The page can have one visible heading and a different document title for context, but they shouldn't contradict each other about what resource we're viewing.

JULES: Right. Metadata should be generated from the same public content contract where practical.

## A Redirect Can Become Permanent in More Than One Place

JULES: Why be careful with permanent redirects during a migration?

PARISA: Clients and intermediaries can remember them. If we declare a permanent move while experimenting, undoing the server rule may not immediately undo every cached decision.

JULES: Exactly. Test the intended mapping and choose permanence according to the actual move. Avoid loops and chains where possible.

PARISA: A rewrite has different consequences because the visible URL stays the same. That can help a migration, but it can also obscure which system answered when debugging.

JULES: Right. Document the small routing rule sufficiently for maintainers. An invisible routing layer that nobody remembers is a future incident with excellent camouflage.

## Multiple Instances Change the Picture

PARISA: Our local server stores reusable data. Production runs several instances. Does each one necessarily know when another invalidates something?

JULES: Not without the appropriate shared storage or coordination strategy. Deployment architecture determines how cache behavior spans instances and survives restarts.

PARISA: So we verify the actual hosting setup's support. We don't assume a directive establishes a distributed cache cluster.

JULES: Exactly. Similar questions apply to local files and long-lived memory. A temporary serverless filesystem or process variable is not durable application storage.

PARISA: Which is why our illustrative database helper points to real persistence infrastructure in a real app. Writing proposals to an in-memory array would not satisfy the promise that submissions are saved.

JULES: Correct. The framework's request lifecycle and the storage lifecycle are different.

## Rollback Is a Product Recovery Tool

JULES: Suppose a deployment breaks the proposal form. What should the team be able to do?

PARISA: Detect it, understand enough of the failure, and restore a working version or fix the issue. A rollback strategy needs to consider database changes as well as application files.

JULES: Exactly. An old application build may not work with a newly changed schema if the migration wasn't designed compatibly.

PARISA: We don't need to teach full deployment engineering here, but we should avoid implying that a green build is the end of the story.

JULES: Right. A small smoke check of the important routes and mutation paths can catch obvious deployment failures quickly.

PARISA: And we preserve the user's data. Releasing a simpler interface temporarily is better than asking people to resubmit proposals because our deployment strategy treated persistence as disposable.

## Optimization Should Have a Stop Condition

JULES: When do we stop tuning DemoCon?

PARISA: When the important user journeys meet our performance, reliability, and accessibility requirements, and further work isn't justified by evidence. There will always be another graph we could improve.

JULES: Exactly. The framework's feature list isn't a list of unfinished chores.

PARISA: If a system font is readable and appropriate, we don't add a custom font pipeline to prove we understand next/font. If a configured redirect works, we don't promote it into Proxy code for prestige.

JULES: Right. Understanding the tool includes knowing when a smaller mechanism is enough.

## The Stack Is a Set of Choices

PARISA: Images solve resource delivery. Fonts solve a loading and typography problem. Metadata describes routes. Loading and error conventions organize states. Redirects and rewrites manage addresses. Proxy handles selected request-boundary work. Deployment determines which behavior can actually run.

JULES: That's the map. Use the facilities that solve real problems, and keep their limitations visible.

PARISA: Next time, the question we've been saving: do I actually need this shit?

JULES: We have enough understanding to answer without either a sales pitch or a ceremonial bonfire.

PARISA: Excellent. The ballroom remains optional.

[OUTRO MUSIC]

## Production References

- https://nextjs.org/docs/app/api-reference/components/image
- https://nextjs.org/docs/app/getting-started/font-optimization
- https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- https://nextjs.org/docs/app/api-reference/file-conventions/error
- https://nextjs.org/docs/app/guides/redirecting
- https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- https://nextjs.org/docs/app/getting-started/deploying
- https://nextjs.org/docs/app/guides/self-hosting
- https://nextjs.org/docs/app/guides/upgrading/version-16
- Baseline: Next.js 16. Proxy example teaches the convention; use a configuration redirect for the fixed mapping in a real app.

