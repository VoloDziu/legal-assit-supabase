import { Document, SummaryResult } from "../../models";

interface Props {
  document: Document;
  summary?: SummaryResult;
}

export function SearchResultsItem({ document, summary }: Props) {
  return (
    <div className="bg-white p-3 mb-3">
      <a
        href={document.url}
        onClick={() => chrome.tabs.create({ url: document.url })}
        className="block mb-3 underline"
      >
        {document.title}
      </a>

      <div className="text-xs">
        {summary?.summary || "Failed to search the document"}
      </div>
    </div>
  );
}
