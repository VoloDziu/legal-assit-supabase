import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase, corsHeaders } from "../supabase.ts";
import { bulkEmbed } from "../ai-openai.ts";
import { ExtractedContent } from "../../../extension/src/models.ts";
import { isWithinTokenLimit } from "gpt-tokenizer";

const EMBEDDING_CHUNK_TOKENS_LIMIT = 300;

async function processDocument(content: ExtractedContent): Promise<void> {
  let embeddings: number[][];

  const embeddingChunks: string[] = [];

  let chunk = "";
  for (let i = 0; i < content.paragraphs.length; i++) {
    chunk = chunk
      ? `${chunk}<p>${content.paragraphs[i]}</p>`
      : `<p>${content.paragraphs[i]}</p>`;

    if (!isWithinTokenLimit(chunk, EMBEDDING_CHUNK_TOKENS_LIMIT)) {
      embeddingChunks.push(chunk);
      chunk = "";
    }
  }

  if (chunk.length > 0) {
    embeddingChunks.push(chunk);
  }

  try {
    embeddings = await bulkEmbed(
      embeddingChunks.map((chunk) =>
        chunk.replace(/<p>/g, "").replace(/<\/p>/g, "\n")
      )
    );
  } catch {
    throw new Error(`could not create embeddings for ${content.documentId}`);
  }

  const { error: docInsertError } = await supabase
    .from("documents")
    .upsert({ id: content.documentId });

  if (docInsertError) {
    throw new Error(`failed to save document ${content.documentId}`);
  }

  const { error: paragraphInsertError } = await supabase
    .from("paragraphs")
    .upsert(
      embeddingChunks.map((chunk, index) => ({
        document_id: content.documentId,
        content: chunk,
        embeddings: embeddings[index],
      }))
    );

  if (paragraphInsertError) {
    throw new Error(`failed to save paragraphs for ${content.documentId}`);
  }

  return;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let content: ExtractedContent;
  try {
    content = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  try {
    await processDocument(content);

    return new Response("", {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
