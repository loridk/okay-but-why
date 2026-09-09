# Episode 7: Authentication, Sessions, Cookies, and Tokens — Do You Know Me?

**Series:** Web Architecture • Episode 7 of 14
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — I Am Definitely the Manager

[INTRO MUSIC]

PARISA: I've added manager equals true to my browser storage.

JULES: Congratulations on your promotion in your own tab.

PARISA: Can I refund an order?

JULES: The server would like evidence.

PARISA: Bureaucracy follows me everywhere.

JULES: Welcome to *Okay, But Why?*. Today: how a website recognizes a session, and why recognition doesn't grant every permission.

## Four Words Doing Different Jobs

PARISA: We need to separate authentication, authorization, sessions, and cookies before somebody says JWT and everybody pretends that clarified it.

JULES: Authentication establishes an identity or authenticates a claimant to an account. Authorization decides whether a particular action is permitted.

PARISA: Being signed in as a customer doesn't mean I may read another customer's order. Being staff doesn't necessarily mean I may issue refunds.

JULES: A session provides continuity across requests. A cookie is a browser-managed mechanism for storing a value and sending it with matching requests under its rules.

PARISA: A token is some value used to represent a claim, credential, or reference. That's broad. A random session identifier can itself be a token.

JULES: Which is why “sessions versus tokens” can be misleading. We need to compare specific designs, such as an opaque identifier backed by server-side state versus a self-contained signed token.

PARISA: Cookies can carry either. They are not a competing religion to tokens.

## Follow a Server-Side Session

JULES: Customer visits the login page and submits credentials through a secure connection. The application verifies them using its established authentication system.

PARISA: We are not writing a password system from scratch in this episode. Use maintained implementations. Passwords are stored using appropriate password hashing, not reversible plaintext storage or a fast generic hash.

JULES: After successful login, the server creates or rotates a session identifier, associates it with the authenticated session, and sends it to the browser in a cookie.

PARISA: Random and hard to guess. Not the account number with the word secret attached.

JULES: On later matching requests, the browser sends the cookie. The server looks up the session, checks that it is valid, and uses its identity and permissions to handle the request.

PARISA: The browser usually isn't resending the password on every page load. It's presenting the session credential.

JULES: Exactly. And whoever steals a usable session credential may be able to act as that session. It deserves protection.

PARISA: The coat-check metaphor works a little: a claim ticket refers to something stored elsewhere. But unlike a coat attendant, software may accept copied tickets until we expire or revoke them.

JULES: Good boundary on the metaphor. Session management includes creation, rotation, expiry, revocation, and careful handling—not just generating a random string once.

## Cookies Are a Delivery Mechanism

PARISA: A cookie can store preferences, tracking information, or a session reference. The name doesn't tell me its purpose.

JULES: Correct. Relevant attributes control how it is handled. Secure restricts transmission to secure connections. HttpOnly prevents ordinary page JavaScript from reading it through the cookie API.

PARISA: HttpOnly doesn't mean malicious script can do nothing. It may still cause authenticated actions from the page. We still need to prevent cross-site scripting and enforce operation-level protections.

JULES: SameSite affects when cookies accompany cross-site requests. Domain and Path affect scope, though Path isn't a reliable security isolation boundary by itself.

PARISA: And cross-site isn't exactly the same concept as cross-origin. Similar-sounding words, different browser rules. That distinction matters for subdomains and deployment.

JULES: Choose cookie policy for the actual login flow and app. Don't paste a configuration without testing redirects and legitimate cross-site interactions.

PARISA: The lesson is what the controls do, not “this one string is safe for every architecture.”

## Why CSRF Exists

JULES: Cookies are often sent automatically by the browser. That convenience creates a question: how does the server distinguish an intended state-changing request from one caused by another site?

PARISA: Cross-site request forgery. The attacker tries to make the victim's browser send a request using credentials the browser already has.

JULES: Appropriate defenses can include framework-provided CSRF tokens, origin checks, and cookie policy, depending on the design. SameSite is useful but shouldn't be treated as the entire story in every application.

PARISA: And a GET link shouldn't cancel an order. Using safe method semantics avoids a whole class of accidental state changes, though methods alone don't solve CSRF.

JULES: CORS also isn't the whole defense. As we said last episode, some requests can be sent even when the calling script cannot read the response.

PARISA: So the API needs to validate the request's legitimacy, not assume “the browser would never let anybody do that.”

## Opaque Versus Self-Contained Tokens

JULES: An opaque token is a value the recipient generally looks up to learn what it means. A self-contained token can carry claims that a verifier can inspect and validate.

PARISA: JWT is a format often used for signed claims. A typical signed JWT is encoded, not encrypted. People who obtain it can often read its payload.

JULES: A valid signature shows integrity and origin under the chosen trust arrangement. It doesn't mean every claim is appropriate for every service forever.

PARISA: The verifier must check the intended issuer, audience, expiry, permitted algorithms, and the other requirements of the system. Merely decoding the token is not verification.

JULES: And authorization still happens. A token saying who you are doesn't automatically answer whether you may refund this order at this moment.

PARISA: Self-contained verification can reduce a lookup and help across services. But revocation and changing permissions become design questions.

JULES: If a token remains valid until expiry, logging out or disabling an account may require additional mechanisms to stop its use sooner. Short lifetimes, revocation state, or other controls each have tradeoffs.

PARISA: So “stateless authentication” may still rely on state somewhere: refresh credentials, account status, revocation, key management. The state didn't necessarily vanish. It changed shape.

JULES: Exactly. We should choose the design based on the architecture, not because JWT sounds more contemporary than a session table.

## Where Do We Keep the Credential?

PARISA: Browser storage gets dragged into this debate. Local storage doesn't automatically send values with requests, and page JavaScript can read it.

JULES: Which means script injection can expose stored bearer credentials. A JavaScript-readable cookie has related risks. HttpOnly cookies offer a different set of protections and automatic-sending considerations.

PARISA: Neither “cookies always bad” nor “local storage always modern” is useful. Choose an established pattern for the application and understand the threat model.

JULES: For our same-origin browser app, a conventional server-managed session with appropriately configured cookies is a reasonable baseline. We don't need self-contained tokens merely to look up one customer's orders.

PARISA: A native mobile client or service-to-service integration may have different credential needs. We can discuss those explicitly rather than forcing browser assumptions onto every client.

JULES: Keep long-lived powerful credentials away from places that don't need them. Minimize scope and duration where practical.

PARISA: The customer should not receive our payment provider's private API key because the checkout component would find it convenient.

## Authorization Is About the Specific Object

JULES: Let's return to GET slash orders slash 417. We have a valid customer session. What next?

PARISA: Check whether that session may access order 417. Don't simply check “logged in” and return whatever identifier they request.

JULES: Exactly. Object-level authorization. The identifier isn't a secret access policy.

PARISA: Replacing sequential numbers with random identifiers can reduce guessability, but it doesn't remove the need to check permission.

JULES: Staff routes need appropriate checks too. A kitchen role may see preparation details without access to payment-management functions.

PARISA: And the data returned should match the role's task. A cook doesn't need every customer's complete account profile to read “no onions.”

JULES: Hiding buttons helps avoid confusion, but the server must enforce the operation even if somebody sends the request directly.

PARISA: My browser-side promotion remains tragically ceremonial.

## Guest Checkout Still Has Access Rules

JULES: Does every pizza customer need an account?

PARISA: No. That's a product choice, not an architectural requirement. Guest checkout can reduce friction and unnecessary account data.

JULES: But if guests can revisit an order, we need a secure way to grant that access. A carefully designed unguessable access link is one possibility, with limited scope and suitable lifetime.

PARISA: Treat it like a credential. Don't put sensitive details into a casually shareable URL or logs. And don't make the link grant management permissions the guest doesn't need.

JULES: Exactly. No account doesn't mean no authorization. It means the proof of access is different.

PARISA: Also account creation isn't a substitute for order confirmation. People should know what was accepted whether or not they want another password in their life.

## Login With Somebody Else

JULES: What if the shop uses an external identity provider?

PARISA: Then we need to distinguish OAuth and OpenID Connect. OAuth is about delegated authorization. OpenID Connect adds an identity layer used for authentication.

JULES: Right. “Sign in with” flows generally use an identity protocol and established library integration. The provider authenticates the person; our application still decides its own permissions and session behavior.

PARISA: A verified identity at another service doesn't make somebody our restaurant manager.

JULES: And the integration needs correct redirects, state and nonce handling as appropriate, token validation, and lifecycle behavior. These are reasons to use maintained implementations rather than improvising the protocol.

PARISA: We're teaching the architectural responsibility, not providing an incomplete authentication recipe. The dedicated Cybersecurity series will go deeper after this series.

## Expiry Is a User Experience

JULES: Customer fills out an order form. Their session expires. They submit. What should happen?

PARISA: Don't silently discard the work and show a generic login page. Explain that authentication is needed, preserve appropriate non-sensitive input safely, and return them to the task where possible.

JULES: If the operation may already have happened, resolve that uncertainty before encouraging a fresh submission.

PARISA: Staff sessions may need different policies from customer sessions. Shared kitchen devices, role changes, and sensitive actions matter.

JULES: Logout should invalidate the appropriate server-side session or credentials according to the chosen design, not merely hide the avatar.

PARISA: Otherwise we have logged out the CSS.

JULES: Password reset and account recovery also belong to the identity system. A beautiful login page with a weak recovery path isn't a strong design.

PARISA: Nor is an inaccessible login flow. Allow password managers and paste. Use proper labels and autocomplete semantics. Don't turn authentication into a memory contest unless there is an actual reason.

JULES: Authentication mechanisms should be usable by the people who need them. A security control that routinely locks out legitimate users creates its own operational problems.

## Several Servers, One Session

PARISA: Later we may run multiple instances of the web application. If the session is stored only in one instance's memory, what happens when the next request reaches another?

JULES: The second instance might not recognize it. Options include shared session storage or other deliberately chosen designs. Routing a user repeatedly to one instance can help temporarily but has failure and scaling implications.

PARISA: So session design influences deployment. We don't need to solve worldwide scale today, but we should know where that state lives.

JULES: And a server restart shouldn't unexpectedly revoke every session unless that is an accepted limitation. Reliability and security lifecycle decisions meet here.

PARISA: This is why “just use a token” doesn't end the architecture conversation. We still have to say where truth lives and how changes propagate.

## The Login Redirect Is a Journey

JULES: Customer tries to view order history while signed out. We send them to login. Then what?

PARISA: Return them to the permitted destination they were trying to reach, if the flow supports it. But validate that return destination. Don't let an arbitrary parameter become an open redirect to somewhere malicious.

JULES: So even navigation convenience has a boundary.

PARISA: Yes. The application should know which destinations are legitimate. And after login, it still checks permission for the requested resource. Signing in doesn't bless every URL that was waiting in a parameter.

JULES: What if the customer opened a staff link by mistake?

PARISA: Authenticate if appropriate, then deny the staff capability clearly. Avoid a loop that keeps asking them to log in as though more enthusiastic authentication would create the missing role.

JULES: That's a common confusing experience: I'm signed in, but the application keeps treating forbidden as not signed in.

PARISA: Exactly. Our state model should distinguish those conditions, even if the public response sometimes intentionally avoids revealing protected resource details.

## Session Rotation Has a Reason

JULES: You said rotate the session identifier after login. Why not keep the anonymous one?

PARISA: A change in authentication privilege should establish an appropriately fresh session identifier. That helps prevent scenarios where an attacker arranged for a known identifier to become associated with a victim's authenticated session.

JULES: Session fixation.

PARISA: Right. We don't need to memorize an attack script here. Understand the transition: anonymous browsing and authenticated access are different privilege states, and the session mechanism must handle that transition safely.

JULES: What happens to the anonymous cart?

PARISA: The application may deliberately transfer or merge it according to policy. It shouldn't require preserving a vulnerable session identifier to preserve the customer's choices.

JULES: So identity lifecycle and cart lifecycle can cooperate without being the same object.

PARISA: Exactly. Keeping concepts separate makes the flow easier to secure and explain.

## One Device, Several People

JULES: A kitchen tablet is shared among staff. Is a long-lived shared account the simplest answer?

PARISA: It might look simple, but it obscures who performed actions and can make revocation awkward. The right approach depends on the workplace, device management, and risk, but we should discuss those constraints explicitly.

JULES: Maybe the device has a limited view, while consequential actions require a staff identity with permission.

PARISA: That can be a reasonable pattern. The key is least privilege for the task. A screen showing preparation tickets doesn't automatically need account administration or refund access.

JULES: And when someone leaves the team, disabling their access should have a defined effect on existing sessions.

PARISA: Yes. A role removed in a database while a long-lived credential continues granting the old power is a lifecycle mismatch we need to address.

JULES: That doesn't mean every request must always do the same central lookup in every architecture.

PARISA: Correct. It means we define how quickly changes take effect and choose a mechanism that meets the requirement. Then we test it.

## Bearer Means Possession Matters

JULES: What does bearer token mean in plain language?

PARISA: In a bearer design, possession of the usable token is sufficient to present its authority, subject to validation and policy. That's why accidentally exposing it can be serious.

JULES: So logging the full Authorization header is a bad default.

PARISA: Very bad. Also copying live credentials into screenshots, support tickets, or analytics. Debugging systems can quietly become credential storage if we aren't deliberate.

JULES: Could we log a safe identifier that helps correlate a session without storing the credential itself?

PARISA: Often, yes, using a design appropriate to the system. The goal is diagnostic value without granting whoever reads the log the ability to impersonate the user.

JULES: Again, the token format doesn't decide safe handling.

PARISA: Exactly. Opaque or signed, short or long, cookie or header—the value's authority determines how carefully we treat it.

## Refreshing Access Without Pretending It's Free

JULES: Short-lived access tokens are often paired with refresh tokens. What's the architectural idea?

PARISA: Limit how long the access credential is usable, while a separate controlled mechanism can obtain another one. But refresh credentials have their own storage, rotation, revocation, and abuse concerns.

JULES: So the system hasn't eliminated sessions or persistent state in the broad sense. It has divided the lifecycle into parts.

PARISA: Exactly. That may be useful for particular clients and services. For a modest same-origin web application, it may be unnecessary machinery compared with a conventional session.

JULES: And implementing refresh incorrectly can create confusing loops or repeated requests.

PARISA: Yes. Multiple simultaneous failures can trigger competing refresh attempts. A maintained library and clear lifecycle policy can help, but we still need to understand what happens on expiry and failure.

JULES: The takeaway isn't “refresh tokens are bad.” It's “this is an actual subsystem.”

PARISA: Precisely. Not a snippet you paste between two components and forget forever.

## A Permission Matrix We Can Say Out Loud

JULES: Let's define a tiny permission model for our example. Guest with a valid order-access capability?

PARISA: View the specific permitted order information and request allowed actions within that capability. Not browse all orders.

JULES: Signed-in customer?

PARISA: View their own history and perform allowed customer operations. Still check each order's relationship and current state.

JULES: Kitchen staff?

PARISA: View preparation information and move orders through allowed preparation states. Not necessarily issue refunds or change user permissions.

JULES: Manager?

PARISA: Additional approved capabilities, with appropriate safeguards for consequential actions. Manager isn't permission to bypass data validation or create impossible state transitions.

JULES: That's useful. Roles can grant capabilities, but business rules still apply.

PARISA: Exactly. Authorization answers whether this actor may attempt the action. The operation still validates whether the transition makes sense now.

## A Test That Teaches Us Something

JULES: How would we verify this without pretending a successful login is enough?

PARISA: Use separate test identities. Customer A cannot read B's order. Kitchen staff cannot refund. A logged-out session cannot keep using a protected operation if the policy says it should be revoked. A role change takes effect within the promised window.

JULES: Test direct requests, not only whether buttons are visible.

PARISA: Exactly. And test the user experience around denial. Does the page explain what action is possible? Does it preserve safe work? Can the user reach the right next step by keyboard?

JULES: We also verify that private responses aren't shared through a cache.

PARISA: Yes. Authentication, authorization, and delivery policy meet at the response. The correct permission check followed by the wrong shared cache can still expose data.

JULES: That's why security belongs across the path rather than in one magical login box.

PARISA: The box can be very important. It just isn't the whole building.

## The Pizza Policy

JULES: Let's state our baseline. Customers can order as guests where the product allows. Accounts use an established authentication implementation. Browser sessions use a maintained server-side session mechanism with suitable cookie protections.

PARISA: Every protected operation checks permission on the server. Staff receive only the capabilities they need. Sensitive credentials stay server-side. Login, expiry, and recovery get understandable accessible interfaces.

JULES: We aren't introducing a fleet of token-verifying services without a reason. If the architecture later needs that, we'll evaluate it with its revocation and operational costs.

PARISA: And we don't claim a cookie flag solves all browser attacks. Controls have jobs. Combining them thoughtfully is the work.

## What We Don't Ask the Customer to Know

JULES: The customer shouldn't need to understand cookies to place an order.

PARISA: Correct. The architecture should make the normal path understandable: sign in if needed, know whether the session expired, understand what action is permitted, and recover without losing safe work.

JULES: Staff shouldn't need to diagnose JWT expiry from a blank dashboard either.

PARISA: Exactly. Technical detail belongs in appropriate diagnostics. The interface should explain the practical consequence and next action. “Your session expired; sign in to continue” is more useful than exposing a token-validation exception.

JULES: And support staff need enough information to help without asking customers to send credentials.

PARISA: Yes. A safe reference identifier, clear event history, and limited support capabilities can help. “Email me your session cookie” is not a recovery process.

JULES: So usable security includes the support path as well as the login form.

PARISA: Absolutely. People will need help. We should design that help so it doesn't undo the protections we worked to establish.

## Closing — Recognition Isn't Permission

JULES: Authentication establishes identity. Authorization decides allowed actions. Sessions connect requests. Cookies transport values according to browser rules. Tokens represent credentials or claims in various designs.

PARISA: Those things cooperate. They aren't five mutually exclusive product categories.

JULES: Next time: databases and application state. What needs to survive the tab, the process, and the power going out?

PARISA: My promotion, apparently, survives none of those.

JULES: A very secure organizational structure.

[OUTRO MUSIC]

## Production Notes

- Security content stays at architectural mechanism/tradeoff level; no custom cryptography or copy-paste authentication implementation is taught.
- Session, JWT, OAuth, OIDC, CORS, and CSRF are not programming-language syntax.
- Dedicated Cybersecurity series follows Web Architecture; this episode does not replace that series.

## Production References

- OWASP, Session Management: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP, Authorization: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- OWASP, CSRF Prevention: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- RFC 8725, JWT Best Current Practices: https://www.rfc-editor.org/rfc/rfc8725
- OpenID Connect Core: https://openid.net/specs/openid-connect-core-1_0.html
