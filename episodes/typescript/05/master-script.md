# Episode 5: Functions Have Boundaries

Status: Draft

## Cold Open

PARISA: Functions are where perfectly reasonable values go to become somebody else’s problem.

JULES: Inputs arrive, outputs leave, callbacks return later with consequences.

PARISA: So TypeScript stations paperwork at the border.

JULES: More or less.

## Parameters and Returns

[CODE CARD]

```ts
function calculateEndTime(
  startMinutes: number,
  durationMinutes: number,
): number {
  return startMinutes + durationMinutes;
}
```

PARISA: Parameter annotations describe allowed inputs. The return annotation describes the promised output.

JULES: TypeScript can infer that return, but writing it can protect an intentional public contract.

[CODE CARD]

```ts
function calculateEndTime(
  startMinutes: number,
  durationMinutes: number,
): number {
  return `${startMinutes + durationMinutes}`;
}
```

[TERMINAL]

```text
Type 'string' is not assignable to type 'number'.
```

PARISA: The annotation catches a change in implementation that violates the contract.

## Optional, Default, and Rest Parameters

[CODE CARD]

```ts
function greet(name: string, title?: string) {
  return title ? `Hello, ${title} ${name}` : `Hello, ${name}`;
}
```

JULES: Optional parameters may be omitted, so inside the function `title` is `string | undefined`.

PARISA: A default value is JavaScript.

[CODE CARD]

```ts
function greet(name: string, title = "Developer") {
  return `Hello, ${title} ${name}`;
}
```

JULES: TypeScript infers the defaulted parameter as a string.

PARISA: And rest parameters?

[CODE CARD]

```ts
function listTopics(...topics: string[]) {
  return topics.join(", ");
}
```

JULES: Rest syntax is JavaScript. `string[]` is the TypeScript description of the collected arguments.

## Function Types

PARISA: Sometimes the function itself is the value.

[CODE CARD]

```ts
type Formatter = (title: string) => string;

const uppercase: Formatter = (title) => title.toUpperCase();
```

JULES: The arrow inside the type describes a callable contract. The arrow in the implementation is JavaScript arrow-function syntax.

PARISA: Identical-looking arrows doing jobs in different layers. Excellent for beginners.

JULES: Context tells us whether we are in a type position or value position.

## Callbacks Carry Contracts

[CODE CARD]

```ts
function transformTitles(
  titles: string[],
  formatter: (title: string) => string,
) {
  return titles.map(formatter);
}
```

PARISA: The callback receives a string and must return a string.

JULES: That lets TypeScript check both the function accepting the callback and every callback passed to it.

[CODE CARD]

```ts
transformTitles(["types"], (title) => title.length);
```

[TERMINAL]

```text
Type 'number' is not assignable to type 'string'.
```

PARISA: Also, TypeScript inferred `title` inside the callback from context.

JULES: Contextual typing. Information flows inward from the expected function type.

## `void` Does Not Mean Nothing Happened

[CODE CARD]

```ts
function logEpisode(title: string): void {
  console.log(title);
}
```

JULES: `void` means callers should not rely on a useful returned value.

PARISA: The function may still have effects. Logging is very much something happening.

JULES: Exactly. `void` describes the return contract, not moral purity.

## Methods and `this`

PARISA: Do methods work differently?

[CODE CARD]

```ts
type Player = {
  currentTime: number;
  seek(time: number): void;
};
```

JULES: Method parameters and returns are checked like other functions. JavaScript’s `this` behavior still exists underneath.

PARISA: So TypeScript may describe `this`, but it does not rewrite JavaScript’s calling rules unless another transformation is involved.

JULES: Correct. Losing `this` remains a JavaScript problem with better editor diagnostics.

## Overloads, Briefly

[CODE CARD]

```ts
function findEpisode(id: number): Episode;
function findEpisode(slug: string): Episode;
function findEpisode(value: number | string): Episode {
  // implementation
}
```

JULES: Overload signatures describe several supported call shapes above one implementation.

PARISA: Why not just use a union parameter?

JULES: Use a union when the return relationship is the same. Overloads help when different inputs produce meaningfully different call signatures or returns.

PARISA: So they are not decorative documentation for every function with options.

JULES: Please don’t do that.

## Closing

PARISA: Function types describe boundaries: inputs, outputs, and callable relationships.

JULES: Defaults, rest parameters, arrows, and callbacks are JavaScript behavior. TypeScript adds checked contracts around them.

PARISA: Contextual typing lets information flow into callback parameters.

JULES: And next we make those relationships reusable without replacing everything with `any`.

PARISA: The angle brackets are approaching.

JULES: Generics.

PARISA: Okay. But why?

[END]
