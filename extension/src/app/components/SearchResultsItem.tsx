import { useState } from "react";
import { SearchResult } from "../../models";
import { Document } from "../../store/tabs";

interface Props {
  item: SearchResult;
  document?: Document;
}

export function SearchResultsItem({ item, document }: Props) {
  const [expanded, setExpanded] = useState(false);

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

      <button
        onClick={() => setExpanded((expanded) => !expanded)}
        className="underline"
      >
        {expanded ? "collapse" : "expand"}
      </button>

      {expanded
        ? item.paragraphs.map((p, i) => (
            <div key={i} className="text-xs mb-1">
              {p}
            </div>
          ))
        : ""}
    </div>
  );
}
