# Episode 5: Container Queries — The Component Finally Knows Where It Lives

Status: Draft

**CAST**

PARISA — Component-minded CSS developer tired of making reusable cards depend on page-wide breakpoints.

JULES — Developer here to explain containment without pretending it is merely a smaller media query.

[MUSIC]

PARISA: My card is on a desktop.

JULES: Congratulations to the card.

PARISA: It is also twelve rem wide because someone put it in a sidebar.

JULES: Ah.

PARISA: My desktop media query has opinions that are no longer relevant.

[MUSIC STING]

JULES: Media queries ask about the viewport or device environment.

PARISA: Container queries let descendants respond to a containing ancestor.

JULES: That difference changes component architecture.


## The Viewport Is Not the Component

PARISA: A media query can tell me the browser is wider than sixty rem.

JULES: It cannot tell a card how much space its parent gave it.

PARISA: The same component might appear in main content, a sidebar, a modal, or a dashboard tile.

JULES: If its internal layout depends on viewport width, it is only reusable in the contexts the author predicted.

PARISA: Then we add modifier classes like `.card--narrow`.

JULES: Which means something outside the card must know when to apply them.


## Establishing a Query Container

[CODE CARD]

```css
.card-region {
  container-type: inline-size;
}
```

JULES: This tells the browser that descendants may query the container's inline size.

PARISA: Why not put it directly on `.card`?

JULES: A size query cannot use the queried element's own size to style that same element without creating circular layout questions.

PARISA: The container is usually a wrapper or parent; the query styles descendants.

JULES: Exactly.


## Writing the Query

[CODE CARD]

```css
.card {
  display: grid;
  gap: 1rem;
}

@container (width >= 32rem) {
  .card {
    grid-template-columns: 12rem 1fr;
  }
}
```

PARISA: Below the threshold it stacks. Above it, image and content sit side by side.

JULES: Wherever the component is placed.

PARISA: The breakpoint belongs to the component's design rather than the page.


## Naming Containers

PARISA: What if there are several nested containers?

JULES: By default, the browser finds an eligible ancestor. You can name containers when you need a specific one.

[CODE CARD]

```css
.results-panel {
  container: results / inline-size;
}

@container results (width >= 48rem) {
  .result-card {
    grid-template-columns: 10rem 1fr auto;
  }
}
```

PARISA: `container` is the shorthand for name and type.

JULES: Yes. Names clarify which context owns the decision.


## Container Query Units

JULES: Container query units size things relative to a query container.

PARISA: `cqi` for one percent of the container's inline size.

[CODE CARD]

```css
.card__title {
  font-size: clamp(1.25rem, 4cqi, 2rem);
}
```

JULES: The title can respond to its component region rather than the whole viewport.

PARISA: Still bounded with `rem` values so it does not become microscopic or theatrical.


## Size Queries Versus Style Queries

PARISA: Container queries can inspect more than size now.

JULES: Style queries can test custom-property values on a container.

[CODE CARD]

```css
.theme-region {
  --surface-style: dark;
}

@container style(--surface-style: dark) {
  .card {
    color: white;
  }
}
```

PARISA: Support and exact capability need checking, especially for style queries beyond custom properties.

JULES: Yes. Do not turn a developing feature into a blanket production promise.


## Container Queries Do Not Replace Media Queries

PARISA: Page navigation changing at a wide viewport is still a media-query concern.

JULES: A card changing because its allocated region grew is a container-query concern.

PARISA: User preferences like reduced motion remain media features.

JULES: These tools answer different environmental questions.


## The Architecture Shift

PARISA: Before, the page often controlled a component's responsive variants.

JULES: Now more responsive knowledge can live beside the component's own styles.

PARISA: That improves portability, but it does not mean every wrapper becomes a container.

JULES: Containment has layout and performance implications. Establish query containers intentionally.

PARISA: And document the expected wrapper, because CSS still cannot make undocumented architecture friendly.


## Please Don't Forget the Content

[STING]

### PLEASE DON'T DO THIS

JULES: A component can fit geometrically and still fail semantically.

PARISA: Long translated labels, 200-percent zoom, user fonts, error messages, and dynamic content can expose assumptions.

JULES: Do not choose a threshold using lorem ipsum and call it responsive.

PARISA: The container tells you how much room exists. It does not tell you whether your content design is humane.


## A Progressive Enhancement Shape

[CODE CARD]

```css
.card {
  display: block;
}

@supports (container-type: inline-size) {
  .card-region {
    container-type: inline-size;
  }

  @container (width >= 32rem) {
    .card {
      display: grid;
      grid-template-columns: 12rem 1fr;
    }
  }
}
```

PARISA: The basic card works. Supporting browsers get the contextual layout.

JULES: Depending on your browser policy, you may not need the explicit `@supports`, but the fallback design still matters.


## What Did We Actually Learn?

PARISA: Media queries ask about the viewport or broader environment.

JULES: Container queries let descendants respond to an eligible ancestor's size or supported style features.

PARISA: We establish a query container, optionally name it, and write `@container` rules for descendants.

JULES: Container units can make values fluid relative to that component context.

PARISA: Components can own more of their responsive behavior.

JULES: But containers need intentional architecture, real-content testing, and compatibility decisions.

PARISA: The card finally knows where it lives.

JULES: It still does not pay rent.

[MUSIC]

PARISA: Next: selectors got weirdly powerful.

JULES: Including the one everyone calls a parent selector.

PARISA: I have waited twenty years to overuse this responsibly.

[MUSIC ENDS]
