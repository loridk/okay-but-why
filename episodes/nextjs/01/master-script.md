# Episode 1: Wait, React Needs a Framework Now?

**Series:** Next.js
**Runtime:** Target approximately 30 minutes; final timing depends on the recorded performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: I have learned React. I can put state in a component. I can explain why changing a random variable does not summon a new screen. I have made peace with JSX. A tentative peace. There are still border disputes.

JULES: And now we can build our conference website.

PARISA: Excellent.

JULES: First, we should talk about a React framework.

PARISA: I would like to speak to the manager of prerequisites.

JULES: You already know her. She is a folder called architecture.

PARISA: That folder has been ruining my afternoon since 2003.

[STING]

## React Gives Us a UI Model

JULES: Welcome to Okay, But Why? We're starting Next.js with the question that should come before the installation command: what does this solve?

PARISA: Because “React framework” sounds like buying a bookshelf and discovering it needs an additional furniture system.

JULES: Fair. React provides a component model and rendering tools. Components describe UI. Props carry inputs. State lets an interactive component remember things and request updates. React reconciles changes and updates the interface.

PARISA: And React has server-rendering capabilities. It isn't physically trapped inside Chrome.

JULES: Exactly. React itself supports more than browser-only applications. Next.js integrates React capabilities into an application framework with conventions for routing, server execution, rendering, data access, and deployment.

PARISA: So “React can't do server rendering” would be the wrong origin story.

JULES: Very wrong. The distinction is providing a capability versus arranging the application around that capability. You can assemble the arrangement yourself or choose another framework. Next is one arrangement.

PARISA: Like PHP having functions that send headers is different from a framework deciding how routes, controllers, templates, and errors fit together.

JULES: Yes. React doesn't prescribe a complete answer to every question a production website creates. Where does the session detail URL live? What runs when someone requests it? What JavaScript goes to the browser? How do we change the document title? Where does a form submission go?

PARISA: These are not obscure enterprise questions. Those are Tuesday questions.

JULES: And answering them repeatedly can become a project of its own. A framework supplies connected defaults. The trade is that you need to understand those defaults and the boundaries they create.

## Welcome to DemoCon

PARISA: Our demonstration is DemoCon, a fictional developer conference. The opening keynote is called “It Worked Before We Added Observability.”

JULES: Attendance is limited by our ability to find enough extension cords.

PARISA: We need a public session list. A detail page for each session. Speaker information. A favorite button. Eventually, a proposal form and a small data endpoint.

JULES: That's enough to give the framework real work. We are not also building ticket payments, hotel reservations, a livestreaming platform, and a social network for lanyards.

PARISA: The lanyards have been through enough.

JULES: We'll use a stable session identifier, a URL-friendly slug, a title, an abstract, a speaker name, and a scheduled time. Our running session is “Boring Deployments, Happy Humans,” with the slug boring-deployments.

PARISA: A slug is the readable bit of the address, not a new JavaScript animal.

JULES: Right. The public list is at slash sessions. That detail page is at slash sessions slash boring-deployments. A favorite starts as a local interactive preference, with no claim that it survives every reload or follows you between devices.

PARISA: Good. One button does not secretly imply account synchronization.

JULES: The data-access functions we introduce later are application functions. Names like getPublicSessions are ours, not functions you get by installing Next.

PARISA: We'll say when a code card is illustrative and when it relies on infrastructure we aren't implementing. These episodes teach how the architecture connects. They aren't a disguised thirty-file starter kit.

## The Request We Already Understand

PARISA: Let me describe the version I built before every object required a build pipeline. A browser requests a URL. The server routes it. Code reads some data, puts the values into an HTML template, and sends a document back. The browser renders it. Maybe some JavaScript adds interaction.

JULES: That remains a completely valid architecture.

PARISA: Thank you. I will tell the museum to stop calling.

JULES: Now consider a common browser-rendered React app. The initial document loads JavaScript. That JavaScript starts React, determines what UI to show, and may fetch data from an API before rendering the sessions.

PARISA: Which can be great for a highly interactive application. But the first useful session list might wait for the document, then JavaScript, then a data request.

JULES: Those dependencies can create a waterfall. And the browser needs enough JavaScript to do the work assigned to it. This isn't automatically unacceptable. It's a set of costs to measure.

PARISA: Also, an API already serving a mobile app might make the browser-based approach a very sensible fit. We aren't retroactively declaring an entire decade illegal.

JULES: Exactly. Next lets us choose a different distribution of work. We can render public content using the server, send useful initial HTML, and deliver client JavaScript for the pieces that need interaction.

PARISA: The session description does not need a browser-side state machine merely to be a paragraph.

JULES: But the favorite button needs a response to user input. Those needs can coexist on one page.

PARISA: Which is the actual attraction. Not “server good, browser bad.” Put the work where the requirements justify it.

## Framework Means Connected Decisions

JULES: Imagine we assemble DemoCon with React and a build tool. We choose a router. We arrange data fetching. We decide whether to render on the server and how. We design the server-to-browser handoff. We choose conventions for loading, errors, metadata, and deployments.

PARISA: Some teams already have good answers. Their existing platform might supply half that list.

JULES: Absolutely. Next's value is not that other solutions don't exist. Its value can be integrating a set of solutions so the team doesn't assemble and maintain all their connections.

PARISA: But an integrated decision can be harder to replace independently.

JULES: Yes. File conventions, caches, navigation, and server behavior become things your team must learn. You may remove some glue code and acquire framework-specific knowledge. Both belong in the cost calculation.

PARISA: This is why “less code” and “less complexity” aren't synonyms. Sometimes the complexity went into a dependency. That's a useful place for it if the dependency manages it well and we understand the contract.

JULES: And a surprising place when we don't. We'll keep asking what Next is doing on our behalf, not just which incantation made the error disappear.

PARISA: Excellent. No ritual chalk circle around node_modules.

## One Visit, Several Kinds of Work

JULES: Let's narrate the desired visit. An attendee opens the session detail URL directly from an email. Next resolves the route. Server-side work obtains public session data. React produces the result that participates in the initial page response. The browser gets useful content, and the favorite interaction becomes available when its client code is ready.

PARISA: You avoided saying that every server component runs on every request.

JULES: Deliberately. Some work can happen ahead of requests. Some can be reused. Some needs request-specific information. We'll separate execution location from execution timing in Episode Four.

PARISA: For now, we only need the distinction that our source code can contain components intended for different environments.

JULES: Right. And later navigation can use framework navigation rather than fetching a completely new document for every internal link. The exact browser request isn't necessarily the same as the initial visit.

PARISA: That's where my PHP analogy starts needing additional wiring. Server-generated UI, yes. But also a client navigation system coordinating updates to a React tree.

JULES: Precisely. Familiar motivation, different implementation and capabilities.

PARISA: And if JavaScript is slow, meaningful HTML is still valuable. But I should not promise that every interaction works without JavaScript just because the application uses server rendering.

JULES: Correct. A favorite toggle implemented with client state requires client JavaScript. A native form can have a different baseline. We need to evaluate actual behavior, not award an accessibility medal to a rendering acronym.

## What Belongs to What?

PARISA: Let's do our customs inspection. React, Next, Node, JavaScript. Four names. Nobody has declared their luggage.

JULES: JavaScript is the programming language. TypeScript adds a static type system during development. JSX is the syntax used to express elements in our React examples; tooling transforms it. React supplies the component and UI programming model.

PARISA: Node is a JavaScript runtime commonly used on the server and for development tools. It is not a synonym for the framework.

JULES: Next.js is the framework integrating routing, builds, server and client coordination, and additional web application features. A package manager installs dependencies. A build tool transforms and bundles code.

PARISA: And HTML remains HTML. A heading still needs to be a heading. A link still navigates. A button still performs an action. We do not get to replace everything with a clickable rectangle because it came from a component.

JULES: Next can improve parts of delivery. It cannot infer the correct meaning of content you marked up incorrectly.

PARISA: Nor can TypeScript prove that a stranger submitting a form has permission to change our schedule.

JULES: Types help catch mistakes in code before execution. Server validation and authorization handle runtime inputs and access decisions. Those are different jobs.

## The Architecture Has a Bill

PARISA: What new responsibility do I acquire if I choose Next for DemoCon?

JULES: You need to know which code is shipped to the browser, which data is public, and where server-only operations live. You need a freshness policy when you cache. You need to deploy an environment supporting the features you use.

PARISA: So I cannot assume that uploading a folder of HTML gives me a running database-backed form handler.

JULES: Exactly. Static export is useful within its limits. Request-time server behavior needs a compatible runtime or separately hosted backend. We'll discuss hosting without pretending a single vendor is the internet.

PARISA: What about cost? Server rendering sounds like moving my laptop's work onto a machine I pay for.

JULES: Sometimes it is. There can be benefits for users, but server compute, bandwidth, database connections, caching infrastructure, and image processing all cost resources. Browser-heavy apps also have costs, including user devices, latency, and maintenance. We compare the actual system.

PARISA: A framework doesn't eliminate the bill. It changes its line items.

JULES: Yes. And because features interact, an apparently local decision can matter elsewhere. Adding request-specific data changes what can be prepared in advance. Passing too much data to an interactive component increases the information sent to the browser.

PARISA: That is more useful than “Next is fast.” Fast doing what, on which device, with which data, and compared with what?

JULES: Exactly the questions we want.

## Does DemoCon Earn the Framework?

PARISA: Suppose DemoCon is twelve talks, no accounts, and the schedule is finalized two weeks before the event. I can publish that as static HTML and have a very pleasant weekend.

JULES: Yes. Next can generate static pages, but having that ability doesn't make it the necessary choice. A content-oriented static tool or a traditional site could be simpler.

PARISA: Suppose instead we have an existing React team, public pages that benefit from initial HTML, some personalized UI, and submissions handled alongside the app.

JULES: Then Next is worth evaluating. Those needs line up with several of its integrated capabilities. Still not an automatic verdict, but a reason grounded in the product.

PARISA: And if it's an internal scheduling dashboard where people spend all day rearranging sessions, we already have a backend, and public search visibility is irrelevant?

JULES: A browser-focused React application might fit very well. Server rendering is not an obligatory badge of adulthood.

PARISA: I appreciate that we can learn a tool without promising to marry it.

JULES: That's the whole series. Understanding gives us a choice. Marketing gives us a tote bag.

## Follow the Data Before the Logo

JULES: Here's a small exercise you can do without looking at code. An attendee opens a public talk. Ask what information is needed, where it is stored, whether it changes by user, and whether it needs to be fresh immediately.

PARISA: Title, abstract, speaker. Stored on our server. Same for everyone. Changes infrequently, but a room change on conference morning matters quite a lot.

JULES: Now the favorite button.

PARISA: Its current local state belongs to the visitor's browser. No server round trip is necessary just to toggle our initial version. If we promise persistence across devices, that changes the requirement and the architecture.

JULES: Now the proposal form.

PARISA: Input comes from an untrusted caller. The server validates it, identifies the caller if the feature requires an account, applies permission rules, and stores the result. Browser checks help the experience but do not establish trust.

JULES: We've already found three different needs on one small site. The value of a framework is partly how it helps us compose those needs without making every part behave like every other part.

PARISA: And the danger is using the same default everywhere without asking whether it belongs there.

## The Same Requirement, Four Different Answers

PARISA: Let's make this more concrete. Our organizer says, “I want people to share a link to a particular talk.” What does React itself tell us to do?

JULES: React gives us tools to render that talk's interface. It doesn't, on its own, decide our public URL structure or how our server answers a direct request for that address.

PARISA: With a browser router, the application can recognize the URL after it loads. But the host also needs to return the application appropriately when someone enters that deep link directly.

JULES: Exactly. A site can work when you click from the homepage and fail when you paste the same URL into a new tab if the hosting route fallback isn't configured correctly.

PARISA: That's a nice example of application architecture living outside a component. The component can be perfect while the address is broken.

JULES: Next integrates that routing relationship into its application conventions. Another framework or a configured server can solve it too. The value is a coordinated answer, not exclusive access to URLs.

PARISA: Next requirement: “The title of the talk should appear in the browser tab.”

JULES: Again, several solutions. Next provides route-aware metadata facilities. A traditional server template can set the title. A browser application can update it after loading. We choose based on the delivery and navigation experience we need.

PARISA: Third: “The proposal form needs to save data.”

JULES: That requires a trusted operation somewhere. Next can host it through its server facilities. A separate backend can host it. A static frontend can submit to another service. React doesn't make the browser a trusted database client.

PARISA: Fourth: “The favorite should respond immediately.”

JULES: That's a browser interaction. Our local version can update state without a server call. Adding Next doesn't mean every click must travel to a server.

PARISA: These requirements are ordinary. The framework's role becomes less mystical when we separate them.

## What We Would Have Built Ourselves

JULES: Imagine we decide to assemble a server-rendered React system manually. We need a server that receives requests, matches routes, loads appropriate data, invokes the rendering facilities, and sends responses.

PARISA: Then we need the browser assets that match that server output. We need a build process that understands what each environment requires. We need a hydration entry point and a navigation story.

JULES: Yes. We also need sensible behavior for errors during rendering, missing routes, and assets deployed under the right paths. These are all solvable engineering tasks.

PARISA: But solving them well is time we aren't spending on DemoCon's actual requirements. If a framework already provides a well-supported arrangement, adopting it can be sensible.

JULES: Exactly. And if an organization already has that arrangement, replacing it might be wasteful. Context changes whether the framework saves work or duplicates it.

PARISA: So a framework isn't just a bag of helper functions. Its choices affect how we structure and deliver the application.

JULES: Right. That's also why a framework can feel more opinionated than a library. It has conventions we participate in rather than merely functions we call whenever we like.

PARISA: The benefit is less repeated coordination. The cost is learning the convention and accommodating its assumptions.

## A Failure Reveals the Boundary

JULES: Suppose the public page loads, but clicking Favorite does nothing. Where would you look?

PARISA: Whether the browser received and executed the interactive code, whether the control is correctly wired, and whether an error interrupted it. The server having produced a nice button-shaped piece of HTML doesn't prove the interaction is ready.

JULES: Now suppose Favorite works but the page exposes an unpublished abstract.

PARISA: That's a data-selection or access problem. The browser event system isn't relevant. We inspect what the server read and what it sent.

JULES: Suppose direct links return a server error while navigation from the homepage works.

PARISA: Routing and deployment. Maybe the direct request path is handled differently. Again, React state isn't the first suspect.

JULES: Exactly. An integrated framework connects these parts, but they remain distinguishable responsibilities. That distinction makes debugging less random.

PARISA: “Next is broken” is a very large search area. “The direct document request doesn't resolve this route” is a useful sentence.

JULES: And if the schedule is old after an edit?

PARISA: Trace the read and reuse policy. We haven't taught caching yet, but we already know the visible page may not be reading the database anew at the instant I look at it.

## Familiar Knowledge Still Counts

PARISA: I want to say something for people who know the older web well. Learning these framework conventions doesn't erase your existing understanding of requests, responses, HTML, databases, or access control.

JULES: It makes that understanding especially valuable. If you can ask where a request is handled and what data crosses a boundary, you can interrogate the framework instead of treating it as an oracle.

PARISA: I may need to learn a directive or a build convention. But I can still notice that a form trusts a user-supplied owner identifier, or that a giant image dominates the page load.

JULES: Exactly. Familiarity with new syntax and architectural judgment are related but different skills. Someone can memorize the syntax and still place the database credential in the wrong environment.

PARISA: And someone can know the web deeply while needing a refresher on an arrow function. Neither person should be reduced to a generational mascot.

JULES: Agreed. We'll identify the syntax as it appears, then return to the problem. No shame, no remedial detour lasting half a season.

## Set the Demo's Boundaries Now

PARISA: One final practical choice: we're not turning DemoCon into a real product during these episodes. Why?

JULES: Because a complete product would require decisions about storage, authentication providers, deployment, moderation, and operations that can distract from the framework concepts. We'll name those responsibilities where they matter and use explicit illustrative helpers.

PARISA: So a function called requireUser means “the application must verify identity here,” not “imagine security is done.”

JULES: Exactly. And a database example demonstrates where the query belongs without quietly committing us to a particular vendor or package.

PARISA: That keeps the example small while preserving the architecture. We can understand the doorway without furnishing every room.

JULES: Right. The recurring app gives us continuity: the same session, the same routes, the same public/private distinction. We don't make listeners learn a new fictional business every time the framework changes topics.

PARISA: Excellent. I have already emotionally invested in Boring Deployments, Happy Humans. I refuse to start a pizza company halfway through the cache explanation.

## The Point of This Trip

JULES: Next.js exists because a React UI is one part of a web application, and connecting the rest repeatedly is real engineering work. Next supplies a particular, integrated architecture.

PARISA: React did not fail its assignment. We handed the application more assignments.

JULES: Exactly. Over this series, we'll follow one small app through routes, component boundaries, rendering, data, caching, mutations, endpoints, delivery, and the decision about whether any of this is justified.

PARISA: Ten episodes. One conference. No blockchain for the lanyards.

JULES: You keep saying that like someone proposed it.

PARISA: I am establishing policy before the meeting.

JULES: Next time, the folder that controls reality. Why a file called page changes what exists at a URL.

PARISA: Finally, an organizational system where naming a folder incorrectly can alter the universe. My desktop has been training for this.

[OUTRO MUSIC]

## Production References

- Next.js App Router documentation: https://nextjs.org/docs/app
- Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Deployment options: https://nextjs.org/docs/app/getting-started/deploying
- Editorial baseline: Next.js 16 App Router. DemoCon is fictional; examples illustrate architecture, not a delivered application.

