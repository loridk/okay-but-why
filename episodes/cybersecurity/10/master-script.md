# Episode 10: How Attacks Actually Happen — From Recon to “Oh Shit”

Status: Draft

**CAST**

PARISA — Developer who has seen security incidents discussed as isolated vulnerabilities and wants to understand how attackers chain small wins into a larger compromise.

JULES — Developer who is going to explain attack lifecycles without pretending every attacker follows a neat PowerPoint diagram.


[MUSIC]

PARISA: So the attacker finds a vulnerability and hacks the company.

JULES: Sometimes.

PARISA: That sentence felt suspiciously short.

JULES: Because real attacks are often chains.

PARISA: One thing leads to another.

JULES: Reconnaissance.

Initial access.

Execution.

Persistence.

Privilege escalation.

Credential access.

Discovery.

Lateral movement.

Exfiltration.

Impact.

PARISA: There’s the PowerPoint.

JULES: I promise reality is messier.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*

I’m Parisa.

JULES: And I’m Jules.

PARISA: Today we’re connecting the pieces.

Not just “what is phishing?”

Not just “what is a vulnerability?”

What does an actual attack progression look like?

JULES: Exactly.


## Attack Chains, Not Magic Exploits

JULES: Security news often compresses incidents into one sentence.

“Attackers exploited a vulnerability.”

PARISA: Which makes it sound like one button labeled HACK.

JULES: In reality, compromise often requires several steps.

PARISA: Find target.

Get foothold.

Gain more privileges.

Find valuable systems.

Move.

Steal or damage something.

JULES: Exactly.


## Reconnaissance

PARISA: First: learn about the target.

JULES: **Reconnaissance** can be passive or active.

PARISA: Passive: public information without directly probing the target.

JULES: Company websites, job listings, DNS records, leaked credentials, social media, public repositories.

PARISA: Job listing says “we use Okta, AWS, Kubernetes, GitHub Actions.”

JULES: Useful technology inventory.

PARISA: Active recon actually touches systems.

JULES: Port scanning, service enumeration, probing web applications.

PARISA: Which should only be done with authorization.

JULES: Correct.


## Initial Access

JULES: Next: get in.

PARISA: Phishing.

JULES: Common.

PARISA: Stolen credentials.

JULES: Yes.

PARISA: Exploit exposed vulnerability.

JULES: Yes.

PARISA: Compromised vendor.

JULES: Supply-chain route.

PARISA: Misconfigured cloud service.

JULES: Also common.

PARISA: So initial access can be technical or human.

JULES: Exactly.


## Execution

PARISA: Having credentials is not always the same as running code.

JULES: Right.

**Execution** means getting malicious commands or code to run.

PARISA: Malware attachment.

Remote command execution vulnerability.

Malicious script.

JULES: Exactly.


## Persistence

PARISA: We did this in malware.

JULES: Attackers often want a way back in.

PARISA: Create account.

Steal refresh token.

Install service.

Scheduled task.

Web shell.

JULES: Cloud access key.

SSH key.

OAuth application consent.

PARISA: Modern persistence can be identity persistence.

JULES: Very important.


## Privilege Escalation

PARISA: Initial foothold might be low privilege.

JULES: So attacker tries to gain more.

PARISA: Exploit local vulnerability.

Misconfigured sudo.

Over-permissive cloud IAM.

Stored admin credentials.

JULES: Exactly.

PARISA: Vertical escalation.


## Credential Access

JULES: Attackers love credentials because legitimate credentials blend in.

PARISA: Dump password hashes.

Steal browser tokens.

Read secrets from environment variables.

JULES: Search config files.

Query cloud metadata if exposed.

PARISA: And once they have credentials, controls may think they are legitimate.

JULES: Identity attacks are powerful.


## Discovery

PARISA: “Where am I and what else exists?”

JULES: Exactly.

Enumerate users.

Groups.

Hosts.

Cloud accounts.

Network connections.

Running services.

Security tools.

PARISA: This is the internal version of reconnaissance.

JULES: Good mental model.


## Lateral Movement

PARISA: Move from first compromised system to another.

JULES: Right.

Use stolen credentials, remote administration tools, shared services, trust relationships.

PARISA: Which is why segmentation matters.

JULES: Yes.

PARISA: And least privilege.

JULES: Yes.

PARISA: And separate admin accounts.

JULES: Yes.

PARISA: Security episodes are becoming callbacks.

JULES: Because controls are layered.


## Collection and Exfiltration

PARISA: Find valuable data.

JULES: **Collection** gathers it.

**Exfiltration** moves it out.

PARISA: Could be over HTTPS, cloud storage, DNS tunneling, email—

JULES: Many channels.

PARISA: So outbound monitoring matters.

JULES: Again.


## Impact

PARISA: Ransomware.

JULES: Destruction.

Service disruption.

Fraud.

Data manipulation.

PARISA: Sometimes attackers just steal information and leave quietly.

JULES: Right.

Not every compromise ends with a dramatic ransom note.


## Cyber Kill Chain vs. MITRE ATT&CK

PARISA: Framework names.

JULES: Lockheed Martin’s Cyber Kill Chain describes broad attack stages.

MITRE ATT&CK is a much larger knowledge base of adversary tactics and techniques observed in real operations.

PARISA: ATT&CK is not a checklist every attacker follows.

JULES: Correct.

PARISA: It’s a common language for describing behavior.

JULES: Exactly.

PARISA: Useful for detections, threat modeling, incident analysis.

JULES: Yes.


## Tactics vs. Techniques

PARISA: In ATT&CK, tactic is the goal.

JULES: Like credential access or persistence.

PARISA: Technique is how the attacker accomplishes it.

JULES: Exactly.

PARISA: More useful than calling everything “advanced hacking.”

JULES: Much.


## Attack Paths and Chaining Weaknesses

PARISA: I think this is the important developer bit.

One “medium” vulnerability can become serious when chained.

JULES: Exactly.

Maybe an information leak reveals a username.

A weak password gets the account.

That account has excessive permissions.

A service account secret is stored in a readable file.

That secret reaches production.

PARISA: No single step necessarily looked catastrophic.

JULES: Together, catastrophic.

PARISA: Which is why risk needs context.

JULES: Episode one sends its regards.


## Detect at Multiple Stages

PARISA: Defense in depth means we have opportunities to catch the attacker at several stages.

JULES: Exactly.

Phishing filter at initial access.

EDR at execution.

Identity alerts at suspicious authentication.

Segmentation at lateral movement.

DLP or network monitoring at exfiltration.

Backups and recovery at impact.

PARISA: One missed control does not have to mean game over.

JULES: That’s the whole point.


## Purple Team Thinking

PARISA: Red team attacks. Blue team defends.

JULES: Purple teaming emphasizes collaboration between offensive and defensive perspectives.

PARISA: “Here’s how we got in.”

“Great, how would we detect that?”

JULES: Exactly.

PARISA: Much more useful than security theater where everyone guards their cleverness.

JULES: Shared learning improves defenses.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: “We patched the vulnerability, incident over.”

JULES: Please don’t do this.

PARISA: If an attacker exploited it before the patch, they may have persistence.

JULES: Exactly.

PARISA: You need to determine scope, credentials touched, systems reached, data accessed.

JULES: Remediation is more than closing the original door.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: An attack lifecycle is not “here is the recipe attackers follow.”

JULES: Right.

PARISA: It’s a way to reason about attacker goals and opportunities.

JULES: Exactly.

PARISA: And defenses can interrupt the chain at multiple points.

JULES: Which is why telemetry and layered controls matter.


## Security+ Corner

JULES: Know reconnaissance, initial access, execution, persistence, privilege escalation, credential access, discovery, lateral movement, collection, exfiltration, command and control, and impact as concepts.

PARISA: Recognize threat frameworks and attack-chain thinking.

JULES: And understand that techniques combine.


## What Did We Actually Learn?

PARISA: Real compromises are usually sequences, not magic one-shot hacks.

JULES: Attackers learn, enter, execute, persist, escalate, discover, move, collect, exfiltrate, and create impact in varying orders.

PARISA: MITRE ATT&CK gives defenders common language for adversary behavior.

JULES: And layered controls give us many chances to interrupt the chain.

PARISA: Next time?

JULES: XSS.

PARISA: Finally. Someone put JavaScript in my JavaScript.

[MUSIC OUT]
