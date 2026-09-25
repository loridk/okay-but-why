# Episode 4: Images, Containers & Dockerfiles

**Series:** Containers & Infrastructure
**Hosts:** Parisa, Jules
**Production:** Finished audio-first script. Recording handled separately.

[INTRO MUSIC]

JULES: The container is built.

PARISA: Is it? Or is the image built?

JULES: I was hoping to get through the opening before you noticed.

PARISA: Welcome to Okay, But Why? Today we are naming three related things correctly so our debugging conversations stop sounding like we're all pointing at different chairs and saying “that one.”

## Recipe, Prepared Meal, Dinner Happening

JULES: A Dockerfile is a text file describing how to build an image. An image is the packaged filesystem content and configuration used to create containers. A container is an instance created from an image, with its own runtime state.

PARISA: Including a stopped container. We often mean a running container conversationally, but stopped instances still exist until removed.

JULES: Good correction. Here's our food metaphor. Dockerfile: recipe. Image: prepared frozen meal. Running container: that meal being served.

PARISA: Except software can start ten separate containers from one image. I can't serve the same frozen lasagna ten times without a serious customer-service situation.

JULES: Exactly where the metaphor ends. The image isn't consumed. Multiple containers can share the same underlying read-only image content and have separate writable state and processes.

PARISA: And the image itself isn't listening on a port. It's a package sitting somewhere until we create and start an instance.

JULES: The central sequence is Dockerfile, build, image, create and start container. Our companion draws it, but that's the entire relationship in words.

## Read a Small Dockerfile Without Becoming a Manual

PARISA: Our fictional podcast API uses Node. What's in its Dockerfile?

JULES: The companion has a small annotated example. Dockerfile is its own build-instruction format. It isn't JavaScript or YAML. A line beginning FROM selects a base image to build on.

PARISA: Which can already supply Node and the user-space files it needs. We aren't rebuilding the whole software universe from an empty folder.

JULES: Right. WORKDIR establishes the working directory for following instructions. COPY brings selected files from the build context into the image. The context is the set of files the builder is allowed to use for that build.

PARISA: Selected is important. Copying my entire project directory might include local dependencies, credentials, Git history, or files that don't belong in the result.

JULES: The example copies just the manifests and entry file it needs. A dockerignore file can exclude unwanted material from the build context. It's a separate safeguard from gitignore; ignoring something in Git doesn't automatically exclude it from a Docker build.

PARISA: Then RUN executes something during the build, like installing dependencies.

JULES: Yes. We use npm ci because the fictional project has a lockfile. We only need production dependencies for this deliberately simple example. A real application needing compilation would need appropriate build steps too.

PARISA: And CMD?

JULES: Supplies the default command for a container created from the image. RUN installs dependencies while building. CMD describes what normally starts when the container runs. Those happen at different times.

PARISA: So RUN node server dot js would try to run the server during image construction. Probably not the life choice we intended.

JULES: Exactly. The brackets in our CMD example are the Dockerfile's JSON-array form: executable followed by arguments. They don't turn the file into a JavaScript program.

## Layers Explain the Order

PARISA: People talk about layers. Are those little running containers stacked inside the image?

JULES: No. Think of stored filesystem changes assembled into the image's filesystem view. Instructions that change files contribute filesystem layers; some instructions set metadata instead. Not every Dockerfile line means a new slab of files.

PARISA: And a build cache can reuse previous results when the inputs to those steps haven't changed.

JULES: That's why the example copies dependency manifests and installs dependencies before copying the frequently edited server file. A change to the server file needn't force the dependency installation step to run again.

PARISA: A changed lockfile should invalidate the relevant cached result. We don't want “fast” to mean “quietly ignored your dependency change.”

JULES: Right. Cache behavior follows inputs and instructions. It also means deleting a secret in a later layer isn't a safe way to remove it from earlier image history. Don't copy secrets in and then hope a cleanup instruction erases the evidence.

PARISA: Keep the ingredient out of the meal. We are stretching the lasagna now.

## Build, Pull, Run

JULES: Build creates an image from build instructions and inputs. Pull downloads an image from a registry. Run creates and starts a container from an image, obtaining the image if needed under the tool's pull policy.

PARISA: A registry stores and distributes images. Docker Hub is one example, but companies can use other public or private registries.

JULES: And push uploads an image to a registry you have permission to use. That's how a build system can produce an image once, then another machine can fetch it.

PARISA: Image registry and source repository are not the same storage job. Git holds our source history. The registry holds the packaged artifact that came out of a build.

JULES: Artifact meaning an output we can keep and use, such as this image. We can label it with a tag to make it easier to refer to.

PARISA: Here's my suspicion: a tag called latest does not prove it's the latest, or safe, or the thing we tested.

JULES: Correct on all three. Tags are names that can be reassigned unless the registry enforces immutability. A digest identifies particular image content. Recording the tested digest makes deployment identity more precise.

PARISA: So a version-shaped tag is convenient, but its spelling alone doesn't make it immutable. And pinning a digest still needs an update process; otherwise we preserve old vulnerabilities with admirable precision.

## Two Instances, One Starting Point

JULES: Let's start two API containers from the same image. Both begin with the same packaged code and dependencies. Each can receive different runtime configuration and has separate process state.

PARISA: If one writes a temporary file into its writable layer, the other doesn't automatically get that file. Sharing an image is not sharing a live hard drive.

JULES: Exactly. And editing a running container doesn't change the original image. Recreate it from the image and those ad hoc changes aren't part of the package.

PARISA: Which makes logging into production to “just fix one file” a trap again. The next replacement undoes your undocumented fix.

JULES: Better to change the source, build and test a new image, and deploy that known artifact. We'll follow the whole pipeline in episode seven.

PARISA: Our example also uses a less privileged application user. That's a sensible default, not proof the image is secure. What about EXPOSE?

JULES: It documents the intended port. It does not publish that port to your laptop or open a firewall. That's runtime networking configuration, which is next episode's complaint department.

## What We Actually Have

PARISA: We now have a recipe in source control, a built image, a place to distribute it, and the ability to start instances. We do not yet have a deployed production service just because a build succeeded.

JULES: Nor a backup of a running database. The image packages its starting environment; live data is a separate concern.

PARISA: And the Dockerfile in the companion is illustrative. Our podcast application remains fictional. Nobody needs to create server dot js to follow this conversation.

JULES: If you take one distinction away: Dockerfile describes construction; image is the result; container is an instance using that result.

PARISA: I take away a second distinction. Lasagna is mutable infrastructure and should be consumed immediately.

JULES: Next time: why can't my container see localhost?

PARISA: Because we finally gave “my machine” multiple meanings. We deserved this.

[OUTRO MUSIC]
