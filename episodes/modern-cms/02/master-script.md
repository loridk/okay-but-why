# Episode 2: WordPress: How Did a Blogging Tool Eat the Web?

**Series:** Modern CMS Development
**Hosts:** Parisa, Jules
**Production:** September 2026. Audio-first finished script; recording handled separately.

[INTRO MUSIC]

JULES: Bellweather University needs a news website.

PARISA: Someone has suggested WordPress.

JULES: That sounds reasonable.

PARISA: Someone else says WordPress is only for blogs. A third person says it can replace the student records system. We have achieved the full spectrum of unhelpful confidence.

JULES: Can we begin with the actual news website?

PARISA: A radical intervention. Let's try it.

## The Blog Was a Useful Starting Point

JULES: Welcome to Okay, But Why? WordPress began in 2003 as a blogging project, growing from b2/cafelog. Its publishing roots explain some names that can otherwise seem peculiar.

PARISA: Blogging meant people repeatedly publishing entries, often arranged newest first, with authors, dates, categories, and comments. That's a useful bundle of needs, not an embarrassing childhood to conceal.

JULES: And a lot of organizations also need people to publish entries with authors, dates, categories, and comments. News, announcements, essays, project updates. The starting point generalized well.

PARISA: Add an ecosystem of themes, plugins, hosting, documentation, and people who already know how to use it, and the value isn't just the code. It's the availability of a whole working arrangement.

JULES: WordPress the open-source software is also distinct from WordPress.com, a hosted service. Hosting arrangements and available features can differ. We're discussing the software's architecture.

PARISA: Good. Otherwise a question about PHP somehow turns into a pricing-plan argument.

## Posts, Pages, and a Table With an Overloaded Name

JULES: A post is a content entry commonly used for dated publishing. A page is typically used for relatively durable information, like About or Contact. Pages can be hierarchical.

PARISA: “Typically” matters. A page isn't magically permanent, and a post isn't legally required to contain an opinion about breakfast.

JULES: Both are examples of post types. That broader term includes more than blog posts. WordPress stores many such objects in its posts table, distinguishing them with a post-type value.

PARISA: So I see a table called posts and shouldn't conclude every row is a blog article. It's a shared storage model for several kinds of content objects.

JULES: Exactly. The usual table prefix is wp underscore, but sites can use another prefix. We shouldn't hard-code that assumption into custom queries.

PARISA: And a custom post type is a registered kind of content, like an Event. It doesn't necessarily create a new database table called events.

JULES: Right. Registration tells WordPress how that type behaves: labels, supported editing features, visibility, capabilities, and API exposure. Individual events remain individual records.

PARISA: That explains a lot. “Custom” means our content type is registered with the system, not that we've discarded the system and created an unrelated schema.

JULES: Additional properties commonly live in post metadata. That's a key-and-value style extension to the main record. Plugins may also use custom tables when their needs justify it.

PARISA: Metadata is flexible, but complex querying across lots of values can become awkward. We should understand the storage and indexes instead of assuming every field behaves like a purpose-designed relational column.

## Give the Event a Proper Name

JULES: In the companion there's a small complete plugin that registers Bellweather Events. It uses a prefixed internal name so we're less likely to collide with another plugin.

PARISA: And it lives in a plugin because the university's events should still exist as a registered content type if we change the visual theme.

JULES: Correct. The data isn't automatically deleted when registration code disappears, but the normal editing and display interfaces can stop recognizing it as expected. That's an unpleasant surprise during a redesign.

PARISA: The code hooks into WordPress initialization, then calls its registration function. The function and array syntax are PHP. The names init and register post type are WordPress APIs.

[CODE CARD: Complete small plugin; wp-content/plugins/bellweather-events/bellweather-events.php]
```php
<?php
/**
 * Plugin Name: Bellweather Events
 * Description: Registers a basic editorial event type.
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

function bellweather_register_events() {
    register_post_type('bw_event', [
        'labels' => [
            'name' => 'Events',
            'singular_name' => 'Event',
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'revisions'],
        'rewrite' => ['slug' => 'events'],
    ]);
}
add_action('init', 'bellweather_register_events');

function bellweather_events_activate() {
    bellweather_register_events();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'bellweather_events_activate');
```

JULES: This is a basic public content type, not a finished event-management product. It doesn't implement dates, bookings, or department-specific permissions. It uses the default post capabilities, which you should review for the real editorial roles.

PARISA: And it refreshes rewrite rules on activation, not on every request. Rebuilding routing information constantly because it fixed one development problem is an expensive superstition.

JULES: The API-exposure setting also supports the block editor's expectations. Turning it on deserves an access review; it isn't a substitute for permissions.

## Taxonomy Is Classification

PARISA: We want visitors to find science events and arts events. Is that another post type?

JULES: Usually it's classification of events, not a different kind of record. WordPress calls a classification system a taxonomy. Categories and tags are built-in examples; custom taxonomies can describe things like academic subject.

PARISA: The taxonomy is the classification system, and a term is one of its values. Subject is the taxonomy; Botany is a term.

JULES: Exactly. Hierarchical taxonomies can express parent-child groupings. Flat ones can express labels without that hierarchy. The shape should match editorial meaning.

PARISA: If editors type Science, Sciences, and science exclamation mark, a free-text field has allowed three spellings where visitors needed one filter.

JULES: A controlled vocabulary can help. It still needs ownership: who may add terms, merge duplicates, and decide what they mean?

PARISA: A taxonomy does not prevent an organization from having meetings about terminology. It gives the meeting's result somewhere to live.

JULES: And relationships to terms are stored through taxonomy-related tables. You don't need to memorize the joins to use the API, but knowing there's a relationship explains why this isn't just a comma-separated string.

## Who Turns the Record Into a Page?

JULES: A theme supplies presentation. Templates describe the structure for different requests. The template hierarchy determines which suitable template WordPress uses.

PARISA: In a classic PHP theme, a specific template for a single event can take precedence over a general single-content template, which can fall back further. It's a selection mechanism, not random filename folklore.

JULES: The familiar Loop iterates over posts returned by a query and renders them. It isn't necessarily the database query itself. WordPress has already interpreted the request and prepared query results in the common main-query flow.

PARISA: I appreciate that distinction. Calling every layer “the Loop” makes debugging feel like arguing with a washing machine.

JULES: Block themes use block-based templates, usually stored as HTML template files, with Site Editor customizations also able to live in the database. Theme configuration can live in theme.json.

PARISA: Which means “I changed the template” needs a follow-up: in a tracked theme file or in the site's editor? Otherwise deployment becomes a mystery involving two sources of truth.

JULES: Exactly. Classic themes, block themes, and hybrid arrangements exist. Don't assume every WordPress site has the same frontend architecture just because it runs the same CMS.

PARISA: Nor should we casually edit a parent theme that updates will replace. Use an appropriate child theme or a maintained custom theme, and know where your change belongs.

## Plugins Add Behavior; Hooks Connect It

JULES: Plugins extend functionality. They can register content types, add integrations, provide blocks, change admin behavior, and much more.

PARISA: But how does my plugin participate without editing WordPress core?

JULES: Hooks. WordPress exposes named extension points. Your code registers a callback, and WordPress calls it at the relevant point.

PARISA: Ordinary PHP functions or other callables, wired into a framework's lifecycle. Not PHP automatically recognizing a sacred function name.

JULES: Right. Two major kinds are actions and filters. An action says something is happening; run the registered behavior. A filter passes a value through callbacks that return the resulting value.

PARISA: Action: initialization is happening, so register our event type. Filter: here's an excerpt length, return the length we want.

JULES: And a filter callback must return the value. Printing a value is not returning it. That distinction is plain PHP and can be very visible when a callback accidentally leaks text into the page.

[CODE CARD: A filter can be added to the same demo plugin]
```php
function bellweather_excerpt_length($length) {
    return 24;
}
add_filter('excerpt_length', 'bellweather_excerpt_length');
```

PARISA: This affects automatically generated excerpts where that filter is used. It doesn't rewrite every stored summary or trim every paragraph everywhere.

JULES: Yes. The contract of the hook matters. Its arguments, when it runs, and what its return value means. Callback priority affects ordering, so multiple plugins can influence the same result.

PARISA: Which is useful until three plugins each believe they are the final authority on punctuation.

JULES: Then debugging includes finding which callbacks are registered, not just staring at the template. The visible output may have passed through several extensions.

## Gutenberg and Blocks

PARISA: We should unpack Gutenberg, because people use the name for several related things.

JULES: It's the project behind WordPress's block editing direction, and there's also a Gutenberg plugin where features can develop ahead of their inclusion in core. The core block editor is the normal editing interface on many modern sites.

PARISA: A block is an editable unit of content or layout: paragraph, image, heading, a custom event feature, and so on.

JULES: A custom block can have a JavaScript editing interface. WordPress's editor uses React-based tooling. That doesn't mean the public website must become a browser-rendered React application.

PARISA: This is the part that gets lost in the phrase “WordPress uses React.” Which part? For what job? A React editor can save content that PHP later turns into an ordinary HTML response.

JULES: Static blocks typically serialize their saved markup and block information into post content. Dynamic blocks can render their output on the server at request time, often with a PHP callback or render file.

PARISA: So a paragraph block and a “show the next five events” block may have different lifecycles. One stores its authored content; the other needs current query results.

JULES: Exactly. Block metadata, commonly in block.json, coordinates registration details. The editor preview and public rendering must agree about meaning, but they needn't use identical implementation code.

PARISA: And an editor choosing a heading block doesn't automatically guarantee a sensible heading hierarchy. The system should help with good defaults and constraints, then we still inspect the resulting page.

## The Database Isn't Just Posts

JULES: Besides posts and post metadata, the database includes users, user metadata, options, taxonomy information, comments, and other records. Plugins can extend that picture.

PARISA: Options are application or site settings. Users are identities. Attachments use the post system to represent media-related records, while the uploaded file bytes generally live in file storage.

JULES: Which is why a database-only backup may not include the original photographs. A usable recovery plan knows about files, database state, configuration, and the code needed to run them.

PARISA: We should generally use WordPress APIs for reads and writes so its behaviors run. Directly changing a database row can bypass validation, caches, relationships, and plugin reactions.

JULES: And custom queries still need safe parameter handling. The existence of a CMS doesn't make SQL injection a historical problem other people solved forever.

PARISA: Likewise, when rendering output, escape for the context. Text, attributes, and URLs aren't interchangeable. Allowing a trusted editor to format content is not permission to print arbitrary untrusted strings as executable markup.

## The Ecosystem Is Part of the Architecture

JULES: WordPress's ecosystem can make a project dramatically easier. Maybe there's already a maintained integration with the university's newsletter system, accessible editing patterns, and hosting your team understands.

PARISA: That is real engineering value. “We could build it ourselves” doesn't price the years we would maintain it.

JULES: But plugins are dependencies with behavior. We review maintenance, compatibility, permissions, data handling, and whether the plugin's model fits. Ten overlapping plugins don't become a coherent architecture by sharing an admin menu.

PARISA: And paid doesn't automatically mean good, free doesn't automatically mean risky, and popularity doesn't prove suitability. Those are clues, not verdicts.

JULES: If a page breaks after an update, inspect the actual failure: PHP error, theme assumption, callback conflict, cached output, or editor serialization issue. Don't jump from one incident to “WordPress is bad.”

PARISA: The corresponding mistake is refusing to acknowledge a mismatch because an extension technically exists. You can keep bolting on relational workflows until the admin interface feels like a filing cabinet fell down the stairs.

## When the Fit Gets Awkward

JULES: For a news site with a few content types, familiar editorial work, and a team comfortable with WordPress, the fit may be excellent.

PARISA: For Bellweather's full university model, we should examine shared people records, department relationships, multilingual content, granular approval rules, and reusable displays. WordPress can support a lot, but we need to identify what comes from core, custom work, and specific plugins.

JULES: And we should ask the same questions of Drupal. It isn't fair to compare a carefully assembled Drupal site with an imaginary WordPress installation that has never received any design work.

PARISA: Nor compare WordPress's easiest demo with Drupal's most complicated government deployment. Compare the same requirements and the actual team's ability to operate each solution.

JULES: Here's the mental model I want to keep: WordPress interprets a request, gets content through its APIs and queries, lets extensions participate, and selects presentation through its theme system. Editors work through an interface built around those records and capabilities.

PARISA: Recognizable web development. The names tell you where the system gives you something reusable.

## Translate Before You Judge

JULES: Post type: kind of content record. Taxonomy: classification. Theme: presentation. Plugin: functionality. Action: run behavior at an extension point. Filter: transform and return a value.

PARISA: And block: an editor-facing unit whose saved or rendered behavior depends on its implementation. A little less catchy, but substantially less wrong.

JULES: WordPress didn't become useful by transcending PHP. It arranged common publishing work into a product that many people can extend and operate.

PARISA: Next time we enter Drupal, where we will immediately encounter the word entity.

JULES: Several times.

PARISA: I have brought database experience and snacks. One of them had better help.

[OUTRO MUSIC]

## Production References

- History: https://wordpress.org/about/history/
- Post types: https://developer.wordpress.org/plugins/post-types/
- Registration API: https://developer.wordpress.org/reference/functions/register_post_type/
- Hooks: https://developer.wordpress.org/plugins/hooks/
- Template hierarchy: https://developer.wordpress.org/themes/basics/template-hierarchy/
- Block editor: https://developer.wordpress.org/block-editor/
- Demo is deliberately a basic editorial post type, not a booking application. Test in a disposable WordPress development site before adapting.
