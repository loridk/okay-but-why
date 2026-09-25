# Episode 9: Pods, Nodes & Clusters, Oh My

**Series:** Containers & Infrastructure
**Hosts:** Parisa, Jules
**Production:** Finished audio-first script. Recording handled separately.

[INTRO MUSIC]

PARISA: I opened a Kubernetes diagram. It contains a cluster, nodes, Pods, containers, a Deployment, and a Service. I believe we're running an application, although we may be founding a small nation.

JULES: Last time we established why the coordination exists. Today we attach names to the jobs.

PARISA: Welcome to Okay, But Why? No certification quiz at the end. We are trying to understand the diagram, not earn the right to be paged at three in the morning.

## Start With the Machines

JULES: A cluster is the Kubernetes system: a control plane and nodes that run workloads. The control plane holds and coordinates the system's desired state. Nodes supply places where workloads can execute.

PARISA: A node can be a physical machine or a VM. Kubernetes hasn't replaced the hardware from episode one.

JULES: Exactly. A node has the software needed to run Pods, including a container runtime and an agent called the kubelet that coordinates local execution with the control plane.

PARISA: That's enough agent vocabulary for now. What's a Pod?

JULES: The smallest deployable unit Kubernetes creates and schedules. A Pod groups one or more containers that run together on the same node and share a networking context. They can also share explicitly configured storage volumes.

PARISA: Often one main application container, but not necessarily exactly one. And not our entire frontend, API, and database jammed into one Pod because they're all friends.

JULES: Right. Group containers when they need that tight relationship and shared lifecycle. Components that should scale or update independently usually belong in separate workloads.

PARISA: Our API replicas will therefore be separate Pods. If we need three API instances, we're not normally putting three copies inside one Pod and calling that resilience.

## Localhost Returns With a Footnote

JULES: Remember the network context from episode five? Containers within the same Pod share one. They can communicate over localhost and must coordinate port usage within that shared context.

PARISA: So the earlier rule wasn't secretly wrong. Localhost still means this networking context. We have deliberately given these containers the same one.

JULES: Exactly. A different Pod has a different context. Our database isn't on the API Pod's localhost just because both are inside one cluster.

PARISA: And a Pod is replaceable. We shouldn't treat its address or local filesystem as a permanent home.

JULES: Right. Kubernetes doesn't move a particular live Pod to a different node like dragging an icon. If a replacement is needed, it creates a new Pod. Durable storage and application behavior need to accommodate that lifecycle.

## Desired Three, Actual Two

PARISA: Now the central example. We want three API replicas. Where do we say that?

JULES: For a typical stateless API, a Deployment declares the desired replica count and the Pod template, including the image and relevant configuration. It manages ReplicaSets, which maintain the requested set of Pods.

PARISA: Deployment describes the rollout and desired workload; ReplicaSet maintains a count; Pods contain the running application containers. I don't have to manipulate every intermediate object by hand.

JULES: Exactly. Now imagine one managed Pod is deleted. Desired replicas: three. Actual replicas: two. The controller notices the gap and creates a replacement Pod object.

PARISA: The scheduler chooses an eligible node for that unscheduled Pod, considering resources and placement constraints. The node's software then works to start the containers.

JULES: Correct. When the new Pod is ready, we have three ready replicas again. The process takes time and can fail. A Pending Pod might lack capacity or have an unsatisfied placement requirement. An image pull might fail. A running process might never become ready.

PARISA: Which means three Pod objects existing isn't necessarily three healthy instances serving traffic. We have to look at the right status.

JULES: Exactly. And if the process inside an existing Pod crashes, the kubelet can restart that container according to its restart policy. That's distinct from creating a replacement Pod after a node or Pod failure.

PARISA: Same broad goal, different repair action. Self-healing isn't one magic spell.

## A Stable Way to Reach Unstable Addresses

JULES: Now another component wants our API. A Kubernetes Service provides a stable network abstraction for reaching a set of endpoints, commonly Pods selected by labels.

PARISA: Labels are key-value metadata. We label the API Pods consistently, and the Service uses a selector to identify the intended set.

JULES: Right. As matching Pods change, the endpoint information changes. Clients use the Service's name and address rather than tracking every Pod's temporary IP themselves.

PARISA: And this Service doesn't start the Pods. The Deployment and its controllers handle the workload. The Service handles reaching it.

JULES: Exactly. Nor is every Service a public internet endpoint. A typical ClusterIP Service is internal to the cluster. External access requires the appropriate additional setup.

PARISA: This also differs from a Compose service, where the word names a component in our Compose configuration. Vocabulary belongs to the tool that defines it.

## Three Different Health Questions

JULES: Let's make health checks precise. A startup probe asks whether initialization has succeeded. While it hasn't succeeded, it can prevent liveness and readiness probes from interfering with a slow-starting application.

PARISA: Then readiness asks whether the container is ready to receive traffic. Failed readiness normally removes that Pod from the Service's ready destinations; it doesn't itself restart the container.

JULES: Liveness asks whether the container needs restarting. Repeated failure can cause the kubelet to restart it. These checks must match the application's behavior.

PARISA: So if the database has a temporary outage, restarting every API process may accomplish nothing and add load. A liveness check should not be a referendum on the entire internet.

JULES: Exactly. Choose what each signal means, allow realistic startup time, and avoid expensive probes that become their own workload.

PARISA: And clients still need timeouts and reasonable error handling. Routing around an unready Pod doesn't mean requests already in flight never fail.

## Change the Image, Keep Serving

JULES: We update the Deployment's Pod template to use a new API image. With a rolling strategy, Kubernetes creates new Pods and scales down old ones according to the configured rollout rules.

PARISA: Readiness helps determine whether new Pods can serve. Spare capacity and the allowed unavailable count affect how that transition goes.

JULES: Yes. The old and new API versions may coexist briefly, so request handling and database changes must tolerate that. Graceful shutdown also helps existing requests finish before a process exits.

PARISA: If the rollout stalls, do we get an automatic rollback?

JULES: Not by default merely because a Deployment's progress deadline is exceeded. Kubernetes reports the problem and continues its normal behavior; rollback needs an operator or additional automation. Don't assume a failed rollout has safely undone itself.

PARISA: Good. That's exactly the kind of assumption that produces a confident dashboard screenshot and an unavailable website.

JULES: We can roll back a suitable Deployment revision, subject to the same data-compatibility limits from the deployment episode. Kubernetes can't unwrite a database migration by changing a Pod template.

## Understand the Map, Choose Your Job

PARISA: Let me draw it verbally. The cluster contains the coordination machinery and nodes. Nodes run Pods. Pods contain containers. A Deployment manages a replicated workload, while a Service gives clients a stable way to reach its changing instances.

JULES: The scheduler places new Pods. Controllers reconcile desired and observed state. Health signals help guide traffic and recovery. That's the map.

PARISA: It's enough to ask productive questions: Are the Pods scheduled? Are the images starting? Are they ready? Does the Service select them? Is there capacity?

JULES: And understanding those questions doesn't obligate every web developer to administer a cluster. You might use a platform maintained by specialists, or choose a service where Kubernetes never enters your workflow.

PARISA: I can understand the building without volunteering to maintain the elevators.

JULES: Next time: what a cloud provider can manage for us, and what responsibility stays on our side.

PARISA: The cloud is someone else's computer, asterisk. I assume the asterisk is doing several departments' worth of work.

[OUTRO MUSIC]
