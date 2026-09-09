# Episode 23: Secure Development & DevSecOps — Security Before Friday

Status: Draft

**CAST**

PARISA — Experienced developer who knows “we’ll add security later” is what people say right before discovering security changes architecture.

JULES — Developer explaining how security fits into planning, coding, review, CI/CD, deployment, monitoring, and maintenance without turning every developer into a full-time security engineer.


[MUSIC]

PARISA: Feature complete.

JULES: Great.

PARISA: QA passed.

JULES: Great.

PARISA: Launch Friday.

JULES: Security review?

PARISA: Monday?

JULES: No.

PARISA: After launch?

JULES: No.

PARISA: You’re very rigid about chronology.

[MUSIC STING]


## Security Is a Lifecycle Property

JULES: Secure development means security decisions happen throughout the software lifecycle.

PARISA: Requirements.

Design.

Implementation.

Testing.

Deployment.

Operations.

Retirement.

JULES: Exactly.

PARISA: Not one security gate at the end.

JULES: Right.


## Security Requirements

PARISA: Product requirements usually say what system should do.

JULES: Security requirements say what must not happen and what protections are required.

PARISA: MFA for admins.

Audit sensitive changes.

Encrypt regulated data.

Session expires after defined period.

JULES: Exactly.


## Secure Design

PARISA: Threat modeling.

JULES: Trust boundaries.

Least privilege.

Data minimization.

Secure defaults.

PARISA: Authentication and authorization architecture.

JULES: Dependency and deployment model.

PARISA: Decisions cheapest to change before code hardens around them.

JULES: Exactly.


## Secure Coding

PARISA: Parameterized queries.

Contextual output encoding.

Safe APIs.

Validation.

Secrets outside source.

JULES: Memory-safe languages where appropriate, dependency hygiene, error handling.

PARISA: Security becomes ordinary code quality.


## Code Review

JULES: Human review can catch security issues automated tools miss.

PARISA: Authorization logic.

Dangerous assumptions.

Secret handling.

New trust boundaries.

JULES: Exactly.

PARISA: Review checklist should match technology, not generic “is code secure?”

JULES: Yes.


## SAST in CI

PARISA: Static analysis on pull request.

JULES: Fast feedback.

PARISA: But noisy scanner gets ignored.

JULES: Tune it.

PARISA: Security tooling needs developer experience.

JULES: Strongly.


## Dependency Scanning

PARISA: Scan lockfile for known vulnerable packages.

JULES: Alert on meaningful risk.

PARISA: Automated update PRs.

JULES: Useful if teams actually review and merge them.

PARISA: Bot producing eighty PRs nobody reads is not remediation.

JULES: Correct.


## Secret Scanning

PARISA: Detect key before commit or push.

JULES: Great control.

PARISA: Server-side scanning catches what local hook misses.

JULES: Defense in depth.


## DAST and Test Environments

PARISA: Dynamic scanning against running test environment.

JULES: Finds behaviors static tools cannot see.

PARISA: But avoid destructive tests in production unless explicitly designed and authorized.

JULES: Correct.


## Infrastructure as Code

PARISA: Terraform, CloudFormation, Kubernetes manifests.

JULES: Infrastructure configuration becomes reviewable code.

PARISA: Which means security policy can be checked before deployment.

JULES: Public bucket.

Open security group.

Overprivileged role.

PARISA: Policy as code.

JULES: Exactly.


## CI/CD Permissions

PARISA: Pipeline can deploy production.

JULES: Treat it as privileged identity.

PARISA: Minimal token permissions.

Protected environments.

Approval for sensitive releases.

Short-lived cloud credentials.

JULES: Exactly.


## Artifact Integrity

PARISA: Build once, promote same artifact.

JULES: Reduces risk of uncontrolled rebuild differences.

PARISA: Sign artifacts.

Verify provenance.

JULES: Supply-chain security meets deployment.


## Environment Separation

PARISA: Dev credentials should not reach prod.

JULES: Yes.

PARISA: Test data should not casually be production personal data.

JULES: Yes.

PARISA: Production access should be restricted and auditable.

JULES: Yes.


## Security Gates Without Developer Hostility

PARISA: Here’s where DevSecOps can become awful.

Tool blocks deployment with unclear vulnerability nobody owns.

JULES: Security gate needs actionable information.

PARISA: What failed?

Why?

Who owns it?

How do we fix or formally accept risk?

JULES: Exactly.

PARISA: Otherwise people learn to hate or bypass security tooling.

JULES: Developer experience is a security control.


## Shift Left and Shift Right

PARISA: Shift left: earlier in lifecycle.

JULES: Threat modeling, code scanning, dependency checks.

PARISA: Shift right: runtime monitoring and production feedback.

JULES: Logs, detections, attack simulation, incident learning.

PARISA: We need both.

JULES: Exactly.


## Security Champions

PARISA: Developer on team with extra security interest and training.

JULES: Security champion.

PARISA: Not unpaid replacement for security team.

JULES: Correct.

PARISA: Bridge between domain knowledge and security expertise.

JULES: Exactly.


## Patch Management

PARISA: Software is never “done.”

JULES: Vulnerabilities emerge after release.

PARISA: Inventory.

Monitor advisories.

Test patches.

Deploy.

Verify.

JULES: Secure lifecycle includes maintenance.


## End of Life

PARISA: Unsupported framework.

Old OS.

Abandoned dependency.

JULES: Technical debt becomes security debt.

PARISA: If no patches exist, continuing to operate requires explicit risk decision or migration.

JULES: Exactly.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: Buy six scanners and assign nobody to findings.

JULES: Please don’t.

PARISA: Make security a final-week checklist.

JULES: Please don’t.

PARISA: Give CI global admin because “deployment was failing.”

JULES: Please definitely don’t.

PARISA: Block developers with security errors that contain no remediation guidance.

JULES: Security tooling should help people succeed securely.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: DevSecOps is not “security team uses Jenkins.”

JULES: Correct.

PARISA: It’s integrating security feedback and controls into how software is actually built and operated.

JULES: Exactly.

PARISA: Right control, right stage, actionable feedback, clear ownership.

JULES: That is the useful version.


## Security+ Corner

JULES: Know secure SDLC, threat modeling, code review, SAST/DAST, dependency and secret scanning, change management, patching, environment separation, CI/CD security, automation, and secure deployment practices.

PARISA: Next: big security picture.

[MUSIC OUT]
