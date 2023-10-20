import { ChromePortContext, StateContext } from "@/App";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { Message } from "src/messaging";
import { ListItem } from "./ui/list";
import { ScrollArea } from "./ui/scroll-area";

function SearchViewList() {
  const state = useContext(StateContext);
  const port = useContext(ChromePortContext);

  function selectResult(index: number) {
    console.log("here!", index);
    port?.postMessage({
      type: "result-selected",
      index,
    } as Message);
  }

  if (!state || state.type !== "sesarch-results") {
    return;
  }

  return (
    <ScrollArea
      className={cn(
        "px-3",
        state.selectedDocumentIndex === null && "col-span-2",
      )}
    >
      <div className="flex flex-col gap-1">
        {state.searchResults.map((result, index) => {
          const document = state.documents.find(
            (d) => d.id === result.documentId,
          );

          return (
            <ListItem
              onClick={() => {
                selectResult(index);
              }}
              key={index}
              active={index === state.selectedDocumentIndex}
              title={document!.title}
              expanded={state.selectedDocumentIndex === null}
              summary={result.summary}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
}

export default SearchViewList;
