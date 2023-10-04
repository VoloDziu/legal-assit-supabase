import { TabState } from "../../store/tabs";

interface Props {
  state: TabState;
}

export function DefaultView({ state }: Props) {
  let title = state.origin
    ? capitalizeFirstLetter(state.origin)
    : "LegalAssist";

  function capitalizeFirstLetter(word: string) {
    const firstChar = word.charAt(0).toUpperCase();
    const remainingChars = word.slice(1);
    return `${firstChar}${remainingChars}`;
  }

  return (
    <div className="flex h-screen w-screen flex-col items-stretch px-4 py-12">
      <div className="mb-4 text-center text-2xl font-semibold text-slate-950">
        {title}
      </div>

      <div className="rounded-sm bg-white p-4 shadow-sm">
        <div className="mb-4">Welcome to LegalAssist!</div>
        <div>
          Start by searching the library. LegalAssist will then help you refine
          and analyze your results
        </div>
      </div>
    </div>
  );
}
