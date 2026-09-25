# Episode 2: Why Did We Need Web APIs?

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Target approximately 30 minutes; final timing depends on the recorded performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

JULES: I have a radical architecture proposal.

PARISA: I'm already tired.

JULES: A user requests a page. We run some server code. That code gets the data, puts it into HTML, and sends the HTML to the browser.

PARISA: That's the website I built in PHP.

JULES: It has excellent initial content delivery.

PARISA: Still the website I built in PHP.

JULES: We could give the approach a name and announce that it solves browser rendering overhead.

PARISA: If you sell my old website back to me with a subscription, I'm changing the Wi-Fi password.

JULES: Today's subject: if that approach worked, why did we start asking servers for data separately?

PARISA: A question that does not require setting the old approach on fire. I like it already.

[STING]

## The Server Already Did Things

PARISA: Welcome to Okay, But Why? Last episode, API stopped meaning a mysterious building somewhere on the internet. It's an interface code can use. Today we're narrowing the question: why web APIs?

JULES: And we should avoid a misleading history. There wasn't an era when servers could only send HTML, followed by someone inventing data. Systems exchanged structured information before browser applications became common.

PARISA: We are following a familiar web developer's experience, not claiming that a JavaScript library invented computers talking to each other.

JULES: Exactly. Start with our fictional Nervous Robot Pizza Delivery website. A customer opens the page for order 42.

PARISA: In the traditional server-rendered version, a request reaches the server. The server identifies the requested order, checks whether this customer can see it, reads its status, and builds a page.

JULES: The response contains HTML saying the pizza is in the oven.

PARISA: The browser understands the HTML and presents it. We can send CSS and images and enhance the experience with JavaScript. Server-rendered does not mean there are no styles or interactions.

JULES: And dynamic doesn't necessarily mean generated in the browser. That HTML can be built using fresh database information on the server.

PARISA: Thank you. A PHP page wasn't a stone tablet. We had variables.

JULES: Several, allegedly.

PARISA: And databases. Occasionally even indexes. It was a rich cultural period.

## Follow a Form Submission

JULES: What happens if the customer needs to update delivery instructions?

PARISA: There can be an HTML form. A label, a text field, a submit button. The form says where to send the submission and which method to use. The browser sends the data. Server code validates it, checks permission, and saves an allowed change.

JULES: Then it returns another page?

PARISA: It can. A common successful pattern redirects to a page showing the result, which also helps avoid casually repeating the same form submission when the user refreshes. Validation failures can return a page with the user's input and helpful errors.

JULES: So the browser already knows how to collect form controls and send a request. We don't have to write fetch for a form to be capable of doing anything.

PARISA: Correct. And a server receiving an ordinary form still needs to distrust its input. The fact that our page offered a polite text field doesn't prevent somebody from sending an entirely different request.

JULES: That boundary was always there.

PARISA: Yes. Neither validation nor authorization began with JSON. If I let someone change somebody else's order in 2004, it was still a bug. It just had a gradient button.

[CODE CARD: A native form sends data without a JavaScript fetch call]
```html
<form action="/orders/42/instructions" method="post">
  <label for="instructions">Delivery instructions</label>
  <textarea id="instructions" name="instructions"></textarea>
  <!-- A real cookie-authenticated form needs the application's CSRF protection. -->
  <button type="submit">Save instructions</button>
</form>
```

JULES: For listeners, that card has a labeled field and a button. The browser handles the submission. It's illustrative markup, not a complete secured ordering system.

PARISA: The server must verify the customer, enforce access to order 42, validate the field, and protect the state-changing request against forgery. CSRF means a malicious site trying to make the browser send an unwanted authenticated request. We'll revisit credentials later.

JULES: The action path is our fictional route, not a feature supplied by HTML. Someone has to implement its behavior on the server.

PARISA: Which will remain true after we change the response format. That's the thread I want people to hold onto.

## The Page Was a Package Deal

JULES: In that version, the server sends both the information and instructions for presenting it as a document. The order status arrives inside the page's markup.

PARISA: It might include the header, navigation, account links, an order summary, and a footer explaining that our fictional restaurant's opening hours are governed by existential dread.

JULES: A complete document can be exactly what a visitor needs. But now imagine the customer wants to check the status repeatedly while keeping the rest of the page in place.

PARISA: A full navigation could ask the server for the whole document again, even though the thing we care about is one small status message.

JULES: The browser might reuse cached assets, so we shouldn't pretend it downloads every image again every time. Still, a document navigation and a targeted update are different interactions.

PARISA: And sometimes the page has unfinished work. The customer has scrolled, opened a section, or started typing. Rebuilding their entire view to update one fact can be disruptive.

JULES: That's one pressure: ask for the changing information without replacing the whole document.

PARISA: Another pressure is just responsiveness. While we're waiting on that information, maybe the rest of the page can remain usable.

JULES: Yes. But “can remain usable” is a design possibility, not something granted automatically by an acronym.

PARISA: I have used asynchronous applications that were asynchronously terrible.

## AJAX Was a Pattern, Not a New Planet

JULES: This is where AJAX enters our story. The name expands to Asynchronous JavaScript and XML.

PARISA: People encounter that name now and wonder whether XML is compulsory. It isn't. The historical name survived a much broader range of response formats.

JULES: AJAX describes a technique: JavaScript requests information, and the page can update without a full document navigation. XMLHttpRequest was a major browser interface for doing that. Fetch is a newer interface commonly used for browser requests now.

PARISA: And those browser APIs are the mechanisms our code uses to send requests. The application endpoint on the other end is a separate interface, with its own purpose.

JULES: Right. One API helps you communicate with another. Our first episode's tiny forklift has found employment.

PARISA: Please explain asynchronous before it becomes wallpaper.

JULES: In this context, our code starts an operation and can continue without waiting synchronously for the remote answer. When the result is available, code can handle it. We don't freeze the whole interaction while the network does its work.

PARISA: But a response arriving later creates coordination work. Loading indicators. Failure messages. Maybe two responses arriving in a different order than the requests.

JULES: Exactly. We gained flexibility and inherited responsibilities.

PARISA: Also, this doesn't mean JavaScript suddenly performs every operation simultaneously. We're describing how waiting for an external result fits into the program. Promises and async/await get their own practical explanation in Episode Six.

JULES: Good boundary. Today we need the reason, not a field trip through the entire event loop.

## What Actually Changed for Order 42?

PARISA: Let's run the status check again. The original page has already loaded. The customer presses Check order.

JULES: JavaScript starts a request for the current status. The server still verifies access, finds the order, and decides which information may be returned.

PARISA: The server did not stop being a server. It still performs the trusted work.

JULES: Right. But this response can contain only the information our interface needs. Our code receives it and updates the status area.

PARISA: If the response is structured data, the browser code decides how that data becomes text and markup. If the response is an HTML fragment, the server may already have done much of that presentation work.

JULES: Yes. AJAX doesn't require returning JSON. Some systems deliberately request rendered HTML fragments. Others request structured data. Both can support targeted page updates.

PARISA: That's important because “the choice is full page or giant JavaScript application” is a false binary. There are smaller steps between them.

JULES: Exactly. We can enhance one interaction on an otherwise server-rendered site.

PARISA: And for accessibility, the existing page doesn't necessarily announce that a quiet patch of text changed. We need an understandable loading state and an appropriate way to announce the result when necessary.

JULES: Also sensible focus behavior. Updating order status isn't a reason to throw keyboard focus back to the top of the document.

PARISA: Nor should a failed refresh erase the last known status and leave an empty box. “Couldn't refresh; last checked at this time” tells the customer what happened.

JULES: That is part of the product behavior we take on when our code manages the interaction.

## Why Ask for Data Without the Page?

JULES: Now the pizza business wants a mobile app.

PARISA: Of course it does. We have successfully delivered one fictional pizza and immediately diversified.

JULES: The mobile app also needs to know that order 42 is in the oven. Does it need our website's header and footer?

PARISA: No. Its interface is different. It might use native controls and its own navigation. Parsing our website's HTML to extract a status would tie it to presentation details.

JULES: We change the website's layout and accidentally break the app.

PARISA: Because the app treated a visual structure as though it were a stable data contract. This is the problem with scraping a page you don't control, too. A cosmetic change may become a data outage.

JULES: A deliberately designed web API can expose the order information with a supported structure. The website and mobile app can both use that information, each presenting it appropriately.

PARISA: We're separating a shared fact from one specific way of displaying the fact.

JULES: Exactly. The status code might be preparing, baking, or out-for-delivery. Each client can map that into its own presentation, provided the meanings are documented.

PARISA: Careful with “code” there. Status code in our business data, like baking, isn't necessarily an HTTP status code. We'll meet the HTTP kind next episode.

JULES: Good catch. Same ordinary word, two layers. Our order status describes the pizza. The HTTP status describes the request's outcome.

PARISA: The pizza can be baking while the request succeeds. We are not assigning the oven a 200 response.

## One Backend, Several Clients

JULES: Add a support dashboard. Staff need to inspect allowed order information. Add an integration that shows a delivery estimate on an approved partner's service. Add a scheduled process generating a daily report.

PARISA: They are all clients in the sense that they request a capability. Client doesn't exclusively mean browser, customer, or person paying an invoice.

JULES: Exactly. A client can be another server process. It can run without a human looking at a screen.

PARISA: The backend is the part handling our server-side responsibilities: business rules, trusted decisions, persistence, and interfaces. It is not necessarily one machine or one program.

JULES: And frontend describes the user-facing application. In a browser application, some frontend code runs on the user's device. With server rendering, producing the user interface can involve server work too.

PARISA: So those labels describe responsibilities more usefully than they describe a neat physical map of where every line runs.

JULES: Yes. For our example, the important split is between consumers of order information and the service responsible for managing it.

PARISA: That shared service can enforce “orders cannot be edited after dispatch” in one trusted place. The website can communicate the rule, but it cannot be the only place enforcing it.

JULES: Otherwise the mobile app, a script, or a manually crafted request could bypass the website's disabled button.

PARISA: The disabled button is helpful feedback. It is not a security checkpoint with a tiny uniform.

## Sharing Logic Does Not Mean Returning Everything

JULES: Wouldn't the easiest API just return the whole database row?

PARISA: Easiest for approximately forty-five seconds. What's in that row?

JULES: Order ID, current status, customer address, internal notes, maybe payment-related references.

PARISA: Then we have several different disclosure decisions disguised as one convenient object. A public tracking view should not inherit every column someone later adds to a database table.

JULES: So we choose the fields intentionally.

PARISA: Yes. An API response is a representation designed for an allowed use. It needn't mirror storage. And different callers can have different permissions.

JULES: The support dashboard may need information the customer status widget doesn't. That doesn't mean every client gets the superset and politely hides it.

PARISA: Once private data reaches the browser, CSS cannot make it secret again. Hiding an element is presentation, not access control.

JULES: This is also another benefit of a boundary. We can reorganize internal storage while keeping the supported response stable.

PARISA: Provided we actually preserve the meaning, not merely the property names. Changing estimatedMinutes from “until arrival” to “until the driver leaves” would be a nasty surprise with perfectly valid JSON.

JULES: And terrible dinner planning.

## Separation Has Costs

PARISA: So far, independent data sounds wonderful. What's the bill?

JULES: Client code now needs to understand the response contract and manage the interaction. A separately deployed frontend and backend may need coordinated changes. A network request introduces waiting and failure possibilities.

PARISA: And a client might be old. The website updates when we deploy it, but a mobile app may remain installed for months without an update.

JULES: Exactly. Changing a field or removing an operation can break consumers you don't update at the same moment. Compatibility becomes an ongoing responsibility.

PARISA: Which is why “we separated the frontend and backend” doesn't mean “the teams never need to talk again.”

JULES: It means they need a reliable agreement about the boundary. The separation can support independent work, but it's not a treaty ending communication.

PARISA: What about performance? Is fetching data always faster than fetching HTML?

JULES: No. A smaller response can help. But you may introduce extra round trips, more client code, or a sequence where data can't be requested until JavaScript loads. An efficient server-rendered page might deliver useful content earlier.

PARISA: And a very chatty API can require six requests to reconstruct what one page response already contained.

JULES: Exactly. Measure the actual interaction. The format alone doesn't settle performance.

PARISA: My favorite architecture benchmark: what happened to the human trying to use it?

## No Separate Domain Required

JULES: There's a common picture of a frontend on one domain and an API on another. That can be an arrangement, but it isn't a requirement.

PARISA: Our website could have ordinary pages at some paths and data endpoints at others, served from the same application and origin.

JULES: Yes. An origin is based on scheme, host, and port; we'll give that proper attention in the CORS episode. For now, different kinds of responses don't demand different companies, repositories, or machines.

PARISA: I can add a route returning data to a PHP application. I don't have to acquire Node to earn the right to send JSON.

JULES: Absolutely. PHP, JavaScript on the server, Python, Ruby, Java, and many other languages can implement web APIs. HTTP doesn't ask what language wrote the response.

PARISA: The two sides agree on the messages. Their internal language choices can differ.

JULES: Which is one reason web APIs are useful for integrations. The partner doesn't have to use our application framework to use our supported interface.

PARISA: Nor should our API documentation require the partner to understand our folder structure. “It's obvious if you read the controller” is not a friendly external contract.

## A Small Before-and-After Story

JULES: Let's compare two versions of one feature, without declaring a winner. In version one, the customer follows a link to check the order. The server returns a complete page with the latest status.

PARISA: Benefits: ordinary navigation, useful HTML, fewer custom interaction responsibilities. It can be robust and straightforward. The trade is that checking again involves another document navigation.

JULES: In version two, the customer is already on the order page. A button starts a request for status data. JavaScript updates a clearly identified status region.

PARISA: Benefits: the surrounding page stays in place, we can tailor feedback, and the same data operation may support another client. Costs: custom loading, error handling, update announcements, and coordination between response data and display.

JULES: Both versions need permission checks and truthful order information. The business problem hasn't changed. The distribution of work has.

PARISA: And there's a hybrid: a server-rendered page that works normally, enhanced with a targeted update when JavaScript is available and appropriate.

JULES: Exactly. Progressive enhancement means building on a useful baseline rather than making the baseline an empty apology.

PARISA: But we still test the actual fallback. Writing “progressive enhancement” in a README doesn't cause a form to submit correctly.

JULES: Our README elves remain on strike.

## What Does the Server Know About the Screen?

PARISA: If we return data, does the server become completely unaware of presentation?

JULES: Not necessarily. Designing useful responses requires understanding consumers' needs. An endpoint may be tailored to a screen or a class of clients. The question is which coupling is intentional.

PARISA: So separation doesn't mean purity. It means we can reason about who owns which decision.

JULES: Exactly. Suppose the website needs a small public order summary, and staff need a detailed internal view. We might design distinct operations instead of making one universal response do everything.

PARISA: And we don't need to force the mobile app to reproduce the website's page layout just because the backend once served that page.

JULES: Right. At the same time, clients shouldn't each reinvent critical business calculations. If the authoritative delivery charge is calculated on the server, an attractive client-side estimate must not become the only amount we trust.

PARISA: Presentation can differ while authoritative rules stay consistent. My app can show a compact price; your site can show a detailed breakdown. Neither gets to charge whatever a stranger typed into a request.

JULES: That's a good example of what “shared backend” buys us when designed carefully.

## When the Extra Interface Isn't Worth It

PARISA: Let's rescue a small website before somebody turns it into eight services. We have a public menu, an opening-hours page, and a basic contact form. Do we need a separately consumed data API?

JULES: Maybe not. If server-rendered pages meet the requirements and no other client needs the data, extra separation may create more work than value.

PARISA: The fact that an API could exist is not a requirement that it should exist.

JULES: Right. Conversely, if a mobile app and several approved integrations genuinely need stable access to order operations, a web API may directly solve that need.

PARISA: Or if one page needs a live-ish status update, a small endpoint can solve that specific need without converting the entire site into a different architecture.

JULES: Exactly. We can choose the smallest useful boundary and expand when the requirements justify it.

PARISA: I like that “why” has an answer besides “the diagram looks modern.”

## The Useful Shift

JULES: Here's the shift this episode is trying to make visible. A traditional web interaction often asks the server for a presentation of information: a document to show.

PARISA: A data-oriented web API lets software ask for information or an operation through a supported contract, so the caller can use the result in its own context.

JULES: That context might be a webpage update, a mobile screen, a support workflow, or another automated system.

PARISA: We wanted smaller updates, shared capabilities, and consumers that didn't all want the same HTML. APIs let us separate those needs where it was useful.

JULES: And we still need the parts that made the older system work: trustworthy server behavior, validation, access checks, understandable responses, and an experience designed for people.

PARISA: My PHP application was already doing meaningful server work. The change wasn't “we discovered backends.” It was “more callers need a stable way to use the work without accepting this particular page.”

JULES: Exactly. That's why the traditional web background helps explain the evolution.

PARISA: Excellent. My experience has survived another rebranding exercise.

JULES: Next episode, we follow one actual request. URL, method, headers, body, response. What is happening underneath fetch?

PARISA: A tour of the delivery vehicle. No forklift license required.

JULES: You really are keeping the loading dock.

PARISA: It's the only piece of infrastructure we haven't overcomplicated yet.

[OUTRO MUSIC]

## Production References

- MDN, Client-server overview: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview
- MDN, AJAX glossary: https://developer.mozilla.org/en-US/docs/Glossary/AJAX
- MDN, Sending form data: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Sending_and_retrieving_form_data
- Editorial note: this is a conceptual evolution of familiar web interactions, not a claim that APIs, machine-readable responses, or distributed systems began with AJAX. HTML fragments remain a valid response choice.
- The form is illustrative and requires a server implementation, authorization, input validation, and application-appropriate CSRF protection before production use.