import { configureStore } from "@reduxjs/toolkit";
import { tabsSlice } from "./tabs";

export const store = configureStore({
  reducer: {
    tabs: tabsSlice.reducer,
  },
});
