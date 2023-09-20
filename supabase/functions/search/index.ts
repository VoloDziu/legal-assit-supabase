import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, supabase } from "../supabase.ts";
import { embed, summarize } from "../ai-openai.ts";
import { SearchResult } from "../../../extension/src/models.ts";

async function getSimilarParagraphs(
  documentIds: string[],
  query: string,
  n: number
) {
  let queryEmbedding: number[] = [];
  try {
    queryEmbedding = await embed(query);
  } catch {
    throw new Error("failed to create embeddings for the search query");
  }

  const { data, error } = await supabase.rpc("get_n_similar_paragraphs", {
    target_document_ids: documentIds,
    query_embeddings: queryEmbedding,
    n,
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("no search data returned");
  }

  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let request: { documentIds: string[]; query: string; n: number };
  try {
    request = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  let similarParagraphs: {
    id: string;
    document_id: string;
    content: string;
    similarity: number;
  }[];
  try {
    similarParagraphs = await getSimilarParagraphs(
      request.documentIds,
      request.query,
      request.n
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  const documentContextIds: string[] = [];
  const documentContexts: { [id: string]: string[] } = {};
  for (const paragraph of similarParagraphs) {
    if (!documentContexts[paragraph.document_id]) {
      documentContextIds.push(paragraph.document_id);
      documentContexts[paragraph.document_id] = [];
    }

    documentContexts[paragraph.document_id].push(paragraph.content);
  }

  let aiResponse: string;
  try {
    aiResponse = await summarize(
      documentContextIds.map((id) => documentContexts[id].join("\n")),
      request.query
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  let summaries: string[];
  try {
    summaries = JSON.parse(aiResponse);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  const results: SearchResult[] = documentContextIds.map((id, index) => ({
    documentId: id,
    summary: summaries[index] || "",
    paragraphs: documentContexts[id],
  }));

  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
