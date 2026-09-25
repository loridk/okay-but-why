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

PARISA: What the hell are we actually securing?

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

PARISA: I'm Parisa. I've been putting things on the public internet since the public internet was substantially weirder.

JULES: And I'm Jules. I started developing after websites had stopped putting visitor counters under every page but had started installing four hundred dependencies to render a button.

PARISA: We'll be discussing your crimes later in this series.

JULES: Fair.

PARISA: This time we're doing cybersecurity.

PARISA: Not "here are twelve scary hacker words."

PARISA: Not "memorize this acronym because CompTIA might ask you."

PARISA: I want to know what security people are actually trying to accomplish.

JULES: Good. Because if you understand that, most of the acronyms eventually have somewhere to live.

PARISA: Excellent.

PARISA: Let us build the acronym habitat.


## Who Asked for This?

JULES: Imagine you build the world's simplest website.

PARISA: Beautiful. HTML file. Maybe a little CSS. No build step. Nature is healing.

JULES: It has one page that says, "Parisa's Sandwich Reviews."

PARISA: Security-critical infrastructure.

JULES: Obviously.

JULES: At first, it's just a file on your laptop.

JULES: Who can attack it?

PARISA: Me, mostly.

JULES: Right. Then you put it on a web server.

PARISA: Now strangers can request it.

JULES: And immediately you have security questions.

JULES: Can somebody change the reviews?

JULES: Can somebody take the server offline?

JULES: Can somebody read files they aren't supposed to see?

JULES: Can somebody convince the server they're you?

JULES: Can somebody use your server to attack somebody else?

PARISA: Can somebody replace my five-star review of a veggie Reuben with slander?

JULES: That's actually an integrity problem.

PARISA: We're twenty seconds into the sandwich and we've found the CIA triad.

JULES: Security exists because useful computer systems are almost never isolated.

JULES: They accept input. They communicate. They store information. They give different people different abilities. They depend on other systems. And they fail.

PARISA: So cybersecurity isn't primarily "stop hackers."

JULES: No. That's part of it, but it's too narrow.

JULES: Security is about protecting systems and information against things that would cause unacceptable harm.

JULES: And "things" includes malicious attackers, mistakes, broken hardware, bad configuration, lost laptops, compromised vendors, fires, floods—

PARISA: Dave deleting the production database.

JULES: Dave is absolutely in the threat model.

PARISA: Poor Dave.

JULES: Security is full of Daves.


## Secure Does Not Mean Unhackable

PARISA: Let me get one thing out of the way early.

PARISA: Can anything be completely secure?

JULES: Not in the useful, absolute sense people usually mean.

PARISA: Thank you.

PARISA: Because "make it secure" always feels like "make it good."

JULES: Exactly. Security is not a binary property where the switch says SECURE or HACKED.

JULES: You can reduce risk.

JULES: You can make attacks harder.

JULES: You can limit what an attacker can reach.

JULES: You can detect bad behavior faster.

JULES: You can recover better.

JULES: But every useful system has some amount of risk.

PARISA: Even if I unplug it from the internet.

JULES: Then you've changed the risks.

JULES: Maybe nobody can attack it remotely. But now somebody can steal the laptop. Or the drive can fail. Or you can forget the password.

PARISA: Or I can put it in a closet labeled "DO NOT TOUCH" and discover the most powerful force in IT.

JULES: Curiosity?

PARISA: Facilities.

JULES: So the useful question isn't usually, "Is this secure?"

JULES: It's, "Secure against what, for whom, at what cost, and how much risk are we willing to accept?"

PARISA: That's much less sexy than the hoodie guy.

JULES: Cybersecurity is frequently paperwork wearing tactical branding.


## What Are We Protecting?

JULES: One of the oldest useful security models is the **CIA triad**.

PARISA: And before anybody gets excited, not that CIA.

JULES: Confidentiality, integrity, and availability.

PARISA: Three properties we want information and systems to have.

JULES: Exactly.

JULES: Not every security problem fits perfectly into only one of them, but they're a really good way to ask, "What kind of harm are we worried about?"


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

JULES: Confidentiality is why we have access controls, encryption, permissions, authentication, data classification—

PARISA: And why a public GitHub repository is not a secrets manager.

JULES: Correct.

PARISA: So if an attacker steals a customer database, that's obviously a confidentiality failure.

JULES: Right.

JULES: But confidentiality failures don't require a malicious attacker.

JULES: If you accidentally configure cloud storage so the whole internet can read it, the information is still exposed.

PARISA: No hoodie necessary.

JULES: The cloud bucket has no idea whether the person downloading the file is evil. It just knows you said yes.

PARISA: That's upsettingly fair.


## Integrity: Don't Fuck With It

JULES: **Integrity** means the data or system remains accurate, complete, and trustworthy.

PARISA: So somebody reading my sandwich review is confidentiality.

PARISA: Somebody changing it is integrity.

JULES: Exactly.

JULES: Let's say your bank balance says one thousand dollars.

PARISA: Optimistic, but continue.

JULES: If I can see your balance when I shouldn't, confidentiality is broken.

JULES: If I can change it to ten thousand dollars—

PARISA: Let's explore this vulnerability further.

JULES: —integrity is broken.

PARISA: And integrity matters even if the data isn't secret.

JULES: Very much.

JULES: The software package you download from a public website isn't confidential. Everybody is allowed to have it.

JULES: But you care enormously whether somebody modified it and slipped malware inside.

PARISA: Oh.

PARISA: That's a nice distinction.

PARISA: Public does not mean integrity doesn't matter.

JULES: Exactly.

JULES: Security isn't just hiding things.

PARISA: Which is probably why "I didn't expose any private data" is not a complete security review.

JULES: Correct.


## Availability: Please Continue Existing

JULES: Then there's **availability**.

JULES: Authorized users should be able to access the system or information when they need it.

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

PARISA: Downtime feels like operations.

JULES: And this is why security gets broader than "hackers."

JULES: If a hospital system is unavailable at the moment someone needs a medication record, it doesn't matter that nobody stole the data. The system still failed an important security property.

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

PARISA: Threat. Vulnerability. Exploit. Risk.

PARISA: I know these words individually. People use them like they're interchangeable.

JULES: They aren't.

PARISA: Give me the sandwich version.

JULES: Naturally.

JULES: You own a sandwich shop.

JULES: Your back door has a broken lock.

PARISA: **Vulnerability.**

JULES: Exactly. A weakness that could be used or could contribute to harm.

JULES: There's a thief in the neighborhood who wants expensive vegan cheese.

PARISA: **Threat.**

JULES: More precisely, the thief is a threat actor, and theft is a threat.

JULES: A **threat** is something with the potential to cause harm.

PARISA: Then the thief uses the broken lock to get inside.

JULES: That's **exploitation** of the vulnerability.

JULES: An **exploit** is a technique or code that takes advantage of a vulnerability.

PARISA: And risk?

JULES: **Risk** is about the possibility and impact of the bad outcome.

JULES: How likely is it that somebody will use that broken lock?

JULES: How bad would it be if they did?

PARISA: So a vulnerability can exist without creating the same amount of risk everywhere.

JULES: Exactly.

JULES: A critical vulnerability in a server directly exposed to the internet might be urgent.

JULES: The same vulnerable software on an isolated test machine with no sensitive data and no route to anything else might present much less immediate risk.

PARISA: Still fix it.

JULES: Probably, yes.

JULES: But security teams prioritize because nobody has infinite time, money, or people.

PARISA: This feels important for developers because vulnerability scanners love producing giant lists that make you feel like your project has contracted every disease known to npm.

JULES: Right. A finding isn't the whole risk assessment.

JULES: You need context.

JULES: What is vulnerable?

JULES: Is it actually reachable?

JULES: Is there an exploit?

JULES: What could an attacker gain?

JULES: What protections already exist?

PARISA: So "CVSS ten, everyone panic" is sometimes justified, but we still ask questions.

JULES: Always ask questions.


## Your Attack Surface Is Everything You Let the World Touch

JULES: Another useful concept is **attack surface**.

PARISA: The amount of stuff available to attack.

JULES: Pretty much.

JULES: Every exposed service, API endpoint, login form, dependency, device, account, admin panel, browser extension permission, open port—

PARISA: Employee.

JULES: Absolutely.

JULES: Humans are part of the attack surface.

PARISA: Rude but fair.

JULES: If an attacker can interact with it, influence it, impersonate it, send input to it, or abuse the trust you've given it, it may be part of your attack surface.

PARISA: So reducing attack surface means giving attackers fewer doors.

JULES: That's the idea.

JULES: If your application doesn't need to expose a database directly to the internet—

PARISA: Don't.

JULES: If your Chrome extension doesn't need permission to read every website—

PARISA: Don't ask for it.

JULES: If an employee doesn't need production administrator access—

PARISA: Don't give it to them.

JULES: Now you're doing security architecture.

PARISA: Look at me.

PARISA: I have become the hoodie.


## Least Privilege: Stop Giving Everyone the Master Key

JULES: What you just described is **least privilege**.

JULES: A person, process, or system should get only the access it needs to do its job, for only as long as it needs it.

PARISA: This is one of those ideas that sounds painfully obvious until you look at actual software permissions.

JULES: Correct.

PARISA: "Why does this flashlight app need contacts, microphone, location, storage, camera, and the blood type of my firstborn?"

JULES: Least privilege says: if the feature doesn't require the permission, don't grant it.

PARISA: This applies to code too.

JULES: Definitely.

JULES: Suppose your application connects to a database using an account that can create users, drop tables, change permissions, read every database, and launch a small moon.

PARISA: But the application only needs to read and update customer orders.

JULES: Then you've given it unnecessary privilege.

JULES: If the app gets compromised, the attacker inherits those privileges.

PARISA: Ah.

PARISA: Least privilege doesn't only prevent legitimate users from doing dumb things.

PARISA: It limits the blast radius when something goes wrong.

JULES: Exactly.

JULES: That phrase—**blast radius**—comes up a lot.

JULES: Assume something eventually fails or gets compromised.

JULES: How far can the damage spread?

PARISA: This is why minimal browser-extension permissions make me happy.

JULES: Yep. Less permission is less power available to abuse.

JULES: Whether the abuse comes from malicious code, a dependency, a compromised account, or an ordinary bug.


## Security Controls: Fine, How Do We Actually Protect Anything?

PARISA: Okay. We know what we're protecting.

PARISA: We know threats exist.

PARISA: What do we actually *do*?

JULES: We add **security controls**.

PARISA: Which means?

JULES: Safeguards or countermeasures used to reduce security risk.

JULES: A firewall is a control.

JULES: MFA is a control.

JULES: A security policy is a control.

JULES: A locked server-room door is a control.

JULES: Backups are controls.

JULES: Security training is a control.

PARISA: That is an aggressively broad category.

JULES: It is.

JULES: Security+ splits controls into categories like technical, managerial, operational, and physical.

PARISA: Let me try.

PARISA: Firewall: technical.

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

JULES: Preventive controls try to stop something.

JULES: Detective controls help you notice it.

JULES: Corrective controls help fix the situation after it happens.

JULES: Deterrent controls discourage it.

JULES: Directive controls tell people what they should do.

JULES: Compensating controls provide an alternative when the preferred control isn't practical.

PARISA: So a single security problem usually doesn't get one magical security product.

JULES: Right.

JULES: And that leads to one of the biggest ideas in this entire series.


## Defense in Depth: Because One Thing Will Eventually Fail

JULES: **Defense in depth** means using multiple layers of security so one failed control doesn't automatically mean total compromise.

PARISA: Medieval castle.

JULES: Great metaphor.

PARISA: Moat.

PARISA: Wall.

PARISA: Gate.

PARISA: Guards.

PARISA: Inner wall.

PARISA: Tiny angry goose.

JULES: The goose is a compensating control.

PARISA: Excellent.

JULES: Imagine protecting an account.

JULES: You require a password.

PARISA: Layer one.

JULES: The password is stored as a strong salted hash.

PARISA: So if the password database is stolen, the attacker doesn't immediately receive the actual passwords.

JULES: Another layer.

JULES: You support MFA.

PARISA: So a stolen password might not be enough.

JULES: You rate-limit login attempts.

PARISA: Makes brute-force attacks harder.

JULES: You alert on suspicious logins.

PARISA: Detective control.

JULES: You let the user revoke sessions.

PARISA: Corrective-ish.

JULES: Exactly.

JULES: No individual layer makes the account invincible.

JULES: Together they make compromise harder, more detectable, and easier to contain.

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

PARISA: Security people sometimes say **assume breach**.

PARISA: Does that mean "act like the attackers are already inside"?

JULES: In a useful sense, yes.

JULES: Not "panic constantly."

JULES: It means don't design the entire system around the assumption that your outermost defense will always work.

PARISA: So if somebody gets past the login, that should not mean they can do literally anything.

JULES: Right.

JULES: If one employee account is compromised, that shouldn't automatically expose every company system.

JULES: If one container is compromised, that shouldn't automatically mean the attacker owns the whole cluster.

JULES: If one dependency is malicious, ideally it doesn't have unlimited access to secrets and the filesystem.

PARISA: This is where least privilege, segmentation, logging, and defense in depth all start holding hands.

JULES: Exactly.

JULES: And later we'll get into **Zero Trust**, which formalizes a lot of the "don't grant trust merely because something is inside the network" thinking.

PARISA: Later.

JULES: Later.

PARISA: I refuse to learn an architecture slogan before I've had lunch.


## The Developer Version of Security

PARISA: Bring this back to somebody building a web application.

PARISA: What's my security job?

PARISA: Because I am not running the SOC.

JULES: Your job isn't to personally do every security function.

JULES: But developers make security decisions constantly.

PARISA: Give me examples.

JULES: How do you validate input?

JULES: Where do secrets live?

JULES: What permissions does the application request?

JULES: How do you authenticate users?

JULES: How do you authorize actions?

JULES: What gets logged?

JULES: What data goes to third parties?

JULES: What happens when a dependency is vulnerable?

JULES: What error messages do you expose?

JULES: How do sessions expire?

JULES: How do you protect sensitive data?

JULES: What happens if an API request is modified?

PARISA: Okay, yes.

PARISA: That's just building software.

JULES: Exactly.

JULES: Secure development isn't usually a separate magical activity performed later by people in black T-shirts.

JULES: Security properties emerge from ordinary engineering decisions.

PARISA: Or fail to emerge.

JULES: Often that.

PARISA: Which probably explains why "we'll add security at the end" goes badly.

JULES: Imagine building a house and saying, "We'll add structural integrity during QA."

PARISA: That's a metaphor I don't even need explained.

JULES: Security teams can test, advise, monitor, build controls, respond to incidents, and catch problems.

JULES: But they can't retroactively make every design decision safe.

PARISA: So developers don't have to become pentesters.

JULES: No.

PARISA: But we do need to understand how the things we build can be abused.

JULES: Exactly.

JULES: That sentence is basically the reason this series exists.


## "But My App Isn't Important"

PARISA: Okay, here's a classic.

PARISA: "My app isn't important. Why would anybody attack it?"

JULES: Because attackers don't necessarily care about *you*.

PARISA: Comforting.

JULES: Your application might have user accounts.

JULES: It might have payment data.

JULES: It might have API credentials.

JULES: It might have compute resources.

JULES: It might have access to another system.

JULES: It might be useful for sending spam, hosting malware, mining cryptocurrency, or joining a botnet.

PARISA: Or it might just be scanned automatically because it exists.

JULES: Exactly.

JULES: A huge amount of malicious activity is automated.

JULES: Attackers scan ranges of internet addresses, look for known vulnerable software, leaked credentials, exposed services, default passwords—

PARISA: So the attacker may not have selected `parisasandwichreviews.com` after months of reconnaissance.

JULES: Your beautiful sandwich empire might just answer on a port their scanner checked.

PARISA: I feel both safer and less special.

JULES: You're welcome.


## Risk Is Not Fear

PARISA: This is where security can become emotionally weird, though.

PARISA: Once you understand the number of things that can go wrong, everything starts sounding dangerous.

JULES: That's why **risk management** matters.

JULES: Security isn't "be afraid of every possible threat."

JULES: It's making reasonable decisions based on likelihood, impact, cost, and context.

PARISA: Give me an absurd example.

JULES: We could protect your sandwich-review admin account by requiring you to appear in person at a guarded data center, provide three forms of ID, scan both retinas, unlock a hardware token, and get written approval from two executives.

PARISA: Extremely secure.

JULES: Also you will never update the website again.

PARISA: Availability issue.

JULES: And usability.

JULES: And cost.

JULES: And probably employment.

PARISA: So the goal is appropriate security.

JULES: Right.

JULES: A bank, a hospital, a personal blog, a nuclear facility, and a local restaurant menu do not all have the same risk profile.

PARISA: Although the restaurant menu should still not run WordPress 3.2 with `admin/admin`.

JULES: Please don't do this.

PARISA: We already used the sting.

JULES: I know. I'm conserving the budget.


## A Tiny Threat Model

JULES: Let's do a tiny version of something we'll eventually spend a whole episode on: **threat modeling**.

PARISA: Sounds ominous.

JULES: It's mostly structured pessimism.

JULES: Take your sandwich review site.

JULES: What do we care about?

PARISA: The published reviews remain accurate.

JULES: Integrity.

PARISA: My admin credentials aren't exposed.

JULES: Confidentiality.

PARISA: The site stays online.

JULES: Availability.

JULES: Who or what might cause problems?

PARISA: Random attacker.

PARISA: Compromised dependency.

PARISA: Me making a mistake.

PARISA: Hosting provider outage.

JULES: Good.

JULES: Where can they interact with the system?

PARISA: Login form.

PARISA: Public pages.

PARISA: Admin interface.

PARISA: Hosting account.

PARISA: GitHub repository.

PARISA: Dependencies.

PARISA: Maybe a contact form.

JULES: Attack surface.

JULES: What controls reduce the risk?

PARISA: MFA on GitHub and hosting.

PARISA: Strong authentication for the admin.

PARISA: Least privilege.

PARISA: Updates.

PARISA: Backups.

PARISA: Dependency review.

PARISA: Logging.

PARISA: Don't expose things I don't need.

JULES: Congratulations. You just did the beginning of security engineering.

PARISA: I didn't even buy a hoodie.


## Okay, That's Actually Pretty Cool

[STING]

### OKAY, THAT'S ACTUALLY PRETTY COOL

PARISA: I think my click is this:

PARISA: Cybersecurity isn't one specialized layer sitting outside software development.

PARISA: It's a way of asking what can go wrong with a system, what matters if it does, and what we're going to do about it.

JULES: Yes.

PARISA: And the CIA triad isn't a trivia question.

PARISA: It's a lens.

PARISA: Can somebody see what they shouldn't?

PARISA: Can somebody change what they shouldn't?

PARISA: Can people get to what they need?

JULES: Exactly.

PARISA: Threat, vulnerability, exploit, risk.

PARISA: Different jobs.

JULES: Yep.

PARISA: And controls aren't "install antivirus."

PARISA: They're all the technical, procedural, physical, and human things we use to reduce risk.

JULES: Yep.

PARISA: Defense in depth because one control can fail.

PARISA: Least privilege because compromise should not grant infinite power.

PARISA: Reduce attack surface because every unnecessary door is still a door.

JULES: You've got it.

PARISA: Damn it.

PARISA: Security is just systems thinking with more adversaries.

JULES: That is honestly not a bad description.


## Security+ Corner: What Do I Actually Need to Remember?

PARISA: We said we weren't turning this into exam cram.

JULES: We're not.

PARISA: But if somebody is also studying for Security+?

JULES: Then here's the useful separation.

JULES: Understand the concepts first.

JULES: For this episode, the exam vocabulary worth recognizing includes the CIA triad, security controls, control categories and types, least privilege, attack surface, threats, vulnerabilities, and risk.

PARISA: And CompTIA may care about distinctions more precisely than a normal human conversation does.

JULES: Correct.

JULES: Technical, managerial, operational, physical.

JULES: Preventive, deterrent, detective, corrective, compensating, directive.

PARISA: Those go in the companion notes.

JULES: Exactly.

PARISA: Beautiful. The podcast remains a podcast.


## What Did We Actually Learn?

JULES: Cybersecurity is about protecting information, systems, services, identities, and operations from unacceptable harm.

PARISA: "Secure" is not a magic binary state.

JULES: Confidentiality asks who can see something.

JULES: Integrity asks whether it can be trusted.

JULES: Availability asks whether authorized users can get to it when they need it.

PARISA: A threat can cause harm.

PARISA: A vulnerability is a weakness.

PARISA: An exploit takes advantage of a vulnerability.

PARISA: Risk is about the chance and impact of the bad outcome.

JULES: Attack surface is the collection of places an attacker can potentially interact with or abuse.

PARISA: Least privilege limits unnecessary power.

PARISA: Defense in depth gives us multiple layers so one failure doesn't become game over.

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

PARISA: But if you make me memorize the OSI model as a poem, I quit.

JULES: Deal.

[MUSIC]

PARISA: *Okay, But Why?* is the show where "I know how to use it" is the beginning of the question, not the end.

JULES: Next time: how computers actually talk to each other—and why security people want to know exactly who's talking to whom.

PARISA: Great.

PARISA: We've taught the computers networking.

PARISA: Now we're going to become suspicious of it.

[MUSIC OUT]
