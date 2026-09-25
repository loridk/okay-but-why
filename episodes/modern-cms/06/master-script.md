# Episode 6: Modern Drupal Frontend: Twig, Themes & Components

**Series:** Modern CMS Development
**Hosts:** Parisa, Jules; Sabrina joins the component discussion
**Production:** September 2026. Audio-first finished script; recording handled separately.

[INTRO MUSIC]

PARISA: I have found the markup. It was behind a template suggestion, a preprocess function, and a cache.

JULES: But you found it.

PARISA: Yes. I would like the markup to know I respect its privacy, but this is its job.

## A Theme Has Responsibilities

JULES: Welcome to Okay, But Why? Today we're taking Drupal's structured output and giving it a frontend. A theme provides presentation: templates, assets, regions, and related conventions.

PARISA: It shouldn't secretly own the university's business rules. If changing the colors removes the event content type, we've attached functionality to the wrong lifecycle.

JULES: Exactly. A theme can adapt output, but durable application behavior generally belongs in modules or services. We're building a presentation layer that consumes Drupal's render system.

PARISA: And this is still web development. The final browser receives HTML, CSS, and JavaScript. Drupal doesn't create a fourth kind of padding that only works on government websites.

JULES: Theme setup includes an info YAML file describing compatibility, base-theme choice, libraries, and regions. Starterkit is a core tool for generating a starting theme rather than making every project depend forever on a shared base theme's exact markup.

PARISA: Generated starting code becomes our code to maintain. That's different from inheriting future changes automatically through a base-theme dependency.

## Twig Is the Template Language

JULES: Twig is a template engine from the broader PHP ecosystem, used by Drupal. It isn't PHP with different punctuation and isn't JSX.

PARISA: Expressions output values. Template tags control things like conditions and loops. A filter transforms a value. Those are Twig language features. Drupal adds variables, filters, functions, and rendering integration.

JULES: Exactly. The double braces you see in a Twig template mean evaluate and output an expression. They don't mean JavaScript is running in the browser.

PARISA: Autoescaping helps with ordinary values, but it doesn't make every possible operation safe. Adding a raw filter to silence escaping because the output looks inconvenient is a dangerous reflex.

JULES: Drupal render arrays and processed text can represent output intended for rendering. If you're handling plain editor input or external strings, keep the appropriate escaping and filtering. Don't manufacture trusted markup casually.

PARISA: And templates should mostly compose prepared data and renderable pieces. If Twig is becoming our database-access layer, we should move that work to an appropriate Drupal layer where access and cacheability can be handled.

## How Does Drupal Pick This Template?

JULES: Template suggestions are candidate template names that let Drupal select more specific presentation for a context. A node template can have a more specific suggestion for a content type and view mode.

PARISA: So an Event teaser can have a specialized template without replacing every node's output. We use the actual suggestions Drupal provides, often inspected with development debugging enabled.

JULES: Right. Don't guess endlessly at hyphens. Enable suitable development settings, inspect the suggestions, and keep debug output out of production. After adding a new template, rebuild caches so discovery sees it.

PARISA: Preprocessing happens before the template renders. It can prepare variables, classes, and other presentation data.

JULES: Yes. In themes you'll encounter procedural preprocess functions in a dot-theme file. Don't assume Drupal's object-oriented module-hook direction means every theme preprocess function has become a class method.

PARISA: That's a useful boundary. Modern Drupal still contains conventions with different histories. We need the API contract for the particular extension point.

JULES: And if preprocessing derives output from entities or configuration, preserve the dependencies. A string doesn't become cache-correct merely because it was created close to Twig.

## Attributes, Regions, and Blocks

PARISA: Twig templates often print an attributes variable next to an HTML element. Is that just a string of attributes?

JULES: Drupal commonly provides an Attribute object, which supports methods such as adding classes and renders attributes appropriately. Preserve relevant existing attributes rather than replacing them with a hand-built string.

PARISA: That matters for classes and other integration details. And values still need to make sense: an escaped URL isn't automatically an approved destination, and an ARIA attribute isn't useful merely because it's syntactically valid.

JULES: Exactly. Regions are named areas a theme exposes, such as header, content, or footer. Blocks can be placed into those regions with visibility and configuration rules.

PARISA: A region is a placement area, not a content entity. A block's output can come from a plugin or content. Our vocabulary episode is paying dividends.

JULES: Theme changes can also affect region mappings and placements. A redesign needs to verify the site still has navigation, messages, and primary content where users can find them.

## Assets Need Dependencies

JULES: Drupal libraries group CSS and JavaScript and declare dependencies. A theme can attach a library globally or a render array or template can attach it where needed.

PARISA: This is asset coordination. The library definition tells Drupal what to include and what has to be available first. It doesn't necessarily imply npm or a bundler.

JULES: Correct. You can use a frontend build tool, but that is your tooling choice. Drupal libraries still need to reference the produced assets and declare runtime dependencies.

PARISA: If a script uses Drupal behaviors and the once utility, declare those dependencies instead of relying on another page component to happen to load them.

JULES: Exactly. Otherwise the feature works on one page and fails on another with a completely innocent design.

[CODE CARD: Traditional theme-library wiring, separate from the SDC example below]
```yaml
# bellweather.libraries.yml
site:
  css:
    theme:
      css/site.css: {}
```

[CODE CARD: Attach the named library from a Twig template]
```twig
{{ attach_library('bellweather/site') }}
```

PARISA: Those snippets assume an installed theme named bellweather and a real CSS file at that path. We're showing the wiring, not promising that two fragments constitute a complete theme.

## JavaScript That Can Attach More Than Once

JULES: Drupal behaviors provide a way to attach JavaScript to page content, including content inserted later through Drupal's AJAX mechanisms.

PARISA: So relying only on the browser's initial DOM-ready event can miss new content. But attaching the same click listener repeatedly can make one click behave like a small crowd.

JULES: That's why behaviors receive a context and why the once utility is useful. Process relevant elements within the context, and mark initialization so repeated attachment doesn't duplicate it.

PARISA: The behavior object is a Drupal convention. The function, event listener, and DOM operations are JavaScript. An arrow function is modern JavaScript, not special Drupal syntax.

JULES: Some widgets also need detach behavior when content is removed or moved, especially if they hold external resources. A tiny button doesn't need a miniature framework, but a richer widget may need cleanup.

## Single Directory Components

SABRINA: I heard “find the template, now find the CSS, now find the JavaScript,” and I brought a folder.

PARISA: That is either a solution or how this problem started.

SABRINA: A Single Directory Component puts a reusable component's Twig, metadata, and optional CSS and JavaScript together. The metadata describes its inputs. The point is that changing one component doesn't require a treasure hunt across the theme.

JULES: SDC entered Drupal 10.1 experimentally and became stable in Drupal 10.3. On modern supported Drupal 10 and 11 sites, it is part of core's theme system. Old instructions to enable an experimental SDC module need their version context.

PARISA: What makes this a Drupal component rather than four files we happen to put in a directory?

SABRINA: Drupal discovers it through conventions, resolves its namespaced component name, uses its metadata, and integrates its assets and rendering. The folder is an interface to the theme system, not just tidiness.

JULES: Props are structured inputs, like a title or a boolean. Slots hold renderable content that can be composed inside the component. They let the caller supply something richer than a plain string.

PARISA: Similar vocabulary to other component systems, different runtime. This is server-rendered Twig composition. It doesn't automatically create React state, hydration, Shadow DOM, or isolated CSS.

SABRINA: Exactly. Class naming still matters. A component's stylesheet can affect other markup if its selectors are too broad. Colocation isn't encapsulation magic.

## Build One Event Card

JULES: Our example is an event card with a title, detail URL, displayed date, a details slot, and an optional local save toggle. It assumes an installed bellweather theme on Drupal 11.4 or another supported version with stable SDC.

PARISA: It is intentionally a component example. The caller supplies a correctly formatted date and a permitted URL. It doesn't query entities, authorize access, or invent a time zone.

[CODE CARD: Add these files under the installed theme]
```text
web/themes/custom/bellweather/
  components/
    event-card/
      event-card.component.yml
      event-card.twig
      event-card.css
      event-card.js
```

[CODE CARD: event-card.component.yml]
```yaml
name: Event card
status: stable
props:
  type: object
  required: [title, url, date_label]
  properties:
    title:
      type: string
    url:
      type: string
    date_label:
      type: string
slots:
  details:
    title: Event details
libraryOverrides:
  dependencies:
    - core/drupal
    - core/once
```

[CODE CARD: event-card.twig]
```twig
<article{{ attributes.addClass('bw-event-card') }}>
  <h3 class="bw-event-card__title"><a href="{{ url }}">{{ title }}</a></h3>
  <p>{{ date_label }}</p>
  <div class="bw-event-card__details">{{ details }}</div>
  <button class="bw-event-card__save" type="button"
          aria-pressed="false" hidden>Save {{ title }} for this visit</button>
</article>
```

PARISA: The heading is level three because this example sits beneath a level-two events section. If the component goes elsewhere, we must choose an appropriate heading structure. A reusable card doesn't get to declare itself the page's main heading.

SABRINA: The link text is the event's title. No row of identical “read more” links. The save control is a real button with a stable accessible name and a pressed state.

JULES: And it starts hidden because the enhancement isn't useful until its JavaScript works. The event information and link remain available without JavaScript.

[CODE CARD: event-card.css]
```css
.bw-event-card {
  border: 1px solid #767676;
  border-radius: 0.5rem;
  padding: 1rem;
  color: #202124;
  background: #fff;
}
.bw-event-card a { color: #174ea6; }
.bw-event-card__save:not([hidden]) {
  margin-block-start: 1rem;
  padding: 0.65rem 1rem;
  color: #fff;
  background: #174ea6;
  border: 2px solid #174ea6;
  border-radius: 0.25rem;
}
.bw-event-card__save[aria-pressed="true"] {
  color: #174ea6;
  background: #fff;
  text-decoration: underline;
}
.bw-event-card :focus-visible {
  outline: 3px solid #111;
  outline-offset: 3px;
}
```

[CODE CARD: event-card.js]
```javascript
((Drupal, once) => {
  Drupal.behaviors.bellweatherEventCard = {
    attach(context) {
      once('bw-event-save', '.bw-event-card__save', context)
        .forEach((button) => {
          button.addEventListener('click', () => {
            const pressed = button.getAttribute('aria-pressed') === 'true';
            button.setAttribute('aria-pressed', String(!pressed));
          });
          button.hidden = false;
        });
    },
  };
})(Drupal, once);
```

PARISA: This remembers only the state of that button in the current page. It doesn't save to an account, persist after reload, or synchronize matching cards. The label makes that limited promise visible.

SABRINA: The code compares an attribute string with the string true, flips the boolean, then converts it back to a string. That's ordinary JavaScript. The once call prevents duplicate listener registration when Drupal attaches behaviors again.

JULES: The component's matching CSS and JavaScript files are discovered automatically. The metadata adds the dependencies needed by the JavaScript. We aren't also attaching a second copy through a global theme library.

[CODE CARD: Standalone illustrative use inside an existing Twig template]
```twig
<section aria-labelledby="upcoming-events-heading">
  <h2 id="upcoming-events-heading">Upcoming events</h2>
  {{ include('bellweather:event-card', {
    title: 'Moss After Dark',
    url: '/events/moss-after-dark',
    date_label: 'October 15, 2026, 6:30 p.m. Eastern time',
    details: 'Meet at the Greenhouse. Step-free entrance on the east side.'
  }, with_context = false) }}
</section>
```

PARISA: That URL assumes the demonstration page exists. In real rendering, generate the entity's URL through Drupal and supply prepared field output. Don't copy these hard-coded values into every event template.

JULES: Also, use that section identifier once per page. If you render multiple sections, give each an appropriate unique identifier.

## Where Render Arrays Meet Components

SABRINA: Can we pass the location field into the details slot instead of flattening it to text?

JULES: Yes, that's an important integration pattern. Prepared field output can remain renderable so its formatter, access decisions, and cache metadata participate. The component shouldn't reload the location from a raw ID just to rebuild the same output.

PARISA: And props that we derive as plain values still need their dependencies accounted for by the surrounding render structure. A prop schema validates shape; it doesn't discover every entity that influenced the value.

JULES: Exactly. Component boundaries and cache boundaries aren't automatically identical. Preserve Drupal's rendering contract when adapting entity output into component inputs.

SABRINA: I like that separation. The component knows how to present an event card. The caller knows which event, what access is allowed, and how the data was prepared.

PARISA: That's a defensible frontend architecture. It also means I can inspect a component without finding a surprise database query behind the heading.

## Components Aren't Automatically an Editor UI

JULES: SDC provides developer-facing component infrastructure. Installing a component doesn't, by itself, guarantee every editor gets a visual drag-and-drop component browser.

SABRINA: Tools can build that experience on top. Drupal Canvas is a separate project with its own requirements. Drupal CMS 2.0 includes Canvas as part of its editing direction. Those aren't synonyms for SDC or for every Drupal core installation.

PARISA: Good. “Drupal supports components” and “this site's editors can visually compose these components” are different claims to verify.

JULES: And a visual builder still needs guardrails: meaningful headings, usable link names, coherent layouts, and limits that match the design system. Giving an editor every possible option can be less empowering than giving them a reliable set of choices.

## Verify the Actual Output

PARISA: For our card, I would test without JavaScript, with a keyboard, and with a screen reader. The link should work, the save button should appear only when ready, and its pressed state should change without moving focus.

SABRINA: I'd attach behaviors twice and confirm one click changes the state once. Then put the card in AJAX-inserted content and check it initializes there too.

JULES: I'd check narrow-screen layout, long titles, and repeated cards. Then verify the actual entity-backed version updates correctly with warm caches and doesn't expose restricted fields.

PARISA: That's a real component check. A folder containing four files isn't the finish line.

## A Frontend We Can Locate

JULES: Themes organize presentation. Twig composes markup. Suggestions choose the right template. Preprocessing prepares variables. Libraries coordinate assets. Behaviors attach JavaScript appropriately. SDC packages reusable component contracts and assets.

PARISA: And underneath all that, HTML still needs to mean something. No framework can make a clickable div feel bad enough to become a button on its own.

SABRINA: I put the button in the folder already.

PARISA: Excellent folder. I withdraw my earlier suspicion.

JULES: Next time, modules, hooks, services, and Symfony. Which part is Drupal, and which part is the PHP ecosystem doing its job?

[OUTRO MUSIC]

## Production References

- Current SDC quickstart, checked September 16, 2026: https://www.drupal.org/docs/develop/theming-drupal/using-single-directory-components/single-directory-components-quickstart
- SDC stable in 10.3: https://www.drupal.org/blog/drupal-10-3-0
- Theming: https://www.drupal.org/docs/develop/theming-drupal
- JavaScript API: https://www.drupal.org/docs/drupal-apis/javascript-api/javascript-api-overview
- Hook procedural exceptions: https://api.drupal.org/api/drupal/core%21lib%21Drupal%21Core%21Hook%21Attribute%21Hook.php/class/Hook/11.x
- Drupal CMS 2.0: https://www.drupal.org/blog/drupal-cms-20-is-here-visual-building-ai-and-site-templates-transform-drupal
- Canvas is a separate project: https://www.drupal.org/project/canvas
- SDC sample is complete within an existing installed theme; no running Drupal integration test was performed during script production.
