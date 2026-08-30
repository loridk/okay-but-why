# Episode 4: Please Describe Your Object

Status: Draft

## Cold Open

PARISA: TypeScript has `type` and `interface`.

JULES: Yes.

PARISA: They both describe object shapes.

JULES: Often, yes.

PARISA: Are they meaningfully different, or did two committees arrive before lunch?

JULES: Both answers contain truth.

## Structural Typing

[CODE CARD]

```ts
type Episode = {
  title: string;
  durationMinutes: number;
};

function publish(episode: Episode) {
  return episode.title;
}
```

JULES: TypeScript mostly cares about structure—what properties a value has—not the ceremonial name of its class.

[CODE CARD]

```ts
const draft = {
  title: "Please Describe Your Object",
  durationMinutes: 27,
  notes: "Needs fewer object jokes",
};

publish(draft); // okay
```

PARISA: The extra `notes` property does not stop the variable from matching the required shape.

JULES: Right. This is structural typing: duck typing with paperwork.

## Object Literal Checks

[CODE CARD]

```ts
publish({
  title: "Objects",
  durationMinutes: 27,
  duratonMinutes: 30,
});
```

[TERMINAL]

```text
Object literal may only specify known properties.
```

PARISA: A fresh object literal gets extra checking that catches the misspelling close to where I wrote it.

JULES: Exactly. Structural compatibility remains the model, with extra help for fresh literals.

## Optional and Readonly Properties

[CODE CARD]

```ts
type Episode = {
  title: string;
  description?: string;
  readonly episodeNumber: number;
};
```

PARISA: Question mark means the property may be absent.

JULES: And `readonly` prevents assignment through this TypeScript type.

[CODE CARD]

```ts
episode.episodeNumber = 12;
```

[TERMINAL]

```text
Cannot assign to 'episodeNumber' because it is a read-only property.
```

PARISA: Does readonly freeze the JavaScript object at runtime?

JULES: No. Runtime immutability, such as `Object.freeze`, is a separate JavaScript concern.

## Type Aliases

[CODE CARD]

```ts
type EpisodeId = string | number;
type Status = "draft" | "published";
type Topics = string[];
```

JULES: A type alias gives a reusable name to any type expression—not only object shapes.

PARISA: Union, array, tuple, object. Fine.

## Interfaces

[CODE CARD]

```ts
interface Episode {
  title: string;
  durationMinutes: number;
}
```

PARISA: The same basic object shape.

JULES: For many everyday object models, either a type alias or interface works.

[CODE CARD]

```ts
interface MediaItem {
  title: string;
}

interface Episode extends MediaItem {
  durationMinutes: number;
}
```

PARISA: Interfaces can extend interfaces.

JULES: Type aliases can combine shapes with intersections.

[CODE CARD]

```ts
type Episode = MediaItem & {
  durationMinutes: number;
};
```

PARISA: Two vocabularies for related outcomes. Welcome to a mature language.

## The Actual Difference: Openness

[CODE CARD]

```ts
interface Episode {
  title: string;
}

interface Episode {
  durationMinutes: number;
}
```

JULES: Interfaces can participate in declaration merging. TypeScript combines those declarations.

PARISA: A type alias cannot be reopened that way.

JULES: Correct. Interfaces are open; aliases are closed after declaration.

PARISA: Useful for deliberate library extension. Concerning when accidental.

JULES: Consistency matters more than pretending one syntax is universally superior.

## Arrays and Readonly Arrays

[CODE CARD]

```ts
const topics: string[] = ["objects", "interfaces"];
const fixedTopics: readonly string[] = ["objects", "interfaces"];
```

PARISA: A readonly array prevents mutating methods through that reference.

[CODE CARD]

```ts
fixedTopics.push("tuples"); // error
```

JULES: It still does not freeze the runtime array.

PARISA: And `Array<string>` is equivalent generic syntax.

JULES: We will earn the angle brackets in Episode 6.

## Tuples: Arrays With Assigned Seats

[CODE CARD]

```ts
type EpisodeSummary = [title: string, durationMinutes: number];

const summary: EpisodeSummary = ["Objects", 27];
```

JULES: A tuple describes an array with a fixed sequence of element types. Labels improve editor hints.

PARISA: At runtime it remains an ordinary array.

JULES: Yes.

PARISA: And an object is usually clearer when named properties matter or the data may grow.

JULES: Exactly. Tuples suit compact position-based relationships, not every record with two fields.

## Modeling Is the Work

PARISA: The syntax is not the hard part. Deciding what the shape should say is the hard part.

JULES: Should a property be optional? Should null be explicit? Is this one object with optional fields, or a union of distinct states?

PARISA: The compiler checks the contract. It does not design the contract.

JULES: Good types make valid states clear and invalid states harder to express.

PARISA: Bad types document confusion with impressive precision.

## Closing

PARISA: TypeScript compares structures, not family trees.

JULES: Type aliases can name any type expression. Interfaces focus on object-like shapes and can merge.

PARISA: Optional means possibly absent. Readonly is compile-time protection, not a runtime freeze.

JULES: Arrays model repeated elements. Tuples assign types to positions.

PARISA: Next time: functions, where all these values cross boundaries and ruin somebody’s afternoon.

JULES: Function contracts.

PARISA: Okay. But why?

[END]
