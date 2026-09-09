# Episode 9: Malware, Ransomware & Other Assholes

Status: Draft

**CAST**

PARISA — Developer who remembers when “computer virus” was the catch-all phrase for everything malicious.

JULES — Developer prepared to explain why malware taxonomy is useful without pretending every malicious program politely stays in one category.


[MUSIC]

PARISA: Virus.

JULES: Maybe.

PARISA: Worm.

JULES: Different.

PARISA: Trojan.

JULES: Different.

PARISA: Ransomware.

JULES: Can overlap.

PARISA: Spyware.

JULES: Also malware.

PARISA: Rootkit.

JULES: Also malware.

PARISA: So “malware” is the big bucket.

JULES: Exactly.

PARISA: And security invented a zoo inside it.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*

I’m Parisa.

JULES: And I’m Jules.

PARISA: Last time humans betrayed us.

JULES: Today software betrays us.

PARISA: Nature is balanced.


## What Is Malware?

JULES: **Malware** is malicious software designed to harm, disrupt, spy, steal, gain unauthorized access, or otherwise act against the interests of the system owner.

PARISA: Intent matters.

JULES: Yes.

PARISA: Buggy software can destroy data accidentally without being malware.

JULES: Correct.

PARISA: Malware is designed for malicious purpose.

JULES: Exactly.


## Virus vs. Worm

PARISA: Classic distinction.

JULES: A **virus** attaches itself to another file or program and spreads when that host is executed or shared.

PARISA: Needs a host.

JULES: Generally, yes.

A **worm** is self-propagating malware that can spread across systems or networks without needing the same kind of user-assisted host execution.

PARISA: Which can make worms spread terrifyingly fast.

JULES: Exactly.

PARISA: WannaCry had worm-like propagation.

JULES: Right. It spread using a Windows SMB vulnerability while also delivering ransomware behavior.


## Trojan

PARISA: Trojan horse.

JULES: Malicious software disguised as something legitimate or desirable.

PARISA: “Free cracked Photoshop.”

JULES: Classic bait.

PARISA: User installs it voluntarily.

JULES: Believing it’s something else.

PARISA: Social engineering plus malware.

JULES: Attack techniques love collaborating.


## Ransomware

JULES: **Ransomware** denies access to systems or data and demands payment.

PARISA: Usually encryption.

JULES: Often.

PARISA: Modern ransomware operations also steal data.

JULES: Very often.

PARISA: So “we have backups” is necessary but not sufficient.

JULES: Exactly.

If attackers exfiltrated sensitive data, restoring files doesn’t undo the confidentiality breach.

PARISA: Double extortion.

JULES: Encrypt your systems and threaten to leak your data.

PARISA: Lovely.


## Spyware and Keyloggers

JULES: **Spyware** monitors users or systems to collect information.

PARISA: Browsing activity. Credentials. Messages.

JULES: Potentially.

A **keylogger** captures keystrokes.

PARISA: Which can steal credentials before encryption even matters.

JULES: Exactly.

PARISA: TLS protects traffic after the application gets the data. If malware is sitting on the endpoint reading what I type, transport encryption is not the control for that problem.

JULES: Scope of control.


## Rootkits

PARISA: Rootkit sounds dramatic.

JULES: A rootkit is designed to maintain privileged access while hiding its presence or the presence of other malware.

PARISA: Deep persistence and stealth.

JULES: Yes.

PARISA: User-mode, kernel-mode, firmware-level possibilities.

JULES: Exactly.

PARISA: Which is why some compromises require rebuilding rather than “delete suspicious.exe.”

JULES: Right.


## Backdoors

JULES: A **backdoor** provides unauthorized or hidden access that bypasses normal controls.

PARISA: Could be deliberately planted by malware.

JULES: Yes.

PARISA: Or malicious developer.

JULES: Yes.

PARISA: Or an undocumented maintenance mechanism that becomes a security risk.

JULES: Correct.


## Bots and Botnets

PARISA: Bot.

JULES: Compromised device under remote control.

PARISA: Botnet.

JULES: Collection of compromised devices controlled together.

PARISA: Used for DDoS, spam, credential attacks, malware distribution.

JULES: And more.

PARISA: Which is why attackers may compromise my boring server even if they don’t care about my data.

JULES: Compute and network access have value.


## Cryptojacking

PARISA: Mine cryptocurrency on someone else’s machine.

JULES: **Cryptojacking** uses victim computing resources without authorization.

PARISA: Availability and cost problem.

JULES: Exactly.

PARISA: Cloud bill becomes incident indicator.

JULES: Sometimes very dramatically.


## Fileless Malware

PARISA: “Fileless” sounds like marketing.

JULES: It can be overused, but the concept is real.

Some attacks rely heavily on memory, scripts, built-in system tools, or legitimate interpreters instead of dropping a traditional executable file to disk.

PARISA: PowerShell.

JULES: Commonly abused example.

PARISA: Living off the land.

JULES: Use legitimate system tools for malicious purposes.

PARISA: Which complicates detection because the tool itself is legitimate.

JULES: Exactly.


## Persistence

PARISA: Attacker gets execution once.

JULES: Often they want **persistence**.

PARISA: Survive reboot.

Come back later.

JULES: Startup entries, scheduled tasks, services, modified accounts, stolen tokens, web shells, cloud access keys.

PARISA: Persistence is broader than “install malware.”

JULES: Very.


## Command and Control

JULES: Malware may contact **command-and-control**, C2, infrastructure.

PARISA: Get instructions.

Upload stolen data.

Download more payloads.

JULES: Exactly.

PARISA: Which is why outbound network monitoring matters.

JULES: Episode two sends its regards.


## Indicators of Compromise

PARISA: How do we know malware is there?

JULES: **Indicators of compromise**, IOCs, are observable artifacts associated with malicious activity.

PARISA: File hashes.

IP addresses.

Domains.

Registry changes.

Processes.

JULES: Exactly.

PARISA: But attacker infrastructure changes.

JULES: Constantly.

PARISA: So behavioral detection can be stronger than only matching known indicators.

JULES: Right.


## EDR and Antivirus

PARISA: Antivirus.

JULES: Traditional antivirus heavily relied on signatures, though modern endpoint security does more.

PARISA: EDR.

JULES: **Endpoint Detection and Response** monitors endpoint activity, detects suspicious behavior, supports investigation, and can respond.

PARISA: Kill process.

Isolate machine.

Collect telemetry.

JULES: Exactly.

PARISA: Not magic.

JULES: Never magic.


## Backups and Ransomware

PARISA: Backups.

JULES: Essential.

PARISA: Offline or immutable copies.

JULES: Very important.

PARISA: Test restores.

JULES: Absolutely.

PARISA: Because a backup you have never successfully restored is a belief.

JULES: That sentence can stay.

PARISA: Attackers may target backup infrastructure too.

JULES: Yes. Backups must be protected separately.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: “We have antivirus, so users can run whatever they want.”

JULES: Please don’t do this.

PARISA: “Backups mean ransomware is solved.”

JULES: No.

PARISA: “This malware sample is probably safe if I open it in a VM connected to my normal network.”

JULES: Absolutely not.

PARISA: Malware analysis requires proper isolation.

JULES: Thank you.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: Malware names describe behavior.

JULES: Usually.

PARISA: Worm tells me how it spreads.

Trojan tells me how it arrives.

Ransomware tells me the monetization or impact.

Spyware tells me the goal.

Rootkit tells me stealth and persistence.

JULES: And one sample can have several behaviors.

PARISA: So taxonomy is useful but not exclusive species classification.

JULES: Exactly.


## Security+ Corner

JULES: Know viruses, worms, Trojans, ransomware, spyware, keyloggers, rootkits, backdoors, bots, botnets, cryptojacking, fileless malware, command and control, persistence, and common indicators.

PARISA: Know endpoint controls and backup strategy.

JULES: And understand that prevention, detection, response, and recovery all matter.


## What Did We Actually Learn?

PARISA: Malware is malicious software.

JULES: Different categories describe different propagation methods, goals, or behaviors.

PARISA: Ransomware is not merely an encryption problem because modern operations often steal data too.

JULES: Endpoint security, network controls, least privilege, patching, backups, and monitoring work together.

PARISA: And if you have never tested restoring the backup—

JULES: It is a belief.

PARISA: I really like that.

[MUSIC OUT]
