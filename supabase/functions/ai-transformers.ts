import {
  env,
  pipeline,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0";

// Configuration for Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;

const pipe = await pipeline("feature-extraction", "Supabase/gte-small");

export async function embed(text: string): Promise<number[]> {
  const result = await pipe(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(result.data);
}

export async function bulkEmbed(texts: string[]): Promise<number[][]> {
  const embeddings = await Promise.all(texts.map((text) => embed(text)));

  return embeddings;
}
