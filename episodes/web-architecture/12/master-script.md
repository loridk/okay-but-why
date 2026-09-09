# Episode 12: Scaling — More Pizza, Not Automatically More Services

**Series:** Web Architecture • Episode 12 of 14
**Hosts:** Parisa, Jules
**Production target:** Approximately 30 minutes; verify against a recorded read.

## Cold Open — We Went Viral

[INTRO MUSIC]

JULES: Nervous Robot Pizza Delivery went viral.

PARISA: How viral?

JULES: The website is slow, the kitchen is full, and someone has requested a pizza shaped like a database.

PARISA: A cylinder would be a calzone.

JULES: Can we scale?

PARISA: First tell me which part is struggling.

JULES: Welcome to *Okay, But Why?*. The least glamorous and most useful scaling question.

## Scale What, Exactly?

PARISA: More visitors, more orders, more stored data, more staff, more regions—those aren't the same workload.

JULES: Exactly. A million people viewing a cached menu differs from a million people simultaneously submitting orders. Reads, writes, computation, and external calls stress different resources.

PARISA: And the kitchen's physical capacity is separate from the website's throughput. We can accept orders faster than humans can cook them, which is not a success story.

JULES: So define the workload and the promise. How many requests? Which operations? What response time matters? How much failure is acceptable? What does the business actually need?

PARISA: We can invent numbers for an exercise, but don't present them as benchmarks. Real capacity depends on the code, hardware, database, network, and workload mix.

JULES: Good. There isn't a universal “Node handles this many pizzas” number.

## Measure the Bottleneck

JULES: The site is slow. What do we inspect?

PARISA: Request latency, error rate, CPU, memory, database timings, connection usage, external-service waits, and queue delays. Then follow the slow operation.

JULES: Averages can hide bad experiences. A high percentile tells us about slower requests in the distribution, such as the threshold below which ninety-five percent fall.

PARISA: That doesn't mean the ninety-fifth customer is cursed. It's a description of a set of measurements.

JULES: And percentiles need context: which route, time window, and workload? Mixing logo requests with checkout can make the whole site look healthy while purchases fail.

PARISA: Measure the thing the customer cares about. Time to accepted order, not just time until some proxy returns bytes.

JULES: Also trace dependencies. If the app spends most of its time waiting on a payment provider, adding application CPU may not help.

## First, Do Less Unnecessary Work

PARISA: The staff list makes one query for orders and one query per order for items. Fix that before ordering more servers.

JULES: The N-plus-one example from the database episode. A better data-loading strategy can remove substantial repeated work.

PARISA: Appropriate indexes, bounded lists, smaller responses, avoiding serial independent calls, and caching eligible public content can all help.

JULES: But verify improvements with representative measurements. An optimization can move the bottleneck or create correctness risks.

PARISA: And don't make the page inaccessible to shave a few bytes. The goal is people completing tasks reliably, not a synthetic score with no customers attached.

## Vertical Scaling

JULES: Vertical scaling gives a component more resources: more CPU, memory, or other capacity on a larger machine or service tier.

PARISA: Often straightforward. If memory pressure is the problem, more memory may be the simplest practical fix while we investigate or improve the workload.

JULES: It has limits, costs, and sometimes restart or migration implications. One large instance can still be one failure point.

PARISA: But we shouldn't dismiss it because horizontal scaling sounds more impressive. The least complex solution that meets the requirement may be a larger database instance.

JULES: Especially when the alternative is premature partitioning of data and every query becoming an expedition.

## Horizontal Scaling

JULES: Horizontal scaling adds instances and distributes work across them.

PARISA: Several copies of the same application can handle requests behind a load balancer. That's compatible with a monolith.

JULES: The load balancer routes requests to available instances according to its policy. Health checks help determine whether an instance should receive traffic.

PARISA: A process answering a basic health check isn't necessarily able to accept orders. Readiness checks need to reflect whether it can serve the relevant work, without becoming dangerously expensive themselves.

JULES: And deployment can stop sending new traffic to an instance while existing requests finish, where the platform supports graceful draining.

PARISA: The diagram grows from one application box to several equivalent copies. It doesn't create separate owners for menu and orders.

[CODE CARD: Horizontal replicas; architecture notation]
~~~text
Browsers -> Load balancer -> App instance A -> Shared database
                         -> App instance B -> Shared database
~~~

## State Is What Makes Copies Interesting

JULES: What if the cart or session lives only in instance A's memory?

PARISA: A request sent to B may not find it. We need a deliberate shared-state or credential design, or accept and manage that limitation.

JULES: What if uploads are on A's local disk?

PARISA: B may not see them, and replacement of A may lose them. Durable shared storage can be appropriate for files that must survive and be available across instances.

JULES: What if every instance starts the same scheduled job?

PARISA: We may send seven nightly receipts or run the same reconciliation seven times. Job coordination needs a design too.

JULES: Exactly. Stateless application instances means important persistent state isn't tied to one replaceable process. It doesn't mean the system has no state anywhere.

PARISA: The state has a home we must still operate. Usually more than one: database, session store, durable work queue, object storage where needed.

## The Database Doesn't Multiply by Accident

JULES: Add ten app instances, each with a large connection pool. What happens?

PARISA: We can exhaust database connections or overload the database. More callers can make the bottleneck worse.

JULES: So pool sizes and overall limits need coordination. Autoscaling the application isn't permission to create unlimited database demand.

PARISA: Read replicas can help some read workloads, with the lag considerations from Episode 8. They don't automatically distribute writes.

JULES: Partitioning or sharding divides data across boundaries. That can support certain scale requirements but makes cross-partition queries and transactions more complex.

PARISA: Before sharding the pizza shop, ask whether query improvements, a suitable index, better connection management, or vertical capacity solve the actual problem.

JULES: Exactly. Advanced techniques aren't bad. They are expensive enough to deserve evidence.

## Queues Absorb Bursts, Not Infinity

PARISA: We can move receipt sending out of the immediate request and into durable background work.

JULES: Workers process it at a manageable rate. A queue can smooth bursts when work can wait.

PARISA: But if work arrives faster than workers can finish indefinitely, the queue grows indefinitely. We haven't solved capacity; we've relocated the waiting room.

JULES: Monitor queue age as well as length. Ten slow jobs can be worse than a hundred tiny ones. Define acceptable delay and what happens when limits are reached.

PARISA: Backpressure means downstream capacity affects how much work we accept or send. We may slow producers, reject nonessential work, or limit concurrency.

JULES: For orders, capacity is also a product policy. If the kitchen is full, stop promising immediate delivery. Offer a later slot or an honest unavailable state.

PARISA: The queue cannot bake bread. We have tested this conceptually and declined the live experiment.

## Autoscaling Isn't Instant

JULES: Autoscaling changes capacity based on signals and policy. Useful, but new instances may take time to become ready.

PARISA: The signal may lag the demand. And scaling down too quickly can interrupt work if shutdown isn't handled well.

JULES: Choose metrics that reflect the workload. CPU isn't always the right signal for an application waiting on database or network resources.

PARISA: Set limits and consider cost. A broken loop can generate demand too. We don't want the system to interpret a bug as permission to spend without bounds.

JULES: Also test the full path. If app instances scale but the payment provider rate limit stays fixed, checkout still hits a ceiling.

## Capacity and Availability Are Different

PARISA: We added a second instance. Are we highly available now?

JULES: Maybe more resilient to one instance failing, but not necessarily to a shared database failure, network outage, or a bad deployment affecting both.

PARISA: Redundancy helps only against failures the copies don't share. Two servers on one failed dependency are two witnesses, not a recovery plan.

JULES: Multi-zone or multi-region designs can address some failure modes but introduce cost and data-coordination issues. Choose based on actual recovery requirements.

PARISA: Geographic distribution also changes latency and data handling. It's not a checkbox labeled globally good.

JULES: We don't need worldwide active-active writes for a neighborhood pizza shop. We do need a tested way to restore service and know when orders aren't being accepted.

## Load Testing With a Purpose

JULES: How would we test scaling without making up a reassuring number?

PARISA: Use a representative mix of operations in a safe environment. Include reads, submissions, realistic data size, and think time where relevant. Watch latency, errors, resource use, and correctness.

JULES: Don't send test purchases to real customers or live payment systems accidentally. Use the appropriate test integrations and data.

PARISA: Increase load to understand the knee where performance degrades. Then inspect the limiting resource. A successful test should tell us something actionable, not merely print a large requests-per-second figure.

JULES: Include failure and recovery where practical. What happens when one instance stops? Does the system recover after the burst? Does queued work drain?

PARISA: And verify no duplicate orders or corrupted state. A fast system that accepts every order three times is not performing well.

## Degrade Deliberately

JULES: Under pressure, what can we turn off?

PARISA: Nonessential recommendations, expensive reports, decorative live updates. Keep the critical ordering and staff workflows prioritized where possible.

JULES: But don't hide failure behind fake success. If order acceptance is unavailable, say so and provide a useful alternative if the business supports one.

PARISA: Accessible error communication matters more under failure, not less. A tiny red dot without text is not an outage policy.

JULES: Rate limiting can protect capacity and fairness. The response should make clear when retrying later is appropriate, without encouraging a retry storm.

PARISA: And distinguish abusive traffic from a legitimate customer who clicked twice because we never gave feedback.

## A Small Capacity Exercise

JULES: Let's use invented numbers strictly as a thought experiment. Suppose a worker takes about one second per job and processes one at a time. Roughly sixty jobs arrive each minute.

PARISA: Then we're already near its simple theoretical throughput, before variability and overhead. If some jobs take longer, waiting can grow. Running a system at its absolute limit leaves little room for bursts or failures.

JULES: If a hundred jobs arrive each minute, adding a queue doesn't make the worker process a hundred.

PARISA: Correct. The backlog grows because arrival exceeds completion. We need more effective processing capacity, less incoming work, or a different promise about delay and acceptance.

JULES: Could two workers solve it?

PARISA: Maybe, if jobs can run independently and the downstream service permits that concurrency. If both wait on one rate-limited provider, the bottleneck may remain.

JULES: So we don't infer real capacity from the worker count alone.

PARISA: Exactly. The arithmetic helps identify the question. Measurement in the actual system answers it. These numbers aren't benchmarks or restaurant forecasts.

JULES: And variability matters because averages can hide bursts.

PARISA: Yes. A restaurant doesn't receive one perfectly spaced order every few seconds because our spreadsheet would prefer that. People order when they get hungry, often together.

## Concurrency Isn't the Same as Speed

JULES: In Node, asynchronous I/O can let the process handle other work while waiting. Does that mean it scales CPU-heavy work automatically?

PARISA: No. JavaScript's async syntax doesn't make an expensive calculation free or automatically move it to another core. CPU-heavy work can still block the event loop if performed there.

JULES: So async and await are JavaScript syntax for promise-based flow, not a universal parallel-computation switch.

PARISA: Exactly. If route optimization is computationally expensive, we may need worker threads, separate processes, or a dedicated execution environment, depending on the implementation.

JULES: And if the application mostly waits on database calls, adding CPU may have limited benefit.

PARISA: Correct. Identify whether the workload is constrained by computation, memory, I/O, locks, external limits, or something else. “Slow” isn't a resource category.

JULES: This connects to our Node series without requiring a runtime internals lecture.

PARISA: Yes. The portable principle is to match the remedy to the bottleneck, not to the programming language's reputation.

## A Slow Dependency Uses Local Resources Too

JULES: The payment provider gets slow. Our app CPU is low, but requests pile up. Why does that still hurt?

PARISA: Pending requests consume memory, connections, and other resources. If we allow unlimited concurrent waits, we can exhaust capacity even without heavy computation.

JULES: Timeouts and concurrency limits bound that exposure.

PARISA: Yes, with a sensible outcome policy. A timeout doesn't undo a payment attempt, so we must preserve enough state to reconcile it. Resource protection and business correctness need to cooperate.

JULES: What if every layer retries? Browser retries, web app retries, service client retries.

PARISA: The effective load can multiply. Coordinate retries at an appropriate layer, bound them, and avoid repeating consequential operations without idempotency support.

JULES: Scaling the callers could actually worsen the provider overload.

PARISA: Exactly. More capacity upstream isn't always kindness downstream.

## The Cost Model Belongs on the Whiteboard

JULES: We rarely draw money on architecture diagrams.

PARISA: Yet the bill is one of the most reliable outputs. Compute, storage, data transfer, managed services, and staff time all contribute.

JULES: A managed service may cost more per unit but reduce operational work.

PARISA: Or a complicated self-managed system may look cheap until we count maintenance and incidents. We need the total cost under the actual team's constraints.

JULES: We shouldn't recommend a provider based on imaginary current prices in this episode.

PARISA: Correct. The principle is to measure expected usage and verify current pricing and limits when making a real purchase decision. The show is teaching the questions, not issuing a hosting quote.

JULES: Also put bounds on automatic growth.

PARISA: Yes. Budgets, alerts, and capacity limits can prevent a bug from becoming an enormous surprise. But a cost cap that shuts down ordering also has a business consequence. Agree on the policy.

## The Deployment Is Part of the Workload

JULES: A new release starts all instances at once. They all open connections and warm caches. Could deployment cause a capacity spike?

PARISA: Absolutely. Startup behavior can create bursts against shared dependencies. A staged rollout and bounded initialization can help, depending on the platform.

JULES: And replacing every instance simultaneously can remove capacity briefly.

PARISA: Yes. Graceful rollout policies, health checks, and enough temporary headroom can reduce disruption. But verify the platform's actual behavior rather than assuming a button labeled rolling guarantees no interruption.

JULES: Database migrations can also compete with normal traffic.

PARISA: Exactly. Some schema changes lock or rewrite data in ways that matter. Review them against the database and data size. Deployment is an operational event, not merely a file copy.

JULES: We can keep the architecture modest and still take releases seriously.

PARISA: We should. Simplicity makes those events easier to understand; it doesn't make them irrelevant.

## Decide What to Shed First

JULES: The system is overloaded. What work can we refuse or postpone?

PARISA: Start with business priorities. Public menu reads can be cached. Reports can wait. Recommendations can disappear gracefully. Order acceptance and staff fulfillment deserve protected capacity if possible.

JULES: What about polling the order status every second?

PARISA: Maybe the interval can be longer or adapt to state. A completed order doesn't need constant refresh. Better update design can reduce load without harming the task.

JULES: Could server-sent events or WebSockets help?

PARISA: They can support ongoing updates, but they introduce connection and operational considerations. Choose based on latency needs and scale, not because polling sounds old. We can explore the mechanisms separately later.

JULES: So even communication style is a workload decision.

PARISA: Exactly. A kitchen list that can be a few seconds behind has different needs from collaborative cursor movement in an editor.

## A Scaling Decision We Can Revisit

JULES: Suppose we add a second application instance and latency improves. Are we done?

PARISA: Verify correctness and the intended performance under representative load. Then document the limit and watch the relevant signals. Don't keep adding architecture once the requirement is met.

JULES: That's surprisingly hard. Once you start optimizing, every possible improvement looks urgent.

PARISA: Yes, but opportunity cost is real. Maybe the next useful work is a clearer checkout error, not another ten percent of throughput we don't need.

JULES: We can retain the measurements and revisit when demand changes.

PARISA: Exactly. A capacity plan is a living estimate based on evidence. It doesn't need to become a monument to hypothetical traffic.

JULES: And if the next measurement shows the database is limiting us, we investigate that specific path.

PARISA: Right. Scaling is iterative diagnosis, not a one-way march toward more distributed everything.

## The Decision for Nervous Robot

JULES: We measure first. Improve obvious repeated work. Cache eligible content. Keep the application modular. Add resources or replicas when the observed bottleneck justifies them.

PARISA: Put persistent state somewhere suitable for multiple instances before relying on them. Bound background work. Respect downstream limits. Test recovery.

JULES: No microservice requirement appears merely because traffic increased. Service separation might help a specific workload later, but it isn't the definition of scaling.

PARISA: And once the bottleneck is the oven, update the delivery promise. Architecture includes saying no before customers pay for imaginary capacity.

## The Performance Report We Would Believe

JULES: The team says, “We doubled capacity.” What evidence would make that statement meaningful?

PARISA: Define the workload, environment, success criteria, and before-and-after measurements. Did accepted order throughput improve while latency and error rates stayed within the requirement? Was correctness preserved?

JULES: If they only doubled the number of instances, that's a resource change, not proof of doubled capacity.

PARISA: Exactly. Shared dependencies, contention, and uneven traffic can prevent linear improvement. We should report what we measured rather than infer a flattering result from the architecture diagram.

JULES: And distinguish a controlled test from real production observation.

PARISA: Yes. Both are useful, but they have different limits. A test may omit real data patterns or third-party behavior. Production measurements may include changing workloads. State the context.

JULES: What if the requirement was already met before the change?

PARISA: Then ask whether the cost was justified by headroom, resilience, or another explicit need. More capacity can be useful, but we shouldn't spend effort only to make a graph look more heroic.

JULES: The restaurant wants reliable dinner, not a benchmark trophy.

PARISA: Precisely. A clear capacity margin and a recovery plan are worth more than an impressive number nobody can reproduce.

## The Human Limit

JULES: We improved the software, but staff still can't process the queue fast enough.

PARISA: Then examine the actual work. Maybe the interface hides urgent orders. Maybe assignment takes too many steps. Maybe the kitchen is simply at capacity. Those require different remedies.

JULES: A faster page can still present a terrible workflow.

PARISA: Exactly. Observe people using it. An automatic refresh that reorders rows while someone clicks can reduce throughput and create mistakes, even if every request is fast.

JULES: So performance includes task completion and error recovery, not merely network timings.

PARISA: Yes. The technical metrics help diagnose part of the system. They don't replace understanding the people and physical process the software supports.

JULES: And if capacity is genuinely exhausted, stop accepting impossible promises.

PARISA: Offer a later slot, limit orders, or explain unavailability according to the business policy. Honest backpressure at the product level is better than a very scalable apology generator.

JULES: I suspect the apology generator already has venture funding.

PARISA: It can wait in the queue.

## Closing — More of the Right Thing

JULES: Scaling is matching resources and design to increased work. Vertical adds capacity to a component; horizontal adds cooperating instances.

PARISA: Caching, query design, queues, state management, and limits determine whether that extra capacity helps.

JULES: Next time: SSR, CSR, SSG, and hydration. We'll finally organize the rendering alphabet soup into questions you can answer.

PARISA: And the database-shaped pizza?

JULES: Sold out.

PARISA: Good. The inventory constraint works.

[OUTRO MUSIC]

## Production Notes

- No capacity figures or benchmark claims are invented. Workloads are hypothetical.
- Availability, horizontal replication, and microservice decomposition are kept distinct.
- Infrastructure configuration and Kubernetes implementation remain outside this series.

## Production References

- Google SRE Book, Handling Overload: https://sre.google/sre-book/handling-overload/
- Google SRE Book, Monitoring Distributed Systems: https://sre.google/sre-book/monitoring-distributed-systems/
- PostgreSQL, Connection Settings: https://www.postgresql.org/docs/current/runtime-config-connection.html
