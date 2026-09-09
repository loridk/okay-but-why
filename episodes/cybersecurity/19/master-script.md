# Episode 19: Security Operations — Who Watches the Logs?

Status: Draft

**CAST**

PARISA — Developer who has written logs mostly to debug why the application is mad.

JULES — Developer explaining how logs become security telemetry and why a SOC is not merely people staring at green dashboards in a dark room.


[MUSIC]

PARISA: `console.log("got here")`.

JULES: Security telemetry.

PARISA: Do not disrespect my craft.

JULES: Your log says “got here” with no timestamp, request ID, user, or context.

PARISA: It told me what I needed at the time.

JULES: Security would like more.

[MUSIC STING]


## What Is a SOC?

JULES: **Security Operations Center** is the people, processes, and technologies used to monitor, detect, investigate, and respond to security events.

PARISA: Not necessarily one physical room.

JULES: Correct.

PARISA: SOC analysts triage alerts.

JULES: Investigate suspicious behavior, coordinate response, tune detections, escalate incidents.


## Logs Become Evidence

PARISA: Authentication logs.

JULES: Who logged in, from where, success or failure.

PARISA: Application logs.

JULES: Sensitive actions, errors, access patterns.

PARISA: Network logs.

JULES: Connections, firewall decisions, DNS, proxy activity.

PARISA: Endpoint telemetry.

JULES: Processes, file changes, suspicious behaviors.


## SIEM

PARISA: Security Information and Event Management.

JULES: **SIEM** collects and correlates logs from many systems.

PARISA: Search across them.

Create detections.

Dashboards.

Alerts.

JULES: Exactly.

PARISA: “User logged into VPN from Detroit, then five minutes later admin login appears from another country.”

JULES: Correlation creates meaning.


## Good Logging

PARISA: What should developers log?

JULES: Events useful for operations and security without unnecessarily capturing sensitive data.

PARISA: Authentication attempts.

Privilege changes.

Sensitive administrative actions.

Access-denied events.

JULES: Important application state changes, validation failures where useful.

PARISA: But not passwords, tokens, full credit-card numbers.

JULES: Correct.


## Time Synchronization

PARISA: NTP episode-two callback.

JULES: Logs from systems with wrong clocks are painful.

PARISA: Incident timeline becomes surreal.

JULES: Exactly.


## IDS, IPS, EDR, NDR

PARISA: We know IDS and IPS.

JULES: EDR watches endpoints.

NDR—Network Detection and Response—focuses on network behavior.

PARISA: Different sensors.

JULES: Exactly.


## SOAR

PARISA: Security Orchestration, Automation, and Response.

JULES: **SOAR** automates workflows across security tools.

PARISA: Alert fires.

Look up IP reputation.

Disable account.

Open ticket.

Notify analyst.

JULES: Depending on confidence and policy.

PARISA: Automation can make mistakes faster.

JULES: Which is why high-impact actions need careful controls.


## Threat Intelligence

PARISA: Threat intelligence is not a giant list of evil IP addresses.

JULES: Correct.

It can include attacker behavior, infrastructure, campaigns, vulnerabilities, industry targeting, tactics and techniques.

PARISA: Strategic, operational, tactical.

JULES: Exactly.


## IOC vs. Behavior

PARISA: Hash of known malware is an IOC.

JULES: Yes.

PARISA: “Office application launches PowerShell and downloads executable” is behavior.

JULES: Right.

PARISA: Behavior may survive simple attacker changes better than exact hashes.

JULES: Exactly.


## False Positives

PARISA: Alert says malicious.

Actually normal.

JULES: False positive.

PARISA: Alert says nothing.

Actually malicious.

JULES: False negative.

PARISA: Tuning detections is balancing both.

JULES: Yes.


## Baselines

PARISA: To know abnormal, understand normal.

JULES: Baselines.

PARISA: Typical login times.

Traffic.

Processes.

API volume.

JULES: Deviations can become signals, though anomaly does not automatically equal malicious.


## Alert Fatigue

PARISA: Thousands of low-quality alerts.

JULES: Analysts stop trusting alerts.

PARISA: Same problem as browser warnings people click through.

JULES: Security controls need usable signal.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: Log every Authorization header.

JULES: Please don’t.

PARISA: Send secrets into third-party logging system.

JULES: Please don’t.

PARISA: Build alert that fires every minute and never tune it.

JULES: Alert fatigue is a security problem.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: Security operations turns ordinary system behavior into evidence.

JULES: Exactly.

PARISA: Logs let us detect patterns no single machine understands alone.

JULES: And reconstruct what happened when prevention fails.


## Security+ Corner

JULES: Know SOC, SIEM, SOAR, IDS/IPS, EDR, log sources, threat intelligence, IOC, baselines, alert tuning, time synchronization, and monitoring.

PARISA: Next: incident response.

[MUSIC OUT]
