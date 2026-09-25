# Episode 5: Your Design Is Lying to You

**Series:** Accessibility
**Runtime:** Target approximately 30 minutes; final timing depends on the recorded performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

JULES: The checkout has labels, buttons, keyboard access, and synchronized ARIA state.

PARISA: Lovely. I have enlarged the text.

JULES: Why did your voice change?

PARISA: Because the Place order button has left the country.

JULES: It's probably just below the fold.

PARISA: No. It's inside a fixed-height container with hidden overflow. The fold has an extradition policy.

JULES: All right. New bug.

PARISA: Same feature. New way of discovering that our design assumes everyone sees exactly what we see.

JULES: Today's episode title feels accusatory.

PARISA: Your Design Is Lying to You. It's affectionate accountability for rectangles.

[STING]

## Correct Information Can Still Be Unavailable

JULES: Welcome to Okay, But Why? We've discussed semantics, focus, and ARIA. Today: how can an interface look obvious to us while hiding information or blocking a task for someone else?

PARISA: And before anyone says “but the screen reader can read it,” some people need visual access. A programmatic label doesn't excuse illegible visible text.

JULES: Accessibility isn't a choice between the accessibility tree and the screen. We need to preserve information through the actual ways people perceive and use the interface.

PARISA: My favorite example is the label that is technically present, styled in pale gray, tiny, and positioned where it overlaps the user's input. The DOM has a label. The human has a problem.

JULES: Or a keyboard-accessible dialog that fits beautifully at one size but loses its close control under zoom.

PARISA: We didn't complete accessibility last episode. We learned one part of the interface contract. Now the design has to honor it.

JULES: Let's keep our pizza checkout and examine contrast, color, enlargement, motion, target size, and error recovery as parts of that same journey.

PARISA: A surprisingly eventful career for a form that just wants an address.

## Contrast Is a Relationship

JULES: Contrast isn't a property of a text color in isolation. It's a relationship between foreground and background.

PARISA: “Our brand gray passes” is incomplete. On what background? At what size and weight? In which state?

JULES: Exactly. Normal text at WCAG AA generally needs a contrast ratio of at least four and a half to one. Large text has a three-to-one threshold. The companion gives the precise size definition and links the criterion rather than making listeners remember it all.

PARISA: Large doesn't mean “looks reasonably large on my monitor.” There is a defined threshold. And a thin font can still be hard to read even when the nominal measurements pass.

JULES: Contrast requirements address a barrier, but a number isn't the entire readability experience. Typeface, spacing, glare, and context can all affect use.

PARISA: Think about our total price. On the design board it's black on white. In the application it's gray on a translucent panel over a promotional pizza photograph.

JULES: Now the background varies. One sample point doesn't establish that every part of the text has enough contrast.

PARISA: The mozzarella is attacking the typography.

JULES: You can simplify the design: use a solid background, a sufficiently opaque backing, or another treatment that preserves contrast across the content. Don't ask a shadow to solve every possible photo.

PARISA: Also check states. Placeholder text, hover text, error messages, selected tabs, and focus indicators. A color token passing in its default pair doesn't prove all the combinations the design system allows.

JULES: And component boundaries and meaningful graphics have non-text contrast requirements in relevant cases. Text passing doesn't automatically mean the field boundary or selected state is visible.

## Red Is Not a Sentence

PARISA: Our postal-code field turns red when invalid. What's missing?

JULES: Information that doesn't depend only on distinguishing the color. An explicit error message tells the user what's wrong and how to correct it.

PARISA: An icon can reinforce the state, but an unexplained icon isn't always enough. A little triangle can mean “warning,” “expand,” or “we bought a large icon pack.”

JULES: Combine clear text with appropriate visual treatment and programmatic state. The same idea applies to charts and delivery availability. Don't distinguish delivery areas only through red and green dots.

PARISA: Use labels, shapes, patterns, or another redundant channel appropriate to the information. The goal is retaining meaning if color perception differs or color isn't available.

JULES: And don't confuse color independence with contrast. A red error message can have excellent contrast but still be the only indication of an error if the text itself is just the original field label.

PARISA: Conversely, adding the word Error doesn't help much if the word is unreadable. These checks complement each other.

JULES: Links are another practical case. A subtle color change from body text may not make them distinguishable. An underline is a familiar useful cue.

PARISA: Designers sometimes remove underlines because the page looks quieter. It becomes extremely quiet if nobody knows the words are interactive.

JULES: We can design a strong visual system without removing the information that makes it usable.

## Zoom Is Not Just a Smaller Phone

PARISA: Let's return to the disappearing button. People often say, “We have responsive CSS, so enlargement is handled.” Why isn't that enough?

JULES: Responsive layouts are a helpful foundation, but you still need to test enlargement. Browser zoom changes the effective space available. Text resizing can stress components differently. Long content and user spacing adjustments can reveal constraints your phone screenshot never exercised.

PARISA: A media query doesn't guarantee that a fixed-height address card grows with its text.

JULES: Or that a navigation bar wraps, that error messages remain visible, or that a sticky footer doesn't cover half the usable screen.

PARISA: The WCAG reference includes text resizing up to two hundred percent and reflow at a narrow effective viewport. A common practical reflow check is four hundred percent zoom from a window about twelve hundred and eighty CSS pixels wide, giving roughly three hundred and twenty CSS pixels of layout width.

JULES: Those are related but distinct checks. They aren't magic percentages that replace checking the actual content and task.

PARISA: And reflow isn't “no horizontal scrolling anywhere under any circumstances.” Some content genuinely needs two-dimensional layout, like a data table or map. The exception doesn't justify horizontal scrolling for the entire checkout form.

JULES: A sensible pattern can keep a wide table scrollable within its own region while the surrounding page reflows normally. But that region must remain usable and understandable too.

PARISA: Our address form has no legitimate reason to become a two-dimensional navigation puzzle. I should not scroll right to find Submit and left to remember what I'm submitting.

## The Box Has to Yield to the Content

JULES: What usually causes the clipping?

PARISA: Fixed heights, absolutely positioned text, assumptions about line length, unbreakable strings, and overflow hidden applied as a broom for layout problems.

JULES: Sometimes min-width constraints in flex or grid children also prevent shrinking. The fix depends on the layout, but the principle is that text and controls need room to grow and wrap.

PARISA: In the Modern CSS series we treated intrinsic sizing as useful layout behavior. Here we can see the access consequence. Content-driven sizing isn't only tidier CSS. It can preserve someone's ability to finish a form.

JULES: Use relative sizing where appropriate, avoid unnecessary rigid dimensions, and test realistic long content. A label translated into another language can expose the same assumption as enlarged text.

PARISA: Again, overlap is useful without pretending every situation is the same. A design that handles variation is less fragile.

JULES: Try user text-spacing changes too. Increasing line height or letter spacing should not cause content or functionality to vanish. The companion links the specific spacing values for a focused check.

PARISA: Don't force those values on every user as the one correct design. Support users applying them.

JULES: That's a helpful distinction: accessibility can mean allowing preferences rather than choosing the supposedly perfect presentation for everyone.

PARISA: And don't disable browser zoom to protect your layout. That is the layout winning an argument against the person who needs to read it.

## Motion Can Have a Physical Cost

JULES: Our order confirmation currently zooms the entire page toward a flying pizza.

PARISA: I can see why the fictional stakeholders approved it. I can also see why someone might need it to stop.

JULES: Vestibular conditions can make some motion uncomfortable or sickening. Reduced-motion support isn't only a preference for restrained aesthetics.

PARISA: The browser can expose an operating-system preference through the CSS media query prefers-reduced-motion. That gives us a way to choose a less motion-heavy presentation.

JULES: We can make the nonmoving state the default and add nonessential motion only when the preference allows it.

[CODE CARD: CSS enhancement for an optional confirmation animation]
```css
.confirmation {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: no-preference) {
  .confirmation {
    animation: confirm-in 180ms ease-out;
  }
}

@keyframes confirm-in {
  from { opacity: 0; transform: translateY(0.25rem); }
  to { opacity: 1; transform: translateY(0); }
}
```

PARISA: This is ordinary CSS. The message remains present without the animation. The animation isn't carrying essential information that disappears in the reduced-motion version.

JULES: And for JavaScript-driven motion, use the corresponding preference check and handle changes as appropriate. A CSS media query doesn't automatically stop an animation implemented somewhere else.

PARISA: Nor should we assume one media query solves every moving thing. Autoplaying content may need pause or stop controls. Flashing hazards are a distinct issue. Some interaction-triggered motion can be replaced with a simple state change.

JULES: Don't globally set every animation duration to nearly zero without understanding the effects. Some code depends on animation events, and some motion communicates progress or state. Remove or replace nonessential motion deliberately.

PARISA: We can preserve feedback without pretending the browser is a theme-park ride.

## A Tiny Target Is a Precision Requirement

JULES: Our basket has a remove control: a small cross near the item name.

PARISA: A classic place where the visible icon and actual target size can differ. The icon can be modest while the button's usable area is larger.

JULES: More space and separation can reduce precision demands, especially for people with tremor, limited dexterity, or alternative pointing devices. It also reduces accidental activation of adjacent actions.

PARISA: WCAG 2.2 has an AA target-size criterion based on twenty-four by twenty-four CSS pixels, with exceptions and spacing alternatives. The companion explains that reference; it isn't a mandate to make every control exactly twenty-four pixels and call it excellent.

JULES: Larger targets can be more comfortable. The enhanced AAA target-size criterion uses forty-four by forty-four, again with its own exceptions.

PARISA: Minimum and comfortable aren't synonyms. Particularly for a destructive action next to something routine.

JULES: Test on actual touch input where relevant. A desktop pointer can make a tiny target feel more manageable than it is on a phone.

PARISA: Also don't make a hover-only tooltip the only way to discover what the icon does. Touch users and some keyboard users may never receive that explanation.

JULES: Visible text often improves discoverability. If we choose an icon-only control, it still needs an appropriate accessible name and a visual design people can understand.

PARISA: There's our Episode 4 connection. Naming solves a specific information gap. It doesn't enlarge the hit area or teach an ambiguous icon to every sighted user.

## An Error Is a Recovery Conversation

PARISA: Let's submit the form with a missing postal code. Our old design draws a red border and leaves the rest to the imagination.

JULES: The improved version gives a specific message, associates it with the field, indicates invalid state, and makes the error discoverable after submission.

PARISA: “Enter a postal code before continuing” is useful. “Invalid input” tells me the computer has developed an opinion but won't explain itself.

JULES: And if the input has a format requirement, explain the expected format. Don't demand an unfamiliar pattern only after someone fails it.

PARISA: We also need restraint about assumptions. Names and addresses are varied. Rejecting real information because it doesn't resemble the developer's address isn't improved by an accessible error message.

JULES: Client-side validation can help users recover quickly, but the server still validates submitted data. Accessibility doesn't change that security boundary.

PARISA: When server validation fails, preserve correct entries where possible, show useful messages, and restore a coherent focus and information state. Don't drop someone at the top of a blank form as punishment for one missing field.

JULES: Aria-describedby can connect an inline error to its input, as we showed last episode. A summary can link to errors on a longer form. A live announcement can help when appropriate, but choose a coordinated approach.

PARISA: The user needs to identify the problem, understand it, reach it, and fix it. Four steps. Red border covers maybe a fraction of the first.

## Labels That Don't Evaporate

JULES: Why is a placeholder such a tempting label replacement?

PARISA: It makes the empty screenshot look clean. Then the first character deletes the instructions. Wonderful optimization for the one state the user spends the least time in.

JULES: Persistent labels help someone review information after entry, resume after an interruption, or distinguish fields with similar-looking values.

PARISA: A phone number and an order number can both be strings of digits. “I could tell before I typed” isn't useful during correction.

JULES: Placeholder examples can still supplement a label, but don't put essential instructions only there. They may disappear precisely when needed.

PARISA: Floating labels can preserve the words, but the implementation needs testing. Does the label become tiny? Does it overlap autofilled content? Does zoom break the position? Is the programmatic association still correct?

JULES: Again, there's no blanket verdict based only on the screenshot. Test the actual states: empty, focused, filled, autofilled, invalid, disabled where relevant, and enlarged.

PARISA: That sounds like a lot until you compare it with shipping a form whose label physically overlaps somebody's address. The states were always part of the component. We just weren't looking at them.

## Cognitive Load Is Also Design

JULES: We promised practical cognitive considerations without pretending this episode covers an entire discipline.

PARISA: Start with clear language. Name the action from the user's task. “Save delivery address” is more informative than “Proceed with mutation.”

JULES: Keep navigation and terminology consistent. If the same destination is Basket on one screen and Purchase staging area on another, you're asking the user to maintain an unnecessary translation table.

PARISA: Make changes predictable. Selecting a delivery option shouldn't unexpectedly submit the entire order. Opening help shouldn't erase the form. A control's effect needs to match its label and context.

JULES: Break complex tasks into understandable steps when that helps, but don't split a simple form into ten screens solely to make each screenshot look calm.

PARISA: More steps can mean more memory, more navigation, and more opportunities to lose context. Simplicity is about the task, not the amount of whitespace.

JULES: Give people useful confirmation and recovery. If an action can be undone, make that path understandable. If a timeout matters, communicate it and design the options thoughtfully.

PARISA: And avoid blaming the user in error copy. “You entered your information incorrectly” is less useful than identifying the field and correction. We are building a checkout, not conducting a performance review.

## One Design Review with Better Evidence

JULES: Let's do a compact review of our revised checkout. We enlarge it and the sections stack. Labels wrap. The action remains reachable.

PARISA: Error text stays next to the relevant field and is associated programmatically. The summary has a meaningful focus strategy. Red reinforces the error but isn't the only information.

JULES: The total has a stable background and tested contrast. Links remain distinguishable. Focus is visible even when sticky content is present.

PARISA: The confirmation is understandable with motion disabled. Remove buttons have usable target areas and space between them. Instructions remain visible after entering values.

JULES: Then someone suggests adding a tooltip containing all the help text to save space.

PARISA: We ask who can discover it, how it opens, whether it can be dismissed, whether it stays available while needed, and what happens with touch and zoom. Maybe the help belongs visibly in the page.

JULES: Those are implementation questions, not hostility toward design.

PARISA: Exactly. Design is deciding how people use the thing. Accessibility is part of whether that decision works.

JULES: And a design system can capture good defaults: label patterns, error placement, motion preferences, focus treatment, and tested color pairs.

PARISA: But the page still needs review. Components can be composed into an inaccessible experience. A cabinet of individually excellent drawers can still block the front door.

## Review the Same Form in Four States

PARISA: Let's do a design review someone could actually reproduce. We have a two-column checkout: delivery details on the left, order summary on the right, and a sticky payment bar at the bottom.

JULES: At the default desktop size, it looks balanced. Every visible label is present. The total and Place order fit in the payment bar.

PARISA: State one: the customer enters a long address and a long name. What happens?

JULES: The design originally set a fixed height on the address preview to align it with the summary. The last line is clipped, including the apartment number.

PARISA: That's not just imperfect typography. The review step conceals information the customer needs to verify. Let the content determine enough height and allow wrapping. If we truncate for a compact overview, there must be a usable way to inspect the full value before committing.

JULES: State two: the postal code fails validation. The error text is longer than the field label, and it appears beneath the input.

PARISA: Does it push later content down naturally, or overlap the next field? Is it visible without depending on a tooltip? Is it associated with the input? Can the person understand the correction?

JULES: In our broken version, the error is absolutely positioned because the designer wanted the fields not to move.

PARISA: Stable layout can be useful, but overlapping instructions aren't stability. Reserve sufficient flexible space if necessary, or let the content flow. The layout needs to accommodate the information the task requires.

JULES: State three: the person zooms in. The two columns become one, but the sticky payment bar remains the same height in screen space and covers the focused postal-code field.

PARISA: Then our responsive breakpoint solved one problem and left another. We need to check how much of the viewport the sticky area occupies and whether focused content stays visible. Perhaps the bar stops being sticky at constrained sizes.

JULES: That would preserve the action at the end of the form without permanently occupying the little space available.

PARISA: Exactly. Sticky isn't a business requirement. Being able to find and use the payment action is. We can change the presentation to preserve the goal.

JULES: State four: the person returns after an interruption. The inputs contain values, but the original design used placeholders for labels.

PARISA: Now they have a collection of filled rectangles and a memory test. Persistent visible labels identify the fields. If a value needs formatting guidance, keep that guidance available while they edit.

JULES: This is where cognitive and visual concerns meet. The words haven't merely become harder to see; some of the necessary context has disappeared.

PARISA: Right. We don't need to assign a diagnosis to the person to identify an avoidable memory demand. We can design the form so reviewing it doesn't depend on remembering the empty version.

JULES: Now let's add a preference change. Reduced motion is enabled while the customer is on the page, and the confirmation uses JavaScript animation.

PARISA: Does the implementation notice the preference, including changes when relevant? Does the confirmation remain clear without movement? Don't assume our CSS example controls a separate animation library.

JULES: And if we replace the animation with nothing, make sure we haven't also removed the visible confirmation message.

PARISA: Exactly. Reduce the motion, preserve the meaning. A status message and an order reference don't need to fly in from another postal district.

JULES: What should the design handoff contain after this review?

PARISA: The important states and rules, not only screenshots at two widths. Labels persist. Errors wrap and remain associated. Content grows. Sticky controls yield when they obscure the task. Focus remains visible. Reduced motion preserves the result. Target areas stay usable.

JULES: Those rules are more resilient than specifying the exact pixel height of every card.

PARISA: And the developer can explain why an implementation needs flexibility. “This card grows because the address and error message must remain available” is a concrete reason, not an aesthetic disagreement.

JULES: We can still care about the visual rhythm.

PARISA: Absolutely. We just need the rhythm to survive actual content. Real users keep inconsiderately having names and addresses instead of placeholder strings.

JULES: Should we test every imaginable name and viewport?

PARISA: No. Use representative difficult cases and the known requirements. If one reveals a fragile assumption, fix the assumption. Don't create a thousand screenshots of the same problem and call that coverage.

## Obvious to Me Is a Starting Hypothesis

JULES: What's the practical takeaway?

PARISA: Visual clarity to the designer isn't proof that information is available or understandable to everyone. We need to test what changes when presentation and input conditions change.

JULES: Semantics and visual design support the same task. Neither excuses failures in the other.

PARISA: And we don't need a dramatic accessibility redesign after launch if these questions are present while choosing labels, layout, colors, motion, and errors.

JULES: Next time: how do we know whether we've done it well? Lighthouse, axe, WAVE, browser inspectors, linters, and manual testing.

PARISA: With a special guest appearance by the number one hundred, which has been making claims it cannot support.

JULES: The number itself is innocent.

PARISA: Fine. Its press department is under investigation.

JULES: Did we find the Place order button?

PARISA: Yes. We let the container grow. It turns out dinner was trapped by a height declaration.

[OUTRO MUSIC]

## Production References

- WCAG 2.2, Contrast Minimum: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- WCAG 2.2, Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- WCAG 2.2, Text Spacing: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- WCAG 2.2, Target Size Minimum: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- MDN, prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- W3C WAI, User Notifications: https://www.w3.org/WAI/tutorials/forms/notifications/
- Companion records precise reference values and exceptions. Criteria references are scoped teaching aids, not an exhaustive conformance assessment. CSS example only controls its own optional confirmation animation.
