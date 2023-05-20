import * as React from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
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

  const [allowGenres, setAllowGenres] = useState([]);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getGenres = async () => {
      try {
        const res = await apiService2.get("/genres");

        setAllowGenres(res.data.data.genresList);
      } catch (error) {
        console.log(error);
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
