import { Card, Grid, Typography, Box, Chip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
  "&:hover": {
    color: "orange",
    textDecoration: "none",
  },
}));

function LovedStoryCard({ story }) {
  const navigate = useNavigate();

  const handleRead = () => {
    navigate(`../story/${story._id}`);
  };

  return (
    <Card sx={{ marginBottom: "3em" }}>
      <Grid container>
        <Grid item xs={12} md={6} lg={12}>
          <Box p={2}>
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                flexDirection: "row",
                position: "relative",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                sx={{
                  width: 250,
                  height: 350,
                }}
                src={story?.cover}
                alt="story"
              />
              <Box>
                <Link
                  to={`/story/${story._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Typography
                    color="text.primary"
                    p={1}
                    sx={{
                      overflow: "auto",
                      textAlign: "justify",
                      fontSize: "30px",
                      textDecoration: "none",
                      wordWrap: "break-word",
                      maxWidth: "700px",
                    }}
                  >
                    {story?.title?.toUpperCase()}
                  </Typography>
                </Link>
                <Typography
                  color="text.primary"
                  p={1}
                  sx={{
                    overflow: "auto",
                    textAlign: "justify",
                    textDecoration: "none",
                  }}
                >
                  Author:
                  {story?.authorName !== "Đang Cập Nhật" ? (
                    <StyledLink to={`/author/${story?.authorName}`}>
                      {story?.authorName}
                    </StyledLink>
                  ) : (
                    story?.authorName
                  )}
                </Typography>
                <Typography
                  color="text.primary"
                  p={1}
                  sx={{
                    overflow: "auto",
                    textAlign: "justify",
                  }}
                >
                  Artist:
                  {story?.artist !== "Đang Cập Nhật" ? (
                    <StyledLink to={`/artist/${story?.artist}`}>
                      {story?.artist}
                    </StyledLink>
                  ) : (
                    story?.artist
                  )}
                </Typography>
                <Typography
                  variant="h7"
                  paragraph
                  p={1}
                  sx={{
                    overflow: "auto",
                    textAlign: "justify",
                  }}
                >
                  Categories:
                  {story?.genres?.map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      component={Link}
                      to={`/stories/:${genre}`}
                      sx={{
                        margin: "0.5rem",
                        cursor: "pointer",
                        "&:hover": {
                          color: "orange", // add color property to change text color on hover
                        },
                      }}
                    />
                  ))}
                </Typography>

                <Typography
                  color="text.primary"
                  p={1}
                  sx={{
                    overflow: "auto",
                    textAlign: "justify",
                  }}
                >
                  Minimum Age: {story?.minimumAge}
                </Typography>
                <Typography
                  color="text.primary"
                  p={1}
                  sx={{
                    textAlign: "justify",
                    maxHeight: "130px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Summarize: {story?.summarize}
                </Typography>
              </Box>

              <LoadingButton
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: "30px",
                  position: "absolute",
                  right: 0,
                  top: 4,
                }}
                onClick={handleRead}
              >
                READ
              </LoadingButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default LovedStoryCard;
