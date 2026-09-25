# Episode 9: Unit, Integration, End-to-End — Which Wires Are Connected?

**Series:** JavaScript Testing • Episode 9 of 10
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — Individually Excellent

[INTRO MUSIC]

PARISA: The pricing function works. The API handler works. The cart component works.

JULES: Does checkout work?

PARISA: It charges twenty hundred dollars.

JULES: Ah. Dollars met cents.

PARISA: Individually excellent components have assembled into a financially aggressive website.

JULES: Welcome to *Okay, But Why?*. Today we connect the wires. Unit tests, integration tests, end-to-end tests, and choosing evidence for the risk we actually have.

PARISA: We will not be settling this by drawing a triangle and declaring the triangle correct.

## Names Are a Starting Point

JULES: A unit test usually examines a small behavior with unrelated dependencies controlled. Integration tests examine collaborating parts and their boundaries. End-to-end tests follow a broader workflow through a system from an external entry point.

PARISA: Those categories overlap, and teams draw boundaries differently. Tell me what actually runs.

JULES: Yes. Is the database real? Is the HTTP client real? Is the server running? Is the browser real? Are third-party responses replaced?

PARISA: “End-to-end” can hide a very large footnote. If payment is stubbed, say so. The test may still be valuable, but it hasn't verified the actual payment provider.

JULES: Exactly. A concrete scope statement is more useful than winning a label argument.

PARISA: Also, a real browser doesn't automatically make a test end-to-end. Last episode's component could run in a browser with all network requests replaced.

JULES: Right. Environment and scope are separate. And a server integration test can exercise important real components without any browser at all.

## Three Views of One Promise

JULES: Our promise is that an eligible order gets the right delivery fee and the customer sees the accepted total.

PARISA: At the small scope, test the fee calculation across boundary inputs. Fast, clear failures, lots of examples.

JULES: At the integration scope, call the quote or order endpoint with a controlled cart and verify that it loads prices, computes the fee, and returns the intended response shape.

PARISA: Include the real collaborators whose connection matters. If the bug is cents versus dollars at the API boundary, the test needs that conversion path.

JULES: At the broad workflow scope, a browser adds a pizza, reviews checkout, submits an order in an isolated test system, and observes confirmation.

PARISA: That checks a longer chain, including wiring and user interaction. It's more expensive and can have more potential failure causes.

JULES: Exactly. The scopes answer related but different questions. One broad test doesn't replace all the focused boundary examples, and fifty focused tests don't prove the user journey is connected.

PARISA: Microscope, workbench, walk through the restaurant. Each view misses things the others can see.

## Integration Means Real Cooperation

JULES: Suppose a quote service receives a repository dependency. If we replace the repository with a fake returning prices, we test the service's response to those prices.

PARISA: But not the query that gets them from the database. If the query reads the wrong column, our fake politely conceals the problem.

JULES: A database integration test can use the real query code against an isolated instance of the actual database technology, with controlled data.

PARISA: Then we can observe constraints, serialization, transactions, and query semantics the in-memory fake may not reproduce.

JULES: Yes. The setup costs more, but it buys evidence at a meaningful boundary.

PARISA: Don't replace a production PostgreSQL database with a convenient in-memory database and assume every behavior transfers. Different engines can differ in types, constraints, SQL, and concurrency.

JULES: Exactly. Sometimes a substitute is an intentional compromise. Document what it excludes.

PARISA: Integration testing isn't “all dependencies must always be real.” It's “the collaborators relevant to this question cooperate for real.” We can still isolate unrelated external services.

## An API Test Can Catch the Trust Boundary

JULES: The browser sends a total of one cent for a twenty-dollar pizza. What should the server do?

PARISA: Apply its authoritative pricing rules and input validation. It mustn't trust the submitted total merely because our client has a tested calculator.

JULES: An API integration test can submit a tampered request and verify the specified behavior: reject inconsistent data or ignore untrusted price fields and calculate authoritatively, depending on the API contract.

PARISA: The expected behavior needs to be explicit. Don't invent a status code in the test because it sounds stern.

JULES: Right. Another important case: one customer's credentials request another customer's order. The server should enforce the actual authorization policy.

PARISA: A component test showing no View other order button cannot establish that. We must exercise the protected server operation.

JULES: And test relevant denial cases as well as allowed cases. Security rules often live in the paths users are not supposed to complete.

PARISA: These tests still aren't a complete security review. But they protect specific boundaries where a UI-only suite can leave a dangerous blind spot.

## Set Up Data Without Making a Second Journey

JULES: For an order-confirmation browser test, should every test create an account through the registration UI, verify email, sign in, create menu items, and then order?

PARISA: Not necessarily. That makes every test depend on every preceding feature. Use controlled setup through an appropriate test API or fixture when registration isn't the question.

JULES: Then keep separate tests for registration and sign-in themselves.

PARISA: Exactly. Arrange the necessary state efficiently, then exercise the actual behavior under test. The setup method should be available only in an appropriate test environment and shouldn't create a production backdoor.

JULES: Good boundary. Synthetic accounts, unique records, and isolated storage help prevent tests colliding.

PARISA: Especially in parallel execution. Two tests editing the same cart can manufacture a race unrelated to the intended scenario.

JULES: Cleanup or disposable environments can help. Database transactions are useful in some test setups, but not every application request shares the test's transaction.

PARISA: If the server uses another connection, rolling back my setup connection may not undo its writes. Understand the actual lifecycle.

## A Browser Journey in Plain Terms

JULES: Here's a Playwright-shaped example for a hypothetical local test application. It assumes a seeded twenty-dollar Mushroom pizza and an isolated order endpoint. It's an illustration of the journey, not an executable test of this podcast repository.

[CODE CARD: JavaScript; Playwright runner and browser APIs — hypothetical fixture app]
```javascript
import { test, expect } from '@playwright/test';

test('a customer can place the seeded pickup order', async ({ page }) => {
  await page.goto('/menu');
  await page.getByRole('button', { name: 'Add Mushroom pizza' }).click();
  await page.getByRole('link', { name: 'Checkout' }).click();
  await expect(page.getByRole('status')).toHaveText('Total: $20.00');
  await page.getByRole('button', { name: 'Place pickup order' }).click();
  await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible();
});
```

PARISA: Page comes from Playwright's test fixture. The braces in the callback parameter use JavaScript object destructuring. Async and await are JavaScript. GetByRole, goto, and the browser assertions are Playwright APIs.

JULES: Correct. The relative URL assumes a configured baseURL for an isolated local test application. That setup and seeded data must exist before this card can run.

PARISA: Audio sequence: open menu, add the named pizza, open checkout, verify the total, place the pickup order, and wait for confirmation.

JULES: We used pickup to avoid silently inventing address and delivery-fee requirements for this separate fixture. The earlier delivery calculation remains a different explicit scenario.

PARISA: And no real payment is charged. The test system must make that boundary safe and clear.

## What Did That Journey Actually Prove?

JULES: The browser saw the expected confirmation. Does that prove the order exists in durable storage?

PARISA: Not necessarily. The interface could display confirmation prematurely. If persistence is part of this test's purpose, verify it through an appropriate observable boundary, such as retrieving the confirmed order.

JULES: Exactly. Or cover persistence in a separate integration test, while this journey focuses on the user path. The claim should match the assertions.

PARISA: The code card checks a particular seeded path and visible states. It doesn't prove all payment, cancellation, or outage behavior.

JULES: Right. It also doesn't prove every supported browser works unless we actually run configured browser projects and evaluate their outcomes.

PARISA: Nor all viewport sizes. A desktop pass doesn't guarantee a mobile checkout isn't trapped behind a fixed footer.

JULES: Broader environments increase evidence but also execution and maintenance cost. Choose based on support requirements and risk.

## Waiting in a Browser

JULES: Browser tools can wait for actionability and retry certain assertions. That's more useful than inserting sleeps between every interaction.

PARISA: But know which operations wait and what they wait for. A click being possible doesn't mean the order is saved afterward.

JULES: Exactly. Await a meaningful confirmation or other state. Use resilient locators based on roles, labels, or explicit stable test contracts.

PARISA: Long CSS paths are like directions that say turn left at the chair we might move tomorrow.

JULES: And forcing a click can bypass useful checks. Sometimes necessary for a particular scenario, but don't use it to ignore an overlay that would block a real user.

PARISA: A failing actionability check may be a product bug, a timing problem, or a wrong target. Investigate before disabling the guard.

JULES: Screenshots, traces, and logs help reconstruct what happened. Use them deliberately, and avoid sensitive information in test artifacts.

## The Pyramid Is a Heuristic

PARISA: Let's confront the triangle.

JULES: A test pyramid suggests many cheap focused tests, fewer integration tests, and fewer expensive broad workflow tests. It's a heuristic about feedback and maintenance costs.

PARISA: Not an instruction to count test files until they form a sacred ratio.

JULES: Exactly. Some applications benefit heavily from integration tests because most risk lies in composition. Different teams use different shapes to emphasize that.

PARISA: A thin CRUD application may have little complex pure logic but important database and authorization boundaries. Forcing thousands of unit tests could create mock-heavy noise.

JULES: A library with complex deterministic algorithms may benefit from many focused cases. The useful distribution follows the system's responsibilities.

PARISA: Speed matters, but so does what the test can detect. A test that's extremely fast because it replaced every relevant behavior isn't necessarily efficient.

JULES: Right. Think in terms of confidence, diagnostic value, execution cost, and maintenance cost. Not test-count aesthetics.

## Put the Bug at the Lowest Useful Scope

JULES: A delivery threshold comparison is wrong. Where do you reproduce it?

PARISA: A focused function test can express the boundary precisely. I don't need to click through checkout for every integer around twenty dollars.

JULES: The server reads cents as dollars?

PARISA: Integration test through the serialization or adapter boundary where the mismatch occurs. A pure calculation test with correctly prepared cents won't catch that wiring bug.

JULES: The confirmation button is covered by a sticky footer only at a narrow viewport?

PARISA: Real-browser or visual/layout evaluation in that viewport. Jsdom doesn't reproduce the layout.

JULES: Good. “Lowest useful scope” means the narrowest test that includes the actual failure mechanism, not always a unit test.

PARISA: And sometimes a broader regression test remains worthwhile even after adding the narrow one, especially for a critical journey. But don't duplicate every case at every layer automatically.

## Third Parties Are Boundaries, Not Props

JULES: What about payment providers, email services, and identity providers in end-to-end tests?

PARISA: Choose intentionally. Most frequent tests should avoid unnecessary real external calls. Use controlled responses for application behavior, and targeted sandbox integration tests for the actual adapter where needed.

JULES: A sandbox is useful but not identical to production. Keep that limitation visible.

PARISA: And tests mustn't charge real cards, email customers, or alter real accounts unless an explicitly authorized operational check is designed for that purpose. Ordinary development tests should be isolated.

JULES: Network restrictions and least-privilege test credentials can help enforce the intended boundary.

PARISA: Also distinguish contract tests from broad journeys. A contract check can verify request and response compatibility without walking through the entire interface.

JULES: Right. A schema match alone may miss semantics: a field can be the right type but the wrong units or meaning.

PARISA: Twenty hundred dollars has returned, wearing a valid number type.

## Failure Diagnosis Changes with Scope

JULES: A small calculation test fails. You have a short list of likely causes.

PARISA: Function behavior, expectation, or setup. Often one clear assertion.

JULES: A broad checkout journey fails at confirmation. Many causes are possible: browser interaction, frontend state, network request, server validation, persistence, test data, or environment availability.

PARISA: That's the cost of including more wires. Good diagnostics matter more. Capture where the workflow stopped and the relevant request or application state.

JULES: And don't interpret every broad-test failure as a flaky test. It might have caught a real integration problem.

PARISA: Conversely, don't blame the product before checking whether test data was stale or setup failed. Evidence needs interpretation at every scope.

JULES: A layered suite can help localize failures. If fee tests pass but the API quote fails, investigate the connection rather than rewriting arithmetic blindly.

PARISA: Multiple views help diagnosis as well as detection.

## A Practical Test Plan for the Restaurant

JULES: Let's spend a limited testing budget. What gets focused tests?

PARISA: Delivery thresholds, discount eligibility, order-state transitions, and validation rules with many meaningful boundary cases.

JULES: Integration tests?

PARISA: API parsing and serialization, authoritative pricing, database persistence and constraints, authorization, and the adapters connecting our code to external contracts.

JULES: Browser journeys?

PARISA: A small set of critical paths: placing an order, recovering from a rejected request, editing a cart, and relevant keyboard navigation. Add supported browser or viewport coverage where the product needs it.

JULES: Manual exploration?

PARISA: Absolutely. Wording, confusing transitions, real assistive-technology use, unexpected combinations, and new risks nobody has encoded yet.

JULES: Operational checks?

PARISA: Appropriate monitoring and deployment verification for the actual system. A pre-deployment test suite doesn't tell us whether today's production dependency is healthy.

JULES: That's a test strategy shaped by responsibilities rather than a package catalog.

## Listener Workshop — Classify by Contents

JULES: A test runs a real browser, renders one React component, and intercepts all HTTP calls. What is it?

PARISA: A browser-based component test with controlled network responses. Calling it end-to-end would hide the missing server path.

JULES: A test calls an HTTP endpoint backed by the real database in a disposable environment, no browser?

PARISA: An API integration test. It can cover important application and persistence boundaries without testing the user interface.

JULES: A test calls the fee function with three subtotal values?

PARISA: A focused unit-style test of the fee rule. Its narrowness is exactly why it can be fast and diagnostic.

JULES: Which is best?

PARISA: For what question? That is the whole episode, Jules.

JULES: I wanted you to say it.

## A Deployment Boundary the Component Cannot See

JULES: Our React route works when reached by clicking a link, but refreshing that URL returns a server error. Which test could have caught it?

PARISA: A browser or deployment check that loads the route directly through the actual serving setup. A memory-router component test doesn't include the server's route fallback behavior.

JULES: Exactly. The component can be correct while deployment wiring is wrong.

PARISA: Same with asset paths, caching headers, authentication redirects, or an API base URL. A local component fixture may bypass those decisions entirely.

JULES: So a small smoke test against an isolated deployed environment can be valuable. It doesn't need to repeat every arithmetic case; it checks that the assembled system starts and its critical entry points work.

PARISA: But be clear about the environment. A local server with development fallbacks may behave differently from the production hosting configuration.

JULES: Right. The more the check resembles the relevant deployment boundary, the more it can tell us about that boundary. It still needs safe data and appropriate permissions.

PARISA: And if a deployment smoke test fails, don't immediately change application logic. Check configuration, routing, dependency availability, and the artifact that was actually deployed.

JULES: Different scope, different likely causes.

## The Database Cleanup Puzzle

PARISA: We have two parallel integration tests. Each creates an order, and each cleans up by deleting every order afterward. I foresee a social problem.

JULES: One test can delete the other's data while it's still running. The cleanup is broader than the test's ownership.

PARISA: Use unique identifiers and remove only owned data, or provide separate databases, schemas, or disposable environments where appropriate. The best choice depends on the application's setup.

JULES: Exactly. Also account for background jobs that may still access the data after the request returns.

PARISA: If the order triggers an asynchronous worker, deleting the record immediately can create unrelated errors. Either control that worker boundary or wait for the intended lifecycle before cleanup.

JULES: A broad test's arrange and teardown need the same care as its assertions. Otherwise the suite creates its own incidents.

PARISA: And please don't point cleanup code at a database chosen by a convenient default. Require an explicit test environment and verify the target through safe configuration.

JULES: Yes. Isolation is part of test design, not an optional convenience after the code works.

## Avoid Repeating the Same Expensive Proof

JULES: A team has fifty delivery-fee boundary cases, each running through the browser. They're slow. What would you change?

PARISA: Move the exhaustive decision examples to focused tests of the actual fee function. Keep a smaller number of integration cases that verify units and data flow, plus the critical browser journey.

JULES: Would you delete all browser checks involving totals?

PARISA: No. The display and checkout connection still matter. I'd remove redundant combinations, not the evidence that the real interface uses the right result.

JULES: Another team has five hundred unit tests with mocks and no integration test. Their server serializes dates incorrectly.

PARISA: Add a check through the real serialization boundary. More mock-heavy unit cases won't necessarily include the failure mechanism.

JULES: So optimization isn't simply making the suite smaller or larger.

PARISA: It's moving effort to where it buys evidence. Sometimes that means fewer broad cases and more focused ones. Sometimes it means adding the integration test everyone avoided because setup was inconvenient.

JULES: And if setup is repeatedly painful, improving the test environment may have a high payoff.

PARISA: Yes, as a concrete need. Not a giant testing platform commissioned before we know which checks we're trying to run.

## A Name That Helps the Next Developer

JULES: How would you name a script that runs browser component tests with a mocked network?

PARISA: Something that says browser components, with documentation explaining the network replacement. I wouldn't call it all-e2e and let the footnote live in one person's memory.

JULES: And a suite against a real local database?

PARISA: Integration database or similarly clear wording, plus prerequisites and isolation rules. The exact naming convention matters less than making its scope discoverable.

JULES: Useful reports can list those groups separately too.

PARISA: Yes. Then when we say a check passed, the listener knows which part of the system was exercised. Precision is not pedantry when it changes the confidence we should have.

## The Scope Sentence

JULES: Before choosing a tool, finish this sentence: this test runs these parts for real and replaces these other parts so we can learn this specific thing.

PARISA: If the sentence is hard to finish, the test may need a clearer purpose. It can also expose a missing boundary before we spend time writing setup.

JULES: For example: real quote endpoint and database, controlled external availability response, checking authoritative pricing and persistence.

PARISA: Or real browser and component, replaced network, checking keyboard interaction and rendering. Both useful, different claims.

JULES: That sentence travels well across runners, frameworks, and testing philosophies.

PARISA: Unlike a triangle, it tells me which wires are actually connected.

## Okay, That's Why

JULES: Test scopes exist because we need different views of behavior: decisions, connections, and complete workflows.

PARISA: Describe what runs for real and what's replaced. Choose the narrowest useful scope, keep critical connections represented, and don't mistake a testing shape for a universal recipe.

JULES: Next, the finale: coverage percentages, mutation testing, and everything a green dashboard cannot promise.

PARISA: We have connected the wires. Now we refuse to worship the meter.

[OUTRO MUSIC]

## Production Notes

- Playwright card is explicitly hypothetical: requires a separate local fixture app, baseURL, seeded menu, and isolated order backend. It was not executed against the podcast repository.
- No real payment, customer email, production account, or third-party mutation is authorized by these examples.
- Preserve the distinction between execution environment and test scope.

## Production References

- Playwright writing tests: https://playwright.dev/docs/writing-tests
- Playwright fixtures: https://playwright.dev/docs/test-fixtures
- Playwright test isolation and resilient behavior checks: https://playwright.dev/docs/best-practices
- Playwright browser contexts: https://playwright.dev/docs/browser-contexts
