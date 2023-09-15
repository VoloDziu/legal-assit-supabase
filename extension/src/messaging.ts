import { ExtractedContent } from "./models";
import { TabData, TabState } from "./store/tabs";

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
      type: "tab-opened";
      origin: string;
    }
  | {
      type: "tab-loaded";
      data?: TabData;
    };
