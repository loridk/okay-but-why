# Episode 2: JavaScript Already Has Types, So What the Hell?

Status: Draft

## Cold Open

PARISA: People keep telling me TypeScript adds types to JavaScript.

JULES: That is the short version.

PARISA: It is also wrong enough to be irritating. JavaScript already has strings, numbers, booleans, objects, undefined, null—

JULES: You came prepared.

PARISA: I have been arguing with coercion since before you had email.

JULES: JavaScript absolutely has types. TypeScript adds a static model of how we expect those types to move through the program.

PARISA: So JavaScript knows what a value is right now.

JULES: And TypeScript tries to know what values should be allowed before the code runs.

PARISA: Better. The distinction may live.

## Values Have Types

PARISA: Start with JavaScript. No hats.

JULES: Every value has a runtime type.

[CODE CARD]

```js
"hello"
42
true
undefined
null
{ name: "Parisa" }
["JavaScript", "TypeScript"]
function explain() {}
```

PARISA: Strings, numbers, booleans, undefined, null, objects, arrays, and functions.

JULES: Right. “Dynamically typed” does not mean “untyped.” It means the checks happen while the program runs, and a variable can hold values of different types over time.

[CODE CARD]

```js
let result = 42;
result = "forty-two";
result = false;
```

PARISA: Legal JavaScript. Possibly a cry for help, but legal.

JULES: The variable is not permanently stamped NUMBER. Each value still has a type.

PARISA: So JavaScript asks, “What value is here now?”

JULES: TypeScript asks, “What values should this location be allowed to hold?”

## The `typeof` Séance

PARISA: JavaScript even gives us `typeof`.

JULES: It does. With historical personality.

[CODE CARD]

```js
typeof "hello"        // "string"
typeof 42             // "number"
typeof true           // "boolean"
typeof undefined      // "undefined"
typeof {}             // "object"
typeof []             // "object"
typeof null           // "object"
typeof function () {} // "function"
```

PARISA: `typeof null` is `"object"`, because JavaScript contains an ancient bug we are all now legally required to call behavior.

JULES: Essentially. It dates back to the original value representation in early JavaScript. Fixing it now would break code that depends on it.

PARISA: The web platform: where mistakes achieve tenure.

JULES: Arrays also report as objects because arrays are specialized objects in JavaScript.

PARISA: And functions get `"function"`, even though functions are callable objects.

JULES: Which is why `typeof` is useful, but not a complete taxonomy of JavaScript values.

PARISA: TypeScript has to model the language we actually have, including the haunted basement.

## Runtime Type Versus Static Type

JULES: At runtime, JavaScript can inspect the value currently present.

PARISA: TypeScript works before runtime, so it cannot inspect future values.

JULES: It analyzes the source code and builds a model from assignments, annotations, conditions, and declarations.

[CODE CARD]

```ts
let episodeNumber = 2;
episodeNumber = "two";
```

PARISA: TypeScript sees the initial number and infers that `episodeNumber` should remain a number.

JULES: Then it reports the string assignment before the JavaScript runs.

[TERMINAL]

```text
Type 'string' is not assignable to type 'number'.
```

PARISA: Static type: TypeScript’s development-time model. Runtime type: the type of the actual JavaScript value while executing.

JULES: Exactly.

PARISA: And the static model can be incomplete or wrong.

JULES: Yes. It is powerful, not psychic.

## Inference Is the Default Conversation

PARISA: In Episode 1, we established that TypeScript can infer obvious types.

JULES: Let’s make that less abstract.

[CODE CARD]

```ts
const host = "Parisa";
let episodeNumber = 2;
const published = false;
```

JULES: The compiler knows `host` is a string, `episodeNumber` is a number, and `published` is a boolean.

PARISA: Without us narrating the evidence back to it.

[CODE CARD]

```ts
const episode = {
  title: "Types You Already Had",
  durationMinutes: 28,
  published: false,
};
```

JULES: It also infers the object’s property names and value types.

PARISA: So autocomplete can offer `title`, `durationMinutes`, and `published`.

JULES: And reject a property that is not there.

[TERMINAL]

```text
Property 'durationSeconds' does not exist on type ...
```

PARISA: The error may be annoying, but at least it is annoyed about something real.

## The Lowercase Types

PARISA: Show me explicit primitive annotations.

[CODE CARD]

```ts
let title: string = "TypeScript";
let episodeNumber: number = 2;
let published: boolean = false;
```

JULES: TypeScript’s primitive types are lowercase: `string`, `number`, and `boolean`.

PARISA: Why are you emphasizing lowercase like someone has made a mistake?

JULES: Because JavaScript also has uppercase wrapper constructors named `String`, `Number`, and `Boolean`.

PARISA: Ah, boxed primitives. A feature everyone remembers immediately before asking why it exists.

JULES: Application code almost always wants the lowercase primitive types.

[CODE CARD]

```ts
// Usually what you mean
let name: string;

// Almost never what you mean
let boxedName: String;
```

PARISA: Please Don’t Do This: capitalize primitive type annotations because they look more official.

JULES: Correct. The capital letter changes the meaning.

## Arrays Are Objects, But We Can Be More Specific

PARISA: `typeof` says an array is an object. TypeScript can do better.

[CODE CARD]

```ts
const topics: string[] = ["types", "inference", "annotations"];
```

JULES: `string[]` means an array whose elements are strings.

PARISA: The brackets are TypeScript syntax here.

JULES: In the annotation, yes. The array literal on the right is JavaScript.

PARISA: Wait, That’s Just JavaScript remains employed.

[CODE CARD]

```ts
topics.push("functions"); // okay
topics.push(42);          // error
```

JULES: TypeScript checks the element type when we add values.

PARISA: It does not freeze the array.

JULES: Correct. `const` prevents reassignment of the variable; it does not make the array immutable.

PARISA: Also JavaScript.

JULES: Also frequently misunderstood JavaScript.

## Function Boundaries Need Information

PARISA: Local values are easy to infer because the values are right there. Function parameters arrive later.

JULES: Exactly. TypeScript needs us to describe what callers may provide.

[CODE CARD]

```ts
function formatTitle(title: string) {
  return title.toUpperCase();
}
```

PARISA: The parameter annotation contributes information. The return type can be inferred as string.

JULES: We could annotate the return when we want to enforce an explicit contract.

[CODE CARD]

```ts
function formatTitle(title: string): string {
  return title.toUpperCase();
}
```

PARISA: Useful at a boundary. Redundant on `const title = "TypeScript"`.

JULES: Usually. An annotation can also intentionally widen or restrict a value, but we’ll meet that when we discuss unions and literal types.

PARISA: So the rule is not “never annotate obvious values.”

JULES: The rule is “know what information the annotation adds.”

## What TypeScript Adds

PARISA: Final distinction. JavaScript values already have runtime types.

JULES: TypeScript adds a static system for describing and checking expected relationships between those values.

PARISA: JavaScript lets a variable hold different kinds of values.

JULES: TypeScript can restrict that variable based on inference or an explicit annotation.

PARISA: JavaScript’s `typeof` inspects runtime values, imperfectly.

JULES: TypeScript uses `typeof` checks as one source of information when analyzing code, which becomes important next time.

PARISA: JavaScript objects, arrays, functions, `let`, and `const` remain JavaScript.

JULES: Type annotations such as `: string`, `string[]`, and named object shapes are TypeScript.

PARISA: So TypeScript did not bring types to a lawless language.

JULES: It brought a development-time model to a dynamically typed one.

PARISA: Considerably less dramatic. Considerably more accurate.

## Closing

PARISA: Next problem. Sometimes a value really can be more than one type.

JULES: A string or a number. A user or null. Success or failure.

PARISA: And if TypeScript only allows one possibility, we have replaced JavaScript’s chaos with paperwork that lies.

JULES: That is why unions exist.

PARISA: And narrowing?

JULES: That is how we prove which possibility we currently have.

PARISA: Excellent. TypeScript has invented asking follow-up questions.

JULES: Honestly, yes.

PARISA: Okay. But why?

[END]
