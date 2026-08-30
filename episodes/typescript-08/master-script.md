# Episode 8 — Who Invited the Compiler?

## Cold open

PARISA: I installed TypeScript and it immediately gave me a config file containing enough switches to launch a regional airport.

JULES: `tsconfig.json`: because apparently “please check my code” needed a control panel.

PARISA: Today I want to know which machine is doing what. Type checker, compiler, bundler, transpiler, runtime—everybody put on a name tag.

JULES: Excellent. No toolchain fog. We begin with `tsc`.

## What the compiler does

JULES: The TypeScript package includes the TypeScript compiler, commonly run as `tsc`. It reads TypeScript, reports type errors, and can emit JavaScript.

[TERMINAL]
```text
npx tsc
```

PARISA: So the browser does not run my TypeScript file directly?

JULES: Generally, no. Type information has to be removed and syntax may be transformed into JavaScript your chosen environment understands.

[CODE CARD]
```ts
// source.ts
const greeting: string = "hello";
```

[CODE CARD]
```js
// emitted JavaScript
const greeting = "hello";
```

PARISA: The type annotation disappears because it was for development, not runtime behavior.

JULES: Right. “Compiler” can sound like TypeScript is creating machine code. Here it usually means checking types and transforming TypeScript-flavored source into JavaScript.

## The config file

PARISA: And `tsconfig.json` tells the compiler how to interpret the project.

JULES: Yes. It marks the project boundary and stores compiler options: what files belong, how strict checking should be, what JavaScript version to target, how modules are handled, whether output should be emitted, and more.

[CODE CARD]
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "NodeNext",
    "noEmit": true
  },
  "include": ["src"]
}
```

PARISA: That is a small example, not a universal sacred config.

JULES: Very much not universal. A Node server, browser app, library, test suite, and framework project need different settings. Start from the environment’s current documentation instead of copying a mysterious config from a six-year-old blog post.

## Strict is a family plan

PARISA: `strict: true` sounds judgmental.

JULES: It enables a family of stricter checks, including stronger handling of nulls and implicit `any`. It is usually the best starting point for new work because the compiler’s guarantees are much more useful.

PARISA: Existing JavaScript migrations may have to turn strictness on gradually.

JULES: Exactly. A thousand errors are not a learning experience; they are weather. You can migrate deliberately, but know which safety checks you have postponed.

[CODE CARD]
```ts
function greet(name) {
  return `Hello, ${name}`;
}
```

PARISA: With `noImplicitAny`, that untyped parameter is flagged instead of silently becoming `any`.

JULES: Which catches missing information at a boundary where it matters.

## Target is not audience demographics

PARISA: What does `target` do?

JULES: It selects the JavaScript language version TypeScript should emit. If your source uses newer syntax and the target is older, TypeScript can rewrite some of that syntax into older equivalents.

[CODE CARD]
```ts
const label = user?.profile?.label ?? "Guest";
```

PARISA: Depending on the target, that may be emitted with explicit checks instead of optional chaining and nullish coalescing.

JULES: Correct. But TypeScript does not automatically supply every missing browser feature. Syntax transformation and runtime polyfills are different jobs.

PARISA: Important. Rewriting the sentence does not install the vocabulary.

JULES: Also, `target` influences which built-in APIs TypeScript assumes exist through its default library definitions. Your real runtime support still needs to match your deployment plan.

## Modules: two questions wearing one coat

PARISA: Then `module`.

JULES: Modules involve both the JavaScript format and the rules used to find imported files. Modern Node projects have CommonJS and ECMAScript module concerns; browsers and bundlers have their own expectations.

[CODE CARD]
```ts
import { formatTitle } from "./format-title.js";
```

PARISA: This is where copying a config without understanding the runtime can create errors that feel supernatural.

JULES: Yes. Your `package.json`, file extensions, Node version, bundler, and compiler settings have to agree about what an import means.

PARISA: The bug is not always in the code. Sometimes four configuration files are reenacting a custody dispute.

## No emit and the crowded kitchen

PARISA: Why would we set `noEmit: true` if `tsc` can create JavaScript?

JULES: Because many projects use TypeScript only for type checking while another tool—such as a framework compiler, Babel, or SWC—handles transformation and bundling.

PARISA: TypeScript checks the ingredients; somebody else cooks and plates them.

JULES: Exactly. `noEmit` says, “Report type problems, but do not write output files.”

[TERMINAL]
```text
npx tsc --noEmit
```

PARISA: And a bundler is not automatically a type checker.

JULES: Correct. Some fast development tools remove TypeScript syntax without fully checking types. Your build can produce runnable JavaScript even while a separate type-check command would fail.

PARISA: That deserves a recurring bit called “The Build Passed, Unfortunately.”

## Source, output, and maps

JULES: If TypeScript does emit files, `rootDir` and `outDir` can help separate source from generated output.

[CODE CARD]
```json
{
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "sourceMap": true
  }
}
```

PARISA: `src` is what humans edit. `dist` is what the tool produces.

JULES: And source maps help debugging tools connect emitted JavaScript back to the TypeScript source. They are maps, not runtime type preservation.

PARISA: The browser still receives JavaScript. It just gets directions back to the original scene of the crime.

## Types are dependencies too

PARISA: Where do definitions like `document` or `setTimeout` come from?

JULES: TypeScript includes declaration libraries describing standard JavaScript and common runtime APIs. The `lib` option lets you choose environments—for example, browser DOM APIs versus a pure server context.

PARISA: So including DOM types says the code may use browser APIs. It does not summon a browser inside Node.

JULES: Exactly. Once again, a type declaration describes reality; it does not create reality.

## Please do not worship the config

PARISA: I have seen TypeScript configs with thirty inherited files and options nobody can explain.

JULES: Configuration should serve the project. Useful questions are: What runs this code? Who creates the JavaScript? What module rules apply? How strict do we want to be? What files are source, tests, or output?

PARISA: If we cannot answer those, adding another preset is not necessarily progress.

JULES: And compiler options evolve. Use the documentation for the TypeScript version and framework you actually have.

## Closing

PARISA: `tsc` checks types and may emit JavaScript. `tsconfig.json` defines the project and its checking and output rules.

JULES: `strict` strengthens checks. `target` affects emitted syntax. Module settings must match the runtime. `noEmit` lets another tool own the output.

PARISA: And a successful bundle does not necessarily mean the type check passed.

JULES: Next time we take all of this into a real project: migration, package types, API data, React’s TSX, and the radical idea that not every file needs to become TypeScript by lunchtime.

[END]
