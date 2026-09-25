# Episode 5: Why Can't My Container See Localhost?!

**Series:** Containers & Infrastructure
**Hosts:** Parisa, Jules
**Production:** Finished audio-first script. Recording handled separately.

[INTRO MUSIC]

PARISA: The API starts. The database starts. Separately, both seem pleased with themselves. Together, they are refusing to speak.

JULES: What database hostname did we configure?

PARISA: Localhost.

JULES: Local to whom?

PARISA: I resent how productive that question is.

JULES: Welcome to Okay, But Why? Our fictional podcast application has entered the networking episode. Also the episode where we find out whether deleting a container deletes our data. A cheerful double feature.

## Localhost Is a Point of View

PARISA: We said localhost means this machine. Now each container has its own networking context in the ordinary setup we're discussing.

JULES: Yes. Inside the API container, localhost points back into the API container's own network context. It doesn't automatically mean the laptop, the database container, or the machine you emotionally consider home.

PARISA: So the API is asking itself for a database. It finds no database, because we deliberately put that database somewhere else.

JULES: Exactly. This is normal isolated container networking. There are configurations that share a network namespace, including containers in the same Kubernetes Pod later, and special host-network modes. Our default mental model is separate contexts unless explicitly shared.

PARISA: We don't fix that by trying random IP addresses until one accepts our password.

JULES: We put the containers on an appropriate shared network and use a name the API can resolve there. In our upcoming Compose example, the database service is called db. The API connects to db on the database's listening port.

PARISA: Names can stay stable while container IP addresses change. Which is good, because replacing a container shouldn't require a treasure hunt through configuration files.

## The Colon Has Two Sides

JULES: Next problem. Our API listens on port three thousand inside its container. Your laptop's browser wants to connect. Publishing a port provides a route from a host port to the container port.

PARISA: So three thousand colon three thousand means host port on the left, container port on the right. Same number, different places.

JULES: Yes. Eight thousand eighty colon three thousand would mean connect to port eight thousand eighty on the host, forward to port three thousand in the container. The numbers need not match.

PARISA: And if I see one-two-seven dot zero dot zero dot one before those numbers?

JULES: That's the IPv4 loopback address for the host binding. For local development, publishing to that address restricts the published port to the host's loopback interface. Omitting an address commonly publishes on all host interfaces, which can expose more than intended.

PARISA: Please Don't Do This: publish the database to the whole neighborhood because a tutorial had a ports section and we were feeling thorough.

JULES: Containers on the same suitable network can talk to each other's container ports without publishing those ports on the host. Publishing is a separate choice for traffic coming through the host.

PARISA: And EXPOSE in a Dockerfile doesn't make that choice for us. We learned that last time.

JULES: There's another direction to check. If the server process inside the container listens only on its own loopback address, forwarded traffic may not reach it. It normally needs to listen on an appropriate container interface, often represented by zero dot zero dot zero dot zero for all IPv4 interfaces there.

PARISA: That's a bind address, not a destination URL for users. And listening on container interfaces is separate from deciding which host interfaces publish the port.

JULES: Exactly. Two boundaries, two settings. You can listen appropriately inside while publishing only to the laptop's loopback outside.

## Where Is the Code Making the Request?

PARISA: Let's add a browser trap now, before it ruins somebody's afternoon. If the frontend JavaScript runs in my browser, can it fetch an API URL using the private name api?

JULES: Not just because the frontend files came from a container. Your browser is outside the Compose network. It needs an address it can reach, such as a published local URL during development or a public application URL in production.

PARISA: The frontend server could proxy a request to api from inside that network. But JavaScript downloaded into the browser runs in the browser's context.

JULES: Exactly. First identify the caller. Browser to published endpoint. Container to container service name. Container to a service actually running on the host requires a host-reachable address; Docker Desktop provides host dot docker dot internal for that use, while other environments may need configuration.

PARISA: Same URL string, different caller, different result. Networking has a strong commitment to perspective.

## Configuration Is Not Automatically a Secret

JULES: We usually avoid hard-coding those environment-specific addresses. Environment variables can supply configuration to a process at startup: a database host, listening port, or log level.

PARISA: Variables with names and values. Not a secret vault. A value doesn't become protected because its name is in uppercase.

JULES: Right. Some configuration isn't sensitive. Credentials are. Keep credentials out of source control and images, restrict who can read them, and use the platform's appropriate secret-delivery mechanism.

PARISA: A local ignored environment file can be a development convenience, but it still contains readable values. And injecting a value into a browser bundle makes it available to the browser's users. Calling it an environment variable doesn't make a frontend password private.

JULES: Also avoid dumping the entire environment into logs during debugging. Logs have a way of becoming much more widely accessible than the original secret.

PARISA: We can log “database authentication failed” without helpfully printing the credential that failed.

## We Deleted the Container

JULES: Good news: the API can reach the database. Bad news: I removed and recreated the database container, and now the episode catalog is gone.

PARISA: Where was the database writing its files?

JULES: In this deliberately broken example, only in the container's writable layer. No persistent mount at the data directory.

PARISA: Then we deleted the place the data lived. That's different from merely stopping or restarting the same container.

JULES: Exactly. Its writable layer survives a stop and start of that same container, but removal deletes that layer. That's why we call container-local storage ephemeral in deployment discussions: replacing an instance should be expected.

PARISA: And some database images declare volumes themselves, so actual behavior depends on the image and mounts. Don't infer where the data lives just from the command you remember typing.

JULES: Correct. For predictable persistence, deliberately attach a named volume to the database's documented data directory. A volume is storage managed outside the lifecycle of that particular container. A replacement can use the same data, assuming compatible software and configuration.

PARISA: A bind mount is related but different: we map a particular host path into the container. Handy for local source editing, but it also gives the container access to that path, according to the mount's permissions.

JULES: A named volume lets Docker manage its storage location. On desktop systems that location may be inside the Linux VM, not where you expect on the laptop's ordinary filesystem.

PARISA: We are now three episodes past “somewhere on the computer” and already grateful for specific nouns.

## Persistence Isn't Backup

JULES: If the volume survives replacement, have we solved data safety?

PARISA: No. We have solved one lifecycle problem. The application can still delete records. The disk can fail. An operator can remove the volume. A backup needs a separate recoverable copy and a tested restoration process.

JULES: And a database-consistent backup, not necessarily copying live files at an arbitrary moment. Databases have supported backup procedures for a reason.

PARISA: Also, mounting an existing volume into an incompatible database version is not a migration strategy. State has rules.

JULES: So our repaired arrangement has an API address appropriate to its caller, only necessary published ports, runtime configuration supplied safely, and database data stored on a deliberate persistent volume.

PARISA: When it fails, ask in order: where is the caller, what name is it resolving, what port is it using, is the server listening there, and what boundary must the request cross? Then check configuration and logs without spilling secrets.

JULES: Much better than “Docker hates me.”

PARISA: Docker may still dislike my attitude. But now I have a diagnosis.

JULES: Next time we describe these relationships together with Compose.

PARISA: The app has friends. Unfortunately we have to organize their housing.

[OUTRO MUSIC]
