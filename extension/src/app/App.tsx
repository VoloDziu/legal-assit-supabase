import { useEffect, useState } from "react";
import { Connection, Message, MessageType, appOpened } from "../store/models";
import { TabState } from "../store/tabs";
import { NotSupportedView } from "./views/NotSupported";
import { LoadingView } from "./views/Loading";
import { SearchResultsView } from "./views/SearchResults";
import { DefaultView } from "./views/Default";

function App() {
  const [appState, setAppState] = useState<TabState | undefined>();
  const [port, setPort] = useState<chrome.runtime.Port>();

  useEffect(() => {
    const p = chrome.runtime.connect({ name: Connection.SidePanel });
    p.postMessage(appOpened());
    p.onMessage.addListener(function (message: Message) {
      if (message.type === MessageType.StateUpdated) {
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
    switch (appState.pageType) {
      case "search":
        return <SearchResultsView state={appState} port={port} />;
      default:
        return <DefaultView state={appState} />;
    }
  }
}

export default App;
