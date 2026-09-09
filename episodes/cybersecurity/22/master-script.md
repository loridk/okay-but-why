# Episode 22: Business Continuity & Disaster Recovery — The Building Is Gone, Now What?

Status: Draft

**CAST**

PARISA — Developer who has learned that “we have backups” is not a recovery plan until someone proves the backups restore.

JULES — Developer explaining resilience, RTO, RPO, disaster recovery sites, and why security includes surviving boring disasters too.


[MUSIC]

PARISA: Data center is underwater.

JULES: Bad.

PARISA: But no hacker.

JULES: Still security.

PARISA: Availability.

JULES: Exactly.

[MUSIC STING]


## Business Continuity vs. Disaster Recovery

JULES: **Business continuity** is broader: how essential business functions continue during disruption.

PARISA: **Disaster recovery** focuses more specifically on restoring technology and data after major disruption.

JULES: Exactly.


## Business Impact Analysis

PARISA: BIA.

JULES: Identify critical processes and consequences of downtime.

PARISA: Payroll can be down how long?

Checkout?

Email?

Hospital records?

JULES: Different systems have different criticality.


## RTO

PARISA: Recovery Time Objective.

JULES: Target maximum time to restore a service after disruption.

PARISA: “We need this system back within four hours.”

JULES: Exactly.


## RPO

PARISA: Recovery Point Objective.

JULES: Maximum acceptable data loss measured in time.

PARISA: RPO fifteen minutes means backups or replication should let us lose no more than roughly fifteen minutes of data.

JULES: That’s the target.


## MTTR and MTBF

PARISA: Mean Time to Repair.

JULES: How long restoration takes on average.

PARISA: Mean Time Between Failures.

JULES: Reliability measure for repairable systems.

PARISA: Security+ loves operational math-adjacent acronyms.

JULES: It does.


## Backup Types

PARISA: Full.

JULES: Everything selected.

PARISA: Incremental.

JULES: Changes since last backup of any type.

PARISA: Differential.

JULES: Changes since last full backup.

PARISA: Restore complexity differs.

JULES: Exactly.


## 3-2-1

PARISA: Three copies.

Two media types.

One offsite.

JULES: Common backup rule of thumb.

PARISA: Modern ransomware adds immutable/offline consideration.

JULES: Yes.


## Hot, Warm, Cold Sites

PARISA: Hot site nearly ready to take over.

JULES: Fast recovery, expensive.

PARISA: Warm site partially equipped.

JULES: Middle ground.

PARISA: Cold site provides facility/infrastructure basics but needs more setup.

JULES: Slowest, cheaper.

PARISA: Cost versus recovery speed.


## High Availability vs. Disaster Recovery

PARISA: Multi-zone database may handle local hardware failure.

JULES: High availability.

PARISA: Does not necessarily protect against accidental deletion replicated everywhere.

JULES: Correct.

PARISA: Backups and DR solve different failure modes.

JULES: Exactly.


## Failover

PARISA: Primary dies, secondary takes over.

JULES: Failover.

PARISA: Automatic failover is convenient but must avoid split-brain or cascading problems.

JULES: Yes.


## Testing

PARISA: Tabletop.

Simulation.

Parallel test.

Full interruption if organization can safely do it.

JULES: Recovery plans need testing.

PARISA: Otherwise we have hope with a binder.

JULES: Great phrase.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: Back up database to another folder on the same disk.

JULES: Please don’t call that sufficient.

PARISA: Never test restore.

JULES: Please don’t.

PARISA: Replicate corrupted data everywhere and call it backup.

JULES: Replication is not necessarily backup.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: RTO asks “How long can we be down?”

JULES: Yep.

PARISA: RPO asks “How much data can we afford to lose?”

JULES: Exactly.

PARISA: Those business decisions drive technical architecture.

JULES: That’s the point.


## Security+ Corner

JULES: Know BIA, RTO, RPO, backup types, testing, hot/warm/cold sites, failover, redundancy, high availability, recovery planning, and continuity.

PARISA: Next: secure development and DevSecOps.

[MUSIC OUT]
