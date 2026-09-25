# Episode 8: Authentication: How Does the API Know Who the Hell I Am?

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Unrecorded; final timing depends on performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: The request says userId equals administrator.

JULES: Convincing.

PARISA: It also says trusted equals true.

JULES: Well, it would be rude to question it.

PARISA: This is why the server needs its own judgment.

JULES: Today: identity, permission, and the surprisingly large number of things people mean when they say token.

[STING]

## Who Are You, and What May You Do?

JULES: Welcome to Okay, But Why? Authentication establishes who or what is making a request, based on evidence the system can verify. Authorization decides what that identity is allowed to do.

PARISA: I can be correctly identified as Parisa and still not be allowed to refund every order in the restaurant. A successful login isn't a promotion to management.

JULES: Exactly. The identity could also be a service account or application rather than a person. The API needs to know which principal, meaning the entity acting, the credential represents.

PARISA: Our customer can view their order 42. A different authenticated customer cannot simply change the path to 42 and inherit access.

JULES: That requires an object-level authorization check. Checking only that somebody logged in is insufficient.

PARISA: And a staff role might allow reading certain information but not issuing refunds. Authorization can depend on operation, resource, ownership, tenant, and current conditions.

JULES: Exactly. A role label is one input to a policy, not the entire policy.

## Sessions: A Familiar Arrangement

PARISA: Let me start with sessions because I've used them in traditional web applications. The user signs in. After verifying their credentials, the server creates a session record and gives the browser an unpredictable session identifier, commonly in a cookie.

JULES: Later requests carry that identifier according to the browser's cookie rules. The server uses it to find the associated session and identity.

PARISA: The browser doesn't need to resend the user's password for every order check. The session identifier is now a credential that must be protected.

JULES: Exactly. A cookie is a storage and transport mechanism in the browser. A session is an application arrangement. Those terms aren't synonyms.

PARISA: And the fact that the server remembers a session doesn't make the application bad. We can acknowledge that this differs from strict REST stateless interaction without replacing a useful design merely to win a label.

JULES: Right. Security depends on the actual design, configuration, and implementation, not whether the credential came with fashionable punctuation.

## Cookie Flags Have Specific Jobs

JULES: Secure limits a cookie to secure transport, with browser-defined handling for local development. HttpOnly prevents JavaScript from reading the cookie through ordinary document.cookie access. SameSite controls aspects of when cookies accompany cross-site requests.

PARISA: Different protections. HttpOnly doesn't mean malicious JavaScript already running on our origin becomes harmless. It may still cause requests using the session, even if it can't directly read the cookie.

JULES: Correct. And SameSite is useful but doesn't replace a complete CSRF design. Cross-site request forgery exploits the browser's ability to send credentials automatically when an unwanted request is triggered.

PARISA: So state-changing cookie-authenticated requests need appropriate CSRF protection, such as validated tokens and origin checks as part of the application's design. We also constrain cookie scope and manage session expiration and rotation.

JULES: Exactly. None of those attributes means “security solved.” Each addresses a particular behavior.

## An API Key Usually Identifies a Caller or Project

PARISA: Now API keys. A service gives me a long string and says include it with requests. What does it prove?

JULES: That depends on the service. A key may identify a project, account, integration, or application. It can be used for access, quotas, billing, or some combination. It does not inherently identify the human sitting at a browser.

PARISA: If our server uses one shared provider key for all customers, that provider sees our integration's credential. Our server still has to enforce which customer can do what.

JULES: Exactly. Keys can have scopes or restrictions depending on the provider. They need lifecycle management: creation, storage, rotation, revocation, and monitoring.

PARISA: Some services intentionally offer publishable browser keys with constrained capabilities. That doesn't mean a secret server key is safe to put in frontend code.

JULES: Right. Follow the provider's distinction. A public identifier and a private credential may look similarly string-shaped while carrying very different authority.

PARISA: As with knives and breadsticks, shape alone is not the important property.

## Token Is a Broad Word

JULES: A token is a value representing something in a protocol or system. Some tokens are opaque: the client treats them as an unreadable string, while the service looks up or otherwise interprets their meaning.

PARISA: Other tokens contain structured claims. Claims are statements such as who issued the token, which subject it represents, its intended audience, or when it expires.

JULES: Exactly. A token's format, how it's transported, and how it grants access are separate design choices.

PARISA: Which brings us to bearer. Bearer describes possession-based use: whoever presents a valid bearer token can use the authority it conveys, within the server's checks and the token's limits.

JULES: Right. If somebody steals a usable bearer token, the server may not be able to distinguish the thief from its legitimate holder merely by seeing the token.

PARISA: Hence keeping it out of logs, URLs, screenshots, source repositories, and other places that don't need it.

[CODE CARD: A placeholder bearer credential in an HTTP request]
```http
GET /orders/42 HTTP/1.1
Host: orders.example
Authorization: Bearer <short-lived-access-token>
```

JULES: That placeholder is not a real credential. Bearer is the authorization scheme in the header. The token itself might be opaque or have a structured format.

PARISA: So bearer token does not mean JWT. We have separated two things the internet routinely throws into the same drawer.

## JWT Is a Format, Not a Security Verdict

JULES: JWT stands for JSON Web Token. People often pronounce it jot. A common signed compact JWT contains encoded header information, claims, and a signature.

PARISA: Encoded does not mean encrypted. With a typical signed JWT, somebody holding it can decode and read the claims. The signature protects integrity when verified correctly; it doesn't hide the content.

JULES: Exactly. Encrypted token formats exist, but we mustn't imply an ordinary signed token is confidential. Avoid putting unnecessary sensitive information into it.

PARISA: And decoding is not verification. Reading a claim that says administrator doesn't establish that a trusted issuer actually issued that claim.

JULES: The recipient needs to verify cryptographic integrity with trusted configuration and keys, enforce the expected algorithm, and check relevant claims such as issuer, audience, expiration, and not-before time where applicable.

PARISA: Audience means who the token is intended for. A valid token for one service shouldn't automatically work at a completely different service just because the signature checks out.

JULES: Correct. Then the API still applies authorization for the requested operation and resource. A valid token is evidence with a scope, not a master key to everything.

## Why Use Structured Tokens at All?

PARISA: What's the appeal compared with looking up an opaque session identifier?

JULES: In some architectures, a service can verify signed claims without consulting a central session store on every request. That can be useful across services and organizational boundaries.

PARISA: But the claims can become stale. If somebody's permission changes while the token remains valid, the system needs a policy for how quickly that change takes effect.

JULES: Exactly. Short lifetimes, revocation strategies, introspection, or additional checks can be relevant depending on the design. Stateless verification doesn't automatically provide immediate revocation.

PARISA: And server-side sessions can be convenient to revoke centrally. They have their own scaling and storage considerations. Neither option wins every application.

JULES: Right. Ask about identity providers, trust boundaries, revocation needs, clients, and deployment. Choosing JWT because it looks modern is not threat modeling.

## Expiration Is a Limit, Not a Force Field

JULES: An expiration time limits how long a token should be accepted. The server has to enforce it. A timestamp the recipient never checks is decorative.

PARISA: Short-lived credentials reduce the window of misuse, but they don't make theft harmless during that window.

JULES: Correct. Systems may use a separate refresh mechanism to obtain new access tokens. Refresh tokens usually carry longer-lived authority and deserve careful protection. OAuth will give that arrangement context next episode.

PARISA: What happens when the access credential expires during a normal user's session?

JULES: The client needs a defined recovery path. It may use a permitted refresh flow or ask the user to sign in again. It should avoid retry loops that repeatedly send the same rejected credential.

PARISA: And preserve the user's work when reasonable. “Your session expired, so we ate your form” is a product failure even if the rejection was correct.

## Frontend Secrets Aren't Secret

PARISA: Our build tool reads an environment variable containing a provider key. We put its value into browser JavaScript. Is it safe because the variable came from an environment file?

JULES: No. If the value is shipped to the browser, the browser user can inspect it. The build-time origin of the value doesn't make the delivered bundle private.

PARISA: Minification doesn't help. Hiding it in a network header doesn't help if that request originates from the user's browser. The client must have the credential to send it.

JULES: Exactly. A secret service credential generally belongs in an appropriately protected server environment. The server exposes only the operations the browser is allowed to request.

PARISA: But a server proxy isn't automatically safe either. If it forwards any operation from anyone using our powerful key, we've built a public vending machine for our account privileges.

JULES: Right. Authenticate and authorize callers, validate requests, limit allowed operations, and apply quotas where needed. Protecting the key is necessary, not sufficient.

## Browser Token Storage Has Tradeoffs

PARISA: Is localStorage the official home for tokens?

JULES: No universal storage choice is best for every architecture. JavaScript-readable storage exposes tokens to malicious scripts running in that origin. HttpOnly cookies protect against direct JavaScript reading but bring automatic credential behavior and associated CSRF considerations.

PARISA: In-memory storage limits persistence, but doesn't prevent active malicious JavaScript from abusing the application. And it changes what happens across reloads.

JULES: Exactly. A backend-for-frontend arrangement can keep some credentials server-side, but it adds a server session boundary to design. We choose based on the application and threat model, using established libraries and provider guidance.

PARISA: The lesson isn't “remember my one storage rule.” It's understand what can read the credential, what sends it, where it's valid, and how it expires or gets revoked.

## HTTPS Protects the Journey

JULES: Credentials and private data need protected transport. HTTPS protects the connection's confidentiality and integrity and supports verifying the server's identity through the certificate system.

PARISA: It doesn't prove the service is honest, validate our business rules, or stop our own logging code from recording a token after it arrives.

JULES: Correct. It protects a particular part of the journey. Secrets at rest, browser behavior, server configuration, and access control still matter.

PARISA: Also, putting a secret in a URL can leak through systems beyond the encrypted transport path, including application logs or copied links. Use the protocol's appropriate credential mechanism.

## Follow an Authorized Request

JULES: The customer presents a valid credential through the application's chosen mechanism. The API verifies it and establishes the principal. Then it checks whether that principal may read order 42.

PARISA: It selects allowed fields, performs the operation, and returns an appropriate response. A missing or invalid credential and a valid identity lacking permission are different situations, commonly reflected in 401 and 403 handling.

JULES: With deliberate disclosure policies where necessary. The interface should avoid revealing private resource existence accidentally.

PARISA: No part of that can be replaced by a frontend check that says if loggedIn, show the button. The server is the trusted decision point.

## The Stolen Credential Thought Experiment

PARISA: Let's test our understanding. Somebody obtains a usable session cookie. What have they acquired?

JULES: Potentially the ability to act through that session until it expires, is revoked, or another control blocks the attempt. The exact authority depends on the session and application.

PARISA: Somebody obtains a bearer access token with permission to read order status. Same broad concern, but bounded by that token's audience, scope, lifetime, and the resource server's checks.

JULES: Exactly. Somebody obtains a client ID intended to be public, and they haven't necessarily acquired a credential at all. We must distinguish identifiers from secrets.

PARISA: And somebody changes a decoded JWT claim from customer to administrator. If we verify the signature and claims correctly, that modification should not become a trusted identity statement.

JULES: Correct. But if our code merely decodes the token and trusts its contents, we've skipped the evidence check. Encoding gives a value a readable representation; it doesn't make the claim authentic.

PARISA: This thought experiment is more useful than memorizing which string has dots. Ask what possession of the value enables and what the recipient verifies.

## Logging Out Has More Than One Meaning

JULES: A user presses Log out. What must happen?

PARISA: The application should end the relevant local session and clear client state appropriately. If the server has a session record, invalidate it according to the design. Merely hiding the account menu isn't logout.

JULES: Right. With independently valid access tokens, ending a browser session doesn't automatically revoke every issued token everywhere. The architecture needs a defined policy.

PARISA: And logging out of our application isn't necessarily logging out of an external identity provider or every other application that uses it.

JULES: Exactly. Those are separate sessions and relationships. The user interface should describe what it actually does rather than imply a global effect it doesn't implement.

PARISA: Shared devices make this concrete. Clear sensitive cached state and don't leave the previous user's data visible while the next person signs in.

JULES: Right. Authentication lifecycle includes what happens after access ends, not only how the initial credential arrives.

## Revocation and Rotation Solve Different Problems

PARISA: We keep saying revoke and rotate. Separate them.

JULES: Revocation stops accepting a credential or grant before its ordinary expiration, where the system supports that. Rotation replaces credentials or keys as part of lifecycle management.

PARISA: We might rotate an API key because it could have leaked, or because policy calls for replacement. But creating a new key doesn't automatically invalidate the old one unless we actually revoke or retire it.

JULES: Exactly. A safe rollout can require a brief overlap, updating consumers, verifying that they use the new credential, and then disabling the old one. The procedure depends on the system.

PARISA: Signing-key rotation also needs coordination. Recipients may need to obtain the new trusted verification key while still handling tokens signed with an older key during an intended transition.

JULES: Right. Use established mechanisms and libraries instead of hand-inventing cryptographic distribution. The operational lifecycle is part of the security design.

PARISA: Credentials are maintained assets. They aren't a string you paste once and then politely forget until an incident.

## Permission Changes While You're Signed In

JULES: A staff member loses refund permission but still has a valid session. What should happen on the next refund request?

PARISA: The server should apply the intended current permission policy. If we only copied permissions into a long-lived credential and never recheck them, the change may not take effect immediately.

JULES: Exactly. That's a tradeoff to design consciously. Some systems accept a bounded delay through short token lifetimes; others require an additional current-state check for sensitive operations.

PARISA: The same user might still be allowed to view an order. We don't have to treat every permission change as identical to deleting the identity.

JULES: Right. Identity, session validity, and operation permission can evolve separately. Model them clearly enough that the code doesn't collapse them into one loggedIn boolean.

PARISA: And high-impact actions can require additional assurance or confirmation. Knowing who someone is doesn't prove a particular action matches their current intent.

JULES: Exactly. Authentication evidence and transaction authorization are related but distinct decisions.

## The Frontend Proxy Needs a Policy

PARISA: Let's inspect the server-proxy idea in detail. Our browser asks our backend to use a paid provider. The provider key stays on our server. What could still go wrong?

JULES: The backend might accept arbitrary requests from unauthenticated callers, let users choose unrestricted operations, or fail to constrain cost. It could become a way to spend our provider account's authority without ever revealing the key.

PARISA: So secrecy of the credential isn't identical to control of its use. We need to restrict what the proxy does on whose behalf.

JULES: Exactly. Check the user's permission, validate the operation, apply reasonable limits, and return only the permitted result. Don't accept an arbitrary destination URL and attach the secret to it.

PARISA: That last one would be a very efficient credential delivery service for attackers.

JULES: Right. The destination and intended audience matter at each hop. An internal helper that forwards credentials broadly can undermine an otherwise careful frontend design.

## Ask Better Questions in a Design Review

PARISA: If a teammate says “we'll use JWTs,” what should I ask without sounding like I'm starting a fight?

JULES: What identity do they represent? Who issues them? Which services accept them? What claims are verified? How long are they valid? What happens when permissions change or the credential leaks?

PARISA: If the answer is sessions, ask where they're stored, how identifiers are generated and protected, how state-changing requests are defended, and how sessions expire or are revoked.

JULES: Exactly. If it's an API key, ask whose account it identifies, which operations it permits, where it lives, and how it's rotated. The point isn't to favor one label; it's to expose the actual security model.

PARISA: Then the code can enforce that model and the tests can challenge it. That's much more useful than choosing the most impressive-looking token format.

## Know What the Credential Means

JULES: Authentication establishes an identity. Authorization applies permission. Sessions, API keys, opaque tokens, bearer use, and JWT formats solve related but different parts of the problem.

PARISA: Ask what a credential identifies, who issued it, where it's valid, what authority it carries, how long it lasts, and how we can stop accepting it. Suddenly “we use tokens” sounds like the start of a discussion instead of the end.

JULES: Exactly. Next time, delegated authorization. Letting one application access another service without handing it your password.

PARISA: OAuth. Many redirects, one surprisingly reasonable problem.

[OUTRO MUSIC]

## Production References

- OWASP REST Security: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- OWASP Session Management: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- JWT best practices: https://www.rfc-editor.org/rfc/rfc8725
- Bearer token usage: https://www.rfc-editor.org/rfc/rfc6750
- Credential examples use placeholders only. This episode explains tradeoffs and responsibilities rather than prescribing a universal browser token-storage architecture.