# Episode 8: Databases and Application State — Where Does the Truth Live?

**Series:** Web Architecture • Episode 8 of 14
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — The Order Was in a Variable

[INTRO MUSIC]

JULES: I saved the order.

PARISA: Where?

JULES: In an object.

PARISA: Where is the object?

JULES: In memory.

PARISA: And where is the process?

JULES: It restarted.

PARISA: So the pizza exists in our hearts.

JULES: Welcome to *Okay, But Why?*. Today: state, persistence, and why a database isn't just an unusually serious array.

## State Means What Is True Right Now

PARISA: State is the information that describes the system at a particular moment. Which panel is open, what's in a draft cart, whether an order is paid.

JULES: But those facts have different owners and lifetimes. An open panel may disappear when the tab closes. An accepted order must survive a process restart.

PARISA: From the React series, component state helps the interface remember things between renders. It doesn't automatically persist them across page loads or synchronize them with the server.

JULES: Exactly. Browser memory, browser storage, server process memory, and durable database storage are different places with different behavior.

PARISA: Browser storage can keep a draft between visits, subject to browser policies and user clearing. It isn't our authoritative business ledger.

JULES: Server memory can hold temporary calculations or caches. If there are several instances, each may have its own copy. If one restarts, its memory changes or disappears.

PARISA: A database offers durable storage and coordinated access, under its configuration and guarantees. We still need to understand those guarantees and operate it correctly.

## A Database Solves Coordination, Not Just Saving

JULES: Why not write orders to a JSON file?

PARISA: For a small local experiment, maybe. For concurrent real transactions, you soon need to coordinate writes, query efficiently, enforce constraints, recover from interruption, and control access.

JULES: Two requests can try to write at once. A partial write can damage the file. Finding all pending deliveries can require scanning everything.

PARISA: A database gives us mechanisms for those problems. Not because files are bad, but because building our own database accidentally is usually an expensive hobby.

JULES: And the data model expresses relationships. Orders have line items. A customer may have several orders. A payment has a relationship to an order without being the same thing.

PARISA: The model should reflect the business facts we need to preserve. We don't simply store whatever shape the UI happened to use this week.

## Relational Doesn't Mean Ancient

JULES: A relational database organizes data in relations, commonly represented as tables with rows and columns. Keys connect related records. Constraints help enforce rules.

PARISA: For a pizza shop, that can be wonderfully appropriate. Orders, order items, payments, staff accounts. SQL lets us ask questions about those relationships.

JULES: SQL is a database query language, not JavaScript or TypeScript. An ORM may let application code express queries through objects, but the database still has its own execution and rules.

PARISA: An ORM is a library that maps between application objects and database operations. Useful, but it doesn't make slow queries or incorrect relationships disappear.

JULES: And not every database is relational. Document databases organize records differently; key-value stores provide other access patterns. Choose based on data and operations.

PARISA: “NoSQL” is a broad family label, not a promise of no schema, infinite scale, or fewer decisions. The application still assumes some structure.

JULES: A flexible representation can be useful when the data actually varies. It can also move validation and consistency work into application code.

PARISA: For our baseline, a relational database is an explainable starting point. We have relationships and transactional operations. We don't need three database types to store mozzarella.

## The Order Remembers What Was Bought

JULES: Here's a subtle modeling issue. An order line refers to menu item 12. Later, item 12 gets renamed and its price changes.

PARISA: The old receipt shouldn't rewrite history. We need to preserve the description and accepted price relevant to that order, not recalculate the past from today's menu.

JULES: So the order may store a snapshot of important purchase details alongside the reference to the menu item.

PARISA: That's deliberate duplication with a purpose. Normalization helps reduce unintended redundancy, but historical facts are not always the same fact as the current catalog entry.

JULES: Exactly. “Price now” and “price accepted then” are different facts. Treating them as one field creates bugs.

PARISA: Money also needs a defined representation, precision, and currency. Don't casually rely on floating-point arithmetic for financial amounts just because JavaScript's default number is convenient.

JULES: Integer minor units can work where appropriate; database decimal types can be useful. The choice needs consistent handling across the system and the currencies involved.

## Transactions: These Changes Belong Together

JULES: Accepting an order may require creating the order record and its line items. What if only half succeeds?

PARISA: We don't want a confirmed order with no items. A transaction groups database work so it can commit together or be rolled back together.

JULES: That's atomicity: the group is treated as a unit. Database systems provide additional guarantees about isolation and durability, with details that depend on configuration and transaction level.

PARISA: The important thing is that transactions let us express a boundary around related changes. They don't automatically know which changes the business intended to group.

JULES: Nor do they automatically include an external payment service. A transaction in our database can't roll back a charge at another company by reversing a SQL statement.

PARISA: That requires a workflow: track payment state, handle notifications, reconcile uncertain results, and perform compensating actions when appropriate.

JULES: We'll revisit that when we discuss services. For now, local database atomicity and an entire distributed business transaction are not the same promise.

[CODE CARD: Transaction sketch in SQL; illustrative, not a complete schema]
~~~sql
BEGIN;
-- Insert an order and its required line items.
-- If a required operation fails, roll back the transaction.
COMMIT;
~~~

PARISA: In spoken terms: start a group of database work, perform the related changes, commit if they succeed, otherwise roll back. Actual statements use validated data and parameterized queries.

## Two Customers, One Last Dough Ball

JULES: Two requests each read that one pizza remains. Both decide they can buy it. What happens?

PARISA: If each independently checks and then updates without coordination, both may succeed. That's a race condition.

JULES: A transaction alone doesn't mean every possible race is prevented at every isolation level. We need the correct operation and concurrency strategy.

PARISA: Maybe an atomic conditional update: reserve stock only if enough remains, then inspect whether the update succeeded. Maybe locking or a stronger isolation level, depending on the system.

JULES: Constraints can enforce invariants such as uniqueness. The database should help protect rules that must remain true under concurrent requests.

PARISA: Invariant means a condition we require to hold, not a decorative math word. For example, an operation key should identify one accepted creation attempt within its scope.

JULES: And if two staff members edit the same order, we may use a version number to detect that one edited an outdated version.

PARISA: Then the interface can say another person changed the order and ask for reconciliation. Silently overwriting the newer change is a policy too, usually one nobody meant to choose.

## Read Models Can Be Behind

JULES: The customer sees “accepted.” The staff dashboard still shows the old list. Is the database wrong?

PARISA: Not necessarily. The dashboard may be displaying cached or previously fetched data. There could also be a read replica that hasn't caught up.

JULES: A replica is another copy of data maintained from a source. Depending on the replication design, it may lag.

PARISA: So read-after-write expectations matter. If I just placed an order and immediately request its confirmation, I shouldn't see “not found” merely because we routed the read to a lagging copy without handling that possibility.

JULES: Exactly. We choose where authoritative reads need to go or how the interface handles expected delay.

PARISA: The phrase eventual consistency describes convergence under the system's assumptions; it doesn't mean we may ignore lost updates and hope they feel better later.

JULES: There needs to be a mechanism that actually propagates the changes and a plan when that mechanism fails.

## Indexes Are a Tradeoff

JULES: Staff need all unfulfilled orders for tonight. The query slows as data grows. What might help?

PARISA: An appropriate index can help locate relevant rows without scanning everything. Like an organized route to the data, though the database structures are more precise than a book index.

JULES: But indexes take storage and must be maintained as data changes. Adding one to every column isn't free performance.

PARISA: We inspect the actual query plan and workload. Maybe the problem is an unnecessary query per order—the classic N-plus-one pattern—rather than missing raw server power.

JULES: An ORM can accidentally produce that pattern. One query for the list, then one additional query for every row's related data.

PARISA: The fix could be a better query or data-loading strategy. We don't immediately split the restaurant into twelve microservices because a page made two hundred database calls.

## Migrations Change the Shape Over Time

JULES: We add pickup times to orders. The database schema needs to evolve.

PARISA: A migration records a change to the schema or data. We should plan how existing rows behave, how deployment overlaps with old code, and how to recover if it fails.

JULES: For example, adding a required field immediately can break older application instances that don't supply it.

PARISA: A staged approach may add the field compatibly, populate it, update writers and readers, then enforce the stricter requirement. Details depend on the database and deployment.

JULES: This is why data changes can be harder to reverse than code changes. A rollback of the application doesn't automatically restore transformed data.

PARISA: And “we have Git” is not a database backup strategy. Git remembers source code, not every order placed during dinner.

## Backups Are Only Useful If We Can Restore

JULES: What does the business need after a failure?

PARISA: Define how much data loss is tolerable and how long recovery may take. Then choose backups and recovery procedures that support those expectations.

JULES: A backup job reporting success isn't proof the restore works. Test recovery in a suitable environment.

PARISA: Replication isn't automatically a backup either. An accidental deletion may replicate very efficiently to every copy.

JULES: And protect the backups. They can contain the same sensitive information as the primary database.

PARISA: Also minimize what we store. We need delivery details to fulfill an order, but keeping every detail forever is not an architecture requirement by default.

JULES: Retention and access policies belong to the data design. The fewer unnecessary secrets and personal records we accumulate, the less we must protect and explain later.

## Model the Order as a State Machine

JULES: We have used the word status a lot. Could we just store paid true and done true?

PARISA: You can, but combinations become ambiguous. What does done true and paid false mean? Cancelled? Complimentary? Failed payment after fulfillment? A couple of booleans can hide several business states.

JULES: A state machine gives explicit states and permitted transitions.

PARISA: Exactly. For a simplified order: draft, awaiting payment, accepted, preparing, dispatched, completed, perhaps cancelled. The actual model depends on the business and payment flow.

JULES: We should avoid implying every order must pass through all those states. Pickup doesn't dispatch to a driver.

PARISA: Right. The model can branch. The important part is that transitions have rules. A completed order shouldn't quietly return to awaiting payment because an old message arrived.

JULES: And payment state may be separate from fulfillment state.

PARISA: Often useful. A refund can happen after delivery. If one status field tries to represent every combination, it can become a confusing list of compound names.

JULES: So model related but distinct dimensions, then define valid combinations and operations.

PARISA: Yes. We don't need a state-machine library to begin thinking clearly. Start by saying which transitions are allowed and why.

## A Concrete Concurrency Story

JULES: Staff member A opens order 417. Staff member B opens the same order. Both see version three. A changes the pickup time and saves.

PARISA: The record becomes version four. B then tries to save an old copy with a changed note. If the application overwrites the entire record without checking, A's pickup-time change may disappear.

JULES: That's a lost update.

PARISA: Exactly. With an optimistic concurrency check, B's request includes the version it was based on. The server updates only if that version is still current, otherwise returns a conflict.

JULES: Then B can reload the current record and reconcile the note.

PARISA: Or the application can merge independent fields if that's a deliberate safe policy. But “last request wins” shouldn't be an accidental consequence of a convenient save function.

JULES: Why call it optimistic?

PARISA: It proceeds assuming conflicts are uncommon and checks before committing the change, rather than holding a lock while someone spends five minutes reading a form.

JULES: The human pause is much longer than a database transaction should casually remain open.

PARISA: Yes. Don't hold scarce database resources hostage while I decide whether “extra crispy” needs an exclamation point.

## The Database Sees Different Work Than the Interface

JULES: The UI displays one order card. Does that mean one database operation?

PARISA: Not necessarily. It may combine order fields, item rows, payment information, and current fulfillment status. Conversely, one database query can return information for many cards.

JULES: So the visual component tree isn't a good automatic database schema.

PARISA: Exactly. A component is organized around rendering and interaction. A data model is organized around facts, relationships, constraints, and queries. They communicate, but they solve different problems.

JULES: The server can build a view model suited to the page.

PARISA: Yes. That can keep the browser from doing unnecessary joins across multiple endpoints and prevent internal storage details from leaking into every client.

JULES: View model here is a general design term, not necessarily a particular framework class.

PARISA: Correct. It's simply the representation useful for that view. The naming is less important than the deliberate transformation.

## When Data Grows, Questions Change

JULES: We want a monthly report of the most popular pizzas. Should that run against the same database as checkout?

PARISA: It might be fine initially. Measure the query and its impact. If reporting becomes expensive, we can schedule it, optimize it, or use a separate read-oriented system when justified.

JULES: That separate system might contain copied or transformed data.

PARISA: Yes, and then freshness and lineage matter. Where did the data come from? When was it updated? Does the report include cancelled orders or refunds? Those are semantic questions, not just infrastructure.

JULES: Lineage means the path from source facts to the derived result.

PARISA: Exactly. If the report says mushroom pizza is winning, we should know whether it's counting ordered items, paid items, or fulfilled items. Those can differ.

JULES: The database can't decide the business definition of popularity for us.

PARISA: Nor can an analytics platform. It can calculate the wrong definition at impressive speed.

## Delete, Archive, or Keep?

JULES: Customer cancels an order. Do we delete the row?

PARISA: Usually we need to preserve the fact that it existed and was cancelled, especially for payment reconciliation and support. But the precise retention policy depends on the business and applicable obligations.

JULES: So deletion and cancellation are different operations.

PARISA: Exactly. And retaining a business record doesn't necessarily require retaining every personal detail forever. We can separate the necessary historical facts from information whose purpose has ended.

JULES: That affects schema design and cleanup jobs.

PARISA: Yes. If personal data is copied into ten loosely tracked tables, retention becomes harder. Data minimization helps operations as well as privacy.

JULES: We also shouldn't promise deletion from every backup instantly if the system can't do that.

PARISA: Correct. Policies need to match implementation. We can discuss requirements and choose mechanisms, but not invent guarantees because they sound comforting.

## A Restore Rehearsal

JULES: Let's imagine our backup exists. We restore it to a test environment. What do we verify?

PARISA: That the restored data is readable, structurally valid, and recent enough for the recovery objective. Then that the application can actually use it, including required configuration and compatible schema.

JULES: Not just that a file decompressed.

PARISA: Exactly. Also check that the test environment won't send real receipts or contact live payment services while replaying data. A recovery rehearsal shouldn't create a second dinner rush.

JULES: And document the steps, permissions, and time involved.

PARISA: Yes. If only one person knows the recovery ritual and they are unavailable, the system has a human single point of failure.

JULES: This is a good place to spend effort before exotic scaling work.

PARISA: Absolutely. A modest database with a tested restore can be more trustworthy than a grand diagram with no recovery evidence.

## What Belongs Where?

PARISA: Let's place the facts. The toppings I'm currently considering?

JULES: Browser state, possibly a persisted draft if that helps. Still tentative.

PARISA: The accepted price and order contents?

JULES: Durable order records, written through the authoritative application operation.

PARISA: A cached public menu?

JULES: A replaceable copy derived from the current menu source, with a freshness policy.

PARISA: The session we discussed last time?

JULES: In the chosen session store or credential design, with expiry and revocation behavior. Don't confuse it with component state.

PARISA: A downloaded receipt image on one staff server?

JULES: If it must survive instance replacement or be available to multiple instances, use suitable shared durable storage rather than assuming that local disk is permanent.

PARISA: Excellent. “Where does it live?” now includes “who owns it, how long must it survive, and can it be reconstructed?”

## A Data Ownership Review

JULES: Let's review a proposed field: current delivery estimate. Is that a durable fact or a computed value?

PARISA: It depends on what we mean. A live estimate may be derived from current conditions. The estimate shown when the order was accepted may need to be preserved if it represents a promise. Those are different facts.

JULES: Like current menu price versus accepted price.

PARISA: Exactly. Ask whether changing the source should change the historical value. If not, preserve the relevant snapshot deliberately.

JULES: Another field: customer display name on the staff ticket.

PARISA: We need enough information to fulfill the order, with appropriate access and retention. We don't necessarily need to synchronize every later account-profile change into old tickets.

JULES: Another: number of pending orders.

PARISA: Could be derived by a query. If we maintain a separate counter for performance, now we need to keep it consistent and repair it if it drifts. Don't introduce that extra copy without a reason.

JULES: That's the recurring question: can we calculate it, or must we store it?

PARISA: Yes, and if stored, is it authoritative or derived? A derived summary should have a way to be rebuilt from the facts it summarizes.

JULES: What about a payment provider's transaction reference?

PARISA: Store the reference needed for reconciliation, with the payment state and necessary audit information. Don't confuse the reference with proof that the payment succeeded. The state must come from a verified provider result and our workflow.

JULES: Every field gets a meaning and a source.

PARISA: Ideally. That may sound slower than adding columns casually, but it prevents a lot of later confusion. A database full of vaguely named values is a very durable misunderstanding.

JULES: Durable misunderstanding sounds like the title of an enterprise memoir.

PARISA: Volume one is called status_two.

## Closing — The Cylinder Has Responsibilities

JULES: Databases provide persistence, querying, constraints, and coordination. We still design the data model and the business operations.

PARISA: State in a browser, cache, process, session, and database has different authority and lifetime. A current-looking screen is not proof of a current record.

JULES: Next time: monoliths. One deployable application doesn't have to mean one undifferentiated blob.

PARISA: Good. Our order has survived a restart. It deserves a sensible home.

[OUTRO MUSIC]

## Production Notes

- SQL card is a transaction sketch, not runnable order code. No JavaScript or TypeScript syntax is introduced.
- Inventory race requires a suitable concurrency strategy; the script explicitly avoids claiming that any transaction at any isolation level solves it.
- External payment is outside a local database transaction; distributed workflows are revisited in Episode 10.

## Production References

- PostgreSQL, Transactions: https://www.postgresql.org/docs/current/tutorial-transactions.html
- PostgreSQL, Transaction Isolation: https://www.postgresql.org/docs/current/transaction-iso.html
- PostgreSQL, Constraints: https://www.postgresql.org/docs/current/ddl-constraints.html
- PostgreSQL, Backup and Restore: https://www.postgresql.org/docs/current/backup.html
