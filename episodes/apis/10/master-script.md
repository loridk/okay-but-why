# Episode 10: CORS: Why Is My Browser Yelling at Me?

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Unrecorded; final timing depends on performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: The request works in curl.

JULES: But not in the browser?

PARISA: Correct. So the internet works, the server works, and Chrome has decided to become my manager.

JULES: Your browser is protecting a boundary.

PARISA: Could it protect the boundary with a more encouraging error message?

JULES: A reasonable feature request. First, let's understand the boundary.

[STING]

## Your Browser Runs Other People's Code

JULES: Welcome to Okay, But Why? Before CORS, the same-origin policy. A browser routinely loads JavaScript from sites you don't control. That code runs while the browser may also have credentials for other services.

PARISA: Such as my email, bank, or our fictional pizza account. If every random site could read responses from every other site using my browser's authority, visiting a page would be an alarming act of trust.

JULES: Exactly. The same-origin policy restricts interactions between different origins, especially script access to another origin's data. There are important exceptions and resource-specific rules, but that's the foundation.

PARISA: The browser isn't merely a generic HTTP client. It's an environment executing untrusted web content while protecting users and separating sites.

JULES: Right. The protection starts making sense when you ask whose JavaScript is running, not just whether the destination server is online.

## What Is an Origin?

JULES: For ordinary web URLs, an origin is the scheme, host, and port combination.

PARISA: HTTPS versus HTTP changes the scheme. App dot example versus api dot example changes the host. Port 3000 versus 4000 changes the port. Any of those can make two URLs different origins.

JULES: Exactly. Different paths on the same scheme, host, and effective port are the same origin. Slash orders and slash menu aren't different origins simply because the path changed.

[CODE CARD: Origin comparisons]
```text
https://app.example/orders
https://app.example/menu
Same origin.

https://app.example
https://api.example
Different origins: different hosts.

http://localhost:3000
http://localhost:4000
Different origins: different ports.
```

PARISA: This is why two development servers running on my own machine can trigger CORS. My emotional sense that “it's all my laptop” isn't the browser's origin calculation.

JULES: Correct. And origin is not identical to site in cookie terminology. We shouldn't casually substitute those words when discussing SameSite behavior.

PARISA: Related boundaries, different definitions. The names could have tried harder.

## Reading and Sending Are Different

JULES: A crucial correction: the same-origin policy doesn't mean a browser can never send anything cross-origin. The web has long supported links, forms, images, and other cross-origin interactions under specific rules.

PARISA: So a malicious page may be able to cause some requests even when its JavaScript cannot read the responses.

JULES: Exactly. That is why CORS is not a complete CSRF defense. Preventing the attacker from reading the response doesn't necessarily prevent a state-changing request from taking effect.

PARISA: The bank transfer doesn't become safe because the attacker can't admire the confirmation page.

JULES: Right. Servers still need authentication, authorization, and CSRF protections where appropriate. CORS controls a browser's sharing of responses with requesting script under the protocol's rules.

PARISA: That distinction is the episode's load-bearing wall. CORS is not a firewall around the API and not a replacement for access checks.

## CORS Is an Explicit Sharing Mechanism

JULES: CORS stands for Cross-Origin Resource Sharing. It gives servers a way to tell browsers when a response may be shared with code from another origin.

PARISA: Our frontend is at app dot example. Our API is at api dot example. We intentionally want the frontend to read certain API responses.

JULES: The browser includes an Origin header in the relevant cross-origin request. The server can respond with Access-Control-Allow-Origin matching the approved origin, or use a wildcard in appropriate non-credentialed situations.

PARISA: The permission comes from the response. Adding Access-Control-Allow-Origin to my outgoing fetch headers doesn't make the server agree.

JULES: Correct. It may instead create more trouble by introducing an unnecessary request header. The server or gateway responsible for the response must be configured correctly.

[CODE CARD: Illustrative response permissions for one approved origin]
```http
Access-Control-Allow-Origin: https://app.example
Vary: Origin
```

PARISA: Vary Origin matters when a response's origin-specific behavior varies and a shared cache might otherwise reuse the wrong variant.

JULES: Exactly. And don't simply reflect any Origin value back while also allowing credentials. Validate against the intended allowed origins. The header is supposed to express a policy, not repeat whatever a stranger requested.

## Why the Browser Sometimes Asks First

PARISA: Now the mysterious OPTIONS request that I didn't write.

JULES: For requests that aren't CORS-safelisted, the browser generally sends a preflight request. It asks whether the origin may send the intended method and headers before sending the actual request.

PARISA: CORS-safelisted is precise but unfriendly. People often call the simpler category simple requests.

JULES: Right. Certain methods and header combinations qualify. A POST with application/json or a request with an Authorization header generally triggers a preflight. The browser uses OPTIONS with headers describing the intended request.

PARISA: So the preflight isn't my order update happening twice. It's a permissions inquiry, followed by the actual operation if permitted.

[CODE CARD: A simplified preflight exchange]
```http
OPTIONS /orders/42 HTTP/1.1
Origin: https://app.example
Access-Control-Request-Method: PATCH
Access-Control-Request-Headers: content-type

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example
Access-Control-Allow-Methods: PATCH
Access-Control-Allow-Headers: Content-Type
Vary: Origin
```

JULES: These are simplified sketches. The real request and the actual response still have their own security and CORS requirements.

PARISA: And the preflight response allowing PATCH doesn't authorize this user to edit order 42. It says the browser may proceed with that cross-origin request shape.

JULES: Exactly. The actual endpoint must authenticate and authorize the operation.

## Preflight Has Its Own Failure Modes

PARISA: Suppose our authentication middleware rejects every OPTIONS request because there's no session cookie.

JULES: Standard CORS preflight requests don't include credentials. The server needs to answer the permission inquiry appropriately without requiring the actual request's user credential on the preflight itself.

PARISA: Then the actual request carries credentials according to the client's configuration and browser policy, and that's where the operation's access checks occur.

JULES: Correct. Middleware or gateways can accidentally intercept preflight before the route's CORS behavior is applied. Looking only at the final handler can miss the problem.

PARISA: And browsers may cache preflight results according to the protocol and their limits. We shouldn't assume every actual request gets a fresh visible OPTIONS exchange.

JULES: Exactly. Also, the successful preflight doesn't eliminate the need for appropriate CORS headers on the actual response.

## Credentials Add Conditions

JULES: Cross-origin fetch doesn't automatically send every browser credential. A client may need credentials include for a cookie-based arrangement, and the server must opt into credentialed response sharing.

PARISA: With Access-Control-Allow-Credentials true and a specific allowed origin, not a wildcard origin for that credentialed case.

JULES: Correct. Cookie scope, SameSite rules, and browser third-party-cookie policies still apply. CORS permission doesn't override all other browser privacy rules.

PARISA: So changing one header may not solve a missing-cookie problem. We have to distinguish “request was blocked,” “response wasn't exposed,” and “credential wasn't included.”

JULES: Exactly. And manually supplied Authorization headers introduce their own preflight considerations. Credentials mode is not a universal switch for every possible authentication scheme.

PARISA: This is why randomly adding include, wildcard, and no-cors until the red text changes is such an expensive hobby.

## No-Cors Does Not Mean No Security

JULES: Fetch has a mode called no-cors. The name has caused a lot of false hope.

PARISA: It doesn't mean “please ignore the same-origin policy and give me the JSON.”

JULES: Correct. For relevant cross-origin requests, you get an opaque response whose body and useful status information aren't available to the requesting JavaScript. The request also has restrictions.

PARISA: So if my application needs to read order data, an opaque response doesn't solve the problem. It just changes how my lack of access is packaged.

JULES: Exactly. Nor should we teach people to disable browser security or install an extension that removes the boundary as the production solution.

PARISA: That changes the testing environment while leaving users' browsers correctly unwilling to do the same thing. And it weakens protections for other browsing.

## Why Curl and Postman Work

JULES: A normal curl request runs under the authority of the person or program invoking it. It isn't implementing the browser's same-origin boundary for a webpage's JavaScript.

PARISA: Similarly, a server-side HTTP client doesn't generally enforce browser CORS rules. It still needs network access and valid credentials, but CORS isn't its gatekeeper.

JULES: Exactly. So “works in curl” can prove the endpoint is reachable and responds to that request. It doesn't prove the server grants browser script at your origin permission to read it.

PARISA: And server-side success doesn't prove the browser sent the exact same method, headers, cookies, or body. Compare actual requests before declaring the browser irrational.

JULES: Correct. The difference may be CORS, authentication, a redirect, mixed content, or something else. The browser's message is evidence to investigate, not a diagnosis of every possible underlying cause.

## Debug the Boundary in Order

PARISA: We can make this practical. First compare the page origin and destination origin. If they're the same, ordinary cross-origin sharing shouldn't be the explanation, though redirects can change the path of the exchange.

JULES: Next inspect the network panel. Is there a preflight? Did it succeed? Does its response allow the required origin, method, and headers?

PARISA: Then inspect the actual response if there is one. Are CORS headers present even on errors? Did a gateway return a 500 without the headers the application normally supplies?

JULES: Exactly. A underlying server failure can surface as a CORS symptom because the browser can't expose the response to script. Server logs can help distinguish those layers.

PARISA: Check credentials separately. Were the required cookies or authorization values sent under the intended rules? Never paste their values into a public troubleshooting thread.

JULES: And if JavaScript needs to read a non-safelisted response header, the server may need Access-Control-Expose-Headers. Permission to read the body doesn't automatically expose every header.

## A Same-Origin Backend Can Be a Deliberate Design

PARISA: What if we route browser requests through our own backend?

JULES: That can be a legitimate architecture. The browser calls a same-origin endpoint; the backend contacts another service. It may also keep a provider secret out of the browser and adapt the data contract.

PARISA: But it isn't a magic security bypass. Our backend must enforce allowed destinations and operations, authenticate callers where needed, and avoid becoming an open proxy.

JULES: Exactly. The server-to-server request isn't constrained by browser CORS, so the server takes responsibility for its own boundary. Arbitrary user-supplied URLs can introduce server-side request forgery risks.

PARISA: Another case where moving the work changes the responsibility rather than deleting it.

## Case One: The Request Happened, but JavaScript Can't Read It

PARISA: Let's work an actual case. Our app sends a cross-origin GET using a request shape that doesn't require preflight. The server log shows the request and a successful response. The browser reports a CORS failure.

JULES: That can happen if the response doesn't include the required sharing permission for the requesting origin. The network exchange occurred, but the browser won't expose the response to that script.

PARISA: So I shouldn't conclude the server never received it. And if the operation had improperly changed state, that effect could already have happened even though JavaScript can't inspect the result.

JULES: Exactly. This is the concrete reason CORS isn't a general defense against unwanted state changes. The application's method choices and CSRF defenses still matter.

PARISA: We inspect the actual response headers and the actual Origin. If the server allows a different origin, even one differing only by port, that doesn't satisfy this request.

JULES: Right. Exact configuration matters. Browser origin comparison doesn't accept “close enough, same developer.”

## Case Two: The Actual Request Never Gets Sent

JULES: Now our app sends a PATCH with JSON. The browser sends OPTIONS first. The server responds but doesn't allow PATCH or the required header.

PARISA: The browser rejects the preflight result and doesn't send the actual PATCH. In this case, looking for the update handler to run is the wrong starting point.

JULES: Exactly. The network panel reveals which exchange failed. Fix the server's policy if this origin and operation are intended to be allowed, rather than weakening the browser.

PARISA: And if the policy intentionally forbids that origin, the rejection is correct. A CORS error isn't automatically a configuration bug; it can be an enforced boundary.

JULES: Right. We need to know the desired policy before deciding what to change.

PARISA: Suppose OPTIONS returns a login redirect because our generic authentication layer intercepts it.

JULES: Then we need to arrange appropriate preflight handling while retaining authentication on the actual operation. Exempting a permission inquiry from user authentication isn't the same as making the protected data public.

## Case Three: The Error Response Lost the Headers

PARISA: Our API works most of the time. During an outage, the browser suddenly says CORS. Everyone starts editing the allowlist.

JULES: But a gateway may be generating the outage response without the CORS headers normally added by the application. The visible symptom can mask the underlying server failure.

PARISA: So check the response source and server logs. The fix might be restoring the dependency and ensuring error responses consistently apply the intended sharing policy.

JULES: Exactly. We don't want an error-handling layer that removes the information the frontend needs to explain an outage.

PARISA: Nor should we make the allowed origin a wildcard just because it changes the error message. That can broaden access without repairing the actual fault.

JULES: Right. Debugging should narrow the cause, not progressively remove every safeguard until something responds.

## Development Proxies Can Hide a Production Difference

JULES: A development server can proxy slash api to a backend on another port. The browser sees a same-origin request to the development server, which forwards it.

PARISA: That can be convenient. But if production instead calls a different API origin directly, the browser's behavior changes. Passing local tests doesn't prove the production CORS policy is correct.

JULES: Exactly. Know which component makes each request. The development proxy is a server-side hop, not evidence that cross-origin browser access has been configured.

PARISA: Test the deployed origin arrangement before release. Also test the intended error paths, because that's where missing headers often become visible.

JULES: Right. Localhost ports, staging subdomains, and production domains are different origin values. Configure them deliberately rather than accepting any origin forever because development was inconvenient.

## Public Data and Credentialed Data Need Different Decisions

PARISA: Suppose we have a public menu endpoint and no private data or credentials. Could we allow any origin to read it?

JULES: Potentially, yes. A wildcard sharing policy can be appropriate for intentionally public, non-credentialed data. The server still needs operational controls such as rate limits if relevant.

PARISA: But a private order endpoint using browser credentials needs a much narrower decision, including the exact permitted origin and credentialed-response rules.

JULES: Correct. Avoid one indiscriminate CORS configuration for every resource if the intended sharing policies differ.

PARISA: And allowing an origin doesn't mean every person using that origin can access every order. Authentication and authorization still decide which response each caller may receive.

JULES: Exactly. CORS answers whether script from an origin may access a response under the browser's rules. It doesn't replace the service's user or resource policy.

## A Header You Can't See

PARISA: The response body works, but my JavaScript can't read a custom request-tracking header that I can see in developer tools. Is that possible?

JULES: Yes. Browser developer tools can show information that the page's JavaScript isn't permitted to access. CORS exposes only certain response headers by default.

PARISA: The server can explicitly expose an appropriate custom header with Access-Control-Expose-Headers. Again, that is response policy, not something the client can grant itself.

JULES: Exactly. Only expose what the client needs. Don't turn a debugging convenience into a reason to reveal sensitive internal metadata.

PARISA: This explains another source of “but I can see it right there.” The human using dev tools and the script executing in a webpage don't have identical access.

## Origin Is Evidence Within a Browser Model

JULES: Could a non-browser client send an Origin header pretending to be our frontend?

PARISA: It can construct headers. Which is another reason the server cannot treat an allowed Origin as sufficient user authentication.

JULES: Exactly. The browser enforces restrictions on what page scripts can do. A general-purpose HTTP client operates outside that enforcement model.

PARISA: So CORS doesn't stop someone using curl from calling our public network endpoint. Credentials, permissions, input checks, and network controls where appropriate are the server's defenses.

JULES: Right. Different controls cover different threats. Once we separate them, the behavior stops looking contradictory.

## A Fix Should Preserve the Reason for the Boundary

PARISA: Our practical resolution is to configure the server to permit the actual intended frontend origin, methods, and headers; handle preflight correctly; and send appropriate sharing headers on relevant responses.

JULES: While keeping the endpoint's authentication, authorization, and other browser-security requirements intact.

PARISA: Or choose a deliberate same-origin architecture with a properly constrained backend. Either way, the fix is an explicit design, not telling every browser to stop caring.

JULES: Exactly. We can be annoyed by the debugging experience and still appreciate the security property.

## The Browser Has a Reason

JULES: Same-origin policy protects data boundaries while browsers run code from different sites. CORS is the server's way to permit specific cross-origin sharing under browser rules.

PARISA: Some requests are sent without preflight; others require an OPTIONS inquiry. The server's response policy, actual credentials, and application authorization are separate pieces.

JULES: Curl working doesn't contradict a browser CORS failure. They operate under different security models.

PARISA: The browser isn't telling me my API doesn't exist. It's saying the script in this context doesn't have the required permission to see the response, or to proceed with this request shape.

JULES: Exactly.

PARISA: I still want a nicer error message. But I no longer want to fire the boundary.

JULES: Next time, webhooks. Stop asking “did it happen yet?” and let the other system send a notification.

PARISA: Finally, the API can be the one checking in too often.

[OUTRO MUSIC]

## Production References

- CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
- Same-origin policy: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
- Fetch Standard: https://fetch.spec.whatwg.org/
- Example domains and HTTP sketches are fictional. Origin allowlists, credential use, cookie policy, and authentication must be designed together; CORS is not server authorization or a complete CSRF defense.