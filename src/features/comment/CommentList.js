import React, { useEffect } from "react";

import { Pagination, Stack, Typography } from "@mui/material";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { deleteComment, getComments } from "./commentSlice";
import CommentCard from "./CommentCard";

import { COMMENTS_PER_POST } from "../../app/config";
import { useState } from "react";
import Notification from "../../components/Notification";

function CommentList({ storyId, chapterId }) {
  const {
    commentsByStory,
    commentsByChapter,
    totalCommentsByStory,
    totalCommentsByChapter,

    currentPageByStory,
    currentPageByChapter,
    commentsById,
  } = useSelector(
    (state) => ({
      commentsByStory: state.comment.commentsByStory[storyId],
      commentsByChapter: state.comment.commentsByChapter[chapterId],
      totalCommentsByStory: state.comment.totalCommentsByStory[storyId],
      totalCommentsByChapter: state.comment.totalCommentsByChapter[chapterId],

      currentPageByStory: state.comment.currentPageByStory[storyId] || 1,
      currentPageByChapter: state.comment.currentPageByChapter[chapterId] || 1,

      commentsById: state.comment.commentsById,
    }),
    shallowEqual
  );
  const [deletingComment, setDeletingComment] = useState(null);

  let totalComments;
  if (commentsByStory?.length > 0) {
    totalComments = totalCommentsByStory;
  }
  if (commentsByChapter?.length > 0) {
    totalComments = totalCommentsByChapter;
  }

  const totalPages = Math.ceil(totalComments / COMMENTS_PER_POST);
  const dispatch = useDispatch();

  const handleDeleteComment = async (commentId) => {
    setDeletingComment(commentId);
  };

  const handleConfirmDelete = () => {
    dispatch(
      deleteComment({
        commentId: deletingComment,
        storyId,
        chapterId,
        page: currentPageByStory,
      })
    );
  };

  useEffect(() => {
    if (storyId) {
      dispatch(getComments({ storyId }));
    }
    if (chapterId) {
      dispatch(getComments({ chapterId }));
    }
  }, []);

  let renderComments;

  if (commentsByStory) {
    const comments = commentsByStory.map(
      (commentId) => commentsById[commentId]
    );

    renderComments = (
      <Stack spacing={1.5}>
        {comments.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            handleDeleteComment={handleDeleteComment}
            storyId={storyId}
          />
        ))}
      </Stack>
    );
  }
  if (commentsByChapter) {
    const comments = commentsByChapter.map(
      (commentId) => commentsById[commentId]
    );

    renderComments = (
      <Stack spacing={1.5}>
        {comments.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            handleDeleteComment={handleDeleteComment}
            chapterId={chapterId}
          />
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5}>
      {deletingComment && (
        <Notification
          message={`Are you sure you want to delete this comment?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingComment(null)}
        />
      )}
      {commentsByStory && (
        <>
          <Stack
            direction="row"
            justifyContent="end"
            sx={{ marginBottom: 3, alignItems: "center" }}
          >
            <Typography
              variant="subtitle"
              sx={{
                color: "text.secondary",
                display: "flex",
              }}
            >
              {totalComments > 1
                ? `${totalComments} comments`
                : totalComments === 1
                ? `${totalComments} comment`
                : "No comment"}
            </Typography>
            {totalComments > COMMENTS_PER_POST && (
              <Pagination
                count={totalPages}
                page={currentPageByStory}
                onChange={(e, page) => dispatch(getComments({ storyId, page }))}
              />
            )}
          </Stack>
          {renderComments}
        </>
      )}
      {commentsByChapter && (
        <>
          {renderComments}
          <Stack
            direction="row"
            justifyContent="space-between"
            position="absolute"
            bottom="70px"
            alignItems="center"
          >
            <Typography variant="subtitle" sx={{ color: "text.secondary" }}>
              {totalComments > 1
                ? `${totalComments} comments`
                : totalComments === 1
                ? `${totalComments} comment`
                : "No comment"}
            </Typography>
            {totalComments > COMMENTS_PER_POST && (
              <Pagination
                count={totalPages}
                page={currentPageByChapter}
                onChange={(e, page) =>
                  dispatch(getComments({ chapterId, page }))
                }
              />
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default CommentList;
