export interface SearchResult {
  documentId: string;
  summary: string;
  paragraphs: string[];
}

export interface ExtractedContent {
  documentId: string;
  paragraphs: string[];
}
