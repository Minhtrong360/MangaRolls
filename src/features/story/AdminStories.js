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
import StoryCard from "./StoryCard";
import useAuth from "../../hooks/useAuth";
import { getStories } from "./storySlice";
import LoadingScreen from "../../components/LoadingScreen";
import { deleteStory } from "./storySlice";
import { Link } from "react-router-dom";
import { SelectAutoWidth } from "../../components/form";
import AdminManageGenres from "../status/AdminManageGenres";

function AdminStories() {
  const [page, setPage] = useState(1);
  const { AllStories, isLoading } = useSelector((state) => state.story);
  const [storiesOfUserFake, setStoriesOfUserFake] = useState(AllStories);
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(getStories({ page, limit: 10000 }));
  }, [dispatch, page]);
  useEffect(() => {
    setStoriesOfUserFake(AllStories);
  }, [AllStories]);

  const handleDeleteUser = async (storyId) => {
    dispatch(deleteStory({ storyId, userId: user?._id }));
    dispatch(getStories({ page, limit: 10000 }));
  };
  useEffect(() => {
    window.scrollTo(0, 0); // scroll to top
  }, [page]);

  const offset = 8 * (page - 1);
  let storiesWithPagination = storiesOfUserFake.slice(offset, offset + 8);

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
          }}
        >
          {storiesOfUserFake.length > 0 ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                  LIST OF STORIES
                </Typography>
                <AdminManageGenres />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: "1.2em" }}>Cover</TableCell>
                      <TableCell style={{ fontSize: "1.2em" }}>Title</TableCell>
                      <TableCell style={{ fontSize: "1.2em" }}>View</TableCell>
                      <TableCell style={{ fontSize: "1.2em" }}>
                        Date Created
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {storiesWithPagination.map((story) => (
                      <TableRow key={story?._id}>
                        <TableCell>
                          <Link to={`/story/${story?._id}`}>
                            <img
                              src={story?.cover}
                              alt="cover"
                              width="120vw"
                              height="120vh"
                            />
                          </Link>
                        </TableCell>
                        <TableCell>{story?.title}</TableCell>
                        <TableCell>{story?.view}</TableCell>
                        <TableCell>
                          {new Date(story?.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleDeleteUser(story._id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <ClickableLinkChips
                  page={page}
                  setPage={setPage}
                  stories={storiesOfUserFake}
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
