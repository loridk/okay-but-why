# Episode 7: HTTPS, TLS, Certificates & PKI — Who Says This Is Really the Website?

Status: Draft

**CAST**

PARISA — Experienced web developer who has configured SSL certificates, fixed mixed-content problems, and at least once stared at a browser certificate warning like it had personally betrayed her.

JULES — Modern-stack developer who grew up in a web where HTTPS is expected and would like everyone to stop calling every certificate “SSL.”


[MUSIC]

PARISA: My SSL certificate expired.

JULES: TLS certificate.

PARISA: Nobody likes you.

JULES: SSL is obsolete.

PARISA: The hosting panel says SSL.

JULES: The hosting panel is choosing violence.

PARISA: Fine.

My TLS certificate expired and the browser has turned my perfectly innocent website into a crime scene.

JULES: That is because the browser no longer has enough evidence that the connection is trustworthy.

PARISA: Dramatic.

JULES: Security warnings are supposed to be dramatic.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*

I’m Parisa.

JULES: And I’m Jules.

PARISA: Last time we learned cryptographic primitives.

Symmetric encryption.

Asymmetric encryption.

Hashes.

Signatures.

Keys.

JULES: Today we use them in one of the most important security protocols developers interact with every day.

PARISA: HTTPS.

JULES: More specifically, HTTP protected by TLS.

PARISA: And finally we explain what the browser lock icon was actually doing all those years.


## HTTP Has a Problem

JULES: Plain HTTP sends application data without TLS protection.

PARISA: Which means someone able to observe the traffic path may be able to read it.

JULES: Confidentiality problem.

PARISA: Or modify it.

JULES: Integrity problem.

PARISA: Or impersonate the server.

JULES: Authenticity problem.

PARISA: So HTTPS exists because the network itself is not automatically trustworthy.

JULES: Exactly.

PARISA: Coffee-shop Wi-Fi.

ISP.

Corporate proxy.

Compromised router.

Malicious access point.

JULES: Any untrusted or compromised point in the path is why we want end-to-end protection between client and server.

PARISA: TLS gives us that protected channel.

JULES: Correct.


## SSL vs. TLS

PARISA: Let’s settle the naming thing.

JULES: SSL came first.

Secure Sockets Layer.

PARISA: Old protocol family.

JULES: Obsolete and insecure.

TLS—Transport Layer Security—is the modern successor.

PARISA: People still casually say SSL certificate.

JULES: Constantly.

PARISA: Hosting companies still say SSL.

JULES: Constantly.

PARISA: So if someone says “SSL certificate” in normal conversation, we usually know they mean a certificate used with TLS.

JULES: Correct.

PARISA: But technically, modern HTTPS should use TLS.

JULES: Yes.


## What Does TLS Actually Give Us?

JULES: Three big properties.

Encryption.

Integrity.

Authentication.

PARISA: Encryption so observers can’t read the HTTP contents.

JULES: Right.

PARISA: Integrity so traffic can’t be modified undetectably.

JULES: Yes.

PARISA: Authentication so the client can gain confidence it’s talking to the intended server.

JULES: Exactly.

PARISA: That last one is where certificates and PKI come in.

JULES: Yep.


## The Chicken-and-Egg Problem

PARISA: I type `https://example.com`.

How does my browser know the server it reached is really `example.com`?

JULES: The server presents a digital certificate.

PARISA: Certificate contains identity information and a public key.

JULES: More precisely, the certificate binds a public key to one or more names and contains metadata, validity dates, issuer information, and a digital signature from the issuer.

PARISA: The browser verifies the certificate.

JULES: Yes.

PARISA: But now I have another problem.

Why should I trust the issuer?

JULES: Welcome to PKI.


## PKI: Trust Needs Infrastructure

JULES: **Public Key Infrastructure**, PKI, is the broader system of certificates, certificate authorities, policies, keys, validation, and trust relationships.

PARISA: Not one server.

JULES: Correct.

PARISA: The browser has a trust store containing root certificate authorities it accepts.

JULES: Right.

PARISA: A website certificate is usually signed by an intermediate CA.

JULES: Yes.

PARISA: And that intermediate traces back to a trusted root.

JULES: Exactly.

PARISA: Certificate chain.

JULES: There it is.


## Root, Intermediate, Leaf

PARISA: Let’s make the chain explicit.

JULES: **Root CA** is the trust anchor.

Its certificate is typically self-signed and distributed through operating systems, browsers, or managed trust stores.

PARISA: We trust it because it was placed in the trusted store through some external process.

JULES: Exactly.

PARISA: Root signs or authorizes intermediates.

JULES: Usually.

PARISA: Intermediate signs website certificates.

JULES: Commonly.

PARISA: Website certificate is the leaf or end-entity certificate.

JULES: Right.

PARISA: Why not have root CAs sign every website directly?

JULES: Protect the root keys.

Root keys can be kept offline or used rarely.

If an intermediate is compromised, it can be revoked without replacing the entire root trust anchor.

PARISA: Blast radius.

JULES: Again.


## Certificate Validation

PARISA: What does the browser check?

JULES: Several things.

Is the certificate currently valid?

Is the requested hostname included?

Does the certificate chain lead to a trusted root?

Are the signatures valid?

Has the certificate been revoked, where revocation checking applies?

Are the algorithms and parameters acceptable?

PARISA: So if the certificate says `evil.example` but I requested `bank.example`, browser says no.

JULES: Correct.

PARISA: If the certificate expired yesterday, browser says no.

JULES: Correct.

PARISA: If it’s self-signed and not explicitly trusted, browser says no.

JULES: Typically, yes.

PARISA: Security warnings are evidence failures.

JULES: Nice way to put it.


## Domain Validation and Identity

PARISA: Certificates prove who owns the company, right?

JULES: Careful.

Many common web certificates are **Domain Validation**, DV.

They primarily prove control over the domain name at issuance time.

PARISA: Not “this company is morally trustworthy.”

JULES: Correct.

PARISA: HTTPS means “encrypted connection to the holder of a valid certificate for this domain,” not “this website is safe.”

JULES: Extremely important.

PARISA: A phishing site can have HTTPS.

JULES: Yes.

PARISA: The lock icon does not mean “good person.”

JULES: It means the connection has TLS protection and the certificate validated according to the browser’s rules.

PARISA: Security UI spent years accidentally teaching people “lock equals safe.”

JULES: Which was never the full story.


## The TLS Handshake

PARISA: Okay. How does the connection get established?

JULES: Simplified TLS 1.3 version.

The client says hello and offers supported cryptographic parameters.

The server responds with its choices and certificate.

They perform a key exchange.

The client validates the certificate.

Both sides derive symmetric session keys.

Then application traffic is encrypted.

PARISA: So asymmetric crypto helps establish trust and shared secrets.

Symmetric crypto handles the actual bulk data.

JULES: Exactly what we discussed last episode.

PARISA: Hybrid cryptography in the wild.

JULES: Yep.


## Ephemeral Key Exchange and Forward Secrecy

PARISA: Forward secrecy.

JULES: Modern TLS commonly uses ephemeral Diffie-Hellman key exchange.

PARISA: Meaning temporary key material is generated for the session.

JULES: Right.

PARISA: So if the server’s long-term private key is stolen later, old recorded sessions should not automatically become decryptable.

JULES: That’s the goal of forward secrecy.

PARISA: Nice.

JULES: Very.


## Why Certificates Expire

PARISA: Why do certificates expire?

JULES: Several reasons.

Limit the lifetime of credentials.

Force periodic revalidation.

Reduce exposure if keys or information become stale.

Encourage algorithm and ecosystem updates.

PARISA: Operational downside: expired certificates cause outages.

JULES: Availability.

PARISA: Security has once again broken the website to keep it secure.

JULES: Automated certificate renewal is your friend.

PARISA: Let’s Encrypt changed the web here.

JULES: Massively.

Free automated DV certificates made HTTPS much easier to deploy at scale.

PARISA: Which is a reminder that good security gets adopted faster when it stops being painful.


## Private Keys: Please Protect the Actual Secret

PARISA: Certificate is public.

JULES: Correct.

PARISA: Private key is not.

JULES: Extremely not.

PARISA: If attacker steals the server private key—

JULES: Severity depends on protocol configuration and timing, but it is serious.

They may impersonate the server under some conditions until the credential is revoked or expires.

PARISA: So certificate management includes protecting private keys.

JULES: Yes.

Hardware Security Modules, cloud key services, restricted permissions, rotation, monitoring.

PARISA: Not `private-key.pem` emailed to five developers.

JULES: Please don’t.


## Certificate Revocation

PARISA: If a certificate is compromised before expiration?

JULES: It can be revoked.

PARISA: CRL.

JULES: Certificate Revocation List.

PARISA: OCSP.

JULES: Online Certificate Status Protocol.

PARISA: Browser asks whether the certificate is still good.

JULES: Conceptually, yes.

Real browser revocation behavior has complexities and tradeoffs around privacy, performance, and failure handling.

PARISA: Security infrastructure is never just one clean request.

JULES: Correct.


## OCSP Stapling

PARISA: Stapling.

JULES: The server can fetch a signed OCSP response from the CA and provide it to the client during the handshake.

PARISA: So every browser doesn’t have to contact the CA directly.

JULES: Exactly.

PARISA: Better privacy and potentially better performance.

JULES: Yes.


## HSTS: Please Stop Downgrading Me

PARISA: HTTP Strict Transport Security.

JULES: **HSTS** tells browsers to use HTTPS for the site and not fall back to plain HTTP.

PARISA: Protects against downgrade opportunities like SSL stripping.

JULES: Yes.

PARISA: Browser remembers the site requires HTTPS.

JULES: For the configured period.

PARISA: And preload lists can make that policy known before the first visit.

JULES: Right.

PARISA: Useful, but configure carefully because long-lived HSTS mistakes can be painful.

JULES: Security policy has consequences.


## Mixed Content

PARISA: HTTPS page loads an HTTP script.

JULES: Bad.

PARISA: Because the main document is encrypted but the script can potentially be modified in transit.

JULES: Exactly.

PARISA: Which could compromise the whole page.

JULES: Yes.

PARISA: Browsers block many kinds of active mixed content for this reason.

JULES: Defense in depth through browser policy.


## TLS Termination

PARISA: Cloud architecture complication.

Sometimes TLS ends at a load balancer or reverse proxy.

JULES: Right.

That’s **TLS termination**.

PARISA: Client has encrypted connection to the edge.

Then the proxy talks to backend systems.

JULES: Which may use another encrypted connection or, depending on architecture, plaintext inside a trusted network.

PARISA: Security question becomes whether the backend path should also be encrypted.

JULES: Exactly.

PARISA: “HTTPS at the edge” does not automatically mean every internal hop is encrypted.

JULES: Correct.


## Mutual TLS

PARISA: Usually the server proves its identity to the client.

JULES: With **mutual TLS**, mTLS, the client also presents a certificate.

PARISA: Both sides authenticate with certificates.

JULES: Exactly.

PARISA: Common for service-to-service communication.

JULES: Yes, especially in controlled environments.

PARISA: Operationally more complicated.

JULES: Certificate issuance, rotation, revocation, trust distribution.

PARISA: Security controls: now with paperwork.


## Certificate Pinning

PARISA: Pinning?

JULES: Certificate or public-key pinning restricts which certificates or keys an application accepts.

PARISA: Additional protection against misissued certificates.

JULES: Potentially, but operationally risky.

PARISA: Rotate the certificate wrong and your app locks itself out.

JULES: Exactly.

PARISA: Browser HPKP died for reasons.

JULES: It was removed largely because the failure modes were severe.

PARISA: Good example of “stronger security control” not automatically meaning “better system.”


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: Disable certificate validation because development is annoying.

JULES: Please don’t do this.

PARISA: Click through certificate warnings in production.

JULES: Please don’t do this.

PARISA: Ship private keys in the repository.

JULES: No.

PARISA: Use self-signed certs publicly and tell users to ignore the warning.

JULES: Absolutely not.

PARISA: Assume HTTPS means the website itself is trustworthy.

JULES: Also no.

PARISA: Put sensitive content on HTTP because “it’s internal.”

JULES: You are trying to make this segment longer.


## HTTPS Does Not Secure the Application

PARISA: Important distinction.

HTTPS protects transport.

JULES: Correct.

PARISA: It does not fix SQL injection.

JULES: Correct.

PARISA: Does not fix broken authorization.

JULES: Correct.

PARISA: Does not prevent the server itself from being compromised.

JULES: Correct.

PARISA: Does not prevent a legitimate website from being malicious.

JULES: Correct.

PARISA: It protects the channel between endpoints.

JULES: Exactly.

PARISA: Control scope again.

JULES: Security makes much more sense once you stop asking controls to solve problems they weren’t designed for.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: The lock icon is basically the visible end of an enormous trust system.

JULES: Yep.

PARISA: Browser trusts root CAs.

Root authorizes intermediates.

Intermediate signs site certificate.

Browser verifies chain, hostname, validity, and signatures.

TLS performs a handshake.

Both sides derive symmetric keys.

Then HTTP travels inside the protected channel.

JULES: Exactly.

PARISA: Which means HTTPS is not “the server has a certificate.”

It is certificate validation plus cryptographic negotiation plus encrypted authenticated transport.

JULES: Beautiful.

PARISA: I have been under-appreciating that lock.


## Security+ Corner

JULES: For Security+, know PKI components, CAs, roots, intermediates, certificate chains, revocation, CRLs, OCSP, certificate types, TLS, key exchange, public and private keys, and certificate lifecycle concepts.

PARISA: Understand what HTTPS guarantees and what it doesn’t.

JULES: Very important.

PARISA: And remember SSL is legacy terminology.

JULES: Thank you.


## What Did We Actually Learn?

PARISA: HTTP alone doesn’t provide confidentiality, integrity, or server authentication.

JULES: HTTPS is HTTP over TLS.

PARISA: TLS uses cryptography to authenticate endpoints and protect traffic.

JULES: Certificates bind public keys to names or identities.

PARISA: PKI provides the trust infrastructure around those certificates.

JULES: Certificate chains trace from leaf to intermediate to trusted root.

PARISA: Browsers validate hostname, dates, signatures, trust chain, and other policy.

JULES: Modern TLS uses asymmetric mechanisms to establish shared secrets and symmetric cryptography for efficient protected traffic.

PARISA: HSTS helps prevent downgrade to HTTP.

mTLS authenticates clients with certificates too.

JULES: And HTTPS protects the connection, not the moral character or application security of the website.

PARISA: Next time?

JULES: Social engineering and credential attacks.

PARISA: So after six episodes of machines, we finally attack the most chaotic component.

JULES: Humans.

PARISA: Excellent. We’re doomed.

[MUSIC]

PARISA: *Okay, But Why?* is the show where the lock icon means something specific and unfortunately not “everything is fine.”

JULES: Next time: phishing, pretexting, MFA fatigue, and why attackers would rather trick you than break AES.

[MUSIC OUT]
