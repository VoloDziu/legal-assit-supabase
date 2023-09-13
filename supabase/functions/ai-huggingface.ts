import { HfInference } from "https://esm.sh/@huggingface/inference@2.6.1";

const inference = new HfInference(Deno.env.get("HUGGINGFACE_TOKEN"));
export const NO_MATCH_STRING = "MATCH NOT FOUND";

function summarizationPrompt(paragraphs: string[], question: string): string {
  const prompt = `Summarize parts of the following context which are relevant to the query at the end. Reply in one sentence as succinctly as possible. If you cannot find information relevant to the query in the context, then say "${NO_MATCH_STRING}". 

Context: 
${paragraphs.join("\n\n")}

Query: ${question}.
  
Concise one-sentence summary: `;

  console.log(">>>", prompt);

  return prompt;
}

export async function summarizeParagraphs(
  paragraphs: string[],
  query: string
): Promise<string> {
  const { generated_text: result } = await inference.textGeneration({
    model: "google/flan-t5-large",
    inputs: summarizationPrompt(paragraphs, query),
    parameters: {
      temperature: 0,
      max_new_tokens: 100,
    },
  });

  return result;
}
