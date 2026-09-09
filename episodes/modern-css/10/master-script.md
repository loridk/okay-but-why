# Episode 10: Tailwind — Why Are There 900 Classes in My HTML?

Status: Draft

**CAST**

PARISA — Experienced CSS/SCSS developer experiencing utility-class culture shock.

JULES — Developer who understands the appeal and the tradeoffs.

SABRINA — Very enthusiastic twenty-two-year-old intern and invited current-tooling correspondent. Competent, opinionated, and not Host Number Three.

[MUSIC]

PARISA: Intern!

JULES: We discussed summoning coworkers.

PARISA: I need an explanation and you have lost speaking privileges because you own a hoodie.

JULES: That standard seems inconsistent.

SABRINA: First, I am twenty-two. Second, what did the children do now?

PARISA: They put CSS back in the HTML.

SABRINA: Ah. Tailwind.

[MUSIC STING]

## What Tailwind Actually Is

SABRINA: Tailwind is a utility-first CSS framework.

PARISA: Define utility-first before showing me the class attribute that ate Cincinnati.

SABRINA: Instead of starting with a component class like `.card` and writing a custom rule, you compose many small classes that each express a limited styling decision.

[CODE CARD]

```html
<article class="rounded-xl bg-white p-6 shadow-lg">
  <h2 class="text-xl font-bold text-slate-900">Release notes</h2>
</article>
```

PARISA: Rounded corners, background, padding, shadow, font size, weight, color—all visible in the markup.

SABRINA: Yes. Tailwind scans project source and produces the CSS needed for the utilities it finds.

PARISA: So those class names are not inline styles.

SABRINA: Correct. They map to generated CSS rules and can include states, responsive variants, container variants, and theme tokens.


## Who Asked for This?

JULES: Utility-first styling responds to problems teams hit in large CSS codebases.

PARISA: Naming every wrapper. Growing stylesheets. Dead rules nobody can confidently delete. New component classes that duplicate existing declarations.

JULES: Also the distance between editing markup and finding the stylesheet that controls it.

PARISA: Tailwind makes the dependency local and constrains choices to a shared scale.

JULES: The class list becomes an API over a design system.


## The Appeal Is Not “I Hate CSS”

SABRINA: Some people absolutely use it because they do not enjoy naming things.

PARISA: Finally, honesty.

SABRINA: But serious teams like it because it can make constraints consistent and changes predictable.

SABRINA: I can review `p-4` and know it uses the spacing scale. I do not need to hunt for whether `.special-panel-inner` means fourteen, sixteen, or nineteen pixels.

PARISA: Unless someone uses an arbitrary value.

SABRINA: Yes. The escape hatch can turn the design system into “whatever was convenient at 4:47.”


## Variants Encode Conditions

[CODE CARD]

```html
<button class="bg-violet-700 px-4 py-2 text-white
               hover:bg-violet-800
               focus-visible:outline-4
               disabled:cursor-not-allowed disabled:opacity-50">
  Save
</button>
```

SABRINA: Prefixes express conditions. Hover, focus-visible, disabled state, media queries, dark mode, container queries, data attributes.

PARISA: Tailwind generates selectors and at-rules from that vocabulary.

SABRINA: Right. It is still CSS doing the work in the browser.


## Tailwind v4 Is More CSS-Shaped

JULES: Current Tailwind uses CSS-first configuration and theme variables.

[CODE CARD]

```css
@import "tailwindcss";

@theme {
  --color-brand: oklch(55% 0.18 285);
  --spacing: 0.25rem;
}
```

PARISA: These theme variables influence which utility classes Tailwind creates.

JULES: And Tailwind exposes them as CSS custom properties in generated output.

PARISA: That is meaningfully different from the older JavaScript-config mental model.


## The HTML Objection

PARISA: My concern is not purity. It is readability and repeated bundles of decisions.

SABRINA: Fair. A long class attribute can be noisy.

PARISA: If twelve cards repeat thirty utilities, where does the component abstraction live?

SABRINA: Ideally in the component system. A React `Card` component can own the repeated markup and class list.

PARISA: So Tailwind often assumes HTML itself is already generated through components or templates.

SABRINA: It fits that workflow well. In static hand-authored HTML, the tradeoff can feel different.


## Composition Has Costs

JULES: Utility composition makes local changes easy, but cross-project changes may require component abstractions, search-and-replace, or tooling.

PARISA: Semantic class names can describe purpose. Utility classes describe implementation choices.

JULES: Neither guarantees maintainability.

PARISA: A class named `.warning` can hide chaos. A utility list can expose every decision but obscure intent.

SABRINA: Good components often provide the intent: `<Alert tone="warning">`, with utilities implementing it internally.


## Please Don't Make Accessibility a Class Puzzle

[STING]

### PLEASE DON'T DO THIS

PARISA: Utilities do not create semantics.

SABRINA: A `div` with `cursor-pointer` and a hover color is still not a button.

JULES: Responsive utilities can visually reorder content with the same accessibility risks as authored CSS.

PARISA: Focus states, contrast, target size, reduced motion, forced colors, and disabled behavior still require deliberate decisions.

SABRINA: Tailwind can make good states easy to reuse. It can also make omitting them easy.


## Dynamic Class Names Can Disappear

[CODE CARD]

```jsx
// The scanner may not recognize a class assembled this way.
<div className={`text-${color}-700`} />
```

JULES: Build tools generally discover complete class-name strings in source.

SABRINA: Constructing arbitrary fragments can prevent the corresponding rule from being generated.

[CODE CARD]

```jsx
const tones = {
  error: "text-red-700",
  success: "text-green-700",
};

<p className={tones[tone]} />
```

PARISA: Map state to complete, reviewable class strings.

SABRINA: Better for tooling and easier to audit.


## When Tailwind Fits

JULES: A component-driven product with a shared token system, many contributors, and a team comfortable with utilities.

SABRINA: Especially when rapid composition and constrained choices matter more than prose-like markup.

PARISA: And when the team agrees on component boundaries so utilities are not copied into fifty places by hand.


## When Plain CSS May Be Nicer

PARISA: A small site. Rich bespoke editorial styling. A team fluent in modern CSS. Markup that must remain easy for non-framework contributors to read.

JULES: Or an existing maintainable codebase where migration buys little.

SABRINA: Tailwind is not an upgrade badge. If it does not solve your problem, it is just another dependency and vocabulary.

PARISA: Intern, you may stay.

SABRINA: I was not asking.


## What Did We Actually Learn?

PARISA: Tailwind is a utility-first framework that generates CSS from class usage in project sources.

JULES: It makes styling decisions local and can enforce shared design constraints.

SABRINA: Variants express conditions, and modern Tailwind leans heavily on native CSS features and theme variables.

PARISA: The cost is dense markup, a framework-specific vocabulary, and potential repetition without good component boundaries.

JULES: It does not replace semantic HTML, accessibility judgment, or CSS knowledge.

SABRINA: It is excellent when its workflow matches the team's problems and deeply annoying when it does not.

PARISA: What problem does this solve, and do we actually have that problem?

SABRINA: Look at that. We agreed without anyone being declared obsolete.

[MUSIC]

PARISA: Sabrina, thank you for defending the children.

SABRINA: Again, twenty-two.

JULES: Next: logical properties and CSS that stops assuming everyone reads like us.

SABRINA: I am leaving before she asks me to translate `margin-left`.

[MUSIC ENDS]
