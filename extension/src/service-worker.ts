import { PayloadAction } from "@reduxjs/toolkit";
import {
  apiCheckExistingDocuments,
  apiCreateEmbeddings,
  apiSearch,
} from "./api";
import { Connections, Message } from "./messaging";
import { allDocumentsExtracted, selectTabState } from "./store/selectors";
import { store } from "./store/store";
import { tabsSlice } from "./store/tabs";

let appPort: chrome.runtime.Port | undefined;
const tabPorts: { [id: string]: chrome.runtime.Port } = {};

async function getActiveTab(): Promise<chrome.tabs.Tab> {
  const results = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  return results[0];
}

async function sendStateToApp(tabId: number) {
  const state = selectTabState(tabId);

  if (!appPort || !state) {
    return;
  }

  appPort.postMessage({
    type: "update-state",
    state: state,
  } as Message);
  return;
}

async function search(tabId: number) {
  const tabState = selectTabState(tabId);

  if (!tabState || tabState.type !== "sesarch-results") {
    console.warn(`cannot find search data for tab ${tabId}`);
    return;
  }

  try {
    const response = await apiSearch(
      tabState.documents.map((doc) => doc.id),
      tabState.query,
    );

    dispatch(
      tabsSlice.actions.searchFinishedSuccess({
        tabId,
        results: response,
      }),
    );
  } catch (e: unknown) {
    dispatch(
      tabsSlice.actions.sesarchFinishedError({
        tabId,
        error: "failed to perform search",
      }),
    );
  }
}

function dispatch(action: PayloadAction<any>) {
  console.log("ACTION", action.type, action.payload);

  store.dispatch(action);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    chrome.action.setIcon({
      path: {
        16: "../../assets/icons-inactive/16.png",
        32: "../../assets/icons-inactive/32.png",
        48: "../../assets/icons-inactive/48.png",
        128: "../../assets/icons-inactive/128.png",
      },
    });

    dispatch(
      tabsSlice.actions.setTabState({ tabId, state: { type: "unsupported" } }),
    );
  }
});

function updateIcon(tabId: number) {
  console.log(">>>", tabId);
  const tabState = selectTabState(tabId);

  if (!tabState || tabState.type === "unsupported") {
    chrome.action.setIcon({
      path: {
        16: "../../assets/icons-inactive/16.png",
        32: "../../assets/icons-inactive/32.png",
        48: "../../assets/icons-inactive/48.png",
        128: "../../assets/icons-inactive/128.png",
      },
    });
  } else {
    chrome.action.setIcon({
      path: {
        16: "../../assets/icons/16.png",
        32: "../../assets/icons/32.png",
        48: "../../assets/icons/48.png",
        128: "../../assets/icons/128.png",
      },
      tabId,
    });
  }
}

chrome.windows.onFocusChanged.addListener(async () => {
  const activeTab = await getActiveTab();
  if (activeTab?.id) {
    updateIcon(activeTab.id);
  }
});
chrome.tabs.onActivated.addListener((activeInfo) =>
  updateIcon(activeInfo.tabId),
);

chrome.tabs.onRemoved.addListener((tabId) => {
  dispatch(tabsSlice.actions.deleteTabState({ tabId }));
});

store.subscribe(async () => {
  const tab = await getActiveTab();
  if (!tab?.id) {
    return;
  }

  console.log("STORE", store.getState());

  sendStateToApp(tab.id);
});

chrome.runtime.onConnect.addListener(async function (port) {
  switch (port.name) {
    // communication between the app and the service worker
    case Connections.SidePanel:
      console.log("PORT: side panel port opened");
      appPort = port;

      port.onMessage.addListener(async function (message: Message) {
        const tab = await getActiveTab();
        if (!tab?.id) {
          return;
        }

        switch (message.type) {
          case "app-init":
            sendStateToApp(tab.id);
            return;
          case "start-search":
            const tabPort = tabPorts[tab.id];
            if (!tabPort) {
              console.error(`No open port for tab ${tab.id}`);
              return;
            }

            const tabState = selectTabState(tab.id);
            if (!tabState || tabState.type !== "sesarch-results") {
              return;
            }
            dispatch(
              tabsSlice.actions.startSearchSession({
                tabId: tab.id,
                query: message.query,
              }),
            );

            let previouslyProcessedDocumentIds: string[] = [];
            try {
              previouslyProcessedDocumentIds = (
                await apiCheckExistingDocuments(
                  tabState.documents.map((d) => d.id),
                )
              ).map((doc) => doc.id);

              dispatch(
                tabsSlice.actions.markDocumentsAsProcessed({
                  tabId: tab.id,
                  documentIds: previouslyProcessedDocumentIds,
                }),
              );
            } catch {
              // do nothing
            }

            if (allDocumentsExtracted(tab.id)) {
              search(tab.id);
            } else {
              tabPort.postMessage({
                type: "start-extraction",
                documentIdsToIgnore: previouslyProcessedDocumentIds,
              } as Message);
            }

            return;
          case "result-selected":
            store.dispatch(
              tabsSlice.actions.selectDocument({
                tabId: tab.id,
                documentIndex: message.index,
              }),
            );
        }
      });

      port.onDisconnect.addListener(() => {
        console.log("PORT: side panel port closed");
        appPort = undefined;
      });

      return;

    // communication between the content script and the service worker
    case Connections.ContentScript:
      const tabId = port.sender?.tab?.id;

      if (!tabId) {
        console.error("PORT: port opened from a content script has no tab id");
        return;
      }

      console.log(`PORT: content script port opened for tab ${tabId}`);
      tabPorts[tabId] = port;

      port.onMessage.addListener(async (message: Message) => {
        switch (message.type) {
          case "tab-loaded":
            chrome.action.setIcon({
              path: {
                16: "../../assets/icons/16.png",
                32: "../../assets/icons/32.png",
                48: "../../assets/icons/48.png",
                128: "../../assets/icons/128.png",
              },
            });

            dispatch(
              tabsSlice.actions.setTabState({
                tabId,
                state: {
                  type: "sesarch-results",
                  query: "",
                  status: "initial",
                  selectedDocumentIndex: null,
                  searchResults: [],
                  documents: message.documents,
                },
              }),
            );
            return;
          case "document-extracted":
            try {
              await apiCreateEmbeddings(message.data);
            } catch (e: unknown) {
              // do nothing
            }

            dispatch(
              tabsSlice.actions.markDocumentsAsProcessed({
                tabId,
                documentIds: [message.data.documentId],
              }),
            );

            if (allDocumentsExtracted(tabId)) {
              search(tabId);
            }

            return;
        }
      });

      port.onDisconnect.addListener(() => {
        console.log("PORT: content script port closed");
        delete tabPorts[tabId];
      });
  }
});
