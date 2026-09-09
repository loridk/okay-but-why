# Episode 3: Firewalls, Segmentation, VPNs & Zero Trust

Status: Draft

**CAST**

PARISA — Experienced millennial web developer who has spent enough time around hosting panels, cloud dashboards, and corporate VPNs to know that “network access” is never as simple as the diagram implies.

JULES — Gen Z developer who entered the industry after perimeter security had already started losing arguments with cloud computing.


[MUSIC]

PARISA: I have a firewall.

JULES: Congratulations.

PARISA: Thank you. We’re secure now.

JULES: No.

PARISA: I paid good money for that sentence.

JULES: You can get a refund.

PARISA: Fine. What does the firewall actually do?

JULES: It makes decisions about network traffic.

PARISA: Based on rules.

JULES: Yes.

PARISA: So it is basically a bouncer for packets.

JULES: That metaphor is dangerously serviceable.

PARISA: Name’s not on the list, packet’s not getting into the club.

JULES: Unless the rules are bad.

PARISA: Ah.

So the bouncer is only as smart as the clipboard.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*

I’m Parisa.

JULES: And I’m Jules.

PARISA: Last time we built the network map.

Addresses.

Ports.

Protocols.

Routing.

Subnets.

DNS.

Traffic.

JULES: Today we’re asking the next question.

PARISA: Which conversations should be allowed?

JULES: Exactly.

PARISA: Firewalls.

Segmentation.

VPNs.

And eventually—

JULES: Zero Trust.

PARISA: The phrase every vendor has printed on a landing page.

JULES: We’re going to rescue it from marketing.

PARISA: Bold ambition.


## Who Asked for Firewalls?

JULES: Imagine your server has ten services listening.

PARISA: Already suspicious.

JULES: Maybe only one of those services needs to be reachable from the public internet.

PARISA: HTTPS on 443.

JULES: Right.

Maybe SSH should only be reachable from a management network.

Maybe the database should only accept traffic from the application tier.

Maybe an internal admin service should never be reachable publicly at all.

PARISA: So without controls, if the network can route traffic there, anyone with a path can at least try to connect.

JULES: Exactly.

A firewall gives us a place to enforce policy about that traffic.

PARISA: Source.

Destination.

Port.

Protocol.

JULES: Those are common ingredients.

Modern firewalls can inspect much more, but the basic question is: allow or deny?


## Packet Filtering: The Clipboard

JULES: The simplest mental model is **packet filtering**.

A firewall looks at packet information and compares it to rules.

PARISA: “Traffic from this source network to this destination on TCP 443: allow.”

JULES: Exactly.

PARISA: “Everything else: deny.”

JULES: That last part matters a lot.

PARISA: Default deny.

JULES: Yep.

Instead of trying to predict every bad thing and block it, you permit the communication you actually need.

PARISA: Least privilege, but for networking.

JULES: Precisely.

PARISA: I like that.

JULES: A permissive rule set says, “Everything is allowed unless we’ve specifically forbidden it.”

A restrictive rule set says, “Nothing is allowed unless we’ve specifically permitted it.”

PARISA: And security generally prefers starting restrictive.

JULES: When practical, yes.

PARISA: “Allow any any” is the network equivalent of `chmod 777`.

JULES: Please stop triggering administrators.


## Stateful Firewalls: I Remember You

PARISA: What does “stateful” actually buy us?

JULES: A **stateful firewall** tracks active connections.

PARISA: So it knows that an inbound packet might be part of a conversation my machine started.

JULES: Exactly.

Suppose your laptop opens a TCP connection to a website.

The firewall can record that connection state and allow matching return traffic.

PARISA: Instead of treating every packet like a total stranger.

JULES: Right.

PARISA: And stateless filtering would evaluate each packet independently.

JULES: Correct.

PARISA: Neither is automatically “bad,” but state is useful because conversations have context.

JULES: Exactly.


## Next-Generation Firewalls: The Bouncer Read Your Texts

PARISA: Then vendors discovered the phrase **next-generation firewall**.

JULES: They did.

PARISA: What actually changed?

JULES: Traditional firewalls focused heavily on addresses, ports, and connection state.

Next-generation firewalls may also understand applications, users, content, signatures, and threats.

PARISA: So traffic on port 443 isn’t automatically trusted just because it’s HTTPS.

JULES: Right.

A modern firewall might identify the application or inspect permitted traffic more deeply, depending on configuration and whether encryption can be inspected.

PARISA: Which raises privacy and operational questions.

JULES: Absolutely.

TLS inspection can improve visibility, but it also means deliberately intercepting encrypted connections inside an organization.

PARISA: Which has implications for certificates, trust, sensitive information, and things you probably shouldn’t inspect casually.

JULES: Security controls always come with tradeoffs.


## Host Firewalls and Network Firewalls

PARISA: My laptop has a firewall too.

JULES: That’s a **host-based firewall**.

PARISA: The operating system can decide which inbound or outbound connections are allowed for that machine.

JULES: Right.

A **network firewall** sits at a network boundary or between network segments and controls traffic crossing that point.

PARISA: Defense in depth says we can use both.

JULES: Exactly.

PARISA: If the network firewall is misconfigured, the host still has a say.

JULES: Potentially.

PARISA: If the host firewall is permissive, the network firewall can still reduce reachability.

JULES: Right.

PARISA: Tiny angry goose behind the castle wall.

JULES: The goose returns.


## Segmentation: Stop Making Everything Roommates

JULES: Firewalls get much more useful when networks are segmented.

PARISA: Because you can enforce rules between segments.

JULES: Exactly.

Imagine one enormous flat office network.

Employee laptops.

Printers.

Security cameras.

Servers.

Developer machines.

Payroll.

Guest devices.

PARISA: Toaster.

JULES: You remain committed to the toaster.

PARISA: The toaster has Bluetooth. It is now infrastructure.

JULES: Fair.

If everything can directly reach everything else, one compromised device may have a huge amount of opportunity.

PARISA: Lateral movement.

JULES: Right.

An attacker gains a foothold and then tries to move through the environment toward more valuable systems.

PARISA: So segmentation creates boundaries inside the network.

JULES: Yes.

You might separate users from servers, production from development, guest Wi-Fi from corporate devices, sensitive systems from general systems.

PARISA: And then explicitly allow only the communication that needs to cross those boundaries.

JULES: Exactly.

PARISA: Blast-radius control again.

JULES: Security really likes preventing one bad afternoon from becoming a company-wide bad month.


## VLANs: Logical Separation

PARISA: VLANs.

JULES: **Virtual LANs** let us create logical network segments even when devices share physical switching infrastructure.

PARISA: So we don’t need a separate physical switch for every group.

JULES: Right.

PARISA: But a VLAN alone is not magic isolation if routing between VLANs is wide open.

JULES: Thank you.

PARISA: I am learning the cybersecurity trick.

Never stop at the noun.

JULES: Exactly.

“What control enforces the boundary?”

“How is it configured?”

“What traffic is allowed?”

PARISA: Otherwise we have beautifully labeled neighborhoods connected by six-lane highways.


## DMZ: The Awkward Middle Zone

JULES: Another classic design is a **DMZ**, or demilitarized zone.

PARISA: A network segment for systems that need some exposure to untrusted networks but shouldn’t sit directly beside sensitive internal systems.

JULES: Exactly.

Historically, public-facing web servers might live in a DMZ, separated from both the internet and the internal network by firewall rules.

PARISA: So compromising the web server doesn’t automatically put the attacker on the same network as payroll.

JULES: That’s the goal.

PARISA: Cloud architecture doesn’t always look like old diagrams with a literal DMZ box, but the principle survives.

JULES: Very much.

Public subnets, private subnets, security groups, network ACLs, service boundaries—the implementation changes, but the idea of controlled exposure remains.


## VPNs: The Tunnel Metaphor, With Conditions

PARISA: VPN time.

JULES: **Virtual Private Network**.

PARISA: Encrypted tunnel through an untrusted network.

JULES: That’s the standard metaphor, and it’s useful.

A VPN creates a protected connection between endpoints over another network, often the public internet.

PARISA: Remote employee to corporate network.

JULES: Common.

PARISA: Office to office.

JULES: Site-to-site VPN.

PARISA: Person on sketchy hotel Wi-Fi to a VPN provider.

JULES: Consumer VPN use case.

PARISA: And this is where marketing becomes messy, because people hear “VPN” and think “anonymous.”

JULES: Right.

A VPN changes who can observe parts of your traffic path. It does not make you invisible.

PARISA: The VPN provider can become a party you are trusting instead of the local network.

JULES: Exactly.

PARISA: Websites still have cookies.

You can still log into accounts.

Browser fingerprinting exists.

Malware on your device does not care that the tunnel has a cute shield icon.

JULES: Correct.

PARISA: So “VPN = privacy” is oversimplified.

JULES: Very.


## Split Tunnel vs. Full Tunnel

JULES: Corporate VPNs often have to decide whether all device traffic goes through the VPN.

PARISA: Full tunnel.

JULES: Right.

Or only traffic destined for corporate resources.

PARISA: Split tunnel.

JULES: Exactly.

PARISA: Full tunnel gives the organization more visibility and policy control, but can add latency and bandwidth overhead.

JULES: And split tunneling can be more efficient, but now the endpoint is simultaneously connected to corporate resources and the local internet path.

PARISA: Which may increase risk depending on the environment.

JULES: Security design is context.


## VPN Does Not Equal Authorization

PARISA: Here’s a thing I want tattooed on somebody’s firewall.

Connecting to the VPN should not automatically grant access to everything.

JULES: Yes.

Older designs often treated the VPN as proof that you were “inside.”

PARISA: Which means a stolen VPN credential could hand an attacker a very large internal network.

JULES: Exactly.

PARISA: And now we have reached Zero Trust.


## Who Asked for Zero Trust?

[STING]

### WHO ASKED FOR THIS?

JULES: Traditional perimeter security often assumed a trusted internal network and an untrusted external network.

PARISA: Castle wall.

JULES: Yep.

Build a strong perimeter.

Once you’re inside, you’re trusted more broadly.

PARISA: That model gets uncomfortable when employees are remote, applications are in multiple clouds, services call other services, phones access SaaS, contractors need limited access, and attackers steal legitimate credentials.

JULES: Exactly.

The perimeter stopped being a single meaningful boundary.

PARISA: So **Zero Trust** says don’t grant trust merely because of network location.

JULES: Right.

“Never trust, always verify” is the slogan, but the actual concept is more nuanced.

PARISA: Thank God.

JULES: Trust should be evaluated continuously and based on context.

Who is the user?

What device are they using?

Is the device healthy?

What resource are they requesting?

What privileges do they have?

What’s the risk of the request?

PARISA: So my laptop being physically in the office is not sufficient proof that I should access payroll.

JULES: Correct.

PARISA: And my account having authenticated at 9:00 doesn’t mean every action at 4:00 should be trusted forever.

JULES: Exactly.


## Zero Trust Is Not “Trust Nobody”

PARISA: The name makes it sound like a corporate culture problem.

JULES: It does.

Zero Trust does not mean systems refuse to trust anyone.

They have to grant access eventually or nothing works.

PARISA: Availability has once again entered the meeting.

JULES: Right.

It means trust is not implicit.

Access is explicitly evaluated.

PARISA: Identity becomes much more important.

JULES: Yes.

Identity, device posture, policy, least privilege, segmentation, monitoring.

PARISA: Which is why Zero Trust is not one product.

JULES: Please say that louder.

PARISA: **ZERO TRUST IS NOT A BOX YOU BUY.**

JULES: Beautiful.

PARISA: I assume several vendors have left the podcast.


## Policy Engine, Policy Administrator, Enforcement Point

PARISA: Security+ has specific Zero Trust vocabulary, doesn’t it?

JULES: It does.

At a simplified level, you can think of a **policy engine** making the decision about whether access should be granted.

A **policy administrator** helps execute that decision.

A **policy enforcement point** sits where the decision is actually enforced.

PARISA: So one part reasons about policy, another coordinates, and another says yes or no at the gate.

JULES: That’s the useful mental model.

PARISA: Again: companion notes for exact exam language.

JULES: Correct.


## Microsegmentation: Smaller Blast Radius

PARISA: Zero Trust also talks a lot about microsegmentation.

JULES: Because broad network trust is dangerous.

Traditional segmentation might separate departments or server tiers.

Microsegmentation can create much smaller policy boundaries around workloads, applications, or resources.

PARISA: So two servers in the same cloud environment do not automatically get to communicate freely.

JULES: Exactly.

PARISA: That sounds operationally harder.

JULES: It can be.

PARISA: There’s the tradeoff.

JULES: Fine-grained policy improves control, but increases complexity.

Badly designed security can become so complicated that nobody understands the rules.

PARISA: And then somebody writes `allow *` at 2:00 AM.

JULES: Exactly.


## NAC: Who Gets on the Network?

JULES: **Network Access Control**, or NAC, is another related concept.

PARISA: Decide whether a device should be allowed to connect.

JULES: Right.

A NAC system may consider identity, device type, compliance status, certificate state, or other conditions before granting access.

PARISA: Company laptop with current security software gets corporate access.

Unknown device gets guest access or quarantine.

JULES: Exactly.

PARISA: Again, identity plus device plus policy.

JULES: Zero Trust ingredients show up everywhere.


## Proxy vs. Firewall

PARISA: Let’s clarify proxies while we’re here.

JULES: Good idea.

A firewall generally controls whether traffic is permitted to cross a boundary.

A **proxy** acts as an intermediary in the communication.

PARISA: Client talks to proxy. Proxy talks to destination.

JULES: Right.

A forward proxy acts on behalf of clients.

A reverse proxy acts on behalf of servers.

PARISA: Web developers know reverse proxies whether they realize it or not.

Nginx.

Load balancers.

CDNs.

Cloud edge services.

JULES: Exactly.

Reverse proxies can terminate TLS, route requests, add authentication, filter traffic, rate-limit, or hide backend infrastructure.

PARISA: But again, “we have a reverse proxy” is not the same as “the backend is secure.”

JULES: You’ve learned the formula.


## Web Application Firewalls

PARISA: WAF.

JULES: **Web Application Firewall**.

PARISA: Specifically understands web traffic.

JULES: Right.

A WAF can inspect HTTP requests and responses and apply rules designed for web attacks.

PARISA: SQL injection patterns.

Cross-site scripting patterns.

Suspicious request structures.

JULES: Among other things.

PARISA: Is a WAF a replacement for secure code?

JULES: No.

PARISA: Good.

JULES: It’s another layer.

A WAF can block many known attack patterns or buy time during remediation.

But it can’t understand every application-specific authorization rule or magically repair unsafe design.

PARISA: Defense in depth, not defense instead of depth.


## IDS and IPS: Watcher vs. Bouncer

JULES: While we’re at network boundaries, we should introduce IDS and IPS.

PARISA: Intrusion Detection System and Intrusion Prevention System.

JULES: An **IDS** detects suspicious activity and alerts.

An **IPS** can actively block or prevent traffic.

PARISA: Detective versus preventive.

JULES: Exactly.

PARISA: And modern products blur the categories.

JULES: Very much. But Security+ wants you to understand the conceptual difference.

PARISA: IDS says “hey, that looks bad.”

IPS says “hey, that looks bad, and I slapped it.”

JULES: Technically impeccable.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: “We put it behind a firewall, so the application is safe.”

JULES: Please don’t do this.

PARISA: Firewalls control traffic paths.

They do not fix broken authorization.

JULES: Correct.

PARISA: They do not safely store passwords.

JULES: Correct.

PARISA: They do not sanitize dangerous input.

JULES: Correct.

PARISA: They do not patch vulnerable dependencies.

JULES: Correct.

PARISA: They do not stop an attacker who is allowed through the same path as legitimate users from abusing application logic.

JULES: Exactly.

PARISA: A public web application has to accept public web traffic. The firewall cannot simply solve web security by blocking the web.

JULES: Availability has filed another complaint.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: Here’s my click.

A firewall is not a force field.

It’s policy enforcement for network communication.

JULES: Yep.

PARISA: Segmentation reduces how much of the environment is reachable from one place.

JULES: Yep.

PARISA: VPNs protect traffic over untrusted networks but do not automatically create identity, authorization, anonymity, or perfect security.

JULES: Correct.

PARISA: Zero Trust is the logical conclusion of admitting that “inside” is not proof of trustworthiness.

JULES: Exactly.

PARISA: Instead of asking “Are you inside the castle?” we keep asking, “Who are you, what are you using, what are you requesting, and should you get it?”

JULES: That’s the heart of it.

PARISA: Annoyingly reasonable.

JULES: I told you you’d like it.

PARISA: Don’t ruin this.


## Security+ Corner

JULES: For Security+, know firewall types and the basic difference between stateless and stateful filtering.

Understand segmentation, VLANs, DMZs, ACLs, VPN concepts, split versus full tunneling, NAC, IDS versus IPS, proxies, WAFs, and Zero Trust architecture.

PARISA: And understand the purpose.

JULES: Always.

PARISA: Exam questions get easier when you know what problem a control solves.

JULES: Exactly.


## What Did We Actually Learn?

PARISA: Firewalls enforce rules about network traffic.

JULES: Stateful firewalls understand connection context.

PARISA: Network and host firewalls can reinforce each other.

JULES: Segmentation limits reachability and lateral movement.

PARISA: VLANs create logical segments, but the actual security comes from the controls between them.

JULES: VPNs create protected connections over untrusted networks.

PARISA: But a VPN is not invisibility and not authorization.

JULES: Zero Trust rejects implicit trust based on network location.

PARISA: Access should be explicitly evaluated using identity, device, resource, policy, and context.

JULES: And controls should limit blast radius when something inevitably goes wrong.

PARISA: Next time?

JULES: Authentication.

PARISA: Passwords.

JULES: Unfortunately.

PARISA: MFA.

JULES: Definitely.

PARISA: Biometrics.

JULES: Yep.

PARISA: Passkeys?

JULES: Oh yes.

PARISA: Finally.

Something invented after we collectively admitted passwords are terrible.

JULES: We’re going to talk about exactly why.

[MUSIC]

PARISA: *Okay, But Why?* is the show where “it’s behind the firewall” is the beginning of the security conversation, not the end.

JULES: Next time: prove you’re actually you.

PARISA: Preferably without asking me to remember `HorseBatteryStaple!2026`.

[MUSIC OUT]
