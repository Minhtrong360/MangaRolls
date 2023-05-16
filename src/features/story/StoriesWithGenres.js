import React from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import LoadingScreen from "../../components/LoadingScreen";

import StoriesList from "../story/StoriesList";

import { Link } from "react-router-dom";

function StoriesWithGenres({ AllStories, genres, isLoading, error }) {
  let storiesWithGenres = AllStories.filter((story) =>
    story.genres
      .map((genre) => genre.toLowerCase())
      .includes(genres.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ marginY: 5 }}>
      <Stack
        spacing={2}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
      >
        <Stack
          component="div"
          noWrap
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Typography variant="h5" fontWeight="bold">
            {`| ${genres?.toUpperCase()}`}
          </Typography>
          <Button component={Link} to={`stories/${genres}`}>
            see more
          </Button>
        </Stack>
      </Stack>
      <Divider />

      <Box sx={{ position: "relative", height: 1 }}>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            {error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <StoriesList stories={storiesWithGenres} />
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default StoriesWithGenres;
