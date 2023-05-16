import * as React from "react";
import Card from "@mui/material/Card";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

import { Box } from "@mui/system";
import { deepOrange } from "@mui/material/colors";

function ProductCard({ story }) {
  return (
    <Card component={Link} to={`/story/${story?._id}`}>
      <Box sx={{ position: "relative" }} minHeight={120}>
        <CardActionArea
        // minHeight={120}
        // sx={{ bgcolor: "gray" }}
        // image={typeof story?.cover === "string" ? story.cover : ""}
        >
          <CardMedia
            component="img"
            // height="400"
            image={story?.cover || ""}
            alt={story?.title}
            sx={{ objectFit: "fill" }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "0",
              left: "0",
              textAlign: "center",
              backgroundColor: "rgb(4, 0, 0,0.7)",
              color: deepOrange[500],
              padding: "0.5rem",
              borderRadius: "0 0 15px 15px",
            }}
          >
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {story?.view} <VisibilityIcon sx={{ paddingLeft: "5px" }} />
            </Typography>
          </Box>
          <CardContent
            sx={{
              backgroundColor: "rgb(225, 225, 225,0.1)",
            }}
          >
            <Typography
              variant="body1"
              textAlign={"left"}
              fontWeight={800}
              sx={{
                textDecoration: "none",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {story?.title?.toUpperCase()}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Box>
    </Card>
  );
}

export default ProductCard;
