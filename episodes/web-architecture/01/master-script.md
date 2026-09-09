# Episode 1: What Even Is Web Architecture?

**Series:** Web Architecture • Episode 1 of 14
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — The Diagram Has Weather

[INTRO MUSIC]

PARISA: I have seen the architecture diagram.

JULES: And?

PARISA: There are nineteen boxes, six cylinders, and a cloud. The cloud contains another cloud. Apparently our website has weather.

JULES: Does the diagram explain what happens when somebody orders a pizza?

PARISA: No. But one arrow is purple, so I assume we're profitable.

JULES: Excellent. Enterprise purple.

PARISA: Welcome to *Okay, But Why?*. I'm Parisa.

JULES: I'm Jules. We've talked about TypeScript, the JavaScript toolchain, modern CSS, and React and its framework friends.

PARISA: We have acquired parts. Some of the parts have package managers. Today I would like to know where the parts go.

JULES: That's our Web Architecture series. How an application is arranged, how its parts communicate, and why we chose that arrangement.

PARISA: Including the very important question: could this have been three boxes?

JULES: Sometimes two.

PARISA: Don't flirt with me during the introduction.

## A System Begins With Somebody Trying to Do Something

JULES: Our recurring example is Nervous Robot Pizza Delivery. Fictional restaurant, real architectural headaches.

PARISA: Nervous Robot uses they and them, makes excellent pizza, and would appreciate a delivery system that does not express uncertainty by charging everybody twice.

JULES: The first version serves one neighborhood. Customers need the menu, opening hours, and a way to place an order. Staff need to see accepted orders. That's the starting problem.

PARISA: Not global pizza dominance?

JULES: Not unless somebody has secretly bought seven thousand ovens.

PARISA: I have not checked the expense account.

JULES: Notice we started with people and jobs. An architecture exists to support behavior. If we start by choosing a message broker, we're solving a shopping problem.

PARISA: For software, not customers. My first questions are wonderfully unglamorous. Can people order as guests? How do staff receive orders? What happens when the shop closes? Is online payment required?

JULES: And how much failure can we tolerate? A missing decorative image is annoying. An order the customer thinks was accepted but the kitchen never receives is a different problem.

PARISA: So even before the boxes, we have different promises.

JULES: Exactly. Show information. Accept a request. Record a commitment. Those aren't interchangeable. Our design needs to say when each promise has actually been kept.

PARISA: I can put a green checkmark on a page in approximately four seconds. That doesn't mean anybody is cooking.

JULES: Architecture connects the green checkmark to something real.

## Follow One Order

PARISA: All right. I'm on my phone. I open the pizza website. Walk beside me, no teleporting.

JULES: Your browser asks for the site over the network. Somewhere, a server responds with resources the browser can use: HTML, CSS, perhaps JavaScript, images.

PARISA: HTML gives the document structure and meaning. CSS presents it. JavaScript can add behavior. Those are familiar jobs from earlier series.

JULES: The browser displays a menu. You choose a pizza. That selection might initially live only in browser memory.

PARISA: A draft order. Not a business transaction yet.

JULES: Right. You submit it. The browser sends a request to application code running on a server. That code checks the input, checks the shop's current rules, calculates the price, and records the accepted order.

PARISA: Usually in a database. Which is separate from the HTML and separate from the little cart object in my tab.

JULES: The application sends a response. The browser shows the confirmed order number. Staff can retrieve the order through their own interface.

PARISA: So the path is browser, network, application, database, then an answer back. The staff screen is another client looking at the same underlying business record.

JULES: That's enough of a map to ask useful questions. Which step decided the price? Which step stored the order? Which step could fail without the others failing?

PARISA: And which step is merely showing me an opinion about an order?

JULES: The browser view is a representation. It can be stale. The application and database enforce the business rules together, according to how we've designed them.

PARISA: We will get into that division later. For now, the database is not a magical truth cylinder that prevents me writing terrible application logic.

JULES: Correct. The cylinder cannot save you from every decision outside the cylinder.

[CODE CARD: A request path, not implementation code]
~~~text
Customer browser -> Web application -> Order database
Customer browser <- Confirmation    <- Saved order
Staff browser    -> Web application -> Order database
~~~

PARISA: If you can't see the card, it's just those two browsers talking to the same application, which talks to the order database. There is no secret fourth arrow you need to understand this.

## What Makes That Architecture?

JULES: Architecture is the consequential structure of the system: responsibilities, boundaries, communication, data ownership, and the choices that shape future work.

PARISA: Consequential because changing the button color and changing who owns order data are different-sized afternoons.

JULES: Exactly. Architecture isn't every line of code. But it isn't entirely separate from code either. If every part of your application can directly change every table, that's a structural fact, even if the diagram says otherwise.

PARISA: The code has voted against the diagram.

JULES: Repeatedly, in production.

PARISA: What about folders? People say “architecture” and show me a directory named services.

JULES: Code organization can express architectural boundaries. But a folder doesn't enforce a responsibility by naming it. You need to examine dependencies and behavior.

PARISA: My payments folder imports the orders folder, which imports payments, which directly changes users, and everybody calls a file named helpers. We have categorized the spaghetti by drawer.

JULES: Precisely. Conversely, a modest application can have a clear architecture without a spectacular directory tree.

PARISA: And infrastructure?

JULES: The machinery supporting the software: compute, networking, storage, hosting facilities. Architecture includes decisions about using those things, but drawing a server doesn't explain what the application does.

PARISA: A floor plan and a shopping list of appliances are related documents. Neither tells me whether the kitchen accepts orders after closing.

JULES: That's where the metaphor stops being literal. Software responsibilities can share one machine or span several. A box on our logical diagram doesn't necessarily mean a physical computer.

PARISA: Thank you. Otherwise people leave with the impression that every rectangle requires a monthly subscription.

## A Framework Is a Set of Choices, Not the Entire Answer

PARISA: Suppose someone asks our architecture and I say React.

JULES: You've told me something about the user interface. You haven't told me where orders are stored, how requests are authorized, or what happens if payment times out.

PARISA: Even “a full-stack framework” doesn't answer those things by itself.

JULES: It can provide conventions and mechanisms. Routing, rendering, server handlers, build output. You still choose how to use them and what promises your application makes.

PARISA: We covered tooling already. The build process can turn source files into browser assets. But that process isn't necessarily running whenever somebody loads the page.

JULES: Great distinction. There is the system that builds and deploys the application, and the system handling visitors once it's deployed. They overlap, but they aren't the same path.

PARISA: An npm package can participate in the build, run in the server application, or become code shipped to the browser. The package manager doesn't determine the destination.

JULES: Which is why “we use JavaScript” doesn't locate the work either. JavaScript can run in several environments. The environment gives it capabilities.

PARISA: My browser cannot read the server's private environment variables just because both sides use the same language.

JULES: Unless you accidentally include their values in the browser output. Then you have sent them to the customer, and the language was never the security boundary.

PARISA: A recurring theme for next episode: where code runs matters more than the extension on the file.

## Two Designs That Both Deliver Pizza

JULES: Let's compare reasonable options. First: a server-rendered application. The server prepares menu pages, accepts forms, writes orders, and returns HTML.

PARISA: Something I could have built with PHP years ago, and could still build sensibly. One main application, one database, a browser doing browser things.

JULES: Second: a richer browser application. It downloads JavaScript, manages a more elaborate interface, and asks a server API for data and order operations.

PARISA: Both still need a trustworthy place to accept the order. Moving the interface into the browser didn't remove the backend.

JULES: And either can be accessible, secure, or horribly executed. A label like SPA doesn't decide quality.

PARISA: The first might suit a simple menu and checkout. The second might suit a staff dispatch screen with lots of coordinated interactions.

JULES: Or the same system could use both, on different routes. We don't need to pick a religion for the entire domain name.

PARISA: That is going to upset the conference merchandise industry.

JULES: We'll survive. What matters is whether the choice supports the interaction and the team maintaining it.

PARISA: Team is architecture now?

JULES: Always was. If a system needs specialist operational knowledge that nobody on the team has, that is a constraint. It doesn't become irrelevant because the diagram is elegant.

PARISA: Two developers, one kitchen, a sensible budget. Those facts should appear in the decision before “a company with fifty platform engineers does this.”

## The Unhappy Path Is Still the Path

PARISA: Let's break our lovely arrow. My phone sends the order, but I lose reception before the confirmation returns.

JULES: The server may have saved it. Or it may never have received it. From your phone's point of view, the outcome is uncertain.

PARISA: So showing “order failed” could be a lie.

JULES: Yes. And blindly sending the order again could create a duplicate. Later we'll discuss identifiers and retries that make repeated requests safe.

PARISA: For now, the architecture question is where we can find the answer. A saved order reference, some way to check its status, and a user message that admits uncertainty.

JULES: Exactly. Not “we definitely failed” when all we know is “we didn't receive an answer.”

PARISA: Another break: email is down.

JULES: Does accepting the order depend on email succeeding? Probably it shouldn't, if staff have the order in the system and the customer has a confirmation page.

PARISA: Then email can be separate follow-up work. We will need to remember to do it, but dinner shouldn't wait while an email provider contemplates its existence.

JULES: That's a boundary justified by a failure scenario. We haven't installed a queue yet. We've identified a responsibility that may belong outside the immediate response.

PARISA: I like that ordering. Explain the problem before opening the software catalog.

JULES: Third break: somebody edits the price in their browser.

PARISA: The server calculates the real price. The customer can choose what they want, not what reality costs.

JULES: That's a trust boundary. Data crosses from a place we don't control into a place responsible for enforcing our rules.

PARISA: Fourth break: the ordering interface requires dragging tiny toppings with a mouse.

JULES: Then some customers cannot operate it. Accessibility affects the supported interaction, not just a final checklist. We need keyboard-operable controls and an understandable path through the order.

PARISA: Our architecture has successfully delivered a page to somebody we prevented from ordering. Technically available, practically useless.

## What Does Simple Actually Mean?

JULES: Our series principle is to start with the simplest architecture that solves the actual problem, and add complexity for an explainable reason.

PARISA: Simple doesn't mean “ignore passwords, backups, errors, and everybody using a screen reader.”

JULES: Right. That's incomplete. Simple means fewer unnecessary moving parts while meeting the requirements you actually have.

PARISA: Sometimes a managed database makes the whole system simpler even though it adds a service, because we don't need to operate database hardware ourselves.

JULES: Sometimes adding a dependency makes it harder because now three teams and two networks must agree for one button to work. We judge the overall burden, not just the number of boxes.

PARISA: And sometimes the simple answer is boring enough to make people nervous.

JULES: “What if we grow?” is reasonable. “What if we become every pizza company simultaneously next Tuesday?” is less useful.

PARISA: We can design clear internal boundaries and collect evidence without building imaginary scale in advance.

JULES: Exactly. A reversible choice doesn't need the same ceremony as an expensive data migration. Save attention for decisions that are hard to undo.

PARISA: Like publicly promising thirty-second delivery.

JULES: That's a physics migration.

## Read a Diagram Without Worshipping It

PARISA: Suppose a listener gets handed those nineteen boxes tomorrow. What should they ask?

JULES: Pick one user action. “Place an order.” Trace only that action. What receives it? What validates it? What data changes? What response returns?

PARISA: Then label the arrows. A direct function call isn't the same as a network request. An asynchronous message isn't an immediate answer.

JULES: Ask which box owns each important fact. If two boxes disagree about whether an order is paid, which one wins, and how do the others catch up?

PARISA: Ask what the boxes represent. Modules? Running processes? Entire third-party companies? I have seen all three on the same slide with identical rectangles.

JULES: Ask what happens when each arrow fails. And ask who operates each piece. Some boxes are managed services; others are a team member's weekend disappearing.

PARISA: Finally, ask what the diagram leaves out. A diagram is a view, not a complete replica of the universe.

JULES: You might need one view of responsibilities, another of deployment, another of data flow. Trying to show all of them at once can make the diagram less useful.

PARISA: So the goal isn't memorizing symbols. It's learning enough about the system to predict behavior.

## The Napkin Review

JULES: Before we commit to our napkin, let's test whether the picture helps us answer a change request. Nervous Robot wants customers to schedule a delivery for tomorrow.

PARISA: Ah. A request that sounds like one extra field and is secretly several meetings.

JULES: Where do you start?

PARISA: With the meaning. Are tomorrow's hours known? Are prices locked when ordered? Can we reserve kitchen capacity? Can the customer cancel? When does payment happen?

JULES: None of those is “which date-picker library.”

PARISA: The date picker matters, including whether people can operate it. But it represents a policy we need to define first. A beautiful calendar can't decide whether tomorrow's kitchen is open.

JULES: So the architecture map tells us which responsibilities might change. Browser interaction, server acceptance rules, durable order data, staff views, perhaps payment timing.

PARISA: Exactly. It also tells us where not to put the rule. The browser shouldn't independently decide that every future date is available because a calendar can display it.

JULES: What would make this change harder?

PARISA: If pricing logic is duplicated in three places. If the database only stores a boolean called done. If the staff screen assumes every order is for the next twenty minutes. Those are structural constraints hiding in code.

JULES: That's a useful definition of architecture in practice: the existing design makes some changes easy and others expensive.

PARISA: And we don't fix that by anticipating every imaginable feature. We make the current concepts clear enough to evolve. An explicit fulfillment time is easier to reason about than a string called miscellaneous that everyone interprets differently.

JULES: Would you introduce a scheduling service immediately?

PARISA: No. First understand and implement the responsibility within the application. Separate deployment needs a separate reason. A new business concept isn't automatically a new server.

JULES: Let's try another requirement. Customers should be able to download an invoice.

PARISA: Who may download which invoice? Is it generated from the accepted historical order, or today's menu? How long should it remain available? Can generating it delay ordering?

JULES: Again, the questions locate ownership, privacy, durability, and workload.

PARISA: Yes. The diagram is useful because it gives those questions somewhere to land. If all I can say is “React talks to cloud,” I haven't explained enough.

## A Decision Is Not a Prediction

JULES: I worry that choosing a small design means we'll be blamed later if we need something larger.

PARISA: Only if we promised the small design would solve every future problem. We can state the assumptions and revisit them. “One shop, two developers, modest traffic” is a context, not a vow of eternal smallness.

JULES: So we record why the choice fits now and what evidence would challenge it.

PARISA: Exactly. If the application becomes slow, we measure what is slow. If teams block one another, we examine ownership and deployment. Different evidence leads to different changes.

JULES: It sounds less exciting than designing for hypothetical global domination.

PARISA: It is more exciting when the hypothetical global system's bill arrives before the first customer.

JULES: Fair. What do we do with uncertainty we can't resolve yet?

PARISA: Name it. Maybe we don't know peak demand. Build a modest load test or measure early traffic. Maybe we don't know whether staff need a live map. Observe their workflow. Don't replace missing information with an expensive assumption.

JULES: That makes experiments part of architecture.

PARISA: Small experiments can be extremely useful. They should answer a question. “Can this order query meet our needs with representative data?” is a question. “Let's rewrite everything to learn what happens” is a lifestyle choice.

JULES: And the answer can be that the simpler design is sufficient.

PARISA: That's a successful experiment. We are not disappointed when evidence saves us work.

## The Human Who Runs It

JULES: One more box people forget: the operator. Someone must know when orders are stuck.

PARISA: Yes. The system needs a way to reveal problems and support recovery. Who checks failed receipt work? Who can correct a mistaken cancellation? What information helps them do that safely?

JULES: That could be a modest staff view and clear logs, not necessarily a gigantic operations platform.

PARISA: But “we'll look in the database manually” shouldn't become the only routine workflow by accident. Direct data edits bypass the rules the application normally enforces.

JULES: So administrative capabilities deserve deliberate design too.

PARISA: Especially because they are powerful. Clear permissions, clear action labels, and enough history to understand consequential changes. The customer isn't the only person using the architecture.

JULES: Our napkin now has a note beside it: who notices, who responds, and how we recover.

PARISA: Good. Still no purple arrow required.

## The First Architecture Decision

JULES: Let's make our first decision out loud. For our fictional small pizza shop, start with one web application, clear internal responsibilities, and one primary order database. Use ordinary pages and forms where they satisfy the experience.

PARISA: Keep prices and order acceptance on the server. Give staff an authenticated view. Make the interface usable with a keyboard. Make failures understandable. Have a recovery plan for the data.

JULES: And write down why. Small team, straightforward workflow, one business, no evidence yet that independently deployed services solve a real problem.

PARISA: Also write down what would make us revisit it. Maybe dispatch becomes a complex interactive application. Maybe measured traffic overwhelms a specific operation. Maybe a team needs a genuinely independent release boundary.

JULES: Those are triggers for investigation, not automatic instructions to buy microservices.

PARISA: Our diagram fits on a napkin. It is not unserious because the napkin lacks a vendor logo.

JULES: Can you explain where the order goes and what success means?

PARISA: Yes.

JULES: Can you identify its biggest risks?

PARISA: Yes. Also olives, but that's a separate meeting.

JULES: Then we have the beginning of an architecture.

## Closing — Questions Before Boxes

PARISA: Architecture is how the pieces cooperate to do something useful, under constraints. It includes where work happens, who owns information, and how failure behaves.

JULES: The framework, folder tree, and hosting platform contribute to that story. None tells the whole story alone.

PARISA: This series will move through the browser and server, HTTP, rendering, APIs, identity, data, monoliths, services, caching, and scaling. Then we'll design a system with reasons instead of collecting nouns.

JULES: Next time: client versus server. Same JavaScript, very different access privileges.

PARISA: And eventually, Cybersecurity follows this series. We will raise relevant security decisions here, because a trustworthy architecture cannot postpone them, but the dedicated series is its own conversation.

JULES: For today, take one site you know and trace one action. Name where the work runs, where the result is stored, and what could fail.

PARISA: If you get stuck, that's a useful question, not a personal deficiency.

JULES: Ohhh. That's why the boxes exist.

PARISA: Some of them. The purple arrow remains under investigation.

[OUTRO MUSIC]

## Production Notes

- Finished dialogue; music and visual cards are optional and not spoken.
- Introduces Nervous Robot Pizza Delivery as a fictional series example, not prior-show canon or a real deployed product.
- Continuity: builds on the four preceding series without resetting Parisa's web-development knowledge. No specialist guests or new personal history.
- The baseline is an example under stated constraints, not a universal architecture prescription.
- Read-time estimates must count spoken dialogue only; final runtime requires a recorded read.
