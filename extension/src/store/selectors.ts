import { store } from "./store";
import { TabState } from "./tabs";

export function selectTabState(tabId: number): TabState | undefined {
  return store.getState().tabs[tabId];
}

export function allDocumentsExtracted(tabId: number): boolean {
  const documents = selectTabState(tabId)?.data?.documents;

  return (
    !!documents &&
    documents.length === documents.filter((d) => d.isProcessed).length
  );
}
