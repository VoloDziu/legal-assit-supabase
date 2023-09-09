import { TabState } from "./models";
import { store } from "./store";

export function selectTabState(tabId: number): TabState | undefined {
  return store.getState().tabs[tabId];
}
