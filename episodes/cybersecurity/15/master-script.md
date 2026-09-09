# Episode 15: OWASP & Threat Modeling — Please Imagine the Worst

Status: Draft

**CAST**

PARISA — Developer who has used OWASP references and would like threat modeling to stop sounding like a ceremony involving twelve consultants and a spreadsheet.

JULES — Developer who insists threat modeling can be practical, lightweight, and done before the application is on fire.


[MUSIC]

PARISA: Threat modeling.

JULES: Structured pessimism.

PARISA: Do I need a template?

JULES: Maybe.

PARISA: A workshop?

JULES: Maybe.

PARISA: A giant architecture diagram nobody updates?

JULES: Ideally no.

PARISA: Great start.

[MUSIC STING]


## What Is OWASP?

JULES: OWASP is the Open Worldwide Application Security Project.

PARISA: Nonprofit community producing security projects, guidance, tools, and educational resources.

JULES: Exactly.

PARISA: Most developers know OWASP Top 10.

JULES: A widely used awareness document for major web application security risk categories.

PARISA: Important: Top 10 is not the complete universe of application security.

JULES: Correct.

PARISA: It is a useful prioritization and awareness tool.

JULES: Yes.


## Why Lists Help and Hurt

PARISA: Lists are great because they give developers a starting point.

JULES: Broken access control. Cryptographic failures. Injection. Insecure design.

PARISA: But bad if teams turn them into “we checked ten boxes, application secure.”

JULES: Exactly.

PARISA: Real threat profile depends on the application.

JULES: A medical system, public blog, payment platform, browser extension, and internal dashboard have different risks.


## Threat Modeling

JULES: Threat modeling asks questions before or during design.

What are we building?

What do we need to protect?

Who might attack it?

How could they do that?

What controls do we have?

What should we change?

PARISA: That sounds refreshingly normal.

JULES: It should be.


## Assets

PARISA: Start with assets.

JULES: Things that matter.

PARISA: Customer data.

Authentication credentials.

Money.

Source code.

Availability.

Reputation.

JULES: Admin capability. Cryptographic keys. Business processes.

PARISA: Not every asset is data.

JULES: Exactly.


## Trust Boundaries

PARISA: Where does trust change?

JULES: Browser to API.

API to database.

Public internet to private network.

Third-party webhook into our service.

CI pipeline to cloud account.

PARISA: Those boundaries deserve attention because untrusted or differently trusted data crosses them.

JULES: Exactly.


## Data Flow Diagrams

PARISA: DFD.

JULES: Data Flow Diagram.

PARISA: Processes, data stores, external entities, flows, trust boundaries.

JULES: Enough detail to understand how data moves.

PARISA: Not UML Olympics.

JULES: Please no.


## STRIDE

PARISA: Security loves mnemonics.

JULES: STRIDE is one threat-modeling framework.

Spoofing.

Tampering.

Repudiation.

Information disclosure.

Denial of service.

Elevation of privilege.

PARISA: Conveniently maps to identity, integrity, accountability, confidentiality, availability, authorization.

JULES: Exactly.

PARISA: Use it as prompts, not commandments.

JULES: Right.


## Abuse Cases

PARISA: Product team writes user stories.

JULES: Security can write abuse cases.

PARISA: “As an attacker, I want to change another user’s shipping address.”

JULES: Exactly.

PARISA: “As a malicious user, I want to upload a file that executes on another user’s device.”

JULES: Great.

PARISA: This makes threats concrete for developers.

JULES: Very.


## Attack Trees

JULES: Attack trees start with an attacker goal and branch into ways to achieve it.

PARISA: Goal: steal admin account.

Phish admin.

Steal session.

Exploit password reset.

Compromise identity provider.

JULES: Exactly.

PARISA: Then defenses can target multiple branches.

JULES: Defense in depth.


## Risk Ranking

PARISA: We cannot fix everything simultaneously.

JULES: So assess likelihood and impact.

PARISA: Also exposure, exploitability, business importance, existing controls.

JULES: Exactly.

PARISA: Numbers can help prioritization but should not create fake precision.

JULES: Very important.


## Threat Modeling During Design

PARISA: Cheapest time to discover “the public API should not have admin access to the database” is before deployment.

JULES: Exactly.

PARISA: Security design review can change architecture while change is still cheap.

JULES: That’s one reason “shift left” became popular.

PARISA: Though security should not only shift left and abandon production.

JULES: Correct.

PARISA: Shift everywhere.

JULES: Less catchy, more accurate.


## Developer Threat Model Example

PARISA: Browser extension.

JULES: Assets?

PARISA: User snippets. Local storage. Extension permissions. Potential page access.

JULES: Threat actors?

PARISA: Malicious website. Compromised dependency. Malicious extension update. Local attacker.

JULES: Trust boundaries?

PARISA: Extension to webpage. Extension to browser storage. Build pipeline to published package.

JULES: Controls?

PARISA: Minimal permissions. Validate messages. Local storage safety. CSP. Dependency review. Signed store distribution.

JULES: That’s threat modeling.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: Threat model once before launch, save PDF, never update it.

JULES: Please don’t.

PARISA: Architecture changes.

New integrations appear.

Threats change.

JULES: Threat models should evolve with meaningful system changes.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: Threat modeling is security asking architecture questions early.

JULES: Exactly.

PARISA: Not “predict every hacker.”

JULES: No.

PARISA: Understand assets, boundaries, abuse paths, and controls.

JULES: That’s it.


## Security+ Corner

JULES: Know threat modeling, attack surface, risk assessment, secure design, vulnerability categories, and prioritization.

PARISA: Developer depth: OWASP resources are guides, not certification stamps.


## What Did We Actually Learn?

PARISA: OWASP gives developers practical security resources.

JULES: Threat modeling identifies what matters, where trust changes, how abuse could happen, and what controls reduce risk.

PARISA: STRIDE, abuse cases, and attack trees are tools for asking better questions.

JULES: Next: dependencies, supply chains, and secrets.

PARISA: Ah. npm enters cybersecurity.

[MUSIC OUT]
