# Episode 5: Views, Display Modes & Render Arrays: Who Actually Builds the Page?

**Series:** Modern CMS Development
**Hosts:** Parisa, Jules
**Production:** September 2026. Audio-first finished script; recording handled separately.

[INTRO MUSIC]

PARISA: I changed the event title. The event page has the new title. The department page has the old title. The sidebar has apparently formed its own government.

JULES: We should inspect how each piece is built and cached.

PARISA: I was hoping for a button labeled Make Website Agree With Itself.

JULES: That's the architecture.

PARISA: Terrible button label.

## A List Is a Query With Decisions Attached

JULES: Welcome to Okay, But Why? Bellweather has structured events. Now we need an upcoming-events list. Drupal Views lets us configure queries and their presentation.

PARISA: Translate the Drupal: a View is not simply a template. It's a saved definition of what to retrieve and how to present it, with supporting configuration.

JULES: Exactly. Views is in core. For ordinary database-backed content, it can construct queries from configuration. Extensions can add other integrations, but we'll start with events stored in Drupal.

PARISA: I'd normally write a query: select published events whose start is in the future, order by start, limit the results. Then render them.

JULES: Views gives a site builder an interface for much of that work. Filter by content type Event. Filter by published status. Add the relevant date condition. Sort ascending by start time. Set a pager or limit.

PARISA: We still need to define upcoming. Does an event that began an hour ago but lasts all day count? If yes, filtering only by start time is wrong.

JULES: Good. A query builder doesn't choose the business meaning. We might filter by end time, handle missing end times deliberately, and account for stored time zones and display time zones.

PARISA: There's the value of knowing SQL. Even when the interface generates it, we still need to reason about conditions, joins, and result sets.

## Follow the Relationship

JULES: The event references a Location. We want to filter events by that location's campus.

PARISA: Then the query needs a relationship to the referenced location before it can use its campus information. Conceptually, a join.

JULES: Right. In Views, adding a relationship makes related data available for fields, filters, or other parts of the query. Whether the relationship is required affects which results survive.

PARISA: Like an inner join excluding an event with no matching location versus a left join preserving it. The interface doesn't repeal relational algebra.

JULES: And multi-value relationships can multiply rows. If an event has three speakers, joining speakers can produce several rows for one event.

PARISA: So if the pager says ten results and I see repeated events, I inspect relationship cardinality and query behavior. I don't immediately hide duplicates with CSS and declare victory.

JULES: Aggregation or distinct handling may help in suitable cases, but we need to understand what values we're combining. Sometimes the correct design is to render the entity and let its multi-value field display its speakers.

## Three Kinds of Filter Input

JULES: A regular filter can be configured in the View: only published Event nodes, for example.

PARISA: An exposed filter lets the visitor choose a value, like subject or campus. It's a form controlling the query.

JULES: Exactly. It needs a proper label, a useful empty option, understandable results, and keyboard operation. An AJAX update also needs to communicate that the results changed.

PARISA: And contextual filters?

JULES: They receive an argument from context, often a route argument or a configured default. On a department page, the department identifier can tell an event listing which department to match.

PARISA: So contextual doesn't mean psychic. Something supplies the value, and the View must define what happens when it's missing or invalid.

JULES: Precisely. Show all results, show none, use a default, or reject the context—those are choices to configure carefully.

PARISA: And a filter isn't a complete authorization system. A published-only condition is useful, but custom entity and field access rules still matter. We test what an anonymous visitor and each relevant role can retrieve.

## A View Display Isn't an Entity View Mode

JULES: One View can have several displays: a page at a route, a block for placement elsewhere, perhaps a feed. Displays can inherit defaults and override particular settings.

PARISA: Which is different from a node's Teaser view mode. Drupal has named both things with the word display and then left us to cope.

JULES: A View display describes an output of the query configuration. An entity view mode describes how an individual entity should be rendered.

PARISA: They can cooperate. The View's page display retrieves events, and each result is rendered in the event's Teaser view mode.

JULES: Exactly. Alternatively, Views can render selected fields directly. That gives flexibility, but can bypass some of the consistency you get from reusing an entity display.

PARISA: If we fix the event teaser's date format, a listing using that view mode can benefit. A listing assembling its own fields may need a separate change.

[CODE CARD: Keep these names separate]
```text
View: upcoming_events
  Filter: published Event records whose end has not passed
  Sort: start ascending, then ID for stable ordering
  Relationship: Event -> Location, if campus filtering needs it
  Exposed filter: subject
  Contextual filter: department ID supplied by the embedding context

View displays: page / block
Row rendering choice: Event in teaser view mode

View display = an output of a query configuration
Entity view mode = a named way to render one entity
```

## The Approximate Rendering Journey

JULES: Let's follow a single event. Drupal loads the content entity. An entity view builder prepares it for a chosen view mode. Field formatters contribute output descriptions. Drupal's rendering and theme systems resolve those descriptions, often through Twig templates, into HTML.

PARISA: Content, entity, view mode, render array, theme system, Twig, HTML. Useful sequence, but not a literal law that every request passes through every stage exactly once.

JULES: Right. A page contains a tree of components. Some output is already cached. Some is a form or a custom controller result. Some render elements don't need a Twig template. The diagram is a mental map, not a stack trace.

PARISA: And Views sits upstream when we need a list. It decides which things participate and how rows are prepared. It doesn't replace the entire rendering system.

## Why Return an Array Instead of HTML?

PARISA: Here's my PHP instinct: I know the value. Escape it, wrap it in markup, return a string. Why does Drupal want a render array?

JULES: Because rendering is more than choosing angle brackets. A render array is a structured description of output to build later. It can carry children, theme information, attached assets, access results, and cache metadata.

PARISA: Deferred work with context attached. Like handing the renderer a recipe for a piece of output rather than a finished string with all its history stripped away.

JULES: Yes, though this recipe analogy is separate from Drupal Recipes, the installation/configuration feature we'll discuss later. Drupal has enough overloaded nouns without us adding more.

PARISA: Thank you for policing our metaphors.

JULES: Keys beginning with a hash are render properties with special meanings. Other keys can represent child elements. The array is ordinary PHP syntax; the meaning of those keys is Drupal's Render API.

PARISA: A key called plain text asks Drupal to treat the value as text, not trusted HTML. Useful when displaying a stored label or external value.

[CODE CARD: A small render array, inside a method where $node is loaded and access-checked]
```php
use Drupal\Core\Cache\CacheableMetadata;

$build = [
    '#type' => 'container',
    'event_name' => [
        '#plain_text' => $node->label(),
    ],
];

CacheableMetadata::createFromObject($node)->applyTo($build);
return $build;
```

JULES: The card is a method-body example, not a complete controller. It demonstrates carrying an entity's cacheability into derived output. The surrounding code must obtain the correct entity and handle access.

PARISA: If access depends on the current user or permissions, the access result can carry cacheability too. We must preserve that information rather than turn it into a naked true or false and forget why.

## Cache Tags: What Changed?

JULES: A cache stores reusable work. Cache tags describe dependencies so Drupal can invalidate related cached results when data changes.

PARISA: Our event label depends on that event. If the title changes, cached output tagged with that dependency should be invalidated.

JULES: Yes. A tag isn't a separate cached copy for each visitor. It's a label used for invalidation. An entity can supply its tags through the API so we don't hard-code all the details ourselves.

PARISA: A list has a subtle dependency too. If I create a new event, a cached list of upcoming events must change even though the new event wasn't in the old list.

JULES: Exactly. List-level dependencies matter, not just tags for the items already present. Core entity and Views systems handle much of this when used correctly; custom queries need deliberate cacheability design.

PARISA: Otherwise the title update works but adding an event doesn't. That's a clue about which dependency we forgot.

## Cache Contexts: What Makes Two Requests Different?

JULES: Cache contexts describe variations. Output might differ by interface language, permissions, route, or a relevant query parameter.

PARISA: If visitors can filter by campus, North Campus and South Campus results can't share one cached value as though the requests were equivalent.

JULES: Right. If output depends on a query argument, its cacheability needs to reflect that dependency. If it depends on permissions, a suitable permissions context may be required.

PARISA: And if it's a personal greeting containing a person's name, permissions alone won't distinguish two users with identical permissions. We'd need the appropriate user variation, or a different strategy for that personalized fragment.

JULES: Exactly. Use the variation the output actually depends on. Varying everything by user can destroy useful sharing. Failing to vary personalized output can expose the wrong person's information.

PARISA: So this is correctness and privacy work, not only performance tuning.

## Max-Age: How Long Is It Valid?

JULES: Max-age expresses a time limit on reuse. Zero says this result isn't cacheable in that context. A permanent value means no time-based expiry, though tags can still invalidate it.

PARISA: Permanent doesn't mean ignore edits forever. It means time isn't the reason we expire this item; dependency changes may still be the reason.

JULES: Exactly. And time-based queries need thought. An upcoming-events list can become stale simply because the clock passed an event's ending time. No editor saved anything, so no content edit necessarily invalidated it.

PARISA: We need a suitable expiration or invalidation strategy for that boundary. Tags alone don't announce that Thursday has happened.

JULES: Correct. Also, render caching, page caching, reverse proxies, and browser caching are related but distinct. Setting a render array's max-age isn't a complete configuration for every cache between Drupal and the visitor.

[CODE CARD: Three different questions]
```text
Cache tags      What data/configuration changes invalidate this output?
Cache contexts  Which request differences require separate variants?
Max-age         How long may this output be reused without another signal?

Event changed?                  dependency/tag question
Different language or user?    variation/context question
Event expires with time?       time/expiration question

Metadata from nested output must reach the containing response.
Do not replace missing metadata with routine full-cache clears.
```

## Metadata Travels With the Output

PARISA: Why keep this metadata on render arrays instead of setting it once on the whole page?

JULES: Because the page doesn't necessarily know every nested dependency. A location field formatter might depend on a referenced building. A block might depend on permissions. The rendering system combines cacheability as those pieces participate.

PARISA: So the component that knows why its output varies can declare that fact, and it travels upward. If I prematurely render it into an ordinary string or pluck out a raw value, I risk losing that information.

JULES: Exactly. Preserve render structures until the intended rendering stage, and use the cacheability APIs for derived output. Lower-level optimizations shouldn't quietly remove the correctness contract.

PARISA: That's the first time render arrays have felt less like ceremonial PHP and more like an answer to a real problem.

## Diagnose the Disagreement

JULES: Back to our inconsistent title. First, confirm each area is actually using the same event and revision.

PARISA: Then check whether a listing uses the entity label, an independently stored heading, or a rewritten Views field. If it's different data, clearing caches won't fix the model.

JULES: If the data source is correct, inspect cache dependencies and variants. Does the custom sidebar carry the event's cache metadata? Is an external cache retaining the old response? Are we looking at the same language?

PARISA: A cache rebuild can help during development or deployment when discovery information changes. It can also temporarily hide an invalidation bug. If the bug returns after the next edit, “clear it again” isn't the finished fix.

JULES: Test a warmed cache, edit content, and request again as the relevant users. Cold-cache tests alone miss the problem.

PARISA: Also create a new matching event and wait across a time boundary. That's how we test list membership and expiry, not just title replacement.

## The Layers Now Have Jobs

JULES: Views selects and arranges results. View modes select an entity presentation. Render arrays describe output with its dependencies. The theme system and Twig shape much of the HTML. Caches reuse work under declared conditions.

PARISA: Which means “who builds the page” has several answers because building the page contains several jobs. The trick is knowing which job we're debugging.

JULES: Next time, the frontend: Twig, themes, libraries, behaviors, and Single Directory Components.

PARISA: We have successfully collected the data and kept the sidebar from seceding. Now let's give it a sensible heading.

[OUTRO MUSIC]

## Production References

- Views concepts: https://www.drupal.org/docs/user_guide/en/views-concept.html
- Render API: https://www.drupal.org/docs/drupal-apis/render-api
- Cache contexts: https://www.drupal.org/docs/develop/drupal-apis/cache-api/cache-contexts
- Cache tags: https://www.drupal.org/docs/develop/drupal-apis/cache-api/cache-tags
- Cache max-age: https://www.drupal.org/docs/develop/drupal-apis/cache-api/cache-max-age
- CacheableMetadata: https://api.drupal.org/api/drupal/core%21lib%21Drupal%21Core%21Cache%21CacheableMetadata.php/class/CacheableMetadata/11.x
- Render-array card is an explicitly scoped method-body example, not a runnable standalone application.
