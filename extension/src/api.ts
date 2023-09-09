import { DocumentSummary, ExtractedContent } from "./store/models";

const API_URL = "http://localhost";

export async function generateEmbeddings(
  extractedContent: ExtractedContent[]
): Promise<void> {
  //
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  });
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
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          results: documentIds.map((documentId) => ({
            documentId,
            summary: "this is a dummy summary",
            relevantParagraphs: ["paragraph a", "paragraph b", "paragraph c"],
          })),
        }),
      3000
    );
  });
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
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), 1000);
  });
}
