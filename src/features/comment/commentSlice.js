import { createSlice } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

import apiService2 from "../../app/apiService2";
import { COMMENTS_PER_POST } from "../../app/config";

const initialState = {
  isLoading: false,
  error: null,
  commentsByStory: [],
  commentsByChapter: [],
  totalCommentsByStory: {},
  currentPageByStory: {},
  totalCommentsByChapter: {},
  currentPageByChapter: {},
  commentsById: {},
  comment: [],
};

const slice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getCommentsSuccess(state, action) {
      state.isLoading = false;
      state.error = "";
      const { comments, storyId, chapterId, count, page } = action.payload;

      comments.forEach((comment, index) => {
        state.commentsById[comment._id] = comment;
      });

      if (storyId) {
        state.commentsByStory[storyId] = comments.map((comment) => comment._id);

        state.totalCommentsByStory[storyId] = count;
        state.currentPageByStory[storyId] = page;
      }
      if (chapterId) {
        state.commentsByChapter[chapterId] = comments.map(
          (comment) => comment._id
        );

        state.totalCommentsByChapter[chapterId] = count;
        state.currentPageByChapter[chapterId] = page;
      }
    },

    createCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    sendCommentReactionSuccess(state, action) {
      state.error = null;

      const { reactions, commentId } = action.payload;

      state.commentsById[commentId].reactions = reactions.reactions;
    },

    removeCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { commentId, storyId, chapterId } = action.payload;

      // Xóa commentById theo commentId
      delete state.commentsById[commentId];
      // Xóa comment trong commentByPost theo PostID dựa vào commentId
      if (storyId) {
        const comment = state.commentsByStory[storyId].filter(
          (comment) => comment !== commentId
        );
        state.commentsByStory = {
          ...state.commentsByStory,
          [storyId]: comment,
        };
        // totalCommentByPost - 1
        state.totalCommentsByStory[storyId] -= 1;
        // currentPageByPost - 1
        if (state.currentPageByStory % 3 === 1) {
          state.currentPageByStory[storyId] -= 1;
        }
      }
      if (chapterId) {
        const comment = state.commentsByChapter[chapterId].filter(
          (comment) => comment !== commentId
        );
        state.commentsByChapter = {
          ...state.commentsByChapter,
          [chapterId]: comment,
        };
        // totalCommentByPost - 1
        state.totalCommentsByChapter[chapterId] -= 1;
        // currentPageByPost - 1
        if (state.currentPageByChapter % 3 === 1) {
          state.currentPageByChapter[chapterId] -= 1;
        }
      }
    },
    removeCommentNotSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    updateCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const newComment = action.payload;
      let author = state.commentsById[newComment._id].author;
      state.commentsById[newComment._id] = newComment;
      state.commentsById[newComment._id].author = author;
    },
  },
});

export default slice.reducer;

export const getComments =
  ({ storyId, chapterId, page = 1, limit = COMMENTS_PER_POST }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        page: page,
        limit: limit,
      };
      if (storyId) {
        const response = await apiService2.get(`/stories/${storyId}/comments`, {
          params,
        });

        dispatch(
          slice.actions.getCommentsSuccess({
            ...response.data.data,
            storyId,
            page,
          })
        );
      }
      if (chapterId) {
        const response = await apiService2.get(
          `/chapters/${chapterId}/comments`,
          {
            params,
          }
        );

        dispatch(
          slice.actions.getCommentsSuccess({
            ...response.data.data,
            chapterId,
            page,
          })
        );
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };

export const createComment =
  ({ storyId, chapterId, content }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());

    try {
      if (storyId) {
        const response = await apiService2.post("/comments", {
          targetType: "Story",
          targetId: storyId,
          content,
        });
        dispatch(slice.actions.createCommentSuccess(response.data.data));
        dispatch(getComments({ storyId }));
      }
      if (chapterId) {
        const response = await apiService2.post("/comments", {
          targetType: "Chapter",
          targetId: chapterId,
          content,
        });

        dispatch(slice.actions.createCommentSuccess(response.data.data));
        dispatch(getComments({ chapterId }));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      // toast.error(error);
    }
  };

export const deleteComment =
  ({ commentId, storyId, chapterId, page }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      if (storyId) {
        await apiService2.delete(`/comments/${commentId}`);
        dispatch(slice.actions.removeCommentSuccess({ commentId, storyId }));
        toast.success("Delete comment successfully");
      }
      if (chapterId) {
        await apiService2.delete(`/comments/${commentId}`);
        dispatch(slice.actions.removeCommentSuccess({ commentId, chapterId }));
        toast.success("Delete comment successfully");
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };

export const updateComment =
  ({ content, commentID, storyId, chapterId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let data = { content };
      if (storyId) {
        const response = await apiService2.put(`/comments/${commentID}`, data);

        toast.success("Update comment successfully");

        dispatch(slice.actions.updateCommentSuccess(response.data.data));
        dispatch(getComments({ storyId }));
      }
      if (chapterId) {
        const response = await apiService2.put(`/chapters/${commentID}`, data);

        toast.success("Update comment successfully");

        dispatch(slice.actions.updateCommentSuccess(response.data.data));
        dispatch(getComments({ chapterId }));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error);
    }
  };

export const updateReactionComment =
  ({ commentId, emoji }) =>
  async (dispatch) => {
    const data = emoji;
    try {
      const response = await apiService2.put(
        `/comments/reaction/${commentId}`,
        {
          data,
        }
      );
      dispatch(
        slice.actions.sendCommentReactionSuccess({
          commentId,
          reactions: response.data.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      // toast.error(error);
    }
  };
