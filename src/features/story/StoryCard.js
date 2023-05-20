import { useState } from "react";
import { Card, Grid, Typography, Box, Chip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { LoadingButton } from "@mui/lab";

import { useDispatch } from "react-redux";

import { deleteStory } from "./storySlice";
import StoryGenenal from "./StoryGeneral";
import { styled } from "@mui/material/styles";
import Notification from "../../components/Notification";

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
  "&:hover": {
    color: "orange",
    textDecoration: "none",
  },
}));

function StoryCard({
  story,
  userId,
  setPage,
  storiesOfUserFake,
  setStoriesOfUserFake,
  page,
  admin,
}) {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [deletingStory, setDeletingStory] = useState(null);
  const navigate = useNavigate();
  const handleDeleteStory = async (title) => {
    setDeletingStory(title);
  };
  const handleConfirmDelete = () => {
    console.log("story._id", story._id);
    dispatch(deleteStory({ storyId: story._id, userId }));

    setStoriesOfUserFake((prevStories) =>
      prevStories.filter((s) => s._id !== story._id)
    );
    const numStories = storiesOfUserFake?.length - 1; // Subtract 1 for the deleted story
    const elementsPerPage = 8;
    const newPageNumber = Math.ceil(numStories / elementsPerPage);

    // Set the new page number
    if (page === newPageNumber + 1) {
      setPage(newPageNumber);
    }
  };

  return (
    <Card>
      <Grid container>
        <Grid item xs={12} md={6} lg={12}>
          <Box p={2}>
            {!isEditing && (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "row",
                  position: "relative",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  sx={{
                    width: 250,
                    height: 350,
                  }}
                  src={story?.cover}
                  alt="story"
                />
                <Box>
                  <Link
                    to={`/story/${story._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      color="text.primary"
                      p={1}
                      sx={{
                        overflow: "auto",
                        textAlign: "justify",
                        fontSize: "30px",
                        textDecoration: "none",
                        wordWrap: "break-word",
                        maxWidth: "700px",
                      }}
                    >
                      {story?.title.toUpperCase()}
                    </Typography>
                  </Link>

                  <Typography
                    color="text.primary"
                    p={1}
                    sx={{
                      overflow: "auto",
                      textAlign: "justify",
                    }}
                  >
                    Author:
                    {story?.authorName !== "Đang Cập Nhật" ? (
                      <StyledLink to={`/author/${story?.authorName}`}>
                        {story?.authorName}
                      </StyledLink>
                    ) : (
                      story?.authorName
                    )}
                  </Typography>
                  <Typography
                    color="text.primary"
                    p={1}
                    sx={{
                      overflow: "auto",
                      textAlign: "justify",
                    }}
                  >
                    Artist: {story?.artist}
                  </Typography>
                  <Typography
                    variant="h7"
                    paragraph
                    p={1}
                    sx={{
                      overflow: "auto",
                      textAlign: "justify",
                      display: "flex",
                      flexDirection: "row",

                      alignItems: "center",
                      marginBottom: "0px !important",
                    }}
                  >
                    Thể loại:
                    {story?.genres?.map((genre) => (
                      <Chip
                        key={genre}
                        label={genre}
                        component={Link}
                        to={`/stories/:${genre}`}
                        sx={{
                          margin: "0.5rem",
                          cursor: "pointer",
                          "&:hover": {
                            color: "orange", // add color property to change text color on hover
                          },
                        }}
                      />
                    ))}
                  </Typography>

                  <Typography
                    color="text.primary"
                    p={1}
                    sx={{
                      overflow: "auto",
                      textAlign: "justify",
                    }}
                  >
                    Minimum Age: {story?.minimumAge}
                  </Typography>
                  <Typography
                    color="text.primary"
                    p={1}
                    sx={{
                      textAlign: "justify",
                      maxHeight: "130px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Summarize: {story?.summarize}
                  </Typography>
                </Box>
                {!admin && (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    sx={{
                      borderRadius: "30px",
                      position: "absolute",
                      right: 100,
                      top: 0,
                    }}
                    onClick={() => navigate(`editstory/${story._id}`)}
                  >
                    Edit
                  </LoadingButton>
                )}
                <LoadingButton
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: "30px",
                    position: "absolute",
                    right: 0,
                    top: 0,
                  }}
                  onClick={() => handleDeleteStory(story?.title)}
                >
                  Delete
                </LoadingButton>
              </Box>
            )}
            {isEditing && (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <StoryGenenal setIsEditing={setIsEditing} />
              </Box>
            )}
            {deletingStory && (
              <Notification
                message={`Are you sure you want to delete "${deletingStory}"?`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeletingStory(null)}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default StoryCard;
