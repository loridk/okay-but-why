# Episode 12: Forward Deployed: Turning 'We Should Use AI' Into Something Useful

**Series:** AI
**Hosts:** Parisa, Jules; Sabrina cameo

[INTRO MUSIC]

JULES: Management has sent a message.

PARISA: If it says “we should add AI,” I'm forwarding all twelve episodes.

JULES: It says, “Can the support team find the right information and resolve questions without spending half the day searching?”

PARISA: Oh. A requirement. They've grown so much.

SABRINA: Brenda has also archived the obsolete policies.

PARISA: Somebody get Brenda a chair with proper lumbar support. She's carried this organization long enough.

JULES: Welcome to the finale of our AI series. No pile of new acronyms today. We're putting the journey together.

## Discovery Is Engineering Work

PARISA: We began with a technology request. The useful response was “To do what?” That wasn't obstruction. It was finding something we could actually build and evaluate.

JULES: We would observe support employees working, ask what information they need, and identify where delays and mistakes happen. We would talk to the people responsible for policies, systems, security, and operations as well as management.

SABRINA: Because the person buying the tool and the person using it might describe the problem differently. “Faster replies” could conceal “I can't find the exception that stops me giving a wrong answer.”

PARISA: Exactly. Establish a baseline: time spent searching, answer quality, escalations, and the consequences of mistakes. We haven't measured those at a real company in this fictional case. We would need to.

JULES: We could define success as reducing unnecessary search work while maintaining answer quality and protecting access. Actual thresholds would be agreed with stakeholders using evidence, not invented because a pitch needs a percentage.

PARISA: And identify non-goals. First version helps internal staff find evidence and draft answers. It doesn't autonomously contact customers or issue refunds.

## Scope Before a Cathedral

JULES: Our first prototype used a short approved policy and invented question with an existing model. That tested one question: can generation make the information easier to use?

PARISA: It wasn't proof that we could safely integrate every company system. It was a small experiment with a specific learning objective.

SABRINA: If search improvements alone solve the problem, we can stop there. If generated synthesis adds value, continue. Neither outcome means the experiment failed.

JULES: Then architecture follows the evidence. Browser to our backend. Authentication and authorization. Approved model access. Retrieval for current documents. Controlled tools for live records. A usable interface that shows sources and uncertainty.

PARISA: MCP only where a shared integration boundary earns its place. Agentic investigation only where variable paths help more than a predefined workflow. The if statement keeps its office.

## Follow One Case From Start to Finish

JULES: Let's walk through the mature teaching design. An authenticated support employee asks whether a delayed shipment qualifies for a shipping-fee refund.

PARISA: The backend determines their identity and scope. Retrieval finds current, applicable policy passages they may access. A permitted order lookup obtains the live facts. We don't ask the model to guess either source.

SABRINA: The model receives the relevant evidence and task instructions. It drafts an explanation, cites the policy, and identifies anything missing. If an investigation needs another permitted lookup, a bounded controller can allow it.

PARISA: The interface shows the draft and source links accessibly. Partial output is labeled. The employee can inspect the evidence and correct or reject the draft.

JULES: If a refund is proposed, the system presents the exact action and consequences. An authorized person approves it through the application. The backend rechecks eligibility, permissions, and current state before a controlled execution.

PARISA: The authoritative service reports whether it happened. We store and show the actual outcome. We don't let a generated sentence saying “done” stand in for a transaction record.

SABRINA: Evaluation covers both answer quality and the action path. Monitoring helps spot failures. Feedback informs changes to prompts, retrieval, tools, or even the original scope.

JULES: That whole arrangement is the useful system. The model is one component.

PARISA: Look how much is ordinary software: UI, server, database, identity, search, APIs, permissions, validation, logs, deployment, error handling.

JULES: The AI-specific knowledge helps us understand the new component's behavior and limits. It doesn't make the rest of software engineering optional.

## What Does Forward Deployed Mean Here?

SABRINA: So which job title belongs to the person who moves between the support team, the code, and the deployment?

JULES: One title is Forward Deployed Engineer, often shortened to FDE. Companies define it differently, but a common emphasis is working closely with customers or operational users to discover concrete problems and build, integrate, and deliver working solutions in their environment.

PARISA: So not just explaining the product, and not just throwing a prototype over a fence. There is hands-on engineering plus the work of understanding the actual setting.

JULES: Yes. The balance varies: some roles emphasize substantial software development, some deployment and integration, some particular products or domains. The title isn't restricted to AI, and it doesn't by itself tell us the exact responsibilities.

SABRINA: Our Support Assistant journey is an FDE-style journey because we're translating a messy operational problem into a scoped implementation, testing it with users, and making it work in their systems.

PARISA: Including telling people when the requested AI feature isn't the best answer.

JULES: Exactly. Working close to the problem should improve engineering judgment, not require saying yes to every technology request.

## Titles Are Emphases, Not Walls

PARISA: How does that compare with Software Engineer?

JULES: Software engineers design, build, test, and maintain software. Many also do discovery, user research, integration, and operations. FDE often emphasizes customer-embedded delivery or adapting a platform to concrete environments, but there's substantial overlap.

SABRINA: And AI or ML Engineer?

JULES: Depending on the company, that may emphasize data pipelines, training, model adaptation, evaluation, serving, or building applications around existing models. Some roles are close to modeling; others are applied software engineering. Read the actual responsibilities.

PARISA: So building this TypeScript application around an existing model does not mean we personally trained a foundation model. Describe the work truthfully.

JULES: Right. A Solutions Architect commonly emphasizes requirements, system design, tradeoffs, integration choices, and technical guidance. Some build proofs of concept or production components; ownership varies, and some work closely with sales or customer success.

SABRINA: Not “the person who draws boxes and never codes.”

PARISA: Nor is coding the only useful technical contribution. A well-reasoned decision that avoids six months of unnecessary infrastructure is fairly valuable.

JULES: Developer Relations, including developer advocacy roles, emphasizes relationships with developer users: education, examples, documentation, community, and bringing feedback into the product. Some advocates do substantial engineering. They generally have a different center of responsibility from delivering one customer's operational system.

SABRINA: These can all meet at the same problem. The names don't establish a hierarchy of who is a real engineer.

PARISA: And no title automatically means someone owns everything. We still need explicit ownership for security decisions, operations, business rules, and maintenance.

## Getting It Used Is Part of Finishing

JULES: Imagine we ship the perfect architecture and employees ignore it.

PARISA: Perhaps it adds another tab and asks them to retype information the ticket already contains. Perhaps it takes longer to verify than ordinary search. Perhaps they can't use it with their keyboard.

SABRINA: Or management announced “automation” and people reasonably worry about how their work and judgment will be treated. Adoption needs honest communication, not just a tutorial tooltip.

JULES: We involve users early, explain the limits, fit the real workflow, and provide a clear way to report problems. We measure the actual outcome, including review burden and accessibility.

PARISA: And keep people able to use the ordinary path when the assistant fails. A tool that helps on good days but blocks work on bad days has hidden costs.

JULES: Feedback might reveal a missing policy owner rather than a prompt problem. It might reveal that one task needs a deterministic form instead of a conversation.

SABRINA: Useful patterns can become reusable product improvements. But we don't generalize every customer-specific exception into a new platform before a second need exists.

PARISA: Small working solutions still count. Especially when they stay understandable enough for someone else to maintain.

## The Questions We Keep

JULES: Before adding AI: what task is difficult, who experiences the difficulty, and what would improvement look like?

PARISA: Is the information available, accurate, current, and authorized? Could ordinary search or deterministic code solve it? What mistakes are tolerable, and which must be prevented by controls?

SABRINA: How will we evaluate it? What happens when evidence is missing or a dependency fails? Who reviews proposed actions? Who can operate and maintain the result?

JULES: And what would make us stop, change direction, or remove the AI component?

PARISA: That's not pessimism. That's having an exit other than pretending the demo is still going well.

## The Requirement

JULES: We started by asking what AI is. We learned how models are trained and used, why context matters, and how retrieval and tools connect generation to actual information and controlled capabilities.

SABRINA: Then we looked at integration, bounded autonomy, evaluation, security, and the less glamorous work of keeping it useful for real people.

PARISA: Brenda's documents needed ownership. The order lookup needed authorization. The confirmation needed a label. The system needed a way to fail. None of those were solved by making the model sound more confident.

JULES: But used in the right place, it could help a support employee turn scattered evidence into a clear answer.

PARISA: That's worth exploring. And worth measuring honestly.

SABRINA: Does management finally get its AI?

PARISA: Management gets a solution to the support problem, if the evidence says we've built one. Technology is not the requirement. The problem is the requirement.

JULES: Okay.

PARISA: Now we know why.

[OUTRO MUSIC]
