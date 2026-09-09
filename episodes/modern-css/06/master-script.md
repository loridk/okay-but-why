# Episode 6: Selectors Got Weirdly Powerful — :has(), :is(), :where() and Friends

Status: Draft

**CAST**

PARISA — Longtime CSS developer who remembers being told a parent selector was impossible.

JULES — Developer with a specificity calculator open in another tab.

[MUSIC]

PARISA: CSS has a parent selector.

JULES: Sort of.

PARISA: Let me have this.

JULES: CSS has a relational pseudo-class that can select an element when relative selectors match from that element.

PARISA: You have made joy sound taxable.

[MUSIC STING]

PARISA: Today: `:has()`, `:is()`, `:where()`, and why powerful selectors do not excuse chaotic HTML.


## Why Selectors Matter

JULES: Selectors connect document structure and state to presentation.

PARISA: If CSS cannot express the relationship, we often add a class in markup or JavaScript.

JULES: Classes are not bad. But sometimes the relationship already exists in the HTML and we are duplicating it.

PARISA: Modern selectors can let CSS respond directly.


## :is() Groups Alternatives

[CODE CARD]

```css
:is(article, aside, section) :is(h2, h3) {
  text-wrap: balance;
}
```

JULES: `:is()` accepts a selector list and matches when any option matches.

PARISA: Less repetition than writing every combination.

JULES: Its specificity uses the most specific selector in its argument list.

PARISA: So a surprise ID inside `:is()` can make the whole selector heavier.

JULES: Correct. Convenience does not suspend the cascade.


## :where() Has Zero Weight

[CODE CARD]

```css
:where(article, aside, section) :where(h2, h3) {
  margin-block-start: 0;
}
```

PARISA: Same grouping idea, but `:where()` itself contributes zero specificity.

JULES: That makes it useful for defaults that consumers should easily override.

PARISA: A library can be structurally precise without building a specificity fortress.


## :has() Looks Outward

[CODE CARD]

```css
.field:has(:user-invalid) {
  border-color: crimson;
}
```

JULES: The field matches when it has a descendant matching `:user-invalid`.

PARISA: We style the wrapper based on a child's state, without JavaScript toggling an error class.

JULES: That is the famous parent-shaped use.

PARISA: But “has” can describe sibling and relative relationships too.

[CODE CARD]

```css
h2:has(+ p) {
  margin-block-end: 0.4em;
}
```

JULES: This selects an `h2` that is immediately followed by a paragraph.

PARISA: The matching element is still the heading. The relative selector starts from it.


## State Without a JavaScript Class

[CODE CARD]

```css
form:has(:focus-visible) {
  box-shadow: 0 0 0 0.25rem Highlight;
}
```

PARISA: CSS can respond when something inside the form has keyboard-visible focus.

JULES: Or a cart button can respond when the cart contains items, if that state is already represented in accessible markup.

PARISA: Important qualifier.

JULES: Selectors observe document state. They do not create application state or accessible semantics.


## Forgiving Selector Lists

PARISA: Historically, one invalid selector could invalidate a whole comma-separated selector list.

JULES: `:is()` and `:where()` use forgiving selector lists, so unsupported alternatives can be ignored while valid ones continue.

PARISA: Still test the result. “Forgiving” is parser behavior, not relationship counseling.


## :not() Grew Up Too

[CODE CARD]

```css
button:not(:disabled, [aria-disabled="true"]) {
  cursor: pointer;
}
```

JULES: Modern `:not()` can take a complex selector list.

PARISA: Though `aria-disabled` alone does not prevent clicks or keyboard activation.

JULES: Correct. CSS can style the state; behavior must honor it too.


## Structural Selectors Are Not Semantics

[STING]

### PLEASE DON'T DO THIS

PARISA: Do not write a selector that depends on the fifth anonymous `div` remaining the fifth anonymous `div` forever.

JULES: Powerful structural matching can create brittle coupling to markup.

PARISA: Use semantic elements and intentional classes when they communicate ownership.

JULES: A shorter stylesheet is not automatically a more maintainable system.

PARISA: And do not hide an error merely because `:has()` is unsupported. Error text belongs in the document and must be programmatically connected to the field.


## Performance Without Folklore

PARISA: We were told parent selectors would melt browsers.

JULES: Engines had to implement `:has()` carefully, but modern support exists because the feature became practical to implement.

PARISA: That does not mean every enormous selector is free.

JULES: Keep the search relationship reasonably constrained and measure real pages before inventing performance rules.

PARISA: “I heard selectors read right-to-left” is not a profiler.


## Specificity Still Comes Along

JULES: `:has()`, `:is()`, and `:not()` take specificity from the most specific selector in their arguments.

PARISA: `:where()` is deliberately zero.

[CODE CARD]

```css
:where(.card) :is(h2, h3) {
  color: var(--card-heading);
}
```

JULES: Use these tools intentionally: `:where()` for low-weight defaults, `:is()` when ordinary specificity makes sense, `:has()` for real relationships.


## What Did We Actually Learn?

PARISA: `:is()` groups alternatives and takes the strongest argument specificity.

JULES: `:where()` groups alternatives with zero specificity contribution.

PARISA: `:has()` selects an element based on relative matches around or inside it.

JULES: `:not()` accepts richer selector lists than its older form.

PARISA: These selectors can remove little class-toggling scripts when the state already exists in the document.

JULES: They do not replace semantics, application state, or accessible behavior.

PARISA: CSS got a relationship wizard. We still have to maintain the relationship.

[MUSIC]

JULES: Next: the cascade hires a lawyer.

PARISA: Specificity, layers, scope, and nesting.

JULES: Four ways to make your stylesheet calmer or considerably stranger.

[MUSIC ENDS]
