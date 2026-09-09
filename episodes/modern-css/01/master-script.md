# Episode 1: What Happened to CSS?

Status: Draft

**CAST**

PARISA — Experienced millennial web developer. Knows CSS and SCSS well. Remembers when rounded corners required three background images and a blood sacrifice.

JULES — Gen Z developer who arrived after Flexbox and npm were already part of the furniture.


[MUSIC]

PARISA: I would like to file a complaint.

JULES: Against whom?

PARISA: CSS.

JULES: That's a broad defendant.

PARISA: Specifically, CSS for quietly becoming good while I was busy maintaining websites.

JULES: You think CSS used to be bad?

PARISA: No. I think CSS used to be extremely capable at the things it was designed to do, and extremely hostile toward several things designers kept asking us to do anyway.

JULES: Like centering.

PARISA: Do not say that word casually in front of people my age.

JULES: Sorry.

PARISA: We have scars.

JULES: From `vertical-align`?

PARISA: It knows what it did.

[STING]

PARISA: Welcome to *Okay, But Why?*, the show where developers are allowed to ask why the platform changed while they were using the platform.

PARISA: I'm Parisa. I have written CSS professionally since table layouts were becoming embarrassing but had not yet become extinct.

JULES: And I'm Jules. I entered web development in a world where Flexbox existed, although half the tutorials still explained floats first for reasons no one could defend.

PARISA: Historical reenactment.

JULES: Today we're starting a series called *Wait, CSS Does That Now?*

PARISA: Because apparently CSS has variables.

JULES: Yep.

PARISA: Nesting.

JULES: Yep.

PARISA: Parent-ish selectors.

JULES: The relational pseudo-class `:has()`, but yes.

PARISA: Container queries.

JULES: Yes.

PARISA: Actual color math.

JULES: Yes.

PARISA: And layouts that don't require me to float every child left and then apologize to the parent element.

JULES: Also yes.

PARISA: What the hell happened?


## First: CSS Was Never Just Decoration

JULES: Before we declare a miraculous recovery, what was CSS actually for when you started?

PARISA: Separating presentation from structure.

PARISA: HTML says this is a heading, a paragraph, a list, a button.

PARISA: CSS says how those things should be presented.

PARISA: And presentation is not just making the heading purple.

PARISA: It includes layout, spacing, typography, visual hierarchy, different media, interaction states, user preferences—

JULES: So “CSS makes it pretty” is underselling it.

PARISA: Wildly.

PARISA: CSS affects whether the page is readable, usable, adaptable, and understandable.

PARISA: It has always been part of the interface logic.

JULES: But not programming logic in the JavaScript sense.

PARISA: Right. CSS is a declarative style-sheet language.

PARISA: I describe the result and the conditions. The browser figures out how to lay it out and paint it.

PARISA: I do not write a loop that visits every paragraph and manually calculates where it goes.

JULES: Thankfully.

PARISA: The browser also participates.

PARISA: My rules interact with the document, the viewport, available fonts, user settings, default browser styles, content I may not know in advance, and the cascade.

JULES: The cascade being the part everyone blames when they wrote seventeen selectors and lost track of them.

PARISA: The cascade is not a bug. It is a conflict-resolution system.

JULES: Put that on a shirt.

PARISA: “Specificity did not betray you. You failed to understand the constitution.”

JULES: Less marketable.


## Who Asked for This?

JULES: So if CSS already had a real job, why does older CSS have such a reputation?

PARISA: Because the web changed faster than its layout tools did.

PARISA: Early CSS came from a document-oriented world.

PARISA: Pages flow from top to bottom. Text wraps. Blocks stack. Images sit with text.

PARISA: That is useful and resilient.

JULES: A document can still make sense before your stylesheet loads.

PARISA: Exactly. That is a feature.

PARISA: But then clients wanted application interfaces, magazine layouts, equal-height columns, vertically centered everything, complex responsive cards, sticky footers—

JULES: And a carousel.

PARISA: There is always a carousel.

JULES: Product says engagement.

PARISA: Accessibility says stop moving the content while I am trying to read it.

JULES: Fair.

PARISA: We were asking tools made for document flow to imitate increasingly complex graphic and application layouts.

PARISA: So we got inventive.

JULES: “Inventive” sounds ominous.

PARISA: Floats were designed so content could wrap around something, like an image.

PARISA: We used them to build entire page columns.

JULES: That is like using a coat hook as structural steel.

PARISA: It works right up until someone adds a winter coat.

[CODE CARD]

```css
.column {
  float: left;
  width: 33.333%;
}

.row::after {
  content: "";
  display: table;
  clear: both;
}
```

PARISA: That clearfix pseudo-element exists because floated children can stop contributing to the normal height of their parent.

JULES: We generated invisible content to repair the layout side effect of using a text-wrapping feature as a grid.

PARISA: Correct.

JULES: Web development is beautiful.

PARISA: We also used tables for layout before standards and accessibility finally chased us down an alley.

PARISA: We used background images for gradients and rounded corners.

PARISA: We sliced designs into tiny images.

PARISA: We used negative margins with the confidence of people defusing a bomb.

PARISA: We wrote JavaScript to measure things CSS could not respond to.

JULES: And if the content changed?

PARISA: Then the bomb beeped faster.


## The Browser War Hangover

JULES: Was the problem only missing features?

PARISA: Absolutely not.

PARISA: There was also inconsistent browser support.

PARISA: Different engines interpreted parts of CSS differently. Internet Explorer had bugs that became part of your architecture.

PARISA: We used conditional comments, CSS hacks, browser-specific stylesheets—

JULES: Vendor prefixes.

PARISA: Later, yes. `-webkit-`, `-moz-`, `-ms-`, `-o-`.

PARISA: You could write the same experimental property several times and hope future you remembered to remove the archaeology.

[CODE CARD]

```css
.button {
  -webkit-border-radius: 0.5rem;
     -moz-border-radius: 0.5rem;
          border-radius: 0.5rem;
}
```

JULES: For rounded corners.

PARISA: For rounded corners.

JULES: A thing I now type once without emotion.

PARISA: Must be nice.

JULES: It is.

PARISA: Browser compatibility tables were not optional reading.

PARISA: And “supported” did not always mean “works the same in the exact combination we need.”

JULES: That part remains true.

PARISA: Yes. Modern does not mean magic, and browser testing did not retire to Florida.

PARISA: But the baseline is dramatically better.


## Enter the Preprocessors

JULES: This is where Sass enters?

PARISA: Sass, Less, Stylus. Tools that let us write a more capable source language and compile it into CSS browsers understood.

JULES: Compile meaning the browser never reads your `.scss` file.

PARISA: Right. A build tool processes it first and emits ordinary CSS.

[CODE CARD]

```scss
$brand: #7c3aed;

.card {
  color: $brand;

  a {
    text-decoration: none;
  }
}
```

JULES: Variables and nesting.

PARISA: Plus mixins, functions, partials, imports, loops, color helpers.

PARISA: These tools solved real authoring problems.

PARISA: They let us organize large style systems, reuse values, generate repetitive rules, and write code closer to how we thought about components.

JULES: So this series is not “Sass was stupid and native CSS saved us.”

PARISA: God, no.

PARISA: Sass helped demonstrate what authors needed.

PARISA: Frameworks did too.

PARISA: Bootstrap's grid was a relief because it packaged years of layout knowledge and browser fixes into a convention a team could share.

JULES: Even if every website briefly looked like Bootstrap.

PARISA: We were tired.

JULES: Understandable.

PARISA: But preprocessors have a fundamental limitation: most of their cleverness happens before the page runs.

JULES: Build time.

PARISA: Yes. A Sass variable is replaced while compiling.

PARISA: It does not participate in the browser's cascade. It does not inherit through the live document. JavaScript cannot change the original Sass variable after the CSS ships.

JULES: Whereas a CSS custom property exists in the page at runtime.

PARISA: Which is why “CSS has variables now” is true but also misleading.

PARISA: They solve overlapping problems in fundamentally different ways.

JULES: That is Episode 2.

PARISA: Good. Because I have opinions.


## CSS Did Not Become CSS4

PARISA: So did all these new features arrive in CSS4?

JULES: No, and this naming situation is not your fault.

[STING]

### WAIT, THAT'S JUST CSS

JULES: CSS1 and CSS2 were broad versions of the language.

JULES: After CSS2, the work was split into modules.

JULES: Selectors can evolve separately from Color, Grid, Containment, Cascade, Fonts, and so on.

JULES: Those modules have their own levels.

PARISA: So “Selectors Level 4” can exist without a single thing called CSS4.

JULES: Exactly.

PARISA: That sounds more practical for specification writers and less practical for anyone trying to answer “What version of CSS do you know?”

JULES: The honest answer is that CSS is now a collection of independently evolving modules.

JULES: There is no monolithic CSS4 release where every new feature arrives together.

PARISA: So “modern CSS” is not a formal version.

JULES: Right. It is shorthand for the newer capabilities that have become useful and interoperable enough for real projects.

PARISA: And the exact boundary moves.

JULES: Constantly.

PARISA: Excellent. A term with vibes instead of borders.

JULES: Web developers love those.


## What Changed?

PARISA: Give me the headline version. What can CSS do now that changes how we build?

JULES: First, purpose-built layout.

JULES: Flexbox handles relationships mainly along one dimension—a row or a column.

JULES: Grid handles two-dimensional layout with rows and columns together.

PARISA: Instead of impersonating a layout system with floats.

JULES: Exactly.

JULES: Second, CSS has much better intrinsic and fluid sizing.

JULES: Functions like `min()`, `max()`, and `clamp()` let values respond within limits.

JULES: Grid features like `minmax()` and flexible tracks can let content and available space negotiate.

PARISA: Meaning fewer breakpoints where I arbitrarily announce that a tablet begins at 768 pixels.

JULES: Often, yes.

JULES: Third, custom properties give you reusable values that remain part of the cascade at runtime.

JULES: Fourth, container queries let a component respond to the space it actually has, not only the width of the browser window.

PARISA: That one feels overdue.

JULES: Fifth, selectors got much more expressive.

JULES: `:is()` and `:where()` help group selectors with different specificity behavior. `:has()` lets you style an element based on relative selectors—often based on what it contains.

PARISA: The “parent selector” people requested for twenty years.

JULES: More powerful and slightly more precise than that nickname.

PARISA: Fine. The parent-selector-adjacent relationship wizard.

JULES: Sixth, cascade layers give authors explicit control over categories of style precedence.

JULES: Native nesting reduces repetition.

JULES: Logical properties support layouts across writing modes and directions.

JULES: Modern color spaces and functions give us better color control.

JULES: Media queries can respond to user preferences like reduced motion, contrast, and color scheme.

PARISA: That is not one upgrade. That is a neighborhood being rebuilt.

JULES: Exactly.


## A Card That Knows Where It Lives

PARISA: Give me one example where this changes the way I think, not merely the number of properties I can memorize.

JULES: Imagine a reusable article card.

JULES: Sometimes it appears in a wide main-content area.

JULES: Sometimes it appears in a narrow sidebar.

JULES: Sometimes another team puts it inside a dashboard panel you have never seen.

PARISA: So, a component in captivity.

JULES: Traditionally, you might make the card respond to the viewport.

[CODE CARD]

```css
@media (min-width: 60rem) {
  .article-card {
    display: grid;
    grid-template-columns: 12rem 1fr;
  }
}
```

PARISA: But that only says the browser is wide.

PARISA: The card itself could still be trapped in a fourteen-rem sidebar.

JULES: Exactly.

JULES: So you add modifier classes.

JULES: Or the parent layout knows about the child's internal design.

JULES: Or JavaScript measures the component and toggles something.

PARISA: None of which is inherently evil, but the card is not truly portable.

PARISA: Its layout decision lives somewhere else.

JULES: With a size container query, the card can respond to the space offered by its container.

[CODE CARD]

```css
.card-region {
  container-type: inline-size;
}

@container (width > 32rem) {
  .article-card {
    display: grid;
    grid-template-columns: 12rem 1fr;
  }
}
```

PARISA: So the page layout provides a container.

PARISA: The component decides what to do when that container has enough inline space.

JULES: Right.

PARISA: Not “desktop card” and “mobile card.”

PARISA: Wide-enough card and not-wide-enough card.

JULES: That is the mental shift.

PARISA: And `inline-size` is using the writing direction's inline axis rather than hard-coding physical width behavior.

JULES: Look at you previewing logical properties.

PARISA: I contain multitudes.

JULES: This one example combines several modern-CSS themes.

JULES: The browser understands layout relationships directly.

JULES: The component can adapt using live information.

JULES: And the rule describes a condition instead of making JavaScript continuously calculate presentation.

PARISA: That is not just nicer syntax.

PARISA: That is a capability we did not have.

JULES: Exactly.

PARISA: Okay, that's actually pretty cool.

JULES: We have a section for that later.

PARISA: Put this one on the tab.


## Who Actually Makes CSS Happen?

PARISA: When you say “CSS gained a feature,” who did the gaining?

PARISA: Because CSS is not a software package someone deploys on Friday.

JULES: Right. Several groups are involved.

JULES: People propose and discuss capabilities.

JULES: The CSS Working Group develops specifications.

JULES: Browser-engine teams implement those specifications.

JULES: Web-platform tests help check whether implementations agree.

JULES: Developers use the features, find edge cases, and report problems.

PARISA: So the specification is not code that gets installed into Chrome, Firefox, and Safari.

JULES: Correct.

JULES: It defines expected behavior.

JULES: Each browser engine implements that behavior in its own codebase.

PARISA: Which explains how two browsers can both claim support and still disagree in some miserable corner.

JULES: Yes.

JULES: Specifications can also change as implementation exposes problems.

JULES: This is less like handing three contractors the same finished cabinet and more like handing them an extremely detailed cabinet specification while everyone continues debating one hinge.

PARISA: And then millions of developers put production dishes in the cabinets.

JULES: The metaphor has become load-bearing.

PARISA: Appropriate.

JULES: Cross-browser efforts called Interop focus attention on areas where consistent implementation needs improvement.

PARISA: Meaning browser makers collaborate on shared tests and priority areas even though they still build different engines.

JULES: Exactly.

PARISA: That matters because a feature being present everywhere is not enough if it behaves differently everywhere.

JULES: Interoperability is the actual prize.

PARISA: I would like that on the shirt instead.


## Why Did It Seem to Happen Suddenly?

PARISA: Here is what confuses me.

PARISA: CSS did not update for years and then wake up in 2023 after a spa weekend.

PARISA: So why does it feel sudden?

JULES: Because several timelines overlap.

JULES: A feature is proposed.

JULES: Then specified.

JULES: Then implemented experimentally in one browser.

JULES: Then implemented elsewhere.

JULES: Then bugs and disagreements get resolved.

JULES: Then support becomes broad enough for your project's users.

JULES: Then articles appear saying you can finally use it.

PARISA: And then I notice it eighteen months later while looking up something unrelated.

JULES: Also yes.

PARISA: So a feature can be “in CSS” without being a sensible production choice for me.

JULES: Absolutely.

JULES: The specification's maturity and real browser interoperability are related, but they are not the same question.

PARISA: And support percentage is not my actual audience.

JULES: Exactly.

JULES: Your analytics, device requirements, embedded browsers, accessibility needs, and cost of a fallback all matter.

PARISA: There is also a social lag.

PARISA: Once a workaround becomes standard, teams keep teaching it.

JULES: Tutorials survive long after the browser bugs they address.

PARISA: Stack Overflow answers become geological layers.

JULES: Framework abstractions can hide what the platform gained underneath them.

PARISA: And people who got burned by early support stop checking.

JULES: Exactly. “I tried Grid once and it did not work in IE” can quietly become a five-year policy.

PARISA: To be fair, IE could turn one afternoon into a personality trait.


## Baseline Is a Better Question

PARISA: So how do I know whether a feature is ready without maintaining a conspiracy wall of browser versions?

JULES: Compatibility data still matters, but there is a newer shared vocabulary called Baseline.

PARISA: Define it without marketing.

JULES: Baseline describes whether web-platform features work across a defined set of widely used browser engines.

JULES: A feature can be newly available across those engines, and after enough time it can be considered widely available.

PARISA: So it answers a more useful question than “Does Chrome have it?”

JULES: Yes. It helps answer whether the feature is interoperable across the core browser set.

PARISA: But it still does not decide my support policy for me.

JULES: Correct.

JULES: Baseline is evidence, not permission from the web pope.

PARISA: Good. I was worried there was paperwork.

JULES: You still decide what happens in older browsers.

JULES: Which brings us to progressive enhancement.


## Modern CSS Does Not Mean Abandoning Old Browsers

PARISA: This is where someone says, “Just use the new thing; users should update.”

JULES: Not us.

PARISA: Good.

PARISA: Progressive enhancement means we begin with a functional experience, then add capabilities where the browser supports them.

JULES: And CSS is unusually good at this because of forward-compatible parsing.

PARISA: Meaning when a browser does not understand a declaration, it generally ignores that declaration instead of setting the computer on fire.

JULES: Precisely.

[CODE CARD]

```css
.title {
  font-size: 2rem;
  font-size: clamp(2rem, 5vw, 4.5rem);
}
```

PARISA: An older browser that does not understand `clamp()` can keep the first valid size.

PARISA: A newer browser uses the later, fluid value.

JULES: There is also `@supports` when you need to test whether a property-value combination or selector is understood.

[CODE CARD]

```css
.cards {
  display: block;
}

@supports (display: grid) {
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  }
}
```

PARISA: Although we should not wrap every modern feature in `@supports` reflexively.

JULES: Right. If the fallback naturally works through the cascade, keep it simple.

PARISA: And sometimes the right decision is that an old browser gets a less fancy layout, not an identical layout recreated with twelve kilobytes of hacks.

JULES: Feature support does not have to mean visual sameness.

PARISA: It means the experience still works.


## Please Don't Use “Modern” as an Accessibility Excuse

[STING]

### PLEASE DON'T DO THIS

JULES: New CSS features can help accessibility.

PARISA: They can also help you make a beautiful inaccessible interface faster.

JULES: There it is.

PARISA: CSS does not repair bad HTML semantics.

PARISA: Styling a `div` to look like a button does not make it a button.

PARISA: Reordering content visually with Grid or Flexbox can create a different experience from the keyboard or screen-reader order.

PARISA: Removing focus outlines is still hostile.

PARISA: Animation still needs restraint and respect for reduced-motion preferences.

PARISA: Text still needs adequate contrast and room to resize.

JULES: So modern capability increases responsibility.

PARISA: It increases options. Responsibility was already there.

JULES: Fair correction.

PARISA: Also, do not use a fancy new selector when clear HTML would solve the actual problem.

JULES: `:has()` is not a substitute for understanding the document.

PARISA: Neither is Tailwind.

JULES: Sabrina is going to have thoughts when we reach that episode.

PARISA: Good. She can explain why everyone put the stylesheet directly inside the class attribute while I stare into the middle distance.

JULES: That is not exactly—

PARISA: I know. I am saving the argument.


## Did Native CSS Replace Sass and Frameworks?

JULES: If CSS has variables, nesting, color functions, and powerful layout, do we still need Sass?

PARISA: Sometimes.

JULES: Diplomatic.

PARISA: The correct answer depends on which Sass features your project uses and what problem they solve.

PARISA: If you mainly wanted nesting, reusable values, and color manipulation, native CSS may now cover much more of your need.

PARISA: If you rely on build-time loops, mixins that generate whole rule sets, modules, or a mature design-system pipeline, Sass may still earn its place.

JULES: Native CSS and Sass can also coexist.

PARISA: Yes. This is not Highlander. There can be more than one.

JULES: What about frameworks?

PARISA: Same question: what problem are they solving for your team?

PARISA: A framework can provide conventions, components, constraints, documentation, and shared vocabulary.

PARISA: Native CSS gaining a capability does not automatically reproduce that organizational value.

JULES: But you should periodically check whether the abstraction is still paying rent.

PARISA: Exactly.

PARISA: Do not keep a dependency because it solved a browser problem in 2014 and nobody has looked behind the curtain since.

PARISA: Also do not rip out a stable system because you saw a cool demo on Tuesday.

JULES: Newer is not automatically better.

PARISA: Older is not automatically safer.

PARISA: Both require thinking. Annoying, I know.


## CSS Is Becoming More Component-Aware

JULES: I think one theme connects a lot of the newer features.

PARISA: Go on.

JULES: CSS is getting better at expressing relationships that belong to components rather than only pages.

JULES: Custom properties can inherit into a component.

JULES: Container queries let the component respond to its own available space.

JULES: `:has()` can respond to its contents or state relationships.

JULES: Subgrid can align nested content with a parent grid.

JULES: Cascade layers can make the ordering between resets, third-party styles, components, and utilities explicit.

PARISA: So we are not merely collecting shinier properties.

PARISA: We are gaining primitives for architecture.

JULES: Yes.

PARISA: That may be the real answer to what happened.

PARISA: Old CSS was brilliant at document flow and the cascade, but we stretched it into systems it could not describe directly.

JULES: Tooling and community patterns filled the gaps.

PARISA: Then the platform gradually absorbed many of the proven needs—without necessarily copying the exact solution.

JULES: That is the key.

JULES: CSS custom properties are not Sass variables implemented by the browser.

JULES: Grid is not Bootstrap's grid with the class names removed.

JULES: Native nesting is not character-for-character Sass nesting.

PARISA: The platform has its own constraints because it has to work live, in the browser, with the cascade, unknown content, user preferences, and backwards compatibility.

JULES: And multiple browser engines have to agree on what it means.

PARISA: Minor detail.


## What Modern CSS Still Does Not Do

PARISA: Time to ruin the victory lap.

JULES: Naturally.

PARISA: CSS still does not make product decisions.

PARISA: It does not choose good semantic HTML.

PARISA: It does not guarantee your design works with real content.

PARISA: It does not test keyboard navigation.

PARISA: It does not decide whether an animation helps or merely demands attention.

JULES: It also does not eliminate JavaScript.

PARISA: Right.

PARISA: If you need application state, data fetching, complex event logic, or behavior beyond what HTML and CSS express, JavaScript still exists.

JULES: Unfortunately for our job security.

PARISA: CSS can now handle interactions people once reached for JavaScript to implement, but “can” and “should” remain different words.

JULES: And experimental features are still experimental.

PARISA: A beautiful browser demo is not a support strategy.

JULES: Nor is a social-media post titled “You Don't Need JavaScript Anymore.”

PARISA: You almost certainly still need JavaScript. You may need less of it for this one interaction.


## What Did We Actually Learn?

PARISA: Recap.

PARISA: CSS was never merely decoration.

JULES: It is a declarative language for presenting structured documents across different conditions and media.

PARISA: Early CSS's natural document flow was resilient, but web design demanded layouts and interface patterns the available tools could not directly express.

JULES: So developers repurposed floats, used tables, images, hacks, JavaScript, preprocessors, and frameworks.

PARISA: Those were not all foolish mistakes. Many were practical responses to real constraints.

JULES: Browser standards, implementations, and interoperability improved over time.

PARISA: And CSS gained purpose-built tools: Flexbox, Grid, custom properties, intrinsic sizing, container queries, richer selectors, layers, nesting, logical properties, better color, user-preference queries—

JULES: This is why it feels like CSS suddenly does everything.

PARISA: But there is no monolithic CSS4.

JULES: CSS evolves in separate modules with separate levels.

PARISA: “Modern CSS” is informal shorthand, and what counts as safe depends on browser interoperability and your actual audience.

JULES: Baseline and compatibility data can inform that decision.

PARISA: Progressive enhancement lets newer browsers get richer presentation while the core experience keeps working.

JULES: And native features do not automatically make Sass, frameworks, or JavaScript useless.

PARISA: We ask what problem each tool solves and whether we still have that problem.

JULES: There it is.

[STING]

### OKAY, THAT'S ACTUALLY PRETTY COOL

PARISA: I think what is actually cool is not that CSS stole features from our tools.

JULES: No?

PARISA: It learned from decades of people trying to build things the language could not yet express cleanly.

PARISA: And now some of those capabilities exist at the browser level, where they can respond to the actual document instead of being compiled away before the page loads.

JULES: That is a much better answer.

PARISA: Do not sound surprised.

JULES: Never.

[MUSIC]

PARISA: Next time: CSS custom properties.

JULES: Also known as CSS variables.

PARISA: Except they are not Sass variables with the dollar sign replaced by two hyphens.

JULES: Correct.

PARISA: They inherit.

JULES: Yep.

PARISA: They participate in the cascade.

JULES: Yep.

PARISA: They still exist at runtime.

JULES: Yep.

PARISA: Oh, that is going to change some things.

JULES: Wait until we theme a component by setting one property on its parent.

PARISA: Okay. That sounds like witchcraft I can get behind.

[MUSIC OUT]

PARISA: *Okay, But Why?* is a podcast about understanding the technology we use instead of pretending we already do.

JULES: Next episode: CSS Variables — Oh, So Sass Variables Aren't the Same Thing.

PARISA: I knew that name was suspiciously convenient.

[MUSIC ENDS]
