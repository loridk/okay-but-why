# Episode 6: Cryptography Without the Wizard Robes

Status: Draft

**CAST**

PARISA — Experienced developer who knows enough cryptography to distrust anyone who says “we rolled our own.”

JULES — Modern-stack developer who is happy to explain the concepts and equally happy not to implement AES from scratch.


[MUSIC]

PARISA: Base64 is not encryption.

JULES: Strong opening.

PARISA: I have seen too much.

JULES: Base64 is encoding.

PARISA: You can decode it.

JULES: Without a key.

PARISA: Therefore not encryption.

JULES: Correct.

PARISA: Good. Episode complete.

JULES: Unfortunately cryptography has more than one concept.

PARISA: I was afraid of that.

[MUSIC STING]

PARISA: Welcome to *Okay, But Why?*

I’m Parisa.

JULES: And I’m Jules.

PARISA: Today we’re talking cryptography.

Encryption.

Hashing.

Signatures.

Keys.

JULES: And most importantly, what problem each one solves.

PARISA: Because developers hear “crypto” and start throwing SHA-256 at unrelated problems.

JULES: Or worse, writing their own algorithm.

PARISA: Please don’t do this is going to be busy today.


## What Problem Does Cryptography Solve?

JULES: Cryptography gives us mathematical tools for protecting information and proving things about it.

PARISA: Confidentiality.

JULES: Encryption.

PARISA: Integrity.

JULES: Hashes and message authentication can help.

PARISA: Authenticity.

JULES: Digital signatures and MACs.

PARISA: Non-repudiation?

JULES: Digital signatures can support that in certain systems and legal contexts, though real-world non-repudiation is more than “a signature exists.”

PARISA: Good. No magical promises.

JULES: Cryptography doesn’t secure everything by itself. It gives us primitives.

PARISA: Building blocks.

JULES: Exactly.

PARISA: And using the right building block incorrectly can still fail.

JULES: Extremely.


## Encryption: Keep the Contents Secret

PARISA: Start with encryption.

JULES: Encryption transforms plaintext into ciphertext using an algorithm and key.

PARISA: Plaintext is readable input.

Ciphertext is the scrambled output.

JULES: Right.

PARISA: Decryption reverses it with the appropriate key.

JULES: Exactly.

PARISA: The important property is that someone without the key should not feasibly recover the plaintext.

JULES: Correct.


## Symmetric Encryption: Same Secret on Both Sides

JULES: In **symmetric encryption**, the same secret key—or closely related shared secret—is used for encryption and decryption.

PARISA: Fast.

JULES: Generally very fast.

PARISA: AES.

JULES: The major modern example.

PARISA: Problem: how do both parties get the same secret key without exposing it?

JULES: That’s the key-distribution problem.

PARISA: Which is where asymmetric cryptography becomes useful.

JULES: Exactly.


## Asymmetric Encryption: A Key Pair

JULES: **Asymmetric cryptography** uses a key pair.

Public key.

Private key.

PARISA: Public key can be shared.

Private key must be protected.

JULES: Right.

PARISA: Depending on the algorithm and use case, one side can encrypt or verify using the public key, while the private key decrypts or signs.

JULES: Correct.

PARISA: RSA and elliptic-curve cryptography.

JULES: Common families.

PARISA: Slower than symmetric crypto.

JULES: Typically much slower for bulk data.

PARISA: Which is why protocols often use asymmetric crypto to establish trust or shared secrets, then switch to symmetric encryption for the actual conversation.

JULES: That hybrid model is everywhere.


## The Locked Box Metaphor

PARISA: Give me a metaphor that does not lie too badly.

JULES: Imagine everyone has a special padlock they can hand out publicly.

Anyone can put something in a box and lock it with your public padlock.

Only your private key can open it.

PARISA: Good for encryption intuition.

JULES: But real asymmetric cryptography has mathematical properties the padlock metaphor doesn’t capture.

PARISA: Metaphor warning label accepted.


## Hashing: Fingerprint, Not Encryption

PARISA: Hashing.

JULES: A cryptographic hash function takes input of arbitrary size and produces fixed-size output.

PARISA: Same input, same hash.

JULES: Yes.

PARISA: Tiny input change, very different output.

JULES: Ideally.

PARISA: And it is designed to be one-way.

JULES: Meaning you should not feasibly recover the original input from the hash alone.

PARISA: Which is why hashing is not encryption.

JULES: Right.

PARISA: Encryption is reversible with a key.

Hashing is not supposed to be reversible.

JULES: Exactly.


## What Are Hashes Good For?

PARISA: Integrity checking.

JULES: Yes.

If you publish a file and its hash, users can compute the hash of what they downloaded.

If the values differ, the file changed.

PARISA: But a plain hash doesn’t prove who published it.

JULES: Important.

An attacker who can replace both the file and the posted hash can fool you.

PARISA: So for authenticity, we need signatures or some trusted channel.

JULES: Exactly.


## Collision Resistance

JULES: Good cryptographic hashes aim for properties including collision resistance.

PARISA: Hard to find two different inputs with the same hash.

JULES: Right.

PARISA: Because collisions must mathematically exist when arbitrary input maps to fixed output.

JULES: Correct.

PARISA: The security goal is that finding one intentionally is computationally infeasible.

JULES: Exactly.

PARISA: MD5 and SHA-1 are considered broken for collision-resistant security use.

JULES: Yes.

PARISA: SHA-2 and SHA-3 families are modern options for appropriate use cases.

JULES: Correct.


## Password Hashing Is Special

PARISA: We touched this last episode.

JULES: Password storage uses specialized password hashing because ordinary cryptographic hashes are too fast.

PARISA: Fast is usually good.

JULES: Unless the attacker is trying billions of guesses.

PARISA: Then fast helps the attacker.

JULES: Exactly.

PARISA: So Argon2id, bcrypt, scrypt, PBKDF2.

JULES: Appropriate options depending on system requirements.

PARISA: Salt each password.

JULES: Yes.

PARISA: Optional pepper, handled carefully.

JULES: Yes.

PARISA: We are not designing our own scheme.

JULES: Absolutely not.


## Message Authentication Codes

PARISA: MAC.

JULES: Unfortunately this acronym is overloaded.

PARISA: Not Mandatory Access Control this time.

JULES: Right.

A **Message Authentication Code** uses a secret key to produce a tag that helps verify integrity and authenticity.

PARISA: HMAC.

JULES: A common construction using a cryptographic hash and secret key.

PARISA: So a plain hash can tell me “this changed,” but HMAC can tell me “this changed or it wasn’t produced by someone with the shared secret.”

JULES: Exactly.

PARISA: Shared-secret authenticity.

JULES: Good phrase.


## Digital Signatures: Prove Who Signed It

JULES: Digital signatures use asymmetric cryptography.

PARISA: Sign with the private key.

Verify with the public key.

JULES: Exactly.

PARISA: So anyone with the public key can verify that the signature corresponds to the private key.

JULES: Right.

PARISA: And that the signed data hasn’t changed.

JULES: Correct.

PARISA: This is not encryption.

JULES: Very important.

A signature does not inherently make the content secret.

PARISA: Public signed document can still be public.

JULES: Exactly.


## Signing Software

PARISA: This matters for software distribution.

JULES: Very much.

A developer or vendor can sign a release.

Users or systems verify the signature.

PARISA: If malware modifies the package, signature verification should fail.

JULES: Right.

PARISA: Assuming the signing key is protected and the verifier trusts the right public key.

JULES: Cryptography always drags key management behind it.


## Key Management: The Actual Hard Part

PARISA: There it is.

JULES: Cryptographic algorithms are often the easy part compared with managing keys safely.

PARISA: Generate them securely.

Store them securely.

Distribute them securely.

Rotate them.

Revoke them.

Back them up where appropriate.

Destroy them when needed.

JULES: Exactly.

PARISA: If the AES key is sitting in the same public GitHub repo as the encrypted database dump—

JULES: You have performed decorative encryption.

PARISA: Beautiful phrase.


## Key Length and Algorithm Choice

JULES: Security depends on using algorithms and key sizes appropriate for the threat model.

PARISA: Bigger isn’t universally better.

JULES: Right.

Different algorithms have different security properties.

You can’t directly compare a 256-bit symmetric key to a 256-bit RSA key.

PARISA: Because the underlying mathematical problems differ.

JULES: Exactly.

PARISA: Use established standards and libraries.

JULES: Always.


## Randomness Is Security-Critical

PARISA: Random numbers.

JULES: Cryptography needs unpredictable randomness for keys, nonces, salts, tokens, initialization vectors, and more.

PARISA: `Math.random()`?

JULES: Not for cryptographic secrets.

PARISA: In browsers, Web Crypto.

JULES: Yes.

PARISA: In Node, cryptographic random APIs.

JULES: Right.

PARISA: Predictable randomness can destroy otherwise good crypto.

JULES: Exactly.


## Nonces and IVs

PARISA: Nonce.

JULES: “Number used once,” conceptually.

PARISA: Initialization vector.

JULES: Another parameter used by certain encryption modes.

PARISA: Do I need to memorize implementation details?

JULES: Not for this episode.

The important idea: many encryption schemes require unique or unpredictable auxiliary values.

Reusing them incorrectly can catastrophically weaken security.

PARISA: So library says “give me a nonce,” I do not just hard-code `1234`.

JULES: Please don’t.


## Encryption at Rest and in Transit

PARISA: Common security phrase.

JULES: **Data at rest** is stored data.

Disk.

Database.

Backup.

PARISA: **Data in transit** is moving between systems.

JULES: Exactly.

PARISA: TLS protects data in transit.

Disk or database encryption can protect data at rest.

JULES: Right.

PARISA: But encryption at rest does not stop an authorized compromised application from reading decrypted data.

JULES: Important.

PARISA: If the application has the key and the attacker controls the application, encryption may not save you at that layer.

JULES: Correct.

PARISA: Control has a scope.

JULES: Always.


## Encryption in Use?

PARISA: And data in use?

JULES: Data actively being processed is harder to protect because systems generally need plaintext or usable representation to compute on it.

PARISA: There are technologies like trusted execution environments and homomorphic encryption for specialized cases.

JULES: Yes, but they’re not magic universal answers.

PARISA: Good. We will not accidentally turn this into a graduate cryptography course.


## Tokenization and Data Masking

JULES: Security+ also distinguishes other data-protection techniques.

PARISA: Tokenization.

JULES: Replace sensitive data with a non-sensitive token that maps back to the original through a controlled system.

PARISA: Credit-card systems use this.

JULES: Often.

PARISA: Masking.

JULES: Hide part of the value for display.

PARISA: `•••• 1234`.

JULES: Exactly.

PARISA: Not cryptography in the same sense, but useful data-minimization controls.

JULES: Right.


## Obfuscation Is Not Encryption

PARISA: Minified JavaScript is not encrypted.

JULES: Correct.

PARISA: Rot13 is not secure encryption.

JULES: Correct.

PARISA: XOR with a hard-coded key in the source is not a miracle.

JULES: Correct.

PARISA: Base64—

JULES: Still not encryption.

PARISA: Just checking.


## Please Don’t Do This

[STING]

### PLEASE DON’T DO THIS

PARISA: Roll your own crypto.

JULES: Please don’t do this.

PARISA: Invent an algorithm because AES “looks complicated.”

JULES: Absolutely not.

PARISA: Reuse nonces because “it worked in testing.”

JULES: No.

PARISA: Put encryption keys in source control.

JULES: No.

PARISA: Encrypt passwords instead of hashing them.

JULES: No.

PARISA: Use MD5 because “it’s just internal.”

JULES: We are going to lose sponsors we do not have.


## Cryptographic Agility

PARISA: What happens when an algorithm becomes weak?

JULES: Systems need **cryptographic agility**.

PARISA: Ability to replace algorithms, keys, certificates, or protocols without rebuilding everything from scratch.

JULES: Exactly.

PARISA: Hard-code one algorithm forever and future-you suffers.

JULES: Yes.

PARISA: This matters especially with long-lived systems and post-quantum transitions.

JULES: Exactly.


## Quantum Computing, Briefly and Calmly

PARISA: We have to mention quantum, don’t we?

JULES: Briefly.

Large fault-tolerant quantum computers could break some widely used public-key algorithms.

PARISA: RSA, traditional elliptic-curve systems.

JULES: Yes.

PARISA: Not “all encryption becomes useless tomorrow.”

JULES: Correct.

Symmetric cryptography is affected differently, and post-quantum algorithms are being standardized and deployed.

PARISA: So the practical lesson is cryptographic agility and paying attention to standards.

JULES: Exactly.

PARISA: No quantum panic bunker.

JULES: Not required.


## Okay, That’s Actually Pretty Cool

[STING]

### OKAY, THAT’S ACTUALLY PRETTY COOL

PARISA: The click is that “cryptography” is not one operation called `secure()`.

JULES: Correct.

PARISA: Encryption protects confidentiality.

Hashing gives a one-way digest useful for integrity and other constructions.

HMAC gives integrity and authenticity using a shared secret.

Digital signatures give integrity and authenticity using asymmetric keys.

JULES: Exactly.

PARISA: Different primitive, different problem.

JULES: Yes.

PARISA: And key management is part of the security, not administrative cleanup after the math.

JULES: Arguably one of the hardest parts.

PARISA: Which explains why good developers use established protocols and libraries instead of becoming amateur cryptographers on a Friday night.

JULES: Beautiful.


## Security+ Corner

JULES: For Security+, know symmetric versus asymmetric cryptography, hashing, salting, key exchange, digital signatures, certificates, PKI concepts, tokenization, masking, key management, cryptographic attacks, and data states.

PARISA: Recognize common algorithm families.

JULES: AES, RSA, ECC, SHA families, and password hashing concepts.

PARISA: And know what each tool is for.

JULES: That matters more than memorizing a name in isolation.


## What Did We Actually Learn?

PARISA: Encryption is reversible with the proper key.

Hashing is designed to be one-way.

JULES: Symmetric crypto uses a shared secret and is efficient for bulk data.

Asymmetric crypto uses public/private key pairs and helps with key exchange, encryption, and signatures depending on the algorithm.

PARISA: Digital signatures provide integrity and authenticity, not secrecy.

JULES: HMAC uses a shared secret to authenticate data.

PARISA: Passwords need specialized slow hashing.

JULES: Randomness, nonces, IVs, and key management are security-critical.

PARISA: Encryption at rest and in transit protect different stages of data.

JULES: And established cryptographic libraries beat clever homemade algorithms.

PARISA: Next time?

JULES: HTTPS, TLS, certificates, and PKI.

PARISA: So now we take all these primitives and build the little lock icon.

JULES: Basically.

PARISA: Finally. The browser has been smug about that lock for years.

[MUSIC]

PARISA: *Okay, But Why?* is the show where Base64 has been formally denied admission to the encryption club.

JULES: Next time: how your browser decides it’s really talking to the site you asked for.

[MUSIC OUT]
