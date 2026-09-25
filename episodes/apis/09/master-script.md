# Episode 9: OAuth: Why Is "Sign In With Google" So Complicated?

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Unrecorded; final timing depends on performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: I clicked one button and visited three locations, approved something, and came back holding a code.

JULES: OAuth flow?

PARISA: That or an unusually bureaucratic escape room.

JULES: Did anybody ask you to give the application your account password?

PARISA: No.

JULES: That's a significant part of why the escape room exists.

[STING]

## The Password Is Too Much Power

JULES: Welcome to Okay, But Why? Start with the problem: an application wants limited access to something in another service on your behalf. How can you permit that without giving the application your password?

PARISA: Suppose a fictional delivery planner wants to add a delivery reminder to my calendar. I don't want to give it my calendar account password and hope it develops restraint.

JULES: Exactly. A password can grant far more access than this integration needs. It can be hard to revoke one application's use without changing the password everywhere, and the application now has a valuable secret to protect.

PARISA: So we want a separate grant: this application may do these things, under these conditions, and I can withdraw that access.

JULES: That's delegated authorization. OAuth provides a framework for it. It's primarily about access, not establishing user identity for login.

PARISA: Which is already awkward for an episode whose title includes Sign In With Google.

JULES: We will resolve that. OpenID Connect adds the identity layer people often mean in that scenario. But the underlying authorization problem deserves to make sense first.

## Give the Participants Jobs

JULES: The resource owner is the person or entity able to authorize access. In our calendar example, that's you.

PARISA: The client is the planner application requesting delegated access. Client doesn't mean it must be browser-only; it could have a backend.

JULES: The authorization server handles the authorization process and issues tokens. The resource server hosts the protected API, such as calendar operations.

PARISA: Those last two may belong to the same provider, but they're different responsibilities. One grants access; the other receives API requests using that access.

JULES: Exactly. The user normally authenticates with the authorization provider through its own interface, not by entering that provider's password into the planner.

PARISA: The planner learns that it received a grant. It doesn't need to learn my password to the calendar account.

JULES: Right. That separation is the point, not an accidental detour.

## Scopes Describe Requested Access

PARISA: Where does “only add a reminder” get expressed?

JULES: Through permissions the provider defines, commonly represented as scopes. The client requests a set of scopes. The authorization server decides what can be granted, involving the user when appropriate.

PARISA: Scope names aren't a universal vocabulary. A string like calendar.write means whatever that provider's contract says it means.

JULES: Exactly. And the UI should request the least access needed for the actual feature. A reminder tool shouldn't casually ask to read all email because the checkbox happened to be nearby.

PARISA: Consent isn't meaningful if the request is vague or wildly broader than the task.

JULES: Also, a granted scope doesn't replace every resource-level check. The resource server still enforces account boundaries, ownership, and its policy.

PARISA: And the token can be restricted to an intended resource or audience. Authorization isn't just a bag of verbs floating without a destination.

## The Client Registers Its Return Address

JULES: Before the normal interactive flow, the application is configured with the provider. That includes a client identifier and permitted redirect URIs, among other settings.

PARISA: The client ID identifies the application registration. It isn't automatically a secret.

JULES: Correct. A redirect URI is where the authorization response may be sent. Strict matching prevents an attacker from casually substituting their own destination and receiving the result.

PARISA: This is why “just allow any redirect URL” is an alarming fix for a development error.

JULES: Exactly. Redirect validation is part of keeping the authorization response attached to the intended application.

PARISA: Does every client get a secret?

JULES: No. A confidential client, such as a protected server application, can keep a credential. A browser bundle or installed native application cannot reliably keep a shared client secret from the person running it. Those are public clients in OAuth terminology.

PARISA: Public doesn't mean unauthorized. It describes the client's ability to protect that particular kind of credential.

## Walk the Authorization Code Flow

JULES: Let's narrate a modern authorization code flow using PKCE. We'll keep the names attached to actual jobs.

PARISA: The planner starts a new authorization attempt. It records the context it needs to safely connect the eventual response to this attempt.

JULES: It also creates a fresh, unpredictable code verifier and derives a code challenge from it, normally using the S256 method. The challenge goes into the authorization request; the verifier is retained for the later exchange.

PARISA: We'll explain why in a moment. For now: one secret value stays with this attempt, and a derived value goes ahead.

JULES: The browser navigates to the provider's authorization endpoint. The request identifies the client, redirect URI, requested scopes, and relevant protections for the flow.

PARISA: I interact with the provider. If necessary, I sign in there. I can approve or deny the requested access according to the provider's process.

JULES: If the authorization succeeds, the provider redirects the browser to the registered callback with a short-lived authorization code.

PARISA: That code isn't the access token. It's an intermediate credential used in the exchange.

JULES: Correct. The client validates the authorization response and sends the code to the token endpoint, along with the PKCE verifier and other required information. A confidential client also authenticates itself as required.

PARISA: The authorization server checks the exchange and can issue an access token, with a refresh token if the grant and provider policy allow one.

JULES: The client then uses the access token to call the protected calendar API. The resource server checks it and enforces permission.

[CODE CARD: Conceptual flow; security parameters omitted from this sketch]
```text
Planner -> Authorization server: request limited calendar access
User -> Authorization server: authenticate and authorize as required
Authorization server -> Planner callback: short-lived code
Planner -> Token endpoint: code + PKCE verifier + required client checks
Token endpoint -> Planner: access token, possibly refresh token
Planner -> Calendar API: request with access token
```

PARISA: That card is a map of roles, not a complete implementation recipe. We use supported libraries and current provider guidance for the precise parameters and checks.

## Why Not Send the Access Token Immediately?

JULES: The code flow separates the browser-facing authorization response from the token exchange. The code is constrained and short-lived, and the exchange can verify conditions before issuing usable tokens.

PARISA: PKCE means Proof Key for Code Exchange. Its challenge and verifier bind the exchange to the client instance that started the request. An intercepted code alone shouldn't be enough for somebody else to redeem it.

JULES: Exactly. It doesn't mean the entire flow is immune to every attack. Correct redirect handling, response validation, trusted endpoints, and application security still matter.

PARISA: And state commonly binds the callback to the initiating browser interaction and carries or references appropriate local context. It must be unpredictable where used as a security value and verified, not just sent and forgotten.

JULES: Right. OIDC can also use a nonce to bind an ID token to an authentication request. Different values solve different problems. Don't merge them into one decorative random string because their names all sound vaguely procedural.

PARISA: The redirects aren't there to waste our afternoon. The user talks to the provider, and the result returns to the right application without handing the provider password to that application.

## Access Tokens Are for APIs

JULES: An access token authorizes access to a protected resource within its limits. The client should treat its format according to the provider's contract. It may be opaque or structured.

PARISA: The planner shouldn't assume every token is a JWT it can decode for user information. And decoding something wouldn't verify it anyway.

JULES: Exactly. The resource server must validate access tokens appropriately, perhaps through local verification or an authorized introspection mechanism, depending on the system.

PARISA: The client sends an access token to the intended resource server, not to whichever unrelated URL appears in a response. Tokens have destinations and trust boundaries.

JULES: Correct. Overbroad audiences and casual forwarding can undermine the restrictions the flow was supposed to establish.

## Refresh Tokens Keep the Delegation Alive

PARISA: Access tokens expire. Do I have to click through the whole flow every ten minutes?

JULES: Not necessarily. A refresh token can let the client obtain new access tokens without repeating the interactive authorization each time, within the provider's policy.

PARISA: It goes to the authorization server's token endpoint, not to the calendar API as if it were another access token.

JULES: Exactly. A refresh token often represents longer-lived authority, so it needs strong protection. Rotation or sender-constraining and replay detection are important protections in relevant designs, especially for public clients.

PARISA: Rotation means the exchange can issue a new refresh token and invalidate the previous one according to the protocol and provider's rules. Reusing an old one can be evidence of theft.

JULES: Right. Applications must implement the lifecycle correctly and avoid concurrency mistakes that accidentally reuse superseded credentials.

PARISA: And the user can revoke the grant, the provider can change policy, or the refresh token can expire. “Refresh” is not a guarantee of eternal access.

## So How Does Sign-In Enter the Picture?

JULES: OAuth alone doesn't define a standardized authentication assertion telling the client who signed in. OpenID Connect, or OIDC, builds an identity layer on top of OAuth 2.0.

PARISA: So a Sign In With button often starts an OIDC flow using OAuth's machinery. The application requests the openid scope and receives an ID token as part of the supported flow.

JULES: Exactly. The ID token contains claims about the authentication and subject, intended for the client. The client validates it according to OIDC rules, including signature and relevant issuer, audience, timing, and nonce checks.

PARISA: An ID token isn't a substitute access token for some arbitrary API. Different recipient, different purpose.

JULES: Correct. And account linking needs care. A stable subject identifier is interpreted within its issuer. Matching accounts casually by an unverified email string can create serious mistakes.

PARISA: After successful OIDC sign-in, our application might create its own local session. The provider's identity assertion and our application's ongoing session are distinct pieces.

JULES: Exactly. That's why “we use Google login” doesn't completely describe the session behavior of the resulting application.

## Failure Is a Valid Outcome

PARISA: The user denies access. Is that an error in their behavior?

JULES: No. It's a legitimate outcome. The application should explain that the optional integration wasn't connected and preserve useful functionality where possible.

PARISA: The user closes the window, the response arrives after their session context changed, the code expires, or the provider is unavailable. We need recovery paths that don't quietly accept an unverified response.

JULES: Exactly. Do not disable validation to make the happy path work. Fix the configuration or use the library's documented flow.

PARISA: And don't log the entire callback URL indiscriminately. Authorization codes and other sensitive values can show up there.

JULES: Correct. Troubleshooting needs enough detail to identify the stage without creating another credential exposure.

## Not Every OAuth Use Has a Human Redirect

JULES: We focused on an interactive delegated flow. OAuth also supports other arrangements. A service acting on its own behalf may use client credentials, for example.

PARISA: No human consent screen is automatically involved in that request. The grant represents the application's own authority under its registration and policy.

JULES: Right. And device-oriented flows solve different interaction constraints. Choose a supported flow for the actual client type rather than treating every OAuth diagram as interchangeable.

PARISA: We also aren't teaching older password-sharing or implicit-token approaches as the default. Current security guidance favors authorization code with appropriate protections for the interactive scenario we're discussing.

JULES: Exactly. Standards and provider capabilities evolve, which is why production configuration should follow maintained libraries and current official documentation.

## Where the Browser Stops and the Backend Starts

PARISA: Our planner has a backend. Walk through which parts happen there, because the redirect makes the browser seem responsible for everything.

JULES: The browser carries the user through the provider's authorization interface and back to the application's registered callback. In a server-side client design, the backend can receive that callback, validate it, and perform the token exchange.

PARISA: Then it can keep provider tokens server-side and maintain its own session with the browser. The browser doesn't necessarily need the calendar access token itself.

JULES: Exactly. A browser-only application has a different credential exposure and storage model. Both can use supported authorization flows, but their ability to protect secrets differs.

PARISA: So a tutorial for a server-rendered web application isn't automatically a secure recipe for a static browser app, even if both have a button labeled Connect calendar.

JULES: Right. Client type changes the assumptions. That's why we select a library and provider configuration for the actual architecture rather than transplanting isolated snippets.

## A Code Is Not a Receipt You Can Reuse Forever

PARISA: The browser returns with a code. We exchange it successfully. Later a bug tries to exchange the same code again. What should we expect?

JULES: Authorization codes are short-lived and intended for one use. The authorization server binds them to relevant aspects of the grant and client exchange. A replay should not provide unlimited new tokens.

PARISA: That explains why refreshing a callback page can expose poor application flow handling. The application should finish the callback cleanly and navigate to an appropriate state, not keep redeeming the same URL forever.

JULES: Exactly. Avoid retaining sensitive callback parameters unnecessarily. Handle errors without echoing credentials into pages or logs.

PARISA: And if the exchange failed in an uncertain way, we follow the library and provider's recovery guidance. We don't invent our own scheme for repeatedly recycling an expired or already-used code.

JULES: Right. The code is a constrained intermediate credential. Its constraints are part of what makes the flow safer.

## Consent Is About a Specific Grant

JULES: Imagine the planner initially requests permission to add a reminder. A month later, a new feature wants broader calendar access. Does the old grant automatically authorize it?

PARISA: No. The client needs the relevant permission under the provider's process. A previous relationship isn't permission for every future feature.

JULES: Exactly. Incremental authorization can request additional access when a feature actually needs it, where supported. The user should understand why the request changed.

PARISA: And the application must handle a partial or narrower grant if the provider's flow permits that. Don't assume requested scopes always equal granted scopes.

JULES: Correct. Check the actual result and disable or adapt features that lack permission. Failing gracefully is better than turning every API rejection into an unexplained spinner.

PARISA: If the user disconnects the integration, the application should stop using the grant and perform the appropriate cleanup or revocation. Removing a decorative Connected badge isn't enough.

## A Sign-In Result Becomes an Application Decision

PARISA: OIDC tells our application about an authenticated subject. Does that mean we should automatically create an administrator account for them?

JULES: No. OIDC supplies identity information under a trust relationship. Our application decides account provisioning, membership, roles, and access according to its own policy.

PARISA: A valid identity from a trusted issuer can still be a person who has no membership in our private staff application.

JULES: Exactly. Authentication is necessary for many access decisions, but it isn't the decision itself. Check the intended audience and issuer, then apply local authorization rules.

PARISA: And if two identity providers both issue subject 123, those aren't automatically the same person. The issuer gives the identifier its context.

JULES: Right. Account linking must be an explicit, secure process. Convenient assumptions about email strings or subject values can accidentally merge unrelated identities.

## Protect the Start as Well as the Finish

JULES: We spend a lot of attention on the callback, but starting the correct flow matters too. The application should know which provider and intended action belong to the attempt.

PARISA: Otherwise a response could be attached to the wrong browser interaction or the wrong provider context. That's why libraries manage more state and validation than a homemade “redirect and hope” function.

JULES: Exactly. Validate returned context, use trusted endpoint configuration or validated discovery, and follow the protocol's protections. A URL supplied by an untrusted party isn't automatically a safe token destination.

PARISA: Again, the authorization code and token exchange involve credentials. Sending them to the wrong server can destroy the separation we carefully built.

JULES: Right. The many checks aren't all solving the same attack. Redirect restrictions, PKCE, response binding, issuer validation, and token validation reinforce different boundaries.

## Debug by Stage

PARISA: OAuth failed is becoming our new API broken. How do we make it smaller?

JULES: Identify the stage. Did the authorization request reach the intended provider? Did the user deny access? Did the redirect match the registered value? Did the callback pass local validation? Did the code exchange succeed? Did the API accept the issued access token?

PARISA: Different stage, different evidence. A redirect mismatch doesn't call for changing the API's resource permissions. An audience mismatch doesn't mean we should skip signature verification.

JULES: Exactly. Preserve safe diagnostic identifiers and provider error categories, while redacting codes, tokens, and secrets. Use the maintained library's diagnostic guidance rather than dumping the entire exchange publicly.

PARISA: And when a configuration problem is fixed, test denial and expired-state paths too. A successful login proves one path worked; it doesn't prove our application rejects the wrong responses.

JULES: Right. Security includes being predictably unwilling to proceed when the evidence isn't valid.

## The Benefit Under the Redirects

PARISA: The practical payoff is separation. The provider authenticates the user without sharing their password with the planner. The planner receives a limited grant. The resource server checks the access token and its own rules.

JULES: Exactly. The user can authorize one relationship without giving the application the keys to their entire digital life. The details are complex because the parties and channels have different trust properties.

PARISA: Understanding those roles doesn't mean I should hand-write OAuth. It means I can choose and configure established implementations intelligently, and recognize which shortcuts would undermine the point.

## The Escape Room Has an Explanation

PARISA: OAuth lets an application obtain limited access without collecting the user's password to the other service. Roles separate the user, requesting application, grant issuer, and protected API.

JULES: Scopes and audience limit authority. The code flow and its protections keep the authorization response and token exchange attached to the intended client interaction. Access tokens go to APIs; refresh tokens renew access when allowed.

PARISA: OIDC adds a standardized identity layer for sign-in. An ID token tells the client about authentication; it doesn't become a universal API pass.

JULES: Exactly. Several steps, because several parties must agree without trusting the wrong channel or sharing too much power.

PARISA: I still reserve the right to sigh at a redirect mismatch.

JULES: Of course. Understanding isn't a ban on sighing.

PARISA: Next time, the browser says no even though curl says yes. CORS. A security boundary with terrible public relations.

[OUTRO MUSIC]

## Production References

- OAuth 2.0 Security Best Current Practice: https://www.rfc-editor.org/rfc/rfc9700
- PKCE: https://www.rfc-editor.org/rfc/rfc7636
- OpenID Connect Core: https://openid.net/specs/openid-connect-core-1_0.html
- OAuth 2.0 framework: https://www.rfc-editor.org/rfc/rfc6749
- Flow diagram is deliberately conceptual. Production use requires current provider documentation, supported libraries, exact redirect configuration, and full response/token validation.