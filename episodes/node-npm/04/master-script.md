# Episode 4: What Actually Happens When You Run npm run dev?

Status: Draft

## Cold Open

[MUSIC]

PARISA: `npm run dev`.

JULES: Yes.

PARISA: Explain every word.

JULES: npm—

PARISA: Package manager and command-line program.

JULES: `run`—

PARISA: Execute a named project script.

JULES: `dev`—

PARISA: A conventional script name whose actual meaning is defined in `package.json`.

JULES: You already know this.

PARISA: I know the nouns. I want to see the machinery move.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*, the show where “it starts the app” is the beginning of an answer, not the end.

JULES: I'm Jules.

PARISA: And I'm Parisa. We know Node can run JavaScript outside the browser. We know npm installs packages. We know `package.json` defines scripts.

JULES: Today we trace one command through those layers.

PARISA: Our example uses Vite.

JULES: Other tools make different choices, but the layers are broadly useful.

PARISA: No pretending every dev server is secretly Vite.

JULES: Correct.

## Step Zero: The Terminal Does Not Know `dev`

PARISA: I type this in my terminal.

[TERMINAL]

```bash
npm run dev
```

JULES: Your shell parses that command and finds the npm executable through your environment's command path.

PARISA: The shell starts npm as a process and gives it the arguments `run` and `dev`.

JULES: Exactly.

PARISA: npm is not a magical terminal keyword.

JULES: It is an installed command-line program.

PARISA: And npm itself runs using Node.

JULES: Yes. This is Node doing tooling work outside the browser, exactly as Episode 1 promised.

PARISA: Factory lights on.

## Step One: npm Finds the Project

JULES: npm looks for the relevant `package.json` in the project context.

PARISA: Which is why running the command from the wrong directory produces confusion.

JULES: A classic.

PARISA: It reads the `scripts` object.

[CODE CARD]

```json
{
  "scripts": {
    "dev": "vite"
  }
}
```

JULES: It looks for a key named `dev`.

PARISA: If no such script exists?

JULES: npm reports that the script is missing. `dev` is not built into npm.

PARISA: If it says `"dev": "vite --host"`, npm runs that command instead.

JULES: Right. The script is a project-owned alias for a command.

PARISA: Which also means I should read scripts before running an unfamiliar repository.

JULES: Yes. A script can run arbitrary commands with your user's permissions.

[STING]

### Please Don't Do This

PARISA: Do not assume a friendly script name implies a friendly command.

JULES: `npm run totally-normal` is not a security boundary.

## Step Two: npm Finds Local Vite

PARISA: Here is the part that used to feel supernatural. I did not install Vite globally. Why does the command `vite` work inside the script?

JULES: The Vite package exposes a command-line executable. During an npm script, npm temporarily adds the project's local executable directory to the command path.

PARISA: Usually represented through `node_modules/.bin`.

JULES: Yes.

PARISA: npm can therefore find the Vite version installed for this project.

JULES: Instead of whatever version might be global on your machine.

PARISA: Project A can run Vite six while Project B runs Vite seven.

JULES: Without you manually typing paths into `node_modules`.

PARISA: The magic was temporary path configuration.

JULES: The magic is almost always paperwork.

[STING]

### Okay, That's Actually Pretty Cool

PARISA: The command in `package.json` is short, but the project still controls the installed tool version through its dependencies and lockfile.

JULES: That is a major reason npm scripts are useful.

## Step Three: Node Starts Vite

PARISA: Vite is a JavaScript program?

JULES: Its command-line tool runs in Node.

PARISA: Node loads Vite's entry point and executes it.

JULES: Vite reads its command-line options, project configuration, and environment. Then it starts its development workflow.

PARISA: Which can include a local HTTP server.

JULES: Yes.

PARISA: Let's separate two servers people blur together.

JULES: Good idea.

PARISA: A production Node backend might handle application requests, authentication, databases, and business logic.

JULES: A Vite development server primarily serves and transforms frontend development files for your local browser.

PARISA: Same broad networking capability. Different job.

JULES: Exactly.

PARISA: And the fact that a project uses Vite's Node-based dev server does not mean its deployed frontend requires a Node server.

JULES: It may build into static files that any suitable web host can serve.

PARISA: Node runs the factory. The browser drives the car.

JULES: The metaphor survived.

## Step Four: Vite Serves an Entry Page

PARISA: I open the local URL, perhaps `http://localhost:5173`.

JULES: The browser sends an HTTP request to the dev server listening on your machine.

PARISA: `localhost` means this computer.

JULES: Right. The port distinguishes which local network service should receive the request.

PARISA: Vite responds with the development page, commonly starting from `index.html`.

JULES: Vite treats HTML as part of the module graph and processes references it understands.

PARISA: The HTML might contain a module script.

[CODE CARD]

```html
<script type="module" src="/src/main.js"></script>
```

PARISA: `type="module"` is browser HTML configuration.

JULES: And `import` inside `main.js` is JavaScript module syntax.

[STING]

### Wait, That's Just JavaScript

PARISA: `import` and `export` are modern JavaScript, not Vite syntax.

JULES: Correct. Vite understands and serves that module graph, but it did not invent JavaScript modules.

## Modules Before Bundlers

PARISA: Why did we need bundlers if browsers support modules?

JULES: History first. For a long time, browsers did not have a standard module system developers could use directly.

PARISA: So projects invented patterns, concatenated files, or used module formats and loaders.

JULES: Then bundlers such as Browserify and Webpack could start from an entry file, follow imports, transform code, and produce browser-ready bundles.

PARISA: They solved real problems.

JULES: Absolutely. They also accumulated configuration because frontend applications needed more transformations and asset handling.

PARISA: JavaScript, JSX, TypeScript, Sass, images, development servers, hot updates—

JULES: The factory became an industrial park.

PARISA: Native browser modules changed the possibilities.

JULES: Modern development tools can let the browser request modules individually during development, while the server transforms them as needed.

PARISA: Which avoids rebuilding one giant bundle before every small change.

JULES: That's a major part of Vite's development-speed story.

## What Vite Transforms

PARISA: Suppose my entry file imports this.

[CODE CARD]

```js
import React from "react";
import "./styles.css";
```

PARISA: The relative CSS path is not standard JavaScript behavior in a browser.

JULES: Correct. A browser's JavaScript module loader does not natively interpret “import this CSS file” as JavaScript module semantics.

PARISA: Vite provides tooling behavior that understands it.

JULES: Yes. It processes the request and coordinates how the CSS reaches the page during development.

PARISA: What about `react`? That is not a relative URL.

JULES: It is a bare module specifier. In application source, tooling resolves it to the installed dependency.

PARISA: Node has package-resolution rules too, but the browser cannot simply rummage through `node_modules` from a bare name.

JULES: Right. Vite resolves and optimizes dependencies for browser development.

PARISA: So this line contains JavaScript module syntax, while the useful resolution behavior depends on the environment and tooling.

JULES: Exactly. Syntax and resolution are different layers.

PARISA: That distinction is doing a lot of work.

## Watch It in the Network Panel

PARISA: Can I actually see this process, or must I trust the factory metaphor?

JULES: Open the browser developer tools and look at the Network panel.

PARISA: Reload the page and I can see the HTML request, module requests, styles, images, source maps, and the Vite development client.

JULES: Yes. Click a JavaScript request and inspect the response. During development, what arrives may look close to your source but include transformed imports or development helpers.

PARISA: If `main.js` imports `app.js`, the browser requests another module.

JULES: And Vite serves it on demand. The module graph grows from actual imports.

PARISA: This is different from an older development pipeline that rebuilt one large bundle before the browser could receive the change.

JULES: Right. Vite can transform requested source modules as needed and cache work.

PARISA: Dependencies may be pre-bundled or optimized separately because packages are not always authored in the shape most efficient for native-module development.

JULES: Correct. That step can reduce large numbers of requests and handle module-format compatibility.

PARISA: So “Vite doesn't bundle in development” needs a footnote.

JULES: A large one. Your application source is served through native ESM-style requests, while dependency optimization may bundle dependencies. Simplified slogans are not architecture diagrams.

PARISA: Thank you. I could feel a future interviewer preparing a trap.

## CSS, Images, and Other Non-JavaScript Things

PARISA: Our factory claims to build a website, so it cannot only understand JavaScript.

JULES: Vite also handles CSS and static assets through defined conventions and plugins.

PARISA: If JavaScript imports CSS, Vite can make that stylesheet affect the development page.

JULES: In production, the build may extract and optimize CSS assets.

PARISA: If I import an image URL from JavaScript?

JULES: Vite can treat the image as an asset, return a resolved URL to your module, and include or copy the file appropriately during build.

PARISA: Small assets may sometimes be inlined depending on configuration.

JULES: Yes. File names may include content hashes in production so browsers can cache assets safely while changed content receives a new URL.

PARISA: Cache busting without naming the file `logo-final-final-actually-final.png`.

JULES: A triumph of civilization.

PARISA: What about files in a public directory?

JULES: Vite supports serving designated public assets at stable root paths and copying them as-is during build.

PARISA: So imported assets participate in the module graph; public assets are more like “serve this file unchanged at this path.”

JULES: Good distinction. Use the approach that matches whether the asset should be processed and referenced by the graph.

## Configuration and Plugins

PARISA: Where does Vite learn project-specific behavior?

JULES: It has defaults, command-line options, a configuration file when needed, and plugins.

PARISA: A Vite config is usually JavaScript or TypeScript executed as tooling configuration.

JULES: Yes. It can set aliases, server options, build behavior, plugin configuration, and more.

PARISA: This config runs in the tooling environment, not as ordinary browser code.

JULES: Correct. That boundary matters for available APIs and secrets.

PARISA: A plugin hooks into Vite's development or build pipeline.

JULES: It can support framework behavior, transform file types, adjust resolution, or participate in builds.

PARISA: React projects commonly add an official React plugin.

JULES: Which provides React-specific transformation and development integration, including fast refresh behavior.

PARISA: Plugins are executable dependencies too.

JULES: Yes. They run with tooling privileges during development or build. Choose and update them with the same supply-chain care as other dependencies.

PARISA: And more plugins means more capabilities, more configuration, and more places interactions can break.

JULES: Add the ones that solve actual requirements.

## TypeScript Is Checked Somewhere Else

PARISA: What if `main.js` is `main.ts`?

JULES: Vite can transform TypeScript syntax into JavaScript the browser can execute.

PARISA: Does Vite prove my types are correct?

JULES: Not necessarily. Vite's fast transform path commonly removes TypeScript syntax without performing full type checking.

PARISA: Compile-time type checking is a separate job performed by TypeScript or an integrated checking tool.

JULES: Exactly.

PARISA: So a dev server successfully displaying the page does not prove `tsc` will pass.

JULES: Correct.

PARISA: And neither one proves runtime input is valid.

JULES: Series 1 continuity survives.

PARISA: Types disappear. Users remain chaotic.

## JSX Is Another Layer

PARISA: What about JSX?

JULES: JSX is syntax commonly used with React. It is not standard JavaScript syntax the browser executes directly.

PARISA: And it is not inherently TypeScript.

JULES: Correct. JavaScript files can contain JSX by convention as `.jsx`; TypeScript plus JSX commonly uses `.tsx`.

PARISA: A tool transforms JSX into JavaScript operations.

JULES: Yes. The exact transform depends on the configured framework plugin and JSX runtime.

PARISA: So when I see angle brackets inside a component file, I should ask which layer owns them.

JULES: React ecosystem syntax transformed by tooling, not HTML pasted directly into JavaScript.

PARISA: Future React series, we are coming for you.

## The File Watcher

PARISA: I save a file. The browser changes almost immediately. What happened?

JULES: The development server watches relevant project files for changes.

PARISA: Node can access filesystem events.

JULES: Right. Vite notices the change, invalidates affected module information, transforms what is needed, and notifies the browser through a development connection.

PARISA: Hot Module Replacement.

JULES: HMR.

PARISA: Is that the same as refreshing the page?

JULES: Not exactly. A full reload replaces the whole page. HMR attempts to update affected modules while the application is running, sometimes preserving state.

PARISA: Whether state survives depends on the framework integration and the kind of change.

JULES: Yes. It is not universal immortality for component state.

PARISA: And the browser receives extra development client code to coordinate this.

JULES: Correct. That machinery is for development, not something you blindly ship as production behavior.

## Source Maps: The Helpful Lie Detector

PARISA: If Vite transforms my source, why do browser errors still point at files I recognize?

JULES: Source maps can connect generated code locations back to original source locations.

PARISA: A map from “line twelve in the transformed module” to “line eight in my TypeScript file.”

JULES: Roughly, yes. Developer tools use that mapping for debugging and stack traces.

PARISA: Source maps do not make the browser execute TypeScript.

JULES: Correct. The browser executes JavaScript. The map helps humans relate that JavaScript to the source that produced it.

PARISA: Development source maps are convenient. Production source maps are a deployment decision.

JULES: They can greatly improve error monitoring and debugging, but publicly served maps may reveal original source details. Teams can keep maps private with an error-reporting service or make a deliberate public choice.

PARISA: Security note: hiding source does not secure client-side secrets or prevent determined analysis.

JULES: Exactly. Minification and missing maps are not access control.

## When the Command Fails

PARISA: Let's make this practical. I run `npm run dev` and get “missing script: dev.”

JULES: Read `package.json`. The project may use a different script name, or you may be in the wrong directory.

PARISA: “Vite is not recognized” or “command not found.”

JULES: The local dependencies may not be installed, the installation may be broken, or the script may refer to a tool the manifest does not declare.

PARISA: Run the project's documented install command using its package manager, not immediately install Vite globally.

JULES: Good. A global install can mask the missing project dependency and introduce the wrong version.

PARISA: Unsupported Node version?

JULES: Check the project's documented version and package engine requirements. Switch with the team's version-management approach, reinstall if necessary, then retry.

PARISA: Port already in use?

JULES: Stop the other process or intentionally choose another port. Do not kill random processes until you know what owns it.

PARISA: Page loads but an import fails.

JULES: Read the browser console and terminal together. Check the import path, filename casing, package installation, aliases, and whether the file type needs a plugin.

PARISA: Casing matters even if my Windows machine is forgiving, because Linux CI or hosting may not be.

JULES: Exactly.

PARISA: Blank page, no terminal error.

JULES: The dev server may be fine while the application throws in the browser. A running server proves the server is running, not that your app is correct.

PARISA: Different layer, different evidence.

JULES: That is the whole series in five words.

## Environment Variables: Please Pause Here

[STING]

### Please Don't Do This

PARISA: A frontend build needs an API URL. I put it in an environment variable.

JULES: Fine, depending on how it is used.

PARISA: I put an API secret in it.

JULES: Not fine if the build exposes it to browser code.

PARISA: This is the trap. “Environment variable” sounds server-side and private.

JULES: But frontend tooling may replace selected variables with literal values during transformation or build.

PARISA: Anything delivered to the browser is inspectable by the user.

JULES: Yes. A naming prefix such as Vite's public client-variable convention is an exposure mechanism, not encryption.

PARISA: Public configuration can go into frontend code. Secrets stay on a trusted server or service boundary.

JULES: Never put private credentials in client-side source, generated bundles, or committed environment files.

PARISA: Build tools transform files. They do not make browser secrets possible.

## Development Is Not Production

PARISA: `npm run dev` starts a development server. What does `npm run build` do?

JULES: Whatever the project's build script says. In a typical Vite app, it creates optimized production assets.

PARISA: It follows the module graph, transforms syntax and assets, bundles output, splits chunks when appropriate, applies production optimizations, and writes a directory such as `dist`.

JULES: Broadly, yes.

PARISA: The exact behavior depends on configuration and plugins.

JULES: Always.

PARISA: Then I deploy the generated assets, not the Vite development server.

JULES: For a static frontend, yes. Frameworks with server rendering or specialized deployment adapters have additional runtime pieces.

PARISA: Again: “uses Vite” does not fully describe the production architecture.

JULES: Correct.

PARISA: And `vite preview`?

JULES: A convenient local way to preview the built output. It is not automatically your production hosting strategy.

PARISA: Development command, build command, preview command, deployment platform. Four related but distinct jobs.

JULES: You are dismantling the blob.

## What the Production Build Optimizes

PARISA: “Optimized” can become marketing soup. What might a production build actually do?

JULES: Resolve the complete production module graph, transform syntax for configured browser targets, bundle modules, split code into chunks, process CSS and assets, and minify output.

PARISA: Tree shaking?

JULES: It can remove exports that analysis determines are unused, when module structure and side-effect information make that safe.

PARISA: Not a psychic garbage collector for every line I dislike.

JULES: Correct. Dynamic behavior and side effects limit what static analysis can remove.

PARISA: Code splitting lets parts of the application load separately instead of shipping one enormous initial file.

JULES: Dynamic imports and build configuration can create split points. The build tool then manages relationships among chunks.

PARISA: Content hashes let long-lived browser caches keep unchanged files.

JULES: And when content changes, the file name changes, so clients request the new asset.

PARISA: Minification shortens and restructures code for delivery size, not secrecy.

JULES: Exactly.

PARISA: Then I should inspect the build output and test the built application, not assume development success guarantees production success.

JULES: Run the project checks, build, preview the actual output, and verify routes, assets, environment configuration, and deployment behavior.

PARISA: Especially client-side routing, which may require the host to return the application entry page for unknown routes.

JULES: Your bundler cannot configure every hosting platform by telepathy.

## What Babel Was Doing

PARISA: We promised Babel would appear somewhere in this series.

JULES: Babel transforms JavaScript syntax from one form to another based on configured targets and plugins.

PARISA: Historically, a big use was writing newer JavaScript syntax while supporting browsers that did not understand it yet.

JULES: Yes. It can also transform JSX and support plugin-driven syntax transformations.

PARISA: Does every Vite project use Babel?

JULES: No. Vite and its plugins may use other fast transformers, and the exact pipeline depends on the project.

PARISA: So “Babel is the thing that makes modern JavaScript work” is an old oversimplification.

JULES: It describes an important historical role, not every current toolchain.

PARISA: Newer tools did not prove the older tool was stupid. The environment changed, and different tradeoffs became available.

JULES: That's the show.

## The Entire Trip, Slowly

PARISA: Let's trace it with no skipped stairs.

JULES: You type `npm run dev` in a shell.

PARISA: The shell starts the npm command.

JULES: npm reads `package.json` and finds the `dev` script.

PARISA: npm configures the script environment so locally installed commands are available.

JULES: The script starts Vite's Node-based command-line program.

PARISA: Vite reads project configuration and starts a local development server.

JULES: Your browser requests the page from that server.

PARISA: The page requests JavaScript modules.

JULES: Vite resolves, transforms, and serves those modules for development.

PARISA: The browser executes the resulting JavaScript.

JULES: Vite watches source files and coordinates updates when they change.

PARISA: Node handles the tooling and local server side. The browser handles the frontend runtime side.

JULES: And the boundary between them is visible if you follow the requests.

PARISA: Nothing here was one giant action called “run the app.”

JULES: It was a chain of smaller actions owned by different layers.

[STING]

### Okay, That's Actually Pretty Cool

PARISA: I no longer see `npm run dev` as an incantation.

JULES: What do you see?

PARISA: A project-defined command launching a local Node tool that prepares modules for a browser.

JULES: That's the factory.

PARISA: With paperwork.

JULES: Always with paperwork.

## When You Do Not Need the Factory

PARISA: Final question. Does every website need this?

JULES: No.

PARISA: Louder.

JULES: No. A straightforward site can use HTML, CSS, and browser JavaScript directly.

PARISA: Native modules work in modern browsers. Many projects do not need framework compilation, package-heavy tooling, HMR, or a sophisticated build.

JULES: Tooling is worthwhile when the problems it solves apply: transformations, dependency handling, optimization, framework support, testing integration, a consistent workflow.

PARISA: It also adds dependency risk, configuration, upgrades, build failures, and another layer to understand.

JULES: The question is not “Is Vite good?”

PARISA: It is “What problem does this project have, and does Vite solve it well enough to earn its place?”

JULES: There it is.

## What Did We Actually Learn?

PARISA: npm runs the script named in `package.json`.

JULES: Yes.

PARISA: npm scripts can find project-local package commands.

JULES: Yes.

PARISA: Vite's development command runs in Node and starts development tooling, including a local server.

JULES: Correct.

PARISA: The browser requests modules and executes browser JavaScript. Tooling resolves or transforms things the browser cannot consume directly in source form.

JULES: Exactly.

PARISA: `import` and `export` are JavaScript. JSX is separate syntax transformed by tooling. TypeScript syntax is removed before runtime, and type checking remains a distinct job.

JULES: Perfect.

PARISA: HMR coordinates targeted development updates. A production build is a different workflow.

JULES: Right.

PARISA: Client-exposed environment variables are not secrets.

JULES: Please put that on a mug.

PARISA: And not every website needs a factory.

JULES: But when you do need one, you now know why Node is in the building.

PARISA: Series complete.

JULES: JavaScript escaped the browser, npm invited everyone over, `node_modules` ate the pantry, and Vite started the machinery.

PARISA: That is upsettingly coherent.

[MUSIC OUT]

PARISA: Next, we find out what else happened to JavaScript while I was busy making websites.

JULES: There will be arrows.

PARISA: Threatening.

[MUSIC ENDS]
