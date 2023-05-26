import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import apiService2 from "../../app/apiService2";
import { getChaptersOfStory } from "./chapterSlice";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import LoadingScreen from "../../components/LoadingScreen";

import ChatBox from "../../components/ChatBox";
import { styled } from "@mui/material/styles";

function ChapterContent() {
  const [chapter, setChapter] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showChapters, setShowChapters] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chaptersOfStory } = useSelector((state) => state.chapter);

  useEffect(() => {
    if (params.id) {
      const getSingleChapter = async () => {
        setLoading(true);

        try {
          const res = await apiService2.get(`/chapters/${params.id}`);

          setChapter(res.data.data.chapter);

          setError("");
        } catch (error) {
          console.log(error);
          setError(error);
        }
        setLoading(false);
      };
      getSingleChapter();
    }
  }, [params.id]);

  useEffect(() => {
    if (chapter?.ofStory?._id)
      dispatch(getChaptersOfStory({ storyId: chapter?.ofStory?._id }));
  }, [dispatch, chapter]);

  const toggleShowChapters = () => {
    setShowChapters(!showChapters);
  };
  const toggleShowComments = () => {
    setShowComments(!showComments);
  };

  const ChatBoxWrapper = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",

    position: "absolute",
    right: "-250px",
    bottom: "130px",

    height: "565px", // set the height to 565px
    width: "400px", // set the width to 375px
    padding: theme.spacing(2),
    zIndex: 2,
  }));

  return (
    <Container sx={{ my: 5, overflowAnchor: "none" }}>
      <Box sx={{ position: "relative", height: 1 }}>
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "1.5em" }}>
              <Link underline="hover" color="inherit" href="/">
                MangaRolls
              </Link>
              <Link
                underline="hover"
                color="inherit"
                href={`/story/${chapter?.ofStory?._id}`}
              >
                {chapter?.ofStory?.title}
              </Link>
            </Breadcrumbs>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <Typography
                gutterBottom
                variant="body1"
                component="div"
                noWrap
                sx={{
                  fontSize: 30,
                  fontWeight: 800,
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <span>{`Chương ${chapter?.number + 1}: ${
                  chapter?.title
                }`}</span>
              </Typography>

              <Stack
                sx={{
                  minHeight: "100vh",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {chapter?.content?.map((file) => (
                  <img
                    key={file}
                    src={file}
                    alt="preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      marginBottom: 10,
                    }}
                  />
                ))}
              </Stack>

              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  onClick={async () => {
                    let index = chaptersOfStory.findIndex(
                      (chapter) => chapter._id === params.id
                    );

                    if (index === chaptersOfStory.length - 1) {
                      index = -1;
                    }

                    const prevChapterId = chaptersOfStory[index + 1]._id;
                    navigate(`/chapter/${prevChapterId}`);
                  }}
                >
                  <ArrowCircleLeftIcon sx={{ fontSize: "48px", m: 1.5 }} />
                </Button>
                <Button
                  onClick={async () => {
                    let index = chaptersOfStory.findIndex(
                      (chapter) => chapter._id === params.id
                    );
                    if (index === 0) {
                      index = chaptersOfStory.length;
                    }

                    const nextChapterId = chaptersOfStory[index - 1]._id;
                    navigate(`/chapter/${nextChapterId}`);
                  }}
                >
                  <ArrowCircleRightIcon sx={{ fontSize: "48px", m: 2 }} />
                </Button>

                <Box>
                  <Button onClick={toggleShowChapters}>
                    <LibraryBooksIcon sx={{ fontSize: "48px", m: 2 }} />
                  </Button>

                  {showChapters && (
                    <ChatBoxWrapper>
                      <Typography sx={{ fontSize: "28px" }}>
                        LIST OF CHAPTERS
                      </Typography>
                      <Stack p={1} />
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        {chaptersOfStory?.map((chapter) => (
                          <Button
                            key={chapter?._id}
                            onClick={() => {
                              setShowChapters(!showChapters);
                              navigate(`/chapter/${chapter._id}`);
                            }}
                            sx={{
                              alignContent: "center",
                              color: "white",
                              cursor: "pointer",
                              "&:hover": { color: "primary.main" },
                              marginLeft: 0,
                              paddingLeft: 0,
                              textAlign: "left",
                              fontSize: "24px",
                            }}
                          >
                            Chương {chapter?.number + 1}
                          </Button>
                        ))}
                      </Box>
                    </ChatBoxWrapper>
                  )}
                </Box>
                <Box>
                  <Button onClick={toggleShowComments}>
                    <InsertCommentIcon sx={{ fontSize: "48px", m: 2 }} />
                  </Button>

                  {showComments && <ChatBox chapterId={params.id} />}
                </Box>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}

export default ChapterContent;
