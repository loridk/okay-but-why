# Episode 3: LLMs: Extremely Fancy Autocomplete?

**Series:** AI
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: I've heard two explanations of language models. One: a digital mind that understands everything. Two: autocomplete wearing an expensive coat.

JULES: Both have strong poster potential. Neither is enough to design software around.

PARISA: Welcome to Okay, But Why? We are inspecting the coat.

## Pieces Before Words

JULES: Last episode, training adjusted a model's numerical parameters. Today we use the trained model to generate text. Before the model processes a message, a tokenizer converts that text into tokens.

PARISA: A token is not always a word.

JULES: Right. It might represent a whole word, part of a word, punctuation, whitespace combined with text, or another unit, depending on the tokenizer. Different models can tokenize the same sentence differently.

PARISA: So don't count words in an English paragraph and assume that's an exact token count. Especially when we add code, other languages, or strange identifiers.

JULES: Exactly. Token IDs are turned into numerical representations the model can process. And the model's output is produced as tokens that can be decoded back into text.

PARISA: Why bother with pieces instead of a dictionary of every possible word?

JULES: Pieces let tokenizers represent unfamiliar words and many combinations without needing a separate vocabulary entry for every possible string. There are tradeoffs in vocabulary size and how many tokens different texts require.

PARISA: Our order identifier isn't a meaningful English word, but the system still needs to handle it.

JULES: Yes. Handling the characters doesn't mean it knows anything about that order, though. We'll keep that distinction close.

## One More Piece, Then Another

JULES: In a typical autoregressive LLM, the model uses the available preceding context to calculate scores for possible next tokens. Those scores become a probability distribution, and a decoding procedure selects a token.

PARISA: Then the selected token becomes part of the context for the next step.

JULES: Exactly. Repeat until an ending condition, an output limit, or another stop. A paragraph is built through successive predictions.

PARISA: That sounds like autocomplete. Why is “just autocomplete” misleading?

JULES: Because describing the output step doesn't describe the full capability learned to make those predictions. Predicting language across varied data can require representing relationships involving grammar, facts, code, patterns of reasoning, and much more. The result can support useful tasks far beyond finishing a familiar phrase.

PARISA: Like saying a compiler “just transforms text.” Technically pointing at something it does, while carefully omitting the interesting machinery.

JULES: Yes. But going the other direction and treating fluent generation as a guaranteed truth engine is also wrong. The training objective and generation procedure don't verify each claim against reality.

PARISA: Probability of a continuation isn't probability that the statement is true.

JULES: Exactly. If the sentence is “Our refund policy allows,” there may be plausible continuations. That doesn't mean the model has read our policy or is authorized to decide it.

PARISA: Our fictional company might not even allow refunds for this service. A beautifully written standard policy would still be the wrong answer.

## Attention, Without the Brain Costume

PARISA: Where do transformers enter this?

JULES: Transformers are a family of neural-network architectures used by many modern language models. A central component is attention: a mechanism that lets representations at one position combine information from other relevant positions.

PARISA: Give me a sentence to hold on to.

JULES: “The customer returned the headphones because they were broken.” Processing “they” can involve relationships with “headphones” and the surrounding sentence.

PARISA: And if I say “because they were unhappy,” customer becomes more relevant. The nearby word isn't always the right connection.

JULES: Right. Attention computes numerical relationships; it's not a little reader deliberately underlining nouns. Multiple layers and attention heads can capture different patterns. Other parts of the network transform those representations, and position information helps distinguish ordering.

PARISA: So attention isn't the whole transformer. And the model doesn't produce a reliable explanation of its own decision just because we can draw some attention arrows.

JULES: Correct. Also, in the usual causal text-generation setup, a position attends to earlier available positions, not future text that hasn't been generated. Architecture variants differ, but that's our useful starting picture.

PARISA: Okay, that's actually pretty cool. It isn't only looking at the last word. There's machinery for combining information across the available text.

JULES: Which helps explain why context matters so much.

## What Does It Know Right Now?

PARISA: Let's try Support Assistant. We ask, “Can I refund shipping for order 1234?”

JULES: A general model may have learned patterns about shipping, refunds, and customer-service language during training. But it doesn't magically have our private order record or current policy.

PARISA: Even if its answer sounds very specifically like an employee who's been here five years.

JULES: Especially then. We need to distinguish learned information in the model's weights from information supplied in the current context.

PARISA: So I provide an approved policy excerpt: guaranteed delivery fees may be refunded after a missed guarantee, subject to certain exclusions. Now it has that information in context.

JULES: Yes. It can generate a response informed by the excerpt. But it still needs the order's service level, dates, and exclusions to decide whether this case fits.

PARISA: Useful response: “I can explain the policy, but I don't have enough order information to assess this case.”

JULES: Much better than confidently inventing the missing shipping date.

PARISA: Does providing the policy teach it permanently?

JULES: Not in the weight-updating sense. We're doing inference with additional context. If the next request doesn't include that policy, or some application mechanism doesn't supply it again, we can't assume it'll be available.

PARISA: So the familiar chat-history effect can be the application resending previous messages, not the model quietly developing a personal memory of me.

JULES: Exactly. Products may also have explicit storage or memory features. That's application behavior we must inspect, not infer from the model sounding friendly.

## The Confident Wrong Answer

PARISA: Let's say we don't give it the policy. It invents “section 7.3 of our delivery guarantee.” Why doesn't the model realize it doesn't have that document?

JULES: Models can sometimes recognize uncertainty and can be trained or instructed to abstain. But they can also generate plausible unsupported claims. We often call those hallucinations or confabulations. The label describes the failure; it doesn't explain away the harm.

PARISA: And asking “Are you sure?” may produce a different paragraph, not independent verification.

JULES: Right. Nor does asking for a confidence percentage magically create a calibrated probability. We need evidence and evaluation, which we'll develop throughout the series.

PARISA: Could it quote something from training exactly?

JULES: Sometimes models can reproduce memorized text. So “not a database lookup” does not mean “never memorizes.” But ordinary generation isn't a dependable retrieval interface to a known collection of source records.

PARISA: That's the distinction I needed. It can contain learned information without letting us treat every generated answer as a retrieved fact with provenance.

JULES: Yes. If we need today's order status, we should get it from the order system. If we need policy evidence, retrieve the actual policy. Generation can help explain the evidence; it shouldn't impersonate the evidence.

## A Better Job Description for the Model

PARISA: So in Support Assistant, our model is useful at taking relevant text and producing a useful draft. The surrounding software must supply the right information and control what happens to the result.

JULES: That's a good starting division of responsibility. It may also classify requests or propose tool calls later. But today, just ask it to explain the supplied policy and identify what is missing.

PARISA: “Extremely fancy autocomplete” reminds us how tokens are generated. It doesn't tell us which tasks work reliably or how to make a product safe.

JULES: Exactly. We answer those by trying representative tasks and measuring behavior.

PARISA: Next time: prompts. Apparently I can change everything by adding “You are a world-class expert” and threatening to be disappointed.

JULES: Sabrina has opinions.

PARISA: Good. I have a policy document and a deeply skeptical eyebrow.

[OUTRO MUSIC]
