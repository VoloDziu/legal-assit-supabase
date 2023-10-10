import { StateContext } from "@/App";
import { useContext } from "react";
import { PuffLoader } from "react-spinners";

function SearchViewLoading() {
  const state = useContext(StateContext);

  if (!state) {
    return;
  }

  const documentsCount = state.documents.length;
  const processedDocumentsCount = state.documents.filter(
    (d) => d.isProcessed,
  ).length;

  return (
    <div className="col-span-2 flex flex-col items-center justify-center">
      <div className="flex flex-grow items-center justify-center">
        <PuffLoader color="#3b82f6" className="mb-4" />
      </div>

      <div className="flex-shrink-0 text-xs text-muted-foreground">
        {processedDocumentsCount < documentsCount
          ? `Reading document ${
              processedDocumentsCount || 1
            } out of ${documentsCount}`
          : `Searching through the documents...`}
      </div>
    </div>
  );
}

export default SearchViewLoading;
