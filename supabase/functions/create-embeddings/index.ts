// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase } from "../db.ts";
import { bulkEmbed } from "../ai-transformers.ts";

interface Document {
  id: string;
  title: string;
  url: string;
  origin: string;
  paragraphs: string[];
}

interface DocProcessResult {
  id: string;
  success: boolean;
  message?: string;
  error?: any;
}

async function processDocument(doc: Document): Promise<DocProcessResult> {
  let embeddings: number[][];
  try {
    embeddings = await bulkEmbed(doc.paragraphs);
  } catch (embeddingError) {
    return {
      id: doc.id,
      success: false,
      message: `failed create embeddings for ${doc.id}`,
      error: embeddingError,
    };
  }

  const { error: docInsertError } = await supabase
    .from("documents")
    .upsert({ id: doc.id, origin: doc.origin, title: doc.title, url: doc.url });

  if (docInsertError) {
    return {
      id: doc.id,
      success: false,
      message: `failed to save document ${doc.id}`,
      error: docInsertError,
    };
  }

  const { error: paragraphInsertError } = await supabase
    .from("paragraphs")
    .upsert(
      doc.paragraphs.map((content, index) => ({
        id: `${doc.id}-${index}`,
        document_id: doc.id,
        content,
        embeddings: embeddings[index],
      }))
    );

  if (paragraphInsertError) {
    return {
      id: doc.id,
      success: false,
      message: `failed to save paragraphs for ${doc.id}`,
      error: paragraphInsertError,
    };
  }

  return {
    id: doc.id,
    success: true,
  };
}

serve(async (req) => {
  const { docs }: { docs: Document[] } = await req.json();
  const docPromises: Promise<DocProcessResult>[] = [];

  docs.forEach((d) => {
    docPromises.push(processDocument(d));
  });

  const results = await Promise.all(docPromises);

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
