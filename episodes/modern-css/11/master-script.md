# Episode 11: Logical Properties — CSS That Stops Assuming Everyone Reads Like You

Status: Draft

**CAST**

PARISA — Accessibility-minded CSS developer ready to question every “left” she has ever written.

JULES — Developer explaining flow-relative layout without reducing internationalization to mirroring.

[MUSIC]

PARISA: `margin-left` is lying to me.

JULES: It is accurately describing a physical side.

PARISA: Which is the lie. I usually meant “space before this thing in the reading direction.”

[MUSIC STING]

## Physical Versus Logical

JULES: Physical properties use top, right, bottom, and left.

PARISA: Logical properties use block and inline axes, with start and end positions.

JULES: Those axes adapt to writing mode and text direction.

PARISA: The browser maps intent to physical sides for the document context.


## Inline and Block

JULES: In English's usual horizontal writing mode, the inline axis runs along a line of text from left to right.

PARISA: The block axis runs from one line or block to the next, usually top to bottom.

JULES: In a right-to-left language, inline start is on the right.

PARISA: In vertical writing modes, the axes map differently again.

JULES: This is not merely “flip left and right for Arabic.” It is a general flow-relative model.


## The Direct Mappings

[CODE CARD]

```css
.card {
  margin-inline: auto;
  padding-block: 1rem;
  padding-inline: 1.5rem;
  border-inline-start: 0.25rem solid currentColor;
}
```

PARISA: `margin-inline` covers both inline sides.

JULES: `padding-block` covers block start and block end.

PARISA: `border-inline-start` follows the start edge of the inline flow.

JULES: We express why the edge matters, not where it happened to be in one language.


## Sizing Is Logical Too

[CODE CARD]

```css
.prose {
  max-inline-size: 68ch;
  min-block-size: 20rem;
}
```

PARISA: `inline-size` corresponds to the dimension along text flow; `block-size` to the perpendicular dimension.

JULES: In common English layout they resemble width and height, but the intent survives other writing modes.


## Positioning Without Left

[CODE CARD]

```css
.badge {
  position: absolute;
  inset-block-start: 0.5rem;
  inset-inline-end: 0.5rem;
}
```

PARISA: Place the badge near the start of the block axis and end of the inline axis.

JULES: That may be top-right in one context and somewhere else in another.

PARISA: If the design genuinely means physical top-right—like a map compass—physical properties may be correct.

JULES: Logical is not automatically morally superior. It should match the intent.


## Direction Is Not Alignment

PARISA: Developers sometimes set `direction: rtl` to make a component appear mirrored.

JULES: That property affects text direction and bidi behavior. It is not a generic layout-flipping utility.

PARISA: Use correct document language and direction metadata. Then let logical properties respond.

JULES: And test with real right-to-left content, including mixed scripts, numbers, punctuation, and icons.


## Icons Have Semantics Too

[STING]

### PLEASE DON'T DO THIS

PARISA: A back arrow may need to mirror with direction. A phone icon probably does not. A play icon depends on convention.

JULES: CSS cannot infer icon meaning.

PARISA: Do not mirror every image because the page is RTL.

JULES: And do not reverse DOM order just to make a row look right. Reading and focus order still matter.


## Shorthands Reduce Assumptions

[CODE CARD]

```css
.stack > * + * {
  margin-block-start: 1rem;
}
```

PARISA: That means spacing between stacked items in the block flow.

JULES: It works without declaring that “next” must mean physically down.


## Migration Without Chaos

PARISA: Do we search-and-replace every left with inline-start?

JULES: No. Audit intent.

PARISA: Start with reusable components, spacing systems, and code touched by current work.

JULES: Test supported browsers and fallbacks if your project includes older engines.

PARISA: Mixing physical and logical declarations can create confusing overrides, so document the convention.


## Internationalization Is More Than CSS

JULES: Logical properties help layout adapt.

PARISA: They do not translate text, choose culturally appropriate imagery, format dates, solve bidi isolation, or make a product usable in another locale.

JULES: This is one platform tool in a larger internationalization practice.

PARISA: Still, removing needless directional assumptions from components is real progress.


## What Did We Actually Learn?

PARISA: Physical properties describe screen sides.

JULES: Logical properties describe flow-relative axes and edges.

PARISA: Inline follows text within a line; block follows the progression of blocks.

JULES: Start and end adapt to writing direction and writing mode.

PARISA: Use logical properties when the design intent is relative to content flow.

JULES: Keep physical properties when the requirement is genuinely physical.

PARISA: And test real content. Internationalization is not a transform that flips the screenshot.

[MUSIC]

JULES: Next: modern color.

PARISA: CSS learned math and developed opinions about purple.

JULES: You already had opinions about purple.

PARISA: Now they are perceptually uniform.

[MUSIC ENDS]
