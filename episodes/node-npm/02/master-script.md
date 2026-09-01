# Episode 2: npm — Composer, But Make It JavaScript

Status: Draft

## Cold Open

[MUSIC]

PARISA: I typed `npm install`.

JULES: Brave.

PARISA: The terminal displayed several hundred lines, created a directory large enough to develop weather, and then asked me for money.

JULES: Ah. The complete npm experience.

PARISA: What did I install?

JULES: Your project's dependencies.

PARISA: I asked for one thing.

JULES: That thing asked for other things.

PARISA: Without consulting me?

JULES: It was all written down.

PARISA: Where?

JULES: In package manifests.

PARISA: You have introduced two nouns and somehow made this worse.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*, the show where developers may ask what a command does before letting it furnish an apartment on their hard drive.

JULES: I'm Jules.

PARISA: And I'm Parisa. Last time, we learned that Node lets JavaScript run outside the browser.

JULES: Which means developers can write command-line tools in JavaScript.

PARISA: And today we meet the tool that brings us all the other tools.

JULES: npm.

PARISA: Lowercase?

JULES: Officially, yes.

PARISA: Does it stand for Node Package Manager?

JULES: This is already contentious.

PARISA: It is episode two.

JULES: The practical answer is that npm is the package manager commonly bundled with Node. Its own documentation has historically enjoyed saying npm is not an acronym.

PARISA: Great. A package manager with lore.

## Who Asked for This?

PARISA: Before npm, how did we use somebody else's code?

JULES: How did you do it?

PARISA: Download a ZIP. Copy a library into the project. Add a script tag. Hope `jquery.final.REAL.min.js` was the right file.

JULES: Beautiful.

PARISA: Or use a content delivery network and pray the URL stayed alive.

JULES: Also beautiful.

PARISA: It was not beautiful. But it was legible. I could point at the file and say, “There. That is the code I downloaded.”

JULES: The problem appears when projects use many libraries, those libraries need particular versions, and those libraries depend on more libraries.

PARISA: Dependency management.

JULES: Exactly.

PARISA: I know this problem from PHP. Composer has a package registry, a project file, a lockfile, and a command that installs everything.

JULES: Then you already understand the category. npm is Composer, but make it JavaScript.

PARISA: Finally. A sentence with handles.

JULES: Different ecosystem and details, same broad problem: describe the packages a project needs, resolve compatible versions, download them, and make them available to the project.

PARISA: So npm did not invent using other people's code.

JULES: No.

PARISA: It automated the increasingly horrible spreadsheet in my head.

JULES: That's package management.

[STING]

### Old Person Yells at Cloud

PARISA: In the old system, upgrading meant visiting a website, downloading a file, replacing the old file, and checking whether the application caught fire.

JULES: With npm, upgrading can be a command.

PARISA: Followed by checking whether the application caught fire.

JULES: Some traditions endure.

## What Is a Package?

PARISA: Define package without using the word package.

JULES: A reusable bundle of code and metadata that can be published and installed.

PARISA: Library?

JULES: Sometimes. It could be a library your application imports, like a date utility.

PARISA: Or?

JULES: A command-line tool. A framework. A plugin. Type definitions. A tiny helper that does one oddly specific thing.

PARISA: How tiny?

JULES: The ecosystem has tested the philosophical limits of that question.

PARISA: Excellent.

JULES: The metadata says things like the package's name, version, entry points, and its own dependencies.

PARISA: So a package is not just a JavaScript file.

JULES: Right. It is a unit the package manager knows how to identify and install.

PARISA: And where does npm find it?

JULES: Usually in the public npm registry.

PARISA: npm the command and npm the website are different things?

JULES: Related things. The npm command-line interface is the program on your computer. The registry is the service containing published packages and metadata.

PARISA: Like the grocery app and the warehouse.

JULES: Sure.

PARISA: Except the groceries can execute code.

JULES: Please stop improving the metaphor.

## Install One Thing, Receive a Village

PARISA: I run `npm install vite`.

JULES: npm asks the registry for information about Vite.

PARISA: Then downloads Vite.

JULES: And the packages Vite says it needs.

PARISA: Its dependencies.

JULES: And their dependencies.

PARISA: Dependencies of dependencies.

JULES: Transitive dependencies.

PARISA: Of course they have a name.

JULES: npm builds a dependency graph.

PARISA: Not just a list?

JULES: A graph, because the relationships branch. Your app depends on A and B. A depends on C. B might also depend on C, or on a different version of C.

PARISA: So the package manager has to figure out which versions can coexist and where to put them.

JULES: Yes.

PARISA: That explains why one package becomes two hundred packages.

JULES: It explains it. It does not necessarily make it emotionally acceptable.

PARISA: Thank you.

## Local and Global: Two Different Kinds of Trouble

PARISA: Tutorials say `npm install something` and sometimes `npm install --global something`. Why?

JULES: A local install belongs to the current project. It is recorded for that project and installed where that project can use it.

PARISA: Good. Project A can use version one while Project B uses version two.

JULES: Exactly.

PARISA: Global?

JULES: Installs a command for your user or system environment so you can run it from many places.

PARISA: Convenient.

JULES: Sometimes. But global installs can create version drift. Your machine has one version while the project expects another.

PARISA: Which is why modern instructions often prefer local tools and `npx` or npm scripts.

JULES: Right. The project carries the version decision instead of trusting whatever happens to live globally on your laptop.

PARISA: Reproducibility.

JULES: That's the goal.

PARISA: We will return to `npx` later?

JULES: Yes. Today it is enough to know it can run package-provided commands without making you maintain a permanent global installation.

PARISA: A deliberately incomplete answer.

JULES: Labeled as such.

## `npm install` With No Package Name

PARISA: Here is the command I use most often. I clone a repository and run plain `npm install`.

JULES: In that case, npm reads the project's package metadata.

PARISA: `package.json`.

JULES: Yes.

PARISA: We are not unpacking that entire file yet.

JULES: Next episode.

PARISA: But it contains the direct dependencies the project says it needs.

JULES: And npm uses that information, plus the lockfile when present, to reconstruct the installed dependency tree.

PARISA: “Reconstruct” is important.

JULES: Very. The installed directory is generated material. The project records a recipe; npm produces the local installation.

PARISA: So teammates do not usually email each other `node_modules`.

JULES: Please don't.

PARISA: Put it in Git?

JULES: Usually, absolutely not.

PARISA: Why “usually”?

JULES: Because software has edge cases and historians, but ordinary application projects ignore `node_modules` and recreate it with the package manager.

## How Did `package.json` Get Here?

PARISA: We keep treating `package.json` like it arrived with the land.

JULES: In a new project, you can create one with `npm init`.

PARISA: That asks questions about the package and writes the file.

JULES: Or `npm init --yes` accepts defaults.

PARISA: Convenient, but I should still read what it created.

JULES: Always. Framework scaffolding tools may create the file too.

PARISA: Such as `npm create vite`.

JULES: That runs a package-provided project creator. It can ask what kind of project you want and generate starter files.

PARISA: So a cheerful “create my app” command is also executing downloaded code.

JULES: Yes. Scaffolding is code execution plus file creation. Read the official instructions and verify the package name.

PARISA: Typosquatting must love commands copied from memory.

JULES: Attackers can publish names designed to resemble popular packages. One wrong character can select somebody else's code.

PARISA: Copy commands from official documentation. Do not improvise package spelling with confidence.

JULES: Good life advice.

PARISA: And if I'm joining an existing repository, I do not run `npm init`.

JULES: Correct. The project already has a manifest.

## What Changes When I Install a Package?

PARISA: Let's watch one install carefully.

[TERMINAL]

```bash
npm install date-fns
```

JULES: npm resolves an acceptable version, downloads the package and anything new its graph requires, and updates the local installation.

PARISA: It records the package under dependencies in `package.json`.

JULES: And updates `package-lock.json` with the exact resolution.

PARISA: Three related changes: declared intent, resolved graph, installed files.

JULES: That model will matter next episode.

PARISA: If I uninstall it?

JULES: npm removes the direct declaration and updates the lockfile and installed tree. Packages needed only by that dependency can disappear too.

PARISA: So deleting a line manually from `package.json` is not the complete uninstall workflow.

JULES: npm can reconcile things later, but its uninstall command keeps the related state synchronized now.

PARISA: And `--no-save`?

JULES: It can install without recording the dependency in the project records.

PARISA: Useful for an experiment, dangerous if source code quietly starts relying on it.

JULES: If the project needs a package, the manifest should tell the truth.

## `npx`: Borrow the Tool, Run the Tool

PARISA: We deferred `npx`. Payment is due.

JULES: `npx` runs commands from npm packages.

PARISA: If the package is installed locally, it can run that local executable.

JULES: Yes. If it is not local, npm tooling can fetch a package for execution, with a prompt in interactive situations.

PARISA: Convenient and worthy of the same package-name caution.

JULES: Very much so.

PARISA: Why use it?

JULES: For an occasional command, an initializer, or a tool you do not want permanently installed globally.

PARISA: But if my project depends on a specific tool every day, record it as a dev dependency and expose it through a script.

JULES: That's often clearer and more reproducible.

PARISA: So `npx` is package-command execution. Installation may be part of making execution possible.

JULES: Exactly.

## Dependencies and Dev Dependencies

PARISA: npm asks whether something is a dependency or a development dependency.

JULES: A regular dependency is needed by the application when it runs in its deployed environment.

PARISA: And a dev dependency is needed while developing, testing, or building it.

JULES: That's the intended distinction.

PARISA: React might be a dependency. A test runner might be a dev dependency.

JULES: Often, yes.

PARISA: Vite?

JULES: Usually a dev dependency for a frontend app because it builds and serves the project during development.

PARISA: But real projects blur this depending on how they build and deploy.

JULES: Correct. The label describes the package's role in that project, not a universal moral category.

PARISA: And the commands?

JULES: `npm install package-name` records a regular dependency. `npm install --save-dev package-name` records a dev dependency.

PARISA: Or the shorter `-D` flag.

JULES: Yes.

PARISA: That is tooling syntax, not JavaScript.

[STING]

### Wait, That's Just JavaScript

JULES: More accurately: it isn't JavaScript at all. It is a command-line option understood by npm.

PARISA: Excellent. The segment has escaped containment.

## Updating Is a Decision

PARISA: npm tells me packages are outdated.

JULES: `npm outdated` can compare installed, wanted, and latest versions.

PARISA: “Wanted” means the newest version satisfying my declared range.

JULES: Right. “Latest” may be outside that range.

PARISA: And `npm update`?

JULES: It updates within the constraints of the manifest and npm's rules, then updates the installed tree and lockfile.

PARISA: It does not mean “rewrite everything to whatever newest version exists and hope.”

JULES: Correct.

PARISA: A major upgrade may require changing the range, reading migration notes, changing code, and testing.

JULES: Package managers resolve versions. They cannot verify every behavioral assumption your application makes.

PARISA: How often should I update?

JULES: Regularly enough that changes stay understandable, with tests and review. Small dependency changes are often easier to diagnose than one annual avalanche.

PARISA: Automated update pull requests can help surface changes.

JULES: But automation does not replace review. Run the checks and understand production impact.

PARISA: Boring maintenance is a security feature.

## Choosing a Package

PARISA: The registry has approximately everything. How do I choose?

JULES: Start by asking whether you need a dependency at all.

PARISA: The web platform may already solve the problem.

JULES: Or the needed code may be small enough to own. But do not rewrite cryptography, sanitization, or authentication because dependencies feel uncool.

PARISA: “Use fewer dependencies” is not “become your own standards body.”

JULES: Exactly.

PARISA: If I need one?

JULES: Check whether it solves the requirement. Look at documentation, maintenance, recent releases, issues, license, runtime support, package size when relevant, and who controls publication.

PARISA: Download count?

JULES: A signal, not proof of quality or safety.

PARISA: Number of dependencies?

JULES: Also context. Zero dependencies does not prove correct code. Many dependencies may be justified or excessive.

PARISA: Read the shape of the choice, not one badge.

JULES: And verify the exact name and scope before installing.

## The Lockfile Is Not Decorative

PARISA: We have mentioned a lockfile twice. What is it locking?

JULES: The resolved dependency tree.

PARISA: `package.json` might say my project accepts a range of versions.

JULES: The lockfile records the exact versions npm selected, where they came from, and integrity information.

PARISA: So when my teammate installs, npm has a much more precise map.

JULES: Yes. That helps teams and automated builds reproduce the same dependency tree.

PARISA: Do we commit `package-lock.json`?

JULES: For an npm-managed application, generally yes.

PARISA: Even though it is huge and unpleasant?

JULES: Especially because it contains decisions you do not want every machine making independently.

PARISA: Do I hand-edit it?

JULES: Normally no. Let npm manage it.

PARISA: So: commit the lockfile, don't lovingly artisanal-edit the lockfile.

JULES: Good rule.

## Please Don't Do This: Packages Are Code

[STING]

PARISA: Time for the ominous music.

[OMINOUS MUSIC]

JULES: Installing a package means trusting code from outside your project.

PARISA: And packages can run installation scripts.

JULES: Some can, yes. Depending on the package and command, lifecycle scripts may execute during installation.

PARISA: With the permissions of the person or build process running npm.

JULES: Right.

PARISA: So `npm install random-cool-thing` is not the digital equivalent of buying a decorative pillow.

JULES: It is closer to hiring a contractor and giving them access to the room.

PARISA: Check the package name. Check who maintains it. Check whether the project is active. Check what permissions and scripts the workflow involves.

JULES: Review dependency changes. Use lockfiles. Keep dependencies updated deliberately. Treat security audit output as information to investigate, not a magic score or an instruction to break the project blindly.

PARISA: `npm audit fix --force` sounds so confident.

JULES: The word “force” is the command gently removing its safety goggles.

PARISA: It may install breaking major versions.

JULES: Exactly. Read before you run.

PARISA: Also: npm's public registry is enormous. Most packages are ordinary useful open-source work. The risk is not “open source bad.”

JULES: Right. The lesson is that dependencies are part of your software supply chain. Know what you are adding.

## Installation Scripts: Why Is It Compiling Something?

PARISA: Sometimes `npm install` downloads JavaScript. Sometimes it starts compiling C plus plus and demands Python. What happened?

JULES: A package may include native code or an installation step that prepares files for your platform.

PARISA: Node can load native addons compiled for the operating system and processor.

JULES: Some packages provide prebuilt binaries. If a compatible one is unavailable, tooling may try to build locally.

PARISA: Which explains the sudden request for a compiler toolchain on a project that allegedly uses JavaScript.

JULES: The ecosystem can contain JavaScript, WebAssembly, native binaries, generated files, and scripts coordinating them.

PARISA: Installation scripts also handle legitimate setup that is not native compilation.

JULES: Correct. Because they execute during a sensitive moment, they are also part of supply-chain risk.

PARISA: Can npm skip them?

JULES: It has configuration such as `--ignore-scripts`, but disabling scripts can leave packages that legitimately require setup unusable.

PARISA: Security switches have tradeoffs. Do not paste one into team configuration without understanding what stops working.

## Who Can Publish an Update?

PARISA: We talk about trusting a package. Technically, what am I trusting?

JULES: Its source and build process, the people or automation allowed to publish it, registry account security, dependencies, and the artifact npm retrieves.

PARISA: More than the visible GitHub repository.

JULES: Potentially. Published contents may be produced by a build and need not match every repository file one-for-one.

PARISA: Package ownership can change too.

JULES: Yes. A once-trusted name can gain a new maintainer or publisher. Popularity history does not freeze future control.

PARISA: Which is why account protection, publishing permissions, provenance, review, and update hygiene all matter.

JULES: No badge eliminates trust. Good controls make compromise harder and changes more traceable.

PARISA: This is not a reason never to use packages.

JULES: It is a reason to treat dependencies as code you chose to include.

## Funding, Warnings, and Terminal Emotional Weather

PARISA: npm finishes and says packages are looking for funding.

JULES: Maintainers can include funding information. `npm fund` shows it. That message is not an error.

PARISA: Then npm reports vulnerabilities.

JULES: Audit data says the graph matches known advisories that need evaluation.

PARISA: A development-only package may have different exposure from one reachable in production requests.

JULES: Context changes risk and priority. But development dependencies are not harmless; build systems and developer machines are valuable targets.

PARISA: Read the advisory, affected versions, dependency path, and available fix.

JULES: Then choose an upgrade, replacement, mitigation, or documented acceptance appropriate to the real risk.

PARISA: Funding is not failure. A warning is not automatically catastrophe. Zero warnings is not proof of safety.

JULES: Package-manager emotional regulation.

## npm Is Not the Only One

PARISA: Yarn. pnpm. Bun. Why are there several package managers?

JULES: Because developers disagree about performance, storage, workflows, compatibility, and what tradeoffs are acceptable.

PARISA: Do they all use the npm registry?

JULES: They commonly can, though they install and lock dependencies differently.

PARISA: Can I casually switch package managers inside a project?

JULES: Not casually. Respect the project's existing lockfile and instructions. Mixing package managers can create conflicting lockfiles and different dependency layouts.

PARISA: So if the repository has `package-lock.json`, use npm unless the project says otherwise.

JULES: Sensible default.

PARISA: If it has `pnpm-lock.yaml`, do not swagger in and generate `package-lock.json` because npm happens to be installed.

JULES: Your teammates will sense a disturbance in the force.

## What Did We Actually Learn?

PARISA: npm is a package manager and command-line tool commonly installed with Node.

JULES: Yes.

PARISA: The registry is the service where npm normally finds published package metadata and files.

JULES: Yes.

PARISA: A package is reusable code plus metadata that lets a package manager identify and install it.

JULES: Yep.

PARISA: A dependency is a package our project needs. A transitive dependency is needed by one of our dependencies.

JULES: Exactly.

PARISA: Plain `npm install` reads the project's declared requirements and lockfile, resolves the tree, and creates the local installation.

JULES: Right.

PARISA: The lockfile records exact resolution decisions and belongs in Git for ordinary npm applications.

JULES: Correct.

PARISA: Packages are executable supply-chain inputs, not collectible Pokémon.

JULES: You do not need to install them all.

PARISA: Then next time we open the two objects npm left at the crime scene.

JULES: `package.json` and `node_modules`.

PARISA: One is a small text file. One contains the known universe.

JULES: And between them sits the lockfile, quietly remembering what everyone agreed to.

PARISA: Next episode: dependency hell.

[MUSIC OUT]
