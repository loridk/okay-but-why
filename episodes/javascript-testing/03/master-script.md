# Episode 3: Arrange, Act, Assert — The Testing Sandwich

**Series:** JavaScript Testing • Episode 3 of 10
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — Three Comments and a Dream

[INTRO MUSIC]

PARISA: I found a test with three comments: arrange, act, assert.

JULES: A classic.

PARISA: Under arrange, it creates the entire company. Under act, it performs six transactions. Under assert, it says true is true.

JULES: The comments may have overpromised.

PARISA: That's what worries me. Have we invented a ritual that looks organized while doing absolutely anything?

JULES: Welcome to *Okay, But Why?*. Today we explain why Arrange, Act, Assert exists, and why writing those words doesn't automatically make a test clear.

PARISA: I support sandwiches. I object to finding an office building between the bread.

## The Question Hidden in the Test

JULES: Imagine opening a failing test you didn't write. You need three things quickly: what situation did it create, what behavior did it trigger, and what result did it require?

PARISA: Context, event, consequence. Without those, I have to execute the whole thing in my head before I even know what broke.

JULES: Arrange, Act, Assert gives those responsibilities an order. Arrange prepares the relevant situation. Act performs the behavior we're investigating. Assert checks the meaningful outcome.

PARISA: It's a reading aid and a design aid. Not JavaScript syntax, and not something a test runner recognizes because I capitalized it nicely.

JULES: Correct. You'll also hear Given, When, Then. Given a situation, when something happens, then an outcome follows. Related way to describe behavior, sometimes used by particular tools, but the basic idea doesn't require those tools.

PARISA: I can apply it to a manual test. Given an empty cart, when I add a pizza, then the cart shows that pizza and the correct total.

JULES: Exactly. Automation turns that example into executable setup, action, and observations.

PARISA: Which means if I cannot say the intended behavior plainly, the test may not be ready to become code yet.

JULES: Yes. A readable sentence often reveals missing assumptions before syntax distracts us.

## One Small Sandwich

[CODE CARD: JavaScript values; Vitest test and matcher]
```javascript
import { expect, test } from 'vitest';
import { deliveryFee } from './delivery-fee.js';

test('a subtotal at the free-delivery threshold has no fee', () => {
  // Arrange
  const subtotalCents = 2000;

  // Act
  const feeCents = deliveryFee(subtotalCents);

  // Assert
  expect(feeCents).toBe(0);
});
```

JULES: We prepare a subtotal of two thousand cents. We ask the real function for the delivery fee. We require zero cents.

PARISA: The comments are optional. The structure is useful whether or not we label every layer like airport luggage.

JULES: Right. In a tiny test, a compact assertion around the function call may be perfectly readable. Separating the result into a named variable becomes useful when it clarifies the action or avoids repeating it.

PARISA: Const, the arrow function, and the function call are JavaScript. Test, expect, and ToBe are Vitest's testing API. The words arrange, act, assert are just comments.

JULES: And the expected zero comes from the delivery rule, not from calling the function a second time.

PARISA: Otherwise the test would say the function agrees with itself. Many bugs have excellent self-esteem.

## One Behavior Can Need Several Observations

PARISA: I've heard “one assertion per test.” Is that a law?

JULES: A guideline some teams use, but one coherent behavior can require several assertions. Suppose adding an item returns a new cart. We might check the added item, the total, and preservation of the original cart.

PARISA: Those all help describe one operation's contract. Splitting them could duplicate the same setup repeatedly.

JULES: Yes. But if the test adds an item, removes another, applies a discount, and submits payment, it's doing much more than one focused unit-test scenario.

PARISA: A larger workflow test might intentionally do that. The problem is pretending it gives the diagnostic clarity of a tiny calculation test.

JULES: Exactly. Scope and purpose determine whether the length makes sense. For focused tests, keep a clear central action. For a user journey, a meaningful sequence can be the action under investigation.

PARISA: Multiple assertions can also hide information because the first failure stops the rest in ordinary test flow.

JULES: True. If observations concern separate rules with different failure causes, separate tests may produce better reports. Don't consolidate unrelated expectations merely to save three lines.

PARISA: The unit of readability is the question, not the assertion count.

## Test Names Are Tiny Specifications

JULES: Which name would you rather debug: “works,” “test three,” or “rejects a negative subtotal before calculating a fee”?

PARISA: The last one, unless test three comes with psychic powers.

JULES: A useful name identifies the relevant condition and expected behavior. It doesn't need to narrate implementation.

PARISA: “Calls validate, then compare, then return” mostly describes today's function body. “Rejects negative subtotal” describes why the behavior matters.

JULES: Names can include context through a describe block, which groups related tests. But describe is another runner API, not a JavaScript language construct.

PARISA: And twenty nested describes aren't inherently better than two clear sentences. If I need a family tree to understand the failure report, we have over-organized.

JULES: A good name is also a check on the assertion. If the name says rejection, but the assertion only checks that something was called, ask whether it really verifies rejection.

PARISA: Test names can lie accidentally. The code beneath them is what executes.

JULES: That's why reviewing tests includes comparing the scenario, action, and assertion. Not just checking whether they pass.

## The Fixture Should Explain the Scenario

PARISA: Let's talk about arrange becoming enormous. I often inherit a giant fixture called validCustomer.

JULES: With a dozen addresses, five preferences, a subscription, and an unexplained field containing the number seven.

PARISA: Seven is load-bearing. Nobody knows why.

JULES: For a delivery-fee test, we may only need a subtotal. Extra data hides what's relevant and adds things that can break for unrelated reasons.

PARISA: But some application boundaries genuinely require a fuller object. Then a helper might make sense.

JULES: Yes. A small fixture builder can provide sensible synthetic defaults and allow the test to override the relevant values. The test should still make its important conditions visible.

PARISA: Don't make me open three helper files to discover the cart secretly contains a discount. If discount state affects the rule, show it near the test.

JULES: Exactly. Reuse setup that is incidental. Keep decisive facts local. Repeated readable data can be better than a clever abstraction hiding the story.

PARISA: Which feels contrary to the instinct to eliminate every repeated character in code.

JULES: Tests are documentation as well as executable checks. A little duplication can make them independent and understandable. Changing a shared helper can otherwise alter dozens of scenarios at once.

PARISA: And production data isn't a fixture shortcut. Make synthetic records with obvious fake addresses and no real secrets.

## Hooks: Useful, Then Suspicious

JULES: Runners provide hooks such as beforeEach and afterEach. They run setup or cleanup around individual tests.

PARISA: Those names come from the testing tool. Not browser events, not JavaScript keywords.

JULES: Right. They can establish fresh state or restore something a test changed. But putting all setup into hooks can make individual tests hard to understand.

PARISA: I scroll up through three nested scopes and discover a parent hook changed the clock to Tuesday. Tuesday is now a hidden dependency.

JULES: Prefer explicit setup when it explains the scenario. Use hooks for genuinely shared lifecycle work, such as clearing a test DOM after each test.

PARISA: And afterEach means even a failed assertion should still be followed by cleanup managed by the runner. Better than putting cleanup after the assertion where an exception could skip it.

JULES: Exactly. External resources still need robust lifecycle management. If setup partly fails, cleanup should handle that state too.

PARISA: For our pure function, we don't need hooks at all. No mutable state, no connections, no ritual washing of the subtotal.

JULES: Correct. Add lifecycle machinery when there's a lifecycle to manage.

## Parameterized Tests Without a Punctuation Ambush

JULES: Several delivery cases share the same shape: input subtotal, expected fee. A table can express them compactly.

[CODE CARD: JavaScript arrays and parameters; Vitest test.each]
```javascript
test.each([
  [0, 300],
  [1999, 300],
  [2000, 0],
  [2001, 0],
])('subtotal %i cents has fee %i cents', (subtotalCents, expectedFee) => {
  const actualFee = deliveryFee(subtotalCents);
  expect(actualFee).toBe(expectedFee);
});
```

PARISA: Audio version: four rows. Zero and nineteen ninety-nine receive a three-dollar fee. Twenty and twenty-oh-one receive zero. Each row becomes a separately reported case.

JULES: The nested arrays and callback parameters are JavaScript. Test.each is Vitest's parameterized-test API. The percent-i placeholders are formatting understood by the testing tool, not interpolation built into ordinary JavaScript strings.

PARISA: Important. Those aren't template literals. The test runner supplies values to those placeholders.

JULES: This pattern helps when cases have the same action and assertion shape. If each row needs special branches, setup, or a different meaning, separate named tests may be clearer.

PARISA: I've seen a table grow flags like shouldThrow, skipSetup, specialMode, useAlternateResult. At some point you've built a worse programming language in an array.

JULES: Exactly. Test code should usually be simpler than the behavior it checks. A conditional assertion can accidentally skip the branch we intended to verify.

PARISA: And a loop generating no cases can produce no useful checks. Make sure the runner actually discovers the cases you expected.

## Repair a Test That Passes Too Easily

JULES: Here's a flawed test in words: call the fee function, then assert that the result is defined.

PARISA: It passes for zero, three hundred, negative eight thousand, and “banana.” It hasn't encoded the fee rule.

JULES: First repair?

PARISA: Assert the exact expected fee for the chosen scenario. Name the boundary. Make the input visible.

JULES: Second flawed test: it calculates expected fee by copying the same conditional as the production function.

PARISA: Replace that with an independently worked example. Otherwise the same greater-than bug could appear in both places.

JULES: Third: the test catches errors, logs them, and continues.

PARISA: Let unexpected errors fail the test. For expected errors, use a specific rejection or throw assertion. Logging isn't asserting.

JULES: Fourth: a test adds a cart item in one test, then a later test assumes it's still there.

PARISA: Arrange a fresh cart in each test. Tests shouldn't require their neighbors to leave useful crumbs.

JULES: These aren't formatting problems. They affect what evidence a green result provides.

PARISA: Exactly. Three comments won't save a test that never asks the right question.

## State Machines Make Arrange More Interesting

JULES: Let's leave arithmetic. An order can be draft, submitted, or cancelled. Cancelling a submitted order returns a cancellation state if the policy allows it.

PARISA: Now the starting state matters. “Cancel order” without saying its current state is incomplete.

JULES: Arrange might prepare a submitted order. Act requests cancellation. Assert checks the resulting state and any specified side effects.

PARISA: If an already-cancelled order receives another cancellation request, do we return the same result, reject it, or produce a second refund? That needs an explicit rule.

JULES: A good test makes that ambiguity visible. Repeated requests are common in real systems.

PARISA: But let's not quietly turn this into a payment-integration example. Our local state transition doesn't prove a provider refund happened exactly once.

JULES: Correct. We can test the decision here and test the external integration elsewhere. The boundary must remain visible.

PARISA: This is why arrange isn't just “make some objects.” It establishes the conditions that make the expected consequence meaningful.

JULES: And it may reveal unreachable states. A test that creates an impossible object can be useful for validation, but don't mistake it for an ordinary workflow scenario.

## What If the Expected Behavior Changes?

PARISA: The shop raises the free-delivery threshold to twenty-five dollars. Our twenty-dollar test fails. Is that a regression?

JULES: It may be an intentional requirement change. The existing test correctly flags that the old promise changed. We review and update the examples to the new agreed rule.

PARISA: So tests aren't laws handed down on stone tablets. They preserve decisions until we deliberately replace them.

JULES: Yes. The review should explain the behavior change, not just say “fix tests.” Twenty-four ninety-nine, twenty-five, and twenty-five-oh-one become meaningful boundary examples.

PARISA: And historical orders might need their old accepted prices preserved. Updating a calculation for new orders doesn't mean rewriting receipts.

JULES: Nice architecture callback. The correct tests depend on which responsibility we're changing: current quote calculation, stored order history, or display.

PARISA: A well-named test helps us see the difference. A vague “price works” test makes all those responsibilities blur together.

## The Debugging Order

JULES: When a test fails, do you read arrange first or assert first?

PARISA: Usually the failure message tells me the assertion disagreement. Then I check the action and relevant setup. Did we create the intended condition? Did we call the real subject? Did we observe the right result?

JULES: That order can expose tests aimed at the wrong object, stale variables, or assertions that run before asynchronous work finishes.

PARISA: Async is coming later. For now, the test should make the moment of observation obvious.

JULES: Reproduce the failure in the smallest appropriate scope. Then determine whether the application, expectation, fixture, or environment is responsible.

PARISA: And don't add a random delay because the failure feels nervous. Timing problems need an explanation.

JULES: That will be on the Episode Eight mug.

PARISA: We have an alarming number of imaginary mugs.

## Listener Workshop — A Rejected Discount

JULES: Let's design a test without writing it. A discount code has expired. The application must reject it and preserve the original cart total. Arrange?

[BEAT]

PARISA: A cart with a known total, the expired discount, and a controlled current time if expiration depends on time. We need to know whether expiration includes the exact boundary moment.

JULES: Act?

PARISA: Attempt to apply that code once through the relevant public operation.

JULES: Assert?

PARISA: A meaningful rejection result and an unchanged total. If the UI is the boundary, check an understandable error and the displayed total. If it's a pure rule function, check its specified result.

JULES: Would “discount validation was called” be enough?

PARISA: No. It could be called and ignored. We need the actual outcome. An interaction assertion might supplement it if that interaction is itself required.

JULES: What could make the test flaky?

PARISA: Using the real current date with a fixed expiration date. One day the test becomes a different scenario. Make time explicit or control it deliberately.

JULES: Great. Three steps exposed requirements, scope, and a source of nondeterminism before we installed anything.

## Read a Bad Test Aloud

JULES: I'm going to read a fictional test in prose. Before every test, we create a customer with a loyalty flag. Inside the test, we create a cart. We call applyDiscount. If the result has an error, we expect the error to exist. Otherwise we expect the total to be defined.

PARISA: That test is prepared to agree with nearly anything. It doesn't commit to whether the discount should succeed.

JULES: The name is “applies loyalty discount.”

PARISA: Then the error branch contradicts the name. Decide the scenario. If this is an eligible customer with a valid discount, assert the expected discounted total and relevant success state. Unexpected errors should fail.

JULES: What about the loyalty flag in the hook?

PARISA: That's decisive setup. Bring it into the test or make the fixture helper invocation explicit enough to say eligible customer. The person reading the test shouldn't have to discover the reason for eligibility somewhere above the fold.

JULES: The original author says the conditional makes the test reusable for failures too.

PARISA: Then create a separate failure case or a clear table of cases with explicit expected outcomes. Reuse shouldn't make every possible outcome acceptable.

JULES: So the repaired story is: given an eligible customer and a cart worth a known amount, when we apply this valid discount, then the total becomes this independently calculated amount.

PARISA: Yes. And a separate story: given an ineligible customer, when we attempt the discount, then we get the specified rejection and preserve the total. Two clear claims beat one diplomatic shrug.

JULES: Diplomatic shrug is unfortunately a very common assertion style.

## A Failure Message Is Part of the Interface

PARISA: We talk about accessible product messages. Tests also have an audience: the developer trying to understand the failure.

JULES: Good point. A failure should expose the relevant mismatch without requiring a full mental replay. Useful names, small fixtures, and precise assertions help.

PARISA: If I assert a giant object equals another giant object, the diff may be technically complete but practically unreadable. Sometimes checking the meaningful fields separately is clearer.

JULES: Provided we don't omit fields that are part of the contract. If preventing extra sensitive data is the goal, an exact shape assertion can be important.

PARISA: Right. Clarity and completeness have to serve the actual question. We aren't picking a matcher based on how short its line is.

JULES: Custom assertion helpers can express domain concepts when repeated checks become noisy. But their failures should still say what differed.

PARISA: A helper named expectValidOrder that throws “bad order” is not much help. Show the particular invariant that failed, such as the total not matching the line items.

JULES: And don't put so much business logic into the helper that it becomes another untested implementation of the same rules.

PARISA: We keep rediscovering the same principle: make the expected meaning visible, avoid reproducing the algorithm, and let unexpected behavior disagree loudly.

## Setup Isn't Free Just Because It's Shared

JULES: One more scenario. Every test starts a database because a global beforeEach does it, even our pure fee test.

PARISA: Then a tiny calculation depends on infrastructure it doesn't use. It becomes slower and can fail before reaching the actual question.

JULES: How would you reorganize it?

PARISA: Separate the setup by scope. Database tests use the database lifecycle. Pure tests don't inherit it. That might mean separate configuration or suites, depending on the project.

JULES: And if we use beforeAll to start the database once for speed?

PARISA: Fine if each test still gets independent data or reliable isolation. Shared infrastructure is different from shared mutable scenario state.

JULES: That distinction is useful. We can reuse the expensive resource while keeping the facts each test changes separate.

PARISA: Exactly. Arrange, Act, Assert doesn't require waste. It requires knowing which state makes the scenario true and ensuring another test can't secretly rewrite it.

## The Review You Can Do Without Running It

JULES: Before running a new test, read its name and point to the line that creates the named condition. Then point to the action and the assertion that would reject the wrong outcome.

PARISA: If I can't find those, simplify the test. This is a useful review even before execution, though it doesn't replace actually running it.

JULES: Exactly. Then execute it and inspect what the runner discovered. For a regression, confirm the failure corresponds to the original defect when practical.

PARISA: That gives us two complementary checks: does the story make sense, and does the code actually enforce that story? A test can look persuasive and still import the wrong function.

JULES: Or execute perfectly while checking a requirement nobody agreed to.

PARISA: The sandwich needs ingredients and a reason to exist. I apologize for making lunch this rigorous.

## Okay, That's Why

JULES: Arrange, Act, Assert exists to make a test's situation, action, and expected consequence easy to see.

PARISA: Use it to clarify the question. Keep decisive data visible, share incidental setup carefully, and prefer meaningful observations over ceremonial assertion counts.

JULES: Table-driven tests help with repeated case shapes. Hooks help with real setup and cleanup. Neither should hide the reason the test exists.

PARISA: Next episode, the tooling suitcase finally opens: Jest, Vitest, runners, environments, and who actually calls these little functions.

JULES: You ready?

PARISA: Yes. My sandwich now contains a reasonable amount of software.

[OUTRO MUSIC]

## Production Notes

- All examples continue the Episode Two deliveryFee contract and import from delivery-fee.js in a practice project.
- Test.each is a Vitest API; table arrays, callbacks, and comments are JavaScript. Placeholder formatting belongs to the runner.
- No external resources or paid services are needed for these conceptual examples.

## Production References

- Vitest test API, parameterized cases, and hooks: https://vitest.dev/api/
- Vitest writing tests: https://vitest.dev/guide/writing-tests
