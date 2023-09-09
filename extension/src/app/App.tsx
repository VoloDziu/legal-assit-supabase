import { useEffect, useState } from "react";
import { Connections, Message, TabState } from "../store/models";
import { NotSupportedView } from "./views/NotSupported";
import { LoadingView } from "./views/Loading";
import { SearchResultsView } from "./views/SearchResults";
import { DefaultView } from "./views/Default";

function App() {
  const [appState, setAppState] = useState<TabState | undefined>();
  const [port, setPort] = useState<chrome.runtime.Port>();

  useEffect(() => {
    const p = chrome.runtime.connect({ name: Connections.SidePanel });
    p.postMessage({ type: "app-init" } as Message);
    p.onMessage.addListener(function (message: Message) {
      console.log("here!!!");
      if (message.type === "update-state") {
        setAppState(message.state);
      }
    });

    setPort(p);

    return () => {
      port?.disconnect();
    };
  }, []);

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
