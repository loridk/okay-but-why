# Episode 13: Animation Without Making Everyone Sick

Status: Draft

**CAST**

PARISA — Accessibility-minded developer who has closed every tab that hijacked her scroll.

JULES — Developer distinguishing useful state communication from decorative turbulence.

[MUSIC]

PARISA: The button moved.

JULES: Did it help?

PARISA: It moved because someone learned keyframes.

JULES: Then probably not.

[MUSIC STING]

## Motion Has a Job

JULES: Animation can explain change, preserve spatial context, direct attention, and confirm an action.

PARISA: It can show that a panel came from the side, that an item joined a list, or that a control responded.

JULES: It can also delay work, trigger symptoms, distract from content, and make an interface feel unstable.

PARISA: The question is not “Can CSS animate this?” It is “What does this motion communicate?”


## Transitions Connect Two States

[CODE CARD]

```css
.button {
  background: var(--button-bg);
  transition: background-color 160ms ease-out;
}

.button:hover {
  background: var(--button-bg-hover);
}
```

JULES: A transition interpolates a property's value when it changes between states.

PARISA: Declare the property intentionally. `transition: all` can animate changes you never meant to animate.

JULES: Including layout or focus-state changes that should be immediate.


## Keyframes Describe a Sequence

[CODE CARD]

```css
@keyframes status-enter {
  from {
    opacity: 0;
    transform: translateY(0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status {
  animation: status-enter 180ms ease-out;
}
```

PARISA: Keyframes define intermediate states and timing when two-state interpolation is not enough.

JULES: But the status also needs live-region semantics if users must be notified.

PARISA: Motion draws visual attention. It does not announce content to assistive technology.


## Transform and Opacity

JULES: Transform and opacity are often smoother choices because browsers can frequently animate them without recalculating document layout on every frame.

PARISA: “Often” is doing work. Measure actual performance.

JULES: And do not add `will-change` to the entire site as a superstition.

PARISA: It is a targeted performance hint with resource costs, not a blessing.


## Reduced Motion Is a Preference, Not No Fun Allowed

[CODE CARD]

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto;
  }

  .status {
    animation: none;
  }
}
```

JULES: The media feature reports a user preference to minimize non-essential motion.

PARISA: We should design a reduced-motion experience, not merely set every duration to `0.001ms` and declare victory.

JULES: Some functional feedback may remain useful with a fade, color change, or immediate state transition.

PARISA: Large movement, zooming, parallax, and vestibular triggers deserve particular care.


## Motion Cannot Be the Only Message

[STING]

### PLEASE DON'T DO THIS

PARISA: If invalid fields shake but have no error text, the interface is inaccessible and vaguely judgmental.

JULES: State changes need text, semantics, and programmatic relationships where appropriate.

PARISA: Pausing or stopping moving content matters too. People need control over animations that start automatically and persist.

JULES: And focus should never chase an element that is still flying across the screen.


## View Transitions

JULES: The View Transition API can capture old and new visual states and animate between them.

PARISA: CSS styles generated transition pseudo-elements, while JavaScript may coordinate a same-document DOM update.

[CODE CARD]

```js
document.startViewTransition(() => {
  updateThePage();
});
```

[CODE CARD]

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 200ms;
}
```

JULES: Cross-document transitions can also be enabled for eligible navigations in supporting browsers.

PARISA: Support, navigation behavior, and reduced-motion design all need checking.

JULES: It is progressive enhancement, not permission to turn every route into a movie trailer.


## Scroll-Driven Animation

[CODE CARD]

```css
.reading-progress {
  animation: grow-progress linear;
  animation-timeline: scroll();
  transform-origin: left;
}

@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

PARISA: The animation's progress follows a scroll timeline instead of elapsed clock time.

JULES: That can replace JavaScript scroll listeners for some visual effects.

PARISA: Browser support and fallback behavior need verification. And the scroll itself must remain under the user's control.


## CSS Versus JavaScript Animation

JULES: CSS is excellent for state-based transitions and declarative timelines.

PARISA: JavaScript is useful when animation depends on complex application state, sequencing, physics, or imperative control.

JULES: The Web Animations API also exposes browser animation machinery to JavaScript.

PARISA: Choose based on coordination needs, not a belief that one language is more artistically pure.


## Timing Is Interface Design

PARISA: Fast feedback should feel immediate. Longer motion should earn the delay.

JULES: Easing communicates physical character and priority.

PARISA: Repeated bouncing communicates that your notification would like to be thrown into the sea.

JULES: Test on lower-powered devices and while the main thread is busy.

PARISA: And test with people, including people who use reduced-motion settings.


## What Did We Actually Learn?

PARISA: Transitions interpolate property changes between states.

JULES: Keyframes define a sequence.

PARISA: Transform and opacity are often performant, but profiling beats folklore.

JULES: `prefers-reduced-motion` lets CSS respond to a user preference and requires thoughtful alternatives.

PARISA: View transitions and scroll-driven animations add powerful newer timelines.

JULES: They should progressively enhance an interface that remains understandable without motion.

PARISA: Animation is communication. If it communicates nothing, it is furniture falling down stairs.

[MUSIC]

JULES: Next: the finale. Do we even need a CSS framework?

PARISA: I have prepared a decision tree and several grudges.

[MUSIC ENDS]
