# Episode 1: Why Are We Testing Code That Already Works?

**Series:** JavaScript Testing • Episode 1 of 10
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — I Clicked It

[INTRO MUSIC]

PARISA: The button works.

JULES: Excellent. How do we know?

PARISA: I clicked it. A pizza appeared in my basket. I removed the pizza. I put the pizza back because that felt unnecessarily hostile.

JULES: And after we change the delivery fee?

PARISA: I click it again.

JULES: And after we change the discount? And when somebody changes the cart while you're on holiday?

PARISA: They can click it. I do not personally own the clicking franchise.

JULES: Welcome to *Okay, But Why?*. We're starting JavaScript Testing with the question that gets skipped when a tutorial opens by installing four packages.

PARISA: Why am I writing code to check code that I have already seen working?

JULES: Because we'd like to keep checking certain things without requiring a human to remember every previous incident.

PARISA: Fine. But if this turns into making a green progress bar happy, I'm leaving.

## A Memory We Can Run

JULES: Let's return to our fictional Nervous Robot Pizza Delivery. A customer chooses pizzas, sees a total, and places an order. You've checked that journey manually. That is evidence.

PARISA: Thank you. Sometimes testing discussions make it sound as though using the actual website is embarrassing peasant behavior.

JULES: It isn't. You notice things an automated check may never have been instructed to notice. Confusing wording. A keyboard trap. An error that technically appears but makes no human sense.

PARISA: The order button that runs away when the error message makes the layout jump. I have met that button. We are enemies.

JULES: Automated tests let us repeat selected checks. Given this starting situation, do this thing, then compare what happened with what we expected.

PARISA: Starting situation, action, observation. That's a test whether a person does it or a program does it.

JULES: Yes. Automation makes some checks repeatable and relatively cheap to rerun. It doesn't automatically make them good checks.

PARISA: A photocopier will reproduce a terrible memo with admirable consistency.

JULES: Exactly. The judgment is deciding what matters and what observation would tell us it broke. The computer handles repetition.

PARISA: So the value isn't that machines have superior pizza judgment. It's that I can store a specific expectation somewhere other than my tired brain.

JULES: A memory we can run. And share with the next person working on the code.

## The Bug That Came Back

PARISA: Give me the incident that pays for this.

JULES: Our fictional delivery rule says orders with a subtotal of at least twenty dollars get free delivery. Below that, delivery costs three dollars. We're using dollars and whole cents for this teaching example, with no tax, discount, or geographic complications yet.

PARISA: At least twenty. So twenty itself qualifies.

JULES: Somebody writes greater than twenty. Nineteen dollars gets a fee. Twenty-one gets free delivery. Their two manual checks pass. Exactly twenty is wrong.

PARISA: A boundary bug. Not an exotic computer science problem. A very ordinary misunderstanding represented by one character.

JULES: We fix it. Six months later somebody rewrites the calculation and makes the same mistake. A regression is behavior that used to work becoming broken again after a change.

PARISA: Which doesn't have to mean literally the same line came back. We lost the promised behavior.

JULES: Right. A regression test records that example: a subtotal of two thousand cents should have a zero-cent fee. Each time we run the test, it asks whether that promise still holds.

PARISA: It won't discover every pricing bug. It remembers this one.

JULES: And a small family of nearby examples can remember the rule more clearly than the single incident. Below the threshold, exactly at it, above it.

PARISA: That is already more useful than “test returns something.” A wrong price is also something. Sometimes it's an excitingly large something.

## Before the Testing Framework Arrives

JULES: We can demonstrate the idea using ordinary JavaScript before choosing a test runner.

PARISA: Good. Let the concept enter the room before its luggage.

[CODE CARD: Plain JavaScript — one executable check]
```javascript
function deliveryFee(subtotalCents) {
  return subtotalCents >= 2000 ? 0 : 300;
}

const actual = deliveryFee(2000);
if (actual !== 0) {
  throw new Error(`Expected free delivery; received ${actual} cents`);
}
```

JULES: We call a function with two thousand cents. It returns the fee. If the fee isn't zero, we throw an error that describes the disagreement.

PARISA: None of that is testing-specific syntax. The function, constant, comparison, and thrown error are JavaScript.

JULES: Correct. The question mark and colon are JavaScript's conditional operator. Here they mean return zero if the threshold is met; otherwise return three hundred. We could write the same decision using an if statement.

PARISA: And the backticks make a JavaScript template literal. The dollar-and-braces part inserts the actual value into the message. It isn't the test runner issuing a tiny invoice.

JULES: This check doesn't need a framework to be a check. But if we have fifty checks, we'll want useful reporting, separate names, setup, and a way to keep running after one fails.

PARISA: Our primitive version stops at the first uncaught error. Useful proof of the idea; inconvenient test-suite receptionist.

JULES: That's part of why test runners exist. We'll separate their responsibilities in Episode Four. Today, notice that a test runs some real code and compares its behavior with an expectation.

PARISA: The important sentence is “two thousand qualifies,” not which package printed the failure in red.

## Who Decides the Answer?

PARISA: There's an obvious problem. I wrote the function. I wrote the test. If I misunderstood the delivery policy, I can be wrong in stereo.

JULES: Yes. The source of the expected answer is sometimes called a test oracle. That doesn't mean mystical software that knows truth. It means our basis for deciding whether the result is right.

PARISA: In this case, the agreed pricing rule and worked examples. Preferably confirmed with whoever owns that rule.

JULES: Exactly. A test can faithfully enforce the wrong requirement. Or we can accidentally calculate the expected answer using the same faulty logic as the application.

PARISA: So I shouldn't say, “Expected is whatever this other copy of my fee function says.” That's two interns checking each other's imaginary homework.

JULES: Work out a concrete answer independently. For exactly twenty dollars, the rule says free delivery. We can write zero explicitly.

PARISA: Hard-coded test data isn't automatically bad. Sometimes the visible literal is the explanation.

JULES: Yes. Later we can use properties and generated examples for broader exploration, but those still need meaningful properties. A computer cannot infer our business intent from enthusiasm.

PARISA: It can infer it from a meeting transcript only as badly as the rest of us.

JULES: A useful test discussion might reveal the requirement isn't settled. Does the threshold use the subtotal before discounts or after discounts? Do delivery orders and pickup orders behave differently?

PARISA: Then the test is helping us ask the question. It isn't permission to silently pick an answer and convert it into company policy.

## A Passing Test Makes a Small Claim

JULES: Let's read the green result carefully. This implementation produced the expected output for these inputs in this environment during this run.

PARISA: That is a much smaller sentence than “the website works.”

JULES: Much smaller. A fee function test doesn't prove the interface displays the fee. It doesn't prove the server uses the same rule. It doesn't prove the customer can reach the checkout with a keyboard.

PARISA: It also doesn't prove that a browser-submitted total should be trusted. A customer can modify their request regardless of our beautifully tested JavaScript.

JULES: Correct. The server remains responsible for authoritative pricing and validation. Tests should check that responsibility at the server boundary too.

PARISA: Good. Accessibility and security haven't been promoted to magical consequences of having tests.

JULES: They're things we make specific checks for, combined with review and other forms of evaluation. We might automate a permission-denied case or check that a form field has an accessible name.

PARISA: And then acknowledge what those checks don't cover. One denied request isn't a complete authorization review. One label isn't an accessible checkout.

JULES: That limitation doesn't make the checks worthless. It makes their scope important.

PARISA: A smoke alarm doesn't cook dinner. I still want the smoke alarm.

## The Refactor We Can Explain

JULES: Suppose our fee logic is spread through a long function. We want to extract it into a smaller function without changing what customers pay.

PARISA: That's refactoring: changing internal structure while preserving the behavior we mean to preserve. Not sneaking a new pricing model in under a reassuring commit message.

JULES: We establish tests for the relevant behavior first. Then change the structure. If the same checks pass, we have evidence we preserved those cases.

PARISA: Evidence, not a force field. But better than crossing my fingers while moving twelve conditions.

JULES: Exactly. Good tests can reduce the effort required to make a change responsibly. Badly coupled tests may fail whenever we rename a helper, even though the output is unchanged.

PARISA: Then they protect the furniture arrangement instead of the building's function.

JULES: Sometimes internal behavior matters. A function that promises to avoid duplicate requests may need an interaction check. But we should know why we're asserting it.

PARISA: If a test says a private helper must be called twice because that's what today's implementation does, it may be preserving an accident.

JULES: We'll return to that throughout the series. Tests should make intentional changes easier to assess, not make all changes equally miserable.

PARISA: I appreciate this goal. “Maintenance tool” sounds considerably better than “additional code nobody is allowed to touch.”

## Read the Failure Like a Developer

JULES: Imagine a test fails: expected zero, received three hundred.

PARISA: I want the test name, the input, and the relevant rule. “Exactly twenty dollars qualifies for free delivery” gives me somewhere to start.

JULES: What don't you do?

PARISA: Immediately replace zero with three hundred until the dashboard calms down. First I ask whether the application is wrong, the test is wrong, or the requirement changed.

JULES: A failing check is a disagreement. Investigation tells us what the disagreement means.

PARISA: Could also be the environment. Missing configuration, wrong time zone, stale data, or a dependency behaving differently.

JULES: Yes. A good failure message narrows the search, but it doesn't perform the diagnosis. That's one reason to keep tests focused and fixtures understandable.

PARISA: Fixture meaning prepared test data or setup, not the light hanging over my desk. Our fictional cart containing one twenty-dollar pizza is a fixture.

JULES: Right. If a delivery test requires forty unrelated customer fields, reading the failure becomes an archaeological expedition.

PARISA: And if it depends on the order a different test ran in, the archaeology is haunted.

JULES: Tests need isolation appropriate to their scope. Each should arrange what it needs and clean up state it changes.

PARISA: We'll get to shared databases and clocks. For now, “I ran it alone and it passed” is a clue, not a resolution.

## The Red Check Is Part of the Check

PARISA: How do we know our test can notice the bug? Maybe I wrote an assertion against the wrong value.

JULES: For a new regression test, run it against the broken behavior when practical. See it fail for the reason you intended. Then fix the behavior and see it pass.

PARISA: The important part is the reason. A missing import is red, but it doesn't prove we caught the fee problem.

JULES: Exactly. Or temporarily introduce the relevant mistake in a local exercise: change greater-than-or-equal to greater-than. Our boundary test should reject it.

PARISA: Then restore the correct code. Please don't publish the deliberate bug as a pedagogical surprise.

JULES: This is related to test-driven development: writing a failing test, making it pass, and improving the design while keeping it passing. You don't have to adopt an entire methodology to benefit from checking that a new test fails meaningfully.

PARISA: And writing the test first doesn't automatically make the requirement correct. We are still responsible for the thinking part.

JULES: Yes. Tests can be written before implementation, during debugging, or around existing behavior. The order helps with different goals; none gives us omniscience.

PARISA: A theme is developing. Computers are extremely useful and cannot absolve me of being a developer.

## What Deserves Automation First?

JULES: You're joining a project with very few tests. Where do you start?

PARISA: Something important, reasonably stable, and possible to observe. A calculation that caused incidents. A permission rule. A critical order journey. Not necessarily whichever function is easiest to reach.

JULES: Why not test every line immediately?

PARISA: Because we have limited time and the tests themselves cost something. Writing them, understanding failures, updating fixtures, maintaining the environment. I want useful confidence per unit of effort.

JULES: Frequency of change matters too. A frequently edited pricing rule may benefit from fast focused checks. A fragile connection between modules may need an integration test.

PARISA: And a low-impact prototype we're discarding tomorrow may not justify an elaborate harness. Though “prototype” has a suspicious habit of celebrating its fifth birthday in production.

JULES: Then reassess as its role changes. Risk includes how bad a failure would be, how likely it seems, and how hard it would be to detect or recover from.

PARISA: Don't turn that into fake arithmetic. We can discuss those factors without pretending we know the bug probability to three decimal places.

JULES: Good point. The purpose is prioritization. Not making a spreadsheet look scientifically inevitable.

PARISA: Also, a test nobody runs has limited protective value. Make the checks discoverable, reasonably fast, and part of the normal workflow.

JULES: Locally while changing code, and in continuous integration when code is proposed for the shared project. We'll unpack the machinery later.

## The Human Is Still in the Room

PARISA: Let's say all automated tests pass and I open checkout. The error says “invalid entity operation.”

JULES: Our test checked that an error appeared.

PARISA: A customer learns nothing. They don't know whether they were charged or what to do next. That matters.

JULES: We could improve the test to check more meaningful wording or state. But a human noticing a new problem is still valuable. Exploration asks questions we didn't pre-script.

PARISA: Manual regression checking and exploratory testing aren't identical. Following a repeatable checklist is one activity. Investigating unfamiliar behavior and learning where the product feels wrong is another.

JULES: Automated checks can free time for that investigation. They shouldn't be used to dismiss it.

PARISA: Or dismiss testers. The person who asks the question that saves us from shipping a nonsense workflow is contributing engineering judgment.

JULES: Tests also help communication. A small concrete example can expose disagreement faster than a paragraph saying “delivery should work correctly.”

PARISA: That paragraph is a haunted house for assumptions. Correctly according to whom? Before which discount? In which country? For pickup?

JULES: A test forces at least some of those choices into the open.

PARISA: Provided we write it to express the decision, not just to increase the count.

## Try the Question Before the Code

JULES: Listener exercise. No laptop needed. The shop says free delivery starts at twenty dollars. Name three concrete examples you would want remembered.

[BEAT]

PARISA: Nineteen dollars and ninety-nine cents costs three dollars. Twenty dollars costs zero. Twenty dollars and one cent also costs zero. That tests both sides and the boundary.

JULES: Now name something those examples don't answer.

PARISA: Whether discounts change the qualifying subtotal. Whether pickup gets charged. Whether the server enforces the rule. Whether the displayed total matches the accepted order.

JULES: Excellent. The next useful action might be another test, a requirements question, or a different kind of investigation.

PARISA: We aren't trying to feel bad that three examples don't prove the universe. We're trying to know what they actually tell us.

JULES: That's the central habit for the series. What are we checking, why does it matter, and what remains outside the check?

PARISA: And can the failure tell the next tired developer something useful? That developer may be me after lunch.

## The First Week on a Real Project

PARISA: Let me make this less tidy. I join a project on Monday. No tests. Long files. Several things named final. The team needs a delivery-fee change by Friday. Where does this philosophy actually start?

JULES: First, understand the current behavior and the requested change. Find the path responsible for the fee. Run the application and inspect any existing verification commands. Don't assume absence of a test folder means nobody has checks anywhere.

PARISA: Then choose a reachable boundary. Maybe the function can be called directly. Maybe the first useful check has to go through an endpoint because the logic is tangled.

JULES: Exactly. Add one meaningful example around the behavior you need to preserve or change. You don't need to establish a complete testing architecture before making useful progress.

PARISA: I'd write down the rule and the expected numbers in the task too. Otherwise my test becomes the only place anyone discovers we interpreted “at least” differently.

JULES: Good. Then run the new check and confirm it exercises the intended code. If it exposes the bug, make the smallest appropriate correction. If you're preserving existing behavior before a refactor, first understand whether that behavior is intentional.

PARISA: What if the code is very hard to reach without starting half the application?

JULES: That's information about the current design. Start with a broader check if necessary, then consider a small extraction once you have protection. Don't turn the deadline into an unrequested rewrite.

PARISA: By Friday we might have a few useful tests and a clearer boundary. That's a real improvement even though the rest of the repository hasn't become a testing textbook.

JULES: Exactly. The first useful suite often grows from actual changes and incidents. Each test earns its place by protecting something people care about.

PARISA: Who maintains it?

JULES: The team maintaining the behavior. Tests are part of the codebase. Review them, update them when requirements change, and remove obsolete checks deliberately. Don't assign them to a mythical future testing department.

PARISA: And if they take twenty minutes to run, the team may avoid them during tiny edits. We need feedback at a useful cadence.

JULES: Right. Keep fast focused checks easy to run while broader checks run at appropriate points. We don't need every check on every keystroke, but the important ones must actually happen before the decisions they inform.

PARISA: So on Monday I don't say, “We need tests because professional people have tests.” I say, “This fee changes often, this boundary has broken before, and these examples will tell us when we lose the rule.”

JULES: That's a reason somebody can evaluate. They can ask about cost, risk, and alternatives.

PARISA: I like that. Testing becomes a practical response to uncertainty instead of an identity badge.

## Okay, That's Why

JULES: Automated tests exist because repeatedly checking selected behavior by hand gets expensive, inconsistent, and difficult to share.

PARISA: They let us preserve useful examples, catch regressions, and change code with more evidence. They don't replace clear requirements or human judgment.

JULES: Next episode: unit tests. What is a unit, why are pure functions convenient, and does every function deserve its own ceremonial test file?

PARISA: I'm prepared to have strong feelings about the ceremony.

JULES: I assumed.

PARISA: The button works. Now let's decide what we want to keep knowing when we change it.

[OUTRO MUSIC]

## Production Notes

- Complete dialogue; code card is visual support, not spoken punctuation. No audio generated.
- Fictional delivery rule throughout Episodes 1–3: validated nonnegative integer subtotal cents; fee 300 below 2000, otherwise 0. Tax, discounts, pickup, and currencies require separate requirements.
- Callback: Nervous Robot Pizza Delivery from Web Architecture. This series does not establish a Next.js implementation.
- Syntax: all code in this episode is JavaScript; the primitive check intentionally precedes runner syntax.

## Production References

- Node.js test runner, an example of runtime-provided automated testing: https://nodejs.org/api/test.html
- This episode's pricing scenarios and dialogue are original teaching examples, not claims about a real business.
