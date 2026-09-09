# Episode 5: Authorization & IAM — Are You Allowed to Do That?

Status: Draft

**CAST**

PARISA — Experienced web developer who has implemented enough roles, admin screens, and “only show this button if…” logic to know that UI hiding is not authorization.

JULES — Gen Z developer who entered the industry after “identity” became a product category, a cloud service, and somehow also a meeting.


[MUSIC]

PARISA: I’m logged in.

JULES: Great.

PARISA: So I can delete the database.

JULES: No.

PARISA: But I authenticated.

JULES: You proved who you are.

PARISA: And I am me.

JULES: Congratulations.

PARISA: Therefore—

JULES: Authentication answers “Who are you?”

Authorization answers “What are you allowed to do?”

PARISA: Fine.

So the computer believes I’m Parisa.

Now it needs to establish whether Parisa should have a giant red “DELETE PRODUCTION” button.

JULES: Preferably no.

PARISA: Rude.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*

I’m Parisa.

JULES: And I’m Jules.

PARISA: Last time we talked authentication.

Passwords.

MFA.

Passkeys.

Biometrics.

Identity providers.

JULES: Today we do the thing that comes immediately after successful authentication.

PARISA: Boundaries.

JULES: Exactly.

PARISA: Which is where an alarming amount of application security quietly dies.


## Authentication Is Not Authorization

JULES: Let’s use a boring example because boring examples are useful.

You log into an online store.

PARISA: The system proves I’m my account.

JULES: Authentication.

PARISA: Then I can see my own orders.

JULES: Authorization.

PARISA: I cannot see your orders.

JULES: Authorization.

PARISA: I cannot refund my own purchase by manually changing a URL parameter to `/admin/refund/123`.

JULES: Extremely authorization.

PARISA: And if I can?

JULES: Broken access control.

PARISA: Which OWASP has been yelling about for years.

JULES: Because developers often protect the visible interface but forget to protect the actual operation.

PARISA: So hiding the admin link does nothing if the endpoint underneath accepts the request.

JULES: Correct.

PARISA: CSS is not a security boundary.

JULES: Put it on a shirt.


## Who Asked for IAM?

PARISA: IAM.

Identity and Access Management.

It sounds enterprise.

JULES: It can be, but the problem exists everywhere.

Who are the users?

How are identities created?

What systems know about them?

What are they allowed to access?

How does access change when their job changes?

What happens when they leave?

How do service accounts work?

Who approves privileged access?

PARISA: That’s a lot more than “roles table.”

JULES: Exactly.

IAM is the discipline and tooling around managing identities and their access across systems.

PARISA: So identity lifecycle plus authorization policy.

JULES: That’s a good mental model.


## Least Privilege, Again

PARISA: Least privilege keeps following us.

JULES: It’s one of the most reusable security principles.

PARISA: Give people and systems only the permissions they need.

JULES: And ideally only for as long as they need them.

PARISA: So a developer who needs temporary production access shouldn’t necessarily have permanent production admin forever.

JULES: Exactly.

PARISA: A service account that only reads one storage bucket shouldn’t have global administrator rights.

JULES: Yes.

PARISA: And my marketing intern probably doesn’t need Kubernetes cluster-admin.

JULES: Unless your marketing strategy is terrifying.


## RBAC: Roles as Bundles of Permissions

JULES: A common model is **Role-Based Access Control**, RBAC.

PARISA: Assign permissions to roles, then assign users to roles.

JULES: Exactly.

PARISA: Instead of individually configuring every permission for every person.

JULES: Right.

A help-desk role might reset passwords.

A billing role might view invoices.

An administrator role might manage users.

PARISA: And one user can sometimes have multiple roles.

JULES: Yes.

PARISA: This maps very naturally to web apps.

`admin`, `editor`, `viewer`.

JULES: Right.

PARISA: But coarse roles can get messy.

JULES: Especially when the organization grows.

PARISA: Suddenly “editor” can edit nine things but not the tenth thing except on Tuesdays.

JULES: Welcome to enterprise authorization.


## ABAC: Access Based on Attributes

JULES: **Attribute-Based Access Control**, ABAC, makes decisions using attributes.

PARISA: Attributes of what?

JULES: User, resource, action, environment.

PARISA: Example.

JULES: Allow access if the user’s department is finance, the resource classification is internal, the request comes from a managed device, and it’s during approved hours.

PARISA: Much more expressive than “role equals finance.”

JULES: Yes, but also more complex.

PARISA: There’s our tradeoff.

JULES: RBAC is easy to reason about until roles explode.

ABAC can model nuanced rules but can become difficult to understand and debug.

PARISA: “Why was Lori denied?”

JULES: “Because policy 17 inherited attribute 4 from group 8 except the device posture signal was stale.”

PARISA: Lovely.


## Rule-Based and Discretionary Access

PARISA: Security+ has more access models, right?

JULES: Yep.

**Rule-Based Access Control** applies system-wide rules.

PARISA: Like a firewall-style rule?

JULES: Similar idea. Access depends on defined rules rather than ownership.

Then there’s **Discretionary Access Control**, DAC.

PARISA: Resource owner decides who gets access.

JULES: Right.

Classic file permissions can work this way.

PARISA: And Mandatory Access Control?

JULES: **MAC** uses centrally enforced labels and classifications.

Users and data may have security labels, and the system enforces policy.

PARISA: More rigid.

JULES: Yes. Common in environments where centrally controlled classification matters.

PARISA: So Security+ wants the conceptual differences.

JULES: Companion notes.


## Permissions Should Be Checked Server-Side

PARISA: Developer moment.

Let’s say my React app hides the “Delete user” button unless `currentUser.isAdmin`.

JULES: Useful for UX.

PARISA: Not sufficient for security.

JULES: Correct.

PARISA: Because a user can bypass the interface and call the API directly.

JULES: Exactly.

PARISA: So the server must validate authorization for every protected operation.

JULES: Yes.

PARISA: Every request.

JULES: Every relevant request.

PARISA: Even if the client already checked.

JULES: The client is not a trusted enforcement point.

PARISA: This should be tattooed onto frontend frameworks.


## IDOR: “I Changed 123 to 124”

PARISA: Let’s talk about the classic broken access control bug.

JULES: Insecure Direct Object Reference, often called IDOR.

PARISA: I request `/invoice/123`.

Then I change it to `/invoice/124`.

JULES: If the server only checks that you’re authenticated and not whether invoice 124 belongs to you, you might see someone else’s data.

PARISA: Which means the bug is not predictable IDs.

JULES: Important.

PARISA: UUIDs make guessing harder, but they do not replace authorization.

JULES: Exactly.

PARISA: If I somehow learn the UUID and the server gives me the object anyway, access control is still broken.

JULES: Correct.

PARISA: Security through obscurity has once again failed to become authorization.


## Privilege Escalation

JULES: Attackers often try to gain more privileges than they started with.

PARISA: Privilege escalation.

JULES: **Vertical privilege escalation** means moving to a more powerful role.

PARISA: Regular user becomes admin.

JULES: Right.

**Horizontal privilege escalation** means accessing another user’s resources at the same privilege level.

PARISA: Me reading another customer’s account.

JULES: Exactly.

PARISA: IDOR often becomes horizontal privilege escalation.

JULES: Yes.


## PAM: Protect the Scary Accounts

PARISA: Privileged Access Management.

JULES: **PAM** focuses on high-risk privileged accounts and access.

PARISA: Domain admins.

Cloud root accounts.

Database administrators.

JULES: Exactly.

PAM systems may vault credentials, rotate secrets, approve privileged sessions, record activity, or grant temporary access.

PARISA: Just-in-time access.

JULES: Yes.

Instead of giving someone permanent admin privileges, grant them for the specific period they need.

PARISA: Least privilege plus time.

JULES: Exactly.


## Service Accounts: The Robots Have Identities Too

PARISA: Humans aren’t the only identities.

JULES: Right.

Applications, services, CI jobs, containers, and automation need identities too.

PARISA: Service accounts.

Managed identities.

Workload identities.

JULES: Exactly.

PARISA: And historically we solved this by putting a username and password in a config file.

JULES: Which is how secrets end up in Git.

PARISA: We’ll get to supply chain and secrets later, but yes.

JULES: Modern platforms often offer short-lived credentials or workload identity mechanisms so applications don’t need static long-lived secrets.

PARISA: Which reduces the “API key from 2018 still has admin rights” problem.

JULES: Dramatically.


## Provisioning and Deprovisioning

PARISA: Employee joins.

What happens?

JULES: Account gets provisioned.

Groups assigned.

Access granted.

PARISA: Employee changes teams.

JULES: Access should change.

PARISA: Employee leaves.

JULES: Access should be removed quickly.

PARISA: This sounds obvious.

JULES: It is also one of the places organizations get burned.

PARISA: Orphaned accounts.

JULES: Yes.

Former employees.

Old contractors.

Unused service accounts.

Dormant admin accounts.

PARISA: Accounts are attack surface too.

JULES: Exactly.


## Group-Based Access and Permission Creep

PARISA: Organizations love groups.

JULES: For good reason.

Assigning access through groups makes management easier.

PARISA: Until somebody joins Finance, later moves to Engineering, later joins Security, and somehow still has all three permissions.

JULES: Permission creep.

PARISA: The access equivalent of a junk drawer.

JULES: Over time users accumulate privileges they no longer need.

PARISA: Which is why access reviews exist.

JULES: Yes. Periodic recertification asks whether people still need their access.

PARISA: Humans love filling those out.

JULES: Humans love governance.


## Separation of Duties

JULES: Another classic control is **separation of duties**.

PARISA: Don’t give one person enough power to perform and conceal a sensitive action alone.

JULES: Exactly.

PARISA: Person who creates a vendor shouldn’t necessarily also approve the payment.

JULES: Right.

PARISA: Developer shouldn’t necessarily approve and deploy their own high-risk production change without review.

JULES: Depending on environment, yes.

PARISA: So we’re reducing fraud, mistakes, and unilateral power.

JULES: Correct.


## Dual Control

PARISA: Is dual control the same thing?

JULES: Related, but more specific.

Dual control means two authorized people are required to perform an action.

PARISA: Two keys to launch the missiles.

JULES: The cinematic example.

PARISA: Or two people approving a highly sensitive operation.

JULES: Exactly.


## Federation and Centralized Identity

PARISA: We touched SSO last time.

JULES: IAM often centralizes identity through an identity provider.

PARISA: One place to manage accounts, groups, MFA, and policy.

JULES: Right.

Applications trust identity assertions or tokens from that provider.

PARISA: Big benefit: disable one account and remove access from many systems.

JULES: Exactly.

PARISA: Big risk: compromise the identity provider and the blast radius can be enormous.

JULES: Right.

PARISA: Centralization makes control stronger and failure more consequential.

JULES: Security tradeoff, episode five thousand.


## Just Enough Administration

PARISA: I’ve heard JEA and JIT.

JULES: **Just Enough Administration** gives only the administrative capabilities required.

**Just-in-Time** access grants privileges only when needed and often only temporarily.

PARISA: Scope plus time.

JULES: Exactly.

PARISA: Which makes “permanent global admin because it’s convenient” look increasingly indefensible.

JULES: That is the goal.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: “The admin button is hidden, so regular users can’t do it.”

JULES: Please don’t do this.

PARISA: “The route isn’t linked anywhere.”

JULES: Please don’t do this.

PARISA: “The ID is a UUID so nobody can guess it.”

JULES: Please don’t do this.

PARISA: “We only check authorization on the frontend.”

JULES: Absolutely not.

PARISA: “Everyone in engineering is admin because configuring permissions is annoying.”

JULES: You are trying to hurt me.


## Deny by Default

JULES: One design principle worth keeping is **deny by default**.

PARISA: No permission unless explicitly granted.

JULES: Right.

PARISA: Same pattern we used with firewalls.

JULES: Security loves default-deny because missing policy fails closed instead of open.

PARISA: Although mistakes can break legitimate access.

JULES: Yes.

PARISA: Availability and operational complexity again.

JULES: Security controls have to be maintainable or people route around them.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: I think the click is that IAM is not “login.”

JULES: Correct.

PARISA: Login gets me an identity.

IAM is the lifecycle and policy around what that identity can do across systems.

JULES: Exactly.

PARISA: Authorization should happen at the real resource boundary, not the visible UI.

JULES: Yes.

PARISA: Least privilege applies to humans and software.

JULES: Yes.

PARISA: Roles make permissions manageable.

Attributes make policy more expressive.

PAM protects high-risk access.

JIT limits how long powerful permissions exist.

JULES: You’ve got it.

PARISA: And if a user can change `/account/123` to `/account/124` and see somebody else’s data—

JULES: You have an authorization problem, not a URL-format problem.

PARISA: Beautiful.


## Security+ Corner

JULES: For Security+, recognize RBAC, ABAC, MAC, DAC, rule-based access, least privilege, separation of duties, PAM, account provisioning and deprovisioning, access reviews, group management, and service-account concerns.

PARISA: Understand vertical versus horizontal privilege escalation.

JULES: Yep.

PARISA: And know that identity administration is lifecycle management, not just authentication.

JULES: Exactly.


## What Did We Actually Learn?

PARISA: Authentication proves identity.

Authorization decides access.

JULES: IAM manages identities and access across their lifecycle.

PARISA: Least privilege minimizes unnecessary power.

RBAC bundles permissions into roles.

ABAC uses attributes and context.

JULES: MAC centrally enforces classification policy.

DAC lets owners control access.

PARISA: Server-side authorization must protect the actual operation.

JULES: IDOR and broken access control happen when the system checks identity but not whether that identity may access a specific resource.

PARISA: PAM, JIT, and JEA reduce privileged-access risk.

JULES: And deprovisioning matters because forgotten accounts are still doors.

PARISA: Next time?

JULES: Cryptography.

PARISA: Finally. Wizard robes.

JULES: We specifically promised no wizard robes.

PARISA: Fine.

Math robes.

[MUSIC]

PARISA: *Okay, But Why?* is the show where being logged in does not make you king of the database.

JULES: Next time: encryption, hashing, signatures, and why Base64 is not fucking encryption.

[MUSIC OUT]
