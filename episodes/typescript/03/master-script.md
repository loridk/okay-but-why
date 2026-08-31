# Episode 3: It Can Be a String or a Number. Now What?

Status: Draft

## Cold Open

PARISA: I have a user ID. Sometimes it is a number. Sometimes it is a string.

JULES: That sounds plausible.

PARISA: TypeScript says I must choose.

JULES: TypeScript says no such thing.

PARISA: Then why is it red?

JULES: Because you told it the ID could only be a number.

PARISA: So the machine is being pedantic about my own paperwork.

JULES: This is going to be a recurring emotional journey.

## More Than One Possibility

JULES: A union type describes a value that may be one of several types.

[CODE CARD]

```ts
let userId: string | number;

userId = 42;
userId = "user-42";
```

PARISA: The vertical bar means “or.”

JULES: Correct. `string | number` means a string or a number.

PARISA: Not a new runtime container. Not an array holding both.

JULES: Just a static description of the allowed possibilities.

## Permission Is Not Knowledge

[CODE CARD]

```ts
function printId(id: string | number) {
  return id.toUpperCase();
}
```

[TERMINAL]

```text
Property 'toUpperCase' does not exist on type 'string | number'.
```

PARISA: It exists on the string half.

JULES: But TypeScript does not know which half arrived. Code must be safe for every member of the union.

[CODE CARD]

```ts
function printId(id: string | number) {
  if (typeof id === "string") {
    return id.toUpperCase();
  }

  return id.toString();
}
```

PARISA: `typeof` is JavaScript.

JULES: And TypeScript understands what that JavaScript condition proves.

PARISA: Inside the `if`, `id` must be a string.

JULES: Outside it, after the string branch returns, the remaining possibility is number.

PARISA: That is narrowing.

JULES: TypeScript starts with a broader union and narrows it as control flow rules possibilities out.

## Control-Flow Analysis

JULES: Assignments, returns, equality checks, `typeof`, `instanceof`, and property checks all provide evidence.

[CODE CARD]

```ts
function describe(value: string | string[]) {
  if (Array.isArray(value)) {
    return `${value.length} items`;
  }

  return value.toUpperCase();
}
```

PARISA: `Array.isArray` is JavaScript.

JULES: TypeScript uses it as a type guard.

PARISA: Runtime check, static information.

JULES: Exactly.

## Null and Undefined Join the Meeting

[CODE CARD]

```ts
function greet(name: string | null) {
  return name.toUpperCase();
}
```

PARISA: If `name` is null, runtime explodes.

JULES: With strict null checking, TypeScript makes us handle that possibility.

[CODE CARD]

```ts
function greet(name: string | null) {
  if (name === null) {
    return "Hello, mysterious person";
  }

  return `Hello, ${name.toUpperCase()}`;
}
```

PARISA: Why compare explicitly with null instead of `if (!name)`?

JULES: Because an empty string is also falsy. The correct check depends on the business rule.

PARISA: TypeScript can follow a sloppy condition. It cannot decide whether that condition means what we intended.

## Optional Does Not Mean Imaginary

[CODE CARD]

```ts
type Guest = {
  name: string;
  website?: string;
};
```

JULES: The question mark makes `website` optional. Reading it gives us `string | undefined`.

[CODE CARD]

```ts
function printWebsite(guest: Guest) {
  if (guest.website) {
    return guest.website.toUpperCase();
  }

  return "No website provided";
}
```

PARISA: Again: runtime condition, static narrowing.

## Optional Chaining Is JavaScript

[CODE CARD]

```ts
const upperWebsite = guest.website?.toUpperCase();
const label = guest.website ?? "No website";
```

JULES: Optional chaining and nullish coalescing are JavaScript, not TypeScript.

PARISA: The question-mark dot returns undefined instead of calling the method on null or undefined.

JULES: And double question marks use the fallback only for null or undefined—not for empty strings, zero, or false.

PARISA: Wait, That’s Just JavaScript has been productive.

## Literal Types

[CODE CARD]

```ts
type Status = "draft" | "published" | "archived";

let status: Status = "draft";
status = "banana"; // error
```

PARISA: Finally, a workplace where banana is not a valid status.

JULES: Literal unions model a closed set of values and provide autocomplete. At runtime, they are still ordinary strings.

## Discriminated Unions

[CODE CARD]

```ts
type LoadState =
  | { status: "loading" }
  | { status: "success"; episodes: string[] }
  | { status: "error"; message: string };
```

JULES: The shared `status` property has a different literal value in each member.

[CODE CARD]

```ts
function render(state: LoadState) {
  if (state.status === "success") {
    return state.episodes.join(", ");
  }

  if (state.status === "error") {
    return state.message;
  }

  return "Loading...";
}
```

PARISA: In the success branch, TypeScript knows `episodes` exists. In the error branch, it knows `message` exists.

JULES: We model valid states separately instead of building one giant object full of optional properties.

PARISA: Making impossible states harder to represent.

JULES: One of TypeScript’s best tricks.

## Closing

PARISA: A union gives honest permission for several possibilities.

JULES: Narrowing proves which possibility the current code has.

PARISA: Normal JavaScript checks provide the evidence; TypeScript follows the control flow.

JULES: Next time, we describe object shapes—and why TypeScript provides both type aliases and interfaces.

PARISA: Two ways to describe an object. I am already calm about this.

JULES: You look calm.

PARISA: Okay. But why?

[END]
