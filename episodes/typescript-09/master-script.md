# Episode 9 — Put It in a Real Project

## Cold open

PARISA: We understand the types. We met the compiler. I am ready to convert the entire production codebase before lunch.

JULES: Absolutely not.

PARISA: Coward.

JULES: Professional survivor. Today we decide where TypeScript earns its keep, how to migrate without detonating the schedule, and why data from the internet remains capable of lying.

## Start at a boundary

PARISA: Suppose I have an existing JavaScript app. Where do I start?

JULES: Choose a small, valuable boundary: a utility with clear inputs and outputs, a data transformation, or a module that causes recurring mistakes. Do not begin with the largest, weirdest file because it looks heroic.

PARISA: TypeScript migration is renovation while people still live in the house.

JULES: Exactly. One room, working smoke alarms, no surprise removal of the staircase.

[CODE CARD]
```ts
type CartItem = {
  price: number;
  quantity: number;
};

export function total(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
}
```

PARISA: Clear contract, pure logic, easy test. Better first target than the eleven-year-old checkout controller with six global variables.

## JavaScript and TypeScript can coexist

JULES: TypeScript supports gradual adoption. Depending on the project, `allowJs` can let JavaScript files participate while TypeScript files are added incrementally.

PARISA: And `checkJs` can report some type errors in JavaScript, using inference and JSDoc, before we rename every file.

[CODE CARD]
```js
// @ts-check

/** @param {number} price */
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}
```

JULES: That can be a sensible bridge. The goal is useful feedback, not winning a file-extension contest.

PARISA: But we still need a migration policy. New files only? Touched files? One folder at a time?

JULES: Yes, plus a shared strictness target and a rule against hiding every error with `any` just to make the dashboard green.

## Third-party package types

PARISA: What happens when we import a JavaScript package?

JULES: Many packages ship their own type declaration files. Those `.d.ts` files describe the package’s public API without adding runtime code.

[CODE CARD]
```ts
import express from "express";

const app = express();
```

PARISA: If the package does not include types?

JULES: The community may publish them in an `@types` package. For example, installing `@types/some-library` can teach TypeScript about a JavaScript library.

[TERMINAL]
```text
npm install --save-dev @types/some-library
```

PARISA: And if neither exists, we can write a small declaration ourselves.

[CODE CARD]
```ts
declare module "tiny-legacy-widget" {
  export function mount(selector: string): void;
}
```

JULES: Start narrow. A declaration file is a promise about code you do not control. If the promise is wrong, TypeScript can confidently help you crash.

## The network is not type-safe

PARISA: Here is the mistake I most want burned into the walls: giving `fetch` a type does not force the server to obey it.

JULES: Correct. Network data, local storage, environment variables, form data, and messages from other systems arrive at runtime. TypeScript cannot inspect future values while compiling.

[CODE CARD]
```ts
type User = {
  id: number;
  name: string;
};

const response = await fetch("/api/user/42");
const data: unknown = await response.json();
```

PARISA: Now we validate `data` before treating it as `User`.

JULES: Exactly. That validator might be handwritten or provided by a runtime schema library. Either way, validation is executable JavaScript running against the actual value.

[CODE CARD]
```ts
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "name" in value &&
    typeof value.name === "string"
  );
}
```

PARISA: Then TypeScript can narrow after the runtime check.

[CODE CARD]
```ts
if (!isUser(data)) {
  throw new Error("The API returned an invalid user");
}

console.log(data.name.toUpperCase());
```

JULES: That is the partnership: runtime validation establishes a fact; TypeScript carries that fact through the rest of the code.

## React and TSX, without starting the React series

PARISA: We promised one look at React because people see `.tsx` and assume the X is TypeScript getting promoted.

JULES: TSX is TypeScript source that contains JSX syntax. JSX itself is the angle-bracket syntax commonly used to describe UI in React.

[CODE CARD]
```tsx
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}</h1>;
}
```

PARISA: The object annotation describes the component’s props. The `<h1>` is JSX. The destructuring is modern JavaScript.

JULES: Beautiful. “Wait, That’s Just JavaScript” survives the finale.

PARISA: TypeScript can catch a missing or incorrectly typed prop while we build. It does not make the rendered interface accessible.

JULES: Exactly. Semantic HTML, labels, keyboard behavior, focus management, contrast, and understandable feedback are still design and implementation responsibilities.

PARISA: A perfectly typed inaccessible button is still an inaccessible button.

## Where TypeScript pays rent

JULES: TypeScript tends to earn its keep in long-lived codebases, shared libraries, teams, complex state, frequently changed business rules, and systems where refactoring confidence matters.

PARISA: Or when data structures are complex enough that remembering everything in your head has become an unpaid second job.

JULES: It can provide fast feedback, editor navigation, safer renames, and contracts between parts of a system.

PARISA: Where might it not be worth much?

JULES: A tiny disposable script, a short prototype, or a simple page maintained by one person may not need the setup. Though TypeScript can still be pleasant there if the environment already supports it.

PARISA: The answer is not “TypeScript everywhere because serious developers.” The answer is “What mistakes are likely here, and will static checking repay its cost?”

## A practical adoption checklist

JULES: Before adopting it, answer five questions.

PARISA: One: what problem are we trying to reduce?

JULES: Two: what runtime and build tools already exist?

PARISA: Three: what strictness level is our destination?

JULES: Four: where does untrusted data enter, and how will we validate it?

PARISA: Five: how will the team migrate without freezing feature work or carpeting the codebase in `any`?

[CODE CARD]
```text
Adoption plan
1. Name the recurring problem.
2. Confirm the runtime and toolchain.
3. Choose strictness and migration rules.
4. Validate external data at runtime.
5. Convert one useful boundary and measure the result.
```

## What TypeScript does not do

PARISA: Finale lightning round. Does TypeScript make bad architecture good?

JULES: No.

PARISA: Does it test behavior?

JULES: No.

PARISA: Validate a production API response?

JULES: No.

PARISA: Prevent every bug?

JULES: Absolutely not.

PARISA: Replace accessibility review, security review, or understanding the code?

JULES: Also no.

PARISA: Then why should I give a shit?

JULES: Because a large class of ordinary mistakes can become immediate feedback instead of runtime surprises. Because types can document relationships the compiler actually checks. And because refactoring becomes less like searching a dark basement by touch.

PARISA: There it is. TypeScript is not smarter JavaScript. It is a development tool for making assumptions visible and checkable before the code runs.

JULES: It costs syntax, configuration, learning, and occasional arguments with error messages. Sometimes that trade is excellent. Sometimes it is not.

PARISA: Which means the final answer is deeply annoying.

JULES: “It depends,” but now we know what it depends on.

## Series close

PARISA: We started with JavaScript wearing a complicated little hat.

JULES: Then we found runtime types, inference, unions, narrowing, object shapes, function contracts, generics, escape hatches, and the compiler underneath it all.

PARISA: More importantly, we found the boundary of the promise. TypeScript checks our model of the program before runtime. Reality still gets the last word.

JULES: And next in our broader journey: Node, npm, and modern JavaScript tooling—the machinery many of us installed years ago and have been politely pretending is self-explanatory.

PARISA: Finally. I have questions for `node_modules`.

JULES: It has retained counsel.

[END]
