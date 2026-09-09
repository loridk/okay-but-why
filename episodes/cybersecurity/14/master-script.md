# Episode 14: Sessions, Cookies, Tokens & API Security

Status: Draft

**CAST**

PARISA — Experienced web developer who has used sessions, cookies, API keys, and bearer tokens long enough to know that “token” is not a complete security design.

JULES — Developer prepared to explain why the thing proving you logged in is often not the thing you think it is.


[MUSIC]

PARISA: I logged in five minutes ago.

JULES: Good.

PARISA: Why am I not sending my password with every request?

JULES: Because that would be awful.

PARISA: So what is the browser sending?

JULES: Usually some representation of authenticated state.

PARISA: Session cookie.

JULES: Maybe.

PARISA: JWT.

JULES: Maybe.

PARISA: Bearer token.

JULES: Maybe.

PARISA: This episode already needs a whiteboard.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*

I’m Parisa.

JULES: And I’m Jules.

PARISA: We’ve authenticated. We’ve authorized. Now we need to stay authenticated long enough to use the damn application.

JULES: Which creates session security.


## Why Sessions Exist

JULES: HTTP is fundamentally request-response.

PARISA: Each request is its own thing.

JULES: Right.

But applications need continuity.

Who is this user?

What did they put in their cart?

Are they logged in?

PARISA: So we create a session.

JULES: A way to associate multiple requests with application state.


## Server-Side Sessions

PARISA: Classic model: server stores session data.

JULES: Yes.

PARISA: Browser gets an opaque random session identifier in a cookie.

JULES: Right.

PARISA: Request sends cookie. Server looks up session.

JULES: Exactly.

PARISA: Important property: session ID itself is effectively a credential.

JULES: Yes.

PARISA: Whoever possesses it may be able to use the session.

JULES: Which is why session IDs need high entropy, secure transport, safe storage, rotation, expiration, and revocation.


## Session Fixation

PARISA: Session fixation.

JULES: Attacker gets a victim to use a session ID the attacker already knows.

PARISA: Then victim logs in and server keeps the same ID.

JULES: Attacker reuses it and inherits authenticated state.

PARISA: Defense: regenerate session identifier after authentication or privilege changes.

JULES: Exactly.


## Session Hijacking

PARISA: Steal an existing valid session.

JULES: Session hijacking.

PARISA: Through XSS, malware, network exposure without TLS, leaked logs, browser compromise—

JULES: Several routes.

PARISA: MFA may not help after the session is stolen.

JULES: Correct.

PARISA: Which is why high-risk actions may require reauthentication.

JULES: Yes.


## Cookie Security Flags

PARISA: `Secure`.

JULES: Only send over HTTPS.

PARISA: `HttpOnly`.

JULES: Prevent JavaScript from reading the cookie.

PARISA: `SameSite`.

JULES: Restrict cross-site cookie sending behavior.

PARISA: `Path` and `Domain`.

JULES: Scope where the cookie is sent.

PARISA: All useful. None magic.

JULES: Exactly.


## Bearer Tokens

JULES: A bearer token means possession is enough to use it.

PARISA: Like cash.

JULES: Good metaphor.

PARISA: Whoever bears it can spend it.

JULES: Exactly.

PARISA: Which makes leakage dangerous.

JULES: Very.

PARISA: TLS protects it in transit.

JULES: Yes.

PARISA: But logging it, putting it in a URL, exposing it to script, or committing it still leaks it.

JULES: Correct.


## JWT: Format, Not Religion

PARISA: JWT.

JULES: JSON Web Token.

PARISA: It’s a token format.

JULES: Yes.

PARISA: Not automatically more secure than a server session.

JULES: Correct.

PARISA: Not automatically stateless in the useful operational sense.

JULES: Correct.

PARISA: Not encrypted by default.

JULES: Thank you.

PARISA: A standard signed JWT typically has readable claims plus a signature.

JULES: Exactly.

PARISA: So don’t put secrets in the payload just because it looks like gibberish after Base64URL encoding.

JULES: Base64 returns for revenge.


## Signed vs. Encrypted Tokens

PARISA: JWS.

JULES: JSON Web Signature.

PARISA: JWE.

JULES: JSON Web Encryption.

PARISA: Signed token protects integrity/authenticity of claims.

JULES: Right.

PARISA: Encrypted token protects confidentiality too.

JULES: Correct.

PARISA: Different goals.

JULES: Episode six sends its regards.


## Token Expiration

PARISA: Access tokens should expire.

JULES: Yes.

PARISA: Shorter lifetime limits damage from theft.

JULES: But increases refresh/re-auth complexity.

PARISA: Refresh token lasts longer and gets new access tokens.

JULES: Common pattern.

PARISA: So refresh tokens deserve stronger protection.

JULES: Absolutely.


## Revocation Is Harder With Self-Contained Tokens

PARISA: Server-side session? Delete session record.

JULES: Revoked.

PARISA: Self-contained JWT valid for an hour?

JULES: Unless you maintain revocation state or rotate keys/claims strategically, it may remain valid until expiration.

PARISA: Statelessness has a bill.

JULES: Always.


## API Keys

PARISA: API key identifies an application or caller.

JULES: Often.

PARISA: Usually long-lived shared secret.

JULES: Often.

PARISA: Not ideal for end-user authentication.

JULES: Correct.

PARISA: Scope it. Rotate it. Don’t put it in frontend JavaScript if it grants secret privileges.

JULES: Exactly.

PARISA: Browser code is delivered to the user.

JULES: So anything inside it should be considered inspectable.


## OAuth Again

PARISA: OAuth lets one system access another on a user’s behalf without sharing the user’s password.

JULES: Exactly.

PARISA: Authorization framework.

JULES: Yes.

PARISA: Scopes limit delegated permissions.

JULES: Right.

PARISA: “Read calendar” rather than “become entire Google account.”

JULES: That’s the idea.


## API Authorization

PARISA: Every API endpoint needs authorization.

JULES: Every protected operation.

PARISA: Even if route is “internal.”

JULES: Yes.

PARISA: Even if frontend doesn’t expose it.

JULES: Yes.

PARISA: Even if ID is UUID.

JULES: Episode five is clapping.


## Rate Limiting

JULES: APIs also need abuse controls.

PARISA: Rate limiting.

JULES: Helps against brute force, scraping, resource exhaustion, and accidental runaway clients.

PARISA: But rate limit strategy depends on identity, IP, endpoint, cost.

JULES: Exactly.


## Input Validation and Schema Validation

PARISA: APIs should reject malformed or unexpected input early.

JULES: Yes.

PARISA: Schema validation.

Types.

Ranges.

Required fields.

JULES: Good.

PARISA: Still not a substitute for injection-safe database access.

JULES: Correct.


## Error Handling

PARISA: Don’t return stack trace with database credentials.

JULES: Please don’t.

PARISA: Give clients useful stable errors.

Log sensitive diagnostics internally with appropriate access.

JULES: Exactly.


## Secrets in URLs

PARISA: Tokens in query strings.

JULES: Dangerous.

PARISA: URLs leak into browser history, logs, analytics, referrers.

JULES: Exactly.

PARISA: Use authorization headers or secure cookies as appropriate.

JULES: Yes.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: Store a long-lived bearer token in localStorage and then declare XSS irrelevant.

JULES: Please don’t.

PARISA: Put secrets in JWT payloads because “it’s encoded.”

JULES: Please don’t.

PARISA: Use one global API key with admin rights for every service.

JULES: Please don’t.

PARISA: Never expire sessions.

JULES: Please stop.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: A session or token is basically delegated continuity.

JULES: Nice.

PARISA: I proved identity once. The system gives me a credential representing that authenticated state.

JULES: Exactly.

PARISA: So protecting the session credential is as important as protecting the password during the session.

JULES: Yes.


## Security+ Corner

JULES: Understand sessions, cookies, bearer tokens, API keys, token expiration, OAuth concepts, secure transport, least privilege, rate limiting, and secrets handling.

PARISA: Developer depth: JWT is a format, not a security architecture.

JULES: Thank you.


## What Did We Actually Learn?

PARISA: Sessions carry authenticated state across requests.

JULES: Session identifiers and bearer tokens are credentials.

PARISA: Cookies need Secure, HttpOnly, SameSite, and sensible scope.

JULES: Tokens need expiration, safe storage, appropriate scopes, and revocation strategy.

PARISA: APIs require authentication, authorization, validation, abuse controls, and safe error handling.

JULES: Next: OWASP and threat modeling.

PARISA: Structured pessimism returns.

[MUSIC OUT]
