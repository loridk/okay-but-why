# Episode 6: The Reusable Type Machine

Status: Draft

## Cold Open

PARISA: I have seen TypeScript code where the angle brackets appear to contain algebra.

JULES: Generics can look worse than they are.

PARISA: That is also what people say before explaining mortgages.

JULES: A generic preserves a relationship without choosing one concrete type in advance.

PARISA: Better start with the problem.

## The `any` Non-Solution

[CODE CARD]

```ts
function first(items: any[]): any {
  return items[0];
}
```

PARISA: It works with every array because we stopped checking the interesting part.

JULES: If we pass strings, the result should be a string. If we pass episodes, it should be an episode. `any` forgets that relationship.

## A Type Parameter

[CODE CARD]

```ts
function first<T>(items: T[]): T {
  return items[0];
}
```

JULES: `T` is a type parameter—a placeholder for a type chosen when the function is used.

PARISA: Not a runtime variable.

JULES: Correct. It exists in TypeScript’s type system and is erased.

[CODE CARD]

```ts
const firstTopic = first(["types", "functions"]);
const firstNumber = first([10, 20]);
```

PARISA: TypeScript infers `T` as string in the first call and number in the second.

JULES: The output retains the element type of the input.

PARISA: A generic is not “accept anything.” It is “accept many types while preserving a relationship.”

JULES: Exactly.

## Naming the Relationship

PARISA: Must the parameter be called `T`?

JULES: No. Short names are conventional for simple cases; descriptive names help when relationships grow.

[CODE CARD]

```ts
function wrap<Value>(value: Value): { value: Value } {
  return { value };
}
```

PARISA: `Value` enters and the same `Value` appears inside the returned object.

JULES: That is the contract.

## More Than One Parameter

[CODE CARD]

```ts
function pair<Key, Value>(key: Key, value: Value) {
  return { key, value };
}

const entry = pair("episode", 6);
```

PARISA: TypeScript infers string for `Key` and number for `Value`.

JULES: Multiple parameters describe multiple connected unknowns.

PARISA: And if they are not actually connected to inputs or outputs?

JULES: The generic may be unnecessary.

## Constraints

PARISA: Inside `first`, we know almost nothing about `T`. What if the function needs a property?

[CODE CARD]

```ts
function printTitle<Item extends { title: string }>(item: Item) {
  return item.title.toUpperCase();
}
```

JULES: `extends` constrains the type parameter. `Item` may be any type that has a string title.

PARISA: We preserve the specific item type while guaranteeing the property the implementation needs.

JULES: Correct.

PARISA: `extends` here is TypeScript constraint syntax, not JavaScript class inheritance.

JULES: Same word, different type-system job.

## Generic Types

[CODE CARD]

```ts
type ApiResult<Data> =
  | { ok: true; data: Data }
  | { ok: false; error: string };
```

PARISA: We can reuse the success-and-failure structure for episodes, users, or anything else.

[CODE CARD]

```ts
type EpisodeResult = ApiResult<Episode[]>;
```

JULES: The type argument fills the placeholder.

PARISA: This resembles calling a function with a value argument, except it happens entirely in the type system.

JULES: That analogy is useful as long as we remember no generic object is created at runtime.

## Built-In Generics Were Already Here

JULES: You have used generic types already.

[CODE CARD]

```ts
Array<string>
Promise<Episode>
Map<string, Episode>
```

PARISA: The container stays the same while the contained or resolved type changes.

JULES: Exactly. `string[]` is convenient syntax for `Array<string>`.

## When Generics Are Too Much

[CODE CARD]

```ts
function greet<T extends string>(name: T): string {
  return `Hello, ${name}`;
}
```

PARISA: Does this generic preserve anything callers need?

JULES: No. A plain `name: string` communicates the contract better.

PARISA: Generic code is justified by a reusable relationship, not by the presence of angle brackets in the language.

JULES: Yes. If one concrete type solves the actual problem, use it.

PARISA: Please Don’t Do This: build a type-level cathedral around a function that uppercases a name.

## Closing

PARISA: A generic introduces a type placeholder.

JULES: Inference often fills it from the call. Constraints guarantee capabilities the implementation needs.

PARISA: The important part is the relationship: input to output, key to value, container to contents.

JULES: Generics preserve information that `any` discards.

PARISA: Which means next we need to meet `any` properly—and the two other ominous words, `unknown` and `never`.

JULES: The escape hatches department.

PARISA: Okay. But why?

[END]
