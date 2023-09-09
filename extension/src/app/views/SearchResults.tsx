import { FormEventHandler, useState } from "react";
import { TabState } from "../../store/tabs";
import { searchFormSubmitted } from "../../store/models";
import { ScaleLoader } from "react-spinners";

interface Props {
  state: TabState;
  port?: chrome.runtime.Port;
}

export function SearchResultsView({ state, port }: Props) {
  const [query, setQuery] = useState<string>(state.search?.query ?? "");

  const submit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    port?.postMessage(searchFormSubmitted(query));
  };

  const title = state.origin
    ? capitalizeFirstLetter(state.origin)
    : "LegalAssist";

  function capitalizeFirstLetter(word: string) {
    const firstChar = word.charAt(0).toUpperCase();
    const remainingChars = word.slice(1);
    return `${firstChar}${remainingChars}`;
  }

  let loadingView = <></>;
  if (state.search?.status === "loading") {
    loadingView = (
      <div className="flex flex-col items-center py-5">
        <ScaleLoader color="#64748b" className="mb-2" />

        <div className="text-slate-500">
          {state.search.results.length < state.search.resultsCount
            ? `Reading document ${state.search.results.length || 1} out of ${
                state.search.resultsCount
              }`
            : `Searching through the documents...`}
        </div>
      </div>
    );
  }

  let resultsView = <></>;
  if (state.search?.searchResults && state.search.status === "idle") {
    resultsView = (
      <>
        {state.search.searchResults.map((r) => (
          <div className="bg-white p-3 mb-3" key={r.metadata.id}>
            <a href={r.metadata.url} className="block mb-3">
              {r.metadata.title}
            </a>

            <div className="text-xs">{r.page_content.slice(0, 100)}...</div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="min-h-screen w-screen flex flex-col items-stretch py-12 px-4">
      <div className="text-2xl font-semibold text-center mb-4">{title}</div>

      <form className="mb-4" onSubmit={submit}>
        <div className="mb-2">Refine your results with semantic search.</div>
        <textarea
          disabled={state.search?.status === "loading"}
          className="text-sm w-full border rounded-sm mb-1 p-2 border-slate-400 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
          name="question"
          placeholder="e.g., application was granted in part"
          value={query}
          rows={5}
          onChange={(e) => setQuery(e.target.value)}
        ></textarea>

        <button
          className="block w-full text-sm rounded-sm text-white font-medium bg-blue-700 py-2 hover:bg-blue-800 active:bg-blue-900 disabled:bg-slate-400 transition-all"
          disabled={state.search?.status === "loading"}
        >
          search in documents
        </button>
      </form>

      {loadingView}
      {resultsView}
    </div>
  );
}
