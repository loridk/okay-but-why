# Episode 12: Injection — Stop Concatenating Untrusted Shit

Status: Draft

**CAST**

PARISA — Full-stack developer who has written SQL long enough to know exactly why string-concatenating a query is a terrible idea.

JULES — Developer bringing SQL injection, command injection, LDAP injection, and template injection under one useful mental model.


[MUSIC]

PARISA: `SELECT * FROM users WHERE username = '` plus user input plus `'`.

JULES: No.

PARISA: I haven’t even finished.

JULES: You finished the vulnerability.

PARISA: Fair.

[MUSIC STING]

PARISA: Injection.

The family of bugs where the application confuses untrusted data with instructions.

JULES: Exactly.


## The Core Pattern

JULES: A system builds a command in some language.

SQL.

Shell.

LDAP query.

Template expression.

PARISA: Attacker controls part of the string.

JULES: And syntax from that input changes the meaning of the command.

PARISA: Data becomes code again.

JULES: Same conceptual family as XSS, different interpreter.


## SQL Injection

PARISA: Classic example.

Unsafe query concatenation:

`SELECT * FROM users WHERE name = '` plus `name` plus `'`.

JULES: Attacker provides input containing SQL syntax.

PARISA: Maybe changes the WHERE clause.

Maybe adds a second statement if the driver permits it.

JULES: Exactly.

PARISA: The root bug is not “apostrophes are dangerous.”

JULES: Correct.

PARISA: The root bug is combining code and data into one parseable string.


## Parameterized Queries

JULES: The primary defense is parameterization.

PARISA: Prepared statements.

Placeholders.

Bound parameters.

JULES: Right.

The database receives query structure separately from values.

PARISA: So input like `' OR 1=1 --` remains a value instead of becoming SQL syntax.

JULES: Exactly.

PARISA: This is why escaping is a weaker and more error-prone primary strategy than parameterization.

JULES: Correct.


## ORMs

PARISA: ORMs usually parameterize normal query APIs.

JULES: Usually.

PARISA: But raw-query escape hatches can bring injection right back.

JULES: Yes.

PARISA: “We use an ORM” is not proof that injection is impossible.

JULES: You have learned the show’s central security sentence.


## Command Injection

JULES: Now swap the database interpreter for a shell.

PARISA: Application builds a command like `convert ` plus filename.

JULES: If attacker-controlled input reaches a shell unsafely, shell metacharacters may execute additional commands.

PARISA: Defense: avoid invoking shells when possible.

JULES: Yes.

PARISA: Use APIs that pass arguments as discrete values rather than one shell command string.

JULES: Exactly.


## LDAP and NoSQL Injection

PARISA: SQL is not special.

JULES: Any interpreter with structured syntax can be abused if data is inserted unsafely.

PARISA: LDAP filters.

NoSQL query objects.

XPath.

JULES: Template engines.

PARISA: The recurring question is: does attacker input influence executable syntax?

JULES: Exactly.


## Server-Side Template Injection

PARISA: Template injection can get nasty.

JULES: If a server-side template engine evaluates attacker-controlled template syntax, the attacker may gain access to objects, secrets, or even remote code execution depending on the engine.

PARISA: Important distinction from simply putting attacker text into a template variable.

JULES: Yes.

Safe variable interpolation is different from treating user input as the template itself.


## Input Validation Helps, But It Is Not the Primary Boundary

PARISA: Validate that age is numeric.

JULES: Good.

PARISA: Restrict enum values.

JULES: Good.

PARISA: But “we validate input” does not replace parameterized queries.

JULES: Exactly.

PARISA: Input validation enforces business expectations.

Parameterization enforces code/data separation.

JULES: Beautiful distinction.


## Least Privilege Limits Damage

PARISA: If SQL injection reaches a database account that can only read one schema—

JULES: Damage is more limited than if the application connects as database root.

PARISA: Least privilege returns.

JULES: It will never leave.


## Error Messages

PARISA: Verbose database errors can help an attacker.

JULES: They may reveal table names, syntax, framework details, or query structure.

PARISA: Developers need useful logs.

Users need safe error messages.

JULES: Exactly.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: String-concatenate SQL with user input.

JULES: Please don’t.

PARISA: Build shell commands from raw request parameters.

JULES: Please don’t.

PARISA: Attempt to blacklist every evil character.

JULES: Please don’t.

PARISA: “We removed semicolons, therefore SQL injection is solved.”

JULES: Security through punctuation.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: Injection is interpreter confusion.

JULES: Yep.

PARISA: We intend attacker input to be data.

The interpreter sees part of it as instructions.

JULES: Exactly.

PARISA: Separate code from data at the API boundary.

JULES: That’s the principle.


## Parameterization Is a Structural Fix

PARISA: I want to linger on prepared statements because people hear “use parameters” like it’s a style preference.

JULES: It changes how the database parses the operation.

PARISA: The SQL structure is parsed as SQL.

The values are supplied separately.

JULES: Exactly.

PARISA: That means user input does not get another chance to rewrite the query grammar.

JULES: Right.

PARISA: Which is fundamentally stronger than manually escaping quote characters and hoping we covered every edge case.

JULES: Correct.


## Dynamic Queries Are Where Developers Get Tempted

PARISA: What about dynamic sorting?

User chooses `name`, `date`, or `price`.

JULES: Values can be parameterized easily.

Identifiers like column names often cannot be parameterized the same way.

PARISA: So whitelist allowed identifiers.

JULES: Exactly.

PARISA: Map user choice `"date"` to a hard-coded known column.

JULES: Right.

PARISA: Do not concatenate arbitrary `sortBy` into SQL because “it isn’t a value.”

JULES: Correct.

PARISA: This is a great example where validation genuinely is part of the safe construction.

JULES: Yes.


## Stored Procedures Are Not Automatically Safe

PARISA: Stored procedures?

JULES: Can be safe if they use parameters properly.

PARISA: But if the stored procedure itself constructs dynamic SQL from strings—

JULES: Injection can return.

PARISA: Security does not care which file contains the concatenation.

JULES: Exactly.


## Second-Order Injection

PARISA: Here’s a nasty one: second-order injection.

JULES: Malicious input is stored safely at first, then later used unsafely in another command.

PARISA: So request one does not exploit anything.

JULES: Right.

PARISA: Data enters database as text.

Later an admin report builds dynamic SQL using that stored value.

JULES: And the payload becomes active then.

PARISA: “It came from our database” does not mean trusted.

JULES: Excellent.

PARISA: Databases can contain attacker-controlled data.

JULES: Exactly.


## Blind SQL Injection

PARISA: What if the application doesn’t print database errors or query results?

JULES: Injection can still exist.

**Blind SQL injection** infers information from application behavior.

PARISA: True condition returns one response.

False condition returns another.

JULES: Or time-based techniques cause measurable delays.

PARISA: So hiding errors is good hygiene, not a fix.

JULES: Correct.


## Command Injection vs. Argument Injection

PARISA: Shell execution has subtleties too.

JULES: Yes.

Avoiding a shell eliminates many metacharacter parsing problems.

PARISA: But an attacker-controlled argument might still change the behavior of the invoked program.

JULES: Exactly.

PARISA: Filename beginning with `--option`.

JULES: Depending on the command.

PARISA: So safe process APIs plus input validation for the target program’s semantics.

JULES: Right.


## Path Traversal Is a Cousin, Not Exactly the Same Bug

PARISA: `../../etc/passwd`.

JULES: Path traversal.

PARISA: Not classic injection into a programming language, but still attacker input changing how the application resolves a resource.

JULES: Correct.

PARISA: Defense includes canonical path handling, allowlisted locations, safe APIs, and not treating raw user paths as authority.

JULES: Yes.

PARISA: Good to distinguish categories without pretending they are unrelated.


## Template Injection vs. XSS

PARISA: We just did XSS.

How is server-side template injection different?

JULES: XSS reaches the browser’s JavaScript or HTML execution context.

Server-side template injection reaches the template engine on the server.

PARISA: Which may have much more dangerous server privileges.

JULES: Exactly.

PARISA: Depending on engine, attacker could read files or execute server-side code.

JULES: Potentially.

PARISA: So “template” does not automatically mean frontend.


## Deserialization

PARISA: Does insecure deserialization fit this same mental family?

JULES: Adjacent.

The application treats attacker-controlled serialized data as trusted object structure.

PARISA: Which can sometimes trigger unexpected code paths or object construction behavior.

JULES: Yes.

PARISA: Again: untrusted data crossing into a powerful interpreter or runtime.

JULES: That broader mental model is useful.


## LDAP Injection Example

PARISA: Suppose authentication code builds an LDAP filter from username input.

JULES: If special filter syntax is concatenated unsafely, input may change the search logic.

PARISA: Same disease.

Different interpreter.

JULES: Exactly.


## NoSQL Does Not Mean No Injection

PARISA: I remember the phase where people said MongoDB meant SQL injection was gone.

JULES: SQL injection, specifically, perhaps.

Injection as a class? No.

PARISA: If an API accepts JSON and the code passes unvalidated objects directly into a query, attackers may inject query operators.

JULES: Exactly.

PARISA: Technology replacement does not repeal trust boundaries.

JULES: Another recurring lesson.


## Input Validation: Allowlist When You Can

PARISA: If a field should be one of `small`, `medium`, or `large`—

JULES: Accept exactly those values.

PARISA: If a number must be between one and ten—

JULES: Enforce that.

PARISA: This reduces weird application states and some attack opportunities.

JULES: Yes.

PARISA: But if the value later becomes SQL, still parameterize it.

JULES: Exactly.

PARISA: Validation and safe execution APIs solve different layers.


## Database Privileges

PARISA: Let’s make least privilege concrete.

Application only needs SELECT, INSERT, UPDATE on three tables.

JULES: Don’t connect as a database superuser.

PARISA: If injection happens, attacker should not automatically gain `DROP DATABASE`, user administration, or filesystem privileges.

JULES: Correct.

PARISA: Separate migration credentials from runtime credentials.

JULES: Excellent practice.

PARISA: Application runtime does not need permission to alter its own schema in many production designs.

JULES: Exactly.


## Detection

PARISA: Can WAFs detect injection?

JULES: They can detect many common patterns.

PARISA: Useful layer.

JULES: Yes.

PARISA: Not an excuse to concatenate queries.

JULES: Correct.

PARISA: Logs can show unusual query errors, strange parameters, command failures.

JULES: But don’t log sensitive data unnecessarily.

PARISA: Security monitoring has privacy consequences too.


## Old Person Yells at Cloud

[STING]

### OLD PERSON YELLS AT CLOUD

PARISA: PHP gave us PDO prepared statements ages ago.

JULES: Yes.

PARISA: Yet every generation of developers rediscovers string concatenation in a new abstraction.

JULES: JavaScript template literals made strings nicer, not safer as query builders.

PARISA: Thank you.

Backticks are not a security feature.

JULES: Wait, That’s Just JavaScript: template literals are JavaScript syntax, not query parameterization.

PARISA: Beautiful use of the bit.

## Security+ Corner

JULES: Recognize SQL injection, command injection, and other injection flaws as application attacks.

PARISA: Know parameterization, safe APIs, least privilege, validation, and secure error handling as defenses.


## What Did We Actually Learn?

PARISA: Do not build executable syntax by concatenating untrusted strings.

JULES: Use parameters and structured APIs.

PARISA: Validation helps enforce expected values but does not replace code/data separation.

JULES: And least privilege limits impact if a flaw still exists.

PARISA: Next: CSRF, CORS, and same-origin policy.

JULES: Three acronyms developers regularly confuse.

PARISA: Excellent.

[MUSIC OUT]
