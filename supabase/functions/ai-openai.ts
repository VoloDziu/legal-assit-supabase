import OpenAI from "openai";

const openai = new OpenAI();
const NO_MATCH_STRING = "MATCH NOT FOUND";

function summarizationPrompt(paragraphs: string[], question: string): string {
  return `Use the following pieces of context to answer the question at the end. If you cannot find the answer in the context, then reply "${NO_MATCH_STRING}", don't try to make up an answer using information not provided in the context. Reply in succinct short sentences. 

${paragraphs.join("\n\n")}

Question: ${question}`;
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
    temperature: 0,
  });

  return chatCompletion.choices[0].message.content || "";
}
