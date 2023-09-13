// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase } from "../db.ts";
import { bulkEmbed } from "../ai-transformers.ts";

interface ExtractedContent {
  documentId: string;
  paragraphs: string[];
}

interface Result {
  documentId: string;
  success: boolean;
  message?: string;
  error?: any;
}

async function processDocument(doc: ExtractedContent): Promise<Result> {
  let embeddings: number[][];
  try {
    embeddings = await bulkEmbed(doc.paragraphs);
  } catch (embeddingError) {
    return {
      documentId: doc.documentId,
      success: false,
      message: `failed create embeddings for ${doc.documentId}`,
      error: embeddingError,
    };
  }

  const { error: docInsertError } = await supabase
    .from("documents")
    .upsert({ id: doc.documentId });

  if (docInsertError) {
    return {
      documentId: doc.documentId,
      success: false,
      message: `failed to save document ${doc.documentId}`,
      error: docInsertError,
    };
  }

  const { error: paragraphInsertError } = await supabase
    .from("paragraphs")
    .upsert(
      doc.paragraphs.map((paragraph, index) => ({
        id: `${doc.documentId}-${index}`,
        document_id: doc.documentId,
        content: paragraph,
        embeddings: embeddings[index],
      }))
    );

  if (paragraphInsertError) {
    return {
      documentId: doc.documentId,
      success: false,
      message: `failed to save paragraphs for ${doc.documentId}`,
      error: paragraphInsertError,
    };
  }

  return {
    documentId: doc.documentId,
    success: true,
  };
}

serve(async (req) => {
  const { docs }: { docs: ExtractedContent[] } = await req.json();
  const docPromises: Promise<Result>[] = [];

  docs.forEach((d) => {
    docPromises.push(processDocument(d));
  });

  const results = await Promise.all(docPromises);

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
