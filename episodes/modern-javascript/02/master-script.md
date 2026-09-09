# Episode 2: `var` Has Left the Building

Status: Draft

**CAST**

PARISA — Experienced millennial web developer. Learned JavaScript before ES6 and has strong traditional web fundamentals. Suspicious of unexplained punctuation.

JULES — Gen Z developer who entered development when modern JavaScript syntax was already normal. Parisa's peer, not her professor.

[MUSIC]

## Cold Open

PARISA: I would like to defend `var`.

JULES: Oh no.

PARISA: It served this country.

JULES: It also escaped blocks.

PARISA: Nobody's perfect.

JULES: It let you redeclare variables.

PARISA: Youthful indiscretion.

JULES: Its hoisting behavior has confused generations.

PARISA: Okay, we're putting Grandpa Var in assisted living.

## Who Asked for `let` and `const`?

JULES: The problem wasn't that `var` was unusable. People built enormous systems with it. The problem was that its scoping rules made some mistakes easier.

PARISA: `var` is function-scoped, not block-scoped.

JULES: Exactly. A variable declared with `var` inside an `if` block still belongs to the surrounding function scope.

[CODE CARD]
```js
if (true) {
  var message = "hello";
}

console.log(message); // "hello"
```

PARISA: Which made sense once you knew it, but the curly braces were visually lying to you a little.

JULES: `let` and `const` are block-scoped.

[CODE CARD]
```js
if (true) {
  const message = "hello";
}

console.log(message); // ReferenceError
```

## So Which One Do I Use?

PARISA: Give me the modern rule without turning it into religion.

JULES: Use `const` when the binding doesn't need to be reassigned. Use `let` when it does.

PARISA: And `var`?

JULES: You'll absolutely encounter it in older code. You don't need to panic or mechanically rewrite every occurrence. But for new code, `let` and `const` usually express intent more clearly.

## Const Does Not Mean Frozen

PARISA: This one got me the first time. `const` means constant.

JULES: Constant **binding**, not deeply immutable value.

[CODE CARD]
```js
const user = { name: "Parisa" };
user.name = "Jules"; // allowed

user = { name: "Sabrina" }; // TypeError
```

PARISA: So the label `user` can't be pointed at a different object. The object itself can still be edited.

JULES: Exactly.

PARISA: `const` put a parking boot on the variable assignment, not the contents of the car.

JULES: Disturbing, but accurate enough.

## Hoisting Without Folklore

PARISA: People say `var` gets hoisted. Then somebody says technically everything gets hoisted. Then I close the tab.

JULES: Let's make it useful. Declarations are processed before execution in ways that differ by declaration type. With `var`, accessing the variable before its declaration line gives you `undefined`.

[CODE CARD]
```js
console.log(count); // undefined
var count = 3;
```

JULES: With `let` and `const`, the binding exists for the scope but you can't access it before the declaration is initialized.

[CODE CARD]
```js
console.log(count); // ReferenceError
const count = 3;
```

PARISA: And that inaccessible period is the temporal dead zone.

JULES: Yes.

PARISA: A wildly dramatic name for “don't use the variable before you declare it.”

JULES: JavaScript contains multitudes.

## The Loop Problem

JULES: `let` also fixed a famous problem with loop variables and closures.

PARISA: Ah, yes. Five callbacks, all mysteriously yelling five.

JULES: With `var`, one function-scoped binding can be shared across loop iterations. `let` creates the iteration behavior developers usually expected.

[CODE CARD]
```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2
```

PARISA: This is one of those changes where I can point directly at the scar tissue that asked for it.

## Please Don't Do This

PARISA: Should I change every `let` to `const` because a linter told me I have sinned?

JULES: `const` is useful because it communicates “this binding isn't reassigned.” But readability is the goal, not moral purity.

PARISA: Also don't convert old production code casually just to make it look young.

JULES: Exactly. Refactoring has risk. Change code because the change provides value, not because `var` has gray hair.

## What Did We Actually Learn?

PARISA: `let` and `const` gave JavaScript block-scoped bindings.

JULES: `const` prevents reassignment of the binding; it does not freeze objects.

PARISA: `let` is for bindings that need reassignment.

JULES: And `var` remains valid JavaScript with older, function-scoped behavior.

PARISA: So `var` didn't become illegal.

JULES: No.

PARISA: It just stopped getting invited to new projects.

JULES: That's unnecessarily cruel.

PARISA: Next: arrows.

