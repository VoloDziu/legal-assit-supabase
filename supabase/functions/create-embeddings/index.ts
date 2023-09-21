import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase, corsHeaders } from "../supabase.ts";
import { bulkEmbed } from "../ai-openai.ts";
import { ExtractedContent } from "../../../extension/src/models.ts";

async function processDocument(content: ExtractedContent): Promise<void> {
  let embeddings: number[][];
  try {
    embeddings = await bulkEmbed(content.paragraphs);
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
      content.paragraphs.map((paragraph, index) => ({
        document_id: content.documentId,
        content: paragraph,
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

  let content: { document: ExtractedContent };
  try {
    content = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  try {
    const result = await processDocument(content.document);

    return new Response(JSON.stringify(result), {
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
