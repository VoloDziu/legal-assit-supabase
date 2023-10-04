import { Cross1Icon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Connections, Message } from "../messaging";
import { TabState } from "../store/tabs";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ListItem } from "./components/ui/list";
import { ScrollArea } from "./components/ui/scroll-area";
import { mockLoadingState } from "./mockState";
import { DefaultView } from "./views/Default";
import { LoadingView } from "./views/Loading";
import { NotSupportedView } from "./views/NotSupported";
import { SearchResultsView } from "./views/SearchResults";

function App() {
  const [appState, setAppState] = useState<TabState | undefined>();
  const [port, setPort] = useState<chrome.runtime.Port>();
  const [selected, setSelected] = useState<string | null>(null);

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

  // no search performed
  //
  // return (
  //   <div className="w-[600px] h-[400px] flex flex-col">
  //     <div className="py-4 px-8 bg-neutral flex gap-3 flex-shrink-0">
  //       <Input placeholder="E.g., a person was found in a possesison of a firearm" />

  //       <Button>Search</Button>
  //     </div>

  //     <div className="p-3 flex-grow flex items-center justify-center">
  //       <Typography variant="mutedText">
  //         Start searching via the search box above
  //       </Typography>
  //     </div>
  //   </div>
  // );

  // empty results
  //
  // return (
  //   <div className="w-[600px] h-[400px] flex flex-col">
  //     <div className="py-4 px-8 bg-neutral flex gap-3 flex-shrink-0">
  //       <Input placeholder="E.g., a person was found in a possesison of a firearm" />

  //       <Button>Search</Button>
  //     </div>

  //     <div className="p-3 flex-grow flex items-center justify-center">
  //       <Typography variant="mutedText">No match found :(</Typography>
  //     </div>
  //   </div>
  // );

  // loading
  //
  // return (
  //   <div className="w-[600px] h-[400px] flex flex-col">
  //     <div className="py-4 px-8 bg-neutral flex gap-3 flex-shrink-0">
  //       <Input
  //         disabled
  //         placeholder="E.g., a person was found in a possesison of a firearm"
  //       />

  //       <Button disabled>Search</Button>
  //     </div>

  //     <div className="p-3 flex-grow flex flex-col items-center justify-center">
  //       <PuffLoader color="#3b82f6" className="mb-2" />
  //       <Typography className="text-primary opacity-50">
  //         Reading document 5 of 50
  //       </Typography>
  //     </div>
  //   </div>
  // );

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

  return (
    <div className="grid h-[400px] w-[600px] grid-cols-[1fr_60%] grid-rows-[max-content_1fr] gap-x-2 gap-y-3 pb-3">
      <div className="col-span-2 flex gap-3 border-b bg-accent px-3 py-3">
        <Input placeholder="E.g., a person was found in a possesison of a firearm" />

        <Button>Search</Button>
      </div>

      <ScrollArea className="px-3">
        <div className="flex flex-col gap-1">
          {data.map((d, index) => (
            <ListItem
              key={index}
              active={index === 1}
              title={d.title}
              summary={d.summary}
              onClick={() => {}}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="flex flex-col overflow-hidden border-l">
        <div className="flex flex-shrink-0 items-center pl-5 pr-1">
          <div className="mr-4 truncate text-base font-bold">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum
            nulla mollitia harum eveniet
          </div>

          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <ExternalLinkIcon />
          </Button>

          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Cross1Icon />
          </Button>
        </div>

        <ScrollArea className="flex-grow-1 pl-5 pr-3">
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
