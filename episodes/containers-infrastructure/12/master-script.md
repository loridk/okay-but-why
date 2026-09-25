# Episode 12: Do You Actually Need Any of This Shit?

**Series:** Containers & Infrastructure
**Hosts:** Parisa, Jules
**Production:** Finished audio-first script. Recording handled separately.

[INTRO MUSIC]

JULES: We have learned about servers, VMs, containers, images, Compose, deployment pipelines, Kubernetes, cloud services, and infrastructure as code.

PARISA: And now I'm deleting our fictional architecture diagram down to the parts we can justify.

JULES: A moving graduation ceremony.

PARISA: Welcome to Okay, But Why? The final episode of Containers and Infrastructure asks: do you actually need any of this shit?

## Requirements Before Equipment

JULES: Some infrastructure always exists. The useful question is which parts we should directly choose and operate, and which services should manage them for us.

PARISA: Start with what the application does. Does it serve prepared files? Run a backend? Store user data? Perform background work? Need persistent connections? Those are different requirements.

JULES: Then ask about expected usage, acceptable downtime, recovery time, data loss tolerance, budget, team skills, and any contractual or regulatory requirements the organization actually has.

PARISA: Actual requirements, not “what if we become the world's largest company next Thursday?” Growth can be a reason to leave room for change without paying for Thursday in advance.

JULES: And name the operator. Who patches it, handles failures, reviews access, and restores data? If the answer is one person who also has a full-time job, that should influence the architecture.

PARISA: An architecture that requires an imaginary operations team is already missing a dependency.

## A Static Portfolio

JULES: First example: a portfolio built into HTML, CSS, browser JavaScript, and images. No private backend required.

PARISA: Static hosting with encrypted connections and appropriate caching may handle it well. A CDN can help delivery. If Node builds the files, that doesn't mean we must run Node in production.

JULES: Containers might make a build environment more repeatable, but the deployed site doesn't inherently need a container service. Kubernetes would need a specific operational justification that this description hasn't supplied.

PARISA: Keep deployment repeatable, protect the account, check links, and make the site accessible. A broken keyboard menu isn't repaired by moving the files into a cluster.

JULES: And if we add a contact form, we can evaluate that one need. It doesn't automatically require replacing every other part of the hosting setup.

## A Small WordPress or Drupal Site

PARISA: A CMS changes the picture. Now we need the supported runtime, database, writable files, scheduled tasks where applicable, backups, and a maintenance process.

JULES: Suitable shared hosting or managed CMS hosting may provide those well. Verify the actual runtime support, resource limits, update responsibilities, staging options, and recovery arrangements.

PARISA: DDEV or Lando can still be excellent locally even if production uses managed hosting without exposing containers to us. Development convenience doesn't dictate the production platform.

JULES: A VM offers more control if the site needs it, but brings operating-system administration. Containers can package consistent environments, but someone must still manage storage, upgrades, and the host or platform.

PARISA: And editing a paragraph shouldn't require the editor to become a deployment engineer. The infrastructure should support the content workflow, not consume it.

## React Frontend and an API

JULES: Now our familiar frontend, API, database example. A static frontend may use static hosting; a server-rendered frontend needs an appropriate execution environment. The API needs somewhere to run.

PARISA: A PaaS or managed container service may accept the application with relatively little machinery for us to operate. A managed database can reduce a separate set of responsibilities.

JULES: Compose can describe the local environment. For a modest production workload, a well-managed single VM with Compose might also be reasonable if its failure and maintenance limits are acceptable.

PARISA: The phrase “well-managed” contains actual work. TLS, patches, restarts, restricted ports, logs, backups, and recovery. If one host fails, all the services on it may be affected together.

JULES: Exactly. A low resource bill isn't the entire cost. A managed service can be worth more cash if it saves operational labor and reduces risks we aren't equipped to handle.

PARISA: Serverless could fit some API or event-driven workloads too. Check execution limits, latency, persistent-connection needs, and predictable costs rather than treating the name as a universal upgrade.

## Growing SaaS

JULES: Suppose the application becomes a paid service with more customers. Now we have evidence about traffic, slow requests, background jobs, and failure impact.

PARISA: We might first improve queries, caching, or resource sizing. Scaling API replicas doesn't help if one expensive query is the bottleneck.

JULES: Then separate components when their scaling or reliability requirements justify it. Use managed capabilities where they fit. Automate repeatable deployments and make recovery a tested procedure.

PARISA: Infrastructure as code becomes especially useful when we have multiple environments or enough settings that manual recreation is error-prone. That can happen long before Kubernetes is relevant.

JULES: Yes. IaC and Kubernetes aren't a package deal. You can manage a small set of cloud resources declaratively without running any cluster.

PARISA: Conversely, writing hundreds of lines to reproduce a single trivial setting may be more ceremony than benefit. Evaluate the lifecycle, not just today's object count.

## Large Distributed Application

JULES: Now imagine many services, multiple teams, frequent deployments, placement requirements, changing capacity, and a platform team capable of operating a shared environment.

PARISA: We finally have plausible reasons to evaluate Kubernetes: a common workload model, scheduling across machines, reconciliation, service discovery, and rollout control.

JULES: Managed Kubernetes may reduce some maintenance, while managed container platforms may meet the requirements with less direct Kubernetes exposure. Compare the actual controls and operating burden.

PARISA: There's still no magic threshold where container number one hundred activates a legal obligation to use Kubernetes.

JULES: Correct. And Kubernetes itself doesn't fix service boundaries, unreliable dependencies, poor deployment compatibility, or missing operational ownership. It coordinates what we tell it to coordinate.

PARISA: If we have a distributed mess, we can orchestrate the mess with impressive consistency.

## Uptime and Compliance Change the Questions

JULES: An organization may also have significant uptime, access-control, audit, or data-location requirements even with moderate traffic. Complexity isn't only about popularity.

PARISA: Then we need evidence: who can change production, how actions are recorded, how data is protected, where it's stored, and whether recovery meets the organization's requirements.

JULES: Redundancy, failure-domain placement, backups, recovery exercises, and vendor capabilities may matter. A cloud product's certifications or features don't automatically establish the organization's own compliance.

PARISA: Nor does “we run it ourselves” prove stronger security. It changes who must do the work and demonstrate that it's done.

JULES: Right. Involve the relevant specialists for specific obligations. Our conceptual series gives developers better questions, not a substitute for an organization's assessment.

## Put Our Podcast Back on Earth

PARISA: Let's return to our ordinary fictional podcast application. A page listing episodes, an API if we actually need one, a modest database, and audio files. We invented absurd popularity to understand orchestration.

JULES: The actual requirements may be met by a small managed setup. We probably don't need to operate Kubernetes. We might not need the API at all if prepared pages cover the real feature set.

PARISA: That's not deleting the learning. Now we can explain why a simpler choice is sufficient, which is a stronger position than choosing it because the other nouns were scary.

JULES: Containers might still improve local consistency. Compose might help coordinate development services. A pipeline might make releases safer. IaC might preserve useful infrastructure decisions. Each can earn its place independently.

PARISA: And each can be declined independently. We don't have to purchase the entire infrastructure cinematic universe.

## A Decision You Can Defend

JULES: Here's a useful sentence: we chose this arrangement because it meets these requirements, this person or service owns operations, and we will reconsider when this measurable condition changes.

PARISA: For example: managed hosting meets our current runtime and recovery needs. We will reassess if we need an unsupported background service or demonstrated capacity beyond the plan. That's more useful than “we need a modern stack.”

JULES: Write down the tradeoffs too. A single host has a shared failure boundary. A managed service imposes constraints. Provider-specific features create dependencies. Operating a cluster costs expertise and attention.

PARISA: Then ask what we can remove without violating a requirement. That's not laziness. That's less software to maintain and fewer places for a mystery to live.

JULES: We began with files on a laptop. Those files became processes, running on machines, with environments, networks, data, and operational responsibilities around them.

PARISA: Containers make part of that environment portable and predictable. Orchestration coordinates workloads. Cloud services let us choose what others manage. Infrastructure as code records intended infrastructure. None of them changes the obligation to understand the problem.

JULES: So the final question isn't “do professional developers use Kubernetes?”

PARISA: It's “what operational problem would Kubernetes solve for this application?” If the answer is none, congratulations. You have successfully not adopted Kubernetes.

JULES: An underrated milestone.

PARISA: This has been Okay, But Why? Keep the parts that help. Know who owns the rest. And let the laptop close when you go to lunch.

[OUTRO MUSIC]
