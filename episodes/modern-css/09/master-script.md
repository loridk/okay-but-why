# Episode 9: PostCSS — Wait, This Isn't Another Sass, Right?

Status: Draft

**CAST**

PARISA — Developer who has seen PostCSS in build output without formally inviting it.

JULES — Toolchain translator reconnecting this series to Node and npm.

[MUSIC]

PARISA: I found PostCSS in my dependency tree.

JULES: Did it leave tracks?

PARISA: A configuration file and the sense that Vite knows more people than I do.

[MUSIC STING]

## PostCSS Is a Processing Pipeline

JULES: PostCSS is a JavaScript tool for transforming CSS through plugins.

PARISA: It is not one styling language with a fixed feature list.

JULES: Correct. A parser turns CSS into a structured representation, plugins inspect or modify it, and PostCSS writes CSS back out.

PARISA: The behavior depends on which plugins the project configured.


## The Familiar Example: Autoprefixer

[CODE CARD]

```css
::placeholder {
  color: gray;
}
```

JULES: Autoprefixer can examine CSS and browser-support data, then add needed vendor-prefixed forms for the project's target browsers.

PARISA: So I write the standard form and automation handles supported compatibility output.

JULES: It can also warn about some outdated syntax.

PARISA: This was a merciful improvement over copying prefix recipes from blog posts.


## Node Is Running the Factory

PARISA: PostCSS is JavaScript, but my CSS still runs in the browser.

JULES: Callback to the Node series: the development tool runs in Node. It reads source files and produces assets for the browser.

[TERMINAL]

```text
source CSS → PostCSS parser → configured plugins → output CSS
```

PARISA: Node runs the factory. The browser receives the car.

JULES: You kept the metaphor.

PARISA: We paid for it.


## Plugins Are the Product Behavior

JULES: One plugin adds prefixes. Another might transform future-looking syntax. Another could lint conventions, optimize output, or analyze CSS.

PARISA: Therefore “we use PostCSS” tells me almost nothing.

JULES: Exactly. Ask which plugins, in what order, with what configuration and browser targets.

PARISA: Plugin order can matter because one transformation changes what the next plugin sees.


## PostCSS Is Not Automatically Future CSS

PARISA: Some setups let authors write syntax that browsers do not yet support and transform it into older CSS.

JULES: But transformation has limits. Not every new browser capability can be faithfully compiled away.

PARISA: A syntax rewrite is easier than recreating a live layout capability like container queries.

JULES: Exactly. A plugin may approximate, require a runtime, or be unable to preserve the semantics.

PARISA: Read what the specific transformation guarantees.


## Configuration Can Be Invisible

JULES: Frameworks and bundlers may use PostCSS internally.

PARISA: Which means I can have PostCSS in a project without a hand-written `postcss.config.js`.

JULES: Yes. Tooling may supply the pipeline.

PARISA: That is convenient until debugging requires knowing which layer changed the CSS.

JULES: Source maps and inspecting generated output matter.


## Browser Targets Are Product Requirements

[CODE CARD]

```text
last 2 versions
not dead
> 0.5%
```

PARISA: Target queries are policy encoded as configuration.

JULES: They should reflect the project's users and requirements, not a string copied forever from a starter template.

PARISA: Changing targets can change output and compatibility.

JULES: Treat it like an engineering decision.


## Please Don't Install a Mystery Pipeline

[STING]

### PLEASE DON'T DO THIS

PARISA: Plugins execute during your build and arrive through the package ecosystem.

JULES: Evaluate maintenance, provenance, permissions, dependency risk, and whether the plugin is still necessary.

PARISA: Do not add five overlapping transformations because their names sound modern.

JULES: And do not assume generated CSS is accessible or efficient. Inspect it.

PARISA: A tool can produce valid CSS that still hides focus indicators and ships half a megabyte of unused rules.


## PostCSS Versus Sass

JULES: Sass defines a stylesheet language with built-in concepts like variables, mixins, modules, and flow control.

PARISA: PostCSS provides infrastructure. Its configured plugins determine transformations.

JULES: They can coexist. Sass might compile SCSS to CSS, then PostCSS applies compatibility or optimization plugins.

PARISA: Or a project may use PostCSS alone. The pipeline depends on the problem.


## Debug the Layers

PARISA: If the CSS I wrote differs from what the browser sees, trace each stage.

JULES: Source file, framework processing, PostCSS plugins, minification, final asset, browser cascade.

PARISA: Do not debug generated output as if it appeared by spontaneous generation.

JULES: And keep source maps available in development.


## What Did We Actually Learn?

PARISA: PostCSS is JavaScript infrastructure for parsing and transforming CSS through plugins.

JULES: It runs in the development toolchain, commonly through Node.

PARISA: Autoprefixer is one famous plugin, not the definition of PostCSS.

JULES: “Uses PostCSS” is incomplete without the plugin list and configuration.

PARISA: Some syntax can be transformed for older environments; some browser capabilities cannot be recreated faithfully.

JULES: Browser targets and plugin dependencies are product and security decisions.

PARISA: It is not another Sass. It is a factory floor where several tools may be working.

[MUSIC]

JULES: Next: Tailwind.

PARISA: Intern!

JULES: You cannot summon Sabrina like tech support.

PARISA: Watch me.

[MUSIC ENDS]
