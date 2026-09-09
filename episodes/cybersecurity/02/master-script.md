# Episode 2: Networking, But Now Everyone Is Suspicious

Status: Draft

**CAST**

PARISA — Experienced millennial web developer. Has configured enough DNS records to know that “it’s probably DNS” is both a joke and occasionally a cry for help.

JULES — Gen Z developer who entered development when HTTPS was expected, APIs were everywhere, and half the development environment was already talking to something else over a network.


[MUSIC]

PARISA: Networking.

JULES: Networking.

PARISA: I know networking.

JULES: I believe you.

PARISA: Thank you.

JULES: What’s a subnet mask?

PARISA: Fuck you.

JULES: And welcome to the show.

PARISA: No. Absolutely not.

I know what an IP address is. I know what DNS does. I know what ports are. I know HTTP. I’ve configured servers. I’ve SSH’d into things. I have personally caused DNS propagation anxiety.

JULES: So, like I said, you know networking.

PARISA: Then why does every cybersecurity course immediately become—

JULES: TCP! UDP! ICMP! DHCP! ARP! VLAN! NAT!

PARISA: Exactly.

And suddenly somebody has drawn seven horizontal rectangles and is asking me which layer a switch lives on.

JULES: The OSI model has entered the chat.

PARISA: The OSI model can wait in the lobby.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*, the show where developers are allowed to understand technology instead of merely surviving its acronyms.

I’m Parisa.

JULES: And I’m Jules.

PARISA: Last time, we figured out what cybersecurity is actually trying to protect.

Confidentiality.

Integrity.

Availability.

Threats.

Vulnerabilities.

Risk.

Attack surfaces.

Controls.

Defense in depth.

JULES: And today we’re talking about the thing connecting almost everything we’re trying to protect.

PARISA: Networks.

JULES: Because if two computers can communicate, security people immediately want to know—

PARISA: Who are you?

JULES: Yep.

PARISA: Why are you talking to me?

JULES: Yep.

PARISA: What are you sending?

JULES: Yep.

PARISA: Should you be allowed to send it?

JULES: Yep.

PARISA: And what happens if you’re lying?

JULES: Now you’re thinking like security.

PARISA: I was afraid of that.


## Who Asked for This?

JULES: Before networks, computers were mostly islands.

PARISA: Very expensive islands.

JULES: You had a machine. It processed information locally. If you wanted information from another machine, somebody might literally move storage media between them.

PARISA: Sneakernet.

JULES: Exactly.

Then we connected computers because sharing information is incredibly useful.

PARISA: Files. Printers. Databases. Email. Websites. APIs. Cloud services.

JULES: Everything.

The modern computer is useful largely because it can talk to other computers.

PARISA: And the modern computer is vulnerable largely because it can talk to other computers.

JULES: There it is.

Networking solves an enormous problem: how do independent machines exchange information?

Security immediately inherits a second problem: how do we make sure they’re exchanging the right information with the right systems in the right way?

PARISA: So networking gives us connectivity.

Security asks whether connectivity was actually a good idea.

JULES: Repeatedly.


## What Is a Network, Really?

PARISA: Let’s remove all the equipment for a second. What’s the fundamental thing happening?

JULES: One device sends information. Another device receives it.

PARISA: That’s it?

JULES: Fundamentally, yeah. Everything else exists because doing that reliably across billions of devices is complicated.

PARISA: Fair.

JULES: The information is broken into manageable pieces, transmitted according to agreed rules, routed toward a destination, and reconstructed or interpreted by the receiver.

PARISA: And those agreed rules are protocols.

JULES: Exactly. A **protocol** is basically a shared set of rules for communication.

PARISA: Like HTTP.

JULES: HTTP is a protocol.

PARISA: DNS.

JULES: Protocol.

PARISA: TCP.

JULES: Protocol.

PARISA: SMTP.

JULES: Protocol.

PARISA: So computers don’t just scream arbitrary bytes into the void and hope somebody understands.

JULES: Usually not.

PARISA: Good standard.


## IP Addresses: Where Are You?

JULES: Let’s start with the thing most people recognize: an **IP address**.

PARISA: Internet Protocol address.

JULES: It’s an address used to identify an interface on an IP network so traffic can be delivered.

PARISA: I appreciate that you said “an interface” instead of “a computer.”

JULES: Because one device can have multiple network interfaces and multiple addresses.

PARISA: Wi-Fi and Ethernet, for example.

JULES: Exactly. And virtual systems complicate it further.

PARISA: Containers are waiting several series down the road to ruin everyone’s simple mental model.

JULES: They’re very patient.

PARISA: So when I type a URL into my browser, ultimately the network needs an IP address.

JULES: Right. Your browser likes names because humans like names. Networks route IP traffic using addresses.

PARISA: IPv4 is the familiar four-number thing. Like `192.168.1.20`.

JULES: Yep. IPv4 addresses are 32 bits.

PARISA: Which gave us roughly four billion possible addresses, and then humanity looked at that number and said, “Surely that will be enough forever.”

JULES: Humanity has a recurring problem with the word “forever.”

PARISA: So IPv6 exists because we needed a dramatically larger address space.

JULES: Among other improvements, yes. IPv6 uses 128-bit addresses.

PARISA: Which look like somebody dropped a hexadecimal Scrabble bag.

JULES: Something like `2001:db8::1`.

PARISA: And the double colon can compress consecutive zero groups.

JULES: Look at you.

PARISA: I said I knew networking.


## Public and Private Addresses

JULES: Now let’s make it security-relevant.

Not every IP address is meant to be globally reachable.

PARISA: Private address ranges.

JULES: Exactly. Your laptop at home might have an address like `192.168.1.42`. That address works inside your local network, but the public internet doesn’t route that private range directly.

PARISA: Which is where NAT comes in.

JULES: Usually, yes. **Network Address Translation** lets multiple private devices share one or a smaller number of public addresses.

PARISA: My router is basically the receptionist.

“Who are you here to see?”

JULES: Sort of. It keeps track of outbound connections and maps return traffic back to the right internal device.

PARISA: But NAT is not a firewall.

JULES: Thank you.

PARISA: I have seen people treat “behind NAT” as synonymous with “secure.”

JULES: NAT can reduce unsolicited inbound reachability as a side effect, but that is not the same thing as a deliberate security policy.

A real firewall makes explicit decisions about allowed and denied traffic.

PARISA: Episode three is already glaring at us.


## Subnets: The Neighborhoods of Networking

PARISA: Fine. Subnet masks. You win.

JULES: A subnet is just a logical subdivision of an IP network.

PARISA: So instead of one giant flat neighborhood, we divide it into smaller neighborhoods.

JULES: Exactly. An address and prefix tell you which part identifies the network and which part identifies the host.

For example, `192.168.1.0/24` means the first 24 bits are the network portion.

PARISA: Which gives us addresses in that subnet.

JULES: Right.

PARISA: Security cares because subnetting helps us separate things.

JULES: Yes. Segmentation can limit who can talk to what.

Maybe employee laptops are in one network, production databases in another, guest Wi-Fi somewhere else entirely.

PARISA: So if someone compromises the Wi-Fi toaster, it shouldn’t automatically have a straight road to payroll.

JULES: That would be ideal.

PARISA: Security architecture: please keep the toaster away from payroll.

JULES: Put it on the sticker.


## Ports: Which Service Are You Talking To?

JULES: IP addresses help traffic reach the right host. **Ports** help traffic reach the right service or process.

PARISA: This is one of those things web developers use constantly without always thinking about it as networking.

`localhost:3000`.

JULES: Exactly.

PARISA: My machine is the host. Port 3000 is where the development server is listening.

JULES: Right.

A server may have many services running. Ports let the transport layer distinguish them.

PARISA: HTTP traditionally uses 80. HTTPS 443. SSH 22.

JULES: DNS commonly 53.

PARISA: SMTP 25.

JULES: And Security+ will absolutely expect you to recognize a useful set of common ports.

PARISA: Companion notes.

JULES: Companion notes.

PARISA: We are not doing “memorize seventeen numbers” as an audio experience.

JULES: Agreed.

PARISA: From a security perspective, an open port means there is potentially a reachable service.

JULES: Yes. That matters because every reachable service adds attack surface.

If SSH is exposed to the internet, attackers can find it.

If a database is listening publicly, attackers can find it.

If an old admin interface is still running on port 8080, attackers can find that too.

PARISA: Which is why scanning exists.

JULES: Exactly. A port scanner asks, in effect, “What doors answer?”

PARISA: And then security asks whether those doors should exist at all.

JULES: Now you’re getting it.


## TCP and UDP: Reliable Conversation vs. Fast Postcards

PARISA: We need TCP and UDP, don’t we?

JULES: We do.

PARISA: Fine.

JULES: They’re transport protocols. They help applications communicate over IP, but they make different tradeoffs.

**TCP** is connection-oriented and emphasizes reliable, ordered delivery.

PARISA: So it keeps track.

JULES: Yes. It establishes a connection, sequences data, acknowledges delivery, retransmits missing pieces, and makes sure the receiving application gets the stream in order.

PARISA: Which is useful for something like loading a webpage because I do not want chunks of my HTML arriving as interpretive jazz.

JULES: Precisely.

PARISA: And UDP?

JULES: **UDP** is connectionless and much lighter. It sends datagrams without TCP’s built-in guarantees around delivery, ordering, or retransmission.

PARISA: So “here’s the packet, good luck.”

JULES: Kind of.

That can be great when low latency matters more than perfect delivery, or when the application handles reliability itself.

PARISA: Voice calls. Streaming. Games. DNS queries.

JULES: Common examples, yes.

PARISA: Security angle?

JULES: Different protocols create different attack opportunities.

TCP’s connection state matters to firewalls and intrusion detection.

UDP can be spoofed more easily in some contexts because there is no connection handshake.

Some denial-of-service attacks exploit UDP services for reflection and amplification.

PARISA: We’re going to have to unpack that.

JULES: Suppose an attacker sends a small UDP request to a server but spoofs the victim’s IP address as the source.

The server sends the response to the victim.

If the response is much larger than the request, the attacker has used the server as an amplifier.

PARISA: So I send a tiny “please reply” while pretending to be you, and the server sends you a truck.

JULES: That’s the idea.

PARISA: Rude.


## DNS: The Phone Book Metaphor Is Not Illegal, Just Incomplete

PARISA: Fine. DNS.

The internet’s phone book.

JULES: I said don’t.

PARISA: It maps human-friendly names to network information. That is phone-book adjacent.

JULES: Fine. You may have the metaphor with a warning label.

PARISA: Thank you.

JULES: **Domain Name System** lets us ask questions like, “What address should I use for `example.com`?”

But DNS does more than map names to IPv4 addresses. There are records for IPv6, mail routing, aliases, verification, name servers, and more.

PARISA: A records, AAAA records, MX, CNAME, TXT.

JULES: Exactly.

PARISA: And security people care because if I can interfere with name resolution, I can potentially send someone to the wrong system.

JULES: Yes.

DNS poisoning, spoofing, malicious resolver configuration, domain hijacking—there are several ways trust around naming can be abused.

PARISA: If I ask for my bank and someone tricks my computer into resolving that name to the attacker’s server, we have a problem.

JULES: A very large one.

PARISA: HTTPS can still help if certificates are validated correctly.

JULES: Exactly. Security layers reinforce each other.

PARISA: Defense in depth has returned.

JULES: It never left.


## DHCP: “Here, You Live Here Now”

JULES: **DHCP**, Dynamic Host Configuration Protocol, handles automatic network configuration.

PARISA: Instead of manually typing an IP address, gateway, and DNS server into every laptop.

JULES: Right. A client joins the network and gets configuration information.

PARISA: Which is wonderfully convenient.

JULES: And security immediately asks—

PARISA: What if the person handing out configuration is lying?

JULES: Exactly.

A rogue DHCP server can hand clients malicious network settings.

PARISA: Like telling them to use an attacker-controlled DNS server.

JULES: Yep.

PARISA: Networking really is just a series of polite agreements followed by security asking, “But what if someone is an asshole?”

JULES: That could be this whole episode.


## ARP: Who Has This Address?

PARISA: Are we doing ARP?

JULES: Briefly.

**ARP**, Address Resolution Protocol, helps IPv4 devices on a local network map an IP address to a MAC address.

PARISA: So my machine says, effectively, “Who has this local IP?”

JULES: And the device with that IP replies with its hardware address.

PARISA: And old-school ARP does not include strong authentication.

JULES: Which is why ARP spoofing or poisoning is possible.

An attacker on the local network can lie about those mappings and potentially position themselves between systems.

PARISA: Man-in-the-middle territory.

JULES: Yep.

PARISA: Or person-in-the-middle, attacker-in-the-middle—

JULES: Modern materials often say on-path attack or adversary-in-the-middle.

PARISA: Excellent. The attacker can be any gender and still ruin lunch.


## Routing: How Does the Packet Get There?

JULES: Now imagine the destination isn’t on your local network.

Your device sends the traffic toward a **default gateway**, usually a router.

PARISA: The router looks at the destination and decides where to send it next.

JULES: Exactly.

Routers connect networks.

They maintain routing information that helps determine paths.

PARISA: So the internet isn’t one giant cable.

JULES: Thankfully.

It’s interconnected networks passing traffic toward destinations.

PARISA: Which is why traceroute can show multiple hops.

JULES: Right.

PARISA: Security angle: routing itself can be attacked.

JULES: Yes. Route manipulation, hijacking, malicious gateways, misconfiguration.

And at a simpler enterprise level, routing rules determine what networks can reach other networks.

PARISA: Again: connectivity is security policy.

JULES: Very often.


## The OSI Model, Unfortunately

PARISA: Fine.

Bring in the rectangles.

JULES: The **OSI model** is a conceptual seven-layer model for thinking about network communication.

PARISA: Does the internet literally execute seven sacred layers?

JULES: No.

PARISA: Thank you.

JULES: Real protocols do not always map cleanly to it. The practical TCP/IP model is often more directly connected to how the internet actually works.

But OSI is useful vocabulary.

PARISA: So why does security care?

JULES: Because attacks and controls happen at different layers.

A cable being cut is physical.

A switch operates mainly around the data-link layer.

IP routing is network-layer territory.

TCP and UDP are transport.

HTTP, DNS, SSH, and similar protocols live higher up.

PARISA: So if someone says “Layer 3 firewall” or “Layer 7 inspection,” the layer tells me what kind of information the device understands.

JULES: Exactly.

PARISA: That’s useful.

JULES: Also Security+ likes it.

PARISA: Less useful, but fair.


## Packets: The Evidence Is in the Traffic

JULES: Security people spend a lot of time looking at network traffic.

PARISA: Packet captures.

JULES: Tools like Wireshark let you inspect packets and protocol conversations.

PARISA: Which feels like opening the hood and actually watching the network happen.

JULES: Exactly.

A packet capture can tell you source and destination addresses, ports, protocol behavior, timing, flags, and—if the application traffic isn’t encrypted—sometimes the actual contents.

PARISA: Which is why plain HTTP is such a terrible idea for sensitive traffic.

JULES: Yes.

If someone with the right access can observe the network path and the data is plaintext, confidentiality is in trouble.

PARISA: HTTPS encrypts the HTTP conversation using TLS.

JULES: Which we’re giving its own episode because cryptography deserves more than “magic lock icon.”

PARISA: Good.


## Network Topology: Who Can Reach Whom?

PARISA: Here’s something I think developers underestimate.

We often think in application diagrams.

Browser. API. Database.

JULES: Security wants the network diagram too.

PARISA: Where does each thing live? What can actually connect?

JULES: Exactly.

Two services being logically related doesn’t mean they should be directly reachable from everywhere.

A database may need to accept traffic from an application server.

It probably does not need to accept arbitrary connections from the internet.

PARISA: The admin dashboard may need to be reachable from a management network but not from the guest Wi-Fi.

JULES: Yep.

PARISA: Build server needs GitHub. Maybe not unrestricted outbound access to literally everything.

JULES: You’re describing network controls already.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: “It’s inside the network, so it’s trusted.”

JULES: Please don’t do this.

PARISA: Old enterprise security loved a crunchy shell and soft center.

JULES: Perimeter security assumed the inside was much safer than the outside.

That made more sense when most devices were physically in one office and applications lived in one data center.

PARISA: Then laptops happened.

Cloud happened.

Phones happened.

Remote work happened.

SaaS happened.

Attackers stole credentials.

JULES: Exactly.

If malware gets onto one trusted internal device, a flat internal network can make lateral movement much easier.

PARISA: So “inside” is not an identity.

JULES: Beautifully put.

PARISA: I’m stealing that for Zero Trust next episode.


## What Does an Attacker See?

JULES: Let’s flip perspectives.

You deploy a server on the public internet.

What can an attacker learn without logging in?

PARISA: Public IP.

JULES: Yep.

PARISA: Open ports.

JULES: Yep.

PARISA: Services and sometimes versions.

JULES: Often.

PARISA: DNS information.

JULES: Yep.

PARISA: TLS certificates.

JULES: Public by design.

PARISA: Application behavior.

JULES: Absolutely.

PARISA: Error messages.

JULES: Sometimes much more revealing than developers intend.

PARISA: HTTP headers.

JULES: Yep.

PARISA: So reconnaissance is partly understanding the exposed network and services before trying to attack anything.

JULES: Exactly.

Tools can discover hosts, scan ports, fingerprint services, enumerate DNS, inspect certificates, and map reachable systems.

PARISA: Which sounds ominous until you realize administrators use the same tools to understand their own networks.

JULES: Correct.

The tool is not automatically malicious.

Context and authorization matter.

PARISA: `nmap` is not a crime.

JULES: Please do not put that on a shirt and test it on random corporate networks.

PARISA: Fine.


## Inbound and Outbound Both Matter

PARISA: We usually talk about attackers coming in.

JULES: Outbound traffic matters too.

PARISA: Because compromised software may call home.

JULES: Exactly.

Malware may need to contact command-and-control infrastructure.

An exploited server may download additional tools.

A compromised application may exfiltrate data.

PARISA: So a firewall that only worries about inbound traffic is missing half the conversation.

JULES: Potentially, yes.

Egress filtering—controlling outbound traffic—can reduce what compromised systems are able to do.

PARISA: But it can also be operationally annoying.

JULES: Security and convenience remain in their toxic little relationship.


## Common Protocols: What Security+ Wants You to Recognize

PARISA: Let’s do the spoken version without becoming a ports quiz.

JULES: Fine.

HTTP and HTTPS: web traffic.

SSH: secure remote shell and administration.

DNS: name resolution.

DHCP: network configuration.

SMTP, IMAP, POP3: email transport and retrieval.

FTP and TFTP: file transfer, both with important security limitations depending on use.

SFTP: file transfer over SSH.

LDAP and LDAPS: directory services, with LDAPS adding TLS protection.

RDP: remote desktop.

SNMP: network-device monitoring and management.

NTP: time synchronization.

PARISA: Time synchronization is a security concern?

JULES: Absolutely.

Logs from multiple systems are much harder to correlate if their clocks disagree.

Certificates and authentication protocols may also depend on time.

PARISA: Of course time itself has joined cybersecurity.

JULES: We secure reality in layers.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: I think the thing clicking for me is that security people don’t learn networking because they enjoy memorizing ports.

JULES: Some do.

PARISA: Those people frighten me.

JULES: Fair.

PARISA: They learn networking because communication creates the attack paths.

If I know the addresses, protocols, ports, routes, and boundaries, I can reason about what can actually reach what.

JULES: Exactly.

PARISA: An IP address tells me where traffic is headed.

A port tells me which service.

A protocol tells me the rules of the conversation.

Routing tells me how it gets there.

Subnetting and segmentation help decide who gets a road.

Encryption protects the conversation from being readable or tampered with.

JULES: And traffic analysis can show you what’s happening when something goes wrong.

PARISA: So networking is basically the map.

JULES: Yes.

PARISA: Security is asking which roads should exist, who should be allowed on them, what they’re carrying, and whether someone has quietly built a tunnel under the fence.

JULES: That metaphor can stay.


## Security+ Corner: What Do I Actually Need to Remember?

PARISA: Companion-note time.

JULES: For Security+, recognize common protocols, their purposes, and common ports.

Understand TCP versus UDP.

Know the difference between public and private IP addressing.

Understand basic subnetting, routing, NAT, network segmentation, DNS, DHCP, and network-device roles.

PARISA: And don’t memorize a port without knowing what service lives there.

JULES: Exactly. Exam questions often give you context.

If you recognize what the protocol does, the port number becomes less arbitrary.

PARISA: We’ll put the actual table in the companion.


## What Did We Actually Learn?

JULES: Networks exist so systems can communicate.

PARISA: Security cares because communication creates reachable paths.

JULES: IP addresses identify network destinations.

Ports identify services.

Protocols define communication rules.

PARISA: TCP emphasizes reliable ordered delivery.

UDP is lighter and does not provide TCP’s delivery guarantees.

JULES: DNS resolves names.

DHCP provides network configuration.

ARP maps local IPv4 addresses to link-layer addresses.

Routers move traffic between networks.

PARISA: Subnets divide networks into logical regions, which becomes very useful when we want to limit who can talk to whom.

JULES: Open ports and exposed services add attack surface.

PARISA: Network traffic can be inspected, manipulated, blocked, encrypted, logged, or abused.

JULES: And “inside the network” does not magically mean “trusted.”

PARISA: Which conveniently brings us to next time.

JULES: Firewalls.

PARISA: Fine.

JULES: Segmentation.

PARISA: Good.

JULES: VPNs.

PARISA: Reasonable.

JULES: Zero Trust.

PARISA: Ah, there’s the marketing phrase.

JULES: You’re going to like it more than you think.

PARISA: That sounds like a threat.

JULES: It’s a promise.

PARISA: In cybersecurity those are alarmingly similar.

[MUSIC]

PARISA: *Okay, But Why?* is the show where “the request succeeded” is not sufficient evidence that the request was a good idea.

JULES: Next time: how we decide which network conversations should be allowed at all.

PARISA: And why “we have a firewall” is not the end of the sentence.

[MUSIC OUT]
