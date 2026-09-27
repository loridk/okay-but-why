export async function askSupport(
  question: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch("/api/support-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
    signal,
  });
  if (!response.ok) throw new Error("Answer unavailable");
  const body: unknown = await response.json();
  if (
    typeof body !== "object" || body === null ||
    !("answer" in body) || typeof body.answer !== "string"
  ) throw new Error("Unexpected response");
  return body.answer;
}
