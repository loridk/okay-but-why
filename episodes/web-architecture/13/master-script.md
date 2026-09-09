# Episode 13: SSR, CSR, SSG, and Hydration — When Does the HTML Happen?

**Series:** Web Architecture • Episode 13 of 14
**Hosts:** Parisa, Jules; Sabrina joins the rendering comparison
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — The Website Needs Water

[INTRO MUSIC]

PARISA: The page is dehydrated.

JULES: It's waiting for JavaScript.

PARISA: I offered it a glass of water. Nothing.

JULES: Different hydration.

PARISA: Web terminology remains an active threat to metaphor.

JULES: Welcome to *Okay, But Why?*. Today we sort the rendering acronyms by when work happens and where it runs.

## Four Questions Before Four Acronyms

PARISA: We have already met static pages, server-rendered forms, and SPAs. So we aren't pretending these ideas arrived in a framework release last Thursday.

JULES: Right. Ask four questions. Who produces the initial useful HTML? When is it produced? Where do later interactions run? How does the displayed data stay current?

PARISA: Those questions separate concepts that marketing pages often stack together like they're one feature.

JULES: CSR means client-side rendering: browser code creates or updates the interface. SSR means server-side rendering: HTML is rendered on the server, commonly at request time in this comparison.

PARISA: SSG means static site generation: prepare HTML ahead of requests, usually during a build. It may use server-side rendering machinery during that build, which is why “server rendered” can sometimes be used more broadly.

JULES: Hydration is a framework process connecting client-side behavior to existing server-produced HTML. In React, the initial client rendering needs to match that HTML.

PARISA: None of those acronyms tells me whether the backend is a monolith or microservices. Different axis.

## The Same Menu, Three Journeys

JULES: With a basic client-rendered menu, the browser receives an HTML entry, downloads JavaScript, runs it, fetches menu data if necessary, and builds the interface.

PARISA: Useful when the application is highly interactive, but the initial useful content may depend on that startup chain. An HTML shell is not the same as a completed page.

JULES: With request-time server rendering, the server obtains the relevant data and produces HTML for the response. The browser can display that content as it arrives.

PARISA: But the server may have to wait for data before it can render. And client-side framework interactions may still need JavaScript afterward.

JULES: With static generation, the menu HTML was prepared earlier. The server or CDN returns the file. The request avoids doing that page-generation work anew.

PARISA: But freshness now depends on rebuilding, regeneration, or fetching updated information later. We haven't made time stop; we picked when the snapshot was taken.

JULES: Exactly. All three can have good or bad implementations. The right choice depends on content, interaction, freshness, and operational constraints.

## HTML Already Does Things

PARISA: Before hydration becomes too mystical: an HTML link can navigate before framework code loads. A form can submit if it's designed for native submission.

JULES: Correct. Saying hydration “makes a page interactive” is shorthand for framework-managed interactions. It doesn't mean HTML itself has no behavior.

PARISA: A React-specific click handler may not work until the client side is ready. But the anchor doesn't need to wait for React's permission to be an anchor.

JULES: This distinction matters when a page looks ready before its enhanced behavior is ready. The user can see a control and reasonably expect it to work.

PARISA: We should design that interval deliberately, not treat the user's click as inconveniently early.

## What Hydration Actually Connects

JULES: In React, the server renders an initial tree to HTML. The browser loads that HTML and the relevant React code. Hydration lets React associate its component model and behavior with the existing DOM.

PARISA: Rather than always discarding the document and constructing everything fresh. But it still involves client work and downloaded code.

JULES: Exactly. Server rendering isn't necessarily a way to eliminate JavaScript. It may improve initial content while still shipping substantial client code.

PARISA: Let's show the small conceptual entry point, with the categories labeled.

[CODE CARD: React hydration entry; JavaScript plus JSX]
~~~jsx
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
~~~

JULES: `import` is JavaScript module syntax. `document.getElementById` is a browser DOM API. `hydrateRoot` is a React library function. The App element is JSX, syntax transformed by tooling. No TypeScript appears here.

PARISA: And this assumes matching HTML was already rendered into that root. It is not the entry point for an empty purely client-rendered page, and a framework often sets it up for you.

## Why a Mismatch Matters

JULES: Suppose the server renders “three items,” but the first client render produces “four items.” React finds a mismatch.

PARISA: Or the server formats a date one way and the browser another. Or a random value changes. Or browser-only state affects the first render.

JULES: The expected initial output needs to agree. Treat mismatches as bugs, not routine warnings to suppress everywhere.

PARISA: The fix depends on the cause. Use consistent initial data, defer browser-only differences appropriately, or change the design so the first render is deterministic.

JULES: And don't use a suppression option as a universal broom. It can hide evidence without making behavior correct.

PARISA: “The page looks mostly okay on my laptop” is not a hydration guarantee. Errors can affect performance and behavior in less obvious ways.

## Sabrina Sorts the Pages

[STING: ASK THE INTERN]

SABRINA: I have three pizza pages. Public menu, private order history, and the staff dispatch board. Do I have to choose one acronym for all three?

PARISA: No. Please rescue us from that meeting.

JULES: Public menu descriptions could be statically generated, with current availability checked when ordering. Order history could be request-time rendered after authorization. Dispatch may benefit from substantial client rendering and ongoing data updates.

SABRINA: And the same framework might support several of those choices, depending on its routing and deployment model.

PARISA: Correct, but we verify its actual current behavior rather than assuming every framework defines “static” or “server component” identically.

SABRINA: That's the part I wanted to ask. A tutorial says server component. Is that just SSR?

JULES: Not exactly. React Server Components are a separate model for components executing in a server environment and sending a result that can be composed with client components. Their component code isn't shipped as client component code in the same way.

PARISA: A framework may combine that model with HTML server rendering and hydration of client components. So server components and SSR can cooperate, but they aren't synonyms.

SABRINA: And a client component can still participate in initial server rendering in some frameworks. “Client” doesn't always mean “never rendered on the server.”

JULES: Exactly. That's why the execution rules need documentation. Labels describe a framework boundary, not every stage of the request by themselves.

PARISA: Thank you. The acronym soup now has ingredients listed.

## Islands and Selective Client Work

JULES: Another approach is to keep most of a page as static or server-rendered HTML and activate specific interactive regions, often called islands.

PARISA: Our public menu might only need JavaScript for a small order configurator. The restaurant history doesn't need to become a live component just because it shares the page.

JULES: That can reduce client work. But interactions spanning several regions may require coordination, and the framework's loading rules matter.

PARISA: Again, not universally superior. A tightly coordinated editor might be better served by a more unified client application.

JULES: Selective or partial hydration strategies differ across tools. The general question is how much behavior must activate, and when.

PARISA: Don't memorize the marketing term before understanding the actual shipped code and user interaction.

## Streaming Changes When Pieces Arrive

JULES: Server rendering can stream parts of a response instead of waiting for the entire page to be ready.

PARISA: That can let useful content appear while slower parts are still being prepared. But a placeholder isn't a completed operation.

JULES: Exactly. Streaming can improve perceived progress, but it doesn't remove slow dependencies. The page needs coherent loading and error boundaries.

PARISA: Also a region appearing later should not unexpectedly move focus or make the layout jump. The user is interacting with a changing document, not watching a progress animation for our amusement.

JULES: Streaming is a delivery technique. Hydration is client attachment of framework behavior. Caching is reuse. They can coexist, but answer different questions.

## Personalization and Caching

PARISA: If we statically generate a page, can it know which customer is visiting?

JULES: Not inherently at build time. It can include generic content and later retrieve personalized data, or the system can use a different rendering path. But private data still requires authorization and safe delivery.

PARISA: And request-time SSR doesn't automatically mean uncacheable. Public responses can sometimes be cached. Personalized ones need the privacy policy we discussed last episode.

JULES: Exactly. Rendering time and caching policy are related but distinct. A request-time-generated public page can be reused later. A build-time page can fetch fresh private data after load.

PARISA: Hybrid systems are common because pages contain different kinds of information. The challenge is keeping the rules understandable.

JULES: Some frameworks support regeneration after deployment. Learn when they serve stale content, when they rebuild, and what happens if regeneration fails. Don't assume the word incremental guarantees immediate freshness.

## Security Across the Render Boundary

PARISA: Server rendering can access private data. That doesn't mean all of it should be serialized into the page.

JULES: Anything sent to the client is available to that client, whether visible text, embedded data, or a framework payload. Return only authorized necessary information.

PARISA: Escape untrusted content in its context. Avoid inserting raw user HTML without an appropriate sanitization policy. And protect server-only modules from accidental client inclusion according to the framework's rules.

JULES: A file being called server doesn't excuse exposing a secret in its return value.

PARISA: We keep returning to that because it survives every new framework. Follow the value, not the filename.

## What Actually Ships to the Browser?

JULES: A framework says some code runs on the server. How can a developer verify the consequence?

PARISA: Inspect the built output and network responses using the framework's supported tools. Understand which modules become browser code and which values are serialized into HTML or data payloads.

JULES: So we distinguish source location, execution location, and delivered output.

PARISA: Exactly. A server function can read a database and return a small safe summary. Or it can accidentally return the entire record, including private fields. Both ran on the server; only one respected the intended information boundary.

JULES: And a browser bundle may contain values substituted during the build.

PARISA: Yes. We discussed environment variables in the tooling series. Public configuration is fine when intended. Private credentials must not enter client output. Don't rely on minification or an obscure filename.

JULES: This is why rendering strategy doesn't replace a data-access policy.

PARISA: Correct. SSR, SSG, and server components all need careful selection of what gets sent to whom.

## The First Render and the Next Render

JULES: Let's unpack matching initial data. The server renders an order count of three. It also provides the initial data needed by the client. Why?

PARISA: So the client's first render can agree with the existing HTML. If it immediately uses unrelated local state saying zero, the outputs conflict.

JULES: Then after hydration, the application can fetch newer information and update normally.

PARISA: Yes. Matching the initial representation doesn't mean the page can never change. It means the handoff begins from a coherent shared snapshot.

JULES: What about a browser preference, like a theme stored locally?

PARISA: The implementation needs a deliberate strategy. The server may have an appropriate signal, or the client may apply a later change, or another design may avoid mismatch. The right solution depends on the framework and user experience.

JULES: We shouldn't casually put browser-only APIs into code that also executes on the server.

PARISA: Exactly. Window and document aren't generally available there. An environment check can prevent one error while still producing mismatched output, so understand both problems.

## A Slow Phone Walkthrough

JULES: Imagine a customer on a low-powered phone. The HTML appears quickly, but the JavaScript takes longer. What can they do?

PARISA: Whatever native document behavior we designed to work, plus whatever client behavior is ready. If every important control relies on not-yet-loaded handlers, the screen may look more usable than it is.

JULES: We could reduce how much code is required for the critical interaction.

PARISA: Yes. Smaller interactive regions, code splitting, simpler behavior, or native forms can help. But measure the actual task. Deferring a necessary script may merely move the wait to the moment the user clicks.

JULES: A loading state can communicate readiness.

PARISA: Where appropriate. But don't solve excessive startup work only by adding more spinners. Sometimes the right fix is to stop shipping unnecessary work.

JULES: Server rendering improves initial content, but the rest of the path still needs attention.

PARISA: Exactly. It's one technique with a particular benefit, not a universal performance certificate.

## Build-Time Data Can Become a Secret Snapshot

JULES: Suppose a build script has database access and generates public pages. Is that safer because it's not handling live requests?

PARISA: Different exposure, not automatically safe. If it includes private data in generated files, those files can be served publicly long after the build finishes.

JULES: So build credentials should be limited to what publication needs.

PARISA: Yes. And preview or draft content needs an appropriate access model. A URL that isn't linked from the homepage can still be reachable.

JULES: Static output also needs a removal and publication workflow if content changes.

PARISA: Exactly. If a generated file should no longer be public, updating the source alone doesn't necessarily remove every deployed copy or cached response. Follow the full publication path.

JULES: This is another example of “where does the truth live?” from the data episode.

PARISA: And “where do copies live?” from caching. Rendering is connected to both.

## The Hybrid Page Needs a Coherent Story

JULES: Our menu page has static descriptions, a live availability badge, and a personalized cart. That's three freshness levels on one page.

PARISA: Which can be fine, if the interface doesn't imply they're one atomic snapshot. The server still confirms availability and price before acceptance.

JULES: The badge might say availability is being checked, then update.

PARISA: Yes, with understandable status and no unnecessary disruption. If the live check fails, show that uncertainty rather than silently treating the old static value as current.

JULES: The personalized cart shouldn't accidentally get baked into a shared page.

PARISA: Correct. Keep the delivery and caching boundaries clear. Hybrid rendering can be efficient, but it gives us more rules to explain and test.

JULES: Would you avoid it for simplicity?

PARISA: Not automatically. If it solves real needs with manageable complexity, use it. If a straightforward server-rendered page meets the same needs more clearly, that's also valid.

## Server Components Don't Make Every Operation Safe

JULES: If a framework lets the browser trigger a server function, can we treat that like calling private code?

PARISA: No. A remotely invocable operation still needs input validation, authentication where required, authorization, and business rules. Framework plumbing doesn't make caller input trustworthy.

JULES: The source syntax may look close to a local function call.

PARISA: But the request crosses the same conceptual boundary we discussed in Episode 2. The framework may handle transport details; we still own the operation's meaning.

JULES: So a server-side cancellation function must check the order and actor, even if the only visible button is shown to eligible users.

PARISA: Exactly. Hiding the button remains interface behavior. It isn't the enforcement point, no matter how modern the invocation syntax looks.

## A Rendering Decision Record

JULES: How would you document the choice for the public menu?

PARISA: State that the content is mostly public and changes through an editorial workflow. Choose prepared HTML or cached server rendering because readable content and low runtime work matter. Specify how updates become visible and where live order checks occur.

JULES: For the private order history?

PARISA: State that identity and current records matter. Choose an authorized request path and safe caching policy. Server rendering may give a straightforward first view; client updates can enhance it if needed.

JULES: For dispatch?

PARISA: State the long-lived interactive workflow, shared data conflicts, and update needs. A richer client can be justified, with route, focus, stale-data, and failure behavior specified.

JULES: The explanation uses the rendering label after the requirements.

PARISA: Exactly. The acronym becomes a compact name for an understood choice, instead of the first thing we choose and the last thing we understand.

## Measure the Experience You Want

JULES: If the public menu needs quick readable content, measure when that content appears and remains stable. If checkout needs responsiveness, measure interaction and completion.

PARISA: If SSR gives us a fast screenshot but controls remain unusable for several seconds, we've improved one milestone and left another problem.

JULES: If CSR is fast on repeat visits but slow on a first visit from a low-powered phone, that matters too.

PARISA: And static generation can make requests cheap while making content publication cumbersome. The editor's workflow belongs in the evaluation.

JULES: Choose representative devices, networks, and tasks. Don't optimize a rendering label in isolation.

## Choose Without Memorizing a Ranking

JULES: If a listener asks, “Which rendering approach is best?” what's the useful follow-up?

PARISA: “Best for which page, audience, freshness requirement, and interaction?” A static article, a private dashboard, and a collaborative editor aren't interchangeable workloads.

JULES: And team familiarity matters. A sophisticated hybrid can be worse operationally if nobody understands when its caches refresh or where code executes.

PARISA: Exactly. Pick a design the team can explain and verify. Learn a new mechanism when its benefit is relevant, rather than stacking several unfamiliar ones because they appeared in the same tutorial.

JULES: Could a framework default be a good starting point?

PARISA: Certainly. Defaults often encode sensible tradeoffs. But understand the ones that affect privacy, freshness, and user experience. A default is still a choice we're responsible for when we deploy it.

JULES: So our mental model survives framework changes.

PARISA: That's the hope. The API names may change. The questions remain: what is generated, when, where, with whose data, and what must run before the person can use it?

JULES: Much easier to remember than a league table of acronyms.

PARISA: And less likely to expire before the episode finishes uploading.

## What We Would Inspect in a Real Project

JULES: Give me a practical first inspection when someone hands us an unfamiliar framework app.

PARISA: Open a representative route directly. Look at the initial HTML response, the later requests, and the code required before the task works. Then inspect the framework configuration and route conventions that explain the observed behavior.

JULES: Don't infer everything from the repository's file extensions.

PARISA: Exactly. A JSX file tells us about source syntax, not the entire rendering path. A server directive or framework convention needs its documented meaning, including what gets serialized to the client.

JULES: Test a first visit and a later client-side navigation too.

PARISA: Yes. They may follow different paths. Also test refresh, an expired session, slow code delivery, and stale data. Those scenarios reveal whether our mental model matches the implementation.

JULES: If the result surprises us, look up the mechanism rather than inventing a framework rule.

PARISA: That's *Jules Googles It* in spirit. Professional developers verify things. We don't earn competence by confidently misremembering a rendering default.

## Closing — Location, Time, and Behavior

PARISA: CSR puts interface rendering in the client. Request-time SSR prepares HTML on the server. SSG prepares it ahead. Hydration connects client framework behavior to compatible existing HTML.

JULES: Then caching, streaming, islands, and server components can change particular parts of the implementation. They don't replace the basic questions.

PARISA: Who creates the initial HTML? When? What runs after it arrives? How does the data stay current? Who is allowed to see it?

JULES: Next time, our finale: build an architecture in your head. We'll use requirements to choose the pieces and explain what would make us change them.

PARISA: The website still doesn't want water. But I do. Fourteen acronyms is thirsty work.

[OUTRO MUSIC]

## Production Notes

- JavaScript, browser APIs, React API, JSX, and tooling are explicitly distinguished in the hydration example.
- React Server Components are distinguished from SSR and from framework-specific client-component rendering behavior.
- No version-specific framework recipe is supplied; current documentation should govern implementation.

## Production References

- React, hydrateRoot: https://react.dev/reference/react-dom/client/hydrateRoot
- React, Server Components: https://react.dev/reference/rsc/server-components
- Astro, Islands architecture: https://docs.astro.build/en/concepts/islands/
