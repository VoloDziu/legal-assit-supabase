import { StateContext } from "@/App";
import { useContext } from "react";
import SearchViewDetails from "./SearchViewDetails";
import SearchViewEmpty from "./SearchViewEmpty";
import SearchViewError from "./SearchViewError";
import SearchViewForm from "./SearchViewForm";
import SearchViewInitial from "./SearchViewInitial";
import SearchViewList from "./SearchViewList";
import SearchViewLoading from "./SearchViewLoading";

function SearchView() {
  const state = useContext(StateContext);

  if (!state) {
    return;
  }

  let contentView;
  if (state.status === "initial") {
    contentView = <SearchViewInitial />;
  } else if (state.status === "loading") {
    contentView = <SearchViewLoading />;
  } else if (state.status === "error") {
    contentView = <SearchViewError />;
  } else if (state.searchResults.length === 0) {
    contentView = <SearchViewEmpty />;
  } else {
    contentView = <SearchViewList />;
  }

  return (
    <div className="grid h-[400px] w-[600px] grid-cols-[1fr_60%] grid-rows-[max-content_1fr] gap-x-1 gap-y-3 pb-3">
      <SearchViewForm />
      {contentView}
      <SearchViewDetails />
    </div>
  );
}

export default SearchView;
