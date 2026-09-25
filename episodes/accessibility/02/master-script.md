# Episode 2: HTML Was Already Doing This

**Series:** Accessibility
**Runtime:** Target approximately 30 minutes; final timing depends on the recorded performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

JULES: I have two buttons.

PARISA: Excellent. A manageable episode.

JULES: Same dimensions. Same color. Same text. Same little shadow.

PARISA: One of them is a div, isn't it?

JULES: This was supposed to be a reveal.

PARISA: I have worked on websites. The div is wearing a button costume and hoping nobody asks for identification.

JULES: They both respond when I click them.

PARISA: So we've established they work for your finger attached to your mouse. What does the browser think they are?

JULES: That's today's question.

PARISA: Good. Because I already know which one I'd choose. I want to understand what happens after that choice leaves my editor.

[STING]

## From the DOM to Another View of the Page

JULES: Welcome to Okay, But Why? Last time we looked at different ways through the same checkout. Today: why does choosing the right HTML element matter when CSS can make almost anything look like almost anything?

PARISA: Starting with the DOM, which we already know. The browser parses our HTML into a document structure. JavaScript can inspect and change that structure.

JULES: Right. Elements, attributes, text, relationships. The browser also calculates style and layout. But the pixels aren't the only useful output.

PARISA: Because another application can't reliably infer “this blue rectangle places an order” from its excellent border radius.

JULES: Browsers derive accessibility information and expose it through platform accessibility APIs. A useful mental model is an accessibility tree: a structured view containing relevant objects and information about them.

PARISA: Role, name, state, that sort of thing?

JULES: Exactly. What something is, what identifies it, whether it's checked or expanded, and how it relates to other information. We'll go deeper into names and ARIA later. For now, HTML already supplies a lot of those ingredients.

PARISA: So the DOM is not literally handed to a screen reader as a bag of tags and a note saying “you work it out.”

JULES: Correct. The browser does interpretation. Assistive technology uses what the browser exposes, through the operating system's interfaces and other integration mechanisms. The exact implementation varies, but that separation is the important part.

PARISA: This is an API problem, in the useful sense from our earlier series. Another system needs information in a form it can understand. Our page isn't only communicating with eyeballs.

JULES: And that information can support speech, braille, navigation, and interaction. A screen reader isn't simply an audio recording of the rendered page.

PARISA: Which explains why preserving structure matters even when the page looks unchanged. I've altered an interface consumed by other software.

## Related Trees, Different Jobs

PARISA: Is the accessibility tree a copy of the DOM with friendlier names?

JULES: No. It's derived from the document and other browser information. Some DOM elements are only layout containers and may not appear as meaningful objects. Hidden content is often excluded. Native controls may expose structure that doesn't correspond neatly to the markup you wrote.

PARISA: So three nested wrappers for layout don't necessarily become three things a screen reader announces.

JULES: Right. And CSS isn't irrelevant. Display and visibility can affect whether content is exposed. But a CSS class called primary-button doesn't assign button semantics.

PARISA: The browser doesn't read our naming convention as a declaration of purpose. Otherwise half the web would have the role “temporary fix final two.”

JULES: Please don't make that a specification proposal.

PARISA: Too late. I have a committee.

JULES: Imagine a simple order summary. A heading, a list of pizzas, a delivery link, and a place-order button. The accessibility view can communicate those meaningful structures while ignoring wrappers that exist to align the total.

PARISA: And if JavaScript changes the button's state, the browser can expose updated information. This is a living interface, not a document exported once at page load.

JULES: Yes. Though how and when updates are announced depends on the change and the assistive technology. Merely altering text doesn't guarantee an announcement at the moment you wanted.

PARISA: We'll save the “why didn't it announce?” spiral for ARIA. Today I just want to know that the information exists and where it came from.

## The Two Visually Identical Checkouts

JULES: Version A of our checkout uses a div styled as a heading, spans styled as field labels, a clickable div for payment, and another clickable div that navigates to delivery information.

PARISA: Version B uses a heading, associated labels, a button, and a link with a destination. Same visual design.

JULES: Here's a deliberately incomplete fragment from A, then a native version of the control choices in B.

[CODE CARD: HTML comparison — the first fragment is intentionally inaccessible]
```html
<!-- Problem: appearance and a click handler do not supply native behavior. -->
<div class="page-title">Checkout</div>
<span>Delivery name</span>
<input id="delivery-name-bad">
<div class="button" onclick="placeOrder()">Place order</div>

<!-- Native structure: handler and server-side order processing are separate. -->
<h1>Checkout</h1>
<form action="/orders" method="post">
  <label for="delivery-name">Delivery name</label>
  <input id="delivery-name" name="deliveryName" autocomplete="name" required>
  <a href="/delivery">Delivery information</a>
  <button type="submit">Place order</button>
</form>
```

PARISA: For listeners: the first version only places words near a field and draws a button shape. The second explicitly associates the name label with the input, uses a real link for navigation, and uses a submit button in a form.

JULES: The example endpoint is fictional. Real order processing still needs server validation and all the payment and security work. The point here is what HTML supplies before our application code adds anything.

PARISA: The second version gives the browser useful facts. This is a heading. This label belongs to this field. This link has a destination. This control submits this form.

JULES: It also gives behavior. The native button participates in expected keyboard interaction. The link supports familiar navigation actions. The label can enlarge the practical click target by activating the associated control.

PARISA: That's a surprisingly large inheritance for changing a few tag names.

JULES: It isn't complete accessibility, though. We can still write confusing labels, break the layout, remove focus indicators, or process errors badly.

PARISA: Native HTML is a strong starting contract. It isn't a force field around the rest of our decisions.

## A Button Does Something; a Link Goes Somewhere

PARISA: Let's separate buttons and links, because visual design systems keep making them both look like rounded rectangles and hoping nobody notices.

JULES: A link with an href navigates to a resource or location. A button triggers an action. Save, expand, submit, open a dialog.

PARISA: If “Delivery information” takes me to another page, it should be a link. If “Show delivery options” expands something here, a button is a likely fit.

JULES: And if the application handles navigation client-side, a real link can still represent that destination. Your router should preserve useful browser behavior, including modified clicks and opening a new tab.

PARISA: The address bar didn't become an obsolete accessory because we installed a framework.

JULES: Native buttons activate with Enter and Space. Links normally activate with Enter; Space generally scrolls the page instead. Those differences reflect established interaction patterns.

PARISA: Which is why “make every element respond to every key” isn't the solution. Users have expectations. We'll do the keyboard episode next.

JULES: There's also the default button type inside a form. If a button is only opening delivery details, explicitly use type button so it doesn't accidentally submit.

PARISA: A tiny attribute with a very large ability to prevent “why did my order submit when I opened the coupon panel?”

JULES: And if a link has no real destination and only runs an action, that's worth reconsidering. A fake href can produce unexpected jumps or browser behavior you then spend code trying to suppress.

PARISA: We should choose the element from what it does, then style it. The screenshot is not the specification.

## Headings Are Navigation, Not Font Sizes

JULES: Let's move from controls to page structure. What does a heading give us beyond bold text?

PARISA: A statement about the content hierarchy. Checkout is the page's main subject. Delivery details and Order summary are sections. Their headings should express that relationship.

JULES: Screen-reader users can navigate by headings or inspect a heading list. That can make a long page manageable without reading everything from the beginning.

PARISA: Similar to how I visually scan for the part I need. We shouldn't require linear reading just because the presentation method differs.

JULES: A large paragraph styled like a heading may look right but doesn't necessarily participate in that navigation. Conversely, making something a heading solely to obtain a font size invents structure that doesn't exist.

PARISA: Use CSS for font size. Use heading levels for hierarchy. This was a good idea when I learned HTML and remains a good idea while my editor asks me to update fourteen extensions.

JULES: Heading text matters as much as heading elements. “More” and “Other” don't help someone choose between sections if they lose the surrounding visual context.

PARISA: “Payment details” tells me where I'm going. “Let's finish this!” tells me the copywriter needs a holiday.

JULES: Lists do similar structural work. A group of delivery steps or basket items can be exposed as a list, rather than unrelated paragraphs with decorative bullets.

PARISA: The grouping is information. We shouldn't accidentally discard it because the visual version still looks grouped.

## Landmarks Are Places, Not Confetti

JULES: Navigation and main content also have native elements. Nav identifies a navigation section. Main identifies the primary content.

PARISA: Which lets someone bypass repeated material and orient themselves. Particularly useful when the top of every page has an ambitious navigation bar.

JULES: We still need judgment. Not every group of links needs its own navigation landmark. Not every wrapper should become a named region.

PARISA: If everything is a landmark, the map is just shouting.

JULES: If you have multiple navigation landmarks, meaningful distinct names can help tell them apart. “Primary” and “Account,” for example. ARIA can provide those names; we'll unpack that mechanism in Episode 4.

PARISA: And a form element doesn't automatically guarantee a useful named form landmark in every situation. We need to distinguish the element's form behavior from how a region is exposed for navigation.

JULES: Exactly. A suitably named form can provide a landmark, but don't add names to every form just to increase the landmark count. Inspect the result and consider whether it's helpful.

PARISA: This is where browser inspection can answer what the browser actually exposed. We don't have to infer everything from remembering a table of elements.

JULES: One of the pleasures of understanding the tree is that it gives you something to investigate. “The screen reader was weird” becomes a more concrete question about role, name, state, or structure.

## A Label Is a Relationship

PARISA: I want to spend a minute on labels, because developers can know “inputs need labels” without following why visual proximity isn't enough.

JULES: A sighted person might infer that the words above a box describe it. The browser needs a programmatic association to communicate that reliably.

PARISA: With an explicit label, the label's for attribute points to the input's id. Those two values connect the elements.

JULES: The name attribute does a different job. It identifies the field in submitted form data. Matching a label's for to the name instead of the id doesn't establish the relationship.

PARISA: Same field, two distinct concerns. Browser semantics and form submission are not playing a casual matching game.

JULES: You can also nest an input inside its label, an implicit association. Both patterns are useful. Explicit associations can be especially clear when layout separates the label and control.

PARISA: And IDs need to be unique. A reusable component that renders the same id six times can produce a relationship to the wrong control even though every individual snippet looks reasonable.

JULES: Frameworks can help generate IDs, but a framework doesn't change the requirement. Inspect the rendered DOM, not just the component's intentions.

PARISA: Placeholder text isn't a substitute. It disappears as I type, may have poor contrast, and isn't a persistent visible label. We'll connect that to design in Episode 5.

JULES: For groups, fieldset and legend communicate shared context. “Delivery method” can label a set of radio choices like collection or delivery.

PARISA: Without group context, hearing “Collection, radio button” may leave me asking what I'm collecting. With context, the individual option makes sense.

JULES: Radio buttons with the same name also give us native mutually exclusive selection behavior. Again: information and behavior working together.

## Tables When Things Are Actually Tabular

PARISA: I feel an ancient argument approaching.

JULES: Layout tables?

PARISA: We'll keep it brief. Tables for actual tabular data are useful. Tables used to position the entire page confuse structure and layout.

JULES: Suppose our delivery fee comparison has columns for area and price. The relationship between row and column is the point. Table headers can make those relationships available beyond visual alignment.

PARISA: A grid of divs may look identical but requires us to rebuild information we already had a native vocabulary for.

JULES: Use a caption when it helps identify the table, and real header cells for row or column headings. Complex tables require more care, but we don't need a complex table to present three delivery areas.

PARISA: Nor do we need to turn every product card layout into a table. The question is whether rows and columns express data relationships, not whether the CSS happens to use Grid.

JULES: CSS Grid is a layout system. An HTML table is semantic structure for tabular data. Similar-looking arrangements, different jobs.

PARISA: This is the recurring problem in miniature. Appearance isn't meaning. We can align paragraphs into columns without making them a spreadsheet.

## Browser Defaults Are Someone Else's Maintained Work

JULES: Why do teams replace native controls so often?

PARISA: Styling. Inconsistent appearance. A design that genuinely needs a different interaction. Sometimes historical limitations. Sometimes somebody wanted a custom select and didn't notice they'd adopted a second profession.

JULES: Native selects can have platform-specific presentation, which may be inconvenient for visual uniformity but familiar to users. Replacing one means owning keyboard behavior, focus, state, naming, and interaction with assistive technology.

PARISA: Plus touch behavior, high-contrast situations, long option text, and whatever the browser team already spent years discovering.

JULES: That doesn't mean custom controls are forbidden. It means their cost includes responsibilities that aren't visible in the mockup.

PARISA: If a well-maintained component library supplies the control, we still need to verify our integration. We can give an accessible component a useless name or break it with styling.

JULES: Or use the component for the wrong task. An application menu is not automatically the right structure for ordinary website navigation just because both are called menus in design meetings.

PARISA: Words in meetings are weakly typed.

JULES: Extremely.

PARISA: The older-web lesson isn't “never use JavaScript.” It's “know what you're replacing.” I have happily written JavaScript for decades. I would just prefer not to rebuild a button on a Wednesday.

## Follow One Change Through the Browser

JULES: Let's do a mental debugging pass. Our place-order control looks fine, but someone says they can't find it among buttons with their screen reader.

PARISA: First, inspect what rendered. Not the React component named Button. The actual element.

JULES: It's a div with a click listener.

PARISA: Then the role problem is unsurprising. The browser wasn't told this is a button. The component's name exists in our code, not as a promise to assistive technology.

JULES: We replace it with a native button and keep the same class. Now the browser exposes button semantics and supplies the usual interaction.

PARISA: But the text is only a decorative shopping-bag icon. We still need an appropriate name. That leads to Episode 4, not an automatic claim that all problems are fixed.

JULES: Suppose it does have visible text, “Place order,” and we can reach it with the keyboard. We inspect the computed name and role to see what the browser derived.

PARISA: Then actually activate it and verify the task. A perfect button that runs a broken handler is still a broken checkout.

JULES: That separation helps debugging. Semantics, interaction, application result, and feedback are related but independently breakable.

PARISA: Which is far more useful than arguing whether the page “has accessibility.” We can identify what information or behavior is missing.

JULES: And when the result differs between browser and assistive-technology combinations, we have a narrower example to investigate rather than a whole application of mystery.

## The Delivery Choices, Rebuilt Without Guesswork

PARISA: Let's do one more practical comparison. Our checkout has two options: delivery and collection. In the first design they're styled cards. Clicking a card changes its background.

JULES: Visually, one is selected. Underneath, we have two divs, a selected class, and a hidden input somebody updates manually.

PARISA: This is the moment to ask what interaction we actually have. One choice from a small group, with a name for the group and a label for each choice.

JULES: Which sounds remarkably like radio buttons.

PARISA: Precisely. Put native radios in a fieldset, give the group a legend like Delivery method, and label the choices. We can still style the surrounding labels as cards while preserving the actual controls.

JULES: The shared name makes the native radio group mutually exclusive. The checked state gives the browser information, and the browser supplies the expected keyboard behavior.

PARISA: Now we don't need a hidden field whose value can disagree with the selected class. The input is the data-bearing control.

JULES: There's still a styling trap: if we hide the real radio with display none and make only the card clickable, we can remove the control from the very interaction path we meant to preserve.

PARISA: So style deliberately. Keep the native control available, or use an established visually hidden technique carefully, with a visible focus treatment on the presented choice. Then test. “Native somewhere in the DOM” is not enough if our CSS makes it unusable.

JULES: Suppose the delivery option also has supporting text about the delivery window. Does all of that have to become the radio's name?

PARISA: Not necessarily. The name should identify the option. Supporting details may be a description. That leads into our ARIA episode, where we'll distinguish identification from explanation instead of making every label a paragraph.

JULES: Good. Now the order summary. The original design is a series of text nodes separated by line breaks: margherita, garlic bread, sparkling water.

PARISA: If those are the basket items, a list communicates grouping. Each item can include quantity, price, and an appropriately named Remove control.

JULES: Do we need a table instead?

PARISA: Depends on the information. If the user is comparing a set of values across columns, a table may express useful relationships. If each item is a self-contained card, a list may be clearer. We choose from the content, not from whichever tag feels most accessible today.

JULES: And if it's a table, use headers. Column alignment in CSS isn't itself a programmatic connection between Price and the numbers below it.

PARISA: Exactly. Think about receiving one data cell without the visual row and column context. Which labels make its meaning recoverable?

JULES: That's useful beyond screen-reader output. We are explicitly describing relationships the design already relies on.

PARISA: Now a tricky one: the whole basket item is clickable to edit, and it contains a Remove button.

JULES: We shouldn't simply wrap an interactive control inside another interactive control.

PARISA: Right. Avoid conflicting nested activation. Provide a clear edit link or button and a separate remove button with meaningful names. The visual card doesn't need to become one enormous ambiguous control.

JULES: So some accessibility fixes require revisiting interaction design, not exchanging one div for another tag and hoping the nesting becomes legal.

PARISA: Yes. Native first is a decision method, not a search-and-replace operation. Meaning, structure, and behavior have to agree.

JULES: Last question: our frontend component is called DeliveryCard. Does the component need to expose all of this to its caller?

PARISA: It needs a clear contract. Maybe the component owns the radio and label relationship and accepts the option text and value. But the rendered HTML must still fit into the group correctly. Encapsulation should preserve semantics, not conceal whether they exist.

JULES: So in code review we can inspect the actual output for one instance and for several instances. Unique IDs, sensible grouping, correct selected state, usable labels.

PARISA: Yes. That's more durable than saying “we used the accessible component.” The component can help establish the contract, and our usage must still honor it.

JULES: I like how ordinary this solution is. Radios, labels, lists, maybe a table. The visual design can remain polished.

PARISA: Semantic HTML isn't a request to make the site look like a browser from 1998. Though I could provide references.

JULES: Please don't bring back the tiled background.

PARISA: It had excellent enthusiasm. Variable contrast, admittedly, but excellent enthusiasm.

## HTML Was Doing Work Before We Arrived

PARISA: Here's my takeaway: semantic HTML isn't accessibility decoration. It's how we give the browser meaning it can pass to other systems, often with useful behavior already attached.

JULES: And the accessibility tree helps explain why two visually identical interfaces can provide very different experiences.

PARISA: I'm not choosing a button because an accessibility checklist likes buttons. I'm choosing it because it describes the operation and gives the platform a chance to do its job.

JULES: Then we verify the rest: name, state, behavior, presentation, and the actual task.

PARISA: The native element is the beginning of the explanation, not the end.

JULES: Next time we put the mouse away and follow focus through our checkout.

PARISA: Temporarily. The episode title is Throw Away Your Mouse, but please don't create electronic waste for a pedagogical bit.

JULES: Put it somewhere inconvenient.

PARISA: Like underneath the component library's documentation.

JULES: Harsh.

PARISA: Affectionate. Now show me what your second button is made of.

JULES: An actual button.

PARISA: Okay. That's actually pretty cool.

[OUTRO MUSIC]

## Production References

- MDN, Accessibility tree: https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree
- MDN, button element: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button
- W3C WAI, Labeling Controls: https://www.w3.org/WAI/tutorials/forms/labels/
- W3C WAI, Page Structure Tutorial: https://www.w3.org/WAI/tutorials/page-structure/
- W3C WAI, Tables Tutorial: https://www.w3.org/WAI/tutorials/tables/
- Code boundaries: first fragment is intentionally broken; placeOrder and /orders are illustrative application boundaries, not a runnable payment implementation. Native form submission does not replace server-side validation, authorization, CSRF protection, or payment handling.
- Continuity: builds on Episode 1's multiple interaction methods and the earlier API distinction. Accessible-name precedence and live updates are reserved for Episode 4.
