# Episode 18: Secure Architecture & Cloud Security — Whose Computer Is This Anyway?

Status: Draft

**CAST**

PARISA — Developer who knows “the cloud” is someone else’s computers plus a billing dashboard.

JULES — Developer explaining shared responsibility, cloud IAM, network boundaries, hardening, resilience, and why managed does not mean magically secure.


[MUSIC]

PARISA: We moved it to the cloud.

JULES: Great.

PARISA: Security is Amazon’s problem now.

JULES: No.

PARISA: Microsoft?

JULES: No.

PARISA: Google?

JULES: Also no.

PARISA: Then what did we pay for?

[MUSIC STING]


## Shared Responsibility

JULES: Cloud providers secure the underlying cloud infrastructure.

PARISA: Facilities.

Hardware.

Core platform.

JULES: Depending on service model.

PARISA: Customer still secures identities, data, configuration, applications, permissions.

JULES: Exactly.

PARISA: Responsibility shifts depending on IaaS, PaaS, SaaS.

JULES: Right.


## IaaS

PARISA: Infrastructure as a Service.

JULES: Provider runs physical infrastructure and virtualization.

PARISA: I manage guest OS, applications, many network controls, identities, data.

JULES: Generally.


## PaaS

PARISA: Platform as a Service.

JULES: Provider manages more runtime and platform layers.

PARISA: I still own my app, data, access policy, configuration.

JULES: Exactly.


## SaaS

PARISA: Provider runs application.

JULES: Customer still manages accounts, sharing, data governance, MFA, configuration.

PARISA: “SaaS” did not eliminate IAM.

JULES: Never.


## Misconfiguration

PARISA: Public bucket.

JULES: Classic cloud security problem.

PARISA: Overly permissive IAM.

JULES: Yep.

PARISA: Database open to internet.

JULES: Yep.

PARISA: Secret in environment visible to every workload.

JULES: Yep.

PARISA: Cloud makes secure architecture programmable, which means insecure architecture is also programmable.

JULES: Very quickly.


## Security Groups and Network Controls

PARISA: Cloud firewall-style controls.

JULES: Security groups, network ACLs, private networks, service endpoints depending on provider.

PARISA: Default deny where practical.

JULES: Yes.

PARISA: Database private.

App tier reaches database.

Public load balancer reaches app.

JULES: Exactly.


## Cloud IAM

PARISA: Roles instead of long-lived keys.

JULES: Prefer workload identities and temporary credentials when possible.

PARISA: Least privilege policies.

JULES: Yes.

PARISA: Separate human admin from workload permissions.

JULES: Exactly.


## Hardening

JULES: **Hardening** reduces unnecessary attack surface.

PARISA: Remove unused services.

Patch.

Secure configuration.

Disable default accounts.

Restrict ports.

JULES: Use hardened images and baselines.

PARISA: CIS benchmarks.

JULES: Common reference.


## Immutable Infrastructure

PARISA: Instead of SSHing into server and making mystery changes—

JULES: Build new known image and replace instance.

PARISA: Reduces configuration drift.

JULES: Exactly.

PARISA: Also makes incident recovery cleaner.

JULES: Potentially.


## Containers Are Not Tiny VMs

PARISA: Containers share host kernel.

JULES: Yes.

PARISA: Isolation boundary differs from full virtual machines.

JULES: Correct.

PARISA: Run as non-root.

Minimal images.

Scan images.

Drop capabilities.

JULES: Secure registry and orchestration permissions.

PARISA: Future Docker/Kubernetes series sends a threatening calendar invite.


## Resilience

JULES: Secure architecture includes availability.

PARISA: Redundancy.

Load balancing.

Multiple zones.

Backups.

Failover.

JULES: Capacity planning and DDoS protection.

PARISA: Architecture can reduce impact before incident occurs.


## Data Residency and Sovereignty

PARISA: Where data physically lives can matter legally.

JULES: Yes.

PARISA: Cloud region selection can be security, privacy, and compliance decision.

JULES: Correct.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: Use cloud root account for normal work.

JULES: Please don’t.

PARISA: Put `0.0.0.0/0` on database because connection debugging is annoying.

JULES: Please don’t.

PARISA: Assume provider backup means your recovery requirements are solved.

JULES: Verify service behavior and test recovery.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: Cloud security is familiar security with programmable infrastructure and shifted responsibility.

JULES: Exactly.

PARISA: Identity, network boundaries, least privilege, hardening, encryption, logging, recovery.

JULES: Same principles, different control plane.


## Security+ Corner

JULES: Know shared responsibility, cloud service models, virtualization/container considerations, segmentation, secure configuration, availability, resilience, data location, and IAM.

PARISA: Next: security operations.

[MUSIC OUT]
