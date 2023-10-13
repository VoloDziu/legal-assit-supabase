import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchResult } from "../models";

export interface Document {
  id: string;
  url: string;
  title: string;
  isProcessed: boolean;
}

export type TabState = SearchResultsState | UnsupportedState;

export interface UnsupportedState {
  type: "unsupported";
}

export interface SearchResultsState {
  type: "sesarch-results";
  query: string;
  status: "initial" | "loading" | "done" | "error";
  documents: Document[];
  selectedDocumentIndex: number | null;
  searchResults: SearchResult[];
}

export interface TabsState {
  [tabid: string]: TabState;
}

const initialTabsState: TabsState = {};

export const tabsSlice = createSlice({
  name: "tabs",
  initialState: initialTabsState,
  reducers: {
    setTabState(
      state,
      action: PayloadAction<{
        tabId: number;
        state: TabState;
      }>,
    ) {
      state[action.payload.tabId] = action.payload.state;
    },
    deleteTabState(state, action: PayloadAction<{ tabId: number }>) {
      const { [action.payload.tabId]: _, ...rest } = state;

      return rest;
    },
    startSearchSession(
      state,
      action: PayloadAction<{ tabId: number; query: string }>,
    ) {
      const tabState = state[action.payload.tabId];

      if (tabState.type !== "sesarch-results") {
        return { ...state };
      }

      tabState.query = action.payload.query;
      tabState.searchResults = [];
      tabState.selectedDocumentIndex = null;
      tabState.status = "loading";
    },
    markDocumentsAsProcessed(
      state,
      action: PayloadAction<{ tabId: number; documentIds: string[] }>,
    ) {
      const tabState = state[action.payload.tabId];

      if (tabState.type !== "sesarch-results") {
        return { ...state };
      }

      for (const doc of tabState.documents) {
        if (action.payload.documentIds.includes(doc.id)) {
          doc.isProcessed = true;
        }
      }
    },
    searchFinishedSuccess(
      state,
      action: PayloadAction<{
        tabId: number;
        results: SearchResult[];
      }>,
    ) {
      const tabState = state[action.payload.tabId];

      if (tabState.type !== "sesarch-results") {
        return { ...state };
      }

      tabState.searchResults = action.payload.results.filter(
        (r) => !!r.summary,
      );
      tabState.status = "done";
    },
    sesarchFinishedError(
      state,
      action: PayloadAction<{
        tabId: number;
        error: string;
      }>,
    ) {
      const tabState = state[action.payload.tabId];

      if (tabState.type !== "sesarch-results") {
        return { ...state };
      }

      tabState.status = "error";
    },
    selectDocument(
      state,
      action: PayloadAction<{ tabId: number; documentIndex: number | null }>,
    ) {
      const tabState = state[action.payload.tabId];

      if (tabState.type !== "sesarch-results") {
        return { ...state };
      }

      tabState.selectedDocumentIndex = action.payload.documentIndex;
    },
  },
});
