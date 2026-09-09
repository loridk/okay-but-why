# Episode 12: Modern Color — CSS Learned Math and Developed Opinions About Purple

Status: Draft

**CAST**

PARISA — Designer-developer who knows hexadecimal colors are coordinates, not personality tests.

JULES — Developer carrying a color-space diagram and several caveats.

[MUSIC]

PARISA: I have a brand purple.

JULES: Hex?

PARISA: `#6d28d9`.

JULES: What does changing the middle pair do?

PARISA: Makes it a different purple and damages my confidence.

[MUSIC STING]

## A Color Is More Than Three Numbers

JULES: CSS supports multiple ways to describe color because color spaces organize and represent colors differently.

PARISA: Hex and `rgb()` describe red, green, and blue channels in an RGB space.

JULES: `hsl()` reorganizes familiar RGB colors around hue, saturation, and lightness.

PARISA: Easier to reason about in some tasks, but HSL lightness is not perceptually uniform.

JULES: Two colors with the same HSL lightness can look very different in brightness.


## Enter OKLCH

[CODE CARD]

```css
:root {
  --brand: oklch(55% 0.2 285);
}
```

JULES: OKLCH uses lightness, chroma, and hue in a perceptual color model.

PARISA: Lightness aims to correspond more consistently to perceived lightness than HSL's channel math.

JULES: Chroma is roughly colorfulness, and hue is an angle around the color wheel.

PARISA: “Perceptually uniform” does not mean every person perceives every color identically.

JULES: Correct. It is a model designed for more even numerical relationships, not a universal human-vision emulator.


## Wider Gamuts

JULES: Modern displays can show colors outside the traditional sRGB gamut.

PARISA: Spaces such as Display P3 can represent some more vivid colors on capable devices.

[CODE CARD]

```css
.banner {
  background: rgb(109 40 217);
}

@media (color-gamut: p3) {
  .banner {
    background: color(display-p3 0.47 0.14 0.9);
  }
}
```

JULES: A broadly usable fallback first, then an enhancement where the display and browser support it.

PARISA: But vivid is not synonymous with accessible.


## color-mix()

[CODE CARD]

```css
.button:hover {
  background: color-mix(in oklch, var(--brand) 85%, black);
}
```

JULES: `color-mix()` asks the browser to mix colors in a chosen color space.

PARISA: So component states can derive from live custom properties.

JULES: Yes. Change the brand token at runtime and the mixed hover color follows.

PARISA: Unlike a Sass color function whose result was fixed during compilation.


## Relative Colors

[CODE CARD]

```css
.quiet {
  color: oklch(from var(--brand) calc(l + 10%) calc(c * 0.7) h);
}
```

PARISA: The new color takes channels from an origin color and adjusts them.

JULES: Support and syntax should be checked for the browsers your project targets.

PARISA: Relative color is powerful, but a design token with a meaningful name may be easier to govern than a formula repeated everywhere.


## Gradients Have a Color Space

[CODE CARD]

```css
.hero {
  background: linear-gradient(in oklch, var(--start), var(--end));
}
```

JULES: The interpolation space changes the colors travelled through between stops.

PARISA: RGB interpolation can pass through muddy or surprising middle colors; perceptual spaces may produce a more intentional transition.

JULES: “May.” Designers still need eyes.


## Alpha Is Not Lightness

PARISA: Adding transparency mixes a foreground with whatever sits behind it.

JULES: Which means the resulting contrast depends on the background.

[CODE CARD]

```css
.muted-text {
  color: rgb(255 255 255 / 70%);
}
```

PARISA: Seventy-percent white is not a fixed gray. It is composited over the actual surface.

JULES: Test the rendered combination, not the foreground token in isolation.


## Please Don't Calculate Your Way Out of Contrast Testing

[STING]

### PLEASE DON'T DO THIS

PARISA: A generated palette is not automatically accessible.

JULES: Contrast varies by text size, weight, background, state, and the standard or algorithm you evaluate.

PARISA: Hover, focus, disabled, selected, error, and forced-color states all need consideration.

JULES: Color must not be the only cue for meaning.

PARISA: A red border without error text is just a festive mystery.


## Gamut Mapping and Fallbacks

JULES: A requested color may fall outside what a display can reproduce.

PARISA: Browsers map it into an available gamut, and the result may not exactly match the authored coordinate.

JULES: Use fallbacks where appropriate and test on ordinary screens, not only the expensive monitor that makes every purple look employed.


## Tokens Should Describe Purpose

[CODE CARD]

```css
:root {
  --color-action: oklch(55% 0.2 285);
  --color-on-action: white;
  --color-danger: oklch(52% 0.2 28);
}
```

PARISA: Semantic names describe roles. Palette names can still exist underneath, but components should not need to know that danger is “red 700.”

JULES: And token relationships need tests when themes change.


## What Did We Actually Learn?

PARISA: CSS supports several color spaces because they represent and interpolate color differently.

JULES: HSL is intuitive but not perceptually uniform.

PARISA: OKLCH gives more useful perceptual relationships for many design tasks.

JULES: Wider-gamut colors can use capable displays, with sensible fallbacks.

PARISA: `color-mix()` and relative colors can derive runtime colors from custom properties.

JULES: None of this removes contrast testing or the need for non-color cues.

PARISA: CSS learned color math. Humans still approve the purple.

[MUSIC]

JULES: Next: animation without making everyone sick.

PARISA: The phrase “scroll-jacking experience” has already been escorted from the building.

[MUSIC ENDS]
