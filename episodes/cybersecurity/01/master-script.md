# Episode 1: Cybersecurity — What Are We Actually Protecting?

Status: Draft

**CAST**

PARISA — Experienced millennial web developer. Has spent years building things on the public internet and therefore has a healthy respect for what users, browsers, servers, and other developers can accidentally do.

JULES — Gen Z developer who entered the industry with package registries, cloud dashboards, MFA prompts, and security warnings already lurking everywhere.


[MUSIC]

PARISA: Okay. Cybersecurity.

JULES: Cybersecurity.

PARISA: I have a Google cybersecurity certificate.

JULES: You do.

PARISA: I know what the CIA triad is.

JULES: Great.

PARISA: I have opinions about browser permissions.

JULES: Strong opinions.

PARISA: I have yelled at API keys.

JULES: Usually because they were in places API keys should not be.

PARISA: Correct.

JULES: So we're starting from a pretty good place.

PARISA: And yet if somebody says, "What is cybersecurity?" my brain immediately produces a hooded stock-photo man typing green nonsense in a dark room.

JULES: Ah yes. The hacker uniform.

PARISA: Apparently cybercrime is very cold.

JULES: Lots of hoodies.

PARISA: So let's start annoyingly basic.

What the hell are we actually securing?

JULES: Information, systems, services, people—

PARISA: That's four things already.

JULES: Buildings.

PARISA: Five.

JULES: Devices.

PARISA: Six.

JULES: Identities.

PARISA: Jules.

JULES: Supply chains.

PARISA: Stop making the noun bigger.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*, the show where developers are allowed to ask the questions we're apparently supposed to already know.

I'm Parisa. I've been putting things on the public internet since the public internet was substantially weirder.

JULES: And I'm Jules. I started developing after websites had stopped putting visitor counters under every page but had started installing four hundred dependencies to render a button.

PARISA: We'll be discussing your crimes later in this series.

JULES: Fair.

PARISA: This time we're doing cybersecurity.

Not "here are twelve scary hacker words."

Not "memorize this acronym because CompTIA might ask you."

I want to know what security people are actually trying to accomplish.

JULES: Good. Because if you understand that, most of the acronyms eventually have somewhere to live.

PARISA: Excellent.

Let us build the acronym habitat.


## Who Asked for This?

JULES: Imagine you build the world's simplest website.

PARISA: Beautiful. HTML file. Maybe a little CSS. No build step. Nature is healing.

JULES: It has one page that says, "Parisa's Sandwich Reviews."

PARISA: Security-critical infrastructure.

JULES: Obviously.

At first, it's just a file on your laptop.

Who can attack it?

PARISA: Me, mostly.

JULES: Right. Then you put it on a web server.

PARISA: Now strangers can request it.

JULES: And immediately you have security questions.

Can somebody change the reviews?

Can somebody take the server offline?

Can somebody read files they aren't supposed to see?

Can somebody convince the server they're you?

Can somebody use your server to attack somebody else?

PARISA: Can somebody replace my five-star review of a veggie Reuben with slander?

JULES: That's actually an integrity problem.

PARISA: We're twenty seconds into the sandwich and we've found the CIA triad.

JULES: Security exists because useful computer systems are almost never isolated.

They accept input. They communicate. They store information. They give different people different abilities. They depend on other systems. And they fail.

PARISA: So cybersecurity isn't primarily "stop hackers."

JULES: No. That's part of it, but it's too narrow.

Security is about protecting systems and information against things that would cause unacceptable harm.

And "things" includes malicious attackers, mistakes, broken hardware, bad configuration, lost laptops, compromised vendors, fires, floods—

PARISA: Dave deleting the production database.

JULES: Dave is absolutely in the threat model.

PARISA: Poor Dave.

JULES: Security is full of Daves.


## Secure Does Not Mean Unhackable

PARISA: Let me get one thing out of the way early.

Can anything be completely secure?

JULES: Not in the useful, absolute sense people usually mean.

PARISA: Thank you.

Because "make it secure" always feels like "make it good."

JULES: Exactly. Security is not a binary property where the switch says SECURE or HACKED.

You can reduce risk.

You can make attacks harder.

You can limit what an attacker can reach.

You can detect bad behavior faster.

You can recover better.

But every useful system has some amount of risk.

PARISA: Even if I unplug it from the internet.

JULES: Then you've changed the risks.

Maybe nobody can attack it remotely. But now somebody can steal the laptop. Or the drive can fail. Or you can forget the password.

PARISA: Or I can put it in a closet labeled "DO NOT TOUCH" and discover the most powerful force in IT.

JULES: Curiosity?

PARISA: Facilities.

JULES: So the useful question isn't usually, "Is this secure?"

It's, "Secure against what, for whom, at what cost, and how much risk are we willing to accept?"

PARISA: That's much less sexy than the hoodie guy.

JULES: Cybersecurity is frequently paperwork wearing tactical branding.


## What Are We Protecting?

JULES: One of the oldest useful security models is the **CIA triad**.

PARISA: And before anybody gets excited, not that CIA.

JULES: Confidentiality, integrity, and availability.

PARISA: Three properties we want information and systems to have.

JULES: Exactly.

Not every security problem fits perfectly into only one of them, but they're a really good way to ask, "What kind of harm are we worried about?"


## Confidentiality: You Don't Get to See That

JULES: **Confidentiality** means information is accessible only to people or systems that are authorized to see it.

PARISA: Passwords.

JULES: Yes.

PARISA: Medical records.

JULES: Yep.

PARISA: Private messages.

JULES: Yep.

PARISA: My `secrets.env` file.

JULES: We will be having a very long talk about your `secrets.env` file.

PARISA: Not mine personally. A hypothetical developer who definitely has never committed anything embarrassing.

JULES: Of course.

Confidentiality is why we have access controls, encryption, permissions, authentication, data classification—

PARISA: And why a public GitHub repository is not a secrets manager.

JULES: Correct.

PARISA: So if an attacker steals a customer database, that's obviously a confidentiality failure.

JULES: Right.

But confidentiality failures don't require a malicious attacker.

If you accidentally configure cloud storage so the whole internet can read it, the information is still exposed.

PARISA: No hoodie necessary.

JULES: The cloud bucket has no idea whether the person downloading the file is evil. It just knows you said yes.

PARISA: That's upsettingly fair.


## Integrity: Don't Fuck With It

JULES: **Integrity** means the data or system remains accurate, complete, and trustworthy.

PARISA: So somebody reading my sandwich review is confidentiality.

Somebody changing it is integrity.

JULES: Exactly.

Let's say your bank balance says one thousand dollars.

PARISA: Optimistic, but continue.

JULES: If I can see your balance when I shouldn't, confidentiality is broken.

If I can change it to ten thousand dollars—

PARISA: Let's explore this vulnerability further.

JULES: —integrity is broken.

PARISA: And integrity matters even if the data isn't secret.

JULES: Very much.

The software package you download from a public website isn't confidential. Everybody is allowed to have it.

But you care enormously whether somebody modified it and slipped malware inside.

PARISA: Oh.

That's a nice distinction.

Public does not mean integrity doesn't matter.

JULES: Exactly.

Security isn't just hiding things.

PARISA: Which is probably why "I didn't expose any private data" is not a complete security review.

JULES: Correct.


## Availability: Please Continue Existing

JULES: Then there's **availability**.

Authorized users should be able to access the system or information when they need it.

PARISA: Server down.

JULES: Availability problem.

PARISA: Ransomware encrypted all the files.

JULES: Among other things, availability problem.

PARISA: Somebody floods the site with traffic until it falls over.

JULES: Denial of service. Availability.

PARISA: A deploy goes horribly wrong Friday at 4:57.

JULES: Self-inflicted availability incident.

PARISA: Security would like developers to stop attacking production.

JULES: Security would appreciate it.

PARISA: This is the one I think developers sometimes forget is security.

Downtime feels like operations.

JULES: And this is why security gets broader than "hackers."

If a hospital system is unavailable at the moment someone needs a medication record, it doesn't matter that nobody stole the data. The system still failed an important security property.

PARISA: So confidentiality, integrity, and availability can conflict.

JULES: Constantly.

PARISA: If I make a system maximally confidential by turning it off and burying the hard drive—

JULES: Availability has concerns.

PARISA: If I make everything maximally available by putting it on a public unauthenticated endpoint—

JULES: Confidentiality has left the meeting.

PARISA: Security is tradeoffs already.

JULES: Security is tradeoffs almost all the way down.


## Threat, Vulnerability, Exploit, Risk: Four Words People Throw Around

PARISA: Okay. Security vocabulary time.

Threat. Vulnerability. Exploit. Risk.

I know these words individually. People use them like they're interchangeable.

JULES: They aren't.

PARISA: Give me the sandwich version.

JULES: Naturally.

You own a sandwich shop.

Your back door has a broken lock.

PARISA: **Vulnerability.**

JULES: Exactly. A weakness that could be used or could contribute to harm.

There's a thief in the neighborhood who wants expensive vegan cheese.

PARISA: **Threat.**

JULES: More precisely, the thief is a threat actor, and theft is a threat.

A **threat** is something with the potential to cause harm.

PARISA: Then the thief uses the broken lock to get inside.

JULES: That's **exploitation** of the vulnerability.

An **exploit** is a technique or code that takes advantage of a vulnerability.

PARISA: And risk?

JULES: **Risk** is about the possibility and impact of the bad outcome.

How likely is it that somebody will use that broken lock?

How bad would it be if they did?

PARISA: So a vulnerability can exist without creating the same amount of risk everywhere.

JULES: Exactly.

A critical vulnerability in a server directly exposed to the internet might be urgent.

The same vulnerable software on an isolated test machine with no sensitive data and no route to anything else might present much less immediate risk.

PARISA: Still fix it.

JULES: Probably, yes.

But security teams prioritize because nobody has infinite time, money, or people.

PARISA: This feels important for developers because vulnerability scanners love producing giant lists that make you feel like your project has contracted every disease known to npm.

JULES: Right. A finding isn't the whole risk assessment.

You need context.

What is vulnerable?

Is it actually reachable?

Is there an exploit?

What could an attacker gain?

What protections already exist?

PARISA: So "CVSS ten, everyone panic" is sometimes justified, but we still ask questions.

JULES: Always ask questions.


## Your Attack Surface Is Everything You Let the World Touch

JULES: Another useful concept is **attack surface**.

PARISA: The amount of stuff available to attack.

JULES: Pretty much.

Every exposed service, API endpoint, login form, dependency, device, account, admin panel, browser extension permission, open port—

PARISA: Employee.

JULES: Absolutely.

Humans are part of the attack surface.

PARISA: Rude but fair.

JULES: If an attacker can interact with it, influence it, impersonate it, send input to it, or abuse the trust you've given it, it may be part of your attack surface.

PARISA: So reducing attack surface means giving attackers fewer doors.

JULES: That's the idea.

If your application doesn't need to expose a database directly to the internet—

PARISA: Don't.

JULES: If your Chrome extension doesn't need permission to read every website—

PARISA: Don't ask for it.

JULES: If an employee doesn't need production administrator access—

PARISA: Don't give it to them.

JULES: Now you're doing security architecture.

PARISA: Look at me.

I have become the hoodie.


## Least Privilege: Stop Giving Everyone the Master Key

JULES: What you just described is **least privilege**.

A person, process, or system should get only the access it needs to do its job, for only as long as it needs it.

PARISA: This is one of those ideas that sounds painfully obvious until you look at actual software permissions.

JULES: Correct.

PARISA: "Why does this flashlight app need contacts, microphone, location, storage, camera, and the blood type of my firstborn?"

JULES: Least privilege says: if the feature doesn't require the permission, don't grant it.

PARISA: This applies to code too.

JULES: Definitely.

Suppose your application connects to a database using an account that can create users, drop tables, change permissions, read every database, and launch a small moon.

PARISA: But the application only needs to read and update customer orders.

JULES: Then you've given it unnecessary privilege.

If the app gets compromised, the attacker inherits those privileges.

PARISA: Ah.

Least privilege doesn't only prevent legitimate users from doing dumb things.

It limits the blast radius when something goes wrong.

JULES: Exactly.

That phrase—**blast radius**—comes up a lot.

Assume something eventually fails or gets compromised.

How far can the damage spread?

PARISA: This is why minimal browser-extension permissions make me happy.

JULES: Yep. Less permission is less power available to abuse.

Whether the abuse comes from malicious code, a dependency, a compromised account, or an ordinary bug.


## Security Controls: Fine, How Do We Actually Protect Anything?

PARISA: Okay. We know what we're protecting.

We know threats exist.

What do we actually *do*?

JULES: We add **security controls**.

PARISA: Which means?

JULES: Safeguards or countermeasures used to reduce security risk.

A firewall is a control.

MFA is a control.

A security policy is a control.

A locked server-room door is a control.

Backups are controls.

Security training is a control.

PARISA: That is an aggressively broad category.

JULES: It is.

Security+ splits controls into categories like technical, managerial, operational, and physical.

PARISA: Let me try.

Firewall: technical.

JULES: Yep.

PARISA: Policy saying production changes need approval: managerial?

JULES: Right.

PARISA: A person reviewing logs every morning: operational.

JULES: Yep.

PARISA: Locked door.

JULES: Physical.

PARISA: Bollard.

JULES: Physical.

PARISA: Security+ really likes bollards, doesn't it?

JULES: CompTIA wants you to know that cybersecurity occasionally involves stopping a truck.

PARISA: Finally, frontend development prepared me for nothing.

JULES: Controls can also be described by what they do.

Preventive controls try to stop something.

Detective controls help you notice it.

Corrective controls help fix the situation after it happens.

Deterrent controls discourage it.

Directive controls tell people what they should do.

Compensating controls provide an alternative when the preferred control isn't practical.

PARISA: So a single security problem usually doesn't get one magical security product.

JULES: Right.

And that leads to one of the biggest ideas in this entire series.


## Defense in Depth: Because One Thing Will Eventually Fail

JULES: **Defense in depth** means using multiple layers of security so one failed control doesn't automatically mean total compromise.

PARISA: Medieval castle.

JULES: Great metaphor.

PARISA: Moat.

Wall.

Gate.

Guards.

Inner wall.

Tiny angry goose.

JULES: The goose is a compensating control.

PARISA: Excellent.

JULES: Imagine protecting an account.

You require a password.

PARISA: Layer one.

JULES: The password is stored as a strong salted hash.

PARISA: So if the password database is stolen, the attacker doesn't immediately receive the actual passwords.

JULES: Another layer.

You support MFA.

PARISA: So a stolen password might not be enough.

JULES: You rate-limit login attempts.

PARISA: Makes brute-force attacks harder.

JULES: You alert on suspicious logins.

PARISA: Detective control.

JULES: You let the user revoke sessions.

PARISA: Corrective-ish.

JULES: Exactly.

No individual layer makes the account invincible.

Together they make compromise harder, more detectable, and easier to contain.

PARISA: Which is a much healthier security model than "we use Cloudflare, we're fine."

JULES: Or "React escapes strings, we're fine."

PARISA: Or "our database isn't linked anywhere."

JULES: Please don't—

[STING]

### PLEASE DON'T DO THIS

PARISA: Ah. First one of the series.

JULES: **Security through obscurity is not a primary security control.**

PARISA: Translation: "Nobody knows this admin URL" is not authentication.

JULES: Correct.

PARISA: "The API isn't documented" is not authorization.

JULES: Correct.

PARISA: "The database name is weird."

JULES: Please stop helping.

PARISA: `production_real_FINAL_2_secret`.

JULES: Attackers have search tools, Parisa.

PARISA: Fine.


## Assume Breach Without Becoming Paranoid

PARISA: There's something I want to separate.

Security people sometimes say **assume breach**.

Does that mean "act like the attackers are already inside"?

JULES: In a useful sense, yes.

Not "panic constantly."

It means don't design the entire system around the assumption that your outermost defense will always work.

PARISA: So if somebody gets past the login, that should not mean they can do literally anything.

JULES: Right.

If one employee account is compromised, that shouldn't automatically expose every company system.

If one container is compromised, that shouldn't automatically mean the attacker owns the whole cluster.

If one dependency is malicious, ideally it doesn't have unlimited access to secrets and the filesystem.

PARISA: This is where least privilege, segmentation, logging, and defense in depth all start holding hands.

JULES: Exactly.

And later we'll get into **Zero Trust**, which formalizes a lot of the "don't grant trust merely because something is inside the network" thinking.

PARISA: Later.

JULES: Later.

PARISA: I refuse to learn an architecture slogan before I've had lunch.


## The Developer Version of Security

PARISA: Bring this back to somebody building a web application.

What's my security job?

Because I am not running the SOC.

JULES: Your job isn't to personally do every security function.

But developers make security decisions constantly.

PARISA: Give me examples.

JULES: How do you validate input?

Where do secrets live?

What permissions does the application request?

How do you authenticate users?

How do you authorize actions?

What gets logged?

What data goes to third parties?

What happens when a dependency is vulnerable?

What error messages do you expose?

How do sessions expire?

How do you protect sensitive data?

What happens if an API request is modified?

PARISA: Okay, yes.

That's just building software.

JULES: Exactly.

Secure development isn't usually a separate magical activity performed later by people in black T-shirts.

Security properties emerge from ordinary engineering decisions.

PARISA: Or fail to emerge.

JULES: Often that.

PARISA: Which probably explains why "we'll add security at the end" goes badly.

JULES: Imagine building a house and saying, "We'll add structural integrity during QA."

PARISA: That's a metaphor I don't even need explained.

JULES: Security teams can test, advise, monitor, build controls, respond to incidents, and catch problems.

But they can't retroactively make every design decision safe.

PARISA: So developers don't have to become pentesters.

JULES: No.

PARISA: But we do need to understand how the things we build can be abused.

JULES: Exactly.

That sentence is basically the reason this series exists.


## "But My App Isn't Important"

PARISA: Okay, here's a classic.

"My app isn't important. Why would anybody attack it?"

JULES: Because attackers don't necessarily care about *you*.

PARISA: Comforting.

JULES: Your application might have user accounts.

It might have payment data.

It might have API credentials.

It might have compute resources.

It might have access to another system.

It might be useful for sending spam, hosting malware, mining cryptocurrency, or joining a botnet.

PARISA: Or it might just be scanned automatically because it exists.

JULES: Exactly.

A huge amount of malicious activity is automated.

Attackers scan ranges of internet addresses, look for known vulnerable software, leaked credentials, exposed services, default passwords—

PARISA: So the attacker may not have selected `parisasandwichreviews.com` after months of reconnaissance.

JULES: Your beautiful sandwich empire might just answer on a port their scanner checked.

PARISA: I feel both safer and less special.

JULES: You're welcome.


## Risk Is Not Fear

PARISA: This is where security can become emotionally weird, though.

Once you understand the number of things that can go wrong, everything starts sounding dangerous.

JULES: That's why **risk management** matters.

Security isn't "be afraid of every possible threat."

It's making reasonable decisions based on likelihood, impact, cost, and context.

PARISA: Give me an absurd example.

JULES: We could protect your sandwich-review admin account by requiring you to appear in person at a guarded data center, provide three forms of ID, scan both retinas, unlock a hardware token, and get written approval from two executives.

PARISA: Extremely secure.

JULES: Also you will never update the website again.

PARISA: Availability issue.

JULES: And usability.

And cost.

And probably employment.

PARISA: So the goal is appropriate security.

JULES: Right.

A bank, a hospital, a personal blog, a nuclear facility, and a local restaurant menu do not all have the same risk profile.

PARISA: Although the restaurant menu should still not run WordPress 3.2 with `admin/admin`.

JULES: Please don't do this.

PARISA: We already used the sting.

JULES: I know. I'm conserving the budget.


## A Tiny Threat Model

JULES: Let's do a tiny version of something we'll eventually spend a whole episode on: **threat modeling**.

PARISA: Sounds ominous.

JULES: It's mostly structured pessimism.

Take your sandwich review site.

What do we care about?

PARISA: The published reviews remain accurate.

JULES: Integrity.

PARISA: My admin credentials aren't exposed.

JULES: Confidentiality.

PARISA: The site stays online.

JULES: Availability.

Who or what might cause problems?

PARISA: Random attacker.

Compromised dependency.

Me making a mistake.

Hosting provider outage.

JULES: Good.

Where can they interact with the system?

PARISA: Login form.

Public pages.

Admin interface.

Hosting account.

GitHub repository.

Dependencies.

Maybe a contact form.

JULES: Attack surface.

What controls reduce the risk?

PARISA: MFA on GitHub and hosting.

Strong authentication for the admin.

Least privilege.

Updates.

Backups.

Dependency review.

Logging.

Don't expose things I don't need.

JULES: Congratulations. You just did the beginning of security engineering.

PARISA: I didn't even buy a hoodie.


## Okay, That's Actually Pretty Cool

[STING]

### OKAY, THAT'S ACTUALLY PRETTY COOL

PARISA: I think my click is this:

Cybersecurity isn't one specialized layer sitting outside software development.

It's a way of asking what can go wrong with a system, what matters if it does, and what we're going to do about it.

JULES: Yes.

PARISA: And the CIA triad isn't a trivia question.

It's a lens.

Can somebody see what they shouldn't?

Can somebody change what they shouldn't?

Can people get to what they need?

JULES: Exactly.

PARISA: Threat, vulnerability, exploit, risk.

Different jobs.

JULES: Yep.

PARISA: And controls aren't "install antivirus."

They're all the technical, procedural, physical, and human things we use to reduce risk.

JULES: Yep.

PARISA: Defense in depth because one control can fail.

Least privilege because compromise should not grant infinite power.

Reduce attack surface because every unnecessary door is still a door.

JULES: You've got it.

PARISA: Damn it.

Security is just systems thinking with more adversaries.

JULES: That is honestly not a bad description.


## Security+ Corner: What Do I Actually Need to Remember?

PARISA: We said we weren't turning this into exam cram.

JULES: We're not.

PARISA: But if somebody is also studying for Security+?

JULES: Then here's the useful separation.

Understand the concepts first.

For this episode, the exam vocabulary worth recognizing includes the CIA triad, security controls, control categories and types, least privilege, attack surface, threats, vulnerabilities, and risk.

PARISA: And CompTIA may care about distinctions more precisely than a normal human conversation does.

JULES: Correct.

Technical, managerial, operational, physical.

Preventive, deterrent, detective, corrective, compensating, directive.

PARISA: Those go in the companion notes.

JULES: Exactly.

PARISA: Beautiful. The podcast remains a podcast.


## What Did We Actually Learn?

JULES: Cybersecurity is about protecting information, systems, services, identities, and operations from unacceptable harm.

PARISA: "Secure" is not a magic binary state.

JULES: Confidentiality asks who can see something.

Integrity asks whether it can be trusted.

Availability asks whether authorized users can get to it when they need it.

PARISA: A threat can cause harm.

A vulnerability is a weakness.

An exploit takes advantage of a vulnerability.

Risk is about the chance and impact of the bad outcome.

JULES: Attack surface is the collection of places an attacker can potentially interact with or abuse.

PARISA: Least privilege limits unnecessary power.

Defense in depth gives us multiple layers so one failure doesn't become game over.

JULES: And security controls can be technical, managerial, operational, or physical—and can prevent, detect, correct, deter, direct, or compensate.

PARISA: Most importantly, developer decisions are already security decisions whether the developer calls them that or not.

JULES: Exactly.

PARISA: So next time?

JULES: Networking.

PARISA: Oh no.

JULES: Oh yes.

PARISA: I know networking.

JULES: Great.

PARISA: I know that DNS is—

JULES: Don't say phone book.

PARISA: I was absolutely going to say phone book.

JULES: Next episode: networking, but now everyone is suspicious.

PARISA: Ports?

JULES: Ports.

PARISA: TCP?

JULES: TCP.

PARISA: DNS?

JULES: Obviously.

PARISA: Fine.

But if you make me memorize the OSI model as a poem, I quit.

JULES: Deal.

[MUSIC]

PARISA: *Okay, But Why?* is the show where "I know how to use it" is the beginning of the question, not the end.

JULES: Next time: how computers actually talk to each other—and why security people want to know exactly who's talking to whom.

PARISA: Great.

We've taught the computers networking.

Now we're going to become suspicious of it.

[MUSIC OUT]
