# Episode 1: Where Does My App Actually Live?

**Series:** Containers & Infrastructure
**Hosts:** Parisa, Jules
**Production:** Finished audio-first script. Recording handled separately.

[INTRO MUSIC]

PARISA: Our podcast application is ready for the world.

JULES: Excellent. Where is it?

PARISA: On my laptop.

JULES: And where is your laptop?

PARISA: About to close, because I want lunch. I see a flaw in our global availability strategy.

JULES: Welcome to Okay, But Why? This is Containers and Infrastructure. We're following a fictional little podcast application from a laptop to somewhere other people can use it. No application homework. No surprise Kubernetes installation.

PARISA: A sentence that should appear on more invitations.

## Files Are Not a Running Application

JULES: Let's start with what your laptop is actually doing. We have source code for a page that lists episodes, and a little backend that can return episode information. What's the difference between that folder and the application?

PARISA: The folder is instructions and other files. It can sit there doing absolutely nothing. If I email you the source code, I haven't emailed you a running process.

JULES: Right. A process is an instance of a program being executed. When you start the backend, the operating system creates a process, gives it resources, and manages its execution.

PARISA: Like opening an editor creates running software. The editor's executable was on disk before I opened it. The backend isn't metaphysically different just because nobody gave it a toolbar.

JULES: Exactly. The computer's CPU executes instructions. RAM holds working data the running software needs. Storage holds files that can survive switching the machine off. Those aren't three brands of the same thing.

PARISA: CPU is doing work, RAM is the active working space, storage is keeping things. With the usual warning that a metaphor is not a computer engineering degree.

JULES: And RAM is generally volatile. If our episode list exists only in a JavaScript variable, restarting the process loses that variable. Saving data to durable storage is a separate act.

PARISA: This is already why a database matters. A variable called allMyVeryImportantEpisodes is not a backup policy.

JULES: The operating system coordinates all this: processes, memory, files, devices, networking. Windows, Linux, and macOS are operating systems. Our framework lives above that machinery.

PARISA: Above, but not independent of. If the disk fills up, the framework does not get to appeal to its branding department.

## The Runtime Is Doing a Job

JULES: Now our backend is written in JavaScript, so in this example Node is the runtime executing it outside the browser. The runtime supplies the machinery and APIs the program relies on.

PARISA: In a PHP application, PHP does that job. A web server may pass a request to PHP workers, which execute the application and return a response. I didn't need to personally start each worker in cPanel for those processes to exist.

JULES: That's a useful distinction. A hosting interface can arrange things on your behalf. It doesn't remove the runtime. Likewise, npm can start a command, but npm isn't the operating system or necessarily the process that serves visitors.

PARISA: We covered that general toolchain distinction before. The new question is where the resulting process stays alive.

JULES: And what it needs to stay useful. Our backend needs compatible dependencies, configuration, some memory, and permission to read the right files. If it talks to a database, that database has to exist and be reachable too.

PARISA: A lot of the phrase “the app is broken” is actually “one of its assumptions stopped being true.”

## A Server Is a Role, Too

JULES: When our backend waits for requests, it's acting as a server. The word can mean the software providing a service, or the machine running that software. Context matters.

PARISA: So my laptop can be a server. Not a very sensible production server while I carry it to lunch, but a server.

JULES: Yes. Data-center machines may have hardware designed for continuous operation and particular workloads. But there's no sacred server particle that your laptop lacks.

PARISA: Just uninterrupted power, predictable connectivity, and someone who doesn't put it in a tote bag.

JULES: Those differences count! Production reliability comes from arrangements around the computer, not the label on the box. Hosting means arranging somewhere for software or content to be served. A cloud platform is one way to obtain infrastructure and services. We'll unpack it later.

PARISA: Server, hosting, cloud. Related words, different questions. What provides the service? Where and under whose care does it run? How are we obtaining the resources?

JULES: Beautiful. Now a browser wants our episode list. How does it reach the right process rather than your editor?

## The Number After Localhost

PARISA: That's the port. My development URL has localhost, a colon, and a number like three thousand.

JULES: A port is a numbered endpoint used with a network address and transport protocol. For this web example, the server listens for connections on a particular TCP port. The operating system helps direct incoming traffic to the listening software.

PARISA: Not a physical hole in the laptop. And the number isn't a secret application ID that works everywhere.

JULES: Right. Localhost means this computer's local networking context. In your browser right now, that's your laptop. If you send me a localhost link, my browser looks on my computer.

PARISA: Which explains why sending the link does not count as deployment. You've sent yourself to your own house to see something in mine.

JULES: We will complicate “this computer” when containers introduce separate networking contexts. For today, our browser and backend are on the same laptop. The browser connects to the backend's listening port and requests the episode list.

PARISA: If I stop the backend process, the source files remain, but there may be nothing listening there. Refreshing the browser can't resurrect the backend through determination.

JULES: Nor does a process listening locally automatically make it reachable from the public internet. Addresses, routing, firewall rules, and what interface it listens on matter. We'll introduce those only as we need them.

## Old Person Yells at Hosting

PARISA: I used to upload files to a hosting account. FTP client, directory on the server, refresh the page. This conversation sounds more complicated than what I did.

JULES: How much was the hosting company already doing?

PARISA: Running the machine, maintaining the web server, providing PHP, routing my domain to the right site. Often providing the database too. cPanel exposed some of those controls.

JULES: So the simplicity was real for you. It was an interface over work someone else performed.

PARISA: And FTP transferred files. It wasn't the web server. Historical FTP also isn't a recommendation for moving credentials or code unencrypted now; use the secure deployment mechanism your host supports.

JULES: This is why static sites are a useful case. A static site's build may run Node on a developer machine or build service. The deployed result can just be HTML, CSS, JavaScript, and images. A web server serves those files; the visitor's browser runs the browser JavaScript.

PARISA: We don't need Node running in production merely because Node helped build the files. But somebody's server process still answers the request for the HTML.

JULES: Exactly. Different parts execute in different places. “Where does my app live?” sometimes needs more than one answer.

## Local Is Forgiving. Production Has Visitors.

PARISA: Locally I can restart a process whenever I want. Production has somebody trying to listen to an episode while I'm changing things.

JULES: Production is the environment actually serving intended users. It needs suitable configuration, protected credentials, durable data, and a way to notice failure. A development server's convenient defaults are not automatically appropriate there.

PARISA: That includes showing a useful error when the API is unavailable. A forever spinner isn't improved by hosting it on an expensive computer.

JULES: And we need a way to start the application again after a crash or machine restart. Somebody must own that responsibility, whether it's us or a managed hosting service.

PARISA: So the inventory is concrete now. Code and dependencies. A runtime if required. Running processes. An operating system. CPU, memory, storage. A route from users to the service. And people or services keeping the arrangement working.

JULES: The dashboard may hide that inventory, but it doesn't make it disappear.

PARISA: Which means the cloud has not replaced computers. It has mostly replaced me knowing where the computers are.

JULES: Next time: if computers can run many processes, why did we start carving them into virtual machines?

PARISA: Presumably because letting every application share one enormous junk drawer had consequences.

[OUTRO MUSIC]
