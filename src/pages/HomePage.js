import React, { useEffect } from "react";

import StoriesWithGenres from "../features/story/StoriesWithGenres";
import { useDispatch, useSelector } from "react-redux";
import { getStories } from "../features/story/storySlice";
import { Container } from "@mui/material";

function HomePage() {
  const { AllStories, isLoading, error } = useSelector((state) => state.story);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStories({ page: 1, limit: 1000 }));
  }, [dispatch]);
  return (
    <Container maxWidth="lg">
      <StoriesWithGenres
        genres={"Adventure"}
        AllStories={AllStories}
        isLoading={isLoading}
        error={error}
      />
      <StoriesWithGenres
        genres={"Comedy"}
        AllStories={AllStories}
        isLoading={isLoading}
        error={error}
      />
      <StoriesWithGenres
        genres={"Drama"}
        AllStories={AllStories}
        isLoading={isLoading}
        error={error}
      />
      <StoriesWithGenres
        genres={"Action"}
        AllStories={AllStories}
        isLoading={isLoading}
        error={error}
      />
      <StoriesWithGenres
        genres={"Magic"}
        AllStories={AllStories}
        isLoading={isLoading}
        error={error}
      />
    </Container>
  );
}

export default HomePage;
