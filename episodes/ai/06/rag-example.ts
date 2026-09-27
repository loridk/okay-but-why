type Passage = { id: string; text: string };
type Retriever = (question: string) => Promise<Passage[]>;
type Generator = (question: string, evidence: Passage[]) => Promise<string>;

export async function draftWithEvidence(
  question: string,
  retrieveAuthorized: Retriever,
  generate: Generator,
): Promise<string> {
  // Retriever must enforce current caller access before returning data.
  const evidence = await retrieveAuthorized(question);
  if (evidence.length === 0) return "No supporting policy found.";
  return generate(question, evidence);
}
