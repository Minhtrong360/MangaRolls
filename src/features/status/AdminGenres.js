import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import LoadingScreen from "../../components/LoadingScreen";

import apiService2 from "../../app/apiService2";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

function AdminGenres() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [allowGenres, setAllowGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");
  const [newError, setNewError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const getGenres = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const res = await apiService2.get("/genres");
          setAllowGenres(res.data.data.genresList);
          setNewError("");
        } catch (error) {
          console.log(error);
          setNewError(error.message);
          toast(newError);
        } finally {
          setIsLoading(false);
        }
      }
    };
    getGenres();
  }, [user]);

  const handleDeleteGenre = async (genreName) => {
    await apiService2
      .delete(`/genres`, { data: { genresName: genreName } })
      .then(() => {
        const updatedGenres = allowGenres.filter(
          (genre) => genre !== genreName
        );
        setAllowGenres(updatedGenres);
        setNewError("");
      })
      .catch((error) => {
        console.log(error);
        setNewError(error.message);
      });
  };

  const handleAddGenre = async () => {
    setIsAdding(true);
    try {
      await apiService2.post("/genres", { genresName: newGenre });
      const updatedGenres = [...allowGenres, newGenre];
      setAllowGenres(updatedGenres);
      setNewGenre("");
      setNewError("");
    } catch (error) {
      console.log(error);
      setNewError(error);
      toast.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleInputChange = (event) => {
    setNewGenre(event.target.value);
  };

  return (
    <Box sx={{ position: "relative", height: 1 }}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <Typography sx={{ display: "flex", justifyContent: "center" }}>
              ATTENTION: CLICK ON BUTTON WILL DELETE GENRE
            </Typography>
            {allowGenres.map((genre, index) => (
              <Button
                key={index}
                variant="contained"
                color="primary"
                sx={{
                  width: "60%",
                }}
                onClick={() => handleDeleteGenre(genre)}
              >
                {genre}
              </Button>
            ))}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <TextField
                label="Thể loại mới"
                variant="outlined"
                value={newGenre}
                onChange={handleInputChange}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={isAdding}
                onClick={handleAddGenre}
                sx={{ marginLeft: 2 }}
              >
                {isAdding ? "Adding..." : "Add"}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default AdminGenres;
