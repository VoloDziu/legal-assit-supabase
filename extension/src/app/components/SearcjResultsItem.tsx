import { SearchResult } from "../../models";
import { Document } from "../../store/tabs";

interface Props {
  item: SearchResult;
  document?: Document;
}

export function SearchResultsItem({ item, document }: Props) {
  return (
    <div className="bg-white p-3 mb-3">
      <a
        href={document!.url}
        onClick={() => chrome.tabs.create({ url: document!.url })}
        className="block mb-3 underline"
      >
        {document!.title}
      </a>

      <div className="text-xs">{item.summary}</div>
    </div>
  );
}
