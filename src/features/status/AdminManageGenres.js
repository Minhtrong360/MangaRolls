import * as React from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStories } from "../story/storySlice";
import { useState } from "react";
import apiService2 from "../../app/apiService2";
import useAuth from "../../hooks/useAuth";
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemSecondaryAction,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { Delete } from "@mui/icons-material";
import Notification from "../../components/Notification";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function AdminManageGenres() {
  // const [personName, setPersonName] = React.useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [allowGenres, setAllowGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");
  const [newError, setNewError] = useState("");
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const [deletingGenre, setDeletingGenre] = useState(null);

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
        } finally {
          setIsLoading(false);
        }
      }
    };
    getGenres();
  }, [user]);

  const handleAddGenre = async () => {
    setIsAdding(true);
    try {
      await apiService2.post("/genres", { genresName: newGenre });
      setAllowGenres((prevGenres) => [...prevGenres, newGenre]);
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

  const handleDeleteGenre = async (genreName) => {
    setDeletingGenre(genreName);
  };

  const handleConfirmDelete = async () => {
    await apiService2
      .delete(`/genres`, { data: { genresName: deletingGenre } })
      .then(() => {
        const updatedGenres = allowGenres.filter(
          (genre) => genre !== deletingGenre
        );
        setAllowGenres(updatedGenres);
        setNewError("");
        setDeletingGenre(null);
      })
      .catch((error) => {
        console.log(error);
        setNewError(error.message);
        setDeletingGenre(null);
      });
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 200 }}>
        <Box>
          <Select
            multiple
            displayEmpty
            value={[]}
            sx={{
              fontWeight: 400,
              color: "white",
              fontSize: "1.2rem",
            }}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em> Categories</em>;
              }

              return selected.join(", ");
            }}
            MenuProps={MenuProps}
            inputProps={{ "aria-label": "Without label" }}
          >
            {deletingGenre && (
              <Notification
                message={`Are you sure you want to delete "${deletingGenre}"?`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeletingGenre(null)}
              />
            )}
            {allowGenres.map((genre, index) => (
              <MenuItem
                sx={{ padding: "7.5px 14px" }}
                key={genre}
                value={genre}
              >
                {genre.toUpperCase()}
                <ListItemSecondaryAction key={index}>
                  <IconButton onClick={() => handleDeleteGenre(genre)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </MenuItem>
            ))}
          </Select>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              label="New category"
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
      </FormControl>
    </div>
  );
}
