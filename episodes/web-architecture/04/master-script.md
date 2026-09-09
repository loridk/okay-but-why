# Episode 4: Static Sites, Server Rendering, and the Allegedly Dead Web

**Series:** Web Architecture • Episode 4 of 14
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — Reports of My Website's Death

[INTRO MUSIC]

JULES: I brought a very exciting architecture. The browser requests a page. The server sends HTML. Links work.

PARISA: Jules. That's my website from years ago.

JULES: Yes, but I said it with the confidence of a product launch.

PARISA: Is there a waitlist?

JULES: No. The page loads immediately.

PARISA: Revolutionary.

JULES: Welcome to *Okay, But Why?*. Today: static sites, server-rendered pages, and why old doesn't mean obsolete.

PARISA: I'm Parisa, and I would like to distinguish nostalgia from an architecture that still solves a real problem.

## A Document Is Already an Interface

JULES: We followed HTTP last time. Now the server returns HTML. What can the browser do with that before we add a client framework?

PARISA: Quite a lot. It can show headings, paragraphs, lists, images, links, and forms. It can navigate, maintain history, submit fields, and expose document semantics to assistive technology.

JULES: So HTML isn't an inert picture waiting for JavaScript to grant it life.

PARISA: Correct. A link already navigates. A button in a form already submits. A select already offers choices. Those behaviors don't originate in React.

JULES: CSS can make the layout responsive. Native controls offer keyboard behavior. The browser brings decades of work to the table.

PARISA: Which doesn't mean every default is perfect or every plain HTML site is accessible. Authors can still omit labels, misuse headings, or make colors unreadable. But the platform supplies a substantial starting point.

JULES: For Nervous Robot's opening hours, location, menu description, and contact information, a document could be exactly what people need.

PARISA: Nobody needs a client-side state machine to learn that we close at ten. They need to find the hours while standing outside at nine fifty-eight.

## Static Means Prepared, Not Lifeless

JULES: A static site serves files that were already prepared before the request. The hosting service can return them without running custom page-generation logic for that visitor.

PARISA: There is still a server answering requests. “Static” does not mean the files float directly from my laptop into the customer's phone.

JULES: And static files can include JavaScript. A static page can have a calculator, filtering, an expandable navigation menu, or a request to a separate API.

PARISA: The word describes how the files are produced and served, not whether the screen is allowed to move.

JULES: Exactly. You could write the HTML by hand. Or a build tool could generate hundreds of pages from templates and content.

PARISA: A static site generator moves page assembly to build time. The generated output is ready when the customer asks for it.

JULES: That's useful for information that can be published ahead of time. Documentation, articles, restaurant information, a stable catalog.

PARISA: And it has a freshness consequence. If opening hours change, somebody must update the content and publish the new output. If the build fails, the old page may remain live.

JULES: So the architecture needs an editorial workflow. Fast delivery of wrong opening hours is still wrong opening hours.

PARISA: Static is operationally attractive, not exempt from responsibility.

## Server Rendering Means Prepared for This Request

JULES: In request-time server rendering, application code prepares HTML when the request arrives, often using current data.

PARISA: My familiar PHP example: request the menu, query the menu database, apply a template, return HTML. The browser gets the result, not the PHP source that generated it.

JULES: A template combines structure with data. You don't maintain separate copies of the header in ninety files.

PARISA: And templates should escape data appropriately. A customer's delivery note is content, not permission to inject markup or script into the staff screen.

JULES: That's an important point where a security choice belongs. Rendering untrusted data means controlling how it is interpreted.

PARISA: Also database queries should be parameterized. We don't assemble SQL by gluing raw form fields into query strings and hoping the customer respects punctuation.

JULES: Server-rendered doesn't mean automatically secure. It gives you an execution location, not absolution.

PARISA: But it can be a very straightforward route from request to useful page. The server has the data, produces the document, sends it. The browser doesn't necessarily need a separate data-fetching phase before showing the menu.

## Follow an Ordinary Form

JULES: Let's place an order using a normal HTML form. No framework required for the explanation.

PARISA: The page has labeled fields for a pizza selection, quantity, delivery or pickup, and whatever information that choice requires. A submit button describes the action.

JULES: The form sends its values to the server. The server checks the input and business rules. If something is wrong, it returns a page with useful errors and preserves appropriate values.

PARISA: If the order is accepted, save it and redirect to a confirmation page. As last episode said, a 303 can guide the browser to retrieve that page with GET.

JULES: Refreshing the confirmation then retrieves the result. It doesn't normally repeat the POST.

PARISA: Still protect the creation operation from duplicates. Post/Redirect/Get is navigation hygiene, not a transaction shield.

JULES: Let's show the smallest possible form card, with explicit limitations.

[CODE CARD: Native HTML form structure; backend and CSRF protection required]
~~~html
<form method="post" action="/orders">
  <label for="quantity">Number of pizzas</label>
  <input id="quantity" name="quantity" type="number"
         min="1" max="10" required>
  <!-- The server inserts a CSRF token when required by its policy. -->
  <button type="submit">Review order</button>
</form>
~~~

PARISA: That is HTML, not JSX. The form has a POST method and an application URL. The field has a label and a submitted name. Browser constraints help, but the server must still validate the quantity and all other required order data.

JULES: And because browser cookies may accompany a request, state-changing forms need appropriate cross-site request forgery protection. Use the framework's established mechanism and the application's policy, not the comment in this teaching card.

PARISA: The button says review because a quantity alone isn't enough to accept an actual order. The example demonstrates submission, not a production checkout.

## Where Does the Session Go?

JULES: A server-rendered app can remember a signed-in customer through a session, commonly identified by a browser cookie.

PARISA: The cookie comes with matching requests. The application uses it to locate the session and decide what the customer can access. We are not relying on one continuous connection.

JULES: Then the server can render a personalized order history page.

PARISA: Which should not be accidentally stored in a shared cache and served to the next customer. Personalized HTML affects caching policy just as personalized JSON does.

JULES: Exactly. The file format doesn't change the confidentiality requirement.

PARISA: We'll give identity and caching their own episodes. The point here is that classic document navigation can support a stateful application. A full reload doesn't mean the business forgot you.

JULES: Nor does a client-side transition mean it remembered you securely.

## Progressive Enhancement

PARISA: This is my favorite place to add JavaScript: after the essential interaction has a reliable foundation.

JULES: Progressive enhancement. Start with a usable core, then add capabilities where they're supported and helpful.

PARISA: The quantity field can update an estimated subtotal without a trip to the server. The form can offer inline feedback. We might enhance submission to update part of the page.

JULES: But we need to preserve the meaning of pending, success, and failure. If we intercept the form submission, we've taken responsibility for behavior the browser previously handled.

PARISA: Including focus and error discovery. Replacing a section of HTML isn't enough if the user has no idea it changed.

JULES: And enhancement can fail partially. The script might load but a request fails. The page should have a deliberate recovery path.

PARISA: This is different from saying every possible application must work completely with JavaScript disabled. A sophisticated editor may fundamentally depend on scripting. We design for the actual capability requirements.

JULES: Exactly. Progressive enhancement is a strategy, not a purity contest. For a pizza menu and basic form, the platform's native path offers substantial value.

PARISA: We should require extra machinery to explain what it improves.

## The Costs of Request-Time Work

JULES: Server rendering has tradeoffs. If each request needs expensive database queries before returning useful HTML, the user waits and the server does repeated work.

PARISA: And a database outage can affect the whole page unless we have a fallback. A static opening-hours page might remain available while ordering is unavailable.

JULES: That's a good reason to separate availability of public information from availability of transactions. It doesn't necessarily require separate microservices.

PARISA: A static route or sensible cache could do it. Maybe keep contact information available even when checkout is down.

JULES: Request-time rendering also doesn't automatically reduce all latency. A slow template or serial external calls can delay the first response.

PARISA: Conversely, caching rendered pages can reduce repeated work, but then we need to know what can be shared and how long it can be stale.

JULES: So even this apparently simple architecture gives us real decisions. They just might be fewer than managing a separate client application and data API for a modest site.

## The Costs of Static Generation

PARISA: Let's interrogate static generation too. Twenty thousand product pages, frequent updates, builds taking ages.

JULES: Preparing everything ahead of time can become costly. Some systems support selective rebuilds or regeneration, but those add their own rules.

PARISA: And if the page needs private customer-specific data, generating one public static page per person isn't a casual solution. Access control still needs to happen.

JULES: You could serve a static shell and fetch private data after authentication. But now the full experience includes runtime services. “Static frontend” doesn't mean “entirely static system.”

PARISA: For Nervous Robot, menu descriptions and photos can be prepared ahead. Current stock or order acceptance may need live checks.

JULES: Exactly. A static page can say what we generally sell, while the server confirms what is available now. The interface should communicate that distinction when it matters.

PARISA: The customer should not discover after paying that “available” meant “was available when someone deployed on Tuesday.”

## A Concrete Comparison

JULES: Same restaurant, three pages. First, “About Nervous Robot.” Changes twice a year.

PARISA: Static generation is plausible. Publish a new file when the content changes. Small operational burden, easy caching, useful HTML immediately.

JULES: Second, my private order history.

PARISA: Request-time server rendering is plausible. Check the session, authorize access, query the customer's orders, return personalized HTML with an appropriate private caching policy.

JULES: Third, the staff dispatch board, continuously sorting delivery assignments.

PARISA: More client-side interaction may help. It could begin with server-rendered data and enhance from there, or use a dedicated browser application. We need to understand the workflow.

JULES: Notice you didn't choose a single rendering label for every page.

PARISA: Because the pages have different jobs. Consistency in maintenance matters, but uniformity isn't worth making every task worse.

## The Old Web Wasn't Automatically Better Either

JULES: We should admit the historical pain. Full page transitions can interrupt a complex workflow. Maintaining local editing state across navigation can be awkward.

PARISA: Absolutely. I remember rebuilding selected values, scrolling back to the relevant section, and making users wait for a whole document when only one piece changed.

JULES: And dynamic interfaces written as scattered DOM mutations could become hard to coordinate.

PARISA: Those were real reasons people wanted more local interaction and stronger interface models. The answer isn't to pretend the problems never existed because we dislike today's complexity.

JULES: Nor to pretend every document is secretly a badly implemented application.

PARISA: My opening-hours page does not yearn to become a desktop operating system. It is content to inform people about Tuesday.

## Build Time, Request Time, and Browser Time

JULES: I want to slow down the timing distinction because all three can appear in one project. Suppose a build tool reads a Markdown menu and produces an HTML file.

PARISA: That's build time. The tool runs during publication, not necessarily when a customer visits. It may use Node as its runtime, but the generated page doesn't require Node in the customer's browser.

JULES: Then a customer requests the file. The hosting server returns it.

PARISA: Request time, but without custom rendering work for that visitor. The server still handles the request. “No backend logic for this page” and “no server exists” are different statements.

JULES: Then a small script lets the customer filter vegetarian items already in the document.

PARISA: Browser time. The script changes presentation using data already delivered. No extra network request is inherently required for that filtering.

JULES: Finally, they submit an order and the server checks current availability.

PARISA: Runtime application work. The overall system mixes a prepared page with a live transaction. That's a perfectly coherent architecture if we explain which information is a snapshot and which is authoritative now.

JULES: So a static frontend can be part of a dynamic application.

PARISA: Exactly. These labels are useful when we attach them to a specific responsibility. They become misleading when we use one adjective for everything behind a domain name.

## The Content Editor Is a User Too

JULES: Nervous Robot changes opening hours for a holiday. What does a good publishing workflow look like?

PARISA: Someone edits the source of the information, previews it, publishes it, and verifies the public result. The system should make it clear whether the new version actually went live.

JULES: In a static workflow, a content change may trigger a build and deployment. If that fails, the previous version may remain available.

PARISA: Which is often a reasonable failure mode, provided the editor knows the change failed. A silent build failure can leave the public page confidently wrong.

JULES: In a request-time rendered workflow, an update might appear as soon as the database changes, unless caching delays it.

PARISA: That can simplify publication, but now the public page depends more directly on the runtime content system. We still need validation, preview, permissions, and a way to correct mistakes.

JULES: So static generation trades some runtime work for publication-time work.

PARISA: Yes. The trade can be excellent. But we should include the people publishing content in the decision. A developer enjoying a clever build process doesn't prove the restaurant manager enjoys it.

JULES: The source could be a content management system rather than files edited by hand.

PARISA: Certainly. A CMS is about managing content. It can feed static generation or runtime rendering. Another pair of concepts that can cooperate instead of compete.

## A Form Error, Experienced as a Person

JULES: Let's follow an invalid order more carefully. The customer chooses delivery but leaves the address blank. They submit.

PARISA: The server rejects the operation without creating an accepted order. It returns the form with a clear explanation, preserving the valid choices. The address error is associated with the address control.

JULES: Should focus move?

PARISA: A useful error summary or first relevant error may be an appropriate destination after submission, depending on the interaction. The important thing is that the user can find what needs correction without searching a whole page blindly.

JULES: And the error text should say what's wrong, not merely “invalid.”

PARISA: Right. “Enter a delivery address, or choose pickup.” That offers the actual choices. A required-field rule without context can force unnecessary data collection.

JULES: Then the user switches to pickup. The server must accept that the address is no longer required.

PARISA: Exactly. Client-side logic may hide the address field, but the server's validation should match the business choice. Otherwise the invisible field becomes an impossible requirement.

JULES: This doesn't depend on a SPA.

PARISA: No. It's good form design. A framework can help implement it, but the reasoning is portable.

## Can We Enhance Without Breaking the Core?

JULES: Suppose we add JavaScript to submit that form without navigation. What would you inspect first?

PARISA: Whether the server still supports the intended response contract. Are we asking for HTML fragments, JSON, or a redirect? The client needs to know what to do with the result.

JULES: Then loading behavior and duplicate submission prevention.

PARISA: Yes, with server-side duplicate handling too. Disabling a button is useful feedback, but doesn't stop retries from other clients or repeated network delivery.

JULES: If the request fails before we receive a result, preserve the form and explain uncertainty. If validation fails, map errors back to fields.

PARISA: And don't replace the entire form so aggressively that focus disappears or previously entered values are lost. Enhancement should improve the task, not remove the browser's useful behavior and forget to replace it.

JULES: Could we just keep native submission?

PARISA: Absolutely. If the enhanced version doesn't materially help, the simpler path is a valid final design. Progressive enhancement doesn't require enhancing everything eventually.

## Rendering Isn't the Same as Business Logic

JULES: If the server renders the page, should the template contain the price calculation?

PARISA: Prefer a clear business operation that calculates the accepted price, then a template that displays the result. Otherwise presentation changes can accidentally change business behavior, and another interface may duplicate the calculation.

JULES: That gives us separation inside one application, without a network API between every layer.

PARISA: Exactly. A server-rendered application can be well structured. We don't have to choose between one enormous PHP file and seventeen services.

JULES: Also the same template can present a result produced by different workflows, as long as the data contract is clear.

PARISA: And templates should favor semantic HTML. A server can generate inaccessible markup just as efficiently as a client can. Execution location isn't an accessibility guarantee.

## An Honest Comparison Test

JULES: If we aren't sure whether this flow needs richer client behavior, how do we decide?

PARISA: Build a small representative interaction. Ask whether people can complete the task, how much state they need to preserve, and where delays actually hurt. Compare under realistic network conditions.

JULES: Include keyboard use and error correction, not just the fastest successful click path.

PARISA: Yes. And include maintenance cost. If the enhanced version saves a negligible amount of time but doubles the error-handling code, that matters. If it makes a complicated staff task substantially clearer, that matters too.

JULES: We can learn that without declaring the entire old web dead or the entire modern web mistaken.

PARISA: A nuanced result. Devastating for the engagement metrics, excellent for the restaurant.

## What Would We Actually Build First?

JULES: For our baseline shop, public information can be static or easily cached. Ordering can use server-rendered forms with modest enhancements. Staff can start with a straightforward authenticated order list.

PARISA: We would choose familiar, maintained tooling the team can operate. The architecture doesn't require us to resurrect an obsolete library for historical authenticity.

JULES: Right. “Traditional approach” doesn't mean “unsupported software.” Keep the runtime and dependencies maintained.

PARISA: Then verify behavior. Can a customer navigate to an order directly? Refresh it? Use Back? Submit by keyboard? Correct errors without retyping everything? Understand when the shop is closed?

JULES: And verify operational behavior. Can we publish updated hours? Restore the order database? Recover from a failed deployment? Observe a failed submission?

PARISA: These are more meaningful first milestones than announcing that the page uses the newest rendering acronym.

## The Page Without Its Enhancements

JULES: One final check: the enhancement script doesn't load. What should we expect from our baseline page?

PARISA: The public information should still be readable. Links should navigate. If we've chosen native form submission as the core path, the form should still reach the server and receive a useful result.

JULES: If a feature genuinely requires scripting, explain that limitation rather than leaving an unexplained empty region.

PARISA: Exactly. Failure can happen because of a network interruption, a blocked resource, a bug, or an unsupported capability. We shouldn't assume the only reason is that a user deliberately disabled JavaScript.

JULES: This also helps partial failure. The menu can remain useful while an optional widget is unavailable.

PARISA: And it gives us a clear testing boundary. We can verify the core document path, then verify the enhancement adds value without breaking it.

JULES: A boring page can be a resilient page.

PARISA: Let's call it a focused page. Boring is what the developer feels. Useful is what the customer experiences when they find the hours and order dinner.

## Closing — Old Ideas, Current Reasons

JULES: Static delivery prepares files before the request. Request-time server rendering prepares HTML for that request. Both can include JavaScript where it helps.

PARISA: Neither requires the browser to reconstruct a whole interface before it has anything useful. Neither automatically solves security, accessibility, or freshness.

JULES: Next time: why people wanted single-page applications anyway.

PARISA: A fair trial for the accused. I am bringing historical context, not a pitchfork.

JULES: What's under the table?

PARISA: A strongly worded form submission.

[OUTRO MUSIC]

## Production Notes

- Distinguishes static delivery, build-time generation, and request-time server rendering; Episode 13 compares these with client rendering and hydration.
- Form card is HTML and intentionally incomplete for checkout; limitations are spoken.
- References to PHP reflect Parisa's established background, not new employment claims.

## Production References

- MDN, Sending form data: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Sending_and_retrieving_form_data
- MDN, Progressive enhancement: https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement
- OWASP, CSRF Prevention: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
