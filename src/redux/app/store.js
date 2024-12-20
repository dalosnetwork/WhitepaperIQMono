import { configureStore } from "@reduxjs/toolkit";
import analyseReducer  from "../features/analysedata/analyseSlice";
import chatReducer  from "../features/chatdata/chatSlice";

export const store = configureStore({
  reducer: {
    analyse: analyseReducer,
    chat: chatReducer,

  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;