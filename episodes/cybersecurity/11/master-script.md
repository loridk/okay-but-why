# Episode 11: XSS — You Put WHAT in My DOM?

Status: Draft

**CAST**

PARISA — Experienced web developer who knows browsers are powerful, users control input, and those two facts should never be combined carelessly.

JULES — Modern-stack developer who is prepared to explain why “React escapes strings” is useful but not a universal XSS force field.


[MUSIC]

PARISA: Someone put JavaScript in my JavaScript.

JULES: That is basically XSS.

PARISA: Cross-site scripting.

JULES: Yes.

PARISA: Which is annoyingly named because it is mostly “run attacker-controlled script in someone else’s trusted page.”

JULES: Historical naming is a burden we carry.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*

I’m Parisa.

JULES: And I’m Jules.

PARISA: This is finally an attack I understand in my bones.

User input.

HTML.

Browser.

Bad decisions.

JULES: Exactly.


## What XSS Actually Is

JULES: **Cross-site scripting**, XSS, happens when attacker-controlled content is interpreted by a browser as executable script in a trusted site’s context.

PARISA: So the browser thinks the code belongs to my site.

JULES: Right.

PARISA: Which means it may access things my site can access.

JULES: DOM.

Session data not protected from JavaScript.

Application state.

Actions available to the user.

PARISA: And because the script runs under my origin, same-origin policy may treat it as trusted code.

JULES: Exactly.


## Stored XSS

PARISA: Comment form.

User submits `<script>evil()</script>`.

Site stores it.

Other users load the page.

Browser executes it.

JULES: Classic **stored XSS**.

PARISA: Payload lives in persistent application data.

JULES: Yes.


## Reflected XSS

JULES: **Reflected XSS** occurs when attacker-controlled input is immediately reflected into a response.

PARISA: Search page says “Results for: whatever-you-typed.”

JULES: If that input is inserted unsafely into HTML, a crafted URL may execute script when a victim opens it.

PARISA: Not stored in the database.

JULES: Right.


## DOM-Based XSS

PARISA: DOM XSS means the dangerous transformation happens in client-side JavaScript.

JULES: Exactly.

Maybe code reads `location.hash` and assigns it to `innerHTML`.

PARISA: Server never saw the payload.

JULES: Correct.

PARISA: Client-side code created the vulnerability.


## Context Matters

JULES: The hardest lesson is that output encoding is context-specific.

PARISA: HTML text context is not the same as an HTML attribute.

JULES: Or JavaScript string.

PARISA: Or CSS.

JULES: Or URL.

PARISA: So “escape angle brackets” is not a universal sanitizer.

JULES: Exactly.


## Escaping vs. Sanitizing

PARISA: Important distinction.

JULES: **Escaping or encoding** makes special characters safe for a specific output context.

PARISA: Treat the content as text.

JULES: Right.

**Sanitization** allows some markup but removes or neutralizes dangerous parts.

PARISA: Useful if I intentionally allow rich text.

JULES: Exactly.

PARISA: Use a proven sanitizer, not regex.

JULES: Please don’t parse hostile HTML with vibes.


## Frameworks Help, Until You Opt Out

PARISA: React escapes interpolated text by default.

JULES: Which significantly reduces many classic XSS mistakes.

PARISA: But `dangerouslySetInnerHTML` exists because sometimes apps need raw HTML.

JULES: And the name is doing excellent documentation work.

PARISA: Vue, Angular, templating engines—all have safe defaults and escape hatches.

JULES: Exactly.

PARISA: Framework does not save you if you deliberately bypass its protections.

JULES: Correct.


## Cookies and XSS

PARISA: Can XSS steal session cookies?

JULES: If the cookie is accessible to JavaScript.

PARISA: `HttpOnly` prevents script from reading it.

JULES: Yes.

PARISA: But XSS may still perform authenticated actions in the victim’s session.

JULES: Exactly.

PARISA: So HttpOnly reduces one impact but does not cure XSS.

JULES: Defense in depth.


## Content Security Policy

JULES: **Content Security Policy**, CSP, lets a site tell the browser what kinds of content may execute or load.

PARISA: Restrict script sources.

Block inline script unless specifically permitted.

JULES: Exactly.

PARISA: CSP can reduce XSS impact.

JULES: Strongly configured CSP can be powerful, but it should not replace safe rendering.

PARISA: Another layer.


## Trusted Types

PARISA: Browser security has newer controls too.

JULES: **Trusted Types** can help prevent DOM XSS by restricting dangerous DOM sinks so they only accept values produced by approved policies.

PARISA: Basically make unsafe `innerHTML`-style operations harder to call accidentally.

JULES: Exactly.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: `element.innerHTML = userInput`.

JULES: Please don’t do this.

PARISA: Unless it has gone through an appropriate trusted sanitizer and you truly need HTML.

JULES: Yes.

PARISA: “We strip `<script>` tags with regex.”

JULES: Absolutely not.

PARISA: “React means XSS is impossible.”

JULES: Also no.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: XSS is really a data-versus-code confusion bug.

JULES: Exactly.

PARISA: Attacker gives us data.

We accidentally tell the browser it is code.

JULES: That’s the heart of it.


## XSS Is About Trust Boundaries, Not Just Script Tags

PARISA: I want to kill one mental model before it grows legs.

XSS is not “someone typed a script tag.”

JULES: Correct.

PARISA: That is one payload.

The actual problem is attacker-controlled data reaching a browser execution context.

JULES: Exactly.

PARISA: Which means payloads can depend on where the data lands.

JULES: Right.

If input lands inside an HTML attribute, the attacker may try to escape the attribute.

If it lands inside JavaScript, the relevant syntax is JavaScript.

If it lands in a URL, URL parsing and protocol handling matter.

PARISA: Context-specific escaping finally makes emotional sense.

JULES: Good.

PARISA: We are not escaping “bad characters.”

We are preserving the boundary between data and the grammar of the destination context.

JULES: That is the better mental model.


## Sources and Sinks

JULES: DOM XSS discussions often use the terms **source** and **sink**.

PARISA: Source is where attacker-controlled data comes from.

JULES: URL parameters.

`location.hash`.

`postMessage`.

Storage.

API responses.

PARISA: Sink is the dangerous place we put it.

JULES: `innerHTML`.

`outerHTML`.

`insertAdjacentHTML`.

Dynamic script execution.

Certain URL assignments depending on context.

PARISA: So auditing client-side code can mean tracing untrusted values from source to sink.

JULES: Exactly.

PARISA: This is much more systematic than grepping for `<script>`.

JULES: Very much.


## Why `textContent` Is Boring and Wonderful

PARISA: If I want to display user-provided text, `textContent`.

JULES: Good default.

PARISA: Browser treats it as text rather than markup.

JULES: Right.

PARISA: So `<img src=x onerror=evil()>` appears literally instead of becoming an image element.

JULES: Exactly.

PARISA: This is one of those secure coding lessons where the safer API is also conceptually simpler.

JULES: Boring APIs are underrated.


## Rich Text Is Where Life Gets Complicated

PARISA: But what if I intentionally want users to submit HTML?

JULES: Then you need a sanitization policy.

PARISA: Allow paragraphs, emphasis, links.

Reject scripts, event handlers, dangerous URLs, weird embedded objects.

JULES: Exactly.

PARISA: And HTML is complex enough that this is not a homebrew regex project.

JULES: Use a well-maintained sanitizer designed for hostile input.

PARISA: DOMPurify is a common browser-side example.

JULES: Right, with configuration appropriate to your use case.

PARISA: And sanitization should happen close to where trusted HTML is produced or accepted, with the trust boundary documented.

JULES: Yes.

PARISA: Otherwise the codebase starts passing around strings where nobody knows whether “HTML” means raw, escaped, or sanitized.

JULES: Which is how somebody eventually calls the wrong sink.


## URL-Based XSS

PARISA: Links deserve their own warning.

JULES: Yes.

PARISA: If I let users provide a URL, I care about more than HTML escaping.

JULES: Right.

A URL like `javascript:...` can be dangerous in contexts that execute JavaScript URLs.

PARISA: So validate allowed schemes.

`https:`.

Maybe `mailto:` if the product needs it.

JULES: Exactly.

PARISA: Again: context.


## `postMessage` and Cross-Origin Windows

PARISA: Modern apps use `postMessage`.

JULES: Frames and windows can communicate across origins through it.

PARISA: Which intentionally creates an exception to normal same-origin isolation.

JULES: So receivers should verify the message origin and validate the message data.

PARISA: `if (event.origin !== expectedOrigin) return`.

JULES: That kind of check, yes.

PARISA: And don’t blindly feed message data into an HTML sink.

JULES: Correct.

PARISA: Browser security primitives are useful right up until we write “accept everything.”

JULES: A recurring theme.


## What Can XSS Actually Do?

PARISA: Let’s be concrete.

If an attacker gets JavaScript execution in my origin, what can happen?

JULES: It depends on the application and browser protections.

They may read sensitive DOM content.

Make authenticated requests.

Modify what the user sees.

Capture input.

Redirect users.

Call application APIs.

PARISA: Potentially steal non-HttpOnly tokens from storage.

JULES: Yes.

PARISA: Or change a payment destination displayed in the page.

JULES: Integrity attack.

PARISA: So XSS is not merely “annoying alert box.”

JULES: The alert box is a safe proof of concept.

Real impact can be account compromise or data theft.


## Why `HttpOnly` Matters Without Solving XSS

PARISA: We said HttpOnly cookies can’t be read by JavaScript.

JULES: Which is useful.

PARISA: But malicious script running on my site can still send requests that automatically include the cookie.

JULES: Correct.

PARISA: It might not know the session secret, but it can act through the victim’s browser.

JULES: Exactly.

PARISA: So the control protects credential confidentiality but not necessarily session abuse.

JULES: Scope of control.


## CSP in More Detail

PARISA: Let’s make Content Security Policy less mystical.

JULES: CSP is an HTTP response policy.

PARISA: Browser reads directives like where scripts can load from.

JULES: Right.

A strong policy can avoid broad `'unsafe-inline'` execution and use nonces or hashes for scripts the page intentionally authorizes.

PARISA: A CSP nonce is a random value attached to approved script elements and included in the policy.

JULES: Exactly.

PARISA: Attacker-injected script does not automatically have the nonce.

JULES: Right.

PARISA: Unless our application stupidly exposes or copies it into attacker-controlled markup.

JULES: Security controls can be undermined by implementation.

PARISA: Naturally.


## XSS and Third-Party Scripts

PARISA: What about analytics, chat widgets, tag managers?

JULES: If you execute a third-party script in your origin, you are granting that code significant power.

PARISA: So third-party JavaScript is a supply-chain decision.

JULES: Yes.

PARISA: CSP can restrict script sources, but if I intentionally allow a compromised trusted vendor script—

JULES: The browser may execute it because your policy trusts that source.

PARISA: Which is why “trusted origin” and “trustworthy forever” are different statements.

JULES: Exactly.


## XSS Testing

PARISA: How do developers test for this responsibly?

JULES: Start with code review and automated tooling, then test input paths in environments you’re authorized to test.

PARISA: Look at rendering contexts.

Try harmless payloads.

Inspect whether characters are encoded or markup is created.

JULES: Browser developer tools help.

Security scanners can help.

PARISA: But scanners will not understand every custom DOM flow.

JULES: Right.

PARISA: Human understanding still matters.


## Old Person Yells at Cloud

[STING]

### OLD PERSON YELLS AT CLOUD

PARISA: Server-rendered PHP got mocked for years, but `htmlspecialchars` used correctly in a boring template solved a very understandable problem.

JULES: Absolutely.

PARISA: Modern frontend complexity did not repeal output encoding.

JULES: No.

PARISA: We just moved some of the rendering and trust boundaries into the browser.

JULES: Exactly.

PARISA: The old security lesson survived the framework migration.

JULES: A lot of old web lessons did.

## Security+ Corner

JULES: Understand XSS as a web application injection attack, common delivery patterns, input/output handling, browser controls, secure coding, and defense in depth.

PARISA: For developer depth, know stored, reflected, and DOM-based XSS.

JULES: And contextual output encoding.


## What Did We Actually Learn?

PARISA: Treat untrusted content as data.

JULES: Encode for the output context.

PARISA: Sanitize only when HTML is intentionally allowed.

JULES: Use safe framework defaults, CSP, HttpOnly cookies, and browser protections as layers.

PARISA: Next: injection.

JULES: Stop concatenating untrusted shit.

[MUSIC OUT]
