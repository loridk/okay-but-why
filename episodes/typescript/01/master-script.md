# Episode 1: JavaScript With a Complicated Little Hat

Status: Draft

## Cold Open

PARISA: JavaScript has worked for decades. Who asked for JavaScript with paperwork?

JULES: Mostly developers whose JavaScript worked perfectly until a value was the wrong shape in production.

PARISA: So TypeScript prevents runtime errors?

JULES: No.

PARISA: Excellent. Strong product pitch.

JULES: It can prevent some runtime errors.

PARISA: Ah. So JavaScript, but with terms and conditions.

JULES: JavaScript with a very anxious proofreader.

PARISA: That I understand.

JULES: Before your code runs, TypeScript looks through it and says things like, “You think this is a number, but three functions ago someone replaced it with the word banana.”

PARISA: And JavaScript’s position is?

JULES: “Let’s find out.”

PARISA: See, that is the reckless confidence on which the web was built.

JULES: And TypeScript exists because eventually developers wanted the web to be built with slightly less reckless confidence.

PARISA: Cowards.

JULES: People maintaining payroll systems.

PARISA: Fine. Responsible cowards.

## Introduction

PARISA: I’m Parisa.

JULES: And I’m Jules.

PARISA: And this is *Okay, But Why?*—the show where we refuse to memorize another piece of developer vocabulary until somebody explains why the damn thing exists.

JULES: Today: TypeScript.

PARISA: Which I have avoided learning properly for an embarrassingly long time.

JULES: How long is embarrassingly long?

PARISA: Long enough that job postings started writing “JavaScript slash TypeScript” like they were one word.

JULES: JavaScriptTypeScript.

PARISA: Exactly. Like one of those celebrity couple names, except neither participant consented.

JULES: And now TypeScript is everywhere.

PARISA: Which is part of my problem. I can look at TypeScript and recognize JavaScript in there. But then there’s other shit attached to it.

JULES: The complicated little hat.

PARISA: Yes. JavaScript is wearing a complicated little hat, and everyone else has agreed this is normal.

JULES: It mostly is normal now.

PARISA: Which makes me suspicious.

JULES: Naturally.

## Who Asked for This?

PARISA: Before TypeScript, we had JavaScript.

JULES: Still do.

PARISA: Good clarification. TypeScript has not murdered JavaScript and assumed its identity.

JULES: No. TypeScript depends on JavaScript. Valid JavaScript is generally valid TypeScript, and TypeScript code is ultimately turned into JavaScript before it runs.

PARISA: Hold on. Turned into JavaScript by what?

JULES: The TypeScript compiler—or another tool that understands TypeScript syntax.

PARISA: We have reached the word “compiler” suspiciously early.

JULES: We’ll unpack it. For now, the important part is that the browser does not ordinarily run your TypeScript source code.

PARISA: It runs JavaScript.

JULES: Right. The TypeScript-specific parts are checked and then removed. What reaches the browser is JavaScript.

PARISA: So TypeScript isn’t replacing JavaScript.

JULES: It’s examining the JavaScript you intend to create.

PARISA: Like airport security for variables.

JULES: Sort of. Except airport security continues to exist after you board the plane.

PARISA: And TypeScript doesn’t?

JULES: Its type system doesn’t. Once the program is running, those TypeScript types are gone.

PARISA: Put a pin in that, because it sounds important and slightly alarming.

JULES: Extremely important. But first: why did anyone want this?

PARISA: JavaScript already has types. Strings, numbers, booleans, objects—

JULES: Correct. JavaScript is dynamically typed. Values have types while the program is running, but a variable isn’t permanently restricted to one type.

PARISA: Meaning I can do this:

[CODE CARD]

```js
let total = 10;
total = "ten";
```

JULES: Completely legal JavaScript.

PARISA: Deeply questionable JavaScript, but legal.

JULES: JavaScript won’t object merely because `total` changed from a number to a string.

PARISA: It may object later, when I attempt to do math with my exciting new word-number.

JULES: Exactly. The mistake and the visible failure can happen far apart.

PARISA: Which is how you end up debugging a checkout total at two in the morning when the actual problem entered the system six functions ago.

JULES: That distance is the problem TypeScript is trying to shorten.

PARISA: It wants to complain closer to where I made the mistake.

JULES: Ideally before you run the code at all.

PARISA: Okay. That’s actually useful.

JULES: First one of the series!

PARISA: Don’t get excited. I haven’t seen the syntax yet.

JULES: TypeScript lets us describe what kinds of values our code expects. Then it compares those expectations with how we actually use the values.

PARISA: So if `total` is supposed to remain a number—

JULES: TypeScript can flag the assignment of `"ten"` while we’re writing the code.

PARISA: Before a user discovers it.

JULES: Before the browser runs it. Often directly in the editor.

PARISA: That is the sales pitch, then. Find certain contradictions earlier.

JULES: Yes. Not “make bugs impossible.” Not “prove the program is correct.” Find a useful category of mistakes before runtime.

PARISA: I appreciate the less magical version.

JULES: The less magical version is usually the useful one.

PARISA: So TypeScript exists because JavaScript’s flexibility is wonderful when you’re moving quickly—

JULES: And increasingly stressful when the application gets large, several developers share it, or you need to change code without remembering every assumption anyone ever made.

PARISA: JavaScript trusts the team.

JULES: TypeScript has met the team.

PARISA: Fair.

## Same Bug, Different Timing

PARISA: Show me an actual example. Something small enough that we don’t need a repository, a build system, and three meetings about architecture.

JULES: Deal. Here’s ordinary JavaScript:

[CODE CARD]

```js
function shoutName(user) {
  return user.name.toUpperCase();
}

shoutName({ name: 42 });
```

PARISA: The function expects an object with a `name`.

JULES: More specifically, it assumes that `name` is a string.

PARISA: But we gave it the number forty-two.

JULES: JavaScript accepts the call. Then the function runs and tries to use the string method `toUpperCase` on a number.

PARISA: Which does not have that method.

JULES: So we get a runtime error.

[TERMINAL]

```text
TypeError: user.name.toUpperCase is not a function
```

PARISA: Fine. That’s a bug. But it’s also an extremely obvious bug.

JULES: Here, yes. In a real application, the object might travel through several files before reaching this function.

PARISA: Or it came from a form. Or an API. Or somebody “temporarily” changed the data structure eighteen months ago.

JULES: And now the error happens here even though the bad assumption began somewhere else.

PARISA: All right. Put the complicated hat on it.

JULES: One TypeScript version could look like this:

[CODE CARD]

```ts
type User = {
  name: string;
};

function shoutName(user: User) {
  return user.name.toUpperCase();
}

shoutName({ name: 42 });
```

PARISA: There are the attachments.

JULES: There are the attachments.

PARISA: Before we continue: which parts are TypeScript, and which parts are modern JavaScript?

JULES: The `type User` block is TypeScript. The `: User` after the parameter is also TypeScript.

PARISA: The function declaration, object, method call, `const`, braces, and template-literal-looking general ecosystem—

JULES: JavaScript.

PARISA: Good. Because developers have developed an alarming habit of showing six unfamiliar things at once and calling the entire pile TypeScript.

JULES: Recurring segment?

PARISA: Absolutely.

### Wait, That’s Just JavaScript

JULES: In this example, `type User` describes the shape we expect.

PARISA: An object with a property called `name`, whose value must be a string.

JULES: Right. Then `user: User` says the function’s `user` parameter should match that shape.

PARISA: And the colon is not JavaScript.

JULES: Correct. That colon is a TypeScript type annotation.

PARISA: So when we call the function with `{ name: 42 }`—

JULES: TypeScript compares what we supplied with what the function expects.

[TERMINAL]

```text
Type 'number' is not assignable to type 'string'.
```

PARISA: That is significantly more useful than discovering it when somebody clicks a button.

JULES: And notice the difference in timing. JavaScript reports the problem while the program is running.

PARISA: TypeScript reports the contradiction while it’s checking the source code.

JULES: That distinction—compile time versus runtime—is the heart of the thing.

PARISA: Define compile time without assuming I have spent my life compiling things.

JULES: Here, “compile time” means the period when a tool examines and transforms our source code before the finished JavaScript runs.

PARISA: It does not necessarily mean we are manufacturing a native executable.

JULES: Correct. “Compiler” covers more than one kind of transformation. The TypeScript compiler checks the types and can produce JavaScript.

PARISA: And runtime is when that resulting JavaScript is actually executing in the browser or Node.

JULES: Exactly.

PARISA: So this is not TypeScript hovering beside the website in production, guarding every variable.

JULES: No. It checks our work earlier, then gets out of the final program’s way.

PARISA: Show me what “gets out of the way” means.

JULES: After the TypeScript-specific syntax is removed, the relevant JavaScript is basically:

[CODE CARD]

```js
function shoutName(user) {
  return user.name.toUpperCase();
}

shoutName({ name: 42 });
```

PARISA: We’re back where we started.

JULES: At runtime, yes.

PARISA: Meaning if we ignore the TypeScript error and produce JavaScript anyway—

JULES: The JavaScript can still fail.

PARISA: If some other piece of code bypasses the check—

JULES: It can still fail.

PARISA: If the data comes from outside the program and doesn’t match what we claimed—

JULES: It can still fail.

PARISA: So TypeScript’s actual promise is not “this can never go wrong.”

JULES: Its promise is closer to: “Given the information you provided, I found a contradiction before the code ran.”

PARISA: That is much less sexy.

JULES: And much more accurate.

## TypeScript Is Not Runtime Validation

PARISA: Let’s deal with the outside-data problem now, because that sounds like a footgun wearing a sensible shoe.

JULES: Suppose an API claims it returns this:

[CODE CARD]

```ts
type User = {
  name: string;
};
```

PARISA: We tell TypeScript, “This response is a `User`.”

JULES: But the server actually sends:

[CODE CARD]

```json
{
  "name": 42
}
```

PARISA: Does TypeScript intercept the response and say, “Excuse me, this violates the paperwork”?

JULES: No. The type system is not present at runtime.

PARISA: Then our number marches straight into `toUpperCase`.

JULES: Unless we validate the data while the program is running.

PARISA: Different job.

JULES: Exactly. TypeScript checks relationships inside the code it can analyze. Runtime validation examines the actual data that arrives while the program is executing.

PARISA: Forms, API responses, local storage, URL parameters—

JULES: Database results, third-party libraries, messages from other systems. Anything outside the trusted assumptions of the current code.

PARISA: Please Don’t Do This: slap a type on untrusted data and call it validated.

JULES: Perfect.

### Please Don’t Do This

PARISA: A TypeScript type describes what we believe or require.

JULES: It does not force reality to cooperate.

PARISA: Which may be the most broadly applicable sentence in software development.

JULES: Runtime validation is a later episode. For now, remember that TypeScript’s safety exists during development and checking. It does not replace checking real external data.

PARISA: So we have two different questions.

JULES: “Does my code use values consistently?”

PARISA: TypeScript.

JULES: And, “Is this incoming value actually what it claims to be?”

PARISA: Runtime validation.

JULES: Exactly.

PARISA: Okay. That distinction alone has cleared up approximately half my suspicion.

JULES: What about the other half?

PARISA: I’ve seen TypeScript files where every available surface is covered in colons, angle brackets, and declarations. Do I have to label every variable like I’m packing a warehouse?

JULES: No.

PARISA: Good. Because the hat was becoming a helmet.

## Type Inference: TypeScript Can Read

PARISA: You said I don’t have to annotate everything.

JULES: Right. TypeScript can often infer a type from the code.

PARISA: “Infer” meaning it looks at the value and figures out the obvious thing.

JULES: Exactly.

[CODE CARD]

```ts
let score = 10;
```

PARISA: No colon. No explicit `number`.

JULES: But TypeScript can see that `10` is a number. If we later do this—

[CODE CARD]

```ts
score = "ten";
```

JULES: It flags the assignment.

[TERMINAL]

```text
Type 'string' is not assignable to type 'number'.
```

PARISA: Even though I never wrote `score: number`.

JULES: Because TypeScript inferred it.

PARISA: That seems important, because most TypeScript examples make the language look like JavaScript contracted punctuation.

JULES: Beginners often over-annotate because annotations are the visible new feature.

PARISA: If I’m learning TypeScript, I naturally assume my job is to type more types.

JULES: But good TypeScript frequently means letting the compiler infer the obvious parts.

PARISA: So this—

[CODE CARD]

```ts
const podcastName: string = "Okay, But Why?";
```

PARISA: Is legal.

JULES: Yes.

PARISA: But TypeScript already knows that the quoted text is a string.

JULES: Yes.

PARISA: So the annotation provides no new information.

JULES: Usually not.

PARISA: It’s a tiny bureaucratic name tag saying, “Hello, my name is String,” while standing inside a string.

JULES: Exactly. This is generally enough:

[CODE CARD]

```ts
const podcastName = "Okay, But Why?";
```

PARISA: And because it’s `const`, we can’t assign a different value later anyway.

JULES: Correct—and that part is JavaScript.

PARISA: Wait, That’s Just JavaScript.

JULES: `const` was introduced in ES2015. TypeScript understands it, but TypeScript did not invent it.

PARISA: Type inference is TypeScript.

JULES: Correct.

PARISA: `let` and `const` are JavaScript.

JULES: Correct.

PARISA: I would like this distinction printed on several tutorial authors.

JULES: We’ll need a large printer.

## When Annotations Are Useful

PARISA: If inference handles the obvious cases, when should I write a type annotation?

JULES: When the type is not obvious, when you want to restrict what is allowed, or when you’re defining a boundary between pieces of code.

PARISA: A function parameter is a boundary.

JULES: Perfect example. TypeScript cannot reliably guess what callers are supposed to pass into this function:

[CODE CARD]

```ts
function greet(name) {
  return `Hello, ${name}`;
}
```

PARISA: Because there’s no starting value for `name`.

JULES: Right. Depending on our configuration, TypeScript may complain that `name` implicitly has the type `any`.

PARISA: We’re not unpacking `any` yet, are we?

JULES: Not fully. For now, `any` effectively tells TypeScript to stop checking that value.

PARISA: The official type of “mind your business.”

JULES: Pretty much.

PARISA: Useful occasionally. Concerning as a lifestyle.

JULES: Very much so. We can give the parameter an explicit type:

[CODE CARD]

```ts
function greet(name: string) {
  return `Hello, ${name}`;
}
```

PARISA: Now the boundary says callers must provide a string.

JULES: And TypeScript can infer that the function returns a string.

PARISA: We could annotate the return type too.

JULES: We could:

[CODE CARD]

```ts
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

PARISA: The second `: string` describes what comes back.

JULES: Right. Whether to write that return annotation is partly a team and design decision. It can document and enforce the intended contract, especially for exported functions.

PARISA: But it isn’t mandatory just because we are doing TypeScript now.

JULES: Correct. TypeScript can infer many return types.

PARISA: I’m sensing a theme: annotate the decisions, not every object that moves.

JULES: That’s a good working principle.

PARISA: Functions, module boundaries, public APIs, complicated data structures—

JULES: Places where the intended contract matters.

PARISA: And let TypeScript infer `const count = 3`.

JULES: Unless there’s a specific reason not to.

PARISA: Okay. That’s actually less irritating than I expected.

## The Other Thing TypeScript Does

PARISA: So far, TypeScript catches inconsistent types. Is that the whole benefit?

JULES: No. The type information also helps development tools understand the code.

PARISA: Autocomplete.

JULES: Autocomplete, documentation, navigation, and safer refactoring.

PARISA: JavaScript editors already do some of that.

JULES: Absolutely. Modern JavaScript tooling can infer a lot. TypeScript gives the editor a more complete model, particularly as the project grows.

PARISA: Example.

JULES: Suppose we have this type:

[CODE CARD]

```ts
type Episode = {
  title: string;
  durationMinutes: number;
};
```

JULES: When we work with an `Episode`, the editor knows its available properties.

PARISA: So after I type `episode.` it can suggest `title` and `durationMinutes`.

JULES: And if you write `episode.durationSeconds`, TypeScript can tell you that property doesn’t exist.

PARISA: Unless we actually meant to rename it.

JULES: Which brings us to refactoring. Imagine changing `durationMinutes` to `lengthMinutes`.

PARISA: In a small project, search and replace.

JULES: In a large project, you want to know every place that depends on the old property—including places you forgot existed.

PARISA: TypeScript can identify the broken assumptions.

JULES: Exactly. The errors become a to-do list for the refactor.

PARISA: That may be the first genuinely persuasive argument for me.

JULES: More than preventing `toUpperCase` on a number?

PARISA: I have maintained old code. “Here is a list of everything your change broke” is a love language.

JULES: TypeScript can make changing code less dependent on one person remembering the entire application.

PARISA: Which matters when the original developer has left the company.

JULES: Or when the original developer is you six months later.

PARISA: That woman documents nothing and cannot be trusted.

## What TypeScript Knows—and What It Doesn’t

PARISA: So TypeScript understands the model created by our source code and type declarations.

JULES: Yes.

PARISA: It can catch contradictions inside that model.

JULES: Yes.

PARISA: It can improve editor tooling because the editor understands more about our intended data.

JULES: Yes.

PARISA: It cannot prove that the program does what the business wanted.

JULES: Correct.

PARISA: It cannot tell me whether the checkout calculation is mathematically wrong if every value involved is still a number.

JULES: Correct.

PARISA: It cannot guarantee that a network request succeeds.

JULES: Correct.

PARISA: It cannot make inaccessible markup accessible.

JULES: Very correct.

PARISA: It cannot sanitize malicious input.

JULES: Extremely correct.

PARISA: It cannot replace tests.

JULES: Correct, although it may reduce the number of tests you need solely to confirm basic type relationships.

PARISA: It also cannot replace runtime validation.

JULES: Right.

PARISA: So TypeScript handles one layer of confidence.

JULES: A useful layer, not the entire building.

PARISA: Developers do love installing one useful layer and announcing that weather has been solved.

JULES: TypeScript is not a force field.

PARISA: It’s the anxious proofreader.

JULES: Who catches certain inconsistencies before publication.

PARISA: But doesn’t fact-check reality.

JULES: Exactly.

## What Does It Cost?

PARISA: We’ve done the benefits. What is the price?

JULES: More tooling, for one thing.

PARISA: There it is.

JULES: TypeScript code needs to be checked and transformed into JavaScript. That means a compiler or a build tool that understands TypeScript.

PARISA: Configuration.

JULES: Usually.

PARISA: More syntax.

JULES: Sometimes significantly more syntax.

PARISA: Error messages written by a Victorian mathematician trapped inside a terminal.

JULES: Some of them are improving.

PARISA: That was not a denial.

JULES: TypeScript can also slow you down when its understanding doesn’t match what you know the program is doing.

PARISA: The compiler says no. I say, “But look at it.”

JULES: And the compiler says, “I cannot look at it the way you are looking at it.”

PARISA: So now I’m debugging my program and my explanation of the program.

JULES: Yes. Types are another representation of the software, and that representation requires maintenance.

PARISA: Type definitions can be wrong.

JULES: Absolutely. They’re written by people.

PARISA: Or generated by tools written by people.

JULES: Also people.

PARISA: There’s no escaping them.

JULES: TypeScript can also create false confidence. A codebase having zero type errors does not mean it has zero bugs.

PARISA: It means it has zero errors TypeScript found under the current configuration and assumptions.

JULES: Exactly. Configuration matters. Looser settings catch less. Escape hatches can bypass checks. Incorrect type assertions can tell TypeScript to believe something untrue.

PARISA: So you can cheat.

JULES: Oh, extensively.

PARISA: Developers demanded a responsible adult and immediately started finding ways to sneak out the window.

JULES: The responsible adult is configurable.

PARISA: That sentence explains the industry.

## When Should We Care?

PARISA: Does every JavaScript project need TypeScript?

JULES: No.

PARISA: Thank you. We can end the episode.

JULES: A seven-line script you’ll throw away tomorrow probably doesn’t need a full TypeScript setup.

PARISA: A simple static site with a tiny amount of behavior?

JULES: Maybe not. It depends on the code and the team.

PARISA: A quick experiment where I’m still trying to discover what I’m building?

JULES: TypeScript might help, but strict modeling can also become friction while everything is changing.

PARISA: A larger application maintained for years by multiple people?

JULES: That’s where the benefits become easier to justify.

PARISA: Shared data structures, lots of function boundaries, APIs, components, refactoring—

JULES: TypeScript gives those relationships a form the tools can check.

PARISA: A library used by other developers?

JULES: Types can become valuable documentation and improve the experience of using it.

PARISA: A codebase where nobody knows what half the objects look like?

JULES: TypeScript may expose that problem rather dramatically.

PARISA: It does not automatically fix the design.

JULES: No. Sometimes it merely gives the confusion a name.

PARISA: Still useful.

JULES: The question isn’t, “Is TypeScript good?”

PARISA: It’s, “Do TypeScript’s earlier feedback and stronger tooling solve problems this project actually has?”

JULES: And are those benefits worth the additional tooling and type maintenance?

PARISA: That is disappointingly reasonable.

JULES: I practiced.

## So What Is TypeScript?

PARISA: All right. Final answer. What is TypeScript?

JULES: TypeScript is a language built on JavaScript that adds a static type system and related tooling.

PARISA: It checks our source code before runtime.

JULES: It looks for contradictions between the types we expect and the ways we use values.

PARISA: It can improve autocomplete, navigation, documentation, and refactoring.

JULES: Its type syntax is removed before the resulting JavaScript runs.

PARISA: So the browser is still running JavaScript.

JULES: Yes.

PARISA: TypeScript does not validate actual outside data at runtime.

JULES: Correct.

PARISA: It does not eliminate bugs.

JULES: Correct.

PARISA: It does not need an annotation attached to every available noun.

JULES: Please don’t do that.

PARISA: And it is most valuable when earlier feedback and explicit contracts reduce the cost of understanding and changing the code.

JULES: That’s TypeScript.

PARISA: JavaScript with an anxious proofreader.

JULES: And a complicated little hat.

PARISA: Fine. The hat may remain.

## Closing

PARISA: Next time, I want to understand the actual type system without being buried under every piece of syntax TypeScript has accumulated since birth.

JULES: We’ll start with the types JavaScript already has, then look at how TypeScript represents them.

PARISA: Strings, numbers, booleans, objects—

JULES: Arrays, functions, inference, and annotations.

PARISA: And we will continue identifying whether unfamiliar syntax is TypeScript or merely JavaScript invented after I learned it.

JULES: Wait, That’s Just JavaScript will be busy.

PARISA: Good. I have grievances.

JULES: I know.

PARISA: Until next time: newer does not automatically mean better.

JULES: Older does not automatically mean simpler.

PARISA: And if somebody tells you TypeScript makes your application safe—

JULES: Ask what kind of safety they mean.

PARISA: Look at that. We learned a follow-up question.

JULES: Honestly more useful than memorizing syntax.

PARISA: Okay. But why?

[END]
