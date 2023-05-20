import React, { useState } from "react";

import { Stack, Avatar, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { createComment, updateComment } from "./commentSlice";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function CommentForm({ storyId, commentID, setIsEdit, isEdit, chapterId }) {
  const { commentsById } = useSelector(
    (state) => ({
      commentsById: state.comment.commentsById,
    }),
    shallowEqual
  );

  let text = "";
  if (commentsById && commentID) {
    text = commentsById[commentID].content;
  }

  const [content, setContent] = useState(text);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      const currentLocation = window.location.pathname; // Get the current location
      navigate("/login", { state: { from: currentLocation } }); // Pass the current location as state to the login page
    }
    if (!isEdit) {
      dispatch(createComment({ storyId, chapterId, content }));
      setContent("");
      return;
    }
    if (isEdit) {
      dispatch(updateComment({ content, commentID, storyId, chapterId }));
      setContent("");
      setIsEdit(false);
      return;
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Stack
        direction="row"
        alignItems="center"
        display="flex"
        justifyContent="center"
        // width="70%"
      >
        <Avatar />
        <TextField
          fullWidth
          size="small"
          value={content}
          placeholder="What do you think?"
          onChange={(event) => setContent(event.target.value)}
          sx={{
            ml: 2,
            mr: 1,
            "& fieldset": {
              borderWidth: `1px !important`,
              borderColor: (theme) =>
                `${theme.palette.grey[500_32]} !important`,
            },
          }}
        />
        <IconButton type="submit">
          <SendIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Stack>
    </form>
  );
}

export default CommentForm;
