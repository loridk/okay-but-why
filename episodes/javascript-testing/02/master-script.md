# Episode 2: Unit Tests — How Tiny Is Tiny?

**Series:** JavaScript Testing • Episode 2 of 10
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — A Unit of What?

[INTRO MUSIC]

JULES: Today we're testing a unit.

PARISA: Of what? Pizza? Software? Emotional resilience?

JULES: A small piece of behavior in isolation from things we don't need for the question.

PARISA: That's sensible. Unfortunately, I have seen people argue about whether a unit may contain two functions as though the second function triggers a zoning violation.

JULES: We can avoid zoning law.

PARISA: Good. Welcome to *Okay, But Why?*. Last episode we established that automated tests are repeatable evidence, not a certificate from the Department of Working Software.

JULES: Today: choosing a useful boundary, testing ordinary JavaScript, and why some code makes this much easier than other code.

## The Size Isn't the Point

PARISA: What exactly counts as a unit test?

JULES: Teams use the term differently. Often it's a focused test of a small piece of application behavior, with dependencies controlled or excluded so the result is fast and easy to diagnose. That piece might be a function, a module, or several cooperating objects.

PARISA: So before a classification argument, tell me what runs for real and what has been replaced.

JULES: Yes. “This tests the delivery calculation with real helper functions, no network, and no database” tells you more than just “unit.”

PARISA: I don't need to mock arithmetic because the plus sign is technically a dependency.

JULES: Please don't. Isolation is useful when it reduces unrelated uncertainty. It isn't a vow to stop all collaboration between functions.

PARISA: Our useful question might be “what fee does this subtotal receive?” The implementation could call another local helper and still answer that question clearly.

JULES: Right. If reorganizing those helpers forces a hundred test changes even though fees remain correct, we may have tested too much of the structure.

PARISA: But if the helper has a meaningful public contract of its own, direct tests may make sense.

JULES: Exactly. There isn't a universal one-test-file-per-function law. Pick boundaries based on behavior, risk, and diagnostic value.

PARISA: Good. I would like to spend my testing budget on bugs rather than bureaucracy.

## Start with a Promise Small Enough to Read

JULES: Our delivery function accepts a nonnegative whole number of cents. Below two thousand cents, the fee is three hundred. At two thousand or more, zero.

PARISA: That's a contract. It describes acceptable input and promised output. Does it also say what happens for invalid input?

JULES: Let's make that explicit. For this example, invalid input throws a RangeError. We reject strings, negative numbers, fractional cents, and unsafe integers.

PARISA: Why unsafe integers?

JULES: JavaScript's ordinary number type can't represent every integer at arbitrarily large magnitudes exactly. Number.isSafeInteger checks that the value is an integer in the range where these integers are represented safely.

PARISA: So whole cents avoids the familiar decimal-fraction issue for this small calculation, but isn't a universal financial-math solution.

JULES: Correct. Taxes, currency rounding, multiplication, large totals, and different minor units require deliberate rules. We're drawing a teaching boundary, not publishing a payment library.

[CODE CARD: JavaScript — delivery-fee.js]
```javascript
export function deliveryFee(subtotalCents) {
  if (!Number.isSafeInteger(subtotalCents) || subtotalCents < 0) {
    throw new RangeError('Subtotal must be nonnegative whole cents');
  }
  return subtotalCents >= 2000 ? 0 : 300;
}
```

PARISA: Export is JavaScript module syntax. It makes the function available to another module. Nothing here is TypeScript.

JULES: And the guard is runtime validation. It executes when the function runs. A TypeScript annotation could describe the expected type to development tools, but it wouldn't automatically reject bad external data at runtime.

PARISA: Also, a TypeScript number annotation by itself wouldn't mean nonnegative whole cents. That's more specific than “number.”

JULES: Exactly. The condition uses ordinary JavaScript: not a safe integer, or less than zero. Either problem throws the error.

## A Pure Function Has Fewer Moving Parts

PARISA: This is pleasantly boring. Same subtotal, same fee. It doesn't read a global cart or consult the moon.

JULES: That makes it a useful example of a pure function. For the same inputs it produces the same result, without changing external state. Our specified error behavior is deterministic too.

PARISA: Contrast with a function that reads today's promotion from a server, modifies the cart, and sends a receipt.

JULES: That function combines decisions with effects. To test it, we need to consider the server, cart state, and receipt delivery. Sometimes those interactions are the point, but they add moving parts.

PARISA: Pure doesn't mean morally superior. Eventually a pizza application must do things. A function that only contemplates a receipt will not feed anybody.

JULES: Right. A useful design can separate a calculation from the code that fetches inputs or saves results. Then focused tests cover many calculation cases, while other tests cover the connections.

PARISA: That's not inventing an interface for every line. It's recognizing a decision that already has a clear meaning.

JULES: Exactly. Extracting meaningful logic often improves readability and testability together. Excessive abstraction can make both worse.

PARISA: “Easy to test” is a useful signal, not the sole design objective. A public API shouldn't become incomprehensible just so a test can poke every internal gear.

## Meet the Test, Not the Whole Toolchain

JULES: We'll use Vitest-style examples for most of this series. Full setup comes in Episode Four. For now, we're reading what the test means.

[CODE CARD: JavaScript imports; Vitest test and assertion APIs]
```javascript
import { expect, test } from 'vitest';
import { deliveryFee } from './delivery-fee.js';

test('exactly 2000 cents qualifies for free delivery', () => {
  expect(deliveryFee(2000)).toBe(0);
});

test('1999 cents receives the 300-cent delivery fee', () => {
  expect(deliveryFee(1999)).toBe(300);
});
```

PARISA: The braces in that import select named exports from a JavaScript module. The arrow creates a JavaScript function that the runner will call.

JULES: Yes. Test and expect are functions supplied by Vitest. ToBe is a matcher supplied by its assertion API. None of those names are JavaScript keywords.

PARISA: Audio version: the first named check calls the fee calculation at exactly twenty dollars and requires zero. The second calls it one cent below and requires three dollars.

JULES: The test name explains the scenario. The assertion contains the observation. A failure should let us connect the two.

PARISA: Why not just assert the result is a number?

JULES: Because every wrong fee we've discussed could also be a number. The assertion must distinguish acceptable behavior from the mistakes we care about.

PARISA: “Didn't explode” is sometimes a useful property. It is not a pricing policy.

## Inputs Come in Families

JULES: How many input values should we test? There are many possible subtotals.

PARISA: We group them by the behavior we expect. Valid values below the threshold. The threshold itself. Valid values above. Invalid values that violate different parts of the input contract.

JULES: That's the idea behind equivalence classes: categories we expect the code to handle in the same relevant way. We select representative examples, especially around boundaries.

PARISA: It isn't proof that every member behaves identically. It's a strategy for choosing examples without enumerating the universe.

JULES: Right. Zero matters because it's valid under this contract and near the invalid negative range. Nineteen ninety-nine and twenty distinguish the fee transition. A value above twenty checks the free-delivery side.

PARISA: Then invalid classes: negative, fractional, string, missing value, not-a-number. Maybe infinity. We don't have to teach every one with a separate dramatic monologue.

JULES: But we should choose enough to exercise meaningful guard behavior. If we only test a negative number, removing the integer check might go unnoticed.

PARISA: And if the function is documented to accept only already-validated internal data, its contract could be different. Tests should match the actual boundary decision.

JULES: Yes. Don't assume every private helper must defend against every hostile value. Validate where trust changes, and make internal assumptions clear.

PARISA: Our exported teaching function validates its own argument, so its rejection behavior is part of what we test.

## Errors Are Behavior Too

[CODE CARD: Vitest error assertion — delay the call]
```javascript
test('rejects fractional cents', () => {
  expect(() => deliveryFee(1999.5)).toThrow(RangeError);
});
```

PARISA: There's an extra arrow function. Why?

JULES: We give the matcher a function it can invoke and observe. If we called deliveryFee immediately while preparing the expect argument, the error would escape before the matcher could check it.

PARISA: So the JavaScript arrow is a wrapper that delays execution. ToThrow is the testing API that runs that wrapper and checks the thrown error.

JULES: Exactly. This isn't a special TypeScript spell. It's passing a function as a value, which JavaScript has supported long before arrow syntax.

PARISA: We could use a traditional anonymous function instead. Same idea, more characters.

JULES: And be precise about error expectations. If the contract promises a RangeError, check that. If user-visible wording is a requirement, test it where appropriate. Don't freeze incidental punctuation in an internal message without a reason.

PARISA: Also don't wrap the whole test in a catch that swallows everything. A ReferenceError from misspelling the function is not the rejection we wanted.

JULES: Right. A broad “any error is fine” check can be too permissive. Match the meaningful part of the error contract.

## Identity Isn't Contents

PARISA: Our fee is a primitive number. What if a function returns an object containing subtotal and delivery fee?

JULES: Then the matcher choice matters. For objects, ToBe checks identity rather than recursively comparing their contents. Two separately created objects can contain the same values without being the same object.

PARISA: Ordinary JavaScript distinction. Two shopping bags can contain identical pizzas without being the same bag.

JULES: For checking object contents, a deep-equality matcher such as ToEqual is often appropriate. ToStrictEqual can enforce additional distinctions. Consult the runner's matcher semantics when those distinctions matter.

[CODE CARD: JavaScript object values; Vitest equality matchers]
```javascript
test('describes the expected fee', () => {
  const quote = { subtotalCents: 2000, deliveryCents: deliveryFee(2000) };
  expect(quote).toEqual({ subtotalCents: 2000, deliveryCents: 0 });
});
```

PARISA: That test constructs the quote itself, so it's demonstrating matcher behavior. It doesn't prove an application's quote-building function works.

JULES: Important distinction. If quote-building is production behavior we need to verify, call the real quote builder. Don't build the desired result inside the test and congratulate the application for it.

PARISA: Thank you. A test can accidentally become a small independent app that passes while the actual app burns quietly nearby.

## Mutation: The Surprise Side Effect

JULES: Suppose calculateTotal receives an array of cart items and sorts it in place before summing prices. The returned total is correct, but the caller's cart order changes.

PARISA: If preserving input order is part of the contract, an output-only assertion misses a bug. We need to observe the original array too.

JULES: Yes. A unit test can verify that input wasn't mutated. “Test behavior” doesn't mean “only test return values.” Observable state changes also count.

PARISA: Some operations intentionally mutate. An in-place sort should sort in place. Don't apply purity as a surprise requirement after the function was designed otherwise.

JULES: Exactly. Tests encode the intended contract. If we promise nonmutation, copy the original data appropriately and compare afterward.

PARISA: Appropriately matters. Spreading an array creates a new array but doesn't deeply clone objects inside it. That's JavaScript shallow-copy behavior, not a test-runner bug.

JULES: Great example of “Wait, That's Just JavaScript.” A fixture accidentally sharing nested objects can leak state across tests.

PARISA: Then test order starts determining results. Fresh small data per test is often clearer than a complicated cleanup ritual.

JULES: And freezing inputs can help detect some mutations, but shallow freezing and runtime details have limits. It doesn't replace thinking about the data structure.

## When Testability Reveals Design

PARISA: My old function reads a global cart and a global promotion flag. To test it, I keep resetting globals. Is that a sign I need to rewrite everything?

JULES: No. It's a sign to examine the dependency. Could the calculation accept cart data and promotion information as arguments? That would make the inputs visible.

PARISA: Dependency injection without a container, annotations, or a conference lanyard. Pass the thing the function needs.

JULES: Exactly. Later we'll pass functions for effects. Here, passing data might be enough. But first preserve existing behavior with a test at the boundary you can reach.

PARISA: Especially in legacy code. I don't want a giant rewrite merely to make the first test aesthetically pure.

JULES: Characterization tests capture what existing code currently does. They help protect behavior while we investigate. They don't certify that every captured behavior is desirable.

PARISA: If the old function charges negative delivery, recording it doesn't make negative delivery correct. We distinguish “this is current behavior” from “this is the approved requirement.”

JULES: Then change the behavior intentionally, with the corresponding test updated to the agreed rule.

PARISA: Small steps. One observable boundary. Understand the weirdness before giving it a fashionable new home.

## A Unit Test Cannot Connect the Wires

JULES: Our fee function passes every focused case. Can checkout still charge the wrong amount?

PARISA: Absolutely. The caller might pass dollars instead of cents. It might pass the pre-discount subtotal when policy says post-discount. It might never call this function at all.

JULES: So we also need tests of the integration where those values meet.

PARISA: And a real-browser check may reveal that the display shows an old total after an edit. The calculation can be correct while the experience is wrong.

JULES: Unit tests are valuable because they isolate decisions and give fast precise feedback. That same narrowness limits what they can tell us about the assembled system.

PARISA: That's a tradeoff, not a scandal. A microscope isn't defective because I can't see the whole restaurant through it.

JULES: Nice. And sometimes the most useful test naturally involves several modules. Don't force it into smaller pieces just to earn the unit label.

PARISA: Describe the scope honestly. We will compare these levels properly in Episode Nine.

## Choose the Assertion

JULES: Listener exercise. You are testing a function that removes an item from a cart and returns a new cart. What do you want to observe?

[BEAT]

PARISA: The selected item is absent. Other items remain. Their order is preserved if that's part of the contract. The original cart is unchanged if the function promises a new result. Unknown item behavior needs a decision too.

JULES: Would you check the name of the array helper it uses?

PARISA: No. Filter, a loop, something else—the public result matters. Unless we have a specific constraint that makes the algorithm itself relevant.

JULES: Would you check a hundred unrelated fields on every item?

PARISA: Only if preserving them matters to the behavior under test, and even then I'd choose a clear representative fixture. I'd avoid copying the entire production customer record into the test.

JULES: Synthetic fixtures protect privacy and are easier to understand. Real customer information isn't necessary to prove cart removal.

PARISA: And if a failure report gets uploaded by CI, we haven't accidentally turned a test log into a customer-data export.

## A Legacy Calculation at the Workbench

PARISA: Let's examine a more realistic function. It reads the cart from a module-level variable, gets a promotion from local storage, calculates the fee, and updates a paragraph. Where's the unit?

JULES: We could test that whole behavior in a document environment, but several responsibilities are bundled together. The fee decision itself doesn't need local storage or a paragraph.

PARISA: So first identify what data actually affects that decision. Subtotal and maybe promotion eligibility. Then ask whether the decision can become a function of those inputs.

JULES: Exactly. The existing outer function can still read storage and update the interface. It calls the extracted calculation. A small test suite can cover the rule, while another check verifies that the outer function supplies the right inputs and uses the result.

PARISA: That's useful separation. But I want to hear the danger: extraction can change behavior accidentally. Reading the promotion earlier or later might matter if state changes.

JULES: Yes. Preserve the current ordering and data interpretation unless you're deliberately changing them. Add a check around the old boundary before moving logic when practical.

PARISA: And don't export a private function solely because a test wants to reach it, without considering whether that makes a new public API. Sometimes testing through the module's existing public function is better.

JULES: Right. Testability should inform design, not secretly expand the supported surface. A module can contain private helpers that are covered through its public behavior.

PARISA: Suppose our extracted fee function is four lines and the outer function is forty. Is the four-line test less valuable because it covers less code?

JULES: Not necessarily. It may cover the business decision most likely to cause costly errors. Line count isn't impact. But the outer function's connections still need attention.

PARISA: Good. The little test doesn't claim the whole feature, and the big function doesn't make the little decision unworthy of protection.

## Edge Cases Should Follow the Contract

JULES: Let's say someone adds a test requiring deliveryFee to accept the string twenty-hundred because HTML input values arrive as strings.

PARISA: That changes the contract. Our function currently requires whole numeric cents. We need a parsing boundary that converts user input deliberately before calling it, or an explicit decision to accept strings here.

JULES: Exactly. Tests shouldn't quietly expand behavior just because a caller currently passes the wrong type.

PARISA: Especially with JavaScript coercion. Empty strings, whitespace, and partially numeric text can behave differently depending on the conversion method. A casual conversion can erase useful validation distinctions.

JULES: So parsing gets its own examples: accepted formats, rejected formats, and the output unit. The calculation receives the clean value promised by that boundary.

PARISA: That's also why a test passing null isn't automatically valuable. Is null a possible external value we must reject? A documented internal impossible state? An accidental fixture mistake? The context decides what the test means.

JULES: Right. We want representative invalid inputs, not a collection of bizarre values assembled for sport.

PARISA: Though JavaScript does provide a generous sporting calendar.

JULES: It does. Another example: negative zero. JavaScript distinguishes it from positive zero in some operations. Does our fee contract care?

PARISA: Probably not for this rule, because it represents a zero subtotal either way. Unless the domain says otherwise, I wouldn't invent a separate policy merely because the language can distinguish the values.

JULES: That's a useful discipline. Technical possibilities aren't automatically product requirements.

PARISA: Same with enormous safe integers. Our guard accepts them, but a real ordering system might impose a much smaller business maximum. The example's numeric safety check isn't a restaurant capacity rule.

JULES: Exactly. If the real maximum is relevant, define and test it. Don't confuse a language limit with a business limit.

PARISA: This is making unit tests sound like concentrated requirements conversations.

JULES: Often they are. A small function makes the unanswered question harder to hide.

## A Useful Stopping Point

PARISA: When do I stop adding cases to this little function?

JULES: When the important contract boundaries and plausible failure modes are represented well enough for its risk, and additional examples aren't giving much new information. Revisit that decision when requirements or incidents reveal a gap.

PARISA: So I don't need every subtotal from zero to two thousand to demonstrate that the threshold is inclusive. A few chosen examples plus understanding the implementation can be more useful than thousands of redundant cases.

JULES: Exactly. Later, generated tests can explore broader properties where that adds value. But test quantity isn't the same thing as thoughtfulness.

PARISA: And the stopping point is provisional, like most engineering decisions. We can improve the suite as we learn without treating today's modest beginning as a moral failure.

## Okay, That's Why

JULES: Unit tests give us focused evidence about small, meaningful behavior. Pure functions make that easy because their inputs and outputs are explicit and they avoid external side effects.

PARISA: Choose examples from the contract, include boundaries and meaningful failures, and make assertions that could actually catch the mistakes you care about.

JULES: Don't confuse identity with contents, or TypeScript descriptions with runtime validation.

PARISA: And don't turn “unit” into a purity contest. Tell me what ran and what the test can tell us.

JULES: Next: Arrange, Act, Assert. Why three ordinary steps can make a test much easier to read.

PARISA: The testing sandwich. Finally, a structure I can support without reservations.

[OUTRO MUSIC]

## Production Notes

- Code cards are teaching excerpts. Episode Four provides runner setup. Keep filenames when moving excerpts into a practice project.
- Vitest APIs are explicitly distinguished from JavaScript imports, arrows, object identity, and runtime validation.
- No real pricing library, customer data, or production payment behavior is implied.

## Production References

- Vitest assertions: https://vitest.dev/api/expect.html
- JavaScript safe integers: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger
- JavaScript object identity and strict equality: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality
