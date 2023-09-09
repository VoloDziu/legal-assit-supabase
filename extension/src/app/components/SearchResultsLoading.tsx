import { ScaleLoader } from "react-spinners";
import { Document } from "../../store/models";

interface Props {
  documents: Document[];
}

export function SearchResultsLoading({ documents }: Props) {
  const documentsCount = documents.length;
  const processedDocumentsCount = documents.filter((d) => d.isProcessed).length;

  return (
    <div className="flex flex-col items-center py-5">
      <ScaleLoader color="#64748b" className="mb-2" />

      <div className="text-slate-500">
        {processedDocumentsCount < documentsCount
          ? `Reading document ${
              processedDocumentsCount || 1
            } out of ${documentsCount}`
          : `Searching through the documents...`}
      </div>
    </div>
  );
}
