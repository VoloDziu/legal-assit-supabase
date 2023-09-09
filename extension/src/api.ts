import { DocumentSummary, ExtractedContent } from "./store/models";

const API_URL = "http://localhost";

export async function generateEmbeddings(
  extractedContent: ExtractedContent[]
): Promise<void> {
  //
  return Promise.resolve();
}

export async function generateSummaries(
  documentIds: string[],
  query: string
): Promise<{ results: DocumentSummary[] }> {
  // const result = await fetch(`${API_URL}/search/`, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     articles,
  //     query,
  //   }),
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  // return await result.json();
  return Promise.resolve([] as any);
}

export async function getProcessedDocuments(
  documentIds: string[]
): Promise<string[]> {
  // const result = await fetch(`${API_URL}/remove-processed-ids/`, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     documentIds: documentIds,
  //   }),
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  // return await result.json();
  return Promise.resolve([]);
}
