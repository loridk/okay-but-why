# Episode 3: Throw Away Your Mouse

**Series:** Accessibility
**Runtime:** Target approximately 30 minutes; final timing depends on the recorded performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: The mouse is in a drawer.

JULES: Why did you close the drawer so dramatically?

PARISA: Accountability. If I reach for it during our keyboard test, there will be a noise and a moment of shame.

JULES: We don't do shame-based accessibility training.

PARISA: Fine. A moment of useful evidence.

JULES: Much better.

PARISA: I'm on our fictional pizza checkout. I can reach the address field. I can reach the delivery notes. I cannot reach the very large button that opens delivery options.

JULES: The button-shaped div from last episode?

PARISA: Its cousin. Apparently they have a family business.

JULES: Does it work when clicked?

PARISA: Beautifully. Which proves exactly what we said it proves: it works when clicked.

[STING]

## An Action Existing Is Not Enough

JULES: Welcome to Okay, But Why? We know the browser needs useful semantics. Today we ask whether someone can reach and operate the interface without using the pointer path we happened to develop first.

PARISA: Keyboard access matters directly to people who use keyboards. It also supports patterns used by other input methods. We shouldn't assume that testing with a mouse covers switch access, voice control, or assistive technology.

JULES: Nor does a keyboard pass prove those other experiences. It's one essential part of the picture, and it's remarkably good at exposing assumptions.

PARISA: My inaccessible delivery control is a nice example. The action exists in JavaScript. The click handler exists. But I can't arrive at it through the normal keyboard sequence.

JULES: Which means implementation isn't just the action's function. It includes how people discover it, reach it, understand it, and invoke it.

PARISA: I like that because “the handler works” is a very small statement that often dresses up as “the feature works.”

JULES: Let's start with the native path. Tab generally moves forward among focusable controls. Shift plus Tab moves backward. Enter follows a focused link or activates a button. Space activates a focused native button and toggles a checkbox.

PARISA: But Space on a normal link usually scrolls. We don't add custom Space handling to every link because buttons use it.

JULES: Right. Keys belong to interaction patterns. Escape often dismisses an open popup or dialog. Arrow keys operate within certain widgets, like radio groups or tabs. They don't universally mean “go to the next thing on the page.”

PARISA: The companion has a quick reference. We're not announcing a keyboard inventory over the music.

## Focus Is Where Keyboard Input Goes

JULES: What do we mean by focus?

PARISA: The element currently receiving relevant keyboard input. If focus is in the delivery notes, typing edits that field. If it's on Place order, Enter can activate the button.

JULES: And the visual focus indicator is how many sighted keyboard users locate that position. It is related to focus, but it isn't focus itself.

PARISA: Which explains the classic disaster: someone removes the outline and says they removed an ugly border. What they actually removed was the only visible indication of where the keyboard is acting.

JULES: Focus still moves. The user just can't see where.

PARISA: Like turning off the cursor in an editor and saying the code looks cleaner now.

JULES: Focus order is the sequence someone follows. Programmatic focus is when code intentionally moves focus, for example to a dialog you've just opened.

PARISA: Four related concepts: the current target, its visible indication, the route between targets, and code moving the target. If we keep those separate, debugging gets less mystical.

JULES: There's another important distinction: a screen reader can have a reading or virtual cursor that isn't identical to DOM keyboard focus. Someone navigating headings isn't necessarily moving focus to every heading.

PARISA: So don't treat “the screen reader is reading this paragraph” as proof that the paragraph is the active element.

JULES: Exactly. Keyboard-only testing and screen-reader navigation overlap, but they are not the same test.

## The Route the Document Already Provides

PARISA: By default, the source order gives us a major part of the focus sequence. Which is one reason meaningful HTML order matters before layout.

JULES: CSS can visually rearrange things without making the keyboard sequence match. A layout that puts the final action at the top visually might still place it last in the DOM.

PARISA: Sometimes that relationship makes sense, sometimes it doesn't. The test is whether the sequence preserves meaning and is understandable, not whether every pixel has a matching coordinate in the tab order.

JULES: If we need a different logical sequence, fix the structure where possible. Don't immediately assign positive tabindex values to patch the visual arrangement.

PARISA: Ah yes. Numbering the entire page like an airport boarding system operated by a spreadsheet.

JULES: Positive values move elements into a priority sequence before the ordinary zero/default group. Now unrelated components can compete for earlier positions. A new field can require renumbering or produce jumps you didn't expect.

PARISA: And a reusable component can't reasonably know the entire page's numbering scheme. Its local fix becomes everyone else's navigation problem.

JULES: Keep the natural order unless there is a well-understood reason for a specific widget's internal focus strategy.

PARISA: Internal widget strategy is not a license to assign tabindex forty-two to the checkout button because it's important.

## Why Minus One Is Useful

JULES: The two tabindex values developers most often need to understand are zero and minus one.

PARISA: Zero puts an otherwise non-tabbable element into the normal sequential order. It doesn't give it a role or activation behavior.

JULES: Exactly. A div with tabindex zero can receive focus, but it still isn't automatically a button. You have solved reachability and inherited several remaining jobs.

PARISA: Minus one is the interesting one. It generally keeps the element out of sequential Tab navigation while allowing code to focus it.

JULES: So a page heading or an error summary can be a deliberate destination without becoming an extra stop every time someone tabs through the page.

PARISA: “Not a routine stop, but a valid destination when the workflow calls for it.” That makes much more sense than thinking negative means disabled.

JULES: It doesn't mean disabled or hidden. And it isn't a security or click-prevention mechanism. Focusability details can vary by element and browser, but that distinction is the working model.

PARISA: Suppose submitting the checkout produces three errors. We can move focus to a clear error summary, with links to the affected fields. The summary may use tabindex minus one so code can focus it.

JULES: Or a simpler form might move focus to the first invalid field, depending on the validation approach. Choose a coherent strategy; don't make a summary, focus a field, and launch several competing announcements at once.

PARISA: Accessibility through a coordinated information plan. An unfortunate threat to my collection of random event handlers.

## Put a Visible Marker on the Current Place

JULES: Let's return to the indicator. Browser defaults are a useful starting point. If design customizes focus, the replacement needs to remain visible against the actual backgrounds and states.

PARISA: Including dark mode, selected controls, sticky headers, and the element's hover treatment. A ring that exists in the stylesheet but blends into the component isn't doing much.

JULES: The CSS pseudo-class focus-visible helps style focus when the browser determines a visible indicator is needed. It's browser CSS, not an ARIA feature.

PARISA: And focus-visible isn't an excuse to remove all focus styling without checking. We can add an obvious outline and test actual keyboard use.

[CODE CARD: CSS focus treatment — choose colors that contrast with your design]
```css
:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 3px;
}
```

JULES: This is a starting treatment, not a universal color guarantee. You need to check its contrast and whether ancestors clip the outline.

PARISA: Overflow hidden can crop our nice ring. A sticky banner can cover the focused field. The user doesn't care that our outline technically exists behind the cookie notice.

JULES: So focus visibility includes whether the focused item is actually exposed in the viewport. Scroll behavior, overlays, and fixed headers can interfere.

PARISA: The test is pleasantly straightforward: keep moving through the task and ask whether you can tell where you are. If you need the mouse to rediscover the keyboard position, something went wrong.

## A Skip Link Saves the Repeated Journey

JULES: Our checkout has the same header and navigation as every other page. Why add a skip link?

PARISA: Because without one, a keyboard user may have to traverse repeated links before reaching the main task on every visit. A visible-on-focus shortcut can take them directly to the main content.

JULES: A main landmark helps some assistive-technology navigation, but a keyboard user without that tool may still need the skip link.

PARISA: Different access mechanisms can complement each other. We don't remove one because another audience has a shortcut.

[CODE CARD: HTML skip destination]
```html
<a class="skip-link" href="#main-content">Skip to main content</a>
<header><!-- Repeated site navigation --></header>
<main id="main-content" tabindex="-1">
  <h1>Checkout</h1>
  <!-- Checkout content -->
</main>
```

JULES: Style the skip link so it's clearly visible when focused, and verify that activation lands meaningfully at the content in supported browsers. The destination's minus-one tabindex helps make it focusable without adding a routine Tab stop.

PARISA: Also verify the next Tab proceeds into the content. Scrolling the page while leaving the keyboard stranded in the header doesn't fulfill the promise very well.

JULES: That's a useful example of why visual inspection alone isn't enough. A jump can look successful while the interaction position isn't where you expected.

## When Moving Focus Helps

PARISA: Focus management sounds like a thing an application should do constantly. It is not.

JULES: Usually preserve the user's position. Move focus when the workflow creates a meaningful context change and leaving it behind would be confusing or unusable.

PARISA: Opening a modal dialog is the obvious example. The user asked to edit the delivery address. The dialog appears. Keyboard focus should enter it at a sensible point.

JULES: That might be the first field, or a static heading if there's substantial content someone needs to read before interacting. “Always focus the first button” isn't a universal rule.

PARISA: Especially if the first button is the irreversible action. Please don't welcome someone to a confirmation dialog by making the most destructive choice the path of least resistance.

JULES: When the dialog closes, return focus to the opener if it still exists and that fits the workflow. If the action removed the opener, choose a logical next location instead.

PARISA: Like deleting a saved address: the exact Edit button may no longer exist. Returning focus to a surviving list control or meaningful heading can preserve orientation.

JULES: Dynamic insertion by itself isn't enough reason to move focus. If delivery estimates update while someone types their street address, leave them typing.

PARISA: An update can be communicated without grabbing the keyboard. That's what our ARIA live-region discussion will help with.

## A Modal Is More Than a Centered Rectangle

JULES: Native dialog opened with showModal gives you important browser behavior: a modal top-layer presentation and an inert background, along with native focus handling.

PARISA: Whereas adding an open attribute or calling show creates a different, nonmodal situation. “It looks like a modal” doesn't establish modality.

JULES: You still need a useful accessible name, deliberate initial focus, a clear close control, and testing of the full workflow. Native support helps; it doesn't decide every product detail.

PARISA: If you build a custom modal with a div, you own the equivalent behavior. Keyboard focus needs to stay in the active modal while it's open, and background interaction must be unavailable.

JULES: Escape normally closes a dismissible modal. Tab and Shift plus Tab stay within its focusable content. Closing returns the user somewhere sensible.

PARISA: Is keeping focus inside a modal a keyboard trap?

JULES: Not when there's an understandable, operable way to close it and continue. The harmful trap is being unable to leave. Modal focus containment serves a specific temporary context with an exit.

PARISA: And role dialog or aria-modal true doesn't build all that behavior. We're previewing Episode 4, where we confiscate some magical thinking.

JULES: The companion links the dialog pattern. We're not going to dictate a production focus-management library over audio.

PARISA: Thank you. I would like our listeners to remain conscious.

## Navigation Without a Full Page Load

JULES: Single-page application navigation introduces another focus decision. A route changes, but the browser hasn't necessarily performed a full document navigation.

PARISA: So the new content can appear while focus stays on a link in a sidebar, or worse, an element that was removed. We need to decide how the new context becomes apparent.

JULES: Update the document title, provide meaningful structure, and test a focus strategy appropriate to the route transition. Focusing the new main heading is one possible pattern, not a command to focus headings after every state update.

PARISA: Filtering a list isn't automatically a new page. Loading another result isn't automatically an invitation to steal focus. Treat different changes differently.

JULES: History navigation also deserves testing. Going back should make sense, including position and context. A router can offer features here, but we need to know what it actually does.

PARISA: This is exactly our earlier architecture theme: client-side navigation takes over responsibilities that a full browser navigation previously handled. It doesn't make the responsibilities disappear.

JULES: And focus can be lost through component remounting even without navigation. Replacing a focused input with a new DOM node on each keystroke can make an otherwise simple form infuriating.

PARISA: A good reason to test the rendered interaction rather than congratulate the component tree for being elegant.

## Tabs, Menus, and the Keyboard Inside the Keyboard

JULES: Some custom widgets are composite controls. Instead of tabbing through every internal item, Tab enters or leaves the widget and arrow keys move within it.

PARISA: Radio groups are a familiar native example. A custom tab interface often uses arrows between tabs, with a deliberate selected state and an associated panel.

JULES: Focus and selection can be distinct. In a manual-activation tab pattern, moving focus with arrows doesn't select the panel until Enter or Space activates it. In automatic activation, focus can select, provided the panel appears without disruptive delay.

PARISA: This is why copying just role tab gives you approximately the label on the box and none of the furniture.

JULES: A roving tabindex strategy keeps one internal item at zero and others at minus one, moving that position as the user moves within the widget. Another strategy keeps focus on a container and communicates an active descendant. These are patterns to study when needed, not ingredients to scatter across normal navigation.

PARISA: For six ordinary site links, a list of links is still lovely. We don't need to upgrade it into an application menu because someone drew a hamburger icon.

JULES: Menus, comboboxes, and tabs have specific expected interactions. Use a tested implementation and the relevant pattern guidance rather than improvising every arrow key.

PARISA: Our job today is to recognize the responsibility. An exhaustive widget workshop is another series wearing a fake moustache.

## Run a Journey, Record a Failure

JULES: Let's finish the keyboard pass we started. Reload the checkout, set the mouse aside, and begin at a known location.

PARISA: I reach the skip link, activate it, and enter the form. I can see focus. The sequence follows the questions. I reach delivery options and open it with the button.

JULES: Then change an option, close anything you opened, and continue. Reverse direction too. Shift plus Tab can reveal different containment bugs.

PARISA: Submit with an invalid field. Find the error. Correct it without losing the other information. Open and close the address dialog. Complete the simulated order.

JULES: Check whether every essential pointer action has a keyboard path. That doesn't necessarily mean replicating a dragging gesture. It could mean providing Move up and Move down buttons for a reorder operation.

PARISA: The outcome matters. Forcing someone to emulate the mouse exactly can be the assumption we're trying to remove.

JULES: Record a failure concretely: at this step, pressing this key left focus here; the expected result was there. Include the browser and relevant settings.

PARISA: Much more actionable than “keyboard broken,” which is how I describe my own keyboard when I have accidentally enabled Caps Lock.

JULES: And when a platform has a setting affecting which controls Tab reaches, account for it in your setup. Don't misdiagnose a configuration difference as application behavior, but don't use that possibility to dismiss a reproducible problem either.

## A Focus Bug You Can Explain to a Colleague

JULES: Let's follow one failure closely enough that we could file a useful issue. The customer opens Edit delivery address. The dialog looks correct. They tab through the fields and press Save.

PARISA: Save fails validation because the postal code is missing. What happens to focus?

JULES: In our broken version, the component replaces the whole form, including the focused Save button, with a fresh copy. The browser no longer has the same focused node.

PARISA: That's a clue. The application rendered something visually similar, but continuity of the actual element matters. We should avoid unnecessary replacement and provide a deliberate error destination.

JULES: We choose a summary at the top of the dialog that says there's one problem and links to the postal-code field. The summary can receive programmatic focus without becoming another ordinary Tab stop.

PARISA: And the field gets its useful error information. The summary isn't the only copy of the correction instructions.

JULES: The customer activates the summary link, reaches the field, enters the postal code, and saves again. This time the operation succeeds.

PARISA: Now close the dialog and return focus to Edit delivery address, assuming that remains the meaningful opener. Don't leave focus inside removed content or throw it at the first link on the entire page.

JULES: What if the saved address appears in a newly created card and there wasn't an opener because this was Add address?

PARISA: Then choose the logical destination based on the workflow. Perhaps a heading or relevant control for the new address, or the original Add address button if the task naturally returns there. The important thing is that the person can understand where they are and continue.

JULES: So “always return to opener” is a strong default with a reason, not a ritual independent of the application.

PARISA: Exactly. The reason is continuity. If the original control no longer exists, pretending to focus it doesn't satisfy the reason.

JULES: Here's a second failure. While the customer is editing the street address, a background request loads new delivery slots and the application focuses the first slot.

PARISA: That steals the keyboard mid-entry. The next character may go nowhere or trigger an unexpected action. The person did not request a context change.

JULES: Better to leave focus in the address, update the slots, and communicate the availability in a proportionate way.

PARISA: Yes. If the update makes the current field invalid or requires a decision, design that flow deliberately. Don't use focus as a loudspeaker for every asynchronous event.

JULES: Third failure: the user opens a delivery dropdown, presses Escape, and the entire dialog closes too.

PARISA: Competing keyboard handlers. The inner popup and outer dialog both reacted without coordinating. Closing the inner temporary context first is often the expected pattern, but it depends on the widget. We need to implement and test the intended event handling.

JULES: This is where “we listen for Escape” is less informative than “Escape closes the correct active context.”

PARISA: Exactly. Keys are not global slogans. They belong to a focused interaction state.

JULES: What do we put in the issue report for that one?

PARISA: Starting state: address dialog open, delivery popup expanded, focus in the popup. Action: press Escape once. Actual result: both popup and dialog close. Expected result: popup closes and focus returns appropriately within the still-open dialog. Add browser details and the component version if relevant.

JULES: That gives the implementer a reproducible sequence and a specific contract to protect in a regression test.

PARISA: And it doesn't require the implementer to guess what “focus is weird” means. I can personally produce focus-is-weird reports before coffee, but we should aim higher.

JULES: One final wrinkle: a customer uses the browser Back button after finishing the address step. Our route code immediately focuses the main heading and scrolls to the top, even though the browser had restored their previous position.

PARISA: That's a reason to test history transitions separately. A focus strategy suitable for a new route may be wrong for restoring a prior context. We should understand what the router and browser already preserve before overwriting it.

JULES: The common thread is that focus isn't a CSS effect. It's part of application state and navigation.

PARISA: And it's state shared with the person operating the interface. We don't own it exclusively just because JavaScript lets us call focus.

## Give People a Place to Stand

PARISA: Today's deeper point is that focus provides continuity. Where am I, what can I do here, and where will I be after I do it?

JULES: The browser supplies a lot of that for native controls. Our dynamic interfaces need to preserve it when context changes.

PARISA: Use normal document order, show the current position, use minus one for intentional destinations when appropriate, and move focus with a reason. Those rules now have a mechanism behind them.

JULES: And custom components need the right keyboard pattern, not just enough handlers to pass one demonstration.

PARISA: Which leads us to ARIA. We've made something interactive. How do we communicate what it is and what state it's in?

JULES: Next episode: ARIA: What Is This Shit Actually For?

PARISA: I have brought questions, a native button, and very limited patience for attributes applied as incense.

JULES: Can the mouse come out now?

PARISA: Yes. It has learned nothing, but we have.

[OUTRO MUSIC]

## Production References

- MDN, tabindex: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex
- W3C APG, Keyboard Interface: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- W3C APG, Modal Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- MDN, dialog: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- W3C WAI, Bypass Blocks: https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html
- Focus CSS is illustrative and requires contrast/clipping checks in the actual design. The skip example requires visible-on-focus styling. Dialog discussion defines responsibilities rather than claiming a complete implementation.
