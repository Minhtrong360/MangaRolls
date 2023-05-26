import { useContext, useEffect, useState } from "react";
import {
  Card,
  Grid,
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Chip,
  Avatar,
  Stack,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import apiService2 from "../app/apiService2";
import LoadingScreen from "../components/LoadingScreen";
import { Alert } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";

import CommentForm from "../features/comment/CommentForm";
import { styled } from "@mui/material/styles";

import CommentList from "../features/comment/CommentList";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleStory,
  updateReactionStory,
} from "../features/story/storySlice";
import { updateLovedStory } from "../features/user/userSlice";
import useAuth from "../hooks/useAuth";

import ChapterGeneral from "../features/chapter/ChapterGeneral";
import ThemeProvider from "../contexts/ThemeProvider";
import ThemeContext from "../contexts/ThemeContext";

const TabsWrapperStyle = styled("div")(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: "100%",
  display: "flex",
  position: "absolute",

  [theme.breakpoints.up("sm")]: {
    justifyContent: "center",
  },
  [theme.breakpoints.up("md")]: {
    justifyContent: "center",
    paddingRight: theme.spacing(3),
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
  "&:hover": {
    color: "orange",
    textDecoration: "none",
  },
}));

function DetailPage() {
  const [chapter, setChapter] = useState(null);
  const [error, setError] = useState("");
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { story, isLoading } = useSelector((state) => state.story);

  const { user } = useAuth();
  const { mode } = useContext(ThemeContext);

  useEffect(() => {
    if (params.id) {
      dispatch(getSingleStory({ storyId: params.id }));
    }
  }, [params, dispatch]);

  const handleClickLike = async (e) => {
    e.preventDefault();
    if (!user) {
      const currentLocation = window.location.pathname; // Get the current location

      navigate("/login", { state: { from: currentLocation } }); // Pass the current location as state to the login page
    } else {
      dispatch(updateReactionStory({ storyId: story._id }, { data: "like" }));
    }
  };
  const handleClickDisLike = async (e) => {
    e.preventDefault();

    if (!user) {
      const currentLocation = window.location.pathname; // Get the current location

      navigate("/login", { state: { from: currentLocation } }); // Pass the current location as state to the login page
    } else {
      dispatch(
        updateReactionStory({ storyId: story._id }, { data: "disLike" })
      );
    }
  };

  const handleLoveStory = () => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(updateLovedStory({ userId: user?._id, lovedStory: story?._id }));
    }
  };

  const lovedStory = user?.lovedStory?.find(
    (storyLoved) => storyLoved === story?._id
  );

  useEffect(() => {
    if (params.id) {
      const getChapters = async () => {
        try {
          const res = await apiService2.get(`/chapters/story/${params.id}`);

          setChapter(res.data.data.chapters);

          setError("");
        } catch (error) {
          console.log(error);
          setError(error.message);
        }
      };
      getChapters();
    }
  }, [params]);

  const [currentTab, setCurrentTab] = useState("Chapter");
  const PROFILE_TAB = [
    {
      value: "Chapter",
      component: (
        <Container
          sx={{
            my: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "90% !important",
              }}
            >
              {chapter?.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    color="text.primary"
                    fontSize="26px"
                    p={1}
                    sx={{ overflow: "auto", textAlign: "center" }}
                  >
                    LIST OF CHAPTERS
                  </Typography>
                </Box>
              )}
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                {chapter?.slice(0, 15).map((chapter, index) => (
                  <Grid item xs={6} md={4} lg={2.4} key={chapter._id}>
                    <ChapterGeneral
                      chapter={chapter}
                      loading={isLoading}
                      error={error}
                    />
                  </Grid>
                ))}
              </Box>
            </Box>
          )}
        </Container>
      ),
    },
    {
      value: "Comment",
      component: (
        <Grid item xs={12} md={6} lg={2.4} width="80% !important">
          <CommentForm storyId={params.id} />
          <br />
          <CommentList storyId={params.id} />
        </Grid>
      ),
    },
  ];

  const handleChangeTab = (newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ fontSize: "1.5em", marginBottom: 3 }}
      >
        <MuiLink underline="hover" color="inherit" href="/">
          MangaRolls
        </MuiLink>
        <MuiLink underline="hover" color="inherit">
          {story?.title}
        </MuiLink>
      </Breadcrumbs>
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            {error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <>
                {story && (
                  <>
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 1,
                        right: 1,
                        zIndex: 1,
                        // backgroundColor: "white",
                        borderRadius: "50%",
                      }}
                      onClick={handleLoveStory}
                    >
                      {!lovedStory && (
                        <FavoriteBorderIcon sx={{ fontSize: "40px" }} />
                      )}
                      {lovedStory && <FavoriteIcon sx={{ fontSize: "40px" }} />}
                    </IconButton>
                    <Card
                      sx={{
                        p: 1,
                        backgroundImage: `url(${story?.cover})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <Box
                        backgroundColor={
                          mode === "dark"
                            ? "rgb(0,0,0,0.9)"
                            : "rgb(245, 246, 250, 0.9)"
                        }
                        padding={5}
                      >
                        <Grid container justifyContent={"space-between"}>
                          <Grid item sm={8} md={7}>
                            <Stack alignItems={"end"} spacing={3}>
                              <Avatar
                                sx={{ width: 80, height: 80 }}
                                src={story?.cover}
                                alt={story?.title}
                              />
                              <Typography
                                color="text.primary"
                                variant="h4"
                                fontWeight="bold"
                                textAlign="right"
                              >
                                {story?.title?.toUpperCase()}
                              </Typography>
                              <Typography
                                color="text.secondary"
                                variant="caption"
                                textAlign="right"
                              >
                                {story?.summarize}
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid item ms={1}>
                            <Divider orientation="vertical" />
                          </Grid>
                          <Grid item sm={8} md={4}>
                            <Stack justifyContent="flex-end" height="100%">
                              <Typography
                                color="text.primary"
                                p={1}
                                sx={{
                                  overflow: "auto",
                                  textAlign: "justify",
                                  textDecoration: "none",
                                }}
                              >
                                Author:
                                <br />
                                {story?.authorName !== "Updating..." ? (
                                  <StyledLink
                                    to={`/author/${story?.authorName}`}
                                  >
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
                                Artist:
                                <br />
                                {story?.artist !== "Updating..." ? (
                                  <StyledLink to={`/artist/${story?.artist}`}>
                                    {story?.artist}
                                  </StyledLink>
                                ) : (
                                  story?.artist
                                )}
                              </Typography>
                              <Typography
                                variant="h7"
                                paragraph
                                p={1}
                                sx={{
                                  overflow: "auto",
                                  textAlign: "justify",
                                  margin: 0,
                                }}
                              >
                                Categories:
                                <br />
                                {story?.genres?.map((genre) => (
                                  <Chip
                                    key={genre}
                                    label={genre}
                                    component={Link}
                                    to={`/stories/:${genre}`}
                                    sx={{
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
                                Recommended age:
                                <br />
                                {story?.minimumAge}
                              </Typography>

                              <Box
                                color="text.primary"
                                p={1}
                                sx={{
                                  overflow: "auto",
                                  textAlign: "justify",
                                  display: "flex",
                                }}
                              >
                                <VisibilityIcon />
                                <Box sx={{ marginLeft: 1 }}>{story?.view}</Box>
                                <Button
                                  sx={{
                                    color: "text.primary",
                                    p: 0,
                                    marginLeft: 2,
                                    borderRadius: "50%",
                                  }}
                                  onClick={(e) => handleClickLike(e)}
                                >
                                  <ThumbUpOffAltIcon />
                                </Button>
                                <Box>{story?.reactions?.like}</Box>
                                <Button
                                  sx={{
                                    color: "text.primary",
                                    p: 0,
                                    marginLeft: 2,
                                    borderRadius: "50%",
                                  }}
                                  onClick={(e) => handleClickDisLike(e)}
                                >
                                  <ThumbDownOffAltIcon />
                                </Button>
                                <Box>{story?.reactions?.disLike}</Box>
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                  </>
                )}

                <Box
                  p={2}
                  sx={{
                    mt: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: 0,
                    alignItems: "center",
                  }}
                >
                  <Card
                    sx={{
                      ml: 0,
                      mr: 0,
                      mb: 2,
                      height: "50px",
                      width: "100%",
                      position: "relative",
                      padding: 0,
                      backgroundColor: "none",
                    }}
                  >
                    <TabsWrapperStyle>
                      <Tabs
                        value={currentTab}
                        scrollButtons="auto"
                        variant="scrollable"
                        allowScrollButtonsMobile
                        onChange={(e, value) => handleChangeTab(value)}
                      >
                        {PROFILE_TAB.map((tab) => (
                          <Tab
                            disableRipple
                            key={tab.value}
                            value={tab.value}
                            icon={tab.icon}
                            label={tab.value.toUpperCase()}
                            color="#fff !important"
                          />
                        ))}
                      </Tabs>
                    </TabsWrapperStyle>
                  </Card>

                  {PROFILE_TAB.map((tab) => {
                    const isMatch = tab.value === currentTab;
                    return (
                      isMatch && (
                        <Box
                          key={tab.value}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          {tab.component}
                        </Box>
                      )
                    );
                  })}
                </Box>
                {!story && (
                  <Typography variant="h6">404 Story not found</Typography>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default DetailPage;
