import React, { useState, useEffect } from "react";
import { Alert, Box, Breadcrumbs, Container, Link, Stack } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import LoadingScreen from "../components/LoadingScreen";
import ClickableLinkChips from "../components/form/ClickableLinkChips";
import { getStories } from "../features/story/storySlice";
import StoriesList from "../features/story/StoriesList";

function StoryWithArtist() {
  const { AllStories, isLoading, error } = useSelector((state) => state.story);

  const noSlide = true;
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const params = useParams();
  const artist = params.artist;

  useEffect(() => {
    if (params.artist) {
      setPage(1);
      dispatch(getStories({ page: 1, limit: 10000000000 }));
    }
  }, [dispatch, params.artist]);

  let storiesWithGenres = AllStories.filter(
    (story) => story.artist.toLowerCase() === artist.toLowerCase()
  );

  const offset = 8 * (page - 1);
  let storiesWithPagination = storiesWithGenres.slice(offset, offset + 8);

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
          <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "1.5em" }}>
            <Link underline="hover" color="inherit" href="/">
              MangaRolls
            </Link>
            <Link underline="hover" color="inherit" href={`/stories/${artist}`}>
              {artist.toUpperCase()}
            </Link>
          </Breadcrumbs>
        </Stack>

        <Box sx={{ position: "relative", height: 1 }}>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              {error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <StoriesList
                  stories={storiesWithPagination}
                  noSlide={noSlide}
                />
              )}
              <ClickableLinkChips
                page={page}
                setPage={setPage}
                stories={storiesWithGenres}
              />
            </>
          )}
        </Box>
      </Stack>
    </Container>
  );
}

export default StoryWithArtist;
