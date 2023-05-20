import { useState } from "react";
import { Card, Grid, Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";
import { Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { deleteChapter } from "./chapterSlice";
import ChapterCreate from "./ChapterCreate";
import Notification from "../../components/Notification";

function ChapterEdit({ chapter, loading, error, storyEditing }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [deletingChapter, setDeletingChapter] = useState(null);

  const handleDeleteChapter = async (title) => {
    setDeletingChapter(title);
  };
  const handleConfirmDelete = () => {
    dispatch(deleteChapter({ chapterId: chapter._id }));
  };

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
                            {!isEditing && (
                              <>
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
                                      Chương {chapter?.number + 1}
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
                                    <Box>
                                      <Button
                                        onClick={() =>
                                          navigate(`/chapter/${chapter._id}`)
                                        }
                                      >
                                        Read
                                      </Button>
                                      <Button
                                        onClick={(e) => {
                                          setIsEditing(true);
                                        }}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          handleDeleteChapter(chapter?.title);
                                        }}
                                      >
                                        Delete
                                      </Button>
                                    </Box>
                                  </Box>
                                </Box>
                              </>
                            )}
                            {isEditing && (
                              <ChapterCreate
                                chapter={chapter}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                              />
                            )}
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
        {deletingChapter && (
          <Notification
            message={`Are you sure you want to delete "${deletingChapter}"?`}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeletingChapter(null)}
          />
        )}
      </Box>
    </Container>
  );
}

export default ChapterEdit;
