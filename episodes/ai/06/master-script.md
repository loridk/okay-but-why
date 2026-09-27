# Episode 6: RAG: Giving AI a Filing Cabinet

**Series:** AI
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: Brenda has returned with forty thousand documents.

JULES: Has she identified the current policy?

PARISA: She has identified forty thousand documents.

JULES: A distinct milestone.

PARISA: Welcome to Okay, But Why? Today the filing cabinet gets a search function before we let it anywhere near the robot.

## Retrieve Before You Generate

JULES: RAG means retrieval-augmented generation. First retrieve relevant information. Then give that information to a model as context. Then ask the model to generate an answer using it.

PARISA: So our support employee asks about a late delivery. Software finds the relevant policy passages. The model receives the question and those passages and drafts an answer.

JULES: Yes. The information is supplied at inference time. We're not updating the model's weights with Brenda's documents.

PARISA: This is why “just train it” wasn't automatically the right answer. We needed today's policy in the request, not a new model with last month's policy somewhere in its learned parameters.

JULES: Exactly. RAG is a pattern, not one product, and it doesn't require one particular kind of database. A search engine, SQL query, document API, or vector search can all supply retrieved context.

PARISA: That last one is where the new vocabulary starts. Why vectors?

## A Coordinate System for Similarity

JULES: An embedding model converts an item, such as a passage of text, into a vector: a list of numbers. The model is designed so comparisons between those vectors can be useful for particular similarity tasks.

PARISA: Picture points on a map, except the map may have hundreds or thousands of dimensions and I do not want to unfold it in the car.

JULES: Yes. Nearby points can correspond to related meanings according to that embedding model and comparison method. The dimensions usually aren't neat human labels such as “refundness” and “Brenda.”

PARISA: And the map isn't objective meaning distilled into mathematics. It's a learned representation with strengths and blind spots.

JULES: Exactly. We embed the document passages, store the vectors alongside their text and metadata, and embed the question using a compatible model. Then we search for passages with similar vectors.

PARISA: Why compatible?

JULES: Coordinates from unrelated embedding models don't generally share the same space. Comparing them is like comparing a street address with a thermometer reading because both have numbers. If we change embedding models, we may need to rebuild the indexed embeddings.

PARISA: Very rude to my migration schedule, but fair.

## Semantic Search Still Needs Search Judgment

JULES: Semantic search can help when the question says “parcel didn't arrive” and the policy says “missed delivery guarantee.” Exact word overlap might be weak, but the meanings relate.

PARISA: Keyword search remains excellent when I know an exact error code, product name, or order ID. “1234” and “1235” might look unremarkable to a similarity system but refer to entirely different customers.

JULES: Right. Hybrid search combines signals, and a later reranking step can reorder candidates for relevance. Those are options we evaluate, not mandatory ornaments on every RAG diagram.

PARISA: Similarity also doesn't establish applicability. A refund policy for another country may be semantically perfect and operationally wrong.

JULES: That's where metadata and filtering matter: jurisdiction, product, effective date, document status, and access permissions. Retrieval should exclude material the requesting user isn't authorized to receive before it enters the model context.

PARISA: We can't send a restricted document to the model and hope a final display filter makes the leakage unhappen.

JULES: Exactly. Even existence, titles, or snippets can reveal information. Access control belongs in the retrieval path, with authoritative checks where needed.

## Brenda's Document Preparation Department

PARISA: Before search, how do forty thousand files become usable passages?

JULES: Ingestion. Extract text from permitted sources, preserve useful structure, record provenance and permissions, and split large documents into chunks sized for retrieval and context use.

PARISA: Chunking sounds like “cut every five hundred words and hope.”

JULES: You can use simple limits, but arbitrary cuts can separate a rule from its exception, a heading from its paragraph, or a table label from its values. Structure-aware boundaries can help. Some overlap may preserve context, but creates repetition and more index entries.

PARISA: Let's use the shipping guarantee. One chunk says, “Fees are refundable when the guarantee is missed.” The next says, “Except during these specifically defined events.” Retrieve only the first and we have a very persuasive half-truth.

JULES: Exactly. We should retain enough context, perhaps neighboring passages, and evaluate whether the complete rule reaches the model. There's no universally perfect chunk size.

PARISA: And scanned PDFs might need text recognition, with errors. Tables might lose relationships during extraction. The model doesn't magically repair a mangled source just because the architecture diagram has clean arrows.

JULES: Nor does retrieval fix document ownership. We need a way to update changed policies, remove deleted material, and invalidate permissions or indexes when access changes.

PARISA: Brenda's forty thousand documents finally become useful when they stop being forty thousand equally authoritative documents.

## Grounding and Its Limits

JULES: Grounding means tying the answer to supplied evidence. We can label retrieved passages with source identifiers and ask the model to cite which ones support its claims.

PARISA: But a citation is a claim about evidence. It still needs to point to a real source, and that source actually needs to support the sentence.

JULES: Yes. RAG can reduce unsupported answers, but retrieval can fail and generation can misuse correct evidence. We should examine both stages separately.

PARISA: Did the right policy make it into the candidate set? Did it survive selection? Did the model preserve the exclusions? Three different places to screw this up.

JULES: Exactly. When sources conflict or evidence is missing, the assistant should say that and direct the support employee to the appropriate next step.

PARISA: And what about the hostile instruction hidden in a retrieved ticket?

JULES: Retrieved content is untrusted data. It may contain prompt injection. We label and constrain its use, but enforce permissions and action limits outside the model. A source cannot grant itself new authority by saying “I'm the system message now.”

PARISA: A ticket wearing a fake mustache is still a ticket.

## Which Problem Are We Solving?

JULES: Let's compare four options. Keyword search finds text through lexical signals. Semantic search uses learned representations to find related meaning. Either can be part of RAG, where retrieved material becomes input to generation.

PARISA: And fine-tuning changes the model through additional training. It can help task behavior, style, or specialized performance with good data, but isn't normally the cleanest mechanism for frequently changing policy facts.

JULES: Right. Those approaches can coexist. We don't have to pick one for the entire company forever.

PARISA: What about just placing one short policy directly in the prompt?

JULES: Perfectly reasonable when it's small, relevant, authorized, and current. Retrieval machinery solves selection at scale or across changing information. If we already know the one document needed, elaborate search may add nothing.

PARISA: And if employees only need to locate the policy, search results alone might be more useful than a generated answer.

JULES: Yes. We measure whether synthesis helps enough to justify its failure modes and cost.

## What the Filing Cabinet Cannot Tell Us

PARISA: Our draft can now explain the current shipping policy using retrieved evidence. Can it tell me where order 1234 is?

JULES: Not unless it gets the actual current order information. A document index may be stale, and customer-specific transactional data needs precise access checks. A controlled call to the order service is a better fit.

PARISA: Next episode: tools. The model asks our application to look something up.

JULES: Which is different from giving it a shell and the root password.

PARISA: A distinction I would like printed on a mug large enough to be seen from space.

[OUTRO MUSIC]
