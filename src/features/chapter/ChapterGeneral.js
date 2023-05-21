import { Card, Grid, Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Alert } from "@mui/material";
import LoadingScreen from "../../components/LoadingScreen";

function ChapterGeneral({ chapter, loading, error }) {
  const navigate = useNavigate();

  return (
    <Container sx={{ my: 3, display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          position: "relative",
          height: 1,
          width: "50vw",
        }}
      >
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            {error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <>
                {chapter && (
                  <Card>
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        lg={12}
                        sx={{
                          borderRadius: 2,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Box p={2}>
                          <Box
                            sx={{
                              borderRadius: 2,
                              overflow: "hidden",
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <Box
                              component="img"
                              sx={{
                                width: 150,
                                height: 150,
                              }}
                              src={chapter?.avatar[0]}
                              alt="chapter"
                            />
                            <Box>
                              <Typography
                                color="text.primary"
                                p={2}
                                sx={{
                                  overflow: "auto",
                                  textAlign: "justify",
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                {chapter.title}
                              </Typography>
                              <Typography
                                color="text.primary"
                                fontSize="14px"
                                p={2}
                                sx={{
                                  overflow: "auto",
                                  textAlign: "justify",
                                }}
                              >
                                {chapter?.createdAt?.slice(0, 10)}
                              </Typography>
                              <Button
                                onClick={() =>
                                  navigate(`/chapter/${chapter._id}`)
                                }
                              >
                                Read
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                )}
                {!chapter && (
                  <Typography variant="h6">404 Chapter not found</Typography>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default ChapterGeneral;
