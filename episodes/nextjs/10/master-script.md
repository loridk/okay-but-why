# Episode 10: Do I Actually Need This Shit?

**Series:** Next.js
**Runtime:** Approximately 30-minute target; confirm with the recorded read.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: We have routes, server components, client components, caching, forms, endpoints, images, metadata, and a thing called Proxy.

JULES: We've learned a lot.

PARISA: I have one final architecture question.

JULES: Go on.

PARISA: Could this conference have been a page?

JULES: Yes.

PARISA: Good. I needed to hear you say it.

[STING]

## Understanding Is Not a Purchase Obligation

JULES: Welcome to Okay, But Why? Learning Next.js doesn't commit us to choosing it. It gives us enough understanding to evaluate what we'd gain and what we'd own.

PARISA: That's a better ending than “now rewrite everything.” I would like to retain several functioning websites and some evenings.

JULES: Next integrates React with routing, server and client coordination, rendering, data access patterns, mutations, and delivery features. Those integrations can be useful. They can also be more machinery than a project needs.

PARISA: React alone didn't fail its assignment. The full application had more assignments. Next supplies one connected set of answers.

JULES: Exactly. The decision isn't whether Next is good in the abstract. It's whether its particular answers fit this product, team, deployment, and maintenance horizon.

## DemoCon, Version One

PARISA: Twelve sessions. Finalized schedule. No login. No submission workflow. A favorite toggle that can be local. Public information that changes rarely.

JULES: A static site is a strong candidate. It can be plain HTML and CSS with a little JavaScript, or generated from structured content by a suitable tool.

PARISA: We can have semantic pages, meaningful URLs, responsive images, accessible navigation, and excellent loading behavior without a request-time application server.

JULES: Exactly. Static doesn't mean ugly or amateur. It describes how the output is produced and served. We can still use client-side interaction where needed.

PARISA: If the schedule changes, we rebuild and publish. That delay might be entirely acceptable. We shouldn't add a dynamic system to solve a freshness problem the conference doesn't have.

JULES: Right. Next can produce static output, but its ability to do so doesn't make it the simplest tool for this version.

PARISA: We learned the framework and then chose not to use it. That is a successful learning outcome, despite what the merchandise table implies.

## React With Vite

JULES: Now imagine DemoCon's internal organizer tool. It's a rich scheduling interface, users are authenticated, and a separate backend already exists. Most interactions happen after initial loading.

PARISA: A browser-focused React application built with Vite might fit well. The team can use the backend's existing API and choose routing and client data tools appropriate to the interface.

JULES: Exactly. Vite is development and build tooling. It isn't a full application framework supplying every routing and backend convention Next supplies.

PARISA: So “React plus Vite” is shorthand for a setup whose remaining architecture still needs answers. Some of those answers may already exist in the organization.

JULES: Right. If the platform already provides authentication, API contracts, observability, and deployment, adding Next may duplicate or complicate parts of that arrangement.

PARISA: But Vite doesn't inherently forbid server rendering. It supports SSR integration. We are comparing a common browser-focused setup, not claiming a law of physics.

JULES: Exactly. Once you assemble server rendering yourself or use another framework around Vite, the comparison changes. Compare complete systems, not a framework against an imaginary configuration-free alternative.

## What a Browser-Focused App Costs

PARISA: The tradeoff can be more client JavaScript and an initial data-fetching path before useful content appears. That may be acceptable for the internal tool, but we should measure it.

JULES: Yes. Route fallback configuration, error handling, data loading, and access enforcement still matter. An API must enforce permissions; a client route guard isn't enough.

PARISA: A static host serving the app shell can be simple to operate, while the existing backend handles server responsibilities. That's a legitimate separation.

JULES: Exactly. And if public discoverability or first-visit content becomes important, we revisit the rendering arrangement. We don't pretend the original choice was immoral because the requirements evolved.

PARISA: Architecture is allowed to have a date and a reason.

## Astro and Content With Islands

JULES: For a content-heavy public conference site, Astro is another candidate. It emphasizes generating HTML and adding client interaction where needed through islands.

PARISA: Such as public session pages with one favorite control, rather than treating the whole document as an interactive client subtree.

JULES: Exactly. Astro can use React components for interactive regions. It also supports on-demand server rendering with appropriate adapters, so “Astro is only static” would be inaccurate.

PARISA: Different composition model, overlapping capabilities. We should compare the work our application actually needs rather than flatten both tools into slogans.

JULES: Right. A site mostly consisting of content with isolated interactions can fit that model naturally. An application with deeply connected interactive state across much of the screen may make a larger React application model more convenient.

PARISA: Not impossible in Astro, just a reason to examine boundaries and coordination costs. We aren't making a capability chart where one checkmark decides the project.

JULES: Exactly. Astro's server islands and server rendering options broaden its use cases, but we don't need to learn every one before choosing a simple content site.

## Traditional Server-Rendered Applications

PARISA: Now my department. A traditional server-rendered application can route requests, query data, render templates, and process forms. Mature frameworks provide authentication patterns, validation, database tooling, and many other facilities.

JULES: Entirely valid. If a team knows that stack, the product is form- and content-oriented, and rich shared client state isn't central, it can be an excellent choice.

PARISA: We can add browser JavaScript where it improves the experience. Traditional doesn't mean every click reloads a page by royal decree.

JULES: Exactly. Progressive enhancement can be strong in that arrangement. The tradeoff may be maintaining separate server-template and client-component models when the interface becomes highly interactive.

PARISA: But “one language everywhere” is also not a free pass. JavaScript on both sides still runs in different environments with different capabilities and trust boundaries.

JULES: Right. Next can unify parts of the component model, but the network and server/browser distinction remain. Familiar syntax doesn't eliminate distributed systems.

PARISA: We established that when the form put on its cardigan.

## Where Next Earns Its Place

JULES: Now a richer DemoCon: public session pages, request-specific regions, a React team, organizer workflows, and a preference for integrating UI and server behavior within one framework.

PARISA: Next may fit because several of its central capabilities line up with actual requirements. We want the component model across server and client responsibilities, integrated navigation, and the associated delivery conventions.

JULES: Exactly. The team must also be willing to learn and maintain those boundaries, cache policies, and deployment requirements.

PARISA: Choosing it because “we know React” is a starting point, not the whole justification. Next adds concepts React experience alone may not cover.

JULES: Correct. Conversely, a team that already understands Next may reasonably choose it for a modest project to avoid introducing another tool. Team familiarity is a real cost factor.

PARISA: Provided we distinguish familiarity from necessity. “This is easiest for our team” can be honest. “Every serious app needs this” is not.

## Operational Complexity Counts

JULES: Development speed is one part of cost. We also need to deploy, patch, observe, and recover the system.

PARISA: A server-dependent Next app needs a compatible runtime. Caches may need coordination. Database connections need a strategy. Image processing can consume resources. Those costs don't disappear because deployment has a nice button.

JULES: Exactly. A managed platform can handle some operations for us, which may be valuable. Self-hosting gives other kinds of control and responsibility. Neither arrangement is automatically cheapest.

PARISA: And we don't need to choose a hosting company before understanding the application's requirements. Next isn't a Vercel marriage certificate.

JULES: Right. Check feature support on the intended deployment. A static export has different limits from a Node server, and platform adapters have specific capabilities.

PARISA: If we select a feature only supported conveniently on one platform, that's a dependency we should acknowledge. Lock-in can be a practical tradeoff, but pretending it doesn't exist makes planning worse.

## The Cost of Change

JULES: Framework knowledge can become maintenance work as APIs evolve. We saw that with caching advice and middleware becoming Proxy.

PARISA: That doesn't mean change is bad. It means old examples need context, and upgrades need proportionate review.

JULES: Exactly. A team should know which major version and configuration model it's using, keep dependencies patched, and have enough checks to detect important regressions.

PARISA: A simpler architecture can reduce the number of moving parts. But manually assembled glue can also become its own maintenance burden.

JULES: Right. “No framework” doesn't mean “no architecture.” Sometimes a framework replaces fragile custom integration. Sometimes it adds integration we didn't need. We have to inspect the real comparison.

PARISA: This is why the sentence “it depends” should be followed by the things it depends on. Otherwise it's just a shrug wearing glasses.

## A Decision Meeting With Actual Questions

JULES: Let's run the meeting. First question: what must a first-time visitor see before JavaScript loads?

PARISA: Public session content may need to be available promptly. That points us toward a suitable HTML delivery strategy, but several tools can provide it.

JULES: Second: how much of the interface needs connected client state?

PARISA: One favorite button differs from a live drag-and-drop schedule editor. The latter may justify a substantial client application.

JULES: Third: do we already have a backend with a stable contract?

PARISA: If yes, we should respect its ownership and assess whether Next adds useful UI integration or redundant server plumbing.

JULES: Fourth: what changes by request or by user?

PARISA: Public content, private queues, local preferences, and authenticated mutations have different requirements. We shouldn't force one cache or rendering policy across them.

JULES: Fifth: who operates it after launch?

PARISA: The actual team, not an imaginary senior platform engineer we'll hire once the conference becomes a unicorn. Choose something the real maintainers can explain and repair.

## A Small Spike Beats a Large Rewrite

JULES: If the answer is uncertain, build the smallest representative slice. One public session page, one interaction, one authenticated mutation, and the intended deployment path.

PARISA: Not the whole app twice. We want evidence about the uncertainties that affect the decision.

JULES: Exactly. Measure the first visit, inspect the client payload, verify the mutation's access checks, and observe freshness after an edit. See whether the deployment supports the needed behavior.

PARISA: If the uncertainty is team comprehension, ask another team member to explain and change the slice. A fast demo maintained by only one person is not necessarily a fast team.

JULES: Right. Write down the decision and its conditions in a short architecture note when the project warrants it. No forty-page ceremony required.

PARISA: Such as: we chose Next because public HTML, shared React UI, and integrated mutations matter; we accept server operations and explicit cache management; we'll revisit if the product becomes mostly static or backend ownership changes.

JULES: That's a defensible decision. It explains why without pretending the choice is eternal.

## Reasons That Do Not Survive Contact With Tuesday

PARISA: “It's newer.”

JULES: Not a requirement.

PARISA: “The internet says React needs a framework.”

JULES: A recommendation still needs interpretation for your application. It doesn't mean every React component requires the same framework.

PARISA: “It has excellent SEO.”

JULES: Ask which delivery and metadata behavior you need. A framework doesn't guarantee useful content, discoverability, or ranking.

PARISA: “It will scale.”

JULES: Ask what workload, bottleneck, and deployment. A bad data model can scale its invoice more reliably than its throughput.

PARISA: “The job market uses it.”

JULES: A valid reason to learn it. A separate question from whether it belongs in this production system.

PARISA: “I already started, so changing course would mean the experiment failed.”

JULES: Discovering a simpler fit is a successful experiment. Sunk effort isn't a product requirement.

## Keep the Useful Architecture Even If the Tool Changes

JULES: Our DemoCon lessons survive another framework. Public data should have a clear representation. Sensitive operations need runtime validation and authorization. Independent reads shouldn't wait unnecessarily. Caching needs a freshness policy.

PARISA: Forms need understandable feedback. Navigation needs real links. Images need appropriate dimensions and text alternatives. Deployment needs the runtime our chosen features require.

JULES: Exactly. Those aren't Next-specific virtues. Next provides particular mechanisms to implement them.

PARISA: The same goes for server/client boundaries. Even if I use PHP templates and browser JavaScript, I still need to know which environment has the data and which caller I trust.

JULES: Right. Learning a framework deeply can teach general architecture when we keep asking what problem each feature solves.

## Three Constraints That Change the Answer

JULES: Let's change one constraint at a time. First, the conference must deploy to an existing static host, and the organization cannot operate a new server.

PARISA: Then request-time Next features aren't available in that deployment as-is. We either choose static-compatible output, use an already-approved backend, or change the deployment requirement through an actual decision.

JULES: Exactly. We don't select Server Actions and then discover at launch that the host only serves files.

PARISA: Second constraint: the organization already has a mature server-rendered application with authentication and submissions. It only needs a better public schedule page.

JULES: A targeted improvement in the existing stack may be much cheaper than introducing another application framework. We can add appropriate browser interaction without replacing everything.

PARISA: Third: the team is already comfortable with Next, has compatible hosting, and wants a small new React application with public pages and mutations.

JULES: Then familiarity and existing operations may make Next efficient, even if another tool could also do the job. The decision is contextual, not a purity test.

## Migration Is Work Too

PARISA: People often compare a beautiful new prototype with the messy existing application. The prototype has no historical requirements, migrations, or support tickets yet.

JULES: Exactly. A fair comparison includes the work needed to preserve existing behavior and data. Rewriting the visible pages is only part of migration.

PARISA: URLs, accessibility, authentication, integrations, forms, analytics, redirects, and operational knowledge all need attention. The old system may contain hard-earned behavior that isn't obvious from a screenshot.

JULES: Right. A new framework can be justified, but the benefits need to outweigh that transition cost. Sometimes an incremental migration gives better evidence and lower risk.

PARISA: Such as moving one appropriate route or building one new feature with a clear boundary, rather than announcing that every template has ninety days to leave the building.

JULES: Exactly. Preserve working behavior while testing the reasons for change.

## Team Comprehension Is a Performance Metric

JULES: Suppose Next saves the original author a week, but nobody else can explain the cache behavior. How do we account for that?

PARISA: The saved week may turn into repeated debugging time. We need enough shared understanding to maintain the system, particularly around data freshness and security boundaries.

JULES: Exactly. That doesn't mean everyone must become a framework internals expert. They should understand the application conventions they're changing and know where to verify uncertain behavior.

PARISA: The same standard applies to a custom stack. If the routing glue lives in one person's head, “we avoided framework complexity” is a questionable victory.

JULES: Right. The maintainable choice is the one the actual team can operate, not the one with the fewest logos in the dependency list.

PARISA: Documentation can be small and concrete: which data is cached, which writes invalidate it, where permissions are enforced, and how the app is deployed.

JULES: Those notes can be more valuable than a long generic architecture manifesto.

## Accessibility Is Not a Tiebreaker We Add Later

PARISA: If two stacks can satisfy the application, accessibility doesn't automatically belong to one of them. We need to examine how the actual implementation behaves.

JULES: Exactly. Server-rendered content can help some loading scenarios, but a server-rendered div with an inaccessible click handler is still inaccessible. A well-built client app can provide excellent keyboard and assistive technology support.

PARISA: Navigation announcements, focus, form feedback, loading states, and semantic markup need deliberate work in either approach.

JULES: Right. Framework defaults can help, but we should verify the relevant user journeys rather than infer quality from the architecture name.

PARISA: Security is similar. A server framework gives us places to enforce access. It doesn't prove we used them correctly.

JULES: Exactly. The comparison should include the team's ability to implement and maintain those requirements, not assume one tool absolves us.

## Cost Includes the User's Device

JULES: We often discuss hosting cost but ignore client cost. Why does that matter?

PARISA: Shipping more JavaScript can mean more transfer, parsing, and execution on a slower device. A fast development laptop hides that. But moving everything to the server can increase server latency and compute costs.

JULES: Exactly. We want an appropriate distribution, not simply the smallest server bill or the smallest client bundle in isolation.

PARISA: A public content page may benefit from minimal client work. An editing tool may benefit from rich local state so every small interaction doesn't wait for the network.

JULES: Right. The workload tells us where the value is. Then we measure the important paths under realistic conditions.

PARISA: That is a more useful conversation than treating all JavaScript bytes as either sacred or criminal.

## What Would Make Us Revisit?

JULES: A good decision can include conditions for reconsideration. What might change for DemoCon?

PARISA: The public site could become mostly archival content, making a static approach more attractive. Or the organizer interface could become much more interactive. Or a separate backend could become the authoritative owner of schedule operations.

JULES: Exactly. Hosting constraints, team experience, traffic, and freshness requirements might also change.

PARISA: We don't need to predict every future feature. We need a design that solves today's problem and clear reasons to revisit it if the important assumptions change.

JULES: Right. Premature flexibility can cost more than a later targeted change. DemoCon doesn't need every possible architecture hidden behind interfaces just in case.

PARISA: We can keep ordinary boundaries clear without building an abstraction bunker.

## The DemoCon Verdict

PARISA: For our fictional recurring demonstration, Next was useful because we deliberately needed examples of routes, server and client components, rendering, caching, forms, and HTTP endpoints.

JULES: That's a teaching justification. It isn't a claim that every small conference needs those features in one framework.

PARISA: For a real small public event site, I'd first consider static output or a content-oriented tool. For an existing backend's rich organizer interface, I'd evaluate a browser-focused React setup. For an integrated React application with public and request-specific content, Next is a serious candidate.

JULES: And a traditional server-rendered stack remains a serious candidate when it fits the team's strengths and the product's interaction model.

PARISA: There. Several reasonable answers, each with a reason. Nobody had to insult somebody else's decade.

## What We Can Explain Now

JULES: We can explain why a route file exists. Why a button needs client code while an abstract may not. Why server rendering and request-time rendering aren't synonyms. Why a direct server read can avoid an unnecessary HTTP detour.

PARISA: Why caching can show old data, why invalidation belongs with successful mutations, why Server Actions still need security, and why a separate client still deserves an HTTP contract.

JULES: We can also ask whether image optimization, metadata integration, Proxy, and the deployment model are useful for our actual application.

PARISA: That's much more valuable than knowing which folder to copy from a tutorial. We can follow the work, identify the boundary, and explain the cost.

JULES: Which is what this show is for.

PARISA: I no longer hear “React framework” and assume React failed to complete its furniture certification.

JULES: Progress.

PARISA: I hear “a particular set of connected application decisions.” Then I ask whether I want those decisions.

## Final Question, Actual Answer

JULES: Do you need Next.js?

PARISA: If its integrated React architecture solves enough real problems for the product and team to justify the learning and operating costs, it may be a good choice. If simpler tools already meet the requirements, we can use them with a completely straight face.

JULES: No ceremonial apology required.

PARISA: No apology. No lanyard blockchain. No ballroom for one chair.

JULES: DemoCon's architecture committee is adjourned.

PARISA: Excellent. Now someone please update the room assignment. I know exactly which cache to ask about.

[OUTRO MUSIC]

## Production References

- https://nextjs.org/docs/app/getting-started/deploying
- https://nextjs.org/docs/app/guides/static-exports
- https://vite.dev/guide/
- https://vite.dev/guide/ssr
- https://vite.dev/guide/backend-integration
- https://docs.astro.build/en/concepts/islands/
- https://docs.astro.build/en/guides/on-demand-rendering/
- Comparisons are requirement-based editorial judgments, not benchmark results or universal rankings. No subsequent series is promised.

