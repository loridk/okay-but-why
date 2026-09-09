# Episode 7: Okay, But How Do People Write JavaScript Now?

Status: Draft

**CAST**

PARISA — Experienced millennial web developer. Learned JavaScript before ES6 and has strong traditional web fundamentals. Suspicious of unexplained punctuation.

JULES — Gen Z developer who entered development when modern JavaScript syntax was already normal. Parisa's peer, not her professor.

[MUSIC]

## Cold Open

PARISA: I have one final grievance.

JULES: Only one?

PARISA: Why does nobody write loops anymore?

JULES: People write loops.

PARISA: I open modern code and everybody is mapping and filtering and reducing. I feel like JavaScript became a juice cleanse.

JULES: Let's talk array methods.

## The Old Loop Is Fine

PARISA: First: is this still legal?

[CODE CARD]
```js
const doubled = [];

for (let i = 0; i < numbers.length; i++) {
  doubled.push(numbers[i] * 2);
}
```

JULES: Completely. A normal loop is not obsolete.

PARISA: Thank you.

JULES: Modern array methods are useful because they let you express common operations in terms of **what transformation you want**, rather than manually managing indexes and result arrays.

## Map: One In, One Out

JULES: `map` transforms each array element and returns a new array.

[CODE CARD]
```js
const doubled = numbers.map(number => number * 2);
```

PARISA: Same number of items, transformed values.

JULES: That's the usual mental model.

## Filter: Keep the Ones That Pass

JULES: `filter` returns a new array containing elements whose callback returns a truthy result.

[CODE CARD]
```js
const activeUsers = users.filter(user => user.active);
```

PARISA: So `map` transforms; `filter` selects.

JULES: Exactly.

## Find, Some, and Every

JULES: `find` gives you the first matching element.

[CODE CARD]
```js
const admin = users.find(user => user.role === "admin");
```

JULES: `some` asks whether at least one element passes a test. `every` asks whether all do.

[CODE CARD]
```js
const hasAdmin = users.some(user => user.role === "admin");
const allActive = users.every(user => user.active);
```

PARISA: These read almost like English, which is genuinely nice.

## Reduce: Calm Down

PARISA: And now the one people use to demonstrate that they have ascended.

JULES: `reduce`.

PARISA: I have seen people use `reduce` to create objects, arrays, sums, groups, probably mortgages.

JULES: `reduce` combines an array into an accumulated result.

[CODE CARD]
```js
const total = prices.reduce(
  (sum, price) => sum + price,
  0
);
```

PARISA: For a sum, gorgeous.

JULES: For complicated transformations, it can become hard to read. Use it when the accumulator model clarifies the operation, not because a `for` loop would embarrass you.

## For...of Versus for...in

JULES: `for...of` iterates values from iterable objects like arrays.

[CODE CARD]
```js
for (const user of users) {
  console.log(user.name);
}
```

JULES: `for...in` iterates enumerable property keys.

PARISA: So for array values, `for...of` is usually the one I mean.

JULES: Yes. Don't swap them casually because both contain the word “for.”

## Object Helpers

JULES: Objects also have helpers that show up constantly.

[CODE CARD]
```js
Object.keys(user);
Object.values(user);
Object.entries(user);
```

PARISA: And `Object.entries` gives key-value pairs I can iterate.

JULES: Right.

[CODE CARD]
```js
for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}
```

PARISA: Destructuring from episode four returns to collect its paycheck.

## Mutation Versus Transformation

PARISA: Modern JavaScript seems mildly obsessed with not mutating things.

JULES: Especially in UI frameworks and state-management patterns, creating new arrays and objects can make change detection and reasoning easier.

PARISA: But mutation isn't inherently illegal JavaScript.

JULES: Correct. `push` is not a crime. The question is whether shared mutable state makes your program harder to reason about.

PARISA: Again: solve the problem you actually have.

## Chaining

JULES: Array methods can chain naturally.

[CODE CARD]
```js
const names = users
  .filter(user => user.active)
  .map(user => user.name);
```

PARISA: Keep active users, then turn them into names.

JULES: Exactly. When the pipeline is simple, it can be very readable.

PARISA: When it's twelve chained methods and three nested ternaries?

JULES: The enter key is free.

## Modern Syntax Is Not a Personality

PARISA: This feels like the real lesson of the whole series.

JULES: Which is?

PARISA: Modern JavaScript gives me more expressive tools. It does not require me to maximize the number of modern features per square inch.

JULES: Yes.

PARISA: A clear loop can beat a clever `reduce`. A normal function can beat an arrow. A simple property access can beat destructuring gymnastics.

JULES: New syntax expands your vocabulary. It doesn't invalidate every sentence you wrote before.

## The Bridge to TypeScript

PARISA: So if I now see:

[CODE CARD]
```js
const activeNames = users
  .filter(user => user.active)
  .map(({ name }) => name);
```

PARISA: I know `const`, arrows, array methods, destructuring, and method chaining are all JavaScript.

JULES: Exactly.

PARISA: Which means when TypeScript adds:

[CODE CARD]
```ts
type User = {
  name: string;
  active: boolean;
};
```

PARISA: I can identify the **new** layer instead of blaming TypeScript for every piece of syntax invented after 2012.

JULES: That's why this series belongs before TypeScript.

## What Did We Actually Learn?

PARISA: Modern JavaScript added better ways to express common transformations, iteration, modules, asynchronous flow, functions, scope, and data extraction.

JULES: But old JavaScript knowledge didn't become worthless. The language grew around concepts you already know.

PARISA: I recognize JavaScript again.

JULES: Great. Now let's add types.

PARISA: Fuck off.

JULES: Next series!

PARISA: I JUST GOT THIS LANGUAGE BACK.

[MUSIC]

