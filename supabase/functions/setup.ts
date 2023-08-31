import { createClient } from "supabase";
import { SupabaseVectorStore } from "langchain.vectorstores.supabase";
import { OpenAIEmbeddings } from "langchain.embeddings.openai";

export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: Deno.env.get("OPENAI_API_KEY"),
});

export const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

export const vectorStore = await SupabaseVectorStore.fromExistingIndex(
  embeddings,
  {
    client: supabase,
  }
);
