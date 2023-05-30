import { Box, Card, Container, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import ChapterCreate from "../features/chapter/ChapterCreate";

import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import StoryEdit from "../features/story/StoryEdit";
import apiService2 from "../app/apiService2";

import { getChaptersOfStory } from "../features/chapter/chapterSlice";
import ChapterEdit from "../features/chapter/ChapterEdit";

function EditStoryAndChapterPage() {
  const [story, setStory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { chaptersOfStory } = useSelector((state) => state.chapter);

  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const getSingleStory = async () => {
      setLoading(true);
      try {
        const res = await apiService2.get(`/stories/${params.id}`);
        setStory(res.data.data);
        window.scrollTo({ top: 0, behavior: "smooth" });

        setError("");
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    getSingleStory();
  }, [params.id]);

  useEffect(() => {
    dispatch(getChaptersOfStory({ storyId: params.id }));
  }, [dispatch, params.id]);

  return (
    <Container
      sx={{
        my: 3,
        overflowAnchor: "none",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ position: "relative", height: 1 }}>
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={12} lg={12}>
                  <Typography
                    variant="h4"
                    sx={{
                      paddingTop: 2,
                      borderRadius: 2,
                      overflow: "auto",
                      textAlign: "center", // center the title text
                      fontSize: "30px",
                      textDecoration: "none",
                      wordWrap: "break-word",
                      maxWidth: "70%", // set the maximum width to 70%
                      margin: "auto",
                    }}
                  >
                    {story?.title.toUpperCase()}
                  </Typography>
                  <Box
                    p={2}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <StoryEdit story={story} />
                  </Box>

                  <Grid item xs={12} md={12} lg={12}>
                    {chaptersOfStory?.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          color="text.primary"
                          fontSize="26px"
                          p={1}
                          sx={{
                            overflow: "auto",
                            textAlign: "center",
                            fontWeight: 600,
                            fontSize: { xs: "1em", md: "1.2em" },
                          }}
                        >
                          LIST OF CHAPTERS
                        </Typography>
                      </Box>
                    )}

                    <Grid item xs={12} md={12} lg={12}>
                      {chaptersOfStory?.slice(0, 15).map((chapter, index) => (
                        <ChapterEdit
                          chapter={chapter}
                          loading={loading}
                          error={error}
                          storyEditing={story}
                          key={chapter._id}
                        />
                      ))}
                    </Grid>
                    <Stack p={2} />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <ChapterCreate storyEditing={story} />
                </Grid>
              </Grid>
            </Card>
          </>
        )}
      </Box>
    </Container>
  );
}

export default EditStoryAndChapterPage;
