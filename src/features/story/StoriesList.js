import { Grid } from "@mui/material";
import StoryCard from "./ProductCard";

function StoriesList({ stories }) {
  console.log("stories", stories);
  return (
    <Grid container spacing={2} mt={1} sx={{ overflow: "hidden" }}>
      {stories
        ?.sort((a, b) => b.view - a.view)
        .slice(0, 8)
        .map((story, index) => {
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
