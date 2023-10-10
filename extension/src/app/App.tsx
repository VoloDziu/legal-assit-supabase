import { createContext, useEffect, useState } from "react";
import { TabState } from "src/store/tabs";
import { Connections, Message } from "../messaging";
import NoStateView from "./components/NoStateView";
import SearchView from "./components/SearchView";

export const ChromePortContext = createContext<chrome.runtime.Port | undefined>(
  undefined,
);

export const StateContext = createContext<TabState | undefined>(undefined);

function App() {
  const [state, setState] = useState<TabState>();
  const [port, setPort] = useState<chrome.runtime.Port>();

  useEffect(() => {
    const p = chrome.runtime.connect({ name: Connections.SidePanel });
    p.postMessage({ type: "app-init" } as Message);
    p.onMessage.addListener(function (message: Message) {
      if (message.type === "update-state") {
        setState(message.state);
      }
    });

    setPort(p);

    return () => {
      port?.disconnect();
    };
  }, []);

  if (!state) {
    return <NoStateView />;
  }

  return (
    <StateContext.Provider value={state}>
      <ChromePortContext.Provider value={port}>
        <SearchView />
      </ChromePortContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
