import React, { useCallback, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Autocomplete,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, FTextField, FUploadAvatar } from "../../components/form";
import { fData } from "../../utils/numberFormat";
import { useDispatch, useSelector } from "react-redux";
import { createStory } from "./storySlice";

import { useState } from "react";
import apiService2 from "../../app/apiService2";

const UpdateStorySchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  authorName: yup.string().required("Author's name is required"),
  genres: yup.array().required("Genres is required"),
  cover: yup.mixed().required("Avatar is required"),
  summarize: yup.string().required("Summarize is required"),
});

function StoryCreate({ isCreating, setIsCreating }) {
  const { isLoading, error } = useSelector((state) => state.story);

  const [status, setStatus] = useState("start");
  const [allowGenres, setAllowGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const defaultValues = {
    title: "",
    authorName: "",
    artist: "",
    genres: "",
    minimumAge: "",
    summarize: "",
    cover: "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdateStorySchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const dispatch = useDispatch();

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const contentFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue("cover", contentFiles[0]);
    },
    [setValue]
  );

  useEffect(() => {
    if (status === "start") {
      setIsCreating(true);
    }
    if (error && status === "started") {
      setIsCreating(true);
    }
    if (!error && status === "started") {
      setIsCreating(false);
    }
  }, [status, error]);

  const onSubmit = (data) => {
    dispatch(createStory(data));
    setStatus("started");
  };
  const handleCreateOther = (e) => {
    e.preventDefault();
    setStatus("start");
    setSelectedGenres([]);
    reset(defaultValues);
    setValue("genres", null);

    setIsCreating(true);
  };

  useEffect(() => {
    const getGenres = async () => {
      try {
        const res = await apiService2.get(`/genres`);

        setAllowGenres(res.data.data.genresList);
      } catch (error) {
        console.log(error);
      }
    };
    getGenres();
  }, []);

  const handleGenresChange = (event, newValue) => {
    setSelectedGenres(newValue);
    setValue("genres", newValue);
  };

  return (
    <div style={{ width: "85%", paddingLeft: 0 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
              <FUploadAvatar
                name="cover"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    Allow *.jpeg, *.jpg, *.png, *.gif
                    <br /> Max size {fData(3145728)}
                  </Typography>
                }
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  rowGap: 3,
                  columnGap: 10,
                }}
              >
                <FTextField name="title" label="Title" />
                <FTextField name="authorName" label="Author name" />
                <FTextField name="artist" label="Artist" />

                {/* Use Autocomplete for genres */}
                <Autocomplete
                  multiple
                  id="genres"
                  disableCloseOnSelect
                  options={allowGenres}
                  value={selectedGenres}
                  onChange={handleGenresChange}
                  getOptionLabel={(option) => option}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selected}
                              color="primary"
                              value={option}
                            />
                          }
                          label={option}
                        />
                      </FormGroup>
                    </li>
                  )}
                  renderInput={(params) => (
                    <FTextField {...params} name="genres" label="Genres" />
                  )}
                />

                <FTextField name="minimumAge" label="Minimum Age" />
                <FTextField
                  name="summarize"
                  multiline
                  rows={4}
                  label="Summarize"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  mt: 3,
                }}
              >
                {isCreating ? (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting || isLoading}
                  >
                    Create
                  </LoadingButton>
                ) : (
                  <>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting || isLoading}
                      disabled
                    >
                      Create
                    </LoadingButton>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting || isLoading}
                      onClick={(e) => handleCreateOther(e)}
                      sx={{ ml: 2 }}
                    >
                      Create other
                    </LoadingButton>
                  </>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </div>
  );
}

export default StoryCreate;
