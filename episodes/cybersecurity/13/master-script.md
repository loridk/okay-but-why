# Episode 13: CSRF, CORS & Same-Origin Policy — Why Is the Browser Yelling at Me?

Status: Draft

**CAST**

PARISA — Experienced web developer who has fought CORS errors and would like the browser to explain itself like an adult.

JULES — Developer who is going to separate three browser-security concepts that often get mashed into one ball of frustration.


[MUSIC]

PARISA: CORS error.

JULES: Good.

PARISA: No. Bad.

JULES: The browser blocked something.

PARISA: The browser blocked *me*.

JULES: The browser doesn’t know you personally.

PARISA: It feels personal.

[MUSIC STING]

PARISA: Today: same-origin policy, CORS, and CSRF.

JULES: Three related browser-security concepts that solve different problems.

PARISA: Let’s untangle them before Stack Overflow rises from the grave.


## Same-Origin Policy First

JULES: The **same-origin policy** is a browser security boundary that restricts how documents or scripts from one origin interact with resources from another.

PARISA: Origin means scheme, host, and port.

JULES: Exactly.

`https://example.com` and `http://example.com` are different origins because scheme differs.

PARISA: `https://api.example.com` is different from `https://example.com` because host differs.

JULES: Right.

PARISA: Port can differ too.

JULES: Yep.


## Why Does This Exist?

PARISA: Because I can visit multiple websites at once.

JULES: Exactly.

Your browser may have an authenticated banking session open while you visit a random site.

PARISA: Without browser isolation, random site JavaScript could potentially read bank pages.

JULES: Same-origin policy prevents broad cross-origin reading and scripting.

PARISA: This is foundational web security.

JULES: Extremely.


## CORS: Controlled Exceptions

PARISA: Then modern applications said, “But I actually need frontend.example to call api.example.”

JULES: Enter **Cross-Origin Resource Sharing**, CORS.

PARISA: Server tells the browser which cross-origin requests are permitted.

JULES: Correct.

PARISA: CORS does not protect the server from all requests.

JULES: Important.

PARISA: Non-browser clients can call the API without caring about browser CORS enforcement.

JULES: Exactly.

PARISA: So CORS is primarily a browser-enforced read-access policy.

JULES: Yes.


## Preflight

PARISA: OPTIONS request.

JULES: For certain cross-origin requests, the browser sends a **preflight** request first.

PARISA: “Would you allow this origin, method, and headers?”

JULES: Exactly.

PARISA: Server answers with CORS headers.

JULES: Right.

PARISA: Browser decides whether to proceed or expose the response.

JULES: Correct.


## Access-Control-Allow-Origin

PARISA: The famous header.

JULES: `Access-Control-Allow-Origin`.

PARISA: Server can allow a specific origin.

JULES: Yes.

PARISA: Or `*` for broadly public resources, subject to credential rules.

JULES: Correct.

PARISA: Dynamically reflecting any supplied Origin without validation is dangerous.

JULES: Very.


## Credentials Complicate CORS

PARISA: Cookies and authorization credentials.

JULES: Cross-origin credentialed requests require explicit server configuration.

PARISA: Wildcard origin is not allowed with credentials in the usual CORS model.

JULES: Right.

PARISA: Because “any website can read authenticated responses” would be terrible.

JULES: Exactly.


## CSRF: Different Problem

PARISA: Now CSRF.

JULES: **Cross-Site Request Forgery** exploits the browser’s tendency to automatically include credentials like cookies with requests.

PARISA: Evil site causes my browser to send a request to bank.example.

JULES: If you are logged into the bank, your browser may include the bank’s cookies.

PARISA: So the bank sees a legitimately authenticated request.

JULES: But you did not intend the action.

PARISA: Authentication without intent.

JULES: Good phrase.


## Example

PARISA: Imagine bank has a GET endpoint that transfers money.

JULES: Already terrible.

PARISA: Evil page embeds an image whose URL is `https://bank.example/transfer?to=attacker&amount=1000`.

JULES: Browser requests the image.

PARISA: Sends bank cookies.

JULES: If the server performs the action without CSRF defenses, money moves.

PARISA: The response being blocked by same-origin policy does not undo the request.

JULES: Exactly.

PARISA: This is why “CORS blocks it” is not automatically a CSRF defense.

JULES: Thank you.


## CSRF Tokens

JULES: Classic defense: unpredictable CSRF token tied to the user session.

PARISA: Legitimate form includes token.

Attacker’s site cannot read the token due to same-origin policy.

JULES: Exactly.

PARISA: Server rejects state-changing requests without a valid token.

JULES: Right.


## SameSite Cookies

PARISA: Modern browsers also have SameSite cookies.

JULES: `SameSite=Lax` or `Strict` can reduce when cookies are included in cross-site requests.

PARISA: `None` explicitly allows cross-site use and requires Secure.

JULES: Correct.

PARISA: Good defense layer, but understand application needs.

JULES: Yes.


## Safe HTTP Methods

PARISA: GET should not mutate state.

JULES: Correct.

PARISA: That is not just REST aesthetic.

JULES: It also reduces accidental and forged actions.

PARISA: State changes belong in POST, PUT, PATCH, DELETE as appropriate, with CSRF protection when cookie authentication is involved.

JULES: Exactly.


## Tokens in Headers

PARISA: If an API uses a bearer token that JavaScript must explicitly place in an Authorization header—

JULES: Classic cookie-based CSRF risk changes because the browser does not automatically attach that token cross-site.

PARISA: But now XSS risk may increase if the token is accessible to script.

JULES: Tradeoffs.

PARISA: There is no free auth storage.


## CORS Is Not Authentication

PARISA: Say it louder.

JULES: **CORS is not authentication or authorization.**

PARISA: If my API returns secrets to any caller with a valid token, CORS does not replace token validation.

JULES: Correct.

PARISA: And if the API is reachable from curl, CORS is irrelevant there.

JULES: Right.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: Fix CORS with `Access-Control-Allow-Origin: *` on everything.

JULES: Please don’t.

PARISA: Disable browser security during development and forget why it existed.

JULES: Please don’t.

PARISA: Assume a CORS error means the API endpoint itself is unreachable.

JULES: It means the browser is enforcing cross-origin policy.

PARISA: Use GET for destructive actions.

JULES: Please absolutely don’t.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: Same-origin policy is the default wall.

JULES: Yes.

PARISA: CORS creates controlled holes in the wall for cross-origin reading.

JULES: Yes.

PARISA: CSRF exploits the browser automatically carrying credentials across sites.

JULES: Exactly.

PARISA: Three concepts. Related ecosystem. Different problem statements.

JULES: We have achieved browser peace.


## Browsers Are Doing Security on Your Behalf

PARISA: The weird emotional thing about CORS is that developers experience the browser as the thing breaking their app.

JULES: Because the browser is enforcing a boundary the server may not enforce itself.

PARISA: If I use curl and the request works, then use fetch and the browser blocks access to the response, that feels inconsistent.

JULES: But the browser has a different responsibility.

It is simultaneously running code from many origins while holding your cookies and authenticated sessions.

PARISA: Curl is not logged into my bank in another tab.

JULES: Exactly.


## “Simple” Cross-Origin Requests

PARISA: Some cross-origin requests don’t preflight.

JULES: Right.

Certain methods and content types qualify as CORS “simple requests.”

PARISA: Which means developers cannot assume “preflight is the thing preventing CSRF.”

JULES: Very important.

PARISA: A cross-site form POST existed long before CORS.

JULES: Exactly.

PARISA: Browsers have always allowed some cross-origin sending because the web needs links and forms.

JULES: Same-origin policy mainly restricts reading and scripting across origins, not every possible outbound request.


## Why CSRF Loves Cookies

PARISA: Cookies are attached based on destination domain and cookie policy, not based on which page initiated the request.

JULES: Exactly.

PARISA: So evil.example can cause a request to bank.example, and historically the browser may attach bank.example’s cookie.

JULES: Right.

PARISA: That is the whole opening CSRF exploits.

JULES: Yes.


## Origin and Referer Validation

PARISA: Servers can also inspect `Origin` or sometimes `Referer` headers for state-changing requests.

JULES: Useful CSRF defense layer.

PARISA: Verify the request came from an expected site.

JULES: Exactly.

PARISA: But design it carefully around proxies, privacy behavior, and legitimate flows.

JULES: Yes.


## Double-Submit Cookie Pattern

PARISA: Another CSRF pattern: double-submit cookie.

JULES: Server or application uses a token value sent both in a cookie and separately in the request.

PARISA: Attacker can cause the cookie to be sent but cannot normally read it cross-origin to copy the matching token into the request field or header.

JULES: Exactly, when implemented correctly.


## SameSite Is a Huge Improvement

PARISA: The modern web made SameSite cookies much more prominent.

JULES: Yes.

`SameSite=Lax` blocks cookies on many cross-site subrequests while allowing some top-level navigation use cases.

PARISA: `Strict` is more restrictive.

JULES: Right.

PARISA: `None` means cross-site use is allowed and the cookie must also be Secure.

JULES: Exactly.

PARISA: So an embedded third-party application may genuinely need `None`.

JULES: Yes.

PARISA: Security policy has to match product architecture.


## CORS Misconfiguration

PARISA: What’s a dangerous CORS pattern?

JULES: Server reads the request’s `Origin` and blindly echoes it into `Access-Control-Allow-Origin`.

PARISA: “You said you’re trusted, so I trust you.”

JULES: Essentially.

PARISA: Especially bad with credentialed requests.

JULES: Correct.

PARISA: Instead allowlist origins you actually intend to authorize.

JULES: Yes.


## `null` Origin

PARISA: I’ve seen `Origin: null`.

JULES: Certain sandboxed contexts, local files, and other situations can produce a null origin.

PARISA: So blindly allowing `null` can be dangerous if the app does not understand which contexts that admits.

JULES: Correct.


## CORS and APIs

PARISA: Public API.

No cookies.

Data is intentionally public.

JULES: `Access-Control-Allow-Origin: *` can be totally appropriate.

PARISA: This is why wildcard is not inherently evil.

JULES: Exactly.

PARISA: Security configuration depends on whether the resource is supposed to be public.

JULES: Context, again.


## Preflight Caching

PARISA: Preflights can be cached.

JULES: Servers can tell browsers how long a successful preflight result may be cached.

PARISA: Performance versus policy-change responsiveness.

JULES: Right.

PARISA: Not usually the first security concern, but useful to know why every fetch does not necessarily produce an OPTIONS request.

JULES: Exactly.


## Cookies: Secure and HttpOnly

PARISA: Since CSRF is cookie-heavy, remind me.

`Secure` means only send over HTTPS.

JULES: Yes.

PARISA: `HttpOnly` means JavaScript can’t read it.

JULES: Correct.

PARISA: `SameSite` controls cross-site sending behavior.

JULES: Right.

PARISA: Different flags, different problems.

JULES: Exactly.


## CSRF and JSON APIs

PARISA: Developers sometimes say JSON APIs don’t need CSRF protection.

JULES: Too broad.

PARISA: If authentication is cookie-based and the browser can create an accepted state-changing request cross-site, CSRF can still matter.

JULES: Correct.

PARISA: Some JSON content types trigger preflight, which can reduce certain classic attack paths.

JULES: But don’t treat incidental request formatting as your entire security model.

PARISA: Explicit controls are nicer than accidents.


## OAuth Redirects and Origins

PARISA: Modern auth flows add redirects between origins.

JULES: Yes.

PARISA: Which makes it even more important to understand exact origins, redirect URI validation, cookies, and token handling.

JULES: We’ll dig further into tokens next episode.

PARISA: Browser security has become one giant family reunion.

JULES: And several relatives are arguing.


## Please Don’t Solve CORS With a Browser Extension

PARISA: Developers install “disable CORS” extensions.

JULES: Fine for very specific local debugging if you understand exactly what you are changing.

PARISA: Dangerous as a conceptual fix.

JULES: Yes.

PARISA: If production needs cross-origin access, configure the server correctly.

JULES: Exactly.

PARISA: Don’t teach yourself that the browser’s security model is the bug.


## Old Person Yells at Cloud

[STING]

### OLD PERSON YELLS AT CLOUD

PARISA: Old websites were mostly same-origin by accident.

HTML, PHP, database, assets—all on one host.

JULES: Modern frontends made cross-origin architecture normal.

PARISA: SPA on one origin.

API on another.

Auth provider somewhere else.

CDN.

Analytics.

JULES: Which made browser security boundaries much more visible to ordinary application developers.

PARISA: The policy was always there. Architecture wandered into it.

JULES: Exactly.

## Security+ Corner

JULES: Security+ expects broad knowledge of web attacks and secure application controls.

PARISA: Developer depth means understanding SOP, CORS, preflights, credentials, CSRF tokens, SameSite cookies, and safe state-changing requests.

JULES: Exactly.


## What Did We Actually Learn?

PARISA: Same-origin policy restricts cross-origin interaction.

JULES: CORS lets servers opt into specific cross-origin access.

PARISA: CSRF tricks an authenticated browser into performing an unintended action.

JULES: CORS is not auth, and same-origin policy does not automatically prevent the request itself.

PARISA: Next: sessions, cookies, tokens, and API security.

JULES: Authentication’s messy afterparty.

[MUSIC OUT]
