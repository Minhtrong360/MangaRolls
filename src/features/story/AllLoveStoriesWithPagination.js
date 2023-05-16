import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";

import StoriesList from "./StoriesList";
import { useDispatch, useSelector } from "react-redux";
import { getStoriesWithSort } from "./storySlice";
import LoadingScreen from "../../components/LoadingScreen";
import ClickableLinkChips from "../../components/form/ClickableLinkChips";

function AllLoveStoriesWithPagination() {
  const { AllStoriesWithSort, isLoading, error } = useSelector(
    (state) => state.story
  );

  const [page, setPage] = useState(1);
  const noSlide = true;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStoriesWithSort({ page: 1, limit: 10000000000, sort: "like" }));
  }, [dispatch]);

  const offset = 8 * (page - 1);
  let storiesWithPagination = AllStoriesWithSort.slice(offset, offset + 8);

  return (
    <Container sx={{ display: "flex", mt: 3 }}>
      <Stack sx={{ flexGrow: 1 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "1.5em" }}>
          <Link underline="hover" color="inherit" href="/">
            MangaRolls
          </Link>
          <Link underline="hover" color="inherit" href="/stories/love-stories">
            Favorites
          </Link>
        </Breadcrumbs>

        <Box sx={{ position: "relative", height: 1 }}>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              {error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <>
                  <StoriesList
                    stories={storiesWithPagination}
                    noSlide={noSlide}
                  />
                  <ClickableLinkChips
                    page={page}
                    setPage={setPage}
                    stories={AllStoriesWithSort}
                  />
                </>
              )}
            </>
          )}
        </Box>
      </Stack>
    </Container>
  );
}

export default AllLoveStoriesWithPagination;
