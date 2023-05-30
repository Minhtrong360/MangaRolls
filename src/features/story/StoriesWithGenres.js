import React from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import StoriesList from "../story/StoriesList";

import { Link } from "react-router-dom";

function StoriesWithGenres({ AllStories, genres, isLoading }) {
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
          <Grid container spacing={2}>
            {[...Array(8)].map((_, index) => (
              <Grid
                key={index}
                item
                xs={4}
                md={3}
                lg={2}
                sx={{
                  transition: "all 0.6s ease-out",
                  transform: "translateX(0%)",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="10.5em"
                  height="11.5em"
                  style={{ marginTop: 15 }}
                />
                <Skeleton
                  variant="rectangular"
                  width="10.5em"
                  height="3em"
                  style={{ marginTop: 5 }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <StoriesList stories={storiesWithGenres} />
        )}
      </Box>
    </Container>
  );
}

export default StoriesWithGenres;
