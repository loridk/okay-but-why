# Episode 8: Social Engineering & Credential Attacks — Hacking the Squishy Humans

Status: Draft

**CAST**

PARISA — Experienced developer who knows that the most sophisticated security system in the world can still be defeated by a convincing email sent at 4:58 PM.

JULES — Developer who would like everyone to stop treating phishing victims as idiots and start treating social engineering as an adversarial design problem.


[MUSIC]

PARISA: “Hi Parisa, this is the CEO. I’m in a meeting and I need you to buy twelve hundred dollars in Apple gift cards.”

JULES: Seems legitimate.

PARISA: “Also send me the codes immediately and do not call me because this is confidential.”

JULES: Definitely the CEO.

PARISA: The CEO has never spoken to me in my life.

JULES: Details.

PARISA: Social engineering.

JULES: Hacking the squishy humans.

PARISA: I object to “squishy.”

JULES: Biologically accurate.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*

I’m Parisa.

JULES: And I’m Jules.

PARISA: We have spent seven episodes talking about networks, identity, permissions, cryptography, certificates—

JULES: And now the attacker says, “What if I just ask nicely?”

PARISA: That feels unfair.

JULES: Security is not graded on elegance.


## Who Asked for Social Engineering?

JULES: Technical controls create friction for attackers.

PARISA: Strong passwords. MFA. Encryption. Firewalls.

JULES: So attackers look for another path.

PARISA: Humans with legitimate access.

JULES: Exactly.

Social engineering manipulates people into doing something that benefits the attacker.

PARISA: Reveal information.

Approve a login.

Open a file.

Visit a site.

Reset an account.

Change payment details.

JULES: Or simply trust the wrong person.

PARISA: This is not “people are stupid.”

JULES: Very important.

Good social engineering exploits ordinary human behavior: urgency, authority, curiosity, fear, helpfulness, routine, distraction.

PARISA: In other words, being a normal person with a job.


## Phishing

JULES: **Phishing** is fraudulent messaging designed to trick people into revealing information or taking unsafe actions.

PARISA: Usually email in the classic version.

JULES: But the principle isn’t limited to email.

PARISA: Fake Microsoft login page.

Fake shipping notice.

Fake password-expiration warning.

JULES: Exactly.

PARISA: And **spear phishing** is targeted.

JULES: Yes.

Instead of sending the same message to a million people, the attacker researches a person or organization and makes the message more convincing.

PARISA: “Hey Parisa, here’s the Figma file for the Miles project.”

JULES: Much more believable than “Dear Valuable Customer.”

PARISA: Which is why public information can be reconnaissance fuel.

JULES: LinkedIn, company websites, social media, conference talks, breach data.


## Whaling, Smishing, Vishing

PARISA: Security loves naming every delivery mechanism.

JULES: **Whaling** targets executives or other high-value people.

PARISA: Big fish.

JULES: Yep.

**Smishing** is phishing by SMS.

**Vishing** is voice phishing.

PARISA: And QR-code phishing exists because apparently the square can betray us too.

JULES: “Quishing” is a term you’ll hear for malicious QR-code phishing.

PARISA: Cybersecurity naming is unstoppable.


## Pretexting

JULES: **Pretexting** means creating a believable story or identity to manipulate someone.

PARISA: “I’m from IT. We’re troubleshooting your account.”

JULES: Exactly.

PARISA: “I’m the new contractor and my manager said you could give me access.”

JULES: Yep.

PARISA: “I’m calling from the bank fraud department.”

JULES: Right.

The attacker establishes a context that makes the request seem reasonable.

PARISA: Humans interpret requests through context.

JULES: And attackers manufacture the context.


## Authority and Urgency

PARISA: Why does “CEO needs this now” work so well?

JULES: Authority plus urgency.

People are less likely to stop and verify when they believe a powerful person expects immediate action.

PARISA: Add secrecy.

JULES: “Don’t tell anyone.”

PARISA: Add fear.

JULES: “Your account will be suspended.”

PARISA: Add scarcity.

JULES: “This expires in ten minutes.”

PARISA: This is basically evil UX writing.

JULES: Honestly, yes.


## Business Email Compromise

PARISA: BEC.

JULES: **Business Email Compromise** involves abusing or impersonating business communication to cause fraudulent actions.

PARISA: Change wire-transfer destination.

JULES: Classic example.

PARISA: Fake vendor invoice.

JULES: Yep.

PARISA: Compromised executive mailbox asks finance to send money.

JULES: Exactly.

PARISA: Sometimes the email account is truly compromised rather than spoofed.

JULES: Which makes the message dramatically harder to detect.

PARISA: Same email thread. Same signature. Legitimate account.

JULES: Exactly.


## MFA Fatigue

PARISA: We mentioned push fatigue last episode.

JULES: Attacker has the password and repeatedly triggers MFA prompts.

PARISA: User sees “Approve sign-in?” over and over.

JULES: Eventually they may approve one just to make it stop.

PARISA: Which is why number matching and phishing-resistant MFA are improvements.

JULES: Right.

PARISA: And why “we have MFA” is not the end of authentication security.

JULES: Exactly.


## Help Desk Attacks

PARISA: I think help desks deserve sympathy here.

JULES: Absolutely.

Their job is literally to help people regain access.

PARISA: Which means attackers can impersonate locked-out employees and manipulate support into resetting credentials or MFA.

JULES: Right.

PARISA: If recovery is weaker than login, recovery becomes the attack path.

JULES: We said it last episode and it keeps being true.


## Tailgating and Physical Social Engineering

JULES: Social engineering can be physical too.

PARISA: **Tailgating**: follow an authorized person through a secure door.

JULES: Exactly.

PARISA: Carry a stack of boxes and people hold doors for you.

JULES: Humans are helpful.

PARISA: Security: please stop being kind.

JULES: More like: design controls that don’t rely on people violating normal social behavior.

PARISA: Better framing.


## Baiting

JULES: **Baiting** offers something enticing.

PARISA: USB drive labeled “Layoff Plan.”

JULES: You know exactly what humans are going to do.

PARISA: Plug it into a computer while whispering “I’m only checking.”

JULES: And now we have malware.

PARISA: Please do not make curiosity part of your incident response plan.


## Credential Harvesting

JULES: Many phishing campaigns are specifically designed to steal credentials.

PARISA: Fake login page.

JULES: User types username, password, maybe MFA code.

PARISA: Attacker forwards them to the real site in real time.

JULES: Exactly.

PARISA: Which means OTP MFA can still be phished.

JULES: Yes.

PARISA: Again, phishing-resistant cryptographic authentication is better because the fake domain can’t just reuse the credential.

JULES: Right.


## Typosquatting and Lookalike Domains

PARISA: `micros0ft-login.example`.

JULES: Lookalike domain.

PARISA: Unicode characters that resemble other letters.

JULES: Homograph attacks.

PARISA: Typosquatting catches common misspellings.

JULES: Exactly.

PARISA: Which is why “look at the URL” is useful but not a complete anti-phishing strategy.

JULES: Correct.

Attackers are very good at making URLs visually plausible.


## Deepfakes and AI

PARISA: We need the 2026 version.

JULES: AI makes impersonation cheaper and more convincing.

PARISA: Voice cloning.

Synthetic video.

Personalized phishing copy.

JULES: Exactly.

PARISA: But the defense is still not “become a human lie detector.”

JULES: Right.

Use verification processes that don’t depend only on whether a message sounds like the person.

PARISA: Call back on a known number.

Use an established approval workflow.

Require multiple approvers for high-risk financial changes.

JULES: Strong process beats vibes.


## Security Awareness Training That Doesn’t Suck

PARISA: Annual training where the cartoon hacker says “Don’t click suspicious links.”

JULES: Not enough.

PARISA: People need realistic, contextual training.

JULES: And reporting needs to be safe and easy.

PARISA: If someone thinks they clicked phishing, we want them to tell security immediately.

JULES: Not hide it because they’re afraid of being humiliated.

PARISA: Blaming victims makes detection slower.

JULES: Exactly.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: “Only idiots fall for phishing.”

JULES: Please don’t do this.

PARISA: Attackers test messages professionally.

They exploit timing, trust, authority, and context.

JULES: And even experts get tired, rushed, distracted, or unlucky.

PARISA: Build systems assuming humans occasionally make mistakes.

JULES: Defense in depth, but for people.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: Social engineering is basically adversarial product design.

JULES: That’s a strong way to frame it.

PARISA: Attacker studies the user.

Creates a believable flow.

Removes friction.

Adds urgency.

Designs a conversion funnel.

JULES: Except the conversion event is “steal your account.”

PARISA: Evil growth hacking.

JULES: Please never say that in a pitch deck.

PARISA: No promises.


## Security+ Corner

JULES: Recognize phishing, spear phishing, whaling, smishing, vishing, pretexting, baiting, impersonation, tailgating, business email compromise, credential harvesting, typosquatting, and MFA fatigue.

PARISA: More importantly, understand the human mechanism.

JULES: Authority, urgency, fear, curiosity, familiarity, trust.

PARISA: And controls can be technical, procedural, and cultural.

JULES: Exactly.


## What Did We Actually Learn?

PARISA: Social engineering attacks legitimate human behavior.

JULES: Phishing is broad. Spear phishing is targeted. Smishing uses SMS. Vishing uses voice.

PARISA: Pretexting manufactures a believable scenario.

BEC abuses trusted business communication.

JULES: MFA can still be attacked through fatigue, phishing, and recovery flows.

PARISA: Strong verification procedures matter more as AI-generated impersonation improves.

JULES: And reporting culture matters because rapid detection limits damage.

PARISA: Next?

JULES: Malware and ransomware.

PARISA: Great. The humans clicked the thing and now the computers are haunted.

[MUSIC OUT]
