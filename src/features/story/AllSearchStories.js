import React, { useState, useEffect } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";

import StoriesList from "./StoriesList";
import { useDispatch, useSelector } from "react-redux";

import { useLocation } from "react-router-dom";
import { getStories } from "./storySlice";
import LoadingScreen from "../../components/LoadingScreen";
import ClickableLinkChips from "../../components/form/ClickableLinkChips";
import unorm from "unorm";

function AllSearchStories() {
  const { AllStories, isLoading } = useSelector((state) => state.story);

  const noSlide = true;
  const [page, setPage] = useState(1);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let query = queryParams.get("query");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStories({ page: 1, limit: 10000 }));
  }, [dispatch]);

  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const normalizedQuery = removeDiacritics(query.toLowerCase());

  const result = AllStories.filter((story) => {
    const normalizedTitle = removeDiacritics(story.title.toLowerCase());

    console.log("normalizedTitle", normalizedTitle);
    return normalizedTitle.includes(normalizedQuery);
  });

  const sortedStories =
    AllStories.length > 0
      ? [...AllStories].sort((a, b) => b?.view - a?.view)
      : [];

  const offset = 8 * (page - 1);
  let storiesWithPagination = result.slice(offset, offset + 8);

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
            <span>Results: {query}</span>
          </Typography>
        </Stack>

        <Box sx={{ position: "relative", height: 1 }}>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              {result.length === 0 && (
                <h2 style={{ textAlign: "center" }}>NOT FOUND</h2>
              )}
              {result.length > 0 && (
                <>
                  <StoriesList
                    stories={storiesWithPagination}
                    noSlide={noSlide}
                  />
                  <ClickableLinkChips
                    page={page}
                    setPage={setPage}
                    stories={result}
                  />
                </>
              )}
            </>
          )}
        </Box>
        <Box sx={{ position: "relative", height: 1 }}>
          <Stack>
            {isLoading ? (
              <LoadingScreen />
            ) : (
              <>
                <Typography sx={{ fontSize: 30, fontWeight: 800 }} gutterBottom>
                  SUGGESTIONS
                </Typography>
                <StoriesList stories={sortedStories.slice(0, 20)} />
              </>
            )}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

export default AllSearchStories;
