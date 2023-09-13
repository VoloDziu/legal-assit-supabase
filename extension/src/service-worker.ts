import { PayloadAction } from "@reduxjs/toolkit";
import { Connections, Message } from "./store/models";
import { tabsSlice } from "./store/tabs";
import { store } from "./store/store";
import { selectTabState } from "./store/selectors";
import {
  createEmbeddings,
  generateSummaries,
  checkExistingDocuments,
} from "./api";

let sidePanelPort: chrome.runtime.Port | undefined;
const tabPorts: { [id: string]: chrome.runtime.Port } = {};

async function getActiveTab(): Promise<chrome.tabs.Tab> {
  const results = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  return results[0];
}

async function sendStateToApp(tabId: number) {
  if (!sidePanelPort) {
    return;
  }

  const state = selectTabState(tabId);
  sidePanelPort.postMessage({
    type: "update-state",
    state: state,
  } as Message);
  return;
}

function dispatch(action: PayloadAction<any>) {
  console.log("ACTION", action.type, action.payload);

  store.dispatch(action);
}

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onActivated.addListener((info) => {
  sendStateToApp(info.tabId);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  dispatch(tabsSlice.actions.deleteTab({ tabId }));
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
      sidePanelPort = port;

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
            if (!tabState || !tabState.data) {
              return;
            }
            dispatch(
              tabsSlice.actions.startSearchSession({
                tabId: tab.id,
                query: message.query,
              })
            );

            const previouslyProcessedDocumentIds = (
              await checkExistingDocuments(
                tabState.data.documents.map((d) => d.id)
              )
            ).map((doc) => doc.id);
            dispatch(
              tabsSlice.actions.markDocumentsAsProcessed({
                tabId: tab.id,
                documentIds: previouslyProcessedDocumentIds,
              })
            );
            tabPort.postMessage({
              type: "start-extraction",
              documentIdsToIgnore: previouslyProcessedDocumentIds,
            } as Message);

            return;
        }
      });

      port.onDisconnect.addListener(() => {
        console.log("PORT: side panel port closed");
        sidePanelPort = undefined;
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
          case "tab-opened":
            dispatch(
              tabsSlice.actions.createTab({ tabId, origin: message.origin })
            );
            return;
          case "tab-loaded":
            dispatch(
              tabsSlice.actions.updateTab({
                tabId,
                data: message.data,
              })
            );
            return;
          case "document-extracted":
            dispatch(
              tabsSlice.actions.saveExtractedContent({
                tabId,
                data: message.data,
              })
            );
            return;
          case "extraction-finished":
            const tabSearchData = selectTabState(tabId)?.data;

            if (!tabSearchData) {
              console.warn(`cannot find search data for tab ${tabId}`);
              return;
            }

            try {
              await createEmbeddings(tabSearchData.extractedContent);

              const response = await generateSummaries(
                tabSearchData.documents.map((doc) => doc.id),
                tabSearchData.query
              );

              dispatch(
                tabsSlice.actions.searchFinishedSuccess({
                  tabId,
                  results: response.results,
                })
              );

              console.log("Done!", response);
            } catch (e: unknown) {
              console.error("Error", e);
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
