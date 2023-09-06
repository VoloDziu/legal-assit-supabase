import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase } from "../db.ts";
import { embed } from "../ai-transformers.ts";

type DocProcessResult = DocProcessResultSuccess | DocProcessResultError;
interface DocProcessResultSuccess {
  success: true;
  data: {
    id: string;
    url: string;
    origin: string;
    title: string;
    paragraphs: {
      id: string;
      content: string;
      similarity: number;
    }[];
  };
}

interface DocProcessResultError {
  success: false;
}

async function getSimilarity(
  documentId: string,
  queryEmbedding: number[]
): Promise<DocProcessResult> {
  const { data, error } = await supabase.rpc("find_top_similar_paragraphs", {
    target_document_id: documentId,
    query_embeddings: queryEmbedding,
    n: 3,
  });

  console.log(">>>", documentId, data, error);

  if (error || !data || data.length === 0) {
    return {
      success: false,
    };
  }

  const result: DocProcessResultSuccess = {
    success: true,
    data: {
      id: data[0].document_id,
      title: data[0].document_title,
      origin: data[0].document_origin,
      url: data[0].document_url,
      paragraphs: [],
    },
  };

  for (const item of data) {
    result.data.paragraphs.push({
      id: item.paragraph_id,
      content: item.paragraph_content,
      similarity: item.similarity,
    });
  }

  result.data.paragraphs.sort((a, b) => b.similarity - a.similarity);

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

  const documentPromises: Promise<DocProcessResult>[] = [];

  for (const documentId of documentIds) {
    documentPromises.push(getSimilarity(documentId, queryEmbedding));
  }

  const results = await Promise.all(documentPromises);

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
