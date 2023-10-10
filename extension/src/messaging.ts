import { ExtractedContent } from "./models";
import { Document, TabState } from "./store/tabs";

export enum Connections {
  SidePanel = "side-panel",
  ContentScript = "content-script",
}

export type Message =
  | {
      type: "app-init";
    }
  | {
      type: "update-state";
      state: TabState;
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
      type: "tab-loaded";
      documents: Document[];
    }
  | {
      type: "result-selected";
      index: number | null;
    };
