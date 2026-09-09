# Episode 2: CSS Variables — Oh, So Sass Variables Aren't the Same Thing

Status: Draft

**CAST**

PARISA — Experienced CSS and Sass developer, prepared to interrogate the word “variable.”

JULES — Modern web developer who knows the two kinds of variable solve different problems.

[MUSIC]

PARISA: CSS variables.

JULES: Custom properties.

PARISA: You corrected me before we reached the theme music.

JULES: “CSS variable” is common and useful. “Custom property” tells us what the thing actually is.

PARISA: Does this distinction matter, or are we polishing a noun?

JULES: It matters because a Sass variable and a CSS custom property live at different times in different systems.

PARISA: Excellent. Two things with similar names and different physics.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*, where today I learn that CSS borrowed the word “variable” and brought its own definition.

JULES: I'm Jules.

PARISA: I'm Parisa, and I have used Sass variables for years.

JULES: Which makes you exactly qualified to be suspicious.


## The Sass Version Disappears

PARISA: Start with what I know.

[CODE CARD]

```scss
$brand: #6d28d9;

.button {
  background: $brand;
}
```

JULES: Sass evaluates `$brand` while it compiles your SCSS.

JULES: The browser receives ordinary CSS with the value already substituted.

[CODE CARD]

```css
.button {
  background: #6d28d9;
}
```

PARISA: The dollar-sign variable is gone.

JULES: Completely. DevTools cannot inspect it. The cascade cannot override it. JavaScript cannot change it because it no longer exists.

PARISA: It was an authoring convenience.

JULES: Exactly. Powerful at build time, absent at runtime.


## The CSS Version Stays Alive

[CODE CARD]

```css
:root {
  --brand: #6d28d9;
}

.button {
  background: var(--brand);
}
```

PARISA: Two hyphens declare the custom property, and `var()` asks for its value.

JULES: Yes. The browser keeps `--brand` as part of the live CSS model.

PARISA: So DevTools can show it.

JULES: Yes.

PARISA: Another rule can override it.

JULES: Yes.

PARISA: JavaScript can update it.

JULES: Yes.

PARISA: And it participates in the cascade.

JULES: That is the enormous difference.


## Scope Is the Element, Not the File

PARISA: Sass variables have lexical scope. What does scope mean here?

JULES: A custom property is declared on an element through a matching CSS rule.

JULES: Descendants normally inherit custom properties from their parents.

[CODE CARD]

```css
:root {
  --surface: white;
  --text: #171717;
}

.dark-panel {
  --surface: #171717;
  --text: white;
}

.card {
  color: var(--text);
  background: var(--surface);
}
```

PARISA: A card outside the dark panel gets the root values.

JULES: A card inside `.dark-panel` inherits the local values.

PARISA: Same card CSS. Different environment.

JULES: The component exposes a tiny styling API through the cascade.

PARISA: Okay, that's actually pretty cool.

[STING]

### OKAY, THAT'S ACTUALLY PRETTY COOL

PARISA: Sass could generate two theme classes, but the Sass variable itself would not change after compilation.

JULES: Correct. Custom properties let the browser resolve the value where the component actually lives.


## Fallback Does Not Mean Polyfill

PARISA: Explain the comma in `var(--brand, purple)`.

JULES: The second argument is a fallback when `--brand` has no usable value.

[CODE CARD]

```css
.button {
  background: var(--button-background, var(--brand, rebeccapurple));
}
```

PARISA: Component value, then brand value, then a literal emergency purple.

JULES: Right. But that fallback does not help a browser that does not understand custom properties at all.

PARISA: Because that browser cannot understand `var()` enough to use its fallback.

JULES: Exactly. This is a missing-value fallback, not a compatibility polyfill.


## The Computed-Value Trap

PARISA: Custom properties accept nearly any token stream, right?

JULES: Which means this declaration can look valid initially.

[CODE CARD]

```css
:root {
  --brand: 2rem;
}

.button {
  color: red;
  color: var(--brand);
}
```

PARISA: But `2rem` is not a color.

JULES: The browser may not discover the mismatch until it substitutes the value at computed-value time.

JULES: The later `color` declaration becomes invalid then; it does not simply rewind to the earlier red declaration.

PARISA: That is subtle and unpleasant.

JULES: Welcome to values that stay dynamic.


## Wait, When Does the Browser Resolve This?

PARISA: I want to slow down there, because “computed-value time” sounds like a phrase people use when they want the room to stop asking questions.

JULES: Fair. CSS values move through stages.

PARISA: We are not doing the entire value-processing specification.

JULES: We are not. The useful version is that the browser first parses declarations, then combines the cascade and inheritance, then resolves values in the context of the actual element.

PARISA: And a custom property can survive the first stage because its contents are deliberately flexible.

JULES: Right. The browser cannot always know whether those contents make sense until `var()` substitutes them into a real property.

PARISA: So `--thing: 2rem` is not inherently wrong.

JULES: It could be perfect for padding.

PARISA: It becomes wrong when I use it as a color.

JULES: Exactly.

[CODE CARD]

```css
.example {
  --thing: 2rem;
  padding: var(--thing);
  color: var(--thing);
}
```

PARISA: Same token. Valid padding. Invalid color.

JULES: The custom property itself does not know which job you will give it.

PARISA: Like hiring someone called Alex and assuming that tells you whether they are the accountant.

JULES: That metaphor is doing human resources now.

PARISA: The point is: custom properties are reusable token containers, and the consuming property provides the grammar.


## The Fallback Trap Has a Basement

PARISA: Let me try to protect the color.

[CODE CARD]

```css
.example {
  --thing: 2rem;
  color: var(--thing, rebeccapurple);
}
```

PARISA: Surely I get purple because `2rem` is not a color.

JULES: No.

PARISA: I dislike the speed of that answer.

JULES: The fallback belongs to `var()`. It is used when the referenced custom property is missing or otherwise has no usable custom-property value.

JULES: Here, `--thing` exists and its value is a perfectly valid token sequence for a custom property.

PARISA: The failure happens later, when `color` tries to consume it.

JULES: Right. By then the fallback branch was not selected.

PARISA: So fallbacks are not type guards.

JULES: Exactly.

PARISA: That is the sort of detail a five-line tutorial skips and a production design system eventually discovers at 2 a.m.


## Custom Properties Can Contain More Than One Little Value

JULES: A custom property can hold pieces of a larger declaration too.

[CODE CARD]

```css
.card {
  --card-shadow: 0 0.25rem 1rem rgb(0 0 0 / 18%);
  box-shadow: var(--card-shadow);
}
```

PARISA: Or a comma-separated font stack.

JULES: Or part of a transform list, a gradient stop, a grid track list, even an empty value in some composition patterns.

PARISA: Which is powerful and also why names need to reveal expected shape.

JULES: `--space-card` communicates more than `--medium`.

PARISA: `--button-background-hover` communicates more than `--purple-7`, at least at the component boundary.

JULES: You can have primitive palette tokens underneath and semantic tokens above them.

[CODE CARD]

```css
:root {
  --violet-700: #6d28d9;
  --violet-800: #5b21b6;
  --color-action: var(--violet-700);
  --color-action-hover: var(--violet-800);
}
```

PARISA: The component asks for a role. The theme decides which palette value serves that role.

JULES: That indirection makes theme changes possible without teaching every component a new color name.


## Inheritance Is the Delivery System

PARISA: Let's make inheritance concrete.

[CODE CARD]

```html
<section class="promo">
  <article class="card">
    <h2>One weird trick involving the cascade</h2>
  </article>
</section>
```

[CODE CARD]

```css
:root {
  --card-accent: navy;
}

.promo {
  --card-accent: darkorange;
}

.card h2 {
  color: var(--card-accent);
}
```

JULES: The heading does not match `.promo` directly, but it inherits `--card-accent` through its ancestors.

PARISA: Does `.card` need to redeclare it?

JULES: No. It inherits too.

PARISA: What if `.card` provides its own value?

JULES: Then descendants inherit the card's local value instead.

PARISA: This is why scope is not “which CSS file contains the declaration.”

JULES: Exactly. Files disappear as an organizational concern after CSS is loaded. The cascade operates on declarations matched to elements.


## The Component API Pattern

PARISA: Show me a component that deliberately accepts values from outside.

[CODE CARD]

```css
.alert {
  --alert-surface: #eef6ff;
  --alert-border: #2563eb;

  color: var(--alert-text, #172554);
  background: var(--alert-surface);
  border-inline-start: 0.3rem solid var(--alert-border);
}

.danger-zone {
  --alert-surface: #fff1f2;
  --alert-border: #be123c;
  --alert-text: #881337;
}
```

JULES: The alert owns safe defaults. An ancestor can customize documented hooks.

PARISA: And internal variables can stay internal by convention.

JULES: CSS does not enforce private visibility, so naming and documentation matter.

PARISA: A double hyphen is not encapsulation.

JULES: Correct. It is a custom-property naming requirement, not a privacy curtain.


## Local Values Can Be More Useful Than Global Values

PARISA: Every custom-property tutorial starts with `:root`.

JULES: `:root` is useful for genuinely global tokens, but it is not mandatory.

PARISA: If only a pricing card needs `--badge-offset`, declare it on the pricing card.

JULES: That keeps the meaning near its owner and reduces accidental coupling.

[CODE CARD]

```css
.pricing-card {
  --badge-offset: 0.75rem;
}

.pricing-card__badge {
  inset-block-start: var(--badge-offset);
  inset-inline-end: var(--badge-offset);
}
```

PARISA: Global dumping grounds are not design systems either.

JULES: `:root` can become the new `utilities.scss`—a place where values go to avoid answering who owns them.


## The Cascade Gives Us State Without Rewriting Consumers

[CODE CARD]

```css
.button {
  --button-bg: #6d28d9;
  background: var(--button-bg);
}

.button:hover {
  --button-bg: #5b21b6;
}

.button[aria-pressed="true"] {
  --button-bg: #3730a3;
}
```

PARISA: The `background` declaration appears once.

JULES: States change the input custom property rather than repeating the consuming declaration.

PARISA: That becomes especially useful when several declarations derive from the same state token.

JULES: Or when nested children consume it.

PARISA: But `aria-pressed` must reflect real button behavior. CSS observing an ARIA state does not implement the state.

JULES: Accessibility remains a behavior and semantics problem, not a selector costume.


## Themes Are Just Cascaded Contexts

PARISA: We should demystify theming.

JULES: Please.

PARISA: A theme is often a group of semantic values applied at some boundary.

[CODE CARD]

```css
:root {
  color-scheme: light dark;
  --surface: #ffffff;
  --text: #171717;
}

[data-theme="dark"] {
  --surface: #171717;
  --text: #f5f5f5;
}

body {
  color: var(--text);
  background: var(--surface);
}
```

JULES: JavaScript may store and apply the user's explicit choice, but CSS carries the values through the document.

PARISA: We can also start with `prefers-color-scheme` when there is no explicit override.

JULES: And `color-scheme` tells the browser which schemes the page supports so built-in controls and browser-provided surfaces can participate.

PARISA: A dark background alone is not a dark theme. Form controls, focus, images, shadows, syntax highlighting, and contrast all need testing.


## JavaScript Reads the Computed Result Differently

PARISA: If JavaScript asks `element.style.getPropertyValue('--brand')`, what does it get?

JULES: Only an inline declaration on that element through the `style` object.

PARISA: Not an inherited value from a stylesheet.

JULES: For the computed value, use `getComputedStyle(element).getPropertyValue('--brand')`.

[CODE CARD]

```js
const card = document.querySelector(".card");
const styles = getComputedStyle(card);
const accent = styles.getPropertyValue("--card-accent").trim();
```

PARISA: That is JavaScript using browser APIs to inspect the cascade's result.

JULES: Yes. It is not reading a Sass module or parsing your source file.


## Cycles Are Still Cycles

[CODE CARD]

```css
.example {
  --a: var(--b);
  --b: var(--a);
  color: var(--a, purple);
}
```

PARISA: The properties depend on each other, so neither resolves usefully.

JULES: Cyclic custom-property references become invalid.

PARISA: The fallback on the consuming `var()` can then matter.

JULES: Yes. Dynamic graphs can have dynamic mistakes.


## @property Is Runtime Validation, Not TypeScript

PARISA: I want the TypeScript-series distinction on record.

JULES: Go for it.

PARISA: TypeScript checks source during development and erases its types before JavaScript runs.

JULES: `@property` changes how the browser handles a custom property at runtime.

PARISA: The browser knows its syntax, inheritance rule, and initial value while resolving CSS.

JULES: So an invalid assigned value can fall back to the registered initial value.

PARISA: Different boundary. Different guarantee.


## Animating a Registered Property

[CODE CARD]

```css
@property --ring-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.loading-ring {
  background: conic-gradient(
    from var(--ring-angle),
    rebeccapurple,
    transparent
  );
  animation: spin-ring 1s linear infinite;
}

@keyframes spin-ring {
  to { --ring-angle: 360deg; }
}
```

JULES: Registration tells the browser this is an angle, so it knows how to interpolate between values.

PARISA: Without registration, a generic custom property usually changes discretely because the browser sees an opaque token sequence.

JULES: And because this animation is continuous, we need a reduced-motion decision.

[CODE CARD]

```css
@media (prefers-reduced-motion: reduce) {
  .loading-ring {
    animation: none;
  }
}
```

PARISA: Plus accessible status text. A spinning gradient does not tell a screen reader that loading is happening.


## When Sass and Custom Properties Work Together

JULES: We have contrasted them. Let's let them cooperate.

[CODE CARD]

```scss
$themes: (
  ocean: (#075985, #e0f2fe),
  plum: (#6b21a8, #faf5ff)
);

@each $name, $colors in $themes {
  [data-theme="#{$name}"] {
    --theme-strong: #{nth($colors, 1)};
    --theme-soft: #{nth($colors, 2)};
  }
}
```

PARISA: Sass generates theme selectors and their starting values.

JULES: The emitted custom properties remain live and inheritable in the browser.

PARISA: Build-time generation feeding runtime behavior.

JULES: The tools are not rivals in a prophecy.


## Naming Is Architecture

PARISA: Should a library call its property `--color`?

JULES: Please don't.

PARISA: Custom-property names share the cascade. Generic names collide and communicate nothing.

JULES: Prefix public library properties, use semantic roles, and distinguish global tokens from component hooks.

PARISA: Something like `--obw-card-surface` is less glamorous and far easier to search.

JULES: Document accepted value shapes too, especially for unregistered properties.


## Debugging the Value Chain

PARISA: My button is the wrong purple. What do I inspect?

JULES: Select the button in DevTools. Find the consuming declaration. Inspect the resolved custom property and the declarations that contributed to it.

PARISA: Check inheritance, matched selectors, media queries, layers, state selectors, and spelling.

JULES: Custom-property names are case-sensitive.

PARISA: So `--brandColor` and `--brandcolor` are different properties, because apparently we needed one more way to lose an afternoon.

JULES: Also inspect whether the final substituted value is valid for the consuming property.

PARISA: Do not stare only at `:root`. The winning value may be local.


## Registering a Property

JULES: `@property` lets you register a custom property with a type, inheritance behavior, and initial value.

[CODE CARD]

```css
@property --progress {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}
```

PARISA: So the browser now knows `--progress` must be a percentage.

JULES: Yes, and because it knows the type, it can interpolate the value for animation instead of treating it as an opaque string.

PARISA: Does this make CSS runtime TypeScript?

JULES: No.

PARISA: Thank you for preventing the headline.

JULES: It is registration and validation for one custom property, not a general type system for stylesheets.


## JavaScript Can Touch It, But Should It?

[CODE CARD]

```js
document.documentElement.style.setProperty("--progress", "65%");
```

PARISA: That is JavaScript calling a DOM API, not special CSS syntax.

JULES: Correct. JavaScript changes the property on an element, and CSS consumes it wherever the cascade makes it available.

PARISA: Useful for data-driven values.

JULES: Yes. But do not move every design decision into JavaScript just because you can.

PARISA: State and data can cross the boundary; ordinary hover and responsive styling can stay in CSS.


## Design Tokens Without Magical Thinking

PARISA: People call custom properties design tokens.

JULES: Custom properties can carry design-token values: colors, spacing, typography, motion, borders.

PARISA: But naming a hex code `--color-primary` does not create a design system.

JULES: Correct. A design system also needs meaning, constraints, documentation, components, accessibility decisions, and maintenance.

PARISA: Otherwise we have a bag of variables wearing a lanyard.


## Please Don't Theme Away Accessibility

[STING]

### PLEASE DON'T DO THIS

JULES: Runtime theming makes it easy to swap colors.

PARISA: It also makes it easy to swap accessible colors for two fashionable grays that differ only spiritually.

JULES: Every theme still needs contrast testing, visible focus, readable states, and support for forced colors where relevant.

PARISA: Do not assume a mathematically tidy token scale is perceptually tidy for humans.


## What Did We Actually Learn?

PARISA: A Sass variable is evaluated by Sass during the build and disappears into the generated CSS.

JULES: A custom property remains in the browser, participates in the cascade, and normally inherits.

PARISA: `var()` reads it and can provide a missing-value fallback.

JULES: The fallback is not support for browsers that do not understand custom properties.

PARISA: Values can fail at computed-value time.

JULES: `@property` can register a type, initial value, and inheritance behavior.

PARISA: Custom properties are brilliant for contextual components and theming because the live document helps resolve them.

JULES: And Sass variables remain useful for build-time computation.

PARISA: Similar punctuation. Different universe.

[MUSIC]

JULES: Next time: Flexbox and Grid.

PARISA: Two layout systems because apparently one was not enough.

JULES: It turns out rows and spreadsheets are different problems.

PARISA: Tell that to every email layout I built in 2007.

[MUSIC ENDS]
