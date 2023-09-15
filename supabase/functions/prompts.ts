export const NO_MATCH_STRING = "MATCH NOT FOUND";

export function summarizationPrompt(
  paragraphs: string[],
  question: string
): string {
  const prompt = `Summarize parts of the following context which are relevant to the query at the end. Reply in one sentence as succinctly as possible. If you cannot find information relevant to the query in the context, then say "${NO_MATCH_STRING}". 

Context: 
${paragraphs.join("\n\n")}

Query: ${question}.
  
Concise one-sentence summary: `;

  return prompt;
}
