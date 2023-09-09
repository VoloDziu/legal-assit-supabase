import { FormEventHandler, useState } from "react";
import { Message, TabState } from "../../store/models";
import { SearchResultsLoading } from "../components/SearchResultsLoading";
import { SearchResultsItem } from "../components/SearcjResultsItem";

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

  function capitalizeFirstLetter(word: string) {
    const firstChar = word.charAt(0).toUpperCase();
    const remainingChars = word.slice(1);
    return `${firstChar}${remainingChars}`;
  }

  let content;

  if (state.data?.status === "loading") {
    content = <SearchResultsLoading documents={state.data.documents} />;
  }

  if (
    state.data?.status === "idle" &&
    Object.values(state.data.similaritySearchResults).length > 0
  ) {
    content = state.data.documents.map((doc) => (
      <SearchResultsItem
        document={doc}
        summary={state.data?.similaritySearchResults[doc.id]}
        key={doc.id}
      />
    ));
  }

  return (
    <div className="min-h-screen w-screen flex flex-col items-stretch py-12 px-4">
      <div className="text-2xl font-semibold text-center mb-4">{title}</div>

      <form className="mb-4" onSubmit={submit}>
        <div className="mb-2">Refine your results with semantic search.</div>
        <textarea
          disabled={state.data?.status === "loading"}
          className="text-sm w-full border rounded-sm mb-1 p-2 border-slate-400 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
          name="question"
          placeholder="e.g., application was granted in part"
          value={query}
          rows={5}
          onChange={(e) => setQuery(e.target.value)}
        ></textarea>

        <button
          className="block w-full text-sm rounded-sm text-white font-medium bg-blue-700 py-2 hover:bg-blue-800 active:bg-blue-900 disabled:bg-slate-400 transition-all"
          disabled={state.data?.status === "loading"}
        >
          search in documents
        </button>
      </form>

      {content}
    </div>
  );
}
