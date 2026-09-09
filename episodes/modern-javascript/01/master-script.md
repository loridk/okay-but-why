# Episode 1: Wait, JavaScript Changed?

Status: Draft

**CAST**

PARISA — Experienced millennial web developer. Learned JavaScript before ES6 and has strong traditional web fundamentals. Suspicious of unexplained punctuation.

JULES — Gen Z developer who entered development when modern JavaScript syntax was already normal. Parisa's peer, not her professor.

[MUSIC]

## Cold Open

PARISA: Okay. I have a complaint.

JULES: About JavaScript?

PARISA: About JavaScript apparently changing clothes while I wasn't looking.

JULES: That's fair.

PARISA: I learned JavaScript when a function looked like a function, variables were `var`, and if you wanted to move data around you wrote enough punctuation to qualify as light cardio.

JULES: And now?

PARISA: Now I open somebody's code and there are arrows, curly braces doing suspicious things, three dots everywhere, `import` at the top, question marks in the middle—

JULES: Some of those are newer JavaScript.

PARISA: SOME?

JULES: Some are tooling, some are frameworks, some are TypeScript—

PARISA: Excellent. The language has become a costume party.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*, the show where technically capable people are allowed to ask, “What the hell changed while I was busy maintaining production software?”

PARISA: I'm Parisa. I learned JavaScript before ES6, which means modern JavaScript occasionally looks like somebody installed a DLC pack without telling me.

JULES: And I'm Jules. I learned JavaScript after a lot of that syntax was already normal.

PARISA: Which makes this series very simple. I point at syntax and ask, “Is that JavaScript?”

JULES: And occasionally I get to say yes.

PARISA: Great. Let's recover my language.

## Who Asked for This?

PARISA: First question: why did JavaScript need a giant modernization at all?

JULES: Because the web changed enormously. JavaScript started as a small scripting language for webpages. Then developers were building large applications with it.

PARISA: And the language was still handing us `var` and saying good luck.

JULES: Pretty much. Developers built patterns and libraries around missing features: module systems, class-like inheritance helpers, callback conventions, utility libraries.

PARISA: So ES6 wasn't “let's make JavaScript trendy.”

JULES: Right. A lot of it was the language absorbing solutions to problems developers were already having.

## ECMAScript Is the Specification

PARISA: Before anything else: JavaScript versus ECMAScript. Why are there two names?

JULES: JavaScript is the language name people use. ECMAScript is the standardized language specification maintained through ECMA International's TC39 process.

PARISA: So ECMAScript is basically the rulebook.

JULES: Good mental model. Engines like V8, SpiderMonkey, and JavaScriptCore implement that specification.

PARISA: And ES6?

JULES: The sixth edition of ECMAScript, standardized in 2015. That's why you'll see both **ES6** and **ES2015**.

PARISA: Same major release, two names, because naming things is still one of computer science's unsolved problems.

## Why 2015 Feels Like a Border

JULES: ES2015 was unusually large. It brought things like `let` and `const`, arrow functions, classes, template literals, destructuring, default parameters, rest and spread in several forms, promises as a standard feature, and standardized modules.

PARISA: Which explains why code from before and after it can look weirdly different.

JULES: Exactly. But modern JavaScript is **not synonymous with ES6**.

PARISA: Important.

JULES: Optional chaining, for example, arrived much later. `async` and `await` were standardized after ES2015 too.

PARISA: So calling every modern feature “ES6” is like calling every PlayStation a PlayStation 2.

JULES: You understand what family somebody means, but the date is wrong.

## JavaScript Started Shipping Yearly

JULES: After ES2015, ECMAScript moved to a yearly edition cadence.

PARISA: So there wasn't another ten-year syntax meteor.

JULES: Right. Features go through a proposal process. Mature proposals can become part of the standard, and engines implement them.

PARISA: Which means “modern JavaScript” is a moving window, not one release.

JULES: Exactly.

PARISA: That's already more useful than “ES6 means new JavaScript.”

## Wait, That's Just JavaScript

[STING]

PARISA: New recurring survival question. Arrow functions?

JULES: JavaScript.

PARISA: Destructuring?

JULES: JavaScript.

PARISA: Optional chaining?

JULES: JavaScript.

PARISA: `interface User`?

JULES: TypeScript.

PARISA: JSX with angle brackets inside JavaScript?

JULES: JSX. Usually transformed by React tooling or another JSX-aware tool.

PARISA: `require()`?

JULES: CommonJS module system, strongly associated with Node. Not ECMAScript module syntax.

PARISA: This is the exact shit I needed.

JULES: That's the point. Modern projects stack several languages and tools together. If nobody labels the layers, the syntax becomes soup.

## But Could Browsers Run It?

PARISA: I remember browser compatibility being the thing that ruined everybody's afternoon.

JULES: Still a consideration, but the situation changed. New syntax only helps if the JavaScript engine running your code understands it.

PARISA: Enter Babel?

JULES: Historically, Babel became a major way to transform newer JavaScript syntax into older syntax that older environments could execute.

PARISA: So Babel wasn't “making JavaScript work.”

JULES: More specifically, it could transform syntax and, depending on setup, help with compatibility strategies. But syntax transforms and missing runtime APIs are different problems.

PARISA: Meaning changing an arrow function into an old function doesn't magically give an ancient browser a missing API.

JULES: Exactly. That's where polyfills may come in.

PARISA: Transformation changes the recipe. A polyfill supplies an ingredient the kitchen doesn't have.

JULES: I like that.

## Do We Still Need Transpilers?

PARISA: So in 2026, do I need Babel for ordinary modern JavaScript?

JULES: Not automatically. Modern evergreen browsers support a huge amount of modern JavaScript directly. Your actual target environments decide what needs transforming.

PARISA: There it is. The show's answer to everything.

PARISA: It depends.

JULES: Build tools may still transform code for many reasons, and frameworks may introduce JSX or TypeScript that browsers don't directly execute as written. But “modern JavaScript exists, therefore Babel” is outdated as a universal rule.

## What Did We Actually Learn?

PARISA: Okay. Modern JavaScript isn't JavaScript 2.

JULES: Correct.

PARISA: ES6 and ES2015 refer to the same giant 2015 edition, but modern JavaScript includes features standardized after that.

JULES: Yep.

PARISA: ECMAScript is the specification. JavaScript engines implement it. Browsers and Node add their own environment APIs around the language.

JULES: Yep.

PARISA: And when modern code looks alien, my first question should be: what layer owns this syntax?

JULES: JavaScript, TypeScript, JSX, Node, framework, or tooling.

PARISA: Beautiful. Next episode: `var`.

JULES: You sound ominous.

PARISA: We have history.

