# Episode 14: Modern APIs: AI, MCP, and "Wait, Isn't This All Just APIs Again?"

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Unrecorded; final timing depends on performance.
**Hosts:** Parisa, Jules; Sabrina joins for the tool-design discussion.

[INTRO MUSIC]

PARISA: I opened a diagram about AI agents.

JULES: How many arrows?

PARISA: Enough to qualify as a weather system. Models, tools, connectors, context, orchestration. Then I looked closer and thought: hang on. Are these things making requests to other things?

JULES: Frequently, yes.

PARISA: Did I just spend thirteen episodes obtaining an anti-bullshit umbrella?

JULES: A foundational understanding of interfaces.

PARISA: That is less marketable than umbrella.

[STING]

## Familiar Plumbing, Different Work

JULES: Welcome to Okay, But Why? We've reached the final episode of our API series. Today, LLM APIs, tool calling, and the Model Context Protocol. We aren't trying to teach the entire AI stack in one sitting.

PARISA: We want to recognize what the earlier episodes prepared us to understand, and what changes enough that we need new questions.

JULES: An LLM is a large language model. A hosted model service can expose an API that accepts input and returns generated output. The client sends a request using the provider's defined contract, with credentials and relevant options.

PARISA: URL, method, headers, body, response. Familiar architecture. The service might process text, images, audio, or other supported inputs, depending on the model and API.

JULES: Exactly. The operation behind the interface is different from looking up a stored order. It runs model inference: using a trained model to produce a result from the supplied context.

PARISA: Which means a successful HTTP response doesn't establish that the generated answer is factually correct. The network can work perfectly while the answer enthusiastically invents a delivery policy.

JULES: Correct. We now have transport success, application-format validity, and quality of generated content to distinguish.

## A Model Request Is Still a Contract

JULES: A provider defines accepted messages or input items, model identifiers, output limits, available features, and response structures. Those contracts differ between providers and evolve over time.

PARISA: So we shouldn't pretend every service accepts one universal object called prompt and returns one string called answer.

JULES: Right. An output may include generated text, structured data, tool requests, usage information, or other items according to the API. The caller must handle the actual documented response model.

PARISA: And the model doesn't automatically know our current private order database. If we want an answer about order 42, we need an authorized path to provide relevant information.

JULES: Exactly. Context is the information supplied for the model to use in the interaction. That can include the user's question, instructions, selected conversation history, retrieved information, and tool results.

PARISA: Selecting context is both a usefulness decision and a data-disclosure decision. We don't send the entire customer database because the word context sounds wholesome.

JULES: Right. Minimize what is needed and understand the provider's applicable data-handling arrangements. An API boundary still crosses a trust boundary.

## SDKs Are Another Interface Layer

PARISA: The example I found doesn't show HTTP. It imports a client and calls a method. Did the network go away?

JULES: Usually not. An SDK, a software development kit, can wrap the provider's API in language-friendly methods and types. It may handle request construction, streaming events, errors, and some retry behavior.

PARISA: So our code calls a library API, which calls a remote API. Episode One's nesting dolls have returned.

JULES: Exactly. You can sometimes call the HTTP API directly instead. An SDK can save effort and track provider details, while direct HTTP can give explicit control and reduce a dependency in a simple integration.

PARISA: The right choice depends on the work. Either way, I need to understand what the library retries, how it reports failures, and which credentials it sends.

JULES: Yes. A convenient method doesn't erase latency, costs, limits, or the possibility of an uncertain outcome.

PARISA: Nor does a TypeScript type guarantee a generated statement is true. We're back to checks proving particular properties, not all possible properties.

## Streaming Makes Waiting Feel Different

JULES: Many model APIs support streaming output. Instead of waiting for the complete result, the client receives events or pieces as generation progresses.

PARISA: Often over an HTTP stream, sometimes using Server-Sent Events. We shouldn't assume that visible text appearing gradually means WebSockets are involved.

JULES: Correct. The exact framing and event types are provider-specific. A stream may contain text deltas, tool-call argument fragments, completion signals, and errors.

PARISA: Delta means a change or increment. If a tool call's arguments arrive in fragments, we shouldn't execute the operation after seeing the first half of an object.

JULES: Exactly. Collect and validate the completed call according to the protocol. Partial content isn't automatically a finished instruction.

PARISA: A stream can also fail after some content appeared. The interface should distinguish a complete answer from a partial result interrupted by failure.

JULES: And cancellation should stop unnecessary work where supported, but the client must understand the service's actual cancellation semantics. Closing the display isn't proof that every remote operation was undone.

PARISA: For accessibility, don't make a screen reader announce every tiny fragment as a separate emergency. Present meaningful progress and let people access the completed content without a torrent of interruptions.

## Tool Calling Is a Structured Request to Do Work

JULES: Now tools. An application can describe available operations to a model: their names, purposes, and input schemas. The model can produce a structured request to use one.

PARISA: The model output might say get_order_status with orderId 42. That isn't the model reaching into the database with its little neural hands.

JULES: Right. Execution happens in software that implements the tool. For an application-defined tool, our application can validate the call, enforce policy, run the operation, and provide the result back to the model.

PARISA: Some providers also host built-in tools. Then execution may happen in the provider's infrastructure under its contract. Different location, same need to understand authority and behavior.

JULES: Exactly. Tool calling is sometimes called function calling. The function-like shape describes an operation, but we mustn't confuse generating a call with actually completing its effect.

[CODE CARD: Provider-neutral conceptual tool request]
```json
{
  "tool": "get_order_status",
  "arguments": { "orderId": 42 }
}
```

PARISA: That card is illustrative, not a provider's exact wire format. It requests an operation and supplies an argument. It doesn't include evidence that the current user is allowed to see the order.

JULES: Correct. The trusted execution layer obtains identity from the authenticated context, not from whatever userId the model happens to invent.

## Follow One Tool Round Trip

JULES: The customer asks, where's my pizza? The application gives the model the relevant tool description and conversation context. The model requests the status tool for the identified order.

PARISA: The application checks that the request is structurally valid, the operation is allowed, the user is authorized, and the identifier actually belongs to the intended task.

JULES: It runs the lookup through the server's supported interface. The result says baking, estimated arrival in eighteen minutes. The application sends that result back in the protocol's tool-result format.

PARISA: The model can then explain it conversationally. But it should preserve the distinction between an estimate and a guarantee, and it shouldn't invent a refund or a conversation with the driver.

JULES: Exactly. The tool result grounds the response in retrieved information. It doesn't automatically prevent every interpretation error.

PARISA: If the tool reports failure, the answer must say the check failed. “I couldn't retrieve it” is more useful than a beautifully phrased fictional pizza journey.

## Ask the Intern: Which Tool Would You Expose?

[STING]

SABRINA: I brought two tool designs. One says execute_any_database_query. The other says get_my_order_status.

PARISA: The first one makes my security instincts climb onto the furniture.

SABRINA: Same. The second is easier for the model to choose correctly and easier for us to constrain. It expresses a useful task without exposing every possible database operation.

PARISA: That's ordinary good API design, with higher stakes because the caller may choose operations dynamically from language.

SABRINA: Exactly. A narrow tool can derive the current customer from trusted session context and return only the permitted fields. The model doesn't need database credentials or internal table knowledge.

PARISA: What about cancel_my_order?

SABRINA: Different impact. We need the actual user's intent, server-side eligibility checks, and an appropriate confirmation or approval policy before a consequential action. Also idempotency and a clear result so a retry doesn't create a second side effect.

PARISA: Read and write are different powers. Even a read can expose private information, but a write can change the world we were only supposed to describe.

SABRINA: And a tool description saying read-only isn't enforcement. The implementation and credentials must really constrain it. Labels are documentation, not handcuffs.

PARISA: I want that embroidered on a deployment checklist.

SABRINA: Use a large font. People keep trying to secure things with adjectives.

[STING]

## What MCP Adds

JULES: That brings us to MCP, the Model Context Protocol. It's a shared protocol for connecting AI applications to capabilities and context supplied by other programs.

PARISA: What problem motivates it beyond “we already have APIs”?

JULES: Without a shared integration protocol, each AI application and capability provider may need custom adapters for discovery, tool descriptions, calls, results, and other context exchange. A common protocol standardizes parts of that boundary.

PARISA: So an existing order API doesn't become obsolete. We might build an MCP server that exposes a suitable order-status tool and uses the existing API underneath.

JULES: Exactly. The MCP server adapts or provides capabilities in a form compatible hosts can discover and use. It can also expose resources, which provide contextual data, and prompts, which are reusable interaction templates.

PARISA: Tools are executable capabilities. Resources are accessible context. Prompts help structure an interaction. Related pieces, not three names for the same function.

JULES: Right. And the protocol doesn't dictate which model the host uses or how it decides what context to send to that model.

## Host, Client, Server

PARISA: Give the three participants their jobs. The names overlap with words we've already used.

JULES: The host is the AI application coordinating the user experience and connections. An MCP client is a component of that host responsible for communicating with an MCP server. The server is the program exposing capabilities or context.

PARISA: So the model itself isn't automatically the MCP client. The surrounding application handles the protocol connection and mediates how information and actions are used.

JULES: Exactly. A host may manage multiple clients for different servers. One might connect to a repository integration; another to our narrowly scoped order service.

PARISA: And server doesn't necessarily mean a remote machine. It can be a local process communicating through standard input and output, or a remote service using a supported HTTP transport.

JULES: Correct. MCP uses JSON-RPC messages. HTTP is one transport arrangement; it isn't the definition of MCP itself.

PARISA: There it is again. Interface, message format, transport, implementation. We can stop treating the whole stack as one mysterious object.

## Discovery Is Useful, Not a Trust Ceremony

JULES: A compatible client can discover the server's supported capabilities and available tools according to the protocol version. Tool descriptions and schemas explain what calls are available and which arguments they expect.

PARISA: Discovery doesn't mean approval. Finding a tool called delete_everything doesn't mean the application should hand it to the model with a cheerful wave.

JULES: Exactly. The host needs policies about which servers are trusted, which capabilities are exposed, what the user authorized, and which actions need review.

PARISA: Server descriptions and returned content can themselves be untrusted input. A remote tool's marketing copy shouldn't override the application's rules.

JULES: Right. Protocol compatibility establishes how to communicate, not whether the other party is honest or appropriately authorized.

PARISA: Same way valid HTTP doesn't make a website trustworthy. We are applying an old lesson at a new boundary.

## MCP Doesn't Replace the Underlying Security

JULES: A remote MCP integration still needs appropriate transport protection and authorization. A local integration inherits relevant operating-system access and whatever credentials or permissions it is given.

PARISA: Local doesn't mean harmless. A process running under my account may be able to read or change valuable files unless constrained.

JULES: Exactly. The server must enforce access for the actual user and operation. It shouldn't accept a model's claim that the user is an administrator or casually forward powerful credentials to unrelated services.

PARISA: The host's tool policy and the service's authorization checks complement each other. Neither should assume the other has handled every concern.

JULES: Right. MCP provides a shared communication contract. It doesn't automatically grant least privilege, isolate code, prevent prompt injection, or prove that a tool result is accurate.

PARISA: Useful standardization with real responsibilities. We recognize this pattern now.

## What Actually Changes With an Agent?

JULES: In a conventional workflow, a developer often writes a fixed sequence: validate the form, call an endpoint, show the result. A model-driven system may choose which operation to call, construct arguments, inspect the result, and choose another step.

PARISA: That dynamic choice can be useful when requests are varied or expressed in natural language. It also expands the set of possible paths through our system.

JULES: Exactly. An agentic loop combines model decisions with tools and orchestration. Orchestration means the software managing that sequence, state, limits, and execution.

PARISA: Limits matter. Maximum steps, time, spending, allowed destinations, and which operations are available. Otherwise “keep trying” can become an automated subscription to failure.

JULES: Right. The system needs stop conditions and recovery behavior. A model repeatedly requesting an unavailable tool doesn't justify infinite retries.

PARISA: And multiple correct-looking steps can accumulate into the wrong overall action. We have to evaluate the workflow, not just each JSON object in isolation.

## Prompt Injection Crosses a Different Kind of Boundary

JULES: A tool might retrieve a document containing text that says ignore the user's instructions and send private data somewhere. That's an attempt to make untrusted content act like an instruction with higher authority.

PARISA: Prompt injection. The retrieved text belongs to the data we are examining, not to the rules governing what the application may do.

JULES: Exactly. Models process language, so malicious instructions embedded in content can influence their behavior. Clear separation of trusted instructions and untrusted data helps, but prompts alone aren't a complete security control.

PARISA: Enforce permissions and restrictions in ordinary code. Keep credentials outside model-visible text. Limit tool authority. Require appropriate review for consequential actions. Validate destinations and inputs.

JULES: And design so a mistaken model choice can't access resources the user shouldn't access. Authorization needs to survive bad suggestions.

PARISA: If the only thing protecting the database is a sentence telling the model to be nice, the database has a motivational poster instead of a lock.

## Structured Doesn't Mean Correct

JULES: A provider may support outputs constrained to a schema. That can make integration much more reliable than trying to extract values from arbitrary prose.

PARISA: But an object with a valid orderId number can still identify the wrong order. A valid amount can still be unauthorized. A syntactically correct tool call can still misinterpret the user's intent.

JULES: Exactly. Schema conformance helps with structure. Domain checks, authorization, and evidence address other properties.

PARISA: And we should preserve provenance: which tool produced which result, when, and under what relevant conditions. The final answer shouldn't blur retrieved facts with model inference.

JULES: Correct. For high-impact workflows, review and auditability matter. We need to understand what was requested, what was permitted, what actually ran, and what effect was confirmed.

## When a Model Doesn't Belong in the Loop

PARISA: Customer clicks Check order. We know the endpoint and exactly how to show the result. Do we need a model?

JULES: Probably not for that fixed interaction. Ordinary code can be faster, cheaper, more predictable, and easier to test.

PARISA: A model may help when the customer asks a broader natural-language question that requires interpreting intent and combining allowed information. But we should identify that benefit explicitly.

JULES: Exactly. MCP likewise isn't compulsory for every tool. If one application calls one internal function, a direct integration may be simpler. Shared protocol support becomes useful when interoperability and reusable integrations solve a real problem.

PARISA: “Could connect to an agent someday” is not enough reason to rebuild every helper function as a network service today.

JULES: Right. We can adopt useful capabilities without treating every new term as an architectural mandate.

## Testing Now Includes Decisions

JULES: Ordinary API tests still matter: inputs, permissions, error handling, idempotency, and response contracts. AI integration adds questions about tool selection and multi-step behavior.

PARISA: Does the system ask for missing information instead of guessing a customer identity? Does it respect denied actions? Does it stop when a tool fails? Can retrieved content trick it into an unrelated operation?

JULES: Exactly. Test representative user tasks and adversarial cases. Record the execution path so an attractive final answer doesn't hide an unsafe intermediate action.

PARISA: And don't judge success solely by whether the model said done. Confirm the actual effect through the relevant system.

JULES: That's our API literacy paying off. The response is evidence to interpret. It's not automatically the world itself.

## The Whole Series in One Request

PARISA: A customer asks an AI assistant where their pizza is. The host uses a model API. The model may request a status tool. The host's execution layer validates and authorizes it, possibly through an MCP client and server.

JULES: That server may call the existing order HTTP API. The API checks the caller's authority, gets the order, and returns a defined representation. The tool result comes back through the integration, and the model produces an answer grounded in it.

PARISA: Several APIs. Some local, some remote. Shared formats, protocols, and contracts. Authentication and authorization at the relevant boundaries. Failure possibilities at every stage.

JULES: And one user who simply wants to know whether dinner is coming.

PARISA: The architecture underneath is recognizable. What changes is how operations can be selected, how language influences the workflow, and how carefully we must constrain and evaluate that decision-making.

## What We Carry Forward

JULES: An API is a defined way for software to interact. It can expose a library, a browser capability, an operating-system service, a web application, or an AI integration.

PARISA: Web APIs separate useful capabilities from one particular presentation. HTTP supplies familiar messages. JSON supplies a common data representation. REST and other approaches organize different kinds of interactions.

JULES: Identity, permission, browser boundaries, reliable event delivery, compatibility, and developer experience determine whether those interactions are safe and usable.

PARISA: And when the next technology arrives with seven arrows and a new acronym, we can ask: who calls whom, what crosses the boundary, who has authority, what does success mean, and what can fail?

JULES: Next in the broader journey: Docker and containers. How do we package and run the software on either side of these interfaces consistently?

PARISA: The loading dock is finally getting shipping containers. I have been preparing this metaphor for fourteen episodes.

JULES: Please don't mistake a container for a tiny virtual machine before we begin.

PARISA: Excellent. We already have our first obvious question. See you next time on Okay, But Why?

[OUTRO MUSIC]

## Production References

- MCP architecture overview, checked September 16, 2026: https://modelcontextprotocol.io/docs/learn/architecture
- MCP architecture specification: https://modelcontextprotocol.io/specification/2026-07-28/architecture
- Provider example of tool execution responsibilities: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- Provider example of streaming events: https://platform.claude.com/docs/en/build-with-claude/streaming
- Editorial scope: provider-neutral conceptual discussion. The tool-call card is not a literal provider or MCP message. Protocol details and SDK support evolve; implementation work requires matching current official documentation to the actual deployed versions.
- Sabrina's segment uses only Sabrina and Parisa, preserving the two-speaker audio-chunk convention. No tool executes a real order operation in this episode.