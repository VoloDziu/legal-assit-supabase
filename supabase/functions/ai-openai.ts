import OpenAI from "openai";
import { summarizationPrompt } from "./prompts.ts";

export const openai = new OpenAI();

export async function embed(text: string): Promise<number[]> {
  const { data } = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  return data[0].embedding;
}

export async function bulkEmbed(texts: string[]): Promise<number[][]> {
  const { data } = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: texts,
  });

  return data.map((d) => d.embedding);
}

export async function summarize(
  documentContexts: string[],
  query: string
): Promise<string> {
  const content = summarizationPrompt(documentContexts, query);

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        content,
        role: "user",
      },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.1,
  });
  const answer = chatCompletion.choices[0].message.content;

  const result = answer ? answer : "[]";

  return result;
}
