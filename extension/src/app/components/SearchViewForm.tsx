import { ChromePortContext, StateContext } from "@/App";
import { FormEvent, useContext, useState } from "react";
import { Message } from "src/messaging";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function SearchViewForm() {
  const state = useContext(StateContext);
  const port = useContext(ChromePortContext);
  const [inputValue, setInputValue] = useState<string | undefined>(
    state?.query || "",
  );

  if (!state) {
    return;
  }

  function doSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    port?.postMessage({
      type: "start-search",
      query: inputValue,
    } as Message);
  }

  return (
    <form
      className="col-span-2 flex gap-3 border-b bg-accent px-3 py-3"
      onSubmit={doSearch}
    >
      {/* search on submit */}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={state.status === "loading"}
        placeholder="E.g., a person was found in a possesison of a firearm"
      />
      <Button disabled={state.status === "loading"}>Search</Button>
    </form>
  );
}

export default SearchViewForm;
