import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import apiService2 from "../../app/apiService2";

import { STORIES_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  isLoading: false,
  error: null,
  AllStoriesWithSort: [],
  story: [],
  AllStories: [],
  storiesOfUser: [],
  lovedStoriesOfUser: [],
  currentPageStories: [],
};

const slice = createSlice({
  name: "story",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    resetStories(state, action) {
      state.lovedStoriesOfUser = [];
    },

    getStoriesSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { stories, count } = action.payload;

      // story.forEach((story) => {
      //   state.storiesById[story._id] = story;
      //   if (!state.currentPageStories.includes(story._id))
      //     state.currentPageStories.push(story._id);
      // }) ;  todo
      state.story = stories;
      state.totalStories = count; // toask: add totalStories?
    },
    getSingleStorySuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.story = action.payload;
    },
    getStoriesOfUserSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { stories, count, totalPages } = action.payload;

      // story.forEach((story) => {
      //   state.storiesById[story._id] = story;
      //   if (!state.currentPageStories.includes(story._id))
      //     state.currentPageStories.push(story._id);
      // }) ;  todo
      state.storiesOfUser = stories;
      state.totalPages = totalPages;
      state.totalStories = count; // toask: add totalStories?
    },
    getLovedStoriesOfUserSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { stories, totalPages, count } = action.payload;

      // story.forEach((story) => {
      //   state.storiesById[story._id] = story;
      //   if (!state.currentPageStories.includes(story._id))
      //     state.currentPageStories.push(story._id);
      // }) ;  todo
      state.lovedStoriesOfUser = stories;
      state.totalStories = count; // toask: add totalStories?
      state.totalPages = totalPages;
    },
    getAllStoriesSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { stories, count, totalPages } = action.payload;

      // story.forEach((story) => {
      //   state.storiesById[story._id] = story;
      //   if (!state.currentPageStories.includes(story._id))
      //     state.currentPageStories.push(story._id);
      // }) ;  todo
      state.AllStories = stories;
      state.totalStories = count; // toask: add totalStories?
      state.totalPages = totalPages; // toask: add totalStories?
    },
    getAllStoriesWithSortSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.AllStoriesWithSort = action.payload;
    },

    createStorySuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.story = action.payload;
    },

    sendStoryReactionSuccess(state, action) {
      state.error = null;

      state.story.reactions = action.payload.reactions;
    },

    removeStoryNotSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    updateStorySuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { story } = action.payload;

      state.story = story;
    },
  },
});

export default slice.reducer;

export const getStoriesOfUser =
  ({ userId, page = 1, limit = STORIES_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      const response = await apiService2.get(`/stories/user/${userId}`, {
        params,
      });

      if (page === 1) dispatch(slice.actions.resetStories());
      dispatch(slice.actions.getStoriesOfUserSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };

export const getLovedStoriesOfUser =
  ({ userId, page = 1, limit = STORIES_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      if (page === 1) dispatch(slice.actions.resetStories());
      const response = await apiService2.get(`/stories/user/${userId}/loved`, {
        params,
      });
      console.log("getLovedStoriesOfUser", response.data.data);

      dispatch(slice.actions.getLovedStoriesOfUserSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };

export const getSingleStory =
  ({ storyId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService2.get(`/stories/${storyId}`);

      dispatch(slice.actions.getSingleStorySuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };

export const getStories =
  ({ page = 1, limit = STORIES_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      const response = await apiService2.get(`/stories`, {
        params,
      });

      if (page === 1) dispatch(slice.actions.resetStories());

      dispatch(slice.actions.getAllStoriesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };

export const getStoriesWithSort =
  ({ page = 1, limit = STORIES_PER_PAGE, sort }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());

    try {
      const params = { page, limit };
      const response = await apiService2.get(`/stories`, {
        params,
      });

      if (page === 1) dispatch(slice.actions.resetStories());
      let storiesWithGenres;
      if (sort === "view") {
        storiesWithGenres = response.data.data.stories.sort(
          (a, b) => b.view - a.view
        );
      }
      if (sort === "like") {
        storiesWithGenres = response.data.data.stories.sort(
          (a, b) => b.reactions.like - a.reactions.like
        );
      }
      dispatch(slice.actions.getAllStoriesWithSortSuccess(storiesWithGenres));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };

export const createStory =
  ({ title, authorName, artist, genres, minimumAge, summarize, cover }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    // try {

    const imageUrl = await cloudinaryUpload([cover]);

    await apiService2
      .post("/stories", {
        title,
        authorName,
        artist,
        genres,
        minimumAge,
        summarize,
        cover: imageUrl[0],
      })
      .then((data) => {
        dispatch(slice.actions.createStorySuccess(data.data.data));
        toast.success("Create Story Successfully");
      })
      .catch((error) => {
        dispatch(slice.actions.hasError(error));
        toast.error(error);
      });
  };

export const deleteStory =
  ({ storyId, userId, page = 1, limit = STORIES_PER_PAGE }) =>
  async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      await apiService2.delete(`/stories/${storyId}`);
      // dispatch(
      //   slice.actions.removeStorySuccess({ ...response.data.data, storyId })
      // );
      toast.success("Delete Story successfully");

      // dispatch(getStoriesOfUser({ userId, page, limit }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };

export const updateStory = (data) => async (dispatch) => {
  dispatch(slice.actions.startLoading());

  try {
    const imageUrl = await cloudinaryUpload([data.cover]);
    data.cover = imageUrl[0];

    const response = await apiService2.put(`/stories/${data.storyId}`, {
      data,
    });

    dispatch(slice.actions.updateStorySuccess(response.data.data));

    toast.success("Update Story Successfully");

    // dispatch(getStories());
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error);
  }
};

export const updateReactionStory =
  ({ storyId }, { data }) =>
  async (dispatch) => {
    try {
      const response = await apiService2.put(`/stories/reaction/${storyId}`, {
        data,
      });
      dispatch(slice.actions.sendStoryReactionSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      // toast.error(error);
    }
  };
