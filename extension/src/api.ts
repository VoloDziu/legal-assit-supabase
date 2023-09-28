import { ExtractedContent, SearchResult } from "./models";

// prod
// const API_URL = "https://jdaqjnkbsenqluwzsdle.supabase.co/functions/v1";
// const SUPABASE_ANON_KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYXFqbmtic2VucWx1d3pzZGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQyODI1ODIsImV4cCI6MjAwOTg1ODU4Mn0.PEiC3ZCkXj1kJqTvCb3-PT1pjfULzO9elO8CD0E3dvQ";

// local dev
const API_URL = "http://localhost:54321/functions/v1";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

export async function apiCreateEmbeddings(
  document: ExtractedContent
): Promise<void> {
  const result = await fetch(`${API_URL}/create-embeddings/`, {
    method: "POST",
    body: JSON.stringify(document),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  return;
}

export async function apiSearch(
  documentIds: string[],
  query: string,
  n = 5
): Promise<SearchResult[]> {
  const result = await fetch(`${API_URL}/search/`, {
    method: "POST",
    body: JSON.stringify({
      documentIds,
      query,
      n,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  return await result.json();
}

export async function apiCheckExistingDocuments(
  documentIds: string[]
): Promise<{ id: string }[]> {
  const result = await fetch(`${API_URL}/check-existing/`, {
    method: "POST",
    body: JSON.stringify({
      documentIds,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  return await result.json();
}
