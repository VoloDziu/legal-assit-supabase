import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExtractedContent, SummaryResult } from "../models";

export interface Document {
  id: string;
  url: string;
  title: string;
  isProcessed: boolean;
}

interface SearchTabData {
  pageType: "search";
  query: string;
  status: "loading" | "idle" | "error";
  documents: Document[];
  extractedContent: ExtractedContent[]; // buffer before we send it to the API in bulk
  similaritySearchResults: { [documentId: string]: SummaryResult };
}

export type TabData = SearchTabData;

export interface TabState {
  loading: boolean;
  origin: string;
  data?: TabData;
}

export interface TabsState {
  [tabid: string]: TabState;
}

const initialTabsState: TabsState = {};

export const tabsSlice = createSlice({
  name: "tabs",
  initialState: initialTabsState,
  reducers: {
    createTab(state, action: PayloadAction<{ tabId: number; origin: string }>) {
      state[action.payload.tabId] = {
        loading: true,
        origin: action.payload.origin,
      };
    },
    updateTab(
      state,
      action: PayloadAction<{
        tabId: number;
        data?: TabData;
      }>
    ) {
      const tabState = state[action.payload.tabId];

      tabState.loading = false;
      tabState.data = action.payload.data;
    },
    deleteTab(state, action: PayloadAction<{ tabId: number }>) {
      const { [action.payload.tabId]: _, ...rest } = state;

      return rest;
    },

    // only on "search" type pages
    startSearchSession(
      state,
      action: PayloadAction<{ tabId: number; query: string }>
    ) {
      const tabState = state[action.payload.tabId];

      if (!tabState?.data || tabState?.data.pageType !== "search") {
        return { ...state };
      }

      tabState.data.query = action.payload.query;
      tabState.data.similaritySearchResults = {};
      tabState.data.extractedContent = [];
      tabState.data.status = "loading";
    },
    markDocumentsAsProcessed(
      state,
      action: PayloadAction<{ tabId: number; documentIds: string[] }>
    ) {
      const tabState = state[action.payload.tabId];

      if (!tabState?.data || tabState?.data.pageType !== "search") {
        return { ...state };
      }

      for (const doc of tabState.data.documents) {
        if (action.payload.documentIds.includes(doc.id)) {
          doc.isProcessed = true;
        }
      }
    },
    saveExtractedContent(
      state,
      action: PayloadAction<{ tabId: number; data: ExtractedContent }>
    ) {
      const tabState = state[action.payload.tabId];

      if (!tabState?.data || tabState?.data.pageType !== "search") {
        return { ...state };
      }

      tabState.data.extractedContent.push(action.payload.data);
      const targetDoc = tabState.data.documents.find(
        (doc) => doc.id === action.payload.data.documentId
      );
      if (targetDoc) {
        targetDoc.isProcessed = true;
      }
    },
    searchFinishedSuccess(
      state,
      action: PayloadAction<{
        tabId: number;
        results: SummaryResult[];
      }>
    ) {
      const tabState = state[action.payload.tabId];

      if (!tabState?.data || tabState?.data.pageType !== "search") {
        return { ...state };
      }

      for (const result of action.payload.results) {
        tabState.data.similaritySearchResults[result.documentId] = result;
      }
      tabState.data.status = "idle";
    },
    sesarchFinishedError(
      state,
      action: PayloadAction<{
        tabId: number;
        error: string;
      }>
    ) {
      const tabState = state[action.payload.tabId];

      if (!tabState?.data || tabState?.data.pageType !== "search") {
        return { ...state };
      }

      tabState.data.status = "error";
    },
  },
});
