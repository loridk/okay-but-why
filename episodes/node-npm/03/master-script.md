# Episode 3: package.json, node_modules & Dependency Hell

Status: Draft

## Cold Open

[MUSIC]

PARISA: I deleted `node_modules`.

JULES: Okay.

PARISA: The project still exists.

JULES: Yes.

PARISA: I ran `npm install`, and `node_modules` came back.

JULES: Yes.

PARISA: So it is a fungus.

JULES: That's not the official definition.

PARISA: You remove the visible fruiting body, but the spores remain in `package.json`.

JULES: I hate that this maps as well as it does.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*, the show where we look inside the generated directory everyone tells you not to look inside.

JULES: I'm Jules.

PARISA: And I'm Parisa. Last time, npm installed our project's dependencies.

JULES: Today we look at the records and the result: `package.json`, `package-lock.json`, and `node_modules`.

PARISA: Also dependency hell.

JULES: A beloved destination.

## The Three-Part Mental Model

PARISA: Give me the map first.

JULES: `package.json` describes the project and its declared direct dependencies.

PARISA: The shopping list.

JULES: Roughly. `package-lock.json` records the exact dependency resolution npm produced.

PARISA: The receipt, including which brand and size actually came home.

JULES: And `node_modules` is the installed stuff in your local working copy.

PARISA: The groceries currently occupying the kitchen.

JULES: Good.

PARISA: If I throw out the groceries, the list and receipt let npm restock.

JULES: Yes, with one warning: the lockfile is more than a receipt. npm uses it as a reproducibility map.

PARISA: Metaphor disclaimer accepted.

## `package.json` Is Project Metadata

PARISA: Show me a small one.

[CODE CARD]

```json
{
  "name": "tiny-app",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "test": "node --test"
  },
  "dependencies": {
    "react": "^19.0.0"
  },
  "devDependencies": {
    "vite": "^8.0.0"
  }
}
```

PARISA: First clarification: JSON is not JavaScript.

[STING]

### Wait, That's Just JavaScript

JULES: Correct. JSON means JavaScript Object Notation, but it is a data format.

PARISA: It resembles a JavaScript object literal, but the syntax is stricter. Double-quoted property names. No comments. No trailing commas.

JULES: And it cannot contain functions, variables, or expressions. It represents data.

PARISA: So `package.json` is data that tools read.

JULES: Exactly.

PARISA: Which fields are required?

JULES: That depends on what you're doing. A private application can have a very small file. A package intended for publication needs accurate package metadata and entry-point information.

PARISA: So don't cargo-cult every field from a library into a frontend app.

JULES: Please don't.

## Name, Version, and `private`

PARISA: `name` seems self-explanatory.

JULES: It identifies the package. Published package names must follow registry rules and be unique within their namespace.

PARISA: `version` is semantic versioning?

JULES: Conventionally, yes: major, minor, patch.

PARISA: Major for breaking changes. Minor for backward-compatible features. Patch for backward-compatible fixes.

JULES: That's the promise SemVer is trying to communicate.

PARISA: Trying.

JULES: Humans still choose the number.

PARISA: And `private: true`?

JULES: It tells npm not to publish this package accidentally.

PARISA: Useful for an application that is not meant to become a public registry package.

JULES: Very.

PARISA: A tiny safety latch.

JULES: One worth keeping.

## The Mysterious Caret

PARISA: Why does the React version have a little roof: `^19.0.0`?

JULES: The caret describes an allowed version range.

PARISA: Not an exact version.

JULES: Right. For a stable major version like nineteen, it generally allows compatible releases from nineteen point zero point zero up to, but not including, twenty point zero point zero.

PARISA: So npm may select a newer minor or patch within major nineteen.

JULES: Yes.

PARISA: The caret assumes the package follows semantic versioning and doesn't sneak a breaking change into a minor release.

JULES: Correct. Version ranges are statements of trust and compatibility, not force fields.

PARISA: What about a tilde?

JULES: A tilde is typically narrower and allows patch-level movement within the specified minor line.

PARISA: Exact number means exact number.

JULES: In `package.json`, yes. But your lockfile is what records the exact version npm resolved for the whole tree.

PARISA: So this is why we need both files.

JULES: `package.json` expresses acceptable requirements. The lockfile records a concrete solution.

[STING]

### Okay, That's Actually Pretty Cool

PARISA: The manifest says what changes we claim we can tolerate. The lockfile says what we actually tested together.

JULES: Exactly.

## Dependencies Are Intent

PARISA: The dependency sections contain only packages we chose directly?

JULES: Usually, yes. Your direct dependencies and dev dependencies.

PARISA: Not every transitive dependency?

JULES: Those belong in the lockfile's resolved graph. If a build tool needs a parser, you usually declare the build tool. It declares the parser it needs.

PARISA: Unless my code imports Rollup directly.

JULES: Then Rollup is your direct dependency too and should be declared.

PARISA: Even if it happened to arrive transitively already.

JULES: Yes. Depending on a package merely because another dependency currently brings it along is fragile.

PARISA: A dependency changes and my accidental free passenger disappears.

JULES: Then your project breaks, and everyone learns a lesson at an inconvenient time.

## Scripts Are Named Commands

PARISA: We saw a `scripts` object.

JULES: It maps names to command strings.

PARISA: `"dev": "vite"` means when I run `npm run dev`, npm runs the command `vite`.

JULES: Exactly.

PARISA: Is `dev` special?

JULES: No. It is a common convention. You can define other names.

PARISA: Some commands can omit `run`, like `npm test`.

JULES: npm provides shorthand for a few lifecycle commands, but `npm run name` is the general form.

PARISA: Why use a script instead of telling everyone to type the full command?

JULES: It gives the project a stable interface. The underlying tool and options can change, while contributors keep running `npm run dev` or `npm test`.

PARISA: It also uses the project's local tool version.

JULES: Yes. npm adds local package executables to the script's command path while the script runs.

PARISA: That sentence explains years of magic.

JULES: We're spending the whole next episode on it.

## The `type` Field Is About Modules

PARISA: Our sample says `"type": "module"`.

JULES: That tells Node how to interpret ordinary `.js` files in this package: as ECMAScript modules.

PARISA: Meaning `import` and `export`.

JULES: Yes.

PARISA: Without it, Node commonly treats `.js` as CommonJS in that package, where older code uses `require` and `module.exports`.

JULES: Correct.

PARISA: Are `import` and `export` Node syntax?

JULES: No. They are JavaScript module syntax.

[STING]

### Wait, That's Just JavaScript

PARISA: Modern JavaScript, not TypeScript, React, or npm.

JULES: Right. But the runtime and tools still need rules for resolving module files, which is why configuration matters.

PARISA: We are deliberately not solving the entire CommonJS versus ESM situation today.

JULES: Correct. We are placing the warning sign on the map.

PARISA: Here be modules.

## What Is Actually Inside `node_modules`?

PARISA: Time to open the basement.

JULES: `node_modules` contains installed packages and the layout npm created so Node and tools can resolve them.

PARISA: I see directories for packages I declared and dozens I did not.

JULES: Transitive dependencies.

PARISA: I also see names beginning with `@`.

JULES: Scoped packages. The scope groups packages under a namespace, such as an organization or user.

PARISA: And `.bin`?

JULES: Links or command shims for executables supplied by installed packages.

PARISA: So when an npm script runs `vite`, npm can find the local Vite command through `node_modules/.bin`.

JULES: Precisely.

PARISA: That is deeply mundane and enormously clarifying.

JULES: Most magic is a path somebody configured for you.

## How Module Resolution Uses the Tree

PARISA: My source says `import something from "something"`. How does it find the package?

JULES: The runtime or build tool applies its module-resolution rules. For an installed package name, those rules can search appropriate `node_modules` locations and read the package's metadata to find an exported entry point.

PARISA: “The” module-resolution algorithm is not universal?

JULES: Correct. Node, TypeScript, bundlers, and other tools have related but configurable rules. They can disagree if a project is misconfigured.

PARISA: Delicious.

JULES: The key idea is that the import is not scanning every file randomly. Package layout and metadata provide a resolution contract.

PARISA: And modern packages may define an `exports` field.

JULES: Yes. It can declare which entry points consumers are allowed to use, and sometimes provide different entries for different conditions.

PARISA: Which is why reaching into `some-package/dist/secret-internal-file.js` can break after an update.

JULES: You bypassed the public entrance and climbed through a bathroom window.

PARISA: It worked yesterday.

JULES: Bathrooms get renovated.

PARISA: Use documented exports, not whatever internal path autocomplete discovered.

JULES: Exactly.

## The Lockfile Knows More Than Versions

PARISA: We keep saying the lockfile records exact versions. What else?

JULES: Modern npm lockfiles describe the package tree, resolved sources, and integrity hashes for downloaded package contents.

PARISA: Integrity means npm can detect if the downloaded archive does not match the expected cryptographic digest.

JULES: Yes. It helps ensure the bytes retrieved match the bytes the lockfile expects.

PARISA: It does not prove those expected bytes are benevolent.

JULES: Important. Integrity is not a code review or a safety guarantee. It detects unexpected content changes relative to the recorded digest.

PARISA: The lockfile may also contain platform constraints and dependency relationships npm needs to rebuild the tree.

JULES: Right.

PARISA: Which explains why merge conflicts in it are not solved by deleting whichever half looks uglier.

JULES: Resolve the underlying dependency changes, then let the package manager produce a coherent lockfile.

PARISA: If two branches add packages, rerunning the correct install after reconciling `package.json` may regenerate the combined graph.

JULES: Then run the clean install and tests. Do not assume a conflict-free JSON file means a valid dependency tree.

## Node and Package-Manager Versions Matter

PARISA: Same manifest, same lockfile, different Node version. Can behavior change?

JULES: Yes. Packages can require particular Node versions, native dependencies may differ by platform, and package-manager versions can produce different lockfile formats or installation behavior.

PARISA: How does a project communicate the Node requirement?

JULES: It can use the `engines` field in `package.json`, documentation, and a version-manager file or tool configuration.

PARISA: Is `engines` always enforced?

JULES: Not necessarily. Depending on npm configuration it may warn rather than refuse. CI and hosting configuration can enforce the chosen version more reliably.

PARISA: So a warning about an unsupported engine is not decorative terminal confetti.

JULES: Correct. It may explain installation or runtime failures.

PARISA: And a project should use one package manager consistently.

JULES: The `packageManager` field can record the expected tool and version, and projects may use Corepack or other version-management approaches.

PARISA: Again: the repository should describe its environment instead of relying on oral tradition from the one laptop where it works.

JULES: “Ask Morgan which npm she has” is not reproducibility.

## Why Is It So Huge?

PARISA: Why does `node_modules` contain enough files to make Windows reconsider its life choices?

JULES: JavaScript packages tend to be small and composable, and a modern tool may rely on many specialized packages.

PARISA: Which creates a broad dependency graph.

JULES: Packages may also ship source files, compiled variants, type declarations, metadata, documentation, maps, and platform-specific pieces.

PARISA: npm can sometimes deduplicate compatible versions.

JULES: Yes. It can place a shared version where multiple consumers can resolve it. But if two parts of the graph require incompatible versions, multiple copies may be installed.

PARISA: So seeing repeated packages is not automatically corruption.

JULES: Correct. The layout is npm's attempt to satisfy the graph.

PARISA: Do I edit files in `node_modules` to fix a bug?

JULES: No.

PARISA: Strong no.

JULES: Your change will disappear on reinstall and won't reach teammates or CI. Fix your source, update or replace the dependency, contribute upstream, or use a deliberate patch workflow the project records.

PARISA: Generated material is not source control by vibes.

## Hoisting, Nesting, and Why the Folder Lies a Little

PARISA: If the graph branches, why does `node_modules` look surprisingly flat at the top?

JULES: npm can hoist packages higher when doing so still satisfies their consumers.

PARISA: Several packages can resolve one compatible shared copy.

JULES: Yes. If branches require incompatible versions, npm may place one higher and another inside a dependency's nested `node_modules`.

PARISA: So the physical layout implements the graph. It is not a simple picture of it.

JULES: Exactly. Do not infer direct dependencies merely from what appears at the top level.

PARISA: And do not import a hoisted transitive package just because it is reachable today.

JULES: Declare what your code uses directly.

PARISA: pnpm uses a different storage and linking strategy, so code relying on accidental npm hoisting can fail there.

JULES: Stricter layouts can expose undeclared dependencies your project was getting away with.

PARISA: The package manager did not necessarily break the project. It revealed that the manifest was lying.

## Optional and Platform-Specific Dependencies

PARISA: Why can correct installs from one lockfile contain different platform packages?

JULES: Dependencies can be conditional on operating system or CPU architecture. Packages may also declare optional dependencies that can fail without failing the entire install.

PARISA: A tool might select one native binary for Windows on x64 and another for macOS on ARM.

JULES: Yes. The lockfile can describe possibilities while npm installs what applies to this environment.

PARISA: So “exact same tree” has an environmental footnote.

JULES: Deterministic rules can still produce legitimately platform-specific outputs.

PARISA: If we require identical build artifacts, we need to control the build environment too.

JULES: Containers and pinned CI environments can help later.

PARISA: Kubernetes is waiting behind a bush.

JULES: Not yet.

## Why Deleting `node_modules` Sometimes Works

PARISA: The traditional healing ritual: delete `node_modules` and reinstall.

JULES: It can fix a local installation that is incomplete, corrupted, or out of sync.

PARISA: It removes hand edits and stale packages that no longer belong.

JULES: A clean install tests whether the recorded project state can reproduce a working tree.

PARISA: But it does not fix incorrect dependency requirements.

JULES: No. A broken manifest and lockfile produce a pristine broken installation.

PARISA: Deleting the lockfile at the same time changes the experiment.

JULES: Dramatically. npm resolves a new graph, so success or failure may come from different versions.

PARISA: Clean `node_modules` to reproduce recorded state. Change the lockfile only when deliberately changing resolution.

JULES: Excellent distinction.

## Why We Usually Ignore It in Git

PARISA: `node_modules` is reproducible from project records.

JULES: That's the idea.

PARISA: It is large, contains huge numbers of files, may include platform-specific artifacts, and changes noisily.

JULES: All reasons ordinary application repositories ignore it.

PARISA: We commit `package.json` and the correct lockfile.

JULES: Yes.

PARISA: Then a clean environment installs from those records.

JULES: For automated environments, `npm ci` is commonly preferred when you have a lockfile.

PARISA: How is that different?

JULES: It performs a clean, lockfile-driven install. It fails if the manifest and lockfile disagree instead of quietly rewriting the lockfile.

PARISA: So CI gets a stricter “install exactly what we agreed on” workflow.

JULES: Right. It also removes an existing `node_modules` before installing.

PARISA: Do not run it casually if you are preserving unrecorded experiments in there.

JULES: You should not have unrecorded experiments in there.

PARISA: Yet another reason not to edit dependencies directly.

## Dependency Hell

[OMINOUS MUSIC]

PARISA: Define the hell.

JULES: Dependency hell is the family of problems that appears when software requirements conflict, drift, disappear, or become too complex to reason about comfortably.

PARISA: Version conflicts.

JULES: Package A needs version one. Package B needs version two. Maybe both can coexist; maybe a peer relationship requires one shared compatible version.

PARISA: Peer dependency. New noun.

JULES: A peer dependency says, roughly, “I work alongside this package, and the consuming project needs to provide a compatible version.”

PARISA: Like a React plugin declaring which React versions it expects, instead of secretly installing its own private React universe.

JULES: Good example.

PARISA: Other hells?

JULES: Abandoned packages. Breaking changes. Platform-specific builds. Lockfile conflicts. Duplicate versions. A package removed from the registry. A vulnerability deep in the transitive graph.

PARISA: Or two tools each requiring a range with no overlap.

JULES: Exactly.

PARISA: The package manager can resolve graphs. It cannot repeal contradictory requirements.

JULES: That is the key distinction.

## Peer Dependencies Without the Screaming

PARISA: I want one more pass at peer dependencies because error messages make them look like a custody dispute.

JULES: Imagine a plugin designed to integrate with a host library.

PARISA: A React-related package that expects the application to have React.

JULES: The plugin does not necessarily want its own isolated React copy. It wants to participate in the application's React environment.

PARISA: So it declares a compatible React range as a peer dependency.

JULES: npm can then check whether the surrounding dependency tree supplies a compatible peer.

PARISA: If Plugin A supports React eighteen through nineteen and the app uses nineteen, fine.

JULES: If Plugin B only supports seventeen, the requirements conflict.

PARISA: `--legacy-peer-deps` tells npm to behave more like older npm versions and ignore peer dependency relationships while building the tree.

JULES: Which may get an install past the error without making the packages actually compatible.

PARISA: The alarm stopped because I removed the battery.

JULES: Exactly.

PARISA: Sometimes a project deliberately uses that setting for known reasons.

JULES: Then record it in project configuration and understand the tradeoff. Do not paste the flag merely because the terminal became red.

## Overrides: The Emergency Steering Wheel

PARISA: What if a deep dependency has a vulnerable version and its parent has not updated yet?

JULES: npm supports `overrides` in the root project manifest. An override can force a dependency or part of the tree to resolve differently.

PARISA: Useful.

JULES: Powerful and potentially dangerous. The parent package may have constrained its dependency for a reason.

PARISA: So an override needs a comment.

JULES: JSON does not allow comments.

PARISA: Right. Of course.

JULES: Document the reason in the commit, issue, or project documentation. Test the affected behavior and remove the override when the upstream graph supports the safe version normally.

PARISA: Override is not a synonym for “I know better than every maintainer.”

JULES: It is an explicit root-project decision to alter resolution.

PARISA: And published packages cannot use their own overrides to dictate a consumer's whole dependency universe.

JULES: The root project owns that final decision.

## Workspaces: Several Packages, One Repository

PARISA: I see `workspaces` in some `package.json` files.

JULES: npm workspaces help manage multiple related packages from one top-level project.

PARISA: A monorepo.

JULES: Often. You might have an application, a component library, and shared configuration packages in one repository.

PARISA: npm can link local workspace packages and run commands across them.

JULES: Yes, while maintaining a root installation and lockfile strategy.

PARISA: Does every project need workspaces?

JULES: Absolutely not. They solve coordination problems that appear when one repository genuinely contains multiple packages.

PARISA: Do not turn one small app into a monorepo because the word sounds employable.

JULES: Put that on mug three.

## Please Don't Do This: Random Version Surgery

[STING]

PARISA: Error says dependency conflict. I delete the lockfile.

JULES: Not as your first reflex.

PARISA: I add `--force`.

JULES: Also not as your first reflex.

PARISA: I copy a stranger's resolution override from a three-year-old forum post.

JULES: Please stop helping.

PARISA: What do I do?

JULES: Read which packages disagree and what ranges they require. Check the project's documented Node and package-manager versions. Look at release notes. Upgrade or downgrade deliberately. Run the tests.

PARISA: Understand the graph before rearranging it.

JULES: Tools such as `npm explain package-name` and `npm ls` can show why something is installed and where versions appear.

PARISA: And if an audit reports a transitive vulnerability?

JULES: Determine whether the vulnerable code is reachable in your use, whether a patched compatible version exists, and what upgrade path is safe. Severity labels matter, but context matters too.

PARISA: Security without panic or denial.

JULES: Exactly.

## The Clean-Room Test

PARISA: How do I know the repository contains everything another machine needs?

JULES: Try a clean install in a disposable environment or clean working copy, then run the documented checks and build.

PARISA: If it works only because my laptop has a global package or a hand-edited `node_modules`, the project is lying.

JULES: Nicely put.

PARISA: A lockfile improves reproducibility, but operating system, CPU architecture, Node version, environment variables, and external services can still differ.

JULES: Yes. Reproducible dependencies are one layer, not a complete reproducible universe.

PARISA: Metaphor disclaimer for reality itself.

## What Did We Actually Learn?

PARISA: `package.json` declares project metadata, scripts, and direct dependency intent.

JULES: Yes.

PARISA: `package-lock.json` records npm's exact resolved graph and integrity information.

JULES: Yes.

PARISA: `node_modules` is the generated local installation.

JULES: Correct.

PARISA: Delete the installation and npm can reconstruct it from the records.

JULES: Assuming the packages remain obtainable and the environment is compatible, yes.

PARISA: Good caveat.

JULES: Thank you.

PARISA: Version ranges express acceptable movement. The lockfile captures the selected versions.

JULES: Right.

PARISA: npm scripts expose project commands and can find executables from locally installed packages.

JULES: Which leads directly to our next mystery.

PARISA: I type `npm run dev`.

JULES: npm finds the script.

PARISA: The script says `vite`.

JULES: npm finds local Vite.

PARISA: Vite starts a server, transforms modules, watches files, and opens a portal into modern frontend tooling.

JULES: A local web address.

PARISA: Same thing.

JULES: Next episode, we follow the command all the way from the terminal to the browser.

PARISA: We are going into the factory.

[MUSIC OUT]
