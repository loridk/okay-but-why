# Episode 11: From Demo to Production: Oh Shit, People Are Actually Using It

**Series:** AI
**Hosts:** Parisa, Jules; Sabrina cameo

[INTRO MUSIC]

PARISA: The pilot team likes Support Assistant. Now more employees want access.

JULES: That's good.

PARISA: The provider has rate-limited us, the answers take too long, and someone enabled full request logging.

JULES: That's less good.

PARISA: Welcome to Okay, But Why? The model has met operations. Operations would like a word.

## Measure the Whole Task

JULES: Start with latency. We care about time to useful output and time to a complete, verified result. A fast first token doesn't make a twelve-step investigation fast.

PARISA: Trace where time goes: authentication, search, model calls, tool calls, human approval. Look at the slow tail as well as the average. Employees who get the worst waits also exist.

JULES: We might reduce irrelevant context, shorten unnecessary output, choose a faster model for an appropriate subtask, or avoid extra model calls. Independent read operations might run concurrently when access and dependency rules allow it.

PARISA: We don't parallelize a refund and its approval. Dependencies are real even when the diagram has attractive arrows.

JULES: Correct. Set deadlines, allow cancellation where possible, and explain what is still running. Rate limits require bounded backoff and appropriate queuing or backpressure, not an enthusiastic retry storm.

PARISA: Put limits on concurrent work and per-user usage. Scaling our web servers doesn't automatically increase the provider's quota.

## Cost per Useful Outcome

JULES: The companion has a deliberately fictional pricing calculation. Multiply input tokens by the input rate, output tokens by the output rate, and include repeated calls. Then add the rest of the system's cost.

PARISA: Retrieval, storage, hosting, monitoring, integration maintenance, and human review. A cheap model that creates expensive corrections may lose the comparison.

JULES: Exactly. We can test routing easier tasks to a smaller or less expensive model, but the router itself can make mistakes, and every path needs evaluation.

PARISA: Model choice also includes languages, context, tool behavior, output constraints, data handling, availability, and migration effort. We don't choose solely by a leaderboard unrelated to support work.

JULES: Provider or model changes need regression checks and a rollout plan. Even a compatible API shape doesn't promise equivalent behavior.

## Caches Have Memory and Problems

PARISA: Can we cache answers?

JULES: Sometimes. But caching a generated answer for one employee and showing it to another can leak data or preserve obsolete policy. Keys and validation need to account for relevant permissions, tenant, source versions, model or prompt versions, and freshness.

PARISA: Sometimes the correct answer is don't cache that result. An order status changes. A policy answer may be reusable only under narrow conditions.

JULES: Right. Retrieval caches, application answer caches, and provider prompt caching are different mechanisms. Prompt caching can reduce repeated input processing under a provider's rules; it doesn't mean our application received a previously verified answer.

PARISA: Permission revocation and source deletion need to affect cached information too. A cache is not a loophole through which yesterday's access remains forever.

## Fallbacks Must Keep Their Promises

JULES: If the model provider fails, one fallback is ordinary search. Another might be an approved alternative model, tested for this task.

PARISA: But not silently sending private data to another company because the first one is down. An approved data path doesn't automatically transfer to every fallback.

JULES: Exactly. A degraded mode could show sources without drafting an answer, or preserve the request for the user to retry. State what failed and whether any action occurred.

PARISA: And reconcile uncertain writes with the authoritative service. We don't ask a language model to guess whether a refund completed during a timeout.

JULES: The database or transaction service is the source of truth for the action state.

## Can We Run It Ourselves?

SABRINA: I've brought the local-model question. If we run the model ourselves, do the provider and privacy problems disappear?

PARISA: Some responsibilities move. Very few disappear.

JULES: A hosted model API puts model serving largely with a provider. A self-hosted deployment puts more of that work with us, whether it's on an employee's machine or our own cloud infrastructure.

SABRINA: And open-weight means the model's learned weights are available under its license. It doesn't automatically mean every part of its training data or process is public, or that its license meets every definition of open source.

PARISA: We check the actual license and permitted uses. “Download” is not a licensing category.

JULES: Exactly. Local and open-weight aren't synonyms either. Open-weight models can be hosted by a service, and local execution depends on what software and weights are available to us.

SABRINA: Tools such as Ollama can help run supported models, while the Hugging Face ecosystem provides model distribution and tooling. Specific supported models, hardware requirements, and cloud features change. We verify the deployment we actually use.

PARISA: So don't assume a product is fully offline because one mode runs locally. Check network calls, cloud options, telemetry, updates, integrations, and where prompts and logs go.

## Why GPUs, and What Is Quantization?

JULES: Neural-network inference involves lots of numerical computation. GPUs are useful because they can perform many relevant operations in parallel. But memory capacity and bandwidth matter too, not just a large number on a graphics-card box.

PARISA: The model's weights have to fit somewhere, along with working memory. Longer context and simultaneous requests can increase memory use.

SABRINA: Some models can run on CPUs or other accelerators, depending on size, format, and runtime, but performance varies. “It loaded” is not a latency benchmark.

JULES: Quantization represents model values with lower precision, often reducing memory requirements and sometimes improving speed with suitable hardware and software. It can affect quality, and the tradeoff depends on the method and workload.

PARISA: Like storing numerical values less precisely, not putting the entire intelligence into a ZIP file and expecting identical behavior.

JULES: Right. A four-bit model doesn't imply every runtime allocation is exactly four bits per original parameter. There are scales, metadata, caches, and other overheads.

SABRINA: So benchmark the exact quantized model on our support examples and target hardware. We don't inherit an unquantized model's evaluation results by association.

## Privacy Needs a System Diagram

PARISA: Self-hosting can give us more control over where inference runs and who operates it. It can also give us patching, capacity planning, access control, backups, and an on-call problem.

JULES: Yes. Cost shifts toward hardware or rented compute, energy, serving infrastructure, and staff time. It isn't automatically free or cheaper at our workload.

SABRINA: And keeping inference local doesn't protect a laptop whose logs expose customer records, or a model server listening on a public interface without appropriate protection.

PARISA: Our Containers & Infrastructure series already gave us the questions: where does it run, who can reach it, who owns it, how do we observe and recover it? Adding a GPU doesn't waive the questions.

JULES: Nor does it automatically require Kubernetes. Choose operational complexity based on workload and the team's ability to sustain it.

## Roll Out Something We Can Support

JULES: For Support Assistant, we can start with a limited group, representative tasks, clear boundaries, a rollback path, and an owner for quality and incidents. Record prompt, model, retrieval, and tool versions for diagnosis.

PARISA: Log enough to investigate, not every private fact by default. Set retention and access deliberately. Show when evidence was retrieved and make sources usable by keyboard and assistive technology.

SABRINA: Collect feedback that tells us what failed: wrong policy, missing source, confusing wording, inaccessible interaction, slow response. A thumbs-down alone can be hard to act on.

JULES: And watch whether the tool actually helps employees. Adoption is not simply the number of accounts provisioned.

PARISA: We're back to servers, latency, security, monitoring, and bills. The model is one dependency in a larger system.

JULES: Final episode next. Who turns “we should use AI” into this whole useful, maintainable arrangement?

PARISA: Someone willing to ask the awkward first question again.

[OUTRO MUSIC]
