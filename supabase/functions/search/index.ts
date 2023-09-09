import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { embed } from "../ai-transformers.ts";
import { summarizeParagraphs } from "../ai-openai.ts";
import { supabase } from "../db.ts";

interface SimilaritySearchSuccess {
  success: true;
  documentId: string;
  summary: string;
  paragraphs: {
    id: string;
    content: string;
    similarity: number;
  }[];
}

interface SimilaritySearchFail {
  success: false;
  documentId: string;
}

export type SimilaritySearchResult =
  | SimilaritySearchSuccess
  | SimilaritySearchFail;

export async function getSimilarParagraphs(
  documentId: string,
  queryEmbedding: number[]
): Promise<SimilaritySearchResult> {
  const { data, error } = await supabase.rpc("find_top_similar_paragraphs", {
    target_document_id: documentId,
    query_embeddings: queryEmbedding,
    n: 3,
  });

  if (error || !data || data.length === 0) {
    return {
      success: false,
      documentId: documentId,
    };
  }

  const result: SimilaritySearchSuccess = {
    success: true,
    documentId: data[0].document_id,
    summary: "",
    paragraphs: data.map((item) => ({
      id: item.paragraph_id,
      content: item.paragraph_content,
      similarity: item.similarity,
    })),
  };

  result.paragraphs.sort((a, b) => b.similarity - a.similarity);

  return result;
}

serve(async (req) => {
  const { documentIds, query }: { documentIds: string[]; query: string } =
    await req.json();
  let queryEmbedding: number[] = [];

  try {
    queryEmbedding = await embed(query);
  } catch {
    return new Response("failed to create embeddings for the search query", {
      status: 500,
    });
  }

  const searchResultPromises: Promise<SimilaritySearchResult>[] =
    documentIds.map((id) => getSimilarParagraphs(id, queryEmbedding));
  const searchResults = await Promise.all(searchResultPromises);

  const summarizedResultPromises: Promise<SimilaritySearchResult>[] =
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
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
