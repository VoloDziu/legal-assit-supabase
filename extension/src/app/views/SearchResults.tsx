import { FormEventHandler, useState } from "react";
import { Message } from "../../messaging";
import { TabState } from "../../store/tabs";
import { SearchResultsItem } from "../components/SearchResultsItem";
import { SearchResultsLoading } from "../components/SearchResultsLoading";

function capitalizeFirstLetter(word: string) {
  const firstChar = word.charAt(0).toUpperCase();
  const remainingChars = word.slice(1);
  return `${firstChar}${remainingChars}`;
}

interface Props {
  state: TabState;
  port?: chrome.runtime.Port;
}

export function SearchResultsView({ state, port }: Props) {
  const [query, setQuery] = useState<string>(state.data?.query ?? "");

  const submit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    port?.postMessage({ type: "start-search", query } as Message);
  };

  const title = state.origin
    ? capitalizeFirstLetter(state.origin)
    : "LegalAssist";

  let content;

  if (state.data?.status === "loading") {
    content = <SearchResultsLoading documents={state.data.documents} />;
  }

  if (
    state.data?.status === "idle" &&
    Object.values(state.data.searchResults).length > 0
  ) {
    content = state.data.searchResults.map((result, index) => (
      <SearchResultsItem
        item={result}
        document={state.data!.documents.find((d) => d.id === result.documentId)}
        key={index}
      />
    ));
  }

  return (
    <div className="flex min-h-screen w-screen flex-col items-stretch px-4 py-12">
      <div className="mb-4 text-center text-2xl font-semibold">{title}</div>

      <form className="mb-4" onSubmit={submit}>
        <div className="mb-2">Refine your results with semantic search.</div>
        <textarea
          disabled={state.data?.status === "loading"}
          className="mb-1 w-full rounded-sm border border-slate-400 p-2 text-sm transition-all disabled:bg-slate-100 disabled:text-slate-400"
          name="question"
          placeholder="e.g., application was granted in part"
          value={query}
          rows={5}
          onChange={(e) => setQuery(e.target.value)}
        ></textarea>

        <button
          className="block w-full rounded-sm bg-blue-700 py-2 text-sm font-medium text-white transition-all hover:bg-blue-800 active:bg-blue-900 disabled:bg-slate-400"
          disabled={state.data?.status === "loading"}
        >
          search in documents
        </button>
      </form>

      {content}
    </div>
  );
}
