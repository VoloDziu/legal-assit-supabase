import { DocumentSummary, ExtractedContent } from "./store/models";

const API_URL = "http://localhost:54321/functions/v1";

export async function createEmbeddings(
  docs: ExtractedContent[]
): Promise<{ documentId: string; success: boolean }[]> {
  const result = await fetch(`${API_URL}/create-embeddings/`, {
    method: "POST",
    body: JSON.stringify({
      docs,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await result.json();
}

export async function generateSummaries(
  documentIds: string[],
  query: string
): Promise<{ results: DocumentSummary[] }> {
  const result = await fetch(`${API_URL}/search/`, {
    method: "POST",
    body: JSON.stringify({
      documentIds,
      query,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await result.json();
}

export async function checkExistingDocuments(
  documentIds: string[]
): Promise<{ id: string }[]> {
  const result = await fetch(`${API_URL}/check-existing/`, {
    method: "POST",
    body: JSON.stringify({
      documentIds,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await result.json();
}
