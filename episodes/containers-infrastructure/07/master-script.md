# Episode 7: From Git Push to Production

**Series:** Containers & Infrastructure
**Hosts:** Parisa, Jules
**Production:** Finished audio-first script. Recording handled separately.

[INTRO MUSIC]

JULES: I pushed the code.

PARISA: Is the podcast application deployed?

JULES: No, but the code has traveled.

PARISA: A lovely holiday for the code. Our listeners remain unimpressed.

JULES: Welcome to Okay, But Why? We have an image and a description of our related services. Today we follow a change all the way to a running production application.

## Git Is the Beginning of This Journey

PARISA: Git records changes. Pushing sends commits to a remote repository. Nothing about Git itself says “start this application on that server.”

JULES: Exactly. A hosting platform may connect a push to deployment, but that's an integration somebody configured. Let's say we change our fictional API so episode results sort correctly.

PARISA: We review the change, test it, and merge it. We want the same steps every time, not “Jules remembers the command and happens to be awake.”

JULES: That problem leads us to CI: continuous integration. Developers integrate changes regularly, with automated checks helping detect problems when changes come together.

PARISA: Not merely owning an account on a CI website. If everyone avoids integration for six weeks, a green badge isn't going to resolve the social situation.

JULES: The automation runs a pipeline: defined steps such as fetching source, installing dependencies, testing, and building an artifact. GitHub Actions is one concrete system that can run those steps after repository events.

PARISA: Its workflow file is YAML configuration. Jobs run on runner machines. Those machines don't know our project through friendship; the workflow has to prepare the environment and execute the relevant commands.

JULES: And a runner is not automatically our production server. It may be temporary infrastructure that exists just long enough to run the job.

## Build Something We Can Identify

PARISA: Our tests verify the sorting behavior. Then we build the API image from the reviewed source and its dependencies.

JULES: We can also test the built image so we're checking the packaged result, not only the code outside its deployment environment. Different checks catch different failures.

PARISA: A successful unit test doesn't prove the server starts. A successful startup doesn't prove the sort order. Automated accessibility checks for the frontend are useful too, but don't replace keyboard and assistive-technology review where needed.

JULES: Exactly. The pipeline gives repeatable evidence, not omniscience. If required checks fail, we stop the release path and investigate rather than faithfully deploying the failure faster.

PARISA: The successful build becomes an artifact: an image we can identify, store, and promote. We push it to a registry.

JULES: Then deployment tells the production environment to fetch and run that known image, with production settings. Ideally we promote the tested artifact instead of rebuilding an allegedly equivalent one separately for each environment.

PARISA: Same digest, known package. Still different database address and credentials in staging versus production.

JULES: Right. Runtime configuration can vary without changing the image. Some frontend settings are embedded at build time, so “build once” requires deliberate handling there; a static bundle doesn't automatically read the server's environment after it has reached a browser.

## What Does CD Mean Today?

PARISA: CI slash CD is one of those abbreviations people say like it's a single appliance. What's CD?

JULES: It can mean continuous delivery or continuous deployment. Delivery keeps changes in a releasable state through an automated process, often with an explicit production approval. Deployment automatically releases qualifying changes to production.

PARISA: So if someone says “we do CD,” ask where the release decision happens. Neither expansion means every branch gets immediate access to the production database.

JULES: Exactly. Review, environment protections, and restricted credentials are part of the design. The pipeline's ability to deploy is a powerful permission.

PARISA: Especially if an outside contributor can change code that a workflow executes. Untrusted pull-request code shouldn't casually inherit production secrets.

JULES: Use narrowly scoped identities, protect deployment paths, and prefer short-lived authentication where the platform supports it. Keep secret values out of images, source, logs, and downloadable artifacts.

PARISA: “It's encrypted in the settings screen” is not the end of the threat model. The process receiving it can still misuse or print it.

## Deployment Has a Destination

JULES: Now we actually deploy. The destination could be a VM, a managed application platform, a container service, or something more elaborate. No Kubernetes requirement has appeared.

PARISA: The destination needs a compatible runtime environment, permission to pull the image, production configuration, network access to dependencies, and storage arrangements. Somebody also handles the domain and encrypted web connections.

JULES: Correct. The pipeline might start a replacement instance, check it, and switch traffic. Or it might perform a simpler stop-and-start deployment with a short outage if that's acceptable. The strategy follows the requirements.

PARISA: And “process started” is insufficient. Can it accept requests? Can a listener load the episode list? Are error rates rising?

JULES: Health checks supply signals to the platform. Readiness asks whether an instance should receive traffic. A basic process check may be much narrower than an end-to-end request through the system.

PARISA: We should know what each check proves. If the homepage is static but every API request fails, the homepage returning success is cold comfort.

## After the Green Checkmark

JULES: Logging tells us what the application reports happening. Metrics summarize behavior over time: request rates, errors, latency, resource usage. Alerts should point us toward failures somebody can act on.

PARISA: Preserve logs somewhere useful when instances are replaced. Otherwise the container crashes, vanishes, and takes its last words with it.

JULES: While keeping personal information and secrets out of those logs. Observability isn't permission to record everything a user ever did.

PARISA: Let's give the release a concrete failure. The new sorting code works in tests but is painfully slow with production-sized data. Requests pile up.

JULES: We compare the timing with the release, inspect evidence, and may roll back to the previous known image while investigating. Rollback is a prepared recovery action, not frantic editing on the server.

PARISA: But if the release also changed the database schema, the older code might not understand the new schema. Reverting the image doesn't reverse the database automatically.

JULES: Exactly. Database migrations and data changes need compatibility and recovery planning. Some changes should be rolled forward with a fix rather than reversed. Backups matter, but restoring a backup can lose newer writes and isn't a casual undo button.

PARISA: Which is why we practice recovery while the imaginary podcast isn't on fire.

## Repeatable Doesn't Mean Thoughtless

JULES: Compare this with manually uploading changed files. The goal isn't to sneer at older workflows. It's to reduce unrecorded steps and make the released state identifiable.

PARISA: A carefully managed traditional deployment can be disciplined. A pipeline can automate absolute nonsense. YAML doesn't confer judgment.

JULES: But a good pipeline records which source produced which image, what checks ran, where it went, and whether the deployment succeeded. That makes collaboration and recovery easier.

PARISA: Our route is now code, Git, CI checks and build, image, registry, deployment, running application. The links are configured actions; arrows don't do work by themselves.

JULES: And deployment isn't the finish line for operating the service. Somebody maintains dependencies, monitors behavior, protects data, and responds when reality changes.

PARISA: The app is finally somewhere people can use it. Next time we pretend it becomes absurdly popular and our modest setup grows into a small logistical crisis.

JULES: Kubernetes: who asked for this?

PARISA: Finally, we will have an answer other than “a job description.”

[OUTRO MUSIC]
