# Episode 9: APIs, Headless Drupal & Modern Drupal

**Series:** Modern CMS Development
**Hosts:** Parisa, Jules; Sabrina joins the frontend tradeoff discussion
**Production:** September 2026. Audio-first finished script; recording handled separately.

[INTRO MUSIC]

JULES: What if Drupal didn't render the frontend?

PARISA: Would it get a holiday?

JULES: It would provide content through an API, and another application would render it.

PARISA: So Drupal keeps its job, and we hire another application.

JULES: That's one way to describe it.

PARISA: Good. Let's ask what we're paying the new application to do.

## Separate the Responsibilities

JULES: Welcome to Okay, But Why? Headless or decoupled Drupal means separating some or all of the visitor-facing presentation from Drupal's own frontend rendering.

PARISA: Editors can still work in Drupal. Content still has fields, relationships, revisions, and permissions. Another application asks Drupal for data and decides how to present it.

JULES: Exactly. That application might use React, Next.js, a mobile framework, or another technology. Drupal doesn't require React merely because we've chosen an API boundary.

PARISA: Nor does headless mean every page is rendered in the browser. A separate frontend can render on a server, generate pages ahead of time, or combine approaches.

JULES: Good distinction. Decoupling describes responsibilities and communication. Rendering location and timing are additional decisions.

PARISA: We can also decouple only part of a site. Drupal can render most pages while a specialized interactive feature uses an API. We don't have to amputate the entire theme to add one useful widget.

## JSON:API Is a Specific Contract

JULES: Drupal core includes a JSON:API module that exposes content entities through a standardized resource-oriented API. It's opinionated about how those resources are represented.

PARISA: JSON is the data format. JSON:API, with the punctuation, is a specification for a particular document and interaction structure. An endpoint returning arbitrary JSON isn't automatically a JSON:API endpoint.

JULES: Exactly. Drupal's module maps entity types and bundles to resource types. An Event node bundle can appear as node double-underscore event in the resource type and under a node slash event endpoint.

PARISA: Attributes represent values on the resource, while relationships identify related resources. That maps nicely to our structured-content work: the API doesn't have to scrape a location out of a paragraph.

JULES: Resource identifiers commonly use UUIDs in Drupal JSON:API. Don't assume the API resource ID is the same as the numeric node ID you saw in an admin URL.

PARISA: That's the sort of small assumption that creates a very long debugging afternoon.

## Serialization Is a Translation Boundary

JULES: Serialization turns application data into a transferable representation. Drupal's internal entity object has methods and framework state; the client receives a document describing allowed data, not a live PHP object.

PARISA: So we choose what crosses the boundary. The frontend doesn't gain direct access to Drupal's database or service container because it knows the API URL.

JULES: Exactly. JSON:API provides conventions for attributes, relationships, pagination, filtering, and related-resource inclusion. The available values still depend on the site's model and access rules.

PARISA: Drupal's REST module is another API mechanism, with a different configuration and resource model. And GraphQL would be another choice through appropriate contributed tooling, not a hidden synonym for JSON:API.

JULES: Right. REST is an architectural style; Drupal REST and Drupal JSON:API are specific implementations with different contracts. We'll leave the deeper HTTP and API-design exploration to our separate API series.

## Make a Small Read Request

JULES: Our companion includes a complete Node.js script that asks an existing Drupal site for a few public Event records. It uses modern JavaScript and Node's built-in fetch, not Drupal-specific JavaScript.

PARISA: It doesn't create the Drupal site or its Event bundle. Those are explicit prerequisites. It reads a base URL from the environment so nobody mistakes our fictional university for an actual service.

[CODE CARD: read-events.mjs; Node.js 22+ and an existing public JSON:API endpoint]
```javascript
const base = process.env.DRUPAL_BASE_URL;
if (!base) throw new Error('Set DRUPAL_BASE_URL to your test Drupal site.');

const endpoint = new URL('/jsonapi/node/event', base);
if (!['https:', 'http:'].includes(endpoint.protocol)) {
  throw new Error('Use an HTTP(S) Drupal URL.');
}
endpoint.searchParams.set('fields[node--event]', 'title');
endpoint.searchParams.set('page[limit]', '5');

const response = await fetch(endpoint, {
  headers: { Accept: 'application/vnd.api+json' },
  signal: AbortSignal.timeout(10000),
});
if (!response.ok) throw new Error(`Drupal returned HTTP ${response.status}.`);

const document = await response.json();
if (!Array.isArray(document.data)) {
  throw new Error('Expected a JSON:API resource collection.');
}
for (const resource of document.data) {
  const title = resource?.attributes?.title;
  if (typeof resource?.id !== 'string' || typeof title !== 'string') {
    throw new Error('An event did not match the expected data shape.');
  }
  console.log(`${resource.id}: ${title}`);
}
if (document.links?.next) {
  console.log('More results are available; this example reads only one page.');
}
```

JULES: The optional-chaining syntax checks whether intermediate properties exist before reading deeper. That's JavaScript. The array check and string checks happen at runtime because remote data isn't made trustworthy by our expectations.

PARISA: A TypeScript type annotation alone wouldn't validate this response. We'd still need runtime validation, possibly with a schema library in a larger application. Here the small checks make the boundary visible without another dependency.

JULES: The example limits fields and results. In a real application, use pagination deliberately and handle errors, empty results, retries where appropriate, and loading feedback.

PARISA: An empty array might mean no matching events. It might also mean the current caller lacks access to them. Don't diagnose every empty response as a broken database.

## Relationships Don't Fetch Themselves for Free

JULES: If the event relates to a location, the API can represent that relationship. Clients can request related data through supported inclusion patterns or separate requests.

PARISA: We should inspect the real field machine names. A relationship called field location only exists if our site actually defines it that way.

JULES: Exactly. And asking for every relationship recursively can create large responses and expensive work. Request what the interface needs, avoid repeated per-item fetches where practical, and measure.

PARISA: The same old query-design lesson, now with network round trips. An API boundary can make inefficient access patterns more expensive and more visible.

JULES: It can also make the contract clearer. The frontend needs an event title, date, location label, and URL—not an unrestricted copy of every field in the CMS.

## Authentication Isn't Authorization

PARISA: Drupal already has permissions. Does the API honor them?

JULES: It uses entity and field access mechanisms, so their correctness matters. Enabling an API makes those access decisions visible through another interface. We must audit what anonymous and authenticated callers can retrieve.

PARISA: A field hidden from the theme may still be available through an API if access permits it. Presentation hiding was never a confidentiality rule.

JULES: Exactly. JSON:API is read-only by default in its standard configuration. Enabling writes is a separate decision requiring appropriate permissions, authentication, validation, and request protections.

PARISA: Authentication identifies the caller. Authorization decides what that caller may do. A successfully logged-in person is not automatically allowed to edit every event or publish a pending revision.

JULES: Credential handling depends on the architecture. A server-side frontend may hold server credentials securely, but it must not accidentally grant every visitor the service account's powers. Browser clients can't keep a shared secret hidden in shipped JavaScript.

PARISA: Session-cookie requests need the appropriate CSRF protection for mutations. Token-based systems have their own storage and lifecycle concerns. OAuth support may come from a contributed module or an external identity setup; it isn't something JSON:API invents for us.

JULES: And CORS controls which browser origins can read certain cross-origin responses. It isn't authentication, and it doesn't stop non-browser clients from making requests.

PARISA: We will continue saying that until the internet develops object permanence.

## Two Applications Mean Two Cache Stories

JULES: Drupal may cache API responses. The separate frontend may cache fetched data or rendered pages. A CDN or browser may cache another layer.

PARISA: Updating the event in Drupal doesn't automatically invalidate a page generated yesterday by another application. Drupal's internal cache tags do not telepathically cross the network.

JULES: Exactly. We need an agreed freshness strategy: expiration, webhooks, explicit invalidation, rebuilds, or a combination. We should also handle delivery failures and avoid letting an unauthenticated caller trigger arbitrary expensive rebuilds.

PARISA: And previews need a separate path. A reviewer should see the pending revision with appropriate access, while the public cache continues serving approved content.

JULES: Don't put authenticated preview responses into a shared public cache. Include the relevant identity or authorization boundary, or avoid caching that response where sharing would be unsafe.

PARISA: This is why the phrase “just fetch it” has such a short shelf life in an editorial system.

## What Did We Give Up?

SABRINA: I like building frontends in React. I also don't want to pretend that recreating every CMS integration is a free weekend.

PARISA: Please continue. This is the most comforting sentence I've heard about headless architecture.

SABRINA: If Drupal renders the site, it already has ways to connect menus, forms, language handling, access, contextual editing, previews, field formatters, and cache metadata to output. In a separate frontend, we need to decide how each required feature works across the boundary.

JULES: Some capabilities remain in Drupal but need frontend integration. Others may require a new implementation. A contributed module that outputs a ready-made Drupal form doesn't automatically supply a polished React equivalent.

PARISA: Redirects, canonical URLs, error pages, search, sitemaps, accessibility, and analytics also need owners. They weren't just decorative accessories on the old theme.

SABRINA: And editors may lose the ability to preview exactly what visitors see unless we build that preview deliberately. Developer comfort matters, but it's not the only person's workflow in the system.

JULES: That's the tradeoff. A decoupled frontend can offer independent deployment, specialized interactions, multiple channels, and a good fit for an established frontend team. It also adds contracts, operations, and coordination.

## A Good Reason and a Weak Reason

PARISA: Bellweather has a mobile app, campus displays, and a website all using event data. Is that a good reason for APIs?

JULES: Yes. Structured content and a shared API can support multiple consumers. It doesn't necessarily require replacing Drupal's website theme, though. Drupal can render the web while serving data to other channels.

SABRINA: If the main website needs a highly specialized application experience and our team already operates the chosen frontend stack, full decoupling might make sense.

PARISA: Weak reason: “Twig feels old, and our frontend should be modern.”

JULES: Exactly. Server-rendered, accessible HTML can be entirely modern. A second application is justified by requirements, not by avoiding a template language's birthday.

## Recipes Solve a Different Modernization Problem

JULES: Another current Drupal improvement is Recipes. These package setup instructions that can install extensions and apply configuration to a site.

PARISA: So a recipe could help establish an editorial feature without someone manually reproducing every configuration click. It doesn't require a headless frontend.

JULES: Correct. Recipes are applied, rather than remaining enabled and uninstalled like modules. Applying one can enable modules, but the recipe itself isn't a long-running module governing all future behavior.

PARISA: Which means changing a recipe later isn't automatically a migration for every site that once applied it. Ongoing updates and configuration management still need a plan.

JULES: Exactly. Composer can obtain recipes and their dependencies. Current recommended project tooling supports their placement and dependency handling; older projects may need additional setup.

[CODE CARD: Minimal recipe.yml for an existing site's reviewed setup workflow]
```yaml
name: Bellweather API foundation
description: Enables core JSON:API; access must be reviewed separately.
type: Site
install:
  - jsonapi
```

[TERMINAL]
```sh
# Example layout: project/recipes/bellweather_api/recipe.yml
# Existing test site; execute from project/web.
php core/scripts/drupal recipe ../recipes/bellweather_api -v
```

PARISA: This enables the module. It does not create the Event bundle, configure an OAuth server, grant permissions, or prove the exposed data is appropriate. Small example, specific promise.

JULES: And because it changes site configuration, inspect and export the result through the project's normal workflow before deployment.

## Drupal CMS and Canvas Aren't New Names for Core

SABRINA: The current product direction can be confusing because Drupal CMS is also a named product built on Drupal core. Drupal CMS 2.0 launched in January 2026 with Canvas as its default visual editing experience.

PARISA: So Drupal CMS version two is not Drupal core version two. Wonderful. Version numbers have joined the terminology party.

JULES: Exactly. Core, the assembled Drupal CMS product, and projects such as Canvas have separate release tracks. Canvas was previously known as Experience Builder. Read compatibility requirements rather than assuming a Drupal 10 site can install every current package.

SABRINA: These tools aim to make building and editing sites more approachable. They don't erase the need to understand entities, access, configuration, or the distinction between developer components and editor-facing composition.

## Design the Boundary Before Choosing the Framework

PARISA: Before Bellweather decouples, I want a small vertical test: one event, one list, one preview, one restricted field, one publication update, and one failure when Drupal is temporarily unavailable.

JULES: That test tells us whether the proposed architecture supports the actual editorial and visitor experience. We can measure response time, freshness, accessibility, and operational complexity.

SABRINA: And if integrated Drupal with a few interactive components meets the needs, we can choose it without apologizing to the JavaScript ecosystem.

PARISA: I wasn't planning to apologize, but it's nice to have support.

JULES: The separate API series goes deeper into contracts, HTTP behavior, authentication, and integration design. Here, the connection is that structured CMS data can serve more than one presentation.

PARISA: Headless Drupal isn't automatically modern Drupal but better. It's a different division of work. Next time, we compare the choices and ask what problem we're actually solving.

[OUTRO MUSIC]

## Production References

- JSON:API overview: https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module
- JSON:API access and read-only configuration: https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/security-considerations
- Specification: https://jsonapi.org/format/
- Recipes: https://www.drupal.org/docs/extending-drupal/drupal-recipes/how-to-download-and-apply-drupal-recipes
- Drupal CMS 2.0: https://www.drupal.org/blog/drupal-cms-20-is-here-visual-building-ai-and-site-templates-transform-drupal
- Canvas releases: https://www.drupal.org/project/canvas
- Examples require an existing test site; no API endpoint or recipe was executed against a live Drupal site during production.
