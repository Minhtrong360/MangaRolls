import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService2 from "../../app/apiService2";
import { POSTS_PER_PAGE } from "../../app/config";
import { STORIES_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  isLoading: false,
  error: null,
  chapters: [],
  chaptersOfStory: [],
  currentPageChapters: [],
};

const slice = createSlice({
  name: "chapter",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    resetChapters(state, action) {
      state.chapters = {};
      state.currentPageChapters = [];
    },

    getChaptersSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { chapters, count } = action.payload;

      state.chaptersOfStory = chapters;

      state.totalChapter = count;
    },

    createChapterSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.chapters = action.payload;
    },

    removeChapterSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { chapterId } = action.payload;

      const context = state.currentPageChapters.find(
        (chapter) => chapter === chapterId
      );
      const index = state.currentPageChapters.indexOf(context);

      delete state.chapters[chapterId];

      state.currentPageChapters.splice(index, 1);
      state.totalChapters -= 1;
    },
    removeChapterNotSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    updateChapterSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { chapter } = action.payload;
      state.chapters = chapter;
      // const context = state.currentPageChapters.find(
      //   (chapter) => chapter === chapterId
      // );
      // const index = state.currentPageChapters.indexOf(context);

      // delete state.chapters[chapterId];

      // state.currentPageStories.splice(index, 1);
      // state.totalChapters -= 1;
    },
  },
});

export default slice.reducer;

export const getChaptersOfStory =
  ({ storyId, page = 1, limit = STORIES_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());

    try {
      const params = { page, limit };
      const response = await apiService2.get(`/chapters/story/${storyId}`, {
        params,
      });

      if (page === 1) dispatch(slice.actions.resetChapters());
      dispatch(slice.actions.getChaptersSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };

export const createChapter =
  ([{ storyId }, { title, avatar, content }]) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const avatarUrl = await cloudinaryUpload(avatar);
      const contentUrl = await cloudinaryUpload(content);

      const response = await apiService2.post(`/chapters/${storyId}`, {
        title,
        avatar: avatarUrl,
        content: contentUrl,
      });

      dispatch(slice.actions.createChapterSuccess(response.data.data));
      toast.success("Create Chapter Successfully");
      dispatch(getChaptersOfStory({ storyId }));
      // dispatch(getCurrentUserProfile());  todo
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };

export const deleteChapter =
  ({ chapterId, userId, page = 1, limit = POSTS_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let text = "Do you want to delete it?";
      let storyId;
      if (window.confirm(text) === true) {
        const response = await apiService2.delete(`/chapters/${chapterId}`);
        storyId = response.data.data.ofStory._id;
        dispatch(
          slice.actions.removeChapterSuccess({
            ...response.data.data,
            chapterId,
          })
        );
        toast.success("Delete chapter successfully");
      } else {
        dispatch(slice.actions.removeChapterNotSuccess());
      }

      dispatch(getChaptersOfStory({ storyId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };

export const updateChapter =
  ({ chapterId }, { data }) =>
  async (dispatch) => {
    const { title, avatar, content } = data;
    dispatch(slice.actions.startLoading());
    try {
      const imageUrl = await cloudinaryUpload(avatar);
      const imageContent = await cloudinaryUpload(content);
      const updateData = {
        title,
        content: imageContent,
        avatar: imageUrl,
      };

      const response = await apiService2.put(`/chapters/${chapterId}`, {
        updateData,
      });
      const storyId = response.data.data.ofStory._id;
      await dispatch(slice.actions.updateChapterSuccess(response.data.data));

      toast.success("Update Story Successfully");

      dispatch(getChaptersOfStory({ storyId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };
