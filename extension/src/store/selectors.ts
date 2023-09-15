import { store } from "./store";
import { TabState } from "./tabs";

export function selectTabState(tabId: number): TabState | undefined {
  return store.getState().tabs[tabId];
}
