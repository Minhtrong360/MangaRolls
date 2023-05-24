import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ClickableLinkChips from "../../components/form/ClickableLinkChips";
import useAuth from "../../hooks/useAuth";
import { getStories } from "./storySlice";
import LoadingScreen from "../../components/LoadingScreen";
import { deleteStory } from "./storySlice";
import { Link } from "react-router-dom";
import AdminManageGenres from "../status/AdminManageGenres";
import { useTheme } from "@mui/material/styles";

function AdminStories() {
  const [page, setPage] = useState(1);
  const { AllStories, isLoading, totalPages } = useSelector(
    (state) => state.story
  );

  const dispatch = useDispatch();
  const { user } = useAuth();
  const theme = useTheme();
  useEffect(() => {
    dispatch(getStories({ page }));
  }, [dispatch, page]);

  const handleDeleteUser = async (storyId) => {
    dispatch(deleteStory({ storyId, userId: user?._id }));
    dispatch(getStories({ page }));
  };
  useEffect(() => {
    window.scrollTo(0, 0); // scroll to top
  }, [page]);

  return (
    <Box sx={{ position: "relative", height: 1 }}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            alignItems: "center",
            width: "fit-content",
          }}
        >
          {AllStories.length > 0 ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  px: { xs: 2, sm: 4 }, // Adjust the padding on different screen sizes
                }}
              >
                <Typography sx={{ fontSize: "1.2em", fontWeight: 600 }}>
                  LIST OF STORIES
                </Typography>
                <AdminManageGenres />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: "1.1em" }}>Cover</TableCell>
                      <TableCell style={{ fontSize: "1.1em" }}>Title</TableCell>
                      <TableCell style={{ fontSize: "1.1em" }}>View</TableCell>
                      <TableCell style={{ fontSize: "1.1em" }}>
                        Date Created
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {AllStories.map((story) => (
                      <TableRow key={story?._id}>
                        <TableCell>
                          <Link to={`/story/${story?._id}`}>
                            <img
                              src={story?.cover}
                              alt="cover"
                              width="100%" // Adjust the image width to fill the cell
                              height="auto" // Allow the image height to adjust automatically
                            />
                          </Link>
                        </TableCell>
                        <TableCell style={{ fontSize: "1em" }}>
                          {story?.title}
                        </TableCell>
                        <TableCell style={{ fontSize: "1em" }}>
                          {story?.view}
                        </TableCell>
                        <TableCell style={{ fontSize: "1em" }}>
                          {new Date(story?.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleDeleteUser(story._id)}
                            sx={{ fontSize: "0.9em" }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2, // Add some margin from the top
                }}
              >
                <ClickableLinkChips
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                />
              </Box>
            </>
          ) : (
            <Typography variant="h6">No Story</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default AdminStories;
