# Episode 7 — The Escape Hatches Department

## Cold open

PARISA: I have discovered a feature that makes every TypeScript error disappear.

JULES: You deleted TypeScript.

PARISA: Less dramatic. I typed `any`.

JULES: Ah. You did not solve the fire. You took the batteries out of the smoke detector.

PARISA: But the beeping stopped.

JULES: Today: `any`, `unknown`, `never`, assertions, and all the ways we can technically win an argument with the compiler while losing the larger war.

[CODE CARD]
```ts
let mystery: any = "probably fine";
mystery.definitelyExists().sureWhyNot();
```

## Any means opt me out

PARISA: So what does `any` actually mean?

JULES: It means TypeScript largely stops checking how that value is used. You can call it, index it, read imaginary properties from it, or assign it almost anywhere.

PARISA: JavaScript mode, localized to one variable.

JULES: Pretty much. And sometimes that is useful during a migration or when a truly chaotic library gives you no better option.

PARISA: But if everything becomes `any`, we bought an expensive spell-checker and clicked ignore all.

JULES: Exactly. Worse, `any` spreads. Pass an `any` value through your program and code touching it can lose useful checking too.

[CODE CARD]
```ts
function getLength(value: any) {
  return value.length;
}

getLength(null); // TypeScript allows it. Runtime does not.
```

PARISA: Important distinction: TypeScript did not prove this was safe. We specifically told it not to ask questions.

JULES: `any` is an escape hatch, not a type-safety achievement.

## Unknown means prove it

PARISA: Then `unknown` is the suspicious cousin?

JULES: The responsible suspicious cousin. `unknown` says, “There is a value here, but we do not yet know what it is.” You can store anything in it, but you have to narrow it before using it.

[CODE CARD]
```ts
function printLength(value: unknown) {
  if (typeof value === "string") {
    console.log(value.length);
  }
}
```

PARISA: That is perfect for data crossing a boundary: parsed JSON, user input, a message from another system.

JULES: Yes—with one warning. Calling something `unknown` does not validate it. It merely forces our code to perform checks before trusting it.

PARISA: TypeScript is the clipboard at the door. Runtime validation is the bouncer actually checking IDs.

JULES: And `JSON.parse` is particularly awkward because its standard return type is `any`. A careful program treats the result as untrusted and validates its shape.

[CODE CARD]
```ts
const raw: unknown = JSON.parse(responseText);

if (
  typeof raw === "object" &&
  raw !== null &&
  "name" in raw &&
  typeof raw.name === "string"
) {
  console.log(raw.name);
}
```

PARISA: Real validation gets verbose quickly.

JULES: Which is why larger projects often use a runtime validation library or a carefully tested validator. That library is doing runtime work. TypeScript alone is not inspecting the network response.

## Assertions: I know better, allegedly

PARISA: What about `as`? I see `something as User` all over TypeScript.

JULES: That is a type assertion. It tells the compiler, “Treat this value as this type.” It does not convert the value and does not add a runtime check.

[CODE CARD]
```ts
type User = { name: string };

const user = JSON.parse("{}") as User;
console.log(user.name.toUpperCase()); // Runtime crash
```

PARISA: So `as User` is not a tiny factory that manufactures a User.

JULES: No. It is paperwork. The JavaScript value remains exactly what it was.

PARISA: When is an assertion reasonable?

JULES: When we genuinely know something the compiler cannot infer—often because of a DOM lookup, framework boundary, or earlier runtime check. The smaller and more local the assertion, the easier it is to audit.

[CODE CARD]
```ts
const button = document.querySelector<HTMLButtonElement>("#save");

if (button) {
  button.disabled = true;
}
```

PARISA: And that generic query selector still does not guarantee the element exists.

JULES: Right. We kept the null check. Confidence is not evidence.

## The non-null assertion

PARISA: Then there is the tiny exclamation mark: `button!`.

JULES: The non-null assertion says a value is definitely not `null` or `undefined`. Again, it changes the type checker’s opinion, not reality.

[CODE CARD]
```ts
const form = document.querySelector("form")!;
form.addEventListener("submit", save);
```

PARISA: If somebody renames the form in the HTML, the exclamation mark will not leap into the browser and fix it.

JULES: Correct. Use it only when an external guarantee is truly solid. A normal null check usually tells a more honest story.

## Never means this cannot happen

PARISA: `never` sounds like TypeScript has become a dramatic teenager.

JULES: It describes a value that should never exist. A function that always throws can return `never`. And after TypeScript eliminates every possible member of a union, what remains is `never`.

[CODE CARD]
```ts
function fail(message: string): never {
  throw new Error(message);
}
```

PARISA: That seems abstract until we use it for exhaustive checks.

JULES: Exactly. Imagine every request has one of three states.

[CODE CARD]
```ts
type RequestState =
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; message: string };

function assertNever(value: never): never {
  throw new Error(`Unhandled state: ${JSON.stringify(value)}`);
}
```

PARISA: Then our switch handles all three and sends the default case to `assertNever`.

[CODE CARD]
```ts
function describe(state: RequestState): string {
  switch (state.status) {
    case "loading": return "Loading…";
    case "success": return state.data;
    case "error": return state.message;
    default: return assertNever(state);
  }
}
```

JULES: If we later add a `cancelled` state and forget the switch, `state` is no longer `never` in the default branch. The compiler points at the missing case.

PARISA: That is actually pretty cool. The impossible branch becomes an alarm for future changes.

## Please do not do this

JULES: We should mention double assertions.

PARISA: The forbidden ritual?

JULES: Code like `value as unknown as User` can force incompatible types past the checker.

[CODE CARD]
```ts
const count = 42 as unknown as { name: string };
```

PARISA: That compiles because we walked the value through a neutral country.

JULES: And it is almost always evidence that the model, library types, or validation boundary needs attention. There are rare integration cases, but the code should explain why the assertion is justified.

PARISA: The escape hatches are not evil. Sometimes you are migrating twenty years of JavaScript or dealing with a library assembled during a thunderstorm.

JULES: The question is whether the unsafety is contained, named, and temporary—or whether it quietly becomes the architecture.

## Closing

PARISA: So: `any` opts out, `unknown` demands proof, assertions tell the compiler to trust us, and `never` represents a case that should be impossible.

JULES: And none of them validate runtime data by magic.

PARISA: I can still use the escape hatch.

JULES: Yes. Just remember that an escape hatch is supposed to lead out of the dangerous room.

PARISA: Not become the front door.

JULES: Next time, we meet the compiler, the config file, and the unsettling number of tools standing around TypeScript asking who is responsible for JavaScript output.

[END]
