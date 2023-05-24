import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../user/userSlice";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import LoadingScreen from "../../components/LoadingScreen";
import ClickableLinkChips from "../../components/form/ClickableLinkChips";
import apiService2 from "../../app/apiService2";
import useAuth from "../../hooks/useAuth";

function AdminUser() {
  const { user } = useAuth();
  const { users, isLoading } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsers({ page }));
  }, [dispatch, page, users?.totalPages, user]);

  const handleDeleteUser = async (userId) => {
    await apiService2.delete(`/users/${userId}`).then(() => {
      dispatch(getAllUsers({ page }));
    });
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const formatDaysAgo = (date) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(
      Math.abs((new Date() - new Date(date)) / oneDay)
    );
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <Box sx={{ position: "relative" }}>
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
          {users?.users?.length > 0 && (
            <>
              <Typography
                sx={{ fontSize: 20, fontWeight: 600, paddingTop: { xs: 3 } }}
              >
                LIST OF USERS
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Uploaded Stories</TableCell>
                      <TableCell>Registered on</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users?.users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.storyCount}</TableCell>
                        <TableCell>
                          {formatDate(user.createdAt)} (
                          {formatDaysAgo(user.createdAt)})
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleDeleteUser(user._id)}>
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
                  totalPages={users?.totalPages}
                />
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}

export default AdminUser;
