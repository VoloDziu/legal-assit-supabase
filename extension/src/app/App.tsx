import { Cross1Icon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { Connections, Message } from "../messaging";
import { TabState } from "../store/tabs";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ListItem } from "./components/ui/list";
import { ScrollArea } from "./components/ui/scroll-area";
import { cn } from "./lib/utils";
import { mockLoadingState } from "./mockState";
import { DefaultView } from "./views/Default";
import { LoadingView } from "./views/Loading";
import { NotSupportedView } from "./views/NotSupported";
import { SearchResultsView } from "./views/SearchResults";

interface Result {
  title: string;
  summary: string;
}

function App() {
  const [appState, setAppState] = useState<TabState | undefined>();
  const [port, setPort] = useState<chrome.runtime.Port>();

  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const data = [
    {
      title: "Article one",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu sem tellus. Aliquam dapibus faucibus tortor, eu bibendum justo aliquam quis. In hac habitasse platea dictumst. In auctor, elit ac efficitur facilisis, ex felis cursus eros, cursus scelerisque enim sapien vitae nisl. Duis eu neque hendrerit, ullamcorper purus vel, vulputate nunc.",
    },
    {
      title: "Article two",
      summary:
        "Ut sed erat non justo vehicula cursus. Integer fermentum, lorem non iaculis ullamcorper, sem ex ultricies nunc, eu convallis est arcu sed nulla.",
    },
    {
      title: "Article three",
      summary:
        "Nam tortor arcu, porttitor a dui non, faucibus congue nisl. Donec porta quam et malesuada finibus. Donec egestas enim faucibus, tempus metus et, porttitor mi. Etiam sit amet bibendum leo, egestas tempus diam.",
    },
    {
      title: "Article four sdfdsafdsflsadfasd adsfsdf s",
      summary:
        "Vivamus euismod placerat pretium. Vivamus sit amet est pulvinar, convallis sem et, blandit sapien. Suspendisse potenti. In hac habitasse platea dictumst. Donec imperdiet diam urna, a scelerisque velit tempor nec. Quisque id ullamcorper eros, id feugiat risus.",
    },
    {
      title: "Article five",
      summary:
        "Ned gravida convallis nulla non tempor. Fusce a nulla volutpat, porta neque sit amet, condimentum tortor. Nam at diam pellentesque, blandit eros vitae, sagittis erat. Morbi id placerat erat, et pharetra libero. Aenean metus enim, luctus in justo a, tincidunt malesuada mi.",
    },
    {
      title: "Article six",
      summary:
        "Donec dignissim lobortis lacus sed convallis. Donec suscipit dui id turpis cursus, sed aliquam tellus iaculis. Quisque congue est id risus efficitur sagittis.Duis quis elit at lorem porta hendrerit id imperdiet augue. Nulla ut est eleifend, elementum ante eu, pharetra ligula.",
    },
  ];

  // results list only
  //
  // return (
  //   <div className="grid h-[400px] w-[600px] grid-cols-[1fr_max-content_60%] grid-rows-[max-content_1fr]">
  //     <div className="col-span-3 flex gap-3 px-3 py-5">
  //       <Input placeholder="E.g., a person was found in a possesison of a firearm" />

  //       <Button variant="secondary">Search</Button>
  //     </div>

  //     <ScrollArea className="col-span-3 px-3">
  //       <div className="flex flex-col gap-1">
  //         {data.map((d, index) => (
  //           <ListItem
  //             key={index}
  //             active={index === 1}
  //             title={d.title}
  //             summary={d.summary}
  //             onClick={() => {}}
  //           />
  //         ))}
  //       </div>
  //     </ScrollArea>
  //   </div>
  // );

  let expandedView;
  if (selected !== null) {
    expandedView = (
      <div className="flex flex-col overflow-hidden border-l pr-1">
        <div className="flex flex-shrink-0 items-center pl-5">
          <div className="mr-4 truncate text-base font-bold">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum
            nulla mollitia harum eveniet
          </div>

          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <ExternalLinkIcon />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={() => setSelected(null)}
          >
            <Cross1Icon />
          </Button>
        </div>

        <ScrollArea className="flex-grow-1 pl-5 pr-2">
          <div className="mb-1 text-sm">Summary:</div>

          <div className="mb-5 text-sm text-muted-foreground">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore
            voluptate, quod atque iste in nisi! Debitis rerum maxime illum?
            Nihil, animi aliquid! Sit, facilis repellat dicta vitae inventore
            odio necessitatibus!
          </div>

          <div className="mb-1 text-sm">Source:</div>

          <div className="mb-1 text-sm text-muted-foreground">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore
            voluptate, quod atque iste in nisi! Debitis rerum maxime illum?
            Nihil, animi aliquid! Sit, facilis repellat dicta vitae inventore
            odio necessitatibus!
          </div>

          <div className="mb-1 text-sm text-muted-foreground">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore
            voluptate, quod atque iste in nisi! Debitis rerum maxime illum?
            Nihil, animi aliquid! Sit, facilis repellat dicta vitae inventore
            odio necessitatibus!
          </div>

          <div className="mb-1 text-sm text-muted-foreground">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore
            voluptate, quod atque iste in nisi! Debitis rerum maxime illum?
            Nihil, animi aliquid! Sit, facilis repellat dicta vitae inventore
            odio necessitatibus!
          </div>
        </ScrollArea>
      </div>
    );
  }

  let contentView;
  if (loading) {
    contentView = (
      <div className="col-span-2 flex flex-col items-center justify-center">
        <div className="flex flex-grow items-center justify-center">
          <PuffLoader color="#3b82f6" className="mb-4" />
        </div>

        <div className="flex-shrink-0 text-xs text-muted-foreground">
          Reading document 5 of 50
        </div>
      </div>
    );
  } else if (results?.length) {
    contentView = (
      <ScrollArea className={cn("px-3", selected === null && "col-span-2")}>
        <div className="flex flex-col gap-1">
          {data.map((d, index) => (
            <ListItem
              onClick={() => setSelected(index)}
              key={index}
              active={index === selected}
              title={d.title}
              expanded={selected === null}
              summary={d.summary}
            />
          ))}
        </div>
      </ScrollArea>
    );
  } else if (results?.length === 0) {
    contentView = (
      <div className="col-span-2 flex items-center justify-center text-muted-foreground">
        No match found, try a different search query
      </div>
    );
  } else {
    contentView = (
      <div className="col-span-2 flex items-center justify-center text-sm text-muted-foreground">
        Search within the available documents
      </div>
    );
  }

  function getResults(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setResults(data);
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="grid h-[400px] w-[600px] grid-cols-[1fr_60%] grid-rows-[max-content_1fr] gap-x-1 gap-y-3 pb-3">
      <form
        className="col-span-2 flex gap-3 border-b bg-accent px-3 py-3"
        onSubmit={getResults}
      >
        <Input
          disabled={loading}
          placeholder="E.g., a person was found in a possesison of a firearm"
        />

        <Button disabled={loading}>Search</Button>
      </form>

      {contentView}

      {expandedView}
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
