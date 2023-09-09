import { TabState } from "../../store/models";

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
    <div className="h-screen w-screen flex flex-col items-stretch py-12 px-4">
      <div className="text-slate-950 text-2xl font-semibold text-center mb-4">
        {title}
      </div>

      <div className="bg-white shadow-sm rounded-sm p-4">
        <div className="mb-4">Welcome to LegalAssist!</div>
        <div>
          Start by searching the library. LegalAssist will then help you refine
          and analyze your results
        </div>
      </div>
    </div>
  );
}
