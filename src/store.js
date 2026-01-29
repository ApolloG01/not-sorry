import { configureStore } from "@reduxjs/toolkit";
import jokesReducer from "./features/jokes/jokesSlice";

export const store = configureStore({
  reducer: {
    jokes: jokesReducer,
  },
});
