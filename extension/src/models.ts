export interface SummaryResult {
  success: boolean;
  documentId: string;
  summary: string;
  paragraphs: {
    id: string;
    content: string;
    similarity: number;
  }[];
}

export interface ExtractedContent {
  documentId: string;
  paragraphs: string[];
}

export interface EmbeddingsResult {
  documentId: string;
  success: boolean;
  message?: string;
  error?: any;
}
