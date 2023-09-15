import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, supabase } from "../supabase.ts";
import { embed, summarizeParagraphs } from "../ai-openai.ts";
import { SummaryResult } from "../../../extension/src/models.ts";

export async function getSimilarParagraphs(
  documentId: string,
  queryEmbedding: number[]
): Promise<SummaryResult> {
  const { data, error } = await supabase.rpc("get_n_similar_paragraphs", {
    target_document_id: documentId,
    query_embeddings: queryEmbedding,
    n: 3,
  });

  const result: SummaryResult = {
    success: false,
    documentId: documentId,
    summary: "",
    paragraphs: [],
  };

  if (!error && data && data.length > 0) {
    result.success = true;
    result.paragraphs = data.map((item) => ({
      id: item.id,
      content: item.content,
      similarity: item.similarity,
    }));

    result.paragraphs.sort((a, b) => b.similarity - a.similarity);
  } else {
    console.log(">>>", documentId, error, data);
  }

  return result;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { documentIds, query }: { documentIds: string[]; query: string } =
      await req.json();

    let queryEmbedding: number[] = [];

    try {
      queryEmbedding = await embed(query);
    } catch {
      return new Response("failed to create embeddings for the search query", {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const searchResultPromises: Promise<SummaryResult>[] = documentIds.map(
      (id) => getSimilarParagraphs(id, queryEmbedding)
    );
    const searchResults = await Promise.all(searchResultPromises);

    const summarizedResultPromises: Promise<SummaryResult>[] =
      searchResults.map((d) => {
        if (!d.success) {
          return Promise.resolve(d);
        }

        return summarizeParagraphs(
          d.paragraphs.map((p) => p.content),
          query
        ).then((summary) => ({
          ...d,
          summary,
        }));
      });
    const summarizedResults = await Promise.all(summarizedResultPromises);

    return new Response(JSON.stringify(summarizedResults), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
