import * as React from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getStories } from "../../features/story/storySlice";
import { useState } from "react";
import apiService2 from "../../app/apiService2";
import useAuth from "../../hooks/useAuth";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
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

export default function MultipleSelectPlaceholder() {
  // const [personName, setPersonName] = React.useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [allowGenres, setAllowGenres] = useState([]);
  const [newError, setNewError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  return (
    <FormControl size="small">
      <Select
        multiple
        displayEmpty
        value={[]}
        sx={
          {
            // fontWeight: 400,
            // color: "white",
            // fontSize: "1.2rem",
          }
        }
        input={<OutlinedInput />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <Typography children="Categories" color={grey[500]} />;
          }

          return selected.join(", ");
        }}
        label="Categories"
        MenuProps={MenuProps}
        inputProps={{ "aria-label": "Without label" }}
      >
        {allowGenres?.map((genre) => (
          <MenuItem
            key={genre}
            value={genre}
            onClick={() => {
              navigate(`stories/:${genre}`);
            }}
          >
            {genre?.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
