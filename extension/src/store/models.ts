export enum Connections {
  SidePanel = "side-panel",
  ContentScript = "content-script",
}
export interface TabState {
  loading: boolean;
  origin: string;
  data?: TabData;
}

export interface TabsState {
  [tabid: string]: TabState;
}

export interface Document {
  id: string;
  url: string;
  title: string;
  isProcessed: boolean;
}

export interface DocumentSummary {
  documentId: string;
  summary: string;
  relevantParagraphs: string[];
}

export interface ExtractedContent {
  documentId: string;
  paragraphs: string[];
}

interface SearchTabData {
  pageType: "search";
  query: string;
  status: "loading" | "idle" | "error";
  documents: Document[];
  extractedContent: ExtractedContent[]; // buffer before we send it to the API in bulk
  similaritySearchResults: { [documentId: string]: DocumentSummary };
}

export type TabData = SearchTabData;

export type Message =
  | {
      type: "app-init";
    }
  | {
      type: "update-state";
      state: TabState | undefined;
    }
  | {
      type: "start-search";
      query: string;
    }
  | {
      type: "start-extraction";
      documentIdsToIgnore: string[];
    }
  | {
      type: "document-extracted";
      data: ExtractedContent;
    }
  | {
      type: "extraction-finished";
    }
  | {
      type: "tab-opened";
      origin: string;
    }
  | {
      type: "tab-loaded";
      data?: TabData;
    };
