# Episode 10: One Hundred Percent of What? — Coverage and the Limits of Tests

**Series:** JavaScript Testing • Episode 10 of 10
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — The Number Is Green

[INTRO MUSIC]

JULES: We have one hundred percent coverage.

PARISA: Of what?

JULES: The measured code.

PARISA: And does checkout work?

JULES: We have one hundred percent coverage.

PARISA: I appreciate your commitment to the number, but the customer is currently buying NaN pizzas.

JULES: Welcome to the JavaScript Testing finale of *Okay, But Why?*. Coverage, gaps, mutation testing, and how to talk honestly about what passing tests mean.

PARISA: We are keeping the useful meter and declining to build it a religion.

## Coverage Records Execution

JULES: Code coverage tools record which measured parts of code execute while tests run. Reports can summarize statements, lines, functions, and branches.

PARISA: Execution, not correctness. A line can run and produce the wrong result while the test fails to notice.

JULES: Exactly. Coverage can reveal code we didn't exercise. It doesn't establish that our assertions would reject wrong behavior in the code we did exercise.

PARISA: So the numerator is some form of executed measured code, and the denominator is the code included in that measurement. Both matter.

JULES: Yes. A report excluding important files can look excellent while leaving critical behavior outside its scope.

PARISA: One hundred percent of a cupboard isn't the whole kitchen.

JULES: That's going in the imaginary mug catalog.

## Lines, Statements, Functions, Branches

PARISA: Explain the categories without assuming they're interchangeable.

JULES: Function coverage asks whether measured functions were invoked. Statement coverage asks whether measured statements executed. Line coverage summarizes execution associated with source lines. Branch coverage tracks alternatives at decision points according to the coverage tool's model.

PARISA: One line can contain multiple decisions, especially with conditional expressions or short-circuit operators. So a line percentage can hide untested alternatives.

JULES: Right. And the exact mapping depends on the provider and transformed code. Don't assume two tools produce identical branch counts for every construct.

PARISA: The useful habit is opening the report and understanding the highlighted paths, not memorizing four definitions and staring at the top number.

JULES: Exactly. If an error-handling branch was never executed, ask whether that scenario matters and how to exercise it meaningfully.

PARISA: Maybe it's important. Maybe it's unreachable defensive code. Maybe it indicates a design problem. The report starts an investigation; it doesn't settle one.

## A Fully Executed Mistake

JULES: Consider a fee function where the free-delivery threshold should include exactly twenty dollars, but the code uses strictly greater than.

[CODE CARD: Intentionally wrong JavaScript — boundary mutation example]
```javascript
function deliveryFee(subtotalCents) {
  return subtotalCents > 2000 ? 0 : 300;
}

// These two examples can exercise both outcomes and still miss the boundary.
expect(deliveryFee(1000)).toBe(300);
expect(deliveryFee(3000)).toBe(0);
```

PARISA: Below and above pass. Both outcomes execute. Exactly twenty is still wrong.

JULES: Yes. Even complete branch coverage of this small decision doesn't prove we chose the right boundary examples.

PARISA: And an even weaker test could call the function without checking the fee at all. Execution would still occur.

JULES: Exactly. Coverage doesn't measure assertion strength or requirement completeness.

PARISA: The repair is the independently derived example: exactly two thousand cents should return zero. Not another call chosen only because it paints a line green.

JULES: That is the central distinction. Use the report to ask better questions, then write a test that makes a meaningful claim.

## Configure the Denominator Deliberately

PARISA: What should be included in coverage?

JULES: The application code whose testing we want to assess. Configure the scope deliberately and understand defaults for the installed tool version. Unimported files may need explicit inclusion to appear as uncovered.

PARISA: Otherwise a never-tested module can disappear from the report, making the percentage more comforting than it deserves.

JULES: Exactly. Exclude generated output, test fixtures, or other irrelevant files when appropriate, but don't exclude difficult application code just to raise the score.

PARISA: And document justified exclusions. If a file is platform-specific and tested elsewhere, say where. If it's untested, say that.

JULES: Vitest supports coverage providers and configuration for included files, reports, and thresholds. Use a provider compatible with the installed version and add the package only when you need coverage.

[CODE CARD: JavaScript configuration excerpt — adapt to the actual project]
```javascript
export default {
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      reporter: ['text', 'html'],
    },
  },
};
```

PARISA: This is a configuration excerpt, not a replacement for the React plugin setup from Episode Seven. The source glob is tooling pattern syntax inside a JavaScript string.

JULES: Correct. It assumes application files live under src. Our earlier tiny practice files might live at the root, so adapt the pattern rather than copying it blindly.

PARISA: And the provider package needs to match the runner's requirements. A command with coverage enabled is still executing tests, not statically proving the code.

## Thresholds Can Help or Distort

JULES: Teams sometimes fail CI if coverage drops below a threshold. Useful?

PARISA: Potentially. It can prevent unnoticed erosion or prompt review of new untested code. But a target becomes dangerous when people optimize for the number instead of useful checks.

JULES: Such as calling functions without meaningful assertions, excluding difficult files, or adding trivial tests while critical risks remain untested.

PARISA: Exactly. A threshold is a guardrail, not a quality certificate. Different parts of the system may deserve different expectations based on risk and testability.

JULES: A high-risk authorization rule can matter more than a large amount of low-impact formatting code. Aggregate percentages can conceal that imbalance.

PARISA: And comparing teams by coverage percentage without understanding their code and measurement scope is especially dubious. The denominator isn't standardized human virtue.

JULES: So discuss what the threshold protects, what it misses, and how exceptions are reviewed.

PARISA: The number should support a conversation, not end it.

## Mutation Testing Asks Whether Tests Notice

JULES: Mutation testing deliberately changes code in small ways, then reruns tests. For example, change greater-than-or-equal to greater-than, or replace a returned value.

PARISA: A mutant is the modified version. If the tests fail because they detect its changed behavior, people say the mutant was killed. Dramatic terminology for a comparison operator.

JULES: If tests still pass, it survived. That can reveal a missing case or weak assertion.

PARISA: But not every surviving mutant means the tests are deficient. Some changes may be equivalent for all valid inputs, or affect behavior outside the intended contract.

JULES: Exactly. Equivalent mutants and tooling limitations require interpretation. Mutation scores aren't another universal truth percentage.

PARISA: And running the suite for many modified versions can be expensive. Start with valuable logic, not necessarily the whole repository on every keystroke.

JULES: Right. Mutation testing adds evidence about test sensitivity. It still can't invent missing product requirements or prove the original behavior is correct.

PARISA: Our delivery boundary example is a perfect small demonstration: change the comparison, expect the exact-threshold test to fail, then restore the real code.

## Property-Based Tests Explore Families

JULES: Another useful technique is property-based testing. Instead of only listing examples, define a property and generate many inputs to explore it.

PARISA: For a nonmutating cart calculation, a property might be that calling it leaves the input unchanged. For a fee rule, valid subtotals at or above the threshold always produce zero.

JULES: Yes. Generators should respect the intended input domain unless we're testing validation. Some tools shrink failing inputs to smaller examples that are easier to understand.

PARISA: That's helpful because “failed on an enormous random object” is not a delightful debugging experience.

JULES: Reproducible seeds and reported counterexamples matter. Randomness without reproducibility can make failures hard to investigate.

PARISA: And a property can be wrong or too weak. “Output is a number” doesn't suddenly become a pricing guarantee because we checked it ten thousand times.

JULES: Exactly. Generated tests complement well-chosen examples. They don't remove the need for an independent understanding of the rule.

PARISA: The human still supplies meaning. This has been an inconveniently consistent theme.

## Tests Can't Prove the Requirement Was Good

JULES: Suppose every test confirms that checkout discards the cart after a payment error because that's what the specification says.

PARISA: Then the tests can be correct and the experience can still be terrible. We may need to change the requirement.

JULES: Exactly. A passing suite says the checked behavior matches the encoded expectations under tested conditions. It doesn't certify those expectations are desirable.

PARISA: That's why user research, domain discussion, accessibility evaluation, and ordinary critical thought still belong in development.

JULES: Tests can make a questionable policy visible and repeatable. They can't decide whether the policy serves people well.

PARISA: And vague requirements produce vague tests. “Works correctly” is not a substitute for concrete examples and tradeoffs.

## Tests Don't Exhaust Security or Accessibility

JULES: We included specific accessibility and security checks throughout the series. What can we honestly claim?

PARISA: We can claim the tested labels, keyboard interactions, validation cases, and authorization scenarios behaved as expected in the chosen environment. We cannot claim the whole product is accessible or secure because those passed.

JULES: Right. A role query doesn't evaluate every assistive-technology experience. An injection example doesn't exhaust every context where untrusted data flows.

PARISA: Security includes design, dependencies, configuration, permissions, operational behavior, and evolving threats. Accessibility includes real interaction across varied users and technologies, not only static markup properties.

JULES: Automated checks are useful parts of that work. Their limits should guide additional evaluation, not make us discard them.

PARISA: Nor should a disclaimer become an excuse to skip the specific checks we can reasonably automate. Useful partial evidence is still useful.

JULES: Exactly. Be precise without becoming defeatist.

## Performance and Production Are Different Questions

PARISA: A functional test passed in twenty milliseconds. Does that prove the application is fast?

JULES: No. The measured setup may omit network, realistic data volumes, browser rendering, concurrency, and production infrastructure. Performance testing needs relevant workloads and measurements.

PARISA: And a pre-release suite doesn't tell me whether the database is healthy right now. Production monitoring answers ongoing operational questions.

JULES: Right. Deployment checks, observability, error reporting, and recovery practices complement pre-deployment tests.

PARISA: A test suite can verify a backup function calls an adapter. A restore exercise is different evidence. We should not confuse the label backup with demonstrated recovery.

JULES: Great connection to the security and architecture series. Test the promise at the boundary where it matters.

PARISA: Also, no suite explores every possible input, event order, browser condition, dependency version, and human decision. We choose intelligently under constraints.

JULES: That isn't failure. It's engineering with explicit uncertainty.

## AI Can Write Tests and Share Your Mistake

PARISA: What if an AI assistant generates all the tests?

JULES: Review them the same way you review any proposed tests. Do they call the real subject? Are the expectations derived from the requirement? Could they detect the relevant bug? Do they accidentally expose data or call real services?

PARISA: If the assistant reads a faulty implementation and copies its logic into expected values, we get highly consistent agreement with the bug.

JULES: Exactly. Generated tests can help brainstorm cases or create a starting point, but independent judgment remains necessary.

PARISA: Ask for missing boundary cases, then evaluate them. Don't accept a hundred generated assertions merely because they look industrious.

JULES: And verify they actually run. Syntax-looking text in a file isn't executed evidence until the runner discovers it and the relevant checks complete.

PARISA: “Tests added” and “tests passed” are different claims. So are “parser accepted the script” and “the code examples were executed.” Precision matters in our own production process too.

## What Belongs in a Useful Test Report?

JULES: How would you report a change responsibly?

PARISA: State the behavior changed, the relevant checks run, and their outcomes. Mention meaningful limitations or checks not performed. Avoid “fully tested” unless you can define what fully means, which is usually more trouble than a precise sentence.

JULES: For example, delivery boundary unit tests passed; API integration checks passed in the isolated database environment; the checkout browser journey passed in the configured browser; no live payment was attempted.

PARISA: Exactly. That's understandable evidence. A coverage percentage can supplement it with scope clearly stated.

JULES: And if a test is flaky or skipped, don't bury that beneath the green total.

PARISA: A skipped test didn't pass. A retry that passed had an earlier failure. State what matters for the decision.

JULES: Honest reporting helps the next person choose what to investigate or verify next.

## A Practical Review of One New Test

JULES: Let's review a pull request adding a discount test. What do you ask?

PARISA: What behavior does the name promise? Is the setup creating that condition? Does the real relevant code run? Is the assertion independent and strong enough? Does the test fail for the intended defect?

JULES: Then scope?

PARISA: What dependencies are replaced? What integration evidence exists elsewhere? Does the test clean up state, time, and external resources? Can it run reliably without production data or secrets?

JULES: Maintenance?

PARISA: Can another developer read it without following six helpers? Does it protect a public contract or freeze incidental implementation? Is the runtime reasonable for the feedback loop?

JULES: That sounds like a lot, but for a small clear test it can be quick.

PARISA: Exactly. Clear tests answer most of these questions on the page. Complicated tests make the questions expensive, which is a signal worth noticing.

## Listener Workshop — The Green Dashboard

JULES: Finale scenario. Coverage is high. Unit tests pass. The browser journey passes. A customer reports that using a keyboard loses their cart when a request fails. What do we do?

[BEAT]

PARISA: Reproduce and understand the report. The passing suite doesn't invalidate the customer's experience. Identify the missing combination: keyboard interaction, request failure, and cart preservation.

JULES: Then add a test?

PARISA: At the scope that includes the failure mechanism. Maybe a component test for state preservation and a browser check for focus behavior. First confirm the intended recovery behavior with the product context.

JULES: And coverage?

PARISA: It may remain unchanged. We can add a highly valuable assertion or scenario without executing a new line. Quality improved even if the meter didn't move.

JULES: That's a useful final answer to “one hundred percent of what?”

## A Report That Looks Better for the Wrong Reason

JULES: Yesterday coverage was eighty percent. Today it's ninety-five. What happened?

PARISA: Maybe we added meaningful tests. Maybe we deleted obsolete code. Maybe we excluded an important directory. Maybe a configuration change altered what gets counted. Ask before celebrating.

JULES: Exactly. The same numerical movement can have very different causes.

PARISA: If we removed unused code, that's potentially a good change even though we didn't add tests. If we excluded a difficult payment adapter without replacing its evidence, the higher number may hide more risk.

JULES: And if generated files were accidentally included before, excluding them can make the report more relevant. Exclusion isn't inherently dishonest.

PARISA: The reason and scope matter. A useful report should make the denominator understandable enough that reviewers can tell the difference.

JULES: What about a drop caused by adding a new module that isn't tested yet?

PARISA: That's useful information. Discuss the module's risk and add appropriate checks. Don't immediately exclude it because the threshold blocks the build.

JULES: A metric can create pressure. We should design the review process so the easiest response is improving evidence, not hiding the gap.

PARISA: Yes. Good intentions need a workflow that doesn't reward nonsense.

## The Surviving Mutant Conversation

JULES: Mutation testing changes a comparison in our validation guard, and the tests still pass. What next?

PARISA: Read the change. Find an input where the mutated behavior differs within the intended domain. If such an input matters, add or strengthen a test with an independently derived expectation.

JULES: Suppose no valid input can distinguish the versions because an earlier guard already rejects the relevant values.

PARISA: Then it may be equivalent within our contract. We don't need a contorted test of impossible behavior just to kill the mutant. Document or handle it according to the tool and project policy.

JULES: Suppose the mutation changes an error message's punctuation.

PARISA: Ask whether exact punctuation is part of the intended contract. If it's an internal diagnostic, maybe not. If a public API or user-facing requirement depends on the message, maybe it matters. Context again.

JULES: So mutation testing gives us questions about sensitivity, not automatic instructions to make every detail immutable.

PARISA: Exactly. It can reveal weak assertions, but it can also tempt us to over-specify irrelevant behavior. We still choose what deserves protection.

## Removing Tests Can Be Responsible

JULES: Is deleting a test ever the right improvement?

PARISA: Yes. If the feature no longer exists, if the test duplicates evidence without useful diagnostic value, or if it enforces an obsolete implementation detail. Review the reason and preserve coverage of the actual current behavior.

JULES: What if it's flaky?

PARISA: Flakiness alone doesn't tell us whether deletion is right. Investigate whether it protects a real risk and whether a better-scoped test can replace it. Don't quietly remove the only check of a critical workflow because it was inconvenient.

JULES: And a slow test?

PARISA: Same principle. Optimize setup, move repeated cases to a narrower scope, or schedule expensive checks appropriately. If its evidence matters, find a sustainable way to keep that evidence.

JULES: So the test suite is maintained software, not an ever-growing museum of every assertion anyone wrote.

PARISA: Exactly. Obsolete tests can obstruct useful changes and teach the wrong requirements. Keeping everything forever isn't automatically safer.

## What Confidence Sounds Like

JULES: We have to make a release decision. How do you express confidence without pretending certainty?

PARISA: State what changed and which risks we checked. “The fee boundary cases pass, the API uses authoritative cents, and the isolated checkout journey shows the expected total. We haven't exercised the external provider in this run.” That's concrete.

JULES: And if the untested boundary is crucial to the change?

PARISA: Then perform the appropriate additional check or explain why the decision remains blocked. Don't bury the missing evidence under a broad phrase like all tests passed.

JULES: If the change is a tiny wording fix?

PARISA: Scale verification to the change. We don't need to rerun the universe to prove a typo was corrected, though we should check the actual output and avoid breaking the surrounding markup.

JULES: That's a nice final tradeoff. Useful confidence includes knowing when more testing would add little information.

PARISA: Yes. Testing isn't a contest to consume the most compute. It's a way to make better decisions about software and the people depending on it.

## The Last Question

JULES: If you could ask only one thing about a new test, what would it be?

PARISA: What meaningful mistake would make this fail? The answer doesn't have to cover every possible bug, but it should identify something we care about.

JULES: And if the answer is only that changing the test's own fixture would make it fail?

PARISA: Then inspect whether the real subject contributes anything. Maybe it's a legitimate fixture-validation test, but don't describe it as application coverage unless it exercises the application.

JULES: A clear answer connects the test to the reason it exists.

PARISA: Exactly. That's more valuable than a large assertion count and considerably harder to fake with a green badge.

## Okay, That's Why

JULES: We started with a button Parisa had already clicked. Automated tests gave us repeatable examples and a way to preserve selected behavior through change.

PARISA: Unit tests isolated decisions. Arrange, Act, Assert made the question readable. Runners handled execution. Doubles controlled dependencies. DOM and React tests observed interactions. Async tests made completion explicit. Integration and end-to-end tests connected the wires.

JULES: Coverage helps reveal execution gaps. Mutation and property-based techniques can deepen the investigation. None makes judgment unnecessary.

PARISA: The goal isn't to prove the absence of all bugs. It's to make useful claims, catch meaningful mistakes, and understand what's still uncertain.

JULES: What problem does this test solve, and does that problem apply here?

PARISA: There it is. The show's question, wearing a test filename.

JULES: Thanks for listening to *Okay, But Why?*.

PARISA: May your tests be clear, your fixtures be fictional, and your green dashboard have something specific to say.

[OUTRO MUSIC]

## Production Notes

- The first code card is explicitly wrong to demonstrate a surviving boundary bug; never present it as the correct delivery implementation.
- Coverage configuration is a mergeable excerpt and assumes src paths; no provider dependency was installed into the podcast project.
- Finale closes this ten-episode series without promising an unapproved Next.js, CI/CD, or advanced-testing production series.

## Production References

- Vitest coverage providers and configuration: https://vitest.dev/guide/coverage.html
- Stryker mutation-testing concepts: https://stryker-mutator.io/docs/
- fast-check property-based testing: https://fast-check.dev/docs/introduction/
