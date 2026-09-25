# Episode 11: Infrastructure as Code: Why Is My Server in Git?

**Series:** Containers & Infrastructure
**Hosts:** Parisa, Jules
**Production:** Finished audio-first script. Recording handled separately.

[INTRO MUSIC]

PARISA: Who configured production?

JULES: Us, six months ago.

PARISA: What did we change?

JULES: There are screenshots.

PARISA: These are screenshots of a successful login and your lunch.

JULES: Both important milestones.

PARISA: Welcome to Okay, But Why? Our fictional podcast application has acquired infrastructure and lost the memory of how we configured it. Today: infrastructure as code. Why is my server in Git?

## The Console Remembered. We Didn't.

JULES: We created a network, a compute service, storage, and a database. Then we changed a firewall rule in the console while diagnosing a problem. Someone increased capacity. Someone added a test resource.

PARISA: Production now works, mostly. Staging doesn't match it, nobody knows whether the extra rule is still needed, and recreating the environment sounds like detective work.

JULES: That's configuration drift: actual settings diverge from the intended or recorded configuration. Manual changes can be legitimate, but undocumented differences make systems harder to understand and reproduce.

PARISA: The issue isn't that clicking is morally inferior to typing. The issue is that we can't reliably explain what exists or repeat the decisions.

JULES: Exactly. Infrastructure as code, often abbreviated IaC, means describing and managing infrastructure through machine-readable definitions that can be version-controlled and reviewed.

PARISA: Git contains the description. It doesn't contain the physical server. This seems obvious until somebody says “our infrastructure is in Git” and waves vaguely at a data center.

## Declare the Result

JULES: Terraform and OpenTofu are examples of tools commonly used for declarative infrastructure management. We describe resources and their desired settings. Providers connect the tool to APIs that create and manage those resources.

PARISA: Provider here means the integration plugin, which might talk to a cloud provider but can also manage other supported services. Another word with too many jobs.

JULES: Correct. Provisioning means creating or allocating resources. A definition might say we want a particular network and a compute service connected to it. The tool determines dependencies and proposes operations needed to reach that configuration.

PARISA: Unlike a purely imperative list saying click this, then create that, then attach this exact newly returned ID. Though infrastructure as code is a broader category; it can include imperative approaches too.

JULES: Yes. We're focusing on the declarative model because it connects to desired state from Kubernetes. Write down what should exist, compare it with what is known to exist, and work toward the desired result.

PARISA: With an important difference: ordinary Terraform or OpenTofu workflows run when we invoke them or trigger automation. They aren't inherently a continuously running Kubernetes-style reconciliation loop.

JULES: Exactly. A committed configuration file doesn't patrol the cloud account by itself.

## Write, Plan, Apply

PARISA: Walk through a small change. Our podcast API needs more memory.

JULES: We edit the desired capacity in configuration and review the change. A plan compares configuration, recorded state, and information read from the remote system, then proposes actions.

PARISA: Create, update, or destroy resources. “Plan” is the point where I want to learn that a seemingly harmless setting requires replacing something.

JULES: Right. Applying performs the selected changes using the provider's APIs. It can take time, encounter errors, or partially complete. This isn't a transaction that necessarily rolls back every previous operation if the final one fails.

PARISA: So read the plan and understand the resource's lifecycle. A database replacement is more consequential than changing a label, even if both fit on one line of configuration.

JULES: And review the relevant plan for the environment and revision we're actually applying. Reality can change between planning and execution. Team workflows need coordination and appropriate state locking where supported.

PARISA: We can automate this through CI, but automation shouldn't turn a destructive surprise into a faster destructive surprise. Restrict the identity doing the apply and make important changes reviewable.

## What Is State Doing Here?

JULES: The tool needs to relate our logical resource definitions to real objects. State records that mapping and other information about managed resources.

PARISA: For example, our configuration calls something podcast storage, and state records which remote storage resource that refers to. Otherwise every run might be unable to tell what it already manages.

JULES: Exactly. State isn't just a disposable build cache. Teams need a protected, reliable way to store and coordinate it, often through a remote backend with suitable access controls and locking.

PARISA: And state can contain sensitive data. Marking an input sensitive may hide it from ordinary output without removing it from stored state.

JULES: Right. Protect state and saved plan files. Don't casually commit them to a public repository. Keep credentials out of configuration and use supported authentication mechanisms with narrow permissions.

PARISA: OpenTofu offers state and plan encryption capabilities too, but encryption requires configuration and key management. It's not an excuse to hand the files to everybody.

JULES: Exactly. The source definition, the state, and the secrets have different roles and access requirements.

## Drift Is a Decision, Not Just an Error

PARISA: Let's say production breaks at midnight and someone changes a setting directly in the console. What happens next?

JULES: A later refresh and plan may detect the difference for managed resources. Then we decide whether the configuration should restore the old setting or adopt the emergency change. We reconcile the record with the intended reality.

PARISA: Blindly applying the old definition could undo the fix. Blindly editing the file to match everything in production could preserve a mistake. We need context.

JULES: Yes. Tools detect certain differences; people decide what should be true. Resources outside the tool's management aren't automatically discovered and brought under control just because they're in the same account.

PARISA: Existing infrastructure may need import and corresponding configuration. “We added Terraform” isn't evidence that every historical resource is now tracked.

JULES: Nor is a clean plan proof of application health. It can mean the managed infrastructure matches the declaration while the API still returns errors.

## Repeatable Doesn't Mean Identical in Every Detail

PARISA: We can use the definitions to create staging and production with deliberate differences. Smaller capacity in staging, different names, separate data, different credentials.

JULES: Exactly. Repeatable structure and reviewed variation. Don't copy production secrets or private data into a development environment just to make it “realistic.”

PARISA: And recreating a database resource doesn't recreate its contents. The description provisions a place for data. Restoring the data is a separate recovery operation.

JULES: That distinction matters during disaster recovery. Configuration, artifacts, data backups, secrets access, and tested procedures all contribute. Infrastructure code isn't a replacement for the other pieces.

PARISA: Version control also doesn't make infrastructure changes reversible in the same way as text. Reverting a commit and applying it may trigger new destructive operations or fail because the previous resource no longer exists.

JULES: Correct. Git remembers the description. It doesn't reverse time for external systems.

## A Useful Boundary Around the Tool

PARISA: Does IaC deploy our application image too?

JULES: It can manage service definitions that refer to images, depending on the provider and workflow. But teams often separate infrastructure provisioning from frequent application releases. The division should be clear so two tools don't fight over the same setting.

PARISA: Our simple distinction can be: infrastructure definitions describe the places and relationships; the release pipeline promotes the tested application artifact. If one tool handles both, we still understand both jobs.

JULES: And the Terraform or OpenTofu language is HCL-style configuration, not YAML or JavaScript. We don't need to learn its syntax today to understand the purpose.

PARISA: The companion gives us a workflow sketch instead of pretending a five-line snippet could provision a secure production platform.

JULES: So why is the server in Git?

PARISA: Its intended configuration is in Git because we want a reviewable explanation, a history of changes, and a repeatable way to create or change environments. We still protect state, review plans, and preserve data.

JULES: Next time we stop adding machinery and ask which of it our application actually needs.

PARISA: A brave moment for a technology series. We may conclude that the first hosting account was fine.

[OUTRO MUSIC]
