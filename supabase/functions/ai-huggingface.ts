import { HfInference } from "https://esm.sh/@huggingface/inference@2.6.1";
import { summarizationPrompt } from "./prompts.ts";

const inference = new HfInference(Deno.env.get("HUGGINGFACE_TOKEN"));

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
