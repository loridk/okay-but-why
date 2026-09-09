# Episode 16: Dependencies, Supply Chains & Secrets — npm Has Entered the Threat Model

Status: Draft

**CAST**

PARISA — Developer who remembers copying libraries directly into project folders and is not claiming that was safer, just easier to count.

JULES — Developer who grew up with package managers and is prepared to admit that convenience created an enormous trust graph.


[MUSIC]

PARISA: `npm install`.

JULES: Convenient.

PARISA: One command.

JULES: Very convenient.

PARISA: Four hundred packages.

JULES: Sometimes.

PARISA: Who are all these people?

JULES: Supply-chain security asks that exact question.

[MUSIC STING]


## Who Asked for Dependencies?

JULES: Reusing libraries saves enormous time.

PARISA: We do not want every developer implementing cryptography, HTTP parsers, date handling, image processing—

JULES: Exactly.

PARISA: Shared code is good.

JULES: But every dependency adds trust.

PARISA: Maintainer account.

Repository.

Package registry.

Build pipeline.

Transitive dependencies.

JULES: Exactly.


## Direct and Transitive Dependencies

PARISA: I install package A.

JULES: A depends on B and C.

PARISA: C depends on D through Q.

JULES: And suddenly your application executes code from projects you never selected directly.

PARISA: Transitive dependency risk.

JULES: Yes.


## Compromised Maintainer

PARISA: Attacker compromises a maintainer’s account.

JULES: Publishes malicious version.

PARISA: Users update.

JULES: Malware enters trusted build or application path.

PARISA: No vulnerability in our code required.

JULES: Correct.


## Dependency Confusion

PARISA: Internal package named `company-utils`.

JULES: Build system accidentally prefers a public package with the same name.

PARISA: Attacker publishes malicious public version.

JULES: Dependency confusion.

PARISA: Namespace and registry configuration matter.

JULES: Exactly.


## Typosquatting Packages

PARISA: `requsets` instead of `requests`.

JULES: Package typosquatting.

PARISA: Developer mistypes install command.

JULES: Malicious package executes.

PARISA: Humans remain squishy.


## Lockfiles

JULES: Lockfiles record exact dependency resolution.

PARISA: Reproducibility.

JULES: And some protection against unexpected version drift.

PARISA: Not proof dependency is safe.

JULES: Correct.

PARISA: But “same declared ranges, totally different transitive tree next install” is harder when lockfile is respected.

JULES: Exactly.


## Integrity Checks

PARISA: Package managers can verify package integrity hashes.

JULES: Useful against tampering between registry and install.

PARISA: But if malicious code is legitimately published and hash matches—

JULES: Integrity verification says “this is exactly the malicious package registry gave you.”

PARISA: Integrity is not benevolence.

JULES: Important lesson.


## SBOM

PARISA: Software Bill of Materials.

JULES: Inventory of components in software.

PARISA: If a library vulnerability is announced, SBOM helps answer “Where are we using it?”

JULES: Exactly.

PARISA: Very useful during incident response and vendor risk.

JULES: Yes.


## Vulnerability Scanning

PARISA: `npm audit`.

JULES: Dependency scanners compare packages against known vulnerability data.

PARISA: Helpful.

JULES: Not complete.

PARISA: Scanner cannot tell me every package is trustworthy.

JULES: Correct.

PARISA: And severity needs application context.

JULES: Episode one forever.


## Secrets

PARISA: API key in Git history.

JULES: Secret.

PARISA: `.env` accidentally committed.

JULES: Secret leak.

PARISA: Cloud credential in CI log.

JULES: Secret leak.

PARISA: Private key in Docker image.

JULES: Secret leak.

PARISA: We should perhaps stop doing that.

JULES: Strong recommendation.


## Why Deleting the Secret Is Not Enough

PARISA: I committed an API key, then deleted the line.

JULES: Key may still exist in Git history, caches, forks, logs.

PARISA: So rotate or revoke it.

JULES: Immediately.

PARISA: Treat exposed secret as compromised.

JULES: Exactly.


## Secret Managers

PARISA: Dedicated secret manager.

JULES: Central storage with controlled access, auditing, rotation support, and delivery to workloads.

PARISA: Better than shared spreadsheet called `Passwords FINAL.xlsx`.

JULES: Significantly.


## Short-Lived Credentials

PARISA: Better than storing static cloud keys?

JULES: Workload identity and short-lived credentials.

PARISA: Authenticate workload and issue temporary token.

JULES: Exactly.

PARISA: Less long-lived secret material to steal.

JULES: Yes.


## CI/CD Supply Chain

PARISA: Build pipeline can modify production artifacts.

JULES: Therefore it is high-value.

PARISA: GitHub Actions token permissions.

Third-party actions.

Build secrets.

Artifact signing.

JULES: All part of supply-chain security.

PARISA: A compromised CI workflow can bypass secure source code.

JULES: Exactly.


## Pinning Actions and Dependencies

PARISA: Pin versions.

JULES: Reduces unexpected changes.

PARISA: For high-risk CI actions, pinning immutable commit identifiers can be stronger than a floating tag.

JULES: Yes.

PARISA: But then we need update process.

JULES: Security maintenance is still maintenance.


## Code Signing and Provenance

PARISA: Signed artifacts.

JULES: Help verify origin and integrity.

PARISA: Build provenance.

JULES: Evidence about how and where an artifact was built.

PARISA: SLSA.

JULES: Supply-chain Levels for Software Artifacts provides a framework for improving software supply-chain integrity.

PARISA: Acronym has entered the building.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: Pipe random curl output directly into shell because README said so.

JULES: Please understand what you’re executing.

PARISA: Commit `.env`.

JULES: Please don’t.

PARISA: Ignore lockfile.

JULES: Please don’t casually.

PARISA: Give CI token write access to everything.

JULES: Least privilege.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: Modern software is a trust graph.

JULES: Exactly.

PARISA: My code depends on libraries, maintainers, registries, CI systems, build actions, secrets infrastructure.

JULES: Supply-chain security makes that invisible trust visible.

PARISA: And then reduces unnecessary trust.

JULES: That’s the goal.


## Security+ Corner

JULES: Know supply-chain compromise, third-party risk, dependency vulnerabilities, secrets management, code signing, SBOMs, secure CI/CD, and least privilege.

PARISA: Developer depth: update dependencies deliberately, protect build systems, and rotate leaked secrets.


## What Did We Actually Learn?

PARISA: Dependencies save time by importing trust.

JULES: Transitive dependencies multiply that trust.

PARISA: Lockfiles and integrity checks improve reproducibility and tamper detection but do not guarantee safe code.

JULES: SBOMs improve visibility.

PARISA: Secrets must be protected, rotated when exposed, and ideally replaced with short-lived identity where possible.

JULES: Next: vulnerabilities and pentesting.

PARISA: Time to scan ourselves before somebody else does.

[MUSIC OUT]
