import { configureStore } from "@reduxjs/toolkit";
import commentSlice from "../features/comment/commentSlice";
import chapterSlice from "../features/chapter/chapterSlice";
import storySlice from "../features/story/storySlice";
import userSlice from "../features/user/userSlice";

const rootReducer = {
  comment: commentSlice,
  chapter: chapterSlice,
  story: storySlice,
  user: userSlice,
};
const store = configureStore({
  reducer: rootReducer,
});

export default store;
