import { useEffect, useState } from "react";
import { NotSupportedView } from "./views/NotSupported";
import { LoadingView } from "./views/Loading";
import { SearchResultsView } from "./views/SearchResults";
import { DefaultView } from "./views/Default";
import { TabState } from "../store/tabs";
import { Connections, Message } from "../messaging";
import { mockLoadingState } from "./mockState";

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

  return (
    <div className="w-[600px] h-[600px] flex flex-col">
      <div className="py-4 px-8 bg-neutral flex gap-3 flex-shrink-0">
        <input
          type="text"
          placeholder="Enter a semantic search query"
          className="flex-grow input input-sm input-bordered w-full"
        />
        <button className="flex-shrink-0 btn btn-primary btn-sm">Search</button>
      </div>

      <div className="flex-grow flex-shrink"></div>
    </div>
  );

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
