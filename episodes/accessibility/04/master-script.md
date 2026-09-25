# Episode 4: ARIA: What Is This Shit Actually For?

**Series:** Accessibility
**Runtime:** Target approximately 30 minutes; final timing depends on the recorded performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

JULES: Hypothetically, I have a div.

PARISA: My condolences.

JULES: And I give it role button.

PARISA: Why is it a div?

JULES: Hypothetically.

PARISA: Hypothetically use a fucking button.

JULES: That's the opening joke, but it cannot be our entire ARIA lesson.

PARISA: Agreed. I already know native HTML comes first. What I want is the part after that advice. When does an ARIA attribute supply information I actually need? What information? Who receives it? And what am I still responsible for?

JULES: Excellent. We can release the div back into the wild.

PARISA: As a layout container. Under supervision.

[STING]

## The Missing Information Problem

JULES: Welcome to Okay, But Why? ARIA expands to Accessible Rich Internet Applications. The broader WAI-ARIA name connects it to the Web Accessibility Initiative.

PARISA: And the acronym describes a historical need: web interfaces became more interactive than the original set of HTML controls could fully express.

JULES: Exactly. Authors built things like tabs, tree views, custom dialogs, and dynamically updating interfaces. There needed to be a standardized vocabulary for exposing additional semantics to accessibility APIs.

PARISA: So ARIA supplies information about the interface. It doesn't download an accessible interaction engine into the element.

JULES: Right. A role can identify a widget. States and properties describe it. References can establish relationships. The browser maps that information into its accessibility representation.

PARISA: Then assistive technology can use it. It isn't a private language spoken only by one screen reader.

JULES: But the actual experience still depends on browser and assistive-technology support, correct markup, and correct behavior. The specification doesn't replace testing.

PARISA: The question we've carried through the series is useful here: what does the browser know right now? If the answer is “not enough about this custom interaction,” ARIA may fill that gap.

## Native First Means Fewer Jobs to Rebuild

JULES: A native button already has button semantics and expected behavior. Giving a div role button can communicate the role, but it doesn't automatically make it focusable or implement Enter and Space activation.

PARISA: Or disabled behavior, form participation, and the other details we'd inherit from the native element. The role is a statement about what the user should expect.

JULES: Which makes it a promise you have to fulfill.

PARISA: A sign saying “lift” doesn't install an elevator. If somebody follows the sign, we owe them more than a beautifully named hole.

JULES: There's the metaphor. With a firm boundary: ARIA isn't merely decorative signage. It provides machine-readable semantics. But it doesn't construct the interaction it describes.

PARISA: We can also use ARIA on native elements when information is missing. A real button that expands delivery details can expose whether those details are expanded.

JULES: Exactly. Native first doesn't mean ARIA never. It means start with the strongest platform support, then add the semantics the particular interaction requires.

PARISA: Before writing a custom disclosure, consider details and summary. Before building a custom checkbox, consider input type checkbox. Before building a custom modal from nothing, consider dialog.

JULES: And don't override a native role just because you can. A heading shouldn't become a button unless you're intentionally replacing its semantics, and usually a real button inside an appropriate heading is a clearer structure.

## Role, State, Property, Relationship

PARISA: Give me a useful distinction between the categories without a taxonomy dissertation.

JULES: Role asks what the thing is. Button, dialog, status. Many HTML elements already provide implicit roles. States and properties provide additional information, such as expanded, selected, or disabled, and naming or relationship information.

PARISA: State often sounds like something that changes as I interact. A checkbox goes from unchecked to checked.

JULES: Yes, although the specification's state/property distinction isn't simply “changes” versus “never changes.” Authors can update properties too. The practical task is selecting a supported attribute with the correct meaning and keeping its value truthful.

PARISA: So I shouldn't put every plausible attribute on every element. Roles have expectations about what attributes make sense.

JULES: Correct. Selected has a particular meaning on a tab or option. It isn't a generic way to say “I styled this thing purple.”

PARISA: And a relationship can point from one element to another using an ID. That gives the browser a connection visual proximity alone might not establish.

JULES: We'll use that for labels, descriptions, and a controlled panel. Unique IDs and references to existing elements matter.

PARISA: The browser doesn't conduct a séance to find the element I meant.

## What Is an Accessible Name?

JULES: An accessible name is the text the platform computes to identify an element to assistive technology.

PARISA: So “button” tells me the kind of control. “Apply discount” tells me which button and what it does.

JULES: Exactly. A button with visible text often gets its name from that content. A form control can get its name from an associated label. There are element-specific rules and an accessible-name computation, not one universal “read whatever is nearby” process.

PARISA: And visible text and accessible name may match, but they're not identical concepts. I can have visible text that's never associated, or an invisible name that overrides visible text.

JULES: That's why a browser's computed accessibility properties are so helpful. They show what actually won.

PARISA: Let's start with the ordinary field. Delivery name. An actual visible label associated with the input.

JULES: Usually the best option. It helps sighted users, establishes the programmatic relationship, and doesn't disappear when typing starts.

PARISA: I do not need aria-label Delivery name on top of it just to demonstrate commitment.

JULES: Correct. Redundant sources can become conflicting sources when one gets updated and the other doesn't.

PARISA: Especially in localization. Now the visible Spanish label and the forgotten English attribute are having a disagreement inside the same control.

## Labelled By Means Use That Text

JULES: Aria-labelledby references the ID of one or more elements whose text supplies the name. It can reuse an existing visible heading to name a dialog, for example.

PARISA: The dialog heading says “Edit delivery address.” Pointing to it means the visible title and programmatic name come from the same content.

JULES: Yes. Multiple IDs can combine text in reference order, but don't create elaborate naming puzzles when a simple label works.

PARISA: And aria-label?

JULES: It supplies a text string directly. A common case is an icon-only button where there isn't suitable visible label text to associate. The name should describe the action: “Close address dialog,” not “X icon.”

PARISA: But if an icon is confusing visually, an invisible name doesn't solve that for sighted users. Adding visible text may be the better product decision.

JULES: Absolutely. The ARIA choice can't compensate for every design choice.

PARISA: What if I put both on a button?

JULES: For ordinary supported naming cases, a valid aria-labelledby takes precedence over aria-label, which can override native or text-content naming. There are detailed rules and exceptions, so inspect the computed result rather than treating that as a universal algorithm for every role.

PARISA: The practical rule is to choose one intentional naming strategy. More naming attributes aren't extra credit.

## The Visible Words Need to Survive

JULES: Imagine a button visibly says “Pay now,” but its aria-label says “Complete transaction.” Both phrases are understandable, but they don't match.

PARISA: A voice-control user may say “Click Pay now” because that's what they can see. We've introduced a mismatch between their visible clue and the exposed name.

JULES: Keep the visible label in the accessible name. Prefer the same wording, with extra context only when necessary.

PARISA: Like a Remove button in each basket item. “Remove margherita pizza” preserves Remove and distinguishes the target.

JULES: It may also be possible to include visually hidden supplementary text or use a relationship to visible context. The key is a clear name that doesn't contradict the interface.

PARISA: And don't make the name a miniature manual. “Place order, button” is useful. “Place order, click here to submit your order using this button” is the semantic equivalent of someone standing too close.

JULES: Role and state information can be announced separately. You generally don't need to put the word button in the name of a button.

PARISA: Names identify. Descriptions explain. Let's do that distinction next.

## Described By Is Additional Help

JULES: Aria-describedby references additional explanatory text. A field named Delivery instructions might have a description saying “Optional. Include an entry code if the driver needs one.”

PARISA: That text should usually be visibly available too. The attribute associates it; it doesn't write or display the explanation.

JULES: A validation error can also be associated as a description. Keep the label as the name, identify the invalid state where appropriate, and connect useful error text.

[CODE CARD: HTML label, help text, and a validation error state]
```html
<label for="postal-code">Postal code</label>
<input id="postal-code" name="postalCode" autocomplete="postal-code"
       aria-invalid="true" aria-describedby="postal-help postal-error">
<p id="postal-help">Use the postal code for your delivery address.</p>
<p id="postal-error">Enter a postal code before continuing.</p>
```

PARISA: That's the state after validation found an error, not a declaration that a pristine empty field is invalid as soon as the page loads.

JULES: Right. When corrected, update the invalid state and remove the obsolete error association and text as appropriate. Don't leave a stale description insisting there's a problem after it's fixed.

PARISA: And adding describedby doesn't guarantee a newly changed error gets announced immediately while focus remains elsewhere. That's a separate update and focus decision.

JULES: Exactly. Description and announcement are related tools with different jobs. We'll get to live regions shortly.

## A Disclosure That Tells the Truth

PARISA: Let's build one complete small interaction, because this is where attributes stop being vocabulary and start needing a source of truth.

JULES: Delivery details. A native button opens and closes a panel. The button's accessible name stays Delivery details. Aria-expanded communicates its current open state. Aria-controls references the panel.

PARISA: Controls does not make the button control anything. It's a relationship, not an event listener.

JULES: Correct. JavaScript changes visibility and updates expanded together. In this example the content starts visible and the button hidden until enhancement is ready, so the details remain available if the script never runs.

[CODE CARD: HTML and browser JavaScript — one synchronized disclosure]
```html
<button type="button" id="delivery-toggle" hidden
        aria-expanded="true" aria-controls="delivery-details">
  Delivery details
</button>
<section id="delivery-details" aria-labelledby="delivery-heading">
  <h2 id="delivery-heading">Delivery details</h2>
  <p>Review your delivery address before placing the order.</p>
</section>
<script>
  const toggle = document.querySelector("#delivery-toggle");
  const panel = document.querySelector("#delivery-details");

  function setExpanded(expanded) {
    panel.hidden = !expanded;
    toggle.setAttribute("aria-expanded", String(expanded));
  }

  setExpanded(false);
  toggle.hidden = false;

  toggle.addEventListener("click", function () {
    const nextExpanded = toggle.getAttribute("aria-expanded") !== "true";
    setExpanded(nextExpanded);
  });
</script>
```

PARISA: Audio version: the one update function decides both whether the panel is hidden and what state the button reports. Clicking the native button invokes that function with the opposite state.

JULES: And native keyboard activation also produces the button's click action. We don't need an extra key handler that might toggle twice.

PARISA: Wait, that's just JavaScript. Const, a function, an event listener. No TypeScript, no framework, no ARIA engine running the show.

JULES: Exactly. String converts the boolean into the text value used in the attribute. The hidden property controls HTML visibility. Aria-expanded communicates state. Different mechanisms updated from the same decision.

PARISA: Important little syntax trap: aria-expanded false is a meaningful false state. The HTML hidden attribute is a boolean attribute, where putting the text false in the markup doesn't make it absent.

JULES: Which is why using the hidden property with a boolean is clear here. And our script appears after the markup it expects. If you adapt this into a reusable component, account for its lifecycle and validate the elements you depend on.

PARISA: Also don't override hidden with CSS that displays the panel anyway. Then the accessibility state can be truthful about our variable and false about reality.

## State Is Not a Decoration

JULES: In a framework, derive visibility and ARIA state from the same application state. Avoid one variable for the animation, another for expanded, and a third for what the user apparently believes.

PARISA: One source of truth is useful until the truth has three roommates.

JULES: If a state change can happen from several paths, test each path. A close button, Escape, navigation, or a server response can all leave stale semantics if only the click handler updates them.

PARISA: Our simple disclosure leaves focus on its button. If a more complex interaction hides content that currently contains focus, we need to choose a safe destination before it disappears.

JULES: That's Episode 3 meeting Episode 4. Semantics must reflect the UI, and the interaction must preserve orientation.

PARISA: What about aria-selected versus aria-checked?

JULES: Selected describes selection in roles such as tabs and options. Checked describes a checkable control. For native checkboxes and radios, use their native checked state; the browser exposes it. Don't maintain a contradictory aria-checked beside it.

PARISA: And a toggle button can use aria-pressed, which isn't the same thing as a tab being selected. We should choose the interaction model first, then the state that belongs to it.

JULES: Exactly. The companion reference gives those distinctions without forcing everyone to memorize an attribute family reunion.

## Disabled, Current, and Other Nonmagical Claims

PARISA: Aria-disabled is one I see treated like native disabled. What's the difference?

JULES: It communicates that a control is unavailable. It doesn't itself stop clicks, key activation, form submission, or focus. Your implementation must enforce the unavailable behavior and style it understandably.

PARISA: Native disabled supplies native disabling behavior, including removing many controls from the normal tab sequence and affecting form submission. So they're not interchangeable shortcuts.

JULES: Keeping an unavailable action discoverable can sometimes be useful, with an explanation of what would enable it. That can justify aria-disabled on a suitable control, but you still have to block every activation path.

PARISA: CSS pointer-events none won't block keyboard activation. And neither kind of disabled control enforces authorization on the server.

JULES: Another useful attribute is aria-current. A navigation link can indicate the current page. A step indicator can indicate the current step.

PARISA: It doesn't navigate or change the selected tab. It identifies the current item within a set. Current page and selected widget option are different meanings.

JULES: And aria-controls identifies a controlled element but doesn't promise every assistive technology presents a convenient navigation shortcut for that relationship. Don't make the interface depend on such a shortcut being available.

PARISA: Useful information, not a teleportation service.

## Hidden from Whom?

JULES: Aria-hidden true excludes an element and its descendants from the accessibility tree. It doesn't visually hide them or remove them from keyboard focus by itself.

PARISA: So using it on a decorative icon inside a properly named button can prevent redundant information. Using it on the whole operable button creates a contradiction.

JULES: Exactly. Don't hide focusable controls or an ancestor containing them from assistive technology while they remain available to keyboard focus.

PARISA: A user arrives at a thing we've told their tools doesn't exist. Haunted focus.

JULES: And setting aria-hidden false on a child doesn't rescue it from an aria-hidden true ancestor. The hidden subtree relationship matters.

PARISA: If content should be unavailable visually and interactively, use the appropriate HTML or application mechanism. Hidden and inert have jobs distinct from aria-hidden.

JULES: Also, visually hidden text can intentionally remain available to assistive technology. That's different from display none, which ordinarily removes content from the accessibility tree too. Naming references have special rules, so inspect actual computed results when those mechanisms intersect.

PARISA: The DOM, visual rendering, accessibility tree, and focus behavior are connected. They are not one giant visibility switch.

## Changes People Didn't Ask to Focus

PARISA: Our customer adds a pizza. The basket count changes, but keyboard focus stays on Add. How do they learn that it worked without us throwing focus into the basket?

JULES: A live region can communicate an update. Aria-live polite asks for an announcement at an appropriate pause. Assertive asks for higher-priority interruption; exact behavior depends on the assistive technology.

PARISA: “Polite” doesn't mean a guaranteed queue with a delivery receipt.

JULES: Correct. A status role has implicit polite live-region behavior and is a good fit for nonurgent results. An alert has assertive semantics for urgent information. Don't make every basket update an emergency.

PARISA: Otherwise the screen reader spends the whole checkout interrupting itself about mozzarella.

[CODE CARD: HTML live region with an update after successful application work]
```html
<p id="cart-status" role="status"></p>
<script>
  function announceCartSuccess(itemName) {
    const status = document.querySelector("#cart-status");
    status.textContent = itemName + " added to cart.";
  }
  // Call after the application confirms the add operation succeeded.
</script>
```

JULES: The region exists before its text changes. That is more reliable than inventing a populated live region at the exact instant you want an announcement. The function doesn't actually add anything to the cart; it reports a confirmed result.

PARISA: Same for “Password copied.” Only announce success after copying succeeds. Don't expose the actual password in the message.

JULES: For loading results, a concise status like “Six delivery slots available” can be useful. Announcing the entire refreshed page is usually exhausting.

PARISA: And an error needs useful visible text too. An announcement can be missed. Leave information available so someone can find and review it.

JULES: Avoid stacking alert, assertive, and focus movement on the same routine event. Repeated identical messages and rapid updates need testing; announcements can be coalesced or omitted.

PARISA: Again, we're communicating a state change, not operating a guaranteed speech API.

## Diagnose the Meaning Before Adding an Attribute

PARISA: Can we do a little decision clinic? I want to hear how we'd reason through an existing component rather than start from perfect markup.

JULES: First case: three buttons across the top of a delivery panel. Today, Tomorrow, and Choose date. The developer added aria-selected to all three because one has a highlighted background.

PARISA: What does selecting one actually do?

JULES: Today and Tomorrow choose a delivery date. Choose date opens a date-selection control.

PARISA: Then the three things aren't necessarily one uniform tab interface. Two may be date choices and the third an action. We need to clarify the interaction before declaring all of them selected tabs.

JULES: So the highlight doesn't determine the role.

PARISA: Right. If these are mutually exclusive options for a form value, native radios might fit. If they genuinely switch panels in a tab interface, follow the tab pattern, including selection, relationships, and keyboard behavior. If one opens another interaction, identify that action honestly.

JULES: The browser needs a coherent model, not just an annotation describing our CSS class.

PARISA: Exactly. We can't repair an unclear interaction solely by finding an attribute whose English name sounds nearby.

JULES: Second case: a button says “Delivery details,” expands a panel, and then changes its aria-label to “Click to close the additional delivery details section.”

PARISA: That's a lot of instructions. A stable useful name plus expanded state often communicates the change more cleanly. Keep the visible and accessible naming aligned. Don't write a sentence that repeats the role, input method, and state unnecessarily.

JULES: And “click” assumes a particular method even though Enter and Space work too.

PARISA: Yes. A name should describe the action or object, not narrate a mouse tutorial. If changing the visible action text is appropriate, keep the accessible result consistent, but don't create a hidden alternate interface without a reason.

JULES: Third case: our checkout disables Place order until every field is valid. Someone wants aria-disabled so the button remains discoverable by keyboard.

PARISA: That's a valid design discussion, but first ask whether preemptively disabling submission is helping. If the person can't work out why it's unavailable, we may have hidden the error-recovery path they need.

JULES: Letting them submit and receive useful validation can be clearer in some forms.

PARISA: Exactly. If unavailability is necessary, explain it visibly. If we choose aria-disabled, block the operation in the application logic as well as communicating it. And don't rely on that client state for server enforcement.

JULES: So the attribute decision follows the feedback and behavior decision. It doesn't settle it.

PARISA: Fourth case, my turn. The same page has a basket icon next to visible “Basket” text. A screen reader repeats Basket twice.

JULES: Inspect the computed name and icon markup. If the icon is redundant decoration, hide that decorative part from accessibility exposure or use an empty image alternative as appropriate. Preserve the control's useful name from the visible text.

PARISA: Don't hide the entire link just because one child is noisy.

JULES: Exactly. Remove redundant information at its source without erasing the action. And don't assume an icon font's character will always be silent or meaningful.

PARISA: Fifth case: a filter updates the number of available delivery slots on every keystroke. The whole results panel has assertive live behavior.

JULES: That's likely far too disruptive. Keep typing focus where it belongs. Consider a concise polite status after a settled update, rather than announcing every result during every change. Test timing so stale responses don't announce obsolete counts.

PARISA: There's our ordinary application-state problem again. If an older request finishes after a newer one, accessibility information can be wrong even though the attributes are valid.

JULES: Yes. ARIA doesn't solve request races. The data and visible state must be correct first; then the announcement should reflect the actual result.

PARISA: Last case: a custom checkbox displays a checkmark, reports aria-checked true, but sends false when the form submits.

JULES: Then the application contradicts its own UI. Fix the shared state and submission path. Better yet, revisit whether a native checkbox would avoid maintaining parallel versions of the value.

PARISA: Good. The recurring question isn't “have I used ARIA?” It's “do meaning, behavior, visible state, and submitted data describe the same reality?”

JULES: And if they don't, more attributes can make the contradiction louder.

PARISA: Excellent. The incense has been removed from the component library.

## The Decision You Can Actually Reuse

JULES: Let's finish with a real decision process. Can native HTML express the thing correctly?

PARISA: Use it. Then ask whether any semantic information is still missing.

JULES: If yes, choose the specific ARIA role, state, name, description, or relationship that communicates it.

PARISA: Next: what interaction behavior remains our responsibility? Keyboard handling, focus, visibility, unavailable actions, whatever this component actually requires.

JULES: Then keep dynamic state synchronized and inspect what the browser exposes. Test the behavior with the input methods and assistive technology relevant to the interaction.

PARISA: And if I can't explain what an attribute accomplishes, I don't sprinkle it on and hope the accessibility total increases.

JULES: We have a practical guide in the companion: names versus descriptions, common states, live updates, hiding, and the native alternative to consider first.

PARISA: Today's “ohhh” is that ARIA communicates additional semantic information. It isn't an accessibility spell. But when information really is missing, it's exactly the tool I may need.

JULES: Next time, we challenge the other half of the interface: visual design. Correct semantics don't rescue text someone can't read or a form that disappears when enlarged.

PARISA: Our button has valid identification now. Next we check whether it's wearing camouflage.

[OUTRO MUSIC]

## Production References

- WAI-ARIA 1.2: https://www.w3.org/TR/wai-aria-1.2/
- W3C APG, Names and Descriptions: https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/
- W3C APG, Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- MDN, ARIA live regions: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
- W3C WAI, Label in Name: https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html
- Examples are original teaching fragments. The disclosure is a single component with unique IDs and script after markup; it assumes CSS preserves hidden behavior. Live-region example does not implement a cart, network request, or clipboard operation. Announcement behavior requires browser/assistive-technology testing.
