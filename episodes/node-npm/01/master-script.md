# Episode 1: Node.js — Who Let JavaScript Out of the Browser?

Status: Draft

**CAST**

PARISA — Experienced millennial web developer. Has been writing JavaScript since websites had guestbooks. Suspicious.

JULES — Gen Z developer who entered the industry after JavaScript had escaped containment.


[MUSIC]

PARISA: Okay. Node.

JULES: Node.

PARISA: I know I have it installed.

JULES: Strong start.

PARISA: I know I need it for approximately everything now.

JULES: Also true.

PARISA: And I know it's JavaScript.

JULES: Mmm. Careful.

PARISA: Oh, for fuck's sake.

JULES: We're nine seconds in.

PARISA: Fine. I know it has *something to do with* JavaScript. And every tutorial on Earth eventually tells me to install Node.

JULES: Yes.

PARISA: So what is it?

JULES: It's a JavaScript runtime.

PARISA: Great. Thanks everybody.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*, the show where developers are allowed to ask the questions we're apparently supposed to already know the answers to.

I'm Parisa. I've been making websites since the late '90s, when putting JavaScript on your website meant you wanted a cursor trail and had made some questionable life choices.

JULES: And I'm Jules. I started later, when JavaScript had already escaped the browser and started touching everything.

PARISA: Which brings us to Node.

Because I use Node.

I've installed Node.

I've upgraded Node.

I've complained because something wants a different version of Node.

I have typed `node --version` many times with great authority.

JULES: Very professional.

PARISA: Thank you.

But if you asked me why I need a separate thing to run JavaScript...

I would point vaguely at npm.

JULES: Reasonable.

PARISA: And then leave.

So.

Why does Node exist?

JULES: To answer that, we have to go back to when JavaScript knew its place.

PARISA: Finally. Respect for tradition.


## Who Asked for This?

JULES: What's your original mental model of JavaScript?

PARISA: Easy.

HTML is the content and structure.

CSS makes it not look like absolute shit.

JavaScript makes things happen in the browser.

Then the server has PHP, or Perl, or Java, or whatever horrible decision your company made in 2004 and is still maintaining.

JULES: That's actually a useful starting point.

PARISA: “Actually.”

JULES: I didn't mean—

PARISA: Continue while I write this down for HR.

JULES: In the traditional web model, JavaScript really was primarily associated with the browser.

Your browser downloads some JavaScript, executes it, and that JavaScript can respond to clicks, change the page, validate forms—

PARISA: Badly.

JULES: Sometimes badly.

PARISA: “Your password must contain one number.”

Submit.

Server: “Your password must contain one number.”

Thank you. Excellent use of everyone's time.

JULES: The web was young.

PARISA: The web was drunk.

JULES: But your server-side code was usually something else.

PHP, Ruby, Python, Java—

PARISA: ColdFusion.

JULES: I was trying to keep this family-friendly.

PARISA: You sweet summer child.

JULES: So JavaScript is running in the browser.

Then in 2009, Node.js shows up and says: what if JavaScript could run outside the browser?

PARISA: And here's my first obvious question.

How?

Because JavaScript runs in the browser.

JULES: That's the misconception we need to break.

PARISA: Already?

JULES: Already.

JavaScript is a **programming language**.

Chrome is not JavaScript.

Firefox is not JavaScript.

The browser is an environment where JavaScript can run.

PARISA: Okay.

So what actually runs it?

JULES: A JavaScript engine.


## There's an Engine in My Browser

JULES: Chrome uses a JavaScript engine called **V8**.

PARISA: Like the engine?

JULES: That's intentionally the vibe of the name, yes.

PARISA: Does my JavaScript have horsepower?

JULES: Depends how many React dependencies you've installed.

PARISA: We're not there yet.

JULES: Sorry.

So V8 understands and executes JavaScript.

Chrome embeds V8.

But Chrome also gives JavaScript access to browser-specific capabilities.

PARISA: Like the DOM.

JULES: Exactly.

And this is where things get weird if you've spent your whole career casually calling all of it JavaScript.

`document.querySelector`.

PARISA: JavaScript.

JULES: Nope.

PARISA: Excuse me?

JULES: `document` comes from the browser.

The DOM is a browser API.

JavaScript itself doesn't define the DOM.

PARISA: Wait.

[STING]

### WAIT, THAT'S JUST JAVASCRIPT

PARISA: Except apparently it fucking isn't.

JULES: Correct.

PARISA: `document` isn't JavaScript?

JULES: It's an object the browser makes available to JavaScript.

PARISA: `window`?

JULES: Browser.

PARISA: DOM?

JULES: Browser.

PARISA: `querySelector`?

JULES: DOM API.

PARISA: So JavaScript the *language* doesn't inherently know what a webpage is.

JULES: Exactly.

PARISA: Huh.

Okay.

That's actually important.

JULES: Very.

Because it explains Node.

Think of JavaScript as a chef.

PARISA: We're doing a metaphor.

JULES: We're doing a metaphor.

You put the chef in a restaurant kitchen.

That kitchen has ovens, a walk-in fridge, mixers, fryers—

PARISA: The thing that makes the mozzarella sticks.

JULES: Crucial infrastructure.

The chef can use those things because the kitchen provides them.

Now take the same chef and put them in a different kitchen.

Maybe this one has a smoker, a pizza oven, and—

PARISA: An alarming number of knives.

JULES: Sure.

Same chef.

Different equipment.

PARISA: JavaScript is the chef.

JULES: Yes.

Chrome is one kitchen.

It gives JavaScript browser equipment.

The DOM. `window`. Browser events. Web APIs.

PARISA: And Node is another kitchen.

JULES: Exactly.

PARISA: Different equipment.

JULES: There it is.


## So What Is Node?

PARISA: Okay.

Try “JavaScript runtime” again, except this time I am armed with context.

JULES: Node.js is a runtime environment that lets you execute JavaScript outside a web browser.

It uses the V8 JavaScript engine—

PARISA: Same engine Chrome uses.

JULES: Right.

But instead of surrounding JavaScript with browser APIs, Node provides APIs that make sense when you're running directly on a computer or server.

Things like working with files.

Networking.

Processes.

Environment variables.

Operating-system information.

PARISA: So Node did not add file reading to JavaScript the language.

JULES: Correct.

PARISA: Node gives JavaScript a way to ask the operating system for files.

JULES: Yes.

PARISA: Same chef, new kitchen.

JULES: Same chef, new kitchen.

PARISA: I like this.

JULES: I can tell.

PARISA: I'm going to abuse this metaphor for the next twenty minutes.

JULES: I regret everything.


## What the Hell Is a Runtime?

PARISA: Before we continue.

Runtime.

Because developers use that word like we're all born knowing it.

JULES: Fair.

A runtime is basically the environment where your program actually executes.

PARISA: That's suspiciously simple.

JULES: It gets more complicated if we want it to.

PARISA: We do not.

JULES: Then that's enough for today.

Your JavaScript code is instructions.

Something needs to execute those instructions and provide whatever capabilities are available while the program is running.

That's the runtime environment.

PARISA: So if my JavaScript runs inside Chrome, Chrome and its JavaScript engine plus the APIs it exposes make up the environment I'm working in.

JULES: Broadly, yes.

PARISA: And with Node, I'm still writing JavaScript, but Node is providing the environment.

JULES: Exactly.

PARISA: So Node isn't another language.

JULES: No.

PARISA: Node code is JavaScript.

JULES: Yes.

Although—

PARISA: Don't.

JULES: I was just going to say the available APIs are different.

PARISA: Fine.

That's allowed.


## Let's Do Something Extremely Unimpressive

JULES: Let's actually run Node.

PARISA: Finally.

JULES: Make a file called `hello.js`.

Inside:

[CODE CARD]

```js
console.log("Hello from outside the browser.");
```

Then in your terminal:

[TERMINAL]

```bash
node hello.js
```

And you'll get:

```text
Hello from outside the browser.
```

PARISA: Wow.

JULES: I know.

PARISA: We installed an entire JavaScript runtime to reinvent PHP's `echo`.

JULES: I knew you were going to say that.

PARISA: I could have done this with a batch file.

JULES: But that's not the interesting part.

PARISA: There had better be an interesting part.

JULES: Where's the browser?

PARISA: There isn't one.

...

Oh.

JULES: Yeah.

PARISA: Chrome isn't open.

There's no HTML.

There's no webpage.

The JavaScript file is just... running.

JULES: That's Node.

PARISA: Okay.

That stupid example actually worked.

JULES: The output isn't impressive.

The *location* is.

PARISA: JavaScript has left the building.


## JavaScript Touches the Computer

JULES: Now imagine our JavaScript reads a text file from disk.

PARISA: Which normal JavaScript running on a random webpage can't just freely do.

JULES: And thank God.

PARISA: Yes.

### Please Don't Do This

PARISA: Because if every website could just casually read arbitrary files from my computer, we'd have a somewhat larger cybersecurity industry.

JULES: “Visit our homepage! We have downloaded your tax returns.”

PARISA: “Accept cookies?”

No, but apparently you already have my Social Security number.

JULES: Browsers deliberately sandbox web pages and restrict what they can access.

Node is different because you're intentionally running a program on your machine or server.

So Node can expose filesystem APIs.

PARISA: Which also means Node programs can potentially do more damage.

JULES: Absolutely.

If you run untrusted Node code, it's not magically safe because it's JavaScript.

It can have access to files, environment variables, network connections—

PARISA: Hold that thought for the npm episode.

JULES: Oh, we're going to hold that thought very carefully.


## Why Did Anyone Want Server-Side JavaScript?

PARISA: Okay.

We can execute JavaScript outside a browser.

Cool.

But why was this a big deal?

We already had server languages.

PHP existed.

Python existed.

Ruby existed.

Java very aggressively existed.

JULES: Node wasn't solving “computers cannot run servers.”

PARISA: Important distinction.

JULES: Very.

One attraction was simply being able to use JavaScript on both sides of a web application.

But Node also had an architecture that was particularly interesting for programs doing lots of input and output.

PARISA: Input/output meaning...?

JULES: Files.

Databases.

Network requests.

Things where your program asks for something and then has to wait for it.

PARISA: Ah.

Waiting.

The primary activity of computers.

JULES: And developers.

PARISA: “Build running.”

JULES: “Tests running.”

PARISA: “Docker image building.”

JULES: “CI running.”

PARISA: “Maybe I'll check Slack.”

JULES: Three hours later—

PARISA: Anyway.


## The Restaurant That Stares at Your Burger

JULES: Let's say you're running a restaurant.

PARISA: We're back in food.

JULES: Different metaphor.

PARISA: Same cinematic universe.

JULES: A customer orders a burger.

Now imagine the server takes the order to the kitchen and then stands there.

Just staring at the burger.

PARISA: Intensely.

JULES: Watching it cook.

The server does absolutely nothing else until that burger is finished.

Meanwhile another table wants drinks.

Someone needs a menu.

There's a person at the door.

Doesn't matter.

Burger.

PARISA: This restaurant is going out of business.

JULES: Right.

A more sensible server gives the kitchen the order and handles other work while the burger cooks.

When the burger is ready, they come back to it.

That's roughly the intuition behind **non-blocking I/O**.

PARISA: So Node doesn't want to sit there doing nothing just because a database hasn't answered yet.

JULES: Exactly.

It can initiate that work and handle other things while waiting.

PARISA: And that's the event-driven part?

JULES: We're approaching it.

PARISA: Uh-oh.

JULES: We're not doing the full event loop today.

PARISA: Thank Christ.

JULES: The restaurant metaphor also isn't literally how Node schedules work internally.

PARISA: Metaphor disclaimer.

JULES: Metaphor disclaimer.

The point is that servers spend a lot of time waiting on external operations, and Node was designed around handling that kind of asynchronous I/O efficiently.

PARISA: So Node wasn't just “LOL JavaScript server.”

JULES: No.

There were actual architectural reasons people found it interesting.

PARISA: Okay.

That's actually pretty cool.

[STING]

### OKAY, THAT'S ACTUALLY PRETTY COOL


## One Language Everywhere

PARISA: And then there's the obvious selling point.

Frontend JavaScript.

Backend JavaScript.

JULES: Right.

For web teams, being able to use the same language across more of the stack was appealing.

You could potentially share knowledge and even some code.

PARISA: But I'm going to ruin the marketing pitch.

JULES: Please do.

PARISA: Knowing JavaScript does not make you a backend developer.

JULES: Correct.

PARISA: If you can manipulate the DOM, congratulations.

That has not automatically taught you database design, authentication, server security, caching, HTTP architecture, infrastructure—

JULES: Absolutely.

PARISA: Because I've seen the “full-stack JavaScript means everybody can do everything” thing, and no.

JULES: Using one language reduces one kind of context switching.

It doesn't eliminate the different engineering problems.

PARISA: Exactly.

Same chef.

Different kitchen.

And now we're asking the chef to understand food safety regulations and inventory management.

JULES: You really weren't kidding about abusing the metaphor.

PARISA: I warned you.


## But I'm Not Building a Node Server

PARISA: Here's the part I actually care about.

Because I understand why somebody building a server might use Node.

But I work on frontends.

Why the fuck do I have Node installed?

JULES: There it is.

PARISA: Every modern frontend project:

“Clone repository.”

Fine.

“Install Node.”

Why?

I'm making a website.

JULES: Because modern frontend development started using JavaScript programs to build and manage frontend applications.

PARISA: Say more words.

JULES: Your tooling can itself be written in JavaScript.

Things that transform files.

Run tests.

Check your code.

Start development servers.

Bundle modules.

Compile TypeScript.

Process CSS.

PARISA: Vite.

JULES: Runs using Node.

PARISA: ESLint.

JULES: Node.

PARISA: TypeScript tooling.

JULES: Node.

PARISA: Prettier.

JULES: Node.

PARISA: So when I'm building a React application—

JULES: Your browser application is still ultimately going to run in a browser.

PARISA: But the tools I'm using *while building it* can run in Node.

JULES: Exactly.

PARISA: Ohhhhh.

Okay.

That distinction has been fuzzy for me for years.

JULES: And it's fuzzy for a lot of people because you type one command and seventeen things happen.

PARISA: Usually after `npm install`.

JULES: We're getting there.

Here's another metaphor.

PARISA: Hit me.

JULES: Your website is a car.

PARISA: We've left the restaurant.

JULES: Node doesn't necessarily drive the car.

PARISA: Browser drives the car?

JULES: Let's not examine this metaphor too closely.

PARISA: Fair.

JULES: Node might run the factory that builds the car.

Your tooling runs in Node.

It takes your source files, processes them, checks them, transforms them, packages things up—

and eventually produces the stuff that gets delivered to the browser.

PARISA: So I can depend heavily on Node during development without running Node on my production server.

JULES: Yes.

PARISA: THAT.

That's the thing.

JULES: That's the thing.

PARISA: Because “this project uses Node” can mean wildly different things.

JULES: Exactly.

It might mean:

“Our backend is a Node application.”

Or it might mean:

“Our frontend build tooling runs on Node.”

Those are not the same statement.

PARISA: Okay.

That alone makes this episode worth doing.


## So Why Does Vite Need Node?

PARISA: I'm going to push one step further.

I type:

`npm run dev`.

Then Vite starts.

Then I get a local web address.

What is Node doing there?

JULES: Excellent question.

PARISA: Thank you.

JULES: And we're not answering it yet.

PARISA: You asshole.

JULES: Because there are several layers hiding inside that one command.

PARISA: Of course there are.

JULES: `npm`.

Package scripts.

Vite.

A development server.

Modules.

Dependency resolution—

PARISA: Dependency what now?

JULES: Exactly.

If we unpack all of that now, this becomes a four-hour podcast.

PARISA: And I become violent.

JULES: So that's where this series is going.

Today we needed the bottom layer:

Why can JavaScript run from your terminal at all?

PARISA: Node.

JULES: Right.

Now that JavaScript can run outside the browser, developers can write all kinds of tools in JavaScript.

And those tools can themselves manage JavaScript projects.

PARISA: Which creates the next obvious problem.

Where do all those tools come from?

JULES: Ah.

PARISA: Because I certainly did not personally write Vite.

JULES: No.

PARISA: I downloaded it.

JULES: Yep.

PARISA: Along with...

[ominous music]

...dependencies.

JULES: So many dependencies.


## What Did We Actually Learn?

PARISA: Okay. Before you introduce another noun, recap.

JavaScript is a programming language.

JULES: Yes.

PARISA: Chrome is an environment where JavaScript can run.

JULES: Yes.

PARISA: Chrome uses the V8 JavaScript engine to execute JavaScript.

JULES: Yep.

PARISA: And the browser gives JavaScript browser-specific things like the DOM.

JULES: Right.

PARISA: Node also uses V8, but instead of being a browser, it's a runtime designed to execute JavaScript outside the browser.

JULES: Yes.

PARISA: And Node provides APIs useful for that environment: files, networking, processes, operating-system stuff.

JULES: You've got it.

PARISA: Node can be used to build servers.

JULES: Yep.

PARISA: But that's not why every frontend developer necessarily has Node installed.

JULES: Correct.

PARISA: We also use Node to run development tools.

JULES: Exactly.

PARISA: So my frontend can run in Chrome while the tools that build it run in Node.

JULES: That's it.

PARISA: Huh.

JULES: What?

PARISA: I have been using this shit for years.

JULES: And now you know why.

PARISA: That's irritatingly satisfying.

[MUSIC]

PARISA: Next time, apparently we're talking about npm.

JULES: Yep.

PARISA: The package manager.

JULES: Yes.

PARISA: The thing that downloads tools and their dependencies from the internet.

JULES: Yes.

PARISA: That sounds extremely safe.

JULES: ...next episode.

PARISA: Excellent.

[MUSIC OUT]

PARISA: *Okay, But Why?* is a podcast about understanding the technology we use instead of pretending we already do.

JULES: Next episode: npm — Composer, But Make It JavaScript.

PARISA: And the much more alarming question: what the fuck did `npm install` just put on my computer?

[MUSIC ENDS]
