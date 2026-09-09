# Episode 4: Authentication — Prove You're You

Status: Draft

**CAST**

PARISA — Experienced millennial web developer who remembers when password rules became progressively more deranged and everyone pretended that adding `!` to a reused password fixed things.

JULES — Gen Z developer who entered an industry already trying to escape passwords with password managers, MFA, hardware keys, OAuth, and passkeys.


[MUSIC]

PARISA: Your password must contain at least twelve characters, one uppercase letter, one lowercase letter, one number, one symbol, one Egyptian hieroglyph, and the name of a child you haven’t had yet.

JULES: Also it expires every thirty days.

PARISA: And you cannot reuse any of your last forty-seven passwords.

JULES: Security.

PARISA: No. Trauma.

JULES: Fair.

PARISA: Today we are talking authentication.

JULES: Prove you’re you.

PARISA: Which computers have historically implemented by asking humans to remember secrets humans are very bad at remembering.

JULES: This is going to be fun.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*

I’m Parisa.

JULES: And I’m Jules.

PARISA: Last time we built boundaries around networks.

Firewalls.

Segmentation.

VPNs.

Zero Trust.

JULES: And Zero Trust immediately made identity very important.

PARISA: Because “inside the network” is not identity.

JULES: Exactly.

PARISA: So today we need to answer a deceptively simple question.

Who are you?

JULES: More specifically: can you prove that identity claim?

PARISA: Authentication.


## Identification Is Not Authentication

PARISA: Let’s separate two words people casually merge.

JULES: Good.

**Identification** is claiming an identity.

PARISA: “I’m Parisa.”

JULES: Right.

**Authentication** is proving that claim.

PARISA: “Here is evidence that I’m Parisa.”

JULES: Exactly.

PARISA: Username is usually identification.

Password is authentication evidence.

JULES: Correct.

PARISA: And authorization comes after this.

JULES: Usually.

PARISA: We are giving authorization its own episode because “who are you?” and “what are you allowed to do?” are not the same question.

JULES: That distinction prevents a lot of bad architecture.


## Who Asked for Passwords?

JULES: Computers needed a way to distinguish authorized users from everyone else.

PARISA: Shared systems especially.

JULES: Right.

If multiple people can access a system, it needs some way to decide whether the person requesting access is legitimate.

The simplest scalable answer was a secret known by the user and the system.

PARISA: Password.

JULES: Exactly.

PARISA: And passwords are attractive because they’re cheap.

No special hardware.

No biometric sensor.

No external device.

Just type a secret.

JULES: Right.

PARISA: And then humans happened.

JULES: Humans always happen.


## Authentication Factors: Know, Have, Are

JULES: Authentication factors are often grouped by the type of evidence they provide.

Something you **know**.

PARISA: Password. PIN.

JULES: Something you **have**.

PARISA: Phone. Hardware token. Smart card.

JULES: Something you **are**.

PARISA: Fingerprint. Face. Iris.

JULES: Security+ may also talk about somewhere you are and something you do.

PARISA: Location and behavior.

JULES: Right.

PARISA: And MFA means using more than one factor type.

JULES: Exactly.

PARISA: Two passwords are not two-factor authentication.

JULES: Correct.

PARISA: Password plus security question is not two-factor authentication.

JULES: Correct. They’re both knowledge factors.

PARISA: Password plus authenticator app.

JULES: Knowledge plus possession.

PARISA: Password plus fingerprint.

JULES: Knowledge plus inherence.

PARISA: Good.


## Why Passwords Fail

PARISA: Let’s insult passwords carefully.

JULES: Passwords are not inherently useless.

A strong unique password can still be a valid authentication factor.

The problems come from how humans and systems handle them.

PARISA: Humans reuse them.

JULES: Yes.

PARISA: Choose predictable ones.

JULES: Yes.

PARISA: Get phished.

JULES: Yes.

PARISA: Put them on sticky notes.

JULES: Sometimes.

PARISA: Systems store them badly.

JULES: Very important.

PARISA: Leak them.

JULES: Yep.

PARISA: Force bizarre composition rules that create `Password1!`.

JULES: Exactly.

PARISA: So “password security” isn’t just “make users try harder.”

JULES: No. That’s one of the biggest lessons.

Authentication is a system design problem, not a moral test for users.


## How Passwords Should Be Stored

PARISA: Developer time.

If my application stores passwords, what should I do?

JULES: Never store plaintext passwords.

PARISA: Obviously.

JULES: Never encrypt passwords with the intention of decrypting them later for authentication.

PARISA: Because the application does not need the original password back.

JULES: Exactly.

Use a dedicated password-hashing function.

PARISA: Argon2id, bcrypt, scrypt, PBKDF2 depending on platform and requirements.

JULES: Right.

These are intentionally expensive compared with general-purpose hashes.

PARISA: Because attackers are going to guess.

JULES: Exactly.

If a password database is stolen, the attacker can try candidate passwords offline.

A fast hash lets them try guesses very quickly.

A password-hashing function deliberately increases the cost of each guess.

PARISA: And we salt each password.

JULES: Yes.

A **salt** is random data added to the password before hashing and stored alongside the hash.

PARISA: Not secret.

JULES: Correct.

PARISA: Its job is to make identical passwords produce different stored hashes and defeat precomputed lookup tables.

JULES: Exactly.

PARISA: Pepper?

JULES: A **pepper** is an additional secret value kept separately from the password database.

PARISA: Optional additional layer.

JULES: Right, and operationally more complicated because now you have to protect and rotate that secret properly.

PARISA: Security controls are never free.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: `md5($password)`.

JULES: Please don’t do this.

PARISA: `sha256(password)`.

JULES: Also please don’t do this.

PARISA: But SHA-256 is cryptographically secure.

JULES: For many purposes. It is not designed to be slow and memory-hard for password storage.

PARISA: So the problem is not merely “is this a good hash?”

It is “is this algorithm appropriate for passwords?”

JULES: Exactly.

PARISA: Context ruins all simple rules.

JULES: Welcome to cybersecurity.


## Credential Stuffing: Your Breach Becomes My Breach

JULES: Password reuse creates another problem: **credential stuffing**.

PARISA: An attacker gets username-password pairs from one breached service and tries them on other services.

JULES: Exactly.

PARISA: So my application may have never leaked anything, but if my user reused the same password elsewhere, I can still get compromised.

JULES: Right.

PARISA: Which is why unique passwords matter.

JULES: And password managers help.

PARISA: Because humans are bad at remembering fifty unrelated high-entropy secrets.

JULES: Password managers move the problem from “remember every password” to “protect one vault well.”

PARISA: Which is not risk-free, but is dramatically more realistic.

JULES: Exactly.


## Brute Force, Spraying, and Guessing

PARISA: Attack taxonomy.

JULES: A **brute-force attack** tries many possible passwords against an account or hash.

PARISA: Exhaustive or broad guessing.

JULES: Right.

**Password spraying** flips the pattern: try a small number of common passwords against many accounts.

PARISA: To avoid account lockouts.

JULES: Exactly.

PARISA: And credential stuffing uses known username-password pairs from other breaches.

JULES: Yep.

PARISA: Similar goal, different strategy.

JULES: Security+ loves those distinctions.


## Rate Limiting and Lockouts

PARISA: Online authentication gives us one advantage over stolen offline hashes.

JULES: The server can control the rate.

PARISA: Rate limiting.

Delays.

Temporary lockouts.

Risk-based challenges.

JULES: Exactly.

PARISA: But permanent account lockouts can be abused for denial of service.

JULES: Right.

If I can lock your account just by intentionally failing logins, I’ve gained a weapon.

PARISA: So controls need to balance attack resistance and availability.

JULES: The CIA triad keeps following us.


## MFA: One Stolen Thing Shouldn’t Be Enough

JULES: **Multi-factor authentication** reduces reliance on a single credential.

PARISA: If my password is stolen, the attacker still needs another factor.

JULES: Ideally, yes.

PARISA: SMS codes.

JULES: Better than password alone in many situations, but weaker than some alternatives.

PARISA: Because SIM swapping, phone-number takeover, phishing, interception risks.

JULES: Right.

PARISA: TOTP authenticator apps.

JULES: Stronger in many cases, but still phishable because the user can type the code into a fake site.

PARISA: Push notifications.

JULES: Convenient, but can be abused through push fatigue if users are bombarded with approval requests.

PARISA: “Approve sign-in?”

“No.”

“Approve sign-in?”

“No.”

“Approve sign-in?”

“Fine, fuck off.”

JULES: And the attacker wins.

PARISA: Humans remain part of the system.


## Phishing-Resistant MFA

JULES: Hardware security keys and passkeys improve things because authentication can be bound to the legitimate site.

PARISA: Meaning a fake website can’t simply ask me to copy over a reusable code.

JULES: Exactly.

Protocols like FIDO2 and WebAuthn use public-key cryptography.

PARISA: The authenticator keeps a private key.

The service gets the corresponding public key.

JULES: Right.

When you authenticate, the service sends a challenge.

Your authenticator signs it.

The private key does not need to be sent to the server.

PARISA: And the credential is scoped to the site or relying party.

JULES: Which is a big reason these approaches are resistant to phishing.

PARISA: This is the first authentication mechanism in the episode that sounds like it was designed after observing actual humans.


## Passkeys: Wait, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: So a **passkey** is basically a user-friendly way of using public-key credentials for account authentication.

JULES: Yes.

PARISA: Instead of the website storing a password verifier, it stores my public key.

JULES: Right.

PARISA: My private key stays with my authenticator ecosystem.

JULES: Correct.

PARISA: And I can unlock use of that credential with device authentication like a fingerprint, face, or PIN.

JULES: Yep.

PARISA: Important distinction: my fingerprint is not being sent to the website.

JULES: Exactly.

The local device uses the biometric to authorize use of the private credential.

PARISA: That is a really important privacy distinction.

JULES: Very.

PARISA: And passkeys can be synced across trusted devices depending on the platform, or hardware-bound depending on the implementation.

JULES: Right.

PARISA: This is actually pretty cool.

JULES: We got there.


## Biometrics: You Can’t Change Your Face Like a Password

PARISA: Biometrics sound convenient, but they have weird properties.

JULES: They do.

PARISA: My fingerprint is not secret in the same way a password is secret.

I leave fingerprints on things.

JULES: Correct.

PARISA: And if biometric data is compromised, I can’t rotate my fingers.

JULES: Exactly.

PARISA: So systems often store a biometric template, not a literal photograph of the biometric.

JULES: Right.

And biometric systems have false acceptance and false rejection rates.

PARISA: False acceptance: wrong person gets accepted.

False rejection: right person gets rejected.

JULES: Exactly.

PARISA: Which means tuning the threshold is another security-usability tradeoff.

JULES: Yep.


## FAR, FRR, and Crossover Error Rate

PARISA: Security+ has numbers for this, doesn’t it?

JULES: Terms, yes.

**FAR**, false acceptance rate.

**FRR**, false rejection rate.

And **CER**, crossover error rate, where the two rates intersect.

PARISA: Lower crossover error generally indicates better biometric accuracy.

JULES: Right.

PARISA: Companion notes.

JULES: Companion notes.


## Certificates and Smart Cards

JULES: Authentication can also use certificates and smart cards.

PARISA: Possession of a device plus cryptographic proof.

JULES: Exactly.

A smart card may hold a private key used to authenticate the user.

PARISA: Often paired with a PIN.

JULES: Which gives you possession plus knowledge.

PARISA: And certificates connect identity to public keys through PKI.

JULES: We’ll do PKI properly when we get to TLS and certificates.


## SSO: Please Let Me Log In Once

PARISA: Single sign-on.

JULES: **SSO** lets a user authenticate to an identity provider and then access multiple applications without separately authenticating to each one.

PARISA: Which is wonderful for users.

JULES: And administrators.

PARISA: Fewer passwords.

Centralized account lifecycle.

Centralized MFA policy.

JULES: Exactly.

PARISA: But if the identity provider account gets compromised—

JULES: Blast radius can be larger.

PARISA: Security tradeoff number eight thousand.

JULES: Centralization gives you powerful control and powerful concentration of risk.


## Federation: I Trust Their Login

JULES: **Federation** lets separate organizations or security domains trust identity assertions from one another.

PARISA: “I don’t manage your password. I trust this identity provider to tell me who you are.”

JULES: Exactly.

PARISA: Sign in with Google.

Sign in with Microsoft.

Enterprise SSO.

JULES: Those can use standards like SAML or OpenID Connect depending on context.

PARISA: We need to be careful here because developers confuse OAuth and authentication constantly.

JULES: We absolutely need to be careful.

PARISA: Say the line.

JULES: OAuth 2.0 is primarily an authorization framework.

PARISA: Thank you.

JULES: **OpenID Connect** adds an identity layer on top of OAuth 2.0 and is commonly used for authentication.

PARISA: So “OAuth login” is colloquial shorthand that can hide important details.

JULES: Exactly.

PARISA: We’ll get deeper into tokens and API auth later.


## Authentication vs. Session

PARISA: Here’s another developer distinction.

I authenticate once, but I make many requests afterward.

JULES: Right.

The application usually establishes a **session** or gives the client some form of token representing authenticated state.

PARISA: So the password does not get resent with every click.

JULES: Ideally no.

PARISA: Which means session management becomes part of authentication security.

JULES: Very much.

PARISA: Steal my session cookie and you may not need my password.

JULES: Exactly.

PARISA: So “we have MFA” does not save you if the attacker steals a valid authenticated session.

JULES: Correct.

PARISA: Which is why session cookies, token lifetime, revocation, secure flags, reauthentication, and device risk matter.

JULES: Whole future episode.


## Account Recovery Is Authentication Too

PARISA: Password reset.

JULES: Secretly one of the most important authentication flows.

PARISA: Because if I can bypass the strong login by clicking “forgot password,” the reset process is now the real front door.

JULES: Exactly.

PARISA: Security questions?

JULES: Often weak.

PARISA: Mother’s maiden name is not a cryptographic secret.

JULES: Correct.

PARISA: Email reset links?

JULES: Common, but then the security of the account partially depends on the user’s email account.

PARISA: Help-desk recovery?

JULES: Social-engineering target.

PARISA: So the strongest login flow can be undermined by weak recovery.

JULES: Security is only as strong as the easiest legitimate path an attacker can convincingly abuse.


## Adaptive and Risk-Based Authentication

JULES: Modern systems may also adjust authentication based on context.

PARISA: New device.

Impossible travel.

Unusual location.

Known compromised credential.

Suspicious IP reputation.

JULES: Exactly.

Instead of demanding the same friction on every request, the system can step up authentication when risk increases.

PARISA: That sounds useful, but also potentially creepy if implemented with huge amounts of behavioral tracking.

JULES: Absolutely.

PARISA: Security and privacy are related but not identical goals.

JULES: Correct.

A security control can still create privacy concerns.

PARISA: Good place to keep that visible.


## Password Policies That Make Things Worse

PARISA: Can we officially retire mandatory arbitrary password changes?

JULES: Many modern guidelines no longer recommend periodic password changes without evidence of compromise.

PARISA: Because humans respond by incrementing the number.

`Winter2026!`

`Spring2026!`

JULES: Exactly.

Forced rotation can encourage predictable passwords and unnecessary friction.

PARISA: Better controls include longer passwords, blocklists for known-compromised passwords, MFA, password managers, and changing credentials when compromise is suspected.

JULES: Right.

PARISA: Minimum length matters more than demanding a ritual sacrifice of punctuation.

JULES: Entropy and resistance to guessing matter more than whether the password contains exactly one exclamation mark.


## Please Don’t Do This, Part Two

[STING]

### PLEASE DON’T DO THIS

PARISA: “Your password is too long.”

JULES: Please don’t do this.

PARISA: Arbitrarily truncating user passwords.

JULES: Please don’t do this.

PARISA: Silently removing spaces.

JULES: Please don’t do this.

PARISA: Emailing the existing password back to the user.

JULES: That strongly suggests you can recover it, which is a giant warning sign.

PARISA: Storing plaintext.

JULES: Absolutely not.

PARISA: Logging passwords.

JULES: No.

PARISA: Putting passwords in URLs.

JULES: Please stop.

PARISA: I’m having fun now.

JULES: I’m not.


## Accessibility Is Authentication Security

PARISA: I want to talk accessibility because login systems love breaking it in the name of security.

JULES: Very true.

PARISA: CAPTCHAs that blind users cannot complete.

Time limits that punish people who need more time.

MFA flows that assume everyone can use a smartphone.

Biometric requirements that assume every user can provide the same biometric.

JULES: Security controls that block legitimate users damage availability.

PARISA: And inaccessible recovery can effectively lock someone out of their own account.

JULES: Exactly.

PARISA: So authentication needs secure alternatives.

Accessible labels.

Keyboard support.

Clear errors.

Enough time.

Multiple MFA options when possible.

JULES: And recovery paths that don’t collapse security while trying to be usable.

PARISA: This is not “accessibility after security.”

It is part of whether the authentication system works.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: My click is that authentication is evidence.

Not “enter password.”

Evidence.

JULES: Exactly.

PARISA: Something I know.

Something I have.

Something I am.

Sometimes contextual evidence like where I am or how I’m behaving.

JULES: Yep.

PARISA: MFA is stronger because one stolen thing doesn’t automatically prove the identity.

JULES: Right.

PARISA: And passkeys improve the model by using asymmetric cryptography instead of asking humans to invent and reuse shared secrets.

JULES: Exactly.

PARISA: But account recovery, sessions, federation, and identity providers all become part of the real authentication story.

JULES: Authentication is a system, not a form field.


## Security+ Corner

JULES: For Security+, understand authentication factors, MFA, biometrics, password attacks, password storage concepts, SSO, federation, certificates, smart cards, and common authentication technologies.

PARISA: Know the attack names.

JULES: Brute force, spraying, credential stuffing, phishing, push fatigue, replay where applicable.

PARISA: Know the biometric terms.

JULES: FAR, FRR, CER.

PARISA: And understand why a factor belongs to a category rather than just memorizing examples.

JULES: Exactly.


## What Did We Actually Learn?

PARISA: Identification is claiming an identity.

Authentication is proving it.

JULES: Passwords are knowledge factors.

Phones and hardware keys can be possession factors.

Biometrics are inherence factors.

PARISA: MFA requires different factor categories.

JULES: Passwords should be stored using dedicated salted password-hashing algorithms, not plaintext, reversible encryption, or fast general-purpose hashes.

PARISA: Rate limiting helps against online guessing.

Unique passwords help against credential stuffing.

Password managers make unique strong passwords practical.

JULES: MFA reduces dependence on one credential.

Phishing-resistant methods like FIDO2/WebAuthn can prevent users from handing reusable secrets to fake sites.

PARISA: Passkeys use public-key credentials and can remove the website’s need to store password verifiers.

JULES: SSO and federation improve usability and centralized control but increase the importance of the identity provider.

PARISA: Account recovery and session security are part of the authentication system whether we remember them or not.

JULES: And accessible authentication is not optional polish.

PARISA: Next time?

JULES: Authorization and IAM.

PARISA: So today was “Who are you?”

JULES: Next time is “Okay, but are you allowed to do that?”

PARISA: Finally.

The computer learns boundaries.

[MUSIC]

PARISA: *Okay, But Why?* is the show where adding another exclamation point is not considered a comprehensive authentication strategy.

JULES: Next time: permissions, roles, access control, and why being logged in does not mean being allowed everywhere.

[MUSIC OUT]
