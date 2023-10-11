import { ChromePortContext, StateContext } from "@/App";
import { Cross1Icon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useContext } from "react";
import { Message } from "src/messaging";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

function SearchViewDetails() {
  const state = useContext(StateContext);
  const port = useContext(ChromePortContext);

  if (!state || state.selectedDocumentIndex === null) {
    return;
  }

  const selectedResult = state.searchResults[state.selectedDocumentIndex];
  const selectedDocument = state.documents.find(
    (d) => d.id === selectedResult.documentId,
  );

  function resetSelection() {
    port?.postMessage({
      type: "result-selected",
      index: null,
    } as Message);
  }

  return (
    <div
      key={selectedDocument?.id}
      className="flex flex-col overflow-hidden border-l pr-1"
    >
      <div className="flex flex-shrink-0 items-center pl-5">
        <div className="mr-4 flex-grow truncate text-base font-bold">
          {selectedDocument?.title}
        </div>

        {/* TODO: link icon-buttons */}
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <ExternalLinkIcon />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          onClick={resetSelection}
        >
          <Cross1Icon />
        </Button>
      </div>

      <ScrollArea className="flex-grow-1 pl-5 pr-2">
        <div className="mb-1 text-sm">Summary:</div>

        <div className="mb-5 text-sm text-muted-foreground">
          {selectedResult.summary}
        </div>

        <div className="mb-1 text-sm">Source:</div>

        <div className="flex flex-col gap-2">
          {selectedResult.paragraphs.map((p, index) => {
            const divider = index > 0 ? <div className="">&#8943;</div> : "";

            return (
              <>
                {divider}

                <div
                  className="flex flex-col gap-2 text-sm text-muted-foreground"
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: p,
                  }}
                ></div>
              </>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default SearchViewDetails;
