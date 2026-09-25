# Episode 1: Who Is This Actually For?

**Series:** Accessibility
**Runtime:** Target approximately 30 minutes; final timing depends on the recorded performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: I have brought us a completely ordinary checkout form.

JULES: That sounds suspiciously like the start of a horror story for web developers.

PARISA: Name. Address. Delivery instructions. Pay. No experimental navigation. No blockchain. Nobody has decided that buying a pizza should involve a three-dimensional hallway.

JULES: A restraint I appreciate.

PARISA: And yet we can make this ordinary form impossible to use in about seventeen different ways without introducing a single interesting feature.

JULES: Is seventeen a researched statistic?

PARISA: No. It's a threat from the design review.

JULES: Welcome to Okay, But Why?

PARISA: We're doing accessibility. We are not spending six episodes discovering that disabled people use computers. We know. We have built websites. Some of us have been yelling about labels since before our CSS had variables.

JULES: Today we're asking what we mean when we call an interface accessible. Then we'll spend the series connecting that to the machinery under the page.

PARISA: Including the machinery I already use but occasionally cannot explain beyond “please don't remove that; it's doing something important.”

[STING]

## One Checkout, Several Ways In

JULES: Let's keep the checkout. Nervous Robot Pizza Delivery, our fictional business with a surprisingly active architecture department.

PARISA: Nervous Robot would like people to obtain dinner without having to prove they operate a computer exactly like the designer.

JULES: What does someone need to accomplish?

PARISA: Understand what's in the order, provide delivery information, check the total, correct any mistakes, and place the order. Then know whether it worked.

JULES: That's already more useful than asking whether the page contains accessibility attributes.

PARISA: Because the task has an ending. If I can hear every label but can't place the order, we have not successfully delivered accessibility. Or pizza.

JULES: Now imagine one person uses a mouse and reads the screen at the default size. Another magnifies the page. Another uses a screen reader with a keyboard. Another uses voice commands. Another uses a switch device to move through choices.

PARISA: Same task. Different ways of receiving information and taking action. We don't need to make a separate pizza universe for each person.

JULES: Usually we want one interface that preserves multiple ways through. There can be preferences and alternatives, but the main service shouldn't assume a single combination of eyes, hands, hearing, memory, and timing.

PARISA: And those are not tidy user categories. Someone can magnify text and use speech output. Someone can use a mouse sometimes and a keyboard at other times. People are allowed more than one input device.

JULES: Their needs can also vary during the day. Fatigue, pain, lighting, and the task itself can change what works.

PARISA: Which means “but I saw them use a mouse yesterday” is not an accessibility finding. It's you being weird about somebody's mouse.

JULES: The practical question is where our design unnecessarily requires one particular ability or method.

PARISA: Unnecessarily matters. Entering a delivery address requires information about a location. It does not inherently require dragging a tiny pin while a countdown runs.

## Accessibility Is Not a Screen-Reader Synonym

PARISA: Screen-reader support tends to become the entire conversation because developers can point at markup and say, “This is the technical bit.”

JULES: And it is an important technical bit. But start with vision more broadly. Some people need larger text. Some need strong contrast. Some have a restricted field of view. Some use speech or braille instead of visual presentation.

PARISA: So “we added alternative text” doesn't answer whether the checkout survives magnification. Those are different barriers.

JULES: Hearing is another dimension. Suppose the only indication that our payment failed is a noise.

PARISA: A sad little cash-register sound. Very evocative. Absolutely useless if I can't hear it, have audio off, or don't know what it means.

JULES: Important audio needs an appropriate alternative. Captions make spoken video content and relevant sounds available as text. A transcript can provide another way to access material, especially audio-only material like this show.

PARISA: And captions should contain the actual meaning. Automatic captions that replace “do not submit” with “donut summit” have technically produced text and practically produced an event I want to attend.

JULES: Mobility and dexterity affect pointing, dragging, holding keys, and repeated actions. A tiny close button can be more than irritating. A control that requires precise movement can block the task.

PARISA: A person may operate a keyboard, an adapted keyboard, voice control, or switches. None of those is an inferior attempt at being a mouse.

JULES: Cognition and learning matter too. Dense instructions, inconsistent labels, disappearing context, or a complicated memory task can make a form difficult or impossible to complete.

PARISA: I can't fix that by attaching an invisible label saying “good luck.” The interaction itself needs attention.

JULES: Speech disabilities can become relevant when a service insists on voice input or a spoken verification step with no usable alternative.

PARISA: So voice control can be an access method for one person, while mandatory speaking is a barrier for another. That is a very good argument against declaring one technology the universal solution.

JULES: Motion can also create vestibular symptoms. Large moving backgrounds or simulated movement can cause discomfort, dizziness, or nausea. This isn't just someone finding our animation unfashionable.

PARISA: I may also find it unfashionable. But that's a separate complaint, and I can file it later.

JULES: These needs can overlap. We shouldn't design seven fictional people, give each exactly one disability, and call our understanding complete.

PARISA: Right. We're examining barriers, not collecting disability trading cards.

## Useful Overlap Without Equating Experiences

JULES: You've probably heard permanent, temporary, and situational limitations used together. Someone may have a long-term mobility disability, a broken arm, or one hand occupied carrying something.

PARISA: Those examples can reveal the same assumption in a control. It expects two hands or a precise gesture. But the experiences aren't equivalent.

JULES: Exactly. Carrying a shopping bag is not the same lived experience as a disability. The point is that flexibility can help in multiple circumstances, not that disability is basically an inconvenient Tuesday.

PARISA: Bright sunlight can make a low-contrast screen harder to read. That doesn't make low vision a weather condition.

JULES: A noisy room can make captions useful. That doesn't mean captions only deserve funding because hearing people sometimes use noisy rooms.

PARISA: This is where the “accessibility helps everyone” pitch can accidentally lose the plot. Broad usefulness is welcome. Disabled people don't need a bonus population to justify being able to order dinner.

JULES: And some accommodations may primarily help a particular group. That's still a valid reason to provide them.

PARISA: I want that to change how we discuss priorities. “Most users won't need this” isn't the same as “this isn't necessary.” Most users won't need the error recovery path either, until they do.

JULES: And an analytics system may not reveal people who couldn't get through the first step. Failure to complete can look like low demand when it's actually an access barrier.

PARISA: We built a locked door, measured how many people walked through it, and discovered the door is incredibly niche.

JULES: That's an excellent terrible research method.

## What Assistive Technology Is Doing Here

PARISA: Let's unpack the phrase assistive technology without turning it into an equipment catalog.

JULES: Tools that help someone perceive, navigate, or operate the interface. A screen reader can convey information through speech or a refreshable braille display. It supports navigation and interaction, not just continuous reading from the top.

PARISA: That distinction matters. I don't visually inspect every word on a familiar checkout. I find the relevant heading or field. Someone using a screen reader also needs ways to locate things efficiently.

JULES: Screen magnification enlarges a portion of the interface. That can make proximity important: a message far from the action might be outside the area someone is currently viewing.

PARISA: So an error toast in the top-right corner may be nearby in my full-screen view and practically in another county for someone magnifying the submit button.

JULES: Voice control can let someone activate a named control or dictate text. Clear, consistent labels help connect what they see with what they can say.

PARISA: And switch access can let someone move through or select options using a small number of inputs. Speed and precision assumptions become particularly obvious when each extra step costs effort.

JULES: Alternative keyboards and pointing devices are also part of the picture. We don't need to detect each device and invent a private interface for it. Supporting platform conventions is a major part of letting different tools cooperate.

PARISA: Captions, transcripts, and settings can be access features without being a separate device somebody buys.

JULES: Yes. And using assistive technology doesn't mean someone lacks technical expertise. A person can know far more about their tools than the developer who built the form.

PARISA: We should be especially suspicious when our product's idea of help is to explain the user's own technology to them while refusing to work with it.

JULES: The browser is part of this chain too. It interprets the page and exposes information other software can use. We'll get properly into that next episode.

PARISA: For now, the question we can carry is: what does the browser know right now? Not what did the designer intend. Not what can I infer from looking. What information did we actually provide?

## A Standard Is a Shared Set of Questions

JULES: Which brings us to WCAG: Web Content Accessibility Guidelines.

PARISA: Pronunciation varies. The important thing is that it's a standard, not a JavaScript library I'm about to install.

JULES: It's published through the World Wide Web Consortium, the W3C. For this series, our references use WCAG 2.2. We're not doing a complete conformance course. We want you to recognize the framework and know where to look up a specific requirement.

PARISA: Why have it at all? Because otherwise every review becomes “seems fine to me” versus “seems bad to me,” conducted by whoever has the loudest calendar invitation.

JULES: Shared criteria make requirements more concrete and testable. They give designers, developers, content authors, and evaluators common language.

PARISA: They also stop “accessibility” from meaning whichever two things the team remembers this week.

JULES: The principles are often summarized as POUR: Perceivable, Operable, Understandable, Robust.

PARISA: An acronym I can remember because the checkout has driven me to make coffee.

JULES: Perceivable asks whether people can receive the information. Our payment failure can't exist only as a sound, or only as a subtle color change.

PARISA: Operable asks whether people can use the controls and move through the task. A visible button that only responds to a precise pointer gesture has an operation problem.

JULES: Understandable concerns information and operation making sense. Instructions, predictable behavior, and help recovering from errors belong here.

PARISA: Robust asks whether the content can be interpreted reliably by the technologies people use, including assistive technology. If we communicate meaning in a way the platform understands, different tools have something dependable to work with.

JULES: Those principles are useful questions, not four isolated departments. One broken field can involve more than one.

PARISA: If an error is vague, only shown in red, and not associated with the field, it has generously distributed its problems across the framework.

## A, AA, AAA, and the Temptation of a Badge

JULES: You'll also see conformance levels A, AA, and AAA. They're increasing sets of requirements. Meeting AA includes the A requirements too.

PARISA: They aren't individual users' difficulty settings. Nobody signs into the internet as a Level Double-A Human.

JULES: And passing one criterion doesn't establish a conformance level for an entire page or process. There's a larger set of requirements involved in making that claim.

PARISA: We'll link the actual material. Nobody needs to memorize a list of criterion numbers while driving.

JULES: There's another distinction: conformance and usability aren't identical.

PARISA: A form can have labels and still ask for “delivery locus designation,” which is technically words and socially an act of aggression.

JULES: Or it can meet a minimum requirement and still impose unnecessary effort. Minimums are useful. They aren't a promise that every individual will have a good experience.

PARISA: I also don't want that distinction used to dismiss standards. “Usability is subjective, so we ignored the objective failures” is not the conclusion.

JULES: Right. Standards-based evaluation and observing actual use inform each other. Neither gives us permission to stop caring about the other.

PARISA: And this series isn't giving legal advice or a compliance certificate. It's giving developers a more accurate mental model and practical decisions they can apply while building.

JULES: The certificate printer was mostly jammed anyway.

PARISA: With divs.

## Walk the Task, Not Just the Happy Screenshot

PARISA: Let's actually walk our checkout. First, the customer needs to know what they're buying and the total.

JULES: If the order summary only appears on hover, that information depends on a particular interaction. If it vanishes when someone moves toward it, even pointer use can fail.

PARISA: Then the address. A label needs to remain understandable while entering information. Instructions should appear before they're needed, not after an error as a surprise qualification exam.

JULES: Suppose the form rejects the postal code. What does the person need now?

PARISA: Which field failed, what is wrong, and a useful route to fix it. Also their other information should still be there. Making someone retype everything is a choice, not a law of nature.

JULES: Now consider time. A person using switch scanning or reading carefully may need longer. An unexplained timeout can erase progress while they're still working.

PARISA: Security and access need to be designed together. If expiry is necessary, communicate it and consider warning, extension, and recovery. “Security” doesn't magically justify every hostile interaction we can imagine.

JULES: Then payment. A third-party component is still part of the customer's experience. They won't care that the inaccessible portion was technically supplied by a different company.

PARISA: Our implementation boundary is not their task boundary. That's a useful sentence for procurement meetings, unfortunately.

JULES: Finally, success. A tiny animation might signal completion visually, but the customer needs a reliable, understandable confirmation they can find.

PARISA: Otherwise they may submit again because they don't know whether the first attempt worked. Accessibility problems can turn into support problems and duplicate-action problems very quickly.

JULES: Notice we haven't written ARIA yet. We established the information and actions the journey needs to preserve.

PARISA: Which means later we can ask whether a technical choice accomplishes that. We have an actual reason for the attribute instead of a superstition.

## Asking Better Questions in a Review

JULES: Suppose a developer says, “I already use semantic HTML, labels, and decent contrast. What do I do with this episode?”

PARISA: Keep doing those things. Then inspect the assumptions between them. Can someone complete the whole task using a different input method? Can they find a change without watching one specific corner? Does recovery require memory we could have avoided demanding?

JULES: And distinguish the known from the assumed. “We tested the shipping form with a keyboard” is useful evidence. “It should work with everything” is a hopeful weather forecast.

PARISA: If we work with disabled users, ask about the task and barriers, not for someone to represent every disabled person alive. Respect their expertise and time.

JULES: A developer briefly trying a screen reader is useful learning. It does not turn them into an experienced screen-reader user, and it doesn't replace involving people who use these technologies regularly.

PARISA: We'll return to testing in the finale. For now, I want accessibility in the acceptance criteria before we've spent a week making the wrong interaction look expensive.

JULES: What would that sound like for our checkout?

PARISA: “Customers can review the total, enter and correct delivery information, submit using supported input methods, and understand the result.” Then we identify concrete checks as the implementation takes shape.

JULES: More informative than “make accessible” at the bottom of the ticket.

PARISA: That phrase has the same energy as “ensure good.” A noble ambition. Not yet a requirement.

## The Requirements Meeting Before the Mockup

JULES: Let's try a scene before anyone has built our checkout. We're reviewing the requirements, and someone says the delivery address can be confirmed only on an interactive map.

PARISA: I ask what information we actually need. A deliverable address? An optional pin for an unusual entrance? Those are related, but they aren't the same requirement.

JULES: The team says the map feels easier than typing.

PARISA: For whom? It can be easier for some people. That doesn't establish that dragging a pin should be mandatory. Keep a usable address-entry route and consider the map an additional way to refine the location when helpful.

JULES: So we haven't banned the map. We've separated the goal from one method of achieving it.

PARISA: Exactly. Next, the design says the customer has ten seconds to review the total because we want to create urgency.

JULES: That is not an essential technical constraint.

PARISA: Correct. It's a conversion idea with a human cost. People may need time to read, navigate, translate, understand, or correct information. We should question the timer before discussing how to announce it.

JULES: That's a distinction I like. An implementation can communicate a bad constraint perfectly, and the constraint still blocks people.

PARISA: Yes. We can announce “you have five seconds left” in a technically excellent way while making the task unnecessarily difficult. Accessibility isn't limited to making every existing product decision audible.

JULES: Third requirement: the only customer-support option is a phone call.

PARISA: Again, who does that exclude? Someone may not be able to hear or speak on the phone, or may need written communication. If the support path is necessary to resolve a failed order, that path belongs in our accessibility thinking too.

JULES: But we said this isn't a whole operations course.

PARISA: It isn't. We simply need to notice when the proposed recovery route assumes another ability. Writing “call us for help” doesn't erase a broken online task, and we shouldn't quietly label the problem solved.

JULES: Fourth requirement: address suggestions should appear automatically as someone types. That could help reduce typing.

PARISA: Potentially useful. But people must understand the suggestions, operate them, and enter a legitimate address the suggestions don't recognize. Convenience shouldn't become a gate that rejects reality.

JULES: So we preserve an understandable manual path and later inspect the suggestion control's interaction.

PARISA: Right. We are not implementing a combobox today. We're recording the requirement that someone can provide their actual address without being forced to select an incorrect guess.

JULES: Last requirement: successful payment shows a green checkmark for two seconds, then returns to the home page.

PARISA: The customer needs confirmation they can find and understand. Give them an order reference and relevant next steps in a persistent place. If they look away for two seconds, dinner shouldn't become a mystery.

JULES: I'm noticing that none of those questions depended on knowing an ARIA attribute.

PARISA: That's the point. We can identify information and interaction needs before choosing implementation. Then HTML, CSS, JavaScript, and testing have specific jobs to do.

JULES: How would you write the meeting notes without inventing a huge accessibility bureaucracy?

PARISA: A short statement per decision. Address can be entered without dragging. Review doesn't impose an unnecessary countdown. Confirmation remains available. Support and error recovery don't rely on a single communication method. Suggestions don't prevent manual correction.

JULES: Those sound like product requirements because they are product requirements.

PARISA: Yes. They can sit beside “show the delivery fee before payment.” We don't need an accessibility annex nobody opens until the week before launch.

JULES: What if a requirement turns out to be expensive?

PARISA: Understand why. Sometimes the accessible path is simpler: a normal form, a persistent message, fewer animation states. Sometimes there is real work. Discuss the impact and options with evidence instead of treating exclusion as a free default.

JULES: And don't promise that one alternative works for everyone.

PARISA: Exactly. We can make a useful decision without claiming universal success. Then we validate it with actual use and update when evidence shows a gap.

JULES: This makes the series' technical material feel less like a checklist dropped from the sky. We're about to learn how to fulfill promises we already understand.

PARISA: That's what I want. I care about semantic HTML because it helps deliver information and behavior. I care about testing because a person needs the outcome. The attributes are means, not the reason the checkout exists.

JULES: The reason is pizza.

PARISA: Finally, a requirement with stakeholder alignment.

## The Platform Has Already Started the Work

JULES: Our series thesis is that accessibility isn't an extra feature we glue onto the finished website. The platform already contains machinery that our choices can preserve, improve, or break.

PARISA: We don't have to implement every assistive technology ourselves. We do need to communicate useful information and respect the interaction conventions that let those technologies work.

JULES: Next episode starts from something developers already know: the DOM. Then we ask what information the browser derives from it for accessibility.

PARISA: Which is the deeper answer to a rule I've followed for years: use the right HTML element. I know a button is the right starting point. I want to follow what the browser does with that choice.

JULES: After that we'll cover keyboard and focus, practical ARIA, visual design, and testing.

PARISA: Six episodes. No exam where you identify every success criterion by smell.

JULES: What's today's “ohhh”?

PARISA: Accessibility means not unnecessarily requiring one particular way of perceiving, understanding, or operating an interface. The task matters. The person gets to bring their way of using the web.

JULES: And our checkout needs to support that journey through errors and success, not just pose for a screenshot.

PARISA: Nervous Robot would like to deliver a pizza. The three-dimensional hallway has been cancelled.

JULES: What will the design review do now?

PARISA: Label the address field. We have a thrilling quarter ahead.

[OUTRO MUSIC]

## Production References

- W3C WAI, Introduction to Web Accessibility: https://www.w3.org/WAI/fundamentals/accessibility-intro/
- W3C WAI, Diverse Abilities and Barriers: https://www.w3.org/WAI/people-use-web/abilities-barriers/
- WCAG 2.2 reference: https://www.w3.org/WAI/WCAG22/quickref/
- Editorial continuity: Nervous Robot Pizza Delivery remains fictional; Nervous Robot uses they/them. Parisa already practices accessibility. No new disability or biographical history is assigned to any host.
- Scope: conceptual introduction; accessibility-tree mechanics, ARIA implementation, contrast values, and testing products belong in later episodes.
