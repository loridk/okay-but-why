# Episode 4: Jest, Vitest, and Who Actually Runs This Stuff?

**Series:** JavaScript Testing • Episode 4 of 10
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — The Button Under the Button

[INTRO MUSIC]

PARISA: I understand the test. I do not understand what happens when I type npm test.

JULES: It runs the test script defined in package.json.

PARISA: Which runs a runner.

JULES: Usually.

PARISA: Which runs JavaScript in something that may pretend to be a browser, after something else transforms it.

JULES: Depending on the project.

PARISA: Excellent. The straightforward command is hiding a small airport.

JULES: Welcome to *Okay, But Why?*. Today we're opening the airport map. Test runner, assertions, environment, transformations, watch mode, and continuous integration.

PARISA: And whether Jest and Vitest are rival languages. Spoiler: I suspect they are not.

## Separate the Jobs

JULES: First job: find tests, load them, schedule them, and report outcomes. That's the test runner.

PARISA: It sees files matching its configuration, registers the named cases, and invokes their callbacks. It also needs to know when a case is finished.

JULES: Second job: compare actual behavior with expected behavior. That's assertion functionality. Expect and its matchers are one style. Node's assert module is another.

PARISA: Third: provide the environment where the code executes. Node has JavaScript and server-oriented APIs, but it doesn't ordinarily provide a browser document just because my code would like one.

JULES: Exactly. Fourth: transform code when needed. JSX or TypeScript may need processing before execution in the selected environment.

PARISA: Fifth: mocks, reports, coverage, and other supporting features. Some tools bundle many of those jobs.

JULES: Jest and Vitest bundle a lot. That convenience can make the boundaries harder to see, but they're still conceptually different responsibilities.

PARISA: So “my test framework” might refer to a package that includes a runner, assertions, mocking, and more. We shouldn't assume the word framework identifies one precise job.

JULES: Right. And DOM Testing Library, which we'll use later, is not itself the thing scheduling all our test files.

PARISA: Good. Put a pin in that before somebody tries to replace a runner with a query function.

## Why These Two Names?

JULES: Jest is an established JavaScript testing framework with an extensive ecosystem. Vitest is built around Vite's tooling and can fit naturally into projects already using Vite.

PARISA: Natural fit isn't a commandment to migrate. Existing Jest configuration, tests, integrations, and team knowledge have value.

JULES: Absolutely. Their familiar test and expect styles make examples look similar, but compatibility isn't universal. Module handling, mocks, configuration, environments, and version-specific details can differ.

PARISA: A search-and-replace from jest to vi is not a migration plan.

JULES: Correct. For this series we're choosing Vitest for a consistent example vocabulary. We're teaching transferable testing ideas and identifying tool-specific details.

PARISA: And if I'm working in an established Jest repository, my sensible first move is to learn and use its setup, not install a second runner to make a podcast example match exactly.

JULES: Yes. Look at package.json, existing tests, configuration, and project instructions. Run the documented command before changing the machinery.

PARISA: This is one place where boring consistency is genuinely useful. The best test tool is not necessarily the one with the freshest logo.

## A Small Practice Project

JULES: If you're starting a separate practice directory, the companion shows the minimal shape. It isn't an instruction to alter an existing application's package file wholesale.

[CODE CARD: JSON package metadata — merge scripts into an existing project]
```json
{
  "type": "module",
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

PARISA: This is JSON, not JavaScript and not testing-language syntax. Type module tells Node how to treat ordinary .js files in this package. It supports the import and export style our examples use.

JULES: The scripts object names commands npm can invoke. Test runs Vitest's normal local mode. Test colon run is just a script name we chose for a single run.

PARISA: The colon in the name isn't a special dependency relationship. Npm doesn't infer that test:run is a child process of test because the names look related.

[TERMINAL]
```text
npm install --save-dev vitest
npm run test:run
```

JULES: The first command installs Vitest as a development dependency in that practice project. The second invokes our package script, using the installed local executable.

PARISA: These are terminal commands. Save-dev records a development tool dependency; it doesn't mean the package is incapable of executing code.

JULES: Right. Installation and test execution can run code with the permissions of the developer or CI job. Use trusted packages and normal dependency review, and don't give tests production credentials casually.

PARISA: Also check the current tool's supported Node version before installing. We're deliberately not hard-coding a “latest” version that this episode will outlive.

JULES: Commit the relevant package metadata and lockfile in a real project so the team has a reproducible dependency baseline. These podcast files don't install a runner into the audio-production project.

## How the File Gets Found

PARISA: Where does our delivery test live?

JULES: A file such as delivery-fee.test.js, next to delivery-fee.js, is a common straightforward arrangement. Vitest's defaults recognize test or spec patterns, and configuration can change discovery.

PARISA: The filename isn't JavaScript semantics. It's a convention the tool uses to decide what to load.

JULES: Exactly. The test file imports the real function and imports test and expect from Vitest. Explicit imports make the origin of those names visible.

PARISA: Some projects configure globals so test and expect exist without importing. That can be convenient, but it makes a newcomer wonder whether JavaScript acquired an expect keyword overnight.

JULES: Which is why we use explicit imports here. Then the runner loads the module, collects the cases, invokes their callbacks, and reports assertions or unexpected errors.

PARISA: If it says no tests found, I shouldn't celebrate the absence of red. Check the working directory, naming pattern, inclusion and exclusion settings, and whether the file actually contains registered cases.

JULES: Yes. A successful command that ran zero relevant checks may provide no evidence about your change. Read the discovered test count and filenames.

PARISA: “Nothing failed” and “the thing was tested” are different statements.

## Watch Mode Is a Feedback Loop

JULES: During development, watch mode keeps the runner alive and reruns tests as files change. It shortens the loop between an edit and feedback.

PARISA: Like live reload, but the thing updating is my evidence. It isn't a daemon secretly publishing code.

JULES: Correct. A one-shot run executes and exits, which is useful in scripts and CI. That's why our test:run command uses vitest run explicitly.

PARISA: Because a process waiting for me to press a key is not a good final step in an unattended build.

JULES: Exactly. Runners may adjust defaults in CI, but explicit commands make intent clearer. Exit status matters: automation needs a machine-readable failure signal, not just red text.

PARISA: A wrapper that catches every failure and exits successfully can neutralize the whole setup. Printing “tests failed” while returning success is a very polite way to ship the bug.

JULES: And local filters are useful, but don't forget the wider suite before considering a change ready. A focused run answers a focused question.

PARISA: If I run only delivery-fee.test.js, I haven't checked the integration that passes it the subtotal.

## The Environment Is Not the Runner

JULES: Our pure fee function works in a Node environment. It doesn't need a DOM.

PARISA: Then I wouldn't add a fake browser to help it subtract zero.

JULES: Right. For DOM-oriented tests, an environment such as jsdom provides many browser-like document APIs. It isn't a full rendering browser.

PARISA: So an error saying document is not defined usually means our selected environment doesn't provide document, not that the assertion library has lost confidence.

JULES: Exactly. We choose the environment that suits the behavior. Real-browser testing is another option, with different capabilities and costs. Modern tools can support browser-based component tests too.

PARISA: Important distinction: real browser does not automatically mean end-to-end. A component test in a real browser can still replace the network and render just one component.

JULES: Yes. Execution environment and test scope are separate axes. We'll keep those separate in Episode Nine.

PARISA: And Node version differences matter. A test using a built-in API present in one version may fail in another. Make the project's runtime expectations explicit.

JULES: Same principle for browser APIs. A simulated environment might not implement an API, or might behave differently from a supported browser.

PARISA: Polyfilling something in setup isn't proof the production browser supports it. It changes our test environment.

## JSX Is Not an Assertion Feature

JULES: When we reach React, our test may contain JSX, the angle-bracket element syntax.

PARISA: JSX is a syntax extension used with React and other tooling. It isn't ordinary JavaScript syntax a raw Node process necessarily accepts, and it isn't TypeScript simply because it looks unfamiliar.

JULES: The project transforms JSX into executable JavaScript. Vitest can use the project's Vite configuration and relevant plugins; Jest projects have their own transformation setup.

PARISA: So “unexpected token angle bracket” may be a transform configuration issue. Rewriting the assertion won't fix a file the runner can't parse.

JULES: Exactly. Similarly, executing a TypeScript test after transformation doesn't necessarily mean a full type check happened. Transpilation and type checking are different jobs.

PARISA: Compile-time analysis versus runtime evidence, again. A project may need a separate type-check command alongside its tests.

JULES: Neither replaces the other. A type checker can catch certain inconsistencies without running examples; a runtime test can verify a pricing expectation the type system doesn't encode.

PARISA: And both can be satisfied while the product requirement is wrong. Our favorite recurring limitation has returned.

## Configuration Should Earn Its Place

JULES: Do we need a configuration file for the tiny fee example?

PARISA: Not merely to prove we're serious. If defaults handle plain JavaScript tests in Node, start there.

JULES: Then add configuration for actual needs: environment, setup files, coverage scope, project paths, transforms, or separate test groups.

PARISA: Keep each addition explainable. A copied configuration containing ten unexplained flags is future archaeology.

JULES: Existing Vite configuration can matter because it may include aliases and plugins the application uses. A separate test configuration can change how those are picked up or merged, so follow the current docs and the project's established pattern.

PARISA: And changing module format isn't a harmless styling preference. Mixing CommonJS require and ESM imports can expose real compatibility constraints.

JULES: Right. We use an isolated ESM practice example. We don't tell everyone to add type module to an established package and hope nothing else noticed.

PARISA: That's the kind of tiny config edit that can become an afternoon.

## Node Can Test Too

JULES: One more useful name: Node includes a built-in test runner. You don't always need a third-party framework for ordinary server-side JavaScript checks.

[CODE CARD: JavaScript ESM; Node test and strict assertion APIs]
```javascript
import test from 'node:test';
import assert from 'node:assert/strict';

test('twenty dollars qualifies', () => {
  const fee = 2000 >= 2000 ? 0 : 300;
  assert.equal(fee, 0);
});
```

PARISA: This isolated card demonstrates the API shape. In an application test we'd import the real deliveryFee function instead of repeating its expression.

JULES: Correct. Node colon test and Node colon assert identify built-in Node modules. The JavaScript import syntax is the same; the testing functions come from a different provider.

PARISA: So we can recognize the concept across tools. Prepare a situation, perform an operation, assert something meaningful. Different reporting and convenience features around it.

JULES: Exactly. Tool choice depends on the project. The existence of a built-in option doesn't make established Jest or Vitest setups pointless.

## Continuous Integration Is Another Place to Run It

PARISA: CI sounds grander than what we're doing here.

JULES: Continuous integration systems run defined jobs when changes are proposed or integrated. A test job checks out code, installs the intended dependencies, runs the command, and reports the result.

PARISA: Ideally in a clean, repeatable environment. So it can catch “works because my laptop has an untracked file” problems.

JULES: Yes. But CI doesn't create good tests automatically. It repeats the suite we give it under the configured conditions.

PARISA: Keep privileges small. A job testing an untrusted contribution shouldn't casually receive deployment secrets. Test code is executable code, including setup and dependency scripts.

JULES: And keep artifacts appropriate: failure reports can include request data, screenshots, and logs. Use synthetic test accounts and avoid recording sensitive information.

PARISA: If local passes and CI fails, compare versions, operating-system assumptions, environment variables, timing, locale, and filesystem case sensitivity. Don't begin by accusing the cloud of personality defects.

JULES: Even if it has several.

## Listener Triage

JULES: Three failures. First: npm says the test script doesn't exist.

PARISA: Check package.json and the working directory. Npm cannot run a script that hasn't been defined there.

JULES: Second: document is not defined.

PARISA: Check whether this is a DOM test running in Node without a DOM environment. Don't add jsdom to a pure function test unless it actually needs document.

JULES: Third: the runner loads the file but says expected zero, received three hundred.

PARISA: Now we're probably at the behavior or expectation layer. Read the named scenario, actual function call, and rule. We made it through discovery and parsing.

JULES: Good. Knowing which layer failed prevents random configuration changes.

PARISA: And each fix should answer the observed problem. “I installed seven packages and it stopped yelling” is not a durable explanation.

## Follow One Command All the Way Through

PARISA: Let's follow the command slowly, because this is where toolchains become fog. I'm in the practice directory. I type npm run test:run. What happens first?

JULES: Npm reads the package scripts for that project and finds our test:run entry. That entry says vitest run. Npm makes the project's installed command-line tools available while running the script.

PARISA: So the version used is normally the one installed for the project, not necessarily something I once installed globally.

JULES: Exactly. Then Vitest reads applicable configuration, discovers matching files, prepares the configured runtime environment, and loads the test modules through its tooling.

PARISA: Loading the module executes its top-level JavaScript. That means the test declarations register cases. It also means random top-level side effects can happen before any individual test begins.

JULES: Yes. Avoid starting servers, sending requests, or mutating important data at module load merely because it's a test file. Put lifecycle work where the runner can manage it and where the scope is clear.

PARISA: Then the callbacks run, assertions either succeed or throw, and the runner collects results. Async callbacks need to return their completion promise, as we'll cover later.

JULES: Correct. Finally the report tells us which files and cases ran, and the process exits with an appropriate status. Our outer automation can use that status to decide whether the check succeeded.

PARISA: That's much less mystical. Npm dispatches a configured command. The runner handles discovery and execution. JavaScript executes the actual behavior. Assertions express disagreement.

JULES: Exactly. When something fails, identify which step failed. Installation, script lookup, discovery, transformation, environment setup, test execution, or assertion.

PARISA: Otherwise we start fixing the wrong layer. Updating a matcher won't solve a missing dependency, and reinstalling dependencies won't correct a delivery threshold.

## A Realistic First Failure

JULES: You create delivery-fee.test.js and run the command. It says it can't resolve delivery-fee.js. What do you inspect?

PARISA: The import path relative to the test file, filename spelling, extension, and whether the file exists. If the path uses an alias, verify the test tool knows that alias.

JULES: Then it loads, but says expect is not defined.

PARISA: In our explicit-import convention, I probably omitted expect from the Vitest import. I don't need to enable globals across the entire project to repair one missing import.

JULES: Then it passes. You change the threshold comparison to the known wrong version, but it still passes.

PARISA: Now I check whether I edited the file actually imported, whether the boundary test was discovered, and whether the assertion observes the real result. A green report isn't enough if the intended test didn't run.

JULES: Good. Tools can be configured correctly while the evidence is still wrong.

PARISA: And the opposite: a tool configuration failure doesn't prove the application logic is broken. Keep the diagnosis tied to the layer.

## Choosing Without a Migration Crusade

JULES: Suppose the existing application uses Jest and a colleague suggests Vitest because it's newer. How would you evaluate that?

PARISA: Ask what problem the change solves. Slow feedback? Difficult ESM integration? Duplicate transform configuration? A missing feature? Then compare migration cost and compatibility, not just marketing adjectives.

JULES: We'd try representative tests, especially ones with module mocks, environment setup, timers, and transforms. Simple arithmetic passing doesn't prove the whole suite migrates cleanly.

PARISA: Exactly. Measure the actual workflow if speed is the motivation. Startup time, targeted reruns, full CI runs, memory use, and failure diagnostics can matter differently.

JULES: And keep the test behavior stable while changing runners when possible, so a migration doesn't simultaneously rewrite every assertion and application interface.

PARISA: Separate changes make disagreements easier to understand. If both the runner and the expected behavior change, we have two explanations for every result.

JULES: Would you ever keep both runners?

PARISA: During a deliberate migration or for distinct justified needs, maybe. But two overlapping setups add maintenance. Don't accidentally create that complexity by following an isolated tutorial inside an established repository.

JULES: Good. The podcast's consistent Vitest vocabulary is for teaching. It isn't a judgment on every project's existing choice.

## Reading Documentation Without Adopting Every Example

PARISA: One last modern-tooling trap: docs show TypeScript configuration, and the listener thinks TypeScript is required to run JavaScript tests.

JULES: Good catch. Documentation often uses TypeScript for richer editor information, but check whether the tool also accepts JavaScript configuration. Our examples deliberately use JavaScript.

PARISA: If you see a type annotation in a documentation snippet, identify it before copying. It's not a test runner feature merely because it appears on the runner's website.

JULES: And version matters. Search results can land on old, next, or migration documentation. Check that the instructions apply to your installed version and chosen environment.

PARISA: That's not busywork. A small API difference can explain a confusing failure faster than an hour of rearranging code.

JULES: Record the supported setup in the project. Then future developers don't need to reconstruct why three apparently similar commands behave differently.

PARISA: A useful README beats institutional memory stored in one person's browser tabs.

## The Smallest Successful Run

JULES: What's our first setup milestone?

PARISA: One discovered test calling the real fee function, with a meaningful passing assertion. Then a deliberate local mismatch that fails for the expected reason, followed by restoring the correct code.

JULES: Not coverage, browser projects, reporters, and parallel workers all at once.

PARISA: Exactly. Once the basic loop works, each additional tool should solve a concrete problem we can explain. The next milestone might be a DOM environment because we're actually testing a document.

JULES: That makes troubleshooting easier too. If we add one capability and the setup fails, we have a smaller change to inspect.

PARISA: Small understandable steps aren't less professional. They let us know why the final configuration works instead of merely knowing which collection of files stopped the errors.

## Okay, That's Why

JULES: Test runners coordinate execution. Assertions express expectations. Environments provide runtime capabilities. Transforms handle syntax the runtime doesn't directly execute.

PARISA: Jest and Vitest bundle useful tooling, but our tests are still JavaScript using APIs. Npm is invoking a configured command, not discovering the meaning of quality.

JULES: Next: mocks, stubs, spies, and other lies we tell our code.

PARISA: Finally, an episode about professional dishonesty with cleanup hooks.

[OUTRO MUSIC]

## Production Notes

- Setup commands are for an isolated practice project, not the podcast repository. No dependencies were installed by these script examples.
- Check current supported runtime/tool versions before recording a live installation. Avoid claims that the documentation's newest release is universally appropriate.
- Node API card is a syntax comparison; deliveryFee implementation and real function tests are established in Episodes Two and Three.

## Production References

- Vitest getting started and single-run mode: https://vitest.dev/guide/
- Vitest environments: https://vitest.dev/guide/environment.html
- Jest getting started: https://jestjs.io/docs/getting-started
- Node test runner: https://nodejs.org/api/test.html
- npm scripts: https://docs.npmjs.com/cli/using-npm/scripts
