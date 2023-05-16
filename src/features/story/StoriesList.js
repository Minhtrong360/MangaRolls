import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import StoryCard from "./ProductCard";

function StoriesList({ stories, noSlide }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (!noSlide) {
      const intervalId = setInterval(() => {
        setCurrentIndex((currentIndex + 1) % stories.length);
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [currentIndex, setCurrentIndex, stories.length, noSlide]);

  let displayItems;
  if (stories.length < 5) {
    displayItems = stories;
  }
  if (!noSlide) {
    displayItems = [
      stories[currentIndex % stories.length],
      stories[(currentIndex + 1) % stories.length],
      stories[(currentIndex + 2) % stories.length],
      stories[(currentIndex + 3) % stories.length],
      stories[(currentIndex + 4) % stories.length],
      stories[(currentIndex + 5) % stories.length],
    ];
  } else {
    displayItems = stories;
  }

  return (
    <Grid container spacing={2} mt={1} sx={{ overflow: "hidden" }}>
      {displayItems?.map((story, index) => {
        return (
          <Grid
            item
            xs={4}
            md={3}
            lg={2}
            key={story?._id}
            sx={{
              transition: "all 0.6s ease-out",
              transform: "translateX(0%)",
            }}
          >
            <StoryCard story={story} key={index} />
          </Grid>
        );
      })}
    </Grid>
  );
}

export default StoriesList;
