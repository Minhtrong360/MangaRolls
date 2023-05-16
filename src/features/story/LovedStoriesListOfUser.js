import React, { useEffect, useCallback, useState, useRef } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

import useAuth from "../../hooks/useAuth";
import { getLovedStoriesOfUser } from "./storySlice";
import LovedStoryCard from "./LovedStoryCard";
import LoadingScreen from "../../components/LoadingScreen";

function LovedStoriesListOfUser() {
  const auth = useAuth();
  const userId = auth?.user?._id;

  const [page, setPage] = useState(1);

  const { lovedStoriesOfUser, isLoading, totalPages } = useSelector(
    (state) => state.story
  );
  const dispatch = useDispatch();
  const [fakeData, setFakeData] = useState([]);

  const scrollRef = useRef(null);

  const fetchMoreData = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  useEffect(() => {
    dispatch(getLovedStoriesOfUser({ userId, page }));
    if (scrollRef.current) {
      window.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [dispatch, page, userId]);

  useEffect(() => {
    setFakeData((prevData) => {
      const newStories = lovedStoriesOfUser.filter(
        (story) => !prevData.some((prevStory) => prevStory._id === story._id)
      );
      return [...prevData, ...newStories];
    });
  }, [lovedStoriesOfUser]);

  console.log("lovedStoriesOfUser", lovedStoriesOfUser);
  console.log("fakeData", fakeData);
  console.log("page", page);
  console.log("totalPages", totalPages);

  return (
    <Container sx={{ display: "flex", mt: 3 }}>
      <Stack sx={{ flexGrow: 1 }}>
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          mb={0}
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
              justifyContent: "space-between",
            }}
          >
            <span>BẠN ĐÃ THÍCH</span>
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLoading && fakeData.length === 0 ? null : (
            <InfiniteScroll
              dataLength={fakeData.length}
              next={fetchMoreData}
              hasMore={page < totalPages}
            >
              <div ref={scrollRef}>
                {fakeData?.length > 0 ? (
                  fakeData?.map((story) => (
                    <LovedStoryCard
                      key={story?._id}
                      story={story}
                      userId={userId}
                    />
                  ))
                ) : (
                  <Typography variant="h6">No Story</Typography>
                )}
              </div>
            </InfiniteScroll>
          )}
          {isLoading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "10em",
              }}
            >
              <LoadingScreen />
            </Box>
          )}
        </Box>
      </Stack>
    </Container>
  );
}

export default LovedStoriesListOfUser;
