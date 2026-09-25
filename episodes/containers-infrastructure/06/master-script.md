# Episode 6: Docker Compose: My App Has Friends

**Series:** Containers & Infrastructure
**Hosts:** Parisa, Jules
**Production:** Finished audio-first script. Recording handled separately.

[INTRO MUSIC]

PARISA: My setup instructions are now “start this, then that, remember the network, attach the volume, set these values, don't use the old port, and ask Jules what we named the database.”

JULES: I named it db.

PARISA: Your most restrained architectural decision.

JULES: Welcome to Okay, But Why? Our fictional podcast application now has a frontend, an API, and a database. Today: Docker Compose, because a bag of individually reasonable containers can still be a pain in the ass to coordinate.

## One Application, Several Processes

PARISA: Why separate the services at all? People have successfully put several processes on one machine for quite a while.

JULES: They have, and this isn't a moral rule about one process per container. We're separating components with different jobs and lifecycles. The web-facing component serves the frontend, the API handles requests, and the database manages durable records.

PARISA: Different images, different configuration, different update schedules. I might change the API code without changing the database software.

JULES: Exactly. Docker Compose describes and manages a multi-container application environment. You describe services and their relationships in configuration, then use Compose to create and start the arrangement.

PARISA: A service here means a named application component in the Compose model. Later Kubernetes uses the word Service for a more specific networking object. Same English word, different API vocabulary.

JULES: Thank you for putting that signpost down before the terminology collision.

## The File Is YAML

PARISA: The file has colons and indentation. It's YAML configuration. Not JavaScript, and not a Dockerfile with a different haircut.

JULES: Right. YAML is a data notation. Compose gives meaning to keys such as services, image, ports, networks, and volumes. Indentation expresses nesting, and a dash often introduces an item in a list. Use spaces consistently; indentation is structure here.

PARISA: So YAML itself doesn't know what a container is. Compose reads the data according to the Compose specification.

JULES: Exactly. Our companion has a deliberately incomplete illustration with three services. The fictional frontend and API images are named as examples; we're not creating an application repository or asking anyone to run them.

PARISA: Under the frontend service, ports publishes its web port to a loopback port on the laptop. Under the API, environment supplies the database hostname. Under the database, volumes attaches the data storage.

JULES: A top-level volumes entry declares the named volume. A top-level networks entry describes networks we want to use. Compose also supplies a default network if you don't explicitly define another arrangement.

PARISA: Our small example uses two networks to make the relationships visible. Frontend and API share one; API and database share the other. The database isn't directly connected to the frontend network.

JULES: That's a network boundary, not a replacement for authentication or authorization. The API still needs an appropriately restricted database identity.

## Trace One Request

PARISA: Let's make the arrows earn their keep. I open the podcast page in my laptop browser. It connects to the frontend's published host port.

JULES: The frontend server returns the page. For this illustration, it is also configured to proxy requests under an API path to the API service on their shared network.

PARISA: Configured in the server, not magically by writing an environment variable that no software reads.

JULES: Yes. Compose supplies infrastructure configuration. It doesn't implement the application or proxy. The companion explicitly marks those pieces as assumptions.

PARISA: So the browser can use a same-origin API path. The frontend server resolves api on its network. The API resolves db on the backend network. The database port is not published to the laptop.

JULES: Exactly. And if we chose a frontend that calls a separately published API directly from the browser, we'd need a browser-reachable URL and suitable cross-origin behavior. Compose's private DNS names still wouldn't be browser addresses.

PARISA: One application diagram, several networking perspectives. That's the part I want people to retain, not the punctuation in the file.

## Starting Is Not Being Ready

JULES: Then we use the shell command docker compose up to bring the project up. In detached mode it runs in the background. Other commands show status and logs.

PARISA: The command is something we type into a terminal. The YAML is what it reads. Small distinction, saves a lot of “where do I paste this?”

JULES: Now suppose the API starts before the database can accept connections. We can describe dependencies and health checks. But basic startup ordering doesn't guarantee readiness.

PARISA: A database process can exist while it initializes files or recovers. “Started” doesn't mean “ready for this request.”

JULES: Compose can wait for a dependency marked healthy when configured with the appropriate dependency condition. That helps initial startup. Applications still need sensible retry and reconnection behavior because dependencies can fail later too.

PARISA: So we don't solve distributed failure by sleeping for five seconds and believing in ourselves.

JULES: Correct. Nor should we interpret a green health check as proof every feature works. It proves the particular check succeeded.

PARISA: And stopping the project shouldn't casually delete our named data volume. Some cleanup options explicitly remove volumes. Read those before turning a tidying command into a data-loss event.

## Wait. I've Been Using This Shit Already?

PARISA: This is the point where I look at DDEV and Lando and get suspicious. They give me a local web environment, database, versions, project commands, friendly URLs. Have I been using this shit already?

JULES: In that family of workflows, yes. DDEV uses Docker and Docker Compose to manage development environments, adding conventions and integrations. Lando is also built around container-based local development and provides recipes, services, tooling, and networking conveniences over that machinery.

PARISA: So choosing a PHP version or starting a Drupal project with a friendly command wasn't avoiding infrastructure. It was using somebody else's carefully arranged infrastructure interface.

JULES: Exactly. Those tools add real value: project defaults, routing, certificates, command wrappers, and integrations. They aren't merely Compose with the name filed off, and their configuration files aren't interchangeable with a raw Compose file.

PARISA: But now when a local database isn't reachable, I have somewhere to start. Which service? Which network? Which port? Is it ready? Where's its data?

JULES: And when you execute a project command through the development tool, it can run that command in the environment with the project's selected runtime rather than whatever happens to be installed globally.

PARISA: That's useful as hell. The friendly button was doing work; now I can understand more of the work.

## A Definition, Not a Whole Operations Department

JULES: Does Compose make the environment reproducible?

PARISA: More reproducible. The configuration is reviewable and repeatable, but the image versions, secret delivery, mounted files, and external services still matter. A file referring to mutable images isn't a time machine.

JULES: And a colleague needs the required tools, compatible images, and development configuration. We commit the shareable definition and examples of required settings, not private credentials or production database contents.

PARISA: Would we use Compose in production?

JULES: It can be appropriate for some deployments, especially on a single host with an understood operations plan. It isn't automatically a multi-machine scheduler, a highly available database platform, or a backup service.

PARISA: So the presence of a Compose file doesn't answer how we handle host failure, updates, TLS, monitoring, or data recovery.

JULES: Right. It solves describing and managing related services together. That's a significant problem. It doesn't have to solve every problem to earn its place.

PARISA: Our app has friends, their addresses are written down, and the database has a place to keep its belongings. Next we need to get the whole arrangement somewhere users can reach.

JULES: From Git push to production.

PARISA: Which, I am assured, involves more than pushing Git really hard.

[OUTRO MUSIC]
