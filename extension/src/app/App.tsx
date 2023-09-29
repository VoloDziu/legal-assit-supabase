import { useEffect, useState } from "react";
import { NotSupportedView } from "./views/NotSupported";
import { LoadingView } from "./views/Loading";
import { SearchResultsView } from "./views/SearchResults";
import { DefaultView } from "./views/Default";
import { TabState } from "../store/tabs";
import { Connections, Message } from "../messaging";
import { mockLoadingState } from "./mockState";
import { Layout } from "./components/Layout";

function App() {
  const [appState, setAppState] = useState<TabState | undefined>();
  const [port, setPort] = useState<chrome.runtime.Port>();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const p = chrome.runtime.connect({ name: Connections.SidePanel });
      p.postMessage({ type: "app-init" } as Message);
      p.onMessage.addListener(function (message: Message) {
        if (message.type === "update-state") {
          setAppState(message.state);
        }
      });

      setPort(p);

      return () => {
        port?.disconnect();
      };
    } else {
      setAppState(mockLoadingState);
    }
  }, []);

  return <Layout />;

  if (!appState || !appState.origin) {
    return <NotSupportedView />;
  } else if (appState.loading) {
    return <LoadingView />;
  } else {
    switch (appState.data?.pageType) {
      case "search":
        return <SearchResultsView state={appState} port={port} />;
      default:
        return <DefaultView state={appState} />;
    }
  }
}

export default App;
