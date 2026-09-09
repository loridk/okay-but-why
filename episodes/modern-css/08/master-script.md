# Episode 8: Sass in 2026 — Are We Still Doing This?

Status: Draft

**CAST**

PARISA — Experienced Sass user who would like an evidence-based answer, not a funeral.

JULES — Developer separating native-CSS overlap from Sass's remaining build-time powers.

[MUSIC]

PARISA: CSS has variables and nesting. Is Sass dead?

JULES: The internet has declared Sass dead approximately once per new CSS feature.

PARISA: And yet Dart Sass has releases and my projects still compile.

JULES: A troubling sign of life.

[MUSIC STING]

## What Sass Actually Is

JULES: Sass is a stylesheet language compiled into CSS.

PARISA: The browser does not execute Sass.

JULES: Correct. Sass runs during development or a build, evaluates its language features, and emits CSS.

PARISA: That boundary explains both its powers and its limits.


## What We Originally Needed

PARISA: Variables, nesting, partials, imports, mixins, functions, loops, calculations, reusable libraries.

JULES: And an organizational model for stylesheets too large to keep in one file called `final-final-2.css`.

PARISA: Sass solved those problems before native CSS had comparable tools.

[CODE CARD]

```scss
@mixin focus-ring($color) {
  outline: 3px solid $color;
  outline-offset: 3px;
}

.button:focus-visible {
  @include focus-ring(#7c3aed);
}
```

JULES: The mixin generates declarations at build time.

PARISA: Native custom properties cannot generate arbitrary groups of declarations.


## The Overlap Is Real

JULES: Native CSS now has custom properties, nesting, math functions, color functions, cascade layers, and imports understood by modern build pipelines and browsers.

PARISA: So projects using Sass mainly for variables and modest nesting may no longer need it.

JULES: Removing it could reduce dependencies and build configuration.

PARISA: But “native has a similarly named feature” does not prove equivalence.


## Build Time Versus Runtime Again

[CODE CARD]

```scss
$columns: 4;

@for $index from 1 through $columns {
  .span-#{$index} {
    grid-column: span $index;
  }
}
```

PARISA: Sass can loop and generate four separate selectors before the browser sees anything.

JULES: CSS custom properties cannot create selectors or property names through `var()`.

PARISA: Conversely, Sass cannot react to a component's live inherited theme unless it emits CSS that uses runtime features.

JULES: Often the useful answer is both: Sass for generation, custom properties for runtime variation.


## Modules, Not Ancient Imports

PARISA: Modern Sass organizes libraries with `@use` and `@forward`.

JULES: They provide namespaces and explicit APIs instead of dumping everything into one global scope.

[CODE CARD]

```scss
@use "tokens" as tokens;

.card {
  padding: tokens.$space-lg;
}
```

PARISA: Old Sass `@import` is legacy architecture, not the model to choose for a new system.


## Mixins Can Earn Their Keep

JULES: A mixin can centralize a complicated, repeated declaration pattern.

PARISA: It can also hide twenty declarations behind a friendly name and generate enormous CSS everywhere it is included.

JULES: Reuse in source does not guarantee reuse in output.

PARISA: Inspect the compiled CSS. The browser pays for output, not elegance in the SCSS file.


## Functions and Color

JULES: Sass has mature build-time functions and data structures.

PARISA: Native CSS color functions now solve more live color problems, including mixing and relative adjustments.

JULES: Which should you choose?

PARISA: Ask whether the value must respond at runtime. If themes, inheritance, or live state matter, keep the calculation in CSS when support fits.

JULES: If you need to generate a fixed scale or validate a build-time configuration, Sass may be appropriate.


## Migration Is Not a Moral Achievement

[STING]

### PLEASE DON'T DO THIS

PARISA: Do not remove Sass from a stable project merely to announce that you removed Sass.

JULES: Inventory what it does first: module structure, third-party libraries, functions, mixins, generated utilities, asset paths, compatibility processing.

PARISA: Replace capabilities deliberately and compare output.

JULES: Also do not add Sass automatically to a new project before plain CSS becomes painful.

PARISA: Dependencies should solve present problems, not provide emotional support.


## A Decision Test

JULES: Are you only using variables?

PARISA: Try custom properties.

JULES: Only shallow nesting?

PARISA: Native nesting may be enough.

JULES: Need loops that generate selectors, custom build-time functions, or a shared Sass library?

PARISA: Sass still has a concrete job.

JULES: Need runtime theming and contextual components?

PARISA: Use native CSS capabilities, whether or not Sass also participates.


## What Did We Actually Learn?

PARISA: Sass compiles to CSS and offers a real programming model at build time.

JULES: Native CSS now overlaps with several reasons teams originally adopted it.

PARISA: Similar features differ because native CSS participates in the live browser environment.

JULES: Sass still provides loops, mixins, functions, modules, and generation that native custom properties do not.

PARISA: Existing projects deserve an audit, not a trend-driven rewrite.

JULES: New projects should add Sass only when its current benefits justify its cost.

PARISA: Sass is neither dead nor mandatory.

JULES: Nuance survives another episode.

[MUSIC]

PARISA: Next: PostCSS.

JULES: Which is not Sass with a different logo.

PARISA: The bar is on the floor, and yet I appreciate the clarification.

[MUSIC ENDS]
