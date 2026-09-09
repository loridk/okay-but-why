# Episode 5: How We Got SPAs — The Page Refuses to Leave

**Series:** Web Architecture • Episode 5 of 14
**Hosts:** Parisa, Jules; Sabrina joins the dispatch-board discussion
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — It Has One Page and Forty Screens

[INTRO MUSIC]

PARISA: The app is described as single-page.

JULES: Yes.

PARISA: It has a dashboard, settings, order history, a map, and a screen where I regret my password choices.

JULES: Single-page doesn't mean one screen.

PARISA: Excellent. The first word is already misleading.

JULES: Welcome to *Okay, But Why?*. Today, why single-page applications exist, and what responsibilities move into the browser when we build one.

PARISA: We defended server-rendered documents last time. Now the prosecution gets to explain the actual problem.

## The Interaction That Didn't Need a Whole New Document

JULES: Imagine editing a complex order. You choose toppings, compare options, adjust delivery instructions, and keep a little preview visible.

PARISA: A full-page reload for every change would be clumsy. The server could preserve state, but the interaction would keep interrupting itself.

JULES: Developers began using background requests to update part of a page instead of replacing the whole document.

PARISA: XMLHttpRequest and AJAX-style techniques. AJAX stands for asynchronous JavaScript and XML, but JSON became common, and the technique isn't confined to XML.

JULES: Nor did AJAX require React. It was a way to request data or content and update an existing page.

PARISA: I remember the joy. Click a thing, one part changes, the rest stays put. Then I remember the second part: every event handler knowing far too much about every other event handler.

JULES: Add item, update count. Remove item, update subtotal. Change discount, update both. Request fails, undo some changes. The number of coordinated states grows.

PARISA: Which is the problem we discussed in the React series. A declarative interface model can help describe what the interface should look like for a given state.

JULES: Exactly. Frameworks and libraries made large browser applications easier to organize. They didn't invent network requests or interactive pages.

PARISA: And jQuery wasn't a failed attempt at React. It solved its own problems, including browser inconsistencies and awkward DOM work.

## What Makes an Application Single-Page?

JULES: In a typical SPA, the browser loads a document and application code. Later navigation is often handled by that code, updating the interface without requesting a completely new document for each screen.

PARISA: It can still request data, code chunks, and assets. Single-page doesn't mean one network request.

JULES: Correct. It also doesn't mean one URL. Client-side routing can associate paths with different views.

PARISA: And it doesn't mean no server. The server still handles authoritative operations and data access, as we established in Episode 2.

JULES: Nor does React automatically imply SPA. You can put React in one part of a document or use server rendering. And you can build a SPA without React.

PARISA: Four misconceptions removed. We haven't even reached the loading spinner.

JULES: That's later. It's downloading.

## What the Browser Now Owns

PARISA: If I prevent normal navigation and change the screen myself, what jobs did I volunteer for?

JULES: Routing and history. Loading states. Data fetching. Error recovery. Managing local state between views. Often focus and scroll behavior that normal document navigation previously provided.

PARISA: So the browser platform still exists, but our code is coordinating more of the experience.

JULES: Exactly. A router can use the History API to update the address without loading a new document immediately. Back and Forward should still correspond to meaningful states.

PARISA: History API is a browser API, not JavaScript syntax and not React. A routing library builds behavior around it.

JULES: Right. If you visit an order detail view and then press Back, people expect to return to the list in a sensible state. Not leave the application, lose their filters, or enter an infinite loop.

PARISA: Also direct entry. If I paste slash orders slash 417 into a fresh tab, the server must serve the appropriate application entry or route response.

JULES: Otherwise internal navigation works, but refresh returns four-oh-four. That's a deployment-routing problem, not proof that the URL is imaginary.

PARISA: A route should be something I can bookmark, share when appropriate, and reach independently. The application shouldn't require a ceremonial walk through the homepage.

## Sabrina and the Dispatch Board

[STING: ASK THE INTERN]

SABRINA: I brought the staff workflow. It's a board with waiting orders, assigned drivers, estimated delivery times, and a map.

PARISA: Excellent. An actual reason for a lot of interaction.

SABRINA: Staff might compare several orders before assigning a driver. If every selection reloads the page and resets the map, the interface fights them.

JULES: So local state is valuable: selected orders, map position, a tentative assignment, open details.

SABRINA: But the accepted assignment belongs on the server. Two staff members can be looking at the same order.

PARISA: One sees “unassigned,” another assigns it, and the first screen is now stale. Rich client state hasn't abolished time.

SABRINA: Exactly. We need the server to reject or reconcile conflicting updates, and the interface to explain what changed.

JULES: This is where people say “use a state library,” but the library doesn't decide the business conflict policy.

PARISA: It can help organize the state. It cannot negotiate which driver is taking the pizza unless we describe the rule.

SABRINA: I'd also keep important filters in the URL when useful. Then a supervisor can share the overdue-orders view instead of saying, “Click the third thing, then the blue thing.”

PARISA: Strong argument. URL state can support people working together, not just the router's internal housekeeping.

SABRINA: And the map must have an alternative. A list with addresses and assignment controls can make the task possible without operating a visual map.

JULES: That's an architectural requirement on the data and interaction. Not a label pasted onto the map at the end.

PARISA: Thank you, Sabrina. You may invoice us for saving the requirements meeting.

SABRINA: Already did. It's a single-page invoice with six routes.

## Loading Became a Product State

JULES: In a client-rendered route, the app may need data before it can show the relevant content. What does the user see meanwhile?

PARISA: Ideally something understandable. “Loading your orders,” with the page structure stable enough that the screen doesn't leap around later.

JULES: If data fails, show a retry where appropriate and preserve the context. A blank page with a console error is not a complete failure state.

PARISA: If the session expired, that's different from “you have no orders.” Empty, loading, forbidden, unavailable, and successful are not interchangeable.

JULES: Good state modeling prevents accidental lies. An empty array before the request finishes shouldn't automatically render “You've never ordered.”

PARISA: The interface is already making judgments about my life before the database has answered.

JULES: There is also stale data. Maybe we can keep showing the last known order list while refreshing, with a subtle indication that it might be out of date.

PARISA: Useful for browsing. More caution when a stale value could cause a bad decision, like assigning an already-departed driver.

## Racing Requests

JULES: Here's a classic bug. Search for “mushroom,” then quickly change to “margherita.” The second request returns first. Then the first response arrives and overwrites the new results.

PARISA: The interface ends up showing the answer to a question I'm no longer asking.

JULES: Exactly. The application needs to associate results with the request state they belong to. It can ignore obsolete results, cancel requests where appropriate, or use a library that manages those concerns.

PARISA: And cancellation doesn't necessarily stop remote work already underway. We learned that in client versus server. But we can stop an old response from taking over the current screen.

JULES: This is a concrete reason data-fetching abstractions can help. They can manage caching, request identity, loading state, and retries.

PARISA: After we understand their policies. A library retrying a failed read may be helpful. Blindly retrying a purchase is a different matter.

JULES: The network operation still has semantics, even when a hook makes it look tidy.

PARISA: Hook is a React library concept if we're discussing React hooks. Fetch remains an API; promises and async functions remain JavaScript. Different layers, same source file.

## The Accessibility Jobs We Took Over

PARISA: A new route loads, but focus stays on a navigation link whose surrounding panel disappeared. What does a keyboard user experience?

JULES: Potential confusion or a lost position. We need a deliberate route-transition strategy: a meaningful title, an appropriate focus destination when navigation warrants it, and clear structure.

PARISA: Not “focus the heading after every tiny state change.” That would be maddening. A filter updating results isn't always a full navigation.

JULES: Right. Match behavior to the action. Announce important asynchronous results without constantly interrupting screen-reader output.

PARISA: Preserve the user's place when returning to a list. Avoid replacing focused controls unnecessarily. Use actual links for navigation and buttons for actions.

JULES: A div with an onClick handler doesn't acquire all native link behavior. Opening in a new tab, copying an address, keyboard interaction—those matter.

PARISA: JSX can describe semantic elements just fine. The framework doesn't force us to replace an anchor with a decorative rectangle.

JULES: And native HTML on a server-rendered page can also be misused. These are design responsibilities, not a verdict on one rendering strategy.

## Startup Cost and Later Smoothness

JULES: A SPA can feel fast after startup because it keeps code and state locally and updates only what changes.

PARISA: But startup may involve a document, JavaScript download, parsing and execution, then data fetching, then rendering. That's a lot of prerequisites for “we close at ten.”

JULES: Code splitting can avoid loading every feature immediately. Caching can help repeat visits. Server rendering can provide initial HTML. But each technique has tradeoffs.

PARISA: And the user's phone has to execute the code. A fast server doesn't lend its CPU to a slow device just because the bundle came from a CDN.

JULES: Exactly. Measure under representative conditions. Your development laptop on excellent Wi-Fi isn't the entire audience.

PARISA: Search discoverability can be more complex too. Some crawlers execute JavaScript, others don't, and content may be delayed or unavailable to particular consumers.

JULES: Which is different from saying SPAs are universally invisible to search engines. The practical question is what your actual discovery and sharing requirements need.

PARISA: Public menu information should be easy to retrieve. Private dispatch screens don't need search indexing, but absolutely need reliable interaction.

## Offline Is a Separate Promise

JULES: People sometimes assume a SPA works offline because it runs in the browser.

PARISA: Does the order database also live in airplane mode?

JULES: Exactly. Local code may continue running, but network-dependent operations still need connectivity. Offline capability requires deliberate storage, caching, synchronization, and conflict handling.

PARISA: We could let a customer compose an order offline. We cannot honestly say the shop accepted it until the server does.

JULES: And queuing a purchase to send later raises questions. Is the shop still open? Is the price current? Does the customer still want it?

PARISA: An offline note-taking app and offline pizza checkout have very different meanings of “sync later.” One produces a paragraph; the other may produce an unwanted calzone.

JULES: So don't add offline transaction support just because a service worker tutorial made it look easy.

## Three Kinds of State in One Screen

JULES: On the dispatch board, I have a selected order, a filter for overdue deliveries, and the server's latest assignment list. Are those all the same kind of state?

PARISA: No. The selected order may be temporary interface state. The filter might belong in the URL so it can be shared or restored. The assignment list is a local representation of server-owned information.

JULES: Why does that distinction help?

PARISA: Because each needs different persistence and synchronization. Closing a detail panel doesn't need a database write. Changing a shareable filter may update the URL. Assigning a driver needs an authoritative operation and a response.

JULES: If we put everything into one giant state object, we can lose those distinctions.

PARISA: A central store isn't inherently wrong, but it doesn't decide ownership for us. We still need to know what may be discarded, reconstructed, cached, or submitted.

JULES: And derived state?

PARISA: If the displayed total is calculated from existing quantities and prices, we may derive it instead of storing another independent copy that can drift. The authoritative final price still comes from the server's acceptance rules.

JULES: So frontend state modeling is partly about avoiding unnecessary copies, while distributed data modeling is partly about managing the copies we actually need.

PARISA: Exactly. Every extra copy asks, “What makes me current?” Some answers are local calculations; others require communication.

## The Back Button Is a Requirement

JULES: Let's walk the staff member through a route. Filter to late deliveries, open an order, inspect it, go back.

PARISA: They should return to a sensible list position with the relevant filter intact. Whether selection also persists depends on the task, but losing everything is rarely helpful.

JULES: What about scroll position?

PARISA: Deliberate behavior. Navigating to a genuinely new page may warrant starting near the top. Returning to a list may warrant restoration. Updating a filter shouldn't unexpectedly fling the user somewhere unrelated.

JULES: And document title?

PARISA: It should identify the current view. Tabs, history, and assistive technology benefit from meaningful titles. Keeping “App” for every route loses useful context.

JULES: This is work a router may partly support, but the application still configures the right behavior.

PARISA: Yes. A routing library can provide mechanisms; it can't know that a staff member needs to return to the same urgent order list. That's product knowledge.

## The Deep Link and the Server

JULES: We mentioned refreshing slash orders slash 417. Let's make the deployment failure concrete. The development server always serves our entry HTML, so every client route works locally.

PARISA: Production hosting looks for a physical file at that path, finds none, and returns four-oh-four. Internal navigation worked because the already-running app handled it without a document request.

JULES: The fix is an appropriate route or fallback configuration for the deployment, while preserving real missing-resource behavior.

PARISA: Exactly. Don't accidentally return the application HTML for a missing JavaScript file and then wonder why the browser reports a syntax error. Different request types need sensible handling.

JULES: And the server still needs to protect private API data. Serving a generic app entry doesn't authorize order 417.

PARISA: The client route can show a view shell, but the data request must enforce permission. Again: navigation and authorization are different jobs.

## Updating the App While Someone Uses It

JULES: A staff member leaves the dispatch board open all day. We deploy a new version. What happens?

PARISA: Their browser may keep running the old code. It can request data from the new backend. It may later request an older code chunk, depending on the build and route loading.

JULES: So deployment isn't a synchronized replacement of every client.

PARISA: Exactly. Preserve compatibility where needed, retain assets appropriately, and design how the app notices a required update. Don't force a reload in the middle of an unsaved task without a plan.

JULES: A prompt to refresh can be useful, but it should explain the impact and preserve work when possible.

PARISA: The person might be assigning urgent deliveries. “New version available” is not automatically more important than their current task.

JULES: This is another cost of long-lived client applications: they are running software copies we don't replace directly.

PARISA: Which can be worth it. We simply budget for the responsibility instead of treating it as an edge case no one could have foreseen.

## Optimistic Updates With a Recovery Story

JULES: Staff drags an order onto a driver's column. The interface shows the assignment immediately while the server checks it.

PARISA: That's optimistic. What if the driver became unavailable or another staff member assigned the order first?

JULES: We need to reconcile. The UI might restore the previous state, show the authoritative assignment, and explain the conflict.

PARISA: And provide a keyboard-operable equivalent to dragging. The action should exist independently of the pointer gesture.

JULES: The optimistic display also shouldn't announce a final success before the server accepts it.

PARISA: Right. “Assigning” can be a distinct state from “assigned.” A subtle pending indicator may be enough, but the user should be able to tell when the operation failed.

JULES: For some actions, waiting for confirmation is clearer than optimistic behavior.

PARISA: Especially consequential or difficult-to-reverse actions. Responsiveness matters, but so does accurate confidence. We don't need to predict everything merely because the browser can animate it.

## One Screen, Several Failure Boundaries

JULES: The map fails to load, but the order list works. Should the whole board disappear?

PARISA: Probably not. If the list supports assignment and essential information, preserve it and explain that the map is unavailable. Design the regions so a nonessential failure doesn't destroy the entire task.

JULES: React error boundaries can help with some rendering errors, but they aren't a universal handler for every asynchronous failure.

PARISA: Correct. Request failures, event-handler errors, and rendering failures have different handling mechanisms. The library feature is part of the implementation, not a complete reliability policy.

JULES: The architecture question is what can remain useful when one dependency fails.

PARISA: Exactly. A resilient interface isn't one that never admits a problem. It's one that accurately shows the problem and preserves whatever work remains possible.

## When We Would Choose It

PARISA: For the dispatch board, an SPA or a substantial client-side application can be justified. Long sessions, coordinated interaction, lots of temporary state, meaningful local responsiveness.

JULES: For the public menu and a modest order form, it may add more responsibility than benefit. An enhanced document flow could be easier to build and maintain.

PARISA: For a product with both, we can mix approaches. The boundary might be an area of the site rather than an entire company choosing one rendering identity.

JULES: The costs include client code, data synchronization, navigation behavior, and error handling. The benefits include preserving context and managing complex interaction locally.

PARISA: “It feels like an app” is not quite specific enough. Tell me which task becomes easier and what evidence would show that.

JULES: For staff, perhaps fewer lost selections and faster assignment work. For customers, perhaps no measurable benefit. Then don't force the same solution onto both.

## The Choice We Can Explain to Staff

JULES: How would we explain the dispatch app choice without saying SPA?

PARISA: “This screen keeps your selections and map position while new order information arrives. You can compare and assign deliveries without reloading the whole page. The server still confirms assignments, and the screen will tell you if another person changed something.”

JULES: That's the benefit in terms of the task.

PARISA: Exactly. Then explain the limits: it needs a supported browser and connectivity for authoritative updates. If the connection drops, the screen shows that it may be out of date and prevents misleading final actions where necessary.

JULES: We can verify those promises directly.

PARISA: Yes. Try losing connectivity, receiving a conflicting update, navigating away and back, and using the keyboard. Those scenarios tell us whether the chosen architecture supports the work.

JULES: If we can't explain a benefit that concretely, maybe we haven't justified the complexity.

PARISA: Or we need to learn more about the workflow. That's a better next step than picking a state-management library while the requirements remain foggy.

JULES: The library choice comes after we know the kinds of state and transitions we need.

PARISA: Ideally. Sometimes prototyping helps us discover them, but the prototype is an experiment, not proof that every package it used belongs in the final product.

## Closing — A Trade, Not an Upgrade Badge

PARISA: Single-page applications grew from a real need: rich, continuous interaction without replacing the document for every change.

JULES: They move more coordination into the browser. That can be valuable, and it creates work that native navigation previously handled.

PARISA: React can help describe UI state. A router can help with navigation. A fetching library can help with remote data. None chooses the business rules or accessibility behavior for us.

JULES: Next time: APIs. The boundary our browser application keeps talking across.

PARISA: A JSON URL is about to acquire responsibilities.

[OUTRO MUSIC]

## Production Notes

- Sabrina appears as a competent workflow contributor, not a permanent third host.
- Builds on React-series state/rendering concepts without presenting React as synonymous with SPA.
- New syntax/API labels are spoken; no executable code card is necessary.

## Production References

- MDN, SPA: https://developer.mozilla.org/en-US/docs/Glossary/SPA
- MDN, Working with the History API: https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API
