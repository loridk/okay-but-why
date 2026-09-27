# Episode 5: Putting AI in Software: Models, APIs & SDKs

**Series:** AI
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: Our prompt experiment can produce a useful draft from a sample policy. Management has asked when the application will be ready.

JULES: We have a text box and optimism.

PARISA: Two important dependencies. Neither handles authentication.

JULES: Welcome to Okay, But Why? Today we put the model in software. An alarming amount of this will look like software development.

## The Model Is Behind an Interface

PARISA: I use a chat website. How does my own application get that capability? Am I automating the website?

JULES: Usually, no. A model provider exposes an API. Our server sends a request describing the input and options, and receives generated output or an error. A chat product and an API can have different features, billing, limits, and data policies even when offered by the same company.

PARISA: So the product's search, memory, or uploaded-file behavior isn't necessarily bundled into a bare model request.

JULES: Exactly. We choose what our own application supplies. Provider request shapes vary, but conceptually we send a model choice, instructions or messages, relevant context, and supported generation options.

PARISA: The response may contain text, structured data, or later, a request to use a tool. Plus usage information and metadata, depending on the API.

JULES: Right. An SDK is a software library that wraps that API for a language. It can provide types, convenient methods, streaming helpers, and error handling. It doesn't turn the network call into something mystical.

PARISA: Nor does it eliminate outages. “But the function name was friendly” is rarely accepted by incident review.

## Which Computer Holds the Secret?

JULES: Our simplest architecture has three stops. Browser, our application server, model provider. The browser sends the user's question to our server. Our server authenticates the user, checks what they may access, assembles the request, and calls the provider.

PARISA: The provider's secret API key stays on the server, in suitable secret configuration. Never embedded in browser JavaScript. Bundling it doesn't hide it. A frontend environment variable doesn't become private because its name contains the word secret.

JULES: Yes. And our server endpoint isn't safe merely because it hides the key. It needs access controls and limits so strangers can't use it as our publicly funded robot vending machine.

PARISA: We also control which data goes out. A user authorized to open a ticket isn't automatically authorized to transmit every attachment to every provider.

JULES: Correct. We choose approved data handling and provider arrangements for the task. We can start experiments with invented records while those decisions are being made.

PARISA: Chef Nervous Robot callback: the interesting trick might be the generated recipe or suggestion, but there still has to be a sensible boundary between the interface and the service doing the generation.

JULES: Exactly. We're recalling the model-powered feature, not assuming a particular implementation. Support Assistant has the same architectural question: what should the browser ask our server to do?

## Wait, That's Just JavaScript

PARISA: The companion has a small TypeScript function that sends a question to our own server endpoint. I see an async function, await, fetch, and response checking.

JULES: All JavaScript features. Async makes the function return a promise. Await pauses that function's progress until the promise settles; it doesn't freeze the whole browser. Fetch performs the request.

PARISA: The type annotations are TypeScript. The object with the question is JavaScript. Turning that object into JSON is also JavaScript. We have successfully resisted inventing an AI dialect.

JULES: And when the response arrives, we treat its body as unknown until we check its shape. A type annotation doesn't validate bytes from a server.

PARISA: We're checking that it contains an answer string. That still doesn't prove the answer is correct. Shape validation and factual evaluation are different jobs.

JULES: Exactly. The example calls our fictional endpoint; it isn't pretending that all model vendors share one endpoint or response format. A server-side adapter would translate our application request into the selected provider's current API.

PARISA: Useful seam. We can test our own request handling with a fake response, without spending money or sending customer data during every unit test.

JULES: And separately test the real provider integration and the quality of the actual model outputs.

## An Answer Arrives in Pieces

JULES: With a normal request-response pattern, we might wait for the complete answer. Streaming lets us receive pieces or events as generation proceeds.

PARISA: Which can reduce the time until the person sees something useful. It doesn't necessarily reduce the time required to generate the complete answer.

JULES: Right. And streamed pieces aren't guaranteed to align with words, sentences, or complete JSON objects. The provider's event format tells us how to assemble them.

PARISA: So don't try to parse every little chunk as a complete object. And don't execute an action because the first half of a streamed sentence looked encouraging.

JULES: Absolutely. We distinguish partial output, completion, interruption, and failure. A dropped connection after three paragraphs must not look like a finished answer.

PARISA: Accessibility belongs here. If we announce every token through a live region, a screen reader may become an auctioneer trapped in a printer.

JULES: Instead, provide a useful generating status, allow stopping where supported, keep keyboard focus stable, and announce sensible updates or completion. Let people read the finished answer at their own pace. Test the actual interaction with assistive technology.

PARISA: And show status in text, not just a spinning decoration. If generation fails, say so and preserve the user's question. We already know how to make asynchronous interfaces kinder.

## Model Choice Has a Bill Attached

JULES: How do we choose a model? Representative tasks first. A model that writes wonderful essays may not be our best choice for short policy-grounded answers with strict latency requirements.

PARISA: We compare quality, speed, input limits, supported structured output and tools, data handling, availability, and cost. “Largest” isn't the same as “best fit.”

JULES: Hosted APIs often meter input and output tokens separately, sometimes with additional categories. Prices and billing rules change, so use the provider's actual current terms instead of memorizing a number from this episode.

PARISA: And our system may make more than one model call per user question. History and repeated policy context can get resent. Retries and tool investigation add work.

JULES: Exactly. Token cost per call is only part of cost per successfully resolved task. Retrieval, storage, operations, and the human's review time matter too.

PARISA: Latency also has several parts: our server, retrieving information, waiting for the provider, generating output, and transmitting it. “The model is slow” can conceal a very slow database query we wrote ourselves.

JULES: A cherished tradition continues.

## Failure Is a Response Too

PARISA: What should happen when the provider is unavailable?

JULES: Set timeouts. Handle errors. Tell the user what happened. Offer the ordinary search path or let them retry where appropriate. Retry temporary failures within a limit, with backoff, rather than hammering the dependency.

PARISA: And retries can cost money or duplicate work. Later, when actions are involved, retrying needs even more care.

JULES: Yes. Even in our draft-only version, canceled browser requests don't necessarily mean a remote provider stopped processing. We need to understand cancellation behavior instead of assuming it.

PARISA: For our first application version, we have authenticated staff, a bounded question, approved policy context, a model call, a checked response, and a draft shown with its sources.

JULES: No magic UI wrapper. No credentials in the browser. No assumption that generated text is safe HTML or a verified fact.

PARISA: Wait. That's just software.

JULES: Software with a useful but fallible generative dependency.

PARISA: Next time, how do we choose the context without making a person manually paste the right policy every time?

JULES: Brenda is waiting with her documents.

PARISA: Tell her to leave the forklift outside.

[OUTRO MUSIC]
