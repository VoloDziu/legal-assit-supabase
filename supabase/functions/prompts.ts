export const NO_MATCH_STRING = "MATCH NOT FOUND";

export function summarizationPrompt(
  documents: string[],
  question: string
): string {
  const prompt = `For each given document, summarize the document parts that are relevant to the query at the end. Respond with a JSON array with the summaries as items. Each summary should be one sentence written as succinctly as possible. If you cannot find information relevant to the query in a document, then return "${NO_MATCH_STRING}" for that document. 

Documents: 
----------------

${documents.join("\n\n----------------\n\n")}

----------------

Query: ${question}.
  
A JSON list of summaries per each document: `;

  return prompt;
}
