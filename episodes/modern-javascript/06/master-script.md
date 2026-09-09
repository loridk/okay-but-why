# Episode 6: Import This, Export That

Status: Draft

**CAST**

PARISA — Experienced millennial web developer. Learned JavaScript before ES6 and has strong traditional web fundamentals. Suspicious of unexplained punctuation.

JULES — Gen Z developer who entered development when modern JavaScript syntax was already normal. Parisa's peer, not her professor.

[MUSIC]

## Cold Open

PARISA: In the beginning, there was `<script src="jquery.js">`.

JULES: And then?

PARISA: `<script src="plugin.js">`.

JULES: And then?

PARISA: `<script src="app.js">`.

JULES: And then?

PARISA: Something loaded in the wrong order and we went home.

## Who Asked for Modules?

JULES: As applications grew, developers needed a reliable way to split code into files with explicit dependencies and controlled public interfaces.

PARISA: Because separate script files weren't automatically separate scopes or a dependency system.

JULES: Right. Historically, developers used patterns like IIFEs and later module systems and bundlers to solve this before standardized ECMAScript modules were broadly available.

## Export What You Mean to Share

JULES: In an ES module, a file can export values.

[CODE CARD]
```js
export function add(a, b) {
  return a + b;
}

export const version = "1.0";
```

JULES: Another module imports them.

[CODE CARD]
```js
import { add, version } from "./math.js";
```

PARISA: Explicit dependencies. I can look at the top and see where `add` came from.

JULES: That's one major benefit.

## Named Versus Default Exports

JULES: Named exports have names and can have several per module. A module can also have one default export.

[CODE CARD]
```js
export default function App() {
  // ...
}
```

[CODE CARD]
```js
import App from "./App.js";
```

PARISA: And the importer can choose a different local name for a default export.

JULES: Yes. Named imports must correspond to exported names unless you explicitly alias them.

PARISA: Which is why teams develop opinions about default exports.

JULES: Strong opinions.

PARISA: We do love inventing tiny churches.

## Modules Have Their Own Scope

JULES: Module declarations don't automatically spill into the global scope.

PARISA: Already worth the price of admission.

JULES: Modules also have strict-mode semantics and a defined loading model. Static `import` declarations let tools understand the dependency graph before running the program.

PARISA: Which later helps bundlers do things like tree shaking.

JULES: Exactly, though tree shaking is a tooling optimization, not a magical behavior of `import` itself.

## Browser Modules

JULES: Browsers can load ES modules directly.

[CODE CARD]
```html
<script type="module" src="/app.js"></script>
```

PARISA: So modules aren't inherently a Node thing or a bundler thing.

JULES: Correct. ECMAScript modules are standardized JavaScript modules.

PARISA: WAIT, THAT'S JUST JAVASCRIPT.

JULES: Precisely.

## Then Why Did We Have CommonJS?

PARISA: Enter `require`.

JULES: Before standardized ES modules were broadly usable, Node popularized CommonJS.

[CODE CARD]
```js
const fs = require("node:fs");
module.exports = something;
```

JULES: That's a different module system from ESM's `import` and `export`.

PARISA: Which is why Node projects sometimes contain both worlds and error messages that read like custody disputes.

JULES: Modern Node supports ES modules, but package configuration, file extensions, and dependencies can determine how a file is interpreted.

## The File Extension Thing

JULES: In browsers, relative ESM imports normally include the actual path and extension.

[CODE CARD]
```js
import { add } from "./math.js";
```

PARISA: But build tools sometimes let us write resolution patterns that aren't literally what the browser would do.

JULES: Exactly. Another reason to distinguish JavaScript's module syntax from tooling's resolver behavior.

## Dynamic Import

JULES: There's also dynamic `import()`.

[CODE CARD]
```js
const module = await import("./heavy-feature.js");
```

JULES: It returns a promise and can load a module conditionally or later.

PARISA: Useful for code splitting with tooling.

JULES: Yes, though exactly how chunks are produced is a bundler concern.

## Please Don't Do This: Cargo-Cult Module Rules

PARISA: Default exports bad?

JULES: Not universally.

PARISA: Barrel files bad?

JULES: Not universally.

PARISA: One file per function?

JULES: Please go outside.

PARISA: Excellent. Modules solve dependency and scope problems. File organization is still design.

## What Did We Actually Learn?

PARISA: ES modules give JavaScript standardized `import` and `export`.

JULES: Browsers can run them directly. Node can run them too.

PARISA: CommonJS is a different module system that predates standardized ESM adoption in Node.

JULES: And bundlers can analyze module graphs, but bundling is tooling, not what `import` means.

PARISA: Which hands us beautifully into Node and npm later.

JULES: We planned that.

PARISA: Allegedly.

