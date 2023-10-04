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
    <div className="mb-3 bg-white p-3">
      <a
        href={document!.url}
        onClick={() => chrome.tabs.create({ url: document!.url })}
        className="mb-3 block underline"
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
            <div key={i} className="mb-1 text-xs">
              {p}
            </div>
          ))
        : ""}
    </div>
  );
}
