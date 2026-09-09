# Episode 17: Vulnerabilities, CVEs & Pentesting — How Broken Is It?

Status: Draft

**CAST**

PARISA — Developer who has seen vulnerability scanners produce emotionally aggressive dashboards and wants context, not just red numbers.

JULES — Developer explaining how vulnerability management, pentesting, CVEs, CVSS, and remediation fit together.


[MUSIC]

PARISA: Critical. Critical. High. High. Critical.

JULES: Scanner results?

PARISA: My emotional state after scanner results.

JULES: Fair.

[MUSIC STING]


## Vulnerability Management Is a Process

JULES: Finding vulnerabilities is only the first step.

PARISA: Discover.

Validate.

Prioritize.

Remediate.

Verify.

JULES: Exactly.

PARISA: Then repeat forever.

JULES: Security has subscriptions.


## CVE

JULES: **Common Vulnerabilities and Exposures**, CVE, gives publicly disclosed vulnerabilities standardized identifiers.

PARISA: `CVE-year-number`.

JULES: Right.

PARISA: CVE is identity, not severity.

JULES: Exactly.


## CVSS

PARISA: **Common Vulnerability Scoring System**.

JULES: Gives standardized severity metrics.

PARISA: Attack vector, complexity, privileges, user interaction, impact.

JULES: Depending on CVSS version, yes.

PARISA: Useful starting point, not business risk.

JULES: Correct.

PARISA: CVSS 9.8 on unreachable lab server may be less urgent than lower-scored bug exposed in our critical production flow.

JULES: Context matters.


## Known Exploited Vulnerabilities

PARISA: Whether attackers are actively exploiting something matters.

JULES: A lot.

PARISA: CISA’s Known Exploited Vulnerabilities catalog is an example of prioritization based on observed exploitation.

JULES: Exactly.

PARISA: Exploit availability changes urgency.

JULES: Yes.


## Vulnerability Scanners

JULES: Scanners automate discovery.

PARISA: Network scanners.

Web app scanners.

Dependency scanners.

Cloud configuration scanners.

JULES: They’re useful, but can produce false positives and false negatives.

PARISA: Scanner finding needs validation.

JULES: Exactly.


## SAST, DAST, IAST

PARISA: Alphabet soup.

JULES: **SAST** analyzes source or compiled code without executing the application.

PARISA: Static.

JULES: **DAST** tests a running application from the outside.

PARISA: Dynamic.

JULES: **IAST** instruments or observes the running application with internal context.

PARISA: Different visibility.

JULES: Different strengths.


## Pentesting

PARISA: Penetration testing is not “run scanner, export PDF.”

JULES: Correct.

A pentest is an authorized attempt to exploit weaknesses and demonstrate realistic impact.

PARISA: Scope matters.

JULES: Enormously.

PARISA: What systems?

What dates?

What techniques?

Can we social-engineer?

Can we disrupt service?

JULES: Rules of engagement.


## Red Team vs. Pentest

PARISA: Same thing?

JULES: Not necessarily.

Pentests often focus on finding and exploiting vulnerabilities in a defined scope.

Red-team exercises more broadly emulate adversary objectives and test detection and response.

PARISA: “Can we get domain admin without being caught?” versus “What vulnerabilities exist in this app?”

JULES: Simplified, but useful.


## Responsible Disclosure

PARISA: Researcher finds bug in someone else’s system.

JULES: Follow authorized disclosure channels.

PARISA: Bug bounty if available.

Security contact.

Coordinated disclosure.

JULES: Don’t exceed authorization because you think you’re helping.

PARISA: Legal boundaries matter.


## Remediation

JULES: Fix root cause where possible.

PARISA: Patch.

Configuration change.

Remove service.

Reduce permission.

Network mitigation.

JULES: Sometimes compensating controls buy time.

PARISA: WAF rule while code fix is developed.

JULES: Exactly.

PARISA: Then retest.

JULES: Because “developer says fixed” is not verification.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: Sort scanner output only by red color and panic.

JULES: Please prioritize by context.

PARISA: Pentest systems you don’t own without permission.

JULES: Absolutely not.

PARISA: Patch the vulnerable package but leave the compromised server untouched.

JULES: Incident response may still be required.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: Vulnerability management is risk triage plus engineering.

JULES: Exactly.

PARISA: CVE names the issue.

CVSS describes technical severity.

Environment tells us actual priority.

JULES: Yes.

PARISA: Pentesting shows how weaknesses combine in reality.

JULES: Exactly.


## Security+ Corner

JULES: Know CVEs, CVSS, scanning, false positives/negatives, SAST, DAST, pentesting, rules of engagement, remediation, compensating controls, and verification.

PARISA: Next: secure architecture and cloud security.

[MUSIC OUT]
