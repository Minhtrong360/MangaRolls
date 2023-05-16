import { IconButton, Stack, Typography } from "@mui/material";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import React from "react";
import { useDispatch } from "react-redux";
import { updateReactionComment } from "./commentSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function CommentReaction({ comment }) {
  const dispatch = useDispatch();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleClick = (emoji) => {
    if (!auth?.user) {
      navigate("../../login");
    }
    dispatch(updateReactionComment({ commentId: comment._id, emoji }));
  };

  return (
    <Stack direction="row" alignItems="center">
      <IconButton
        onClick={() => handleClick("like")}
        sx={{ color: "primary.main" }}
      >
        <ThumbUpRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Typography variant="body2" mr={1}>
        {comment?.reactions?.like}
      </Typography>

      <IconButton
        onClick={() => handleClick("disLike")}
        sx={{ color: "error.main" }}
      >
        <ThumbDownAltRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Typography variant="body2">{comment?.reactions?.disLike}</Typography>
    </Stack>
  );
}

export default CommentReaction;
