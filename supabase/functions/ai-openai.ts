import OpenAI from "openai";

export const openai = new OpenAI();
export const NO_MATCH_STRING = "MATCH NOT FOUND";

function summarizationPrompt(paragraphs: string[], question: string): string {
  return `Summarize the information in the following context that is relevant to the query at the end. Reply as succinctly as possible. If you cannot find information relevant to the query in the context, then say "${NO_MATCH_STRING}". 

Context: 
${paragraphs.join("\n\n")}

Query: ${question}`;
}

export async function summarizeParagraphs(
  paragraphs: string[],
  query: string
): Promise<string> {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        content: summarizationPrompt(paragraphs, query),
        role: "user",
      },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.1,
  });
  const answer = chatCompletion.choices[0].message.content;

  return answer && answer !== NO_MATCH_STRING ? answer : "";
}
