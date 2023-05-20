import React, { useCallback, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, FTextField, FUploadAvatar } from "../../components/form";
import { fData } from "../../utils/numberFormat";
import { useDispatch, useSelector } from "react-redux";
import { updateStory } from "./storySlice";
import apiService2 from "../../app/apiService2";
import { useState } from "react";

const UpdateStorySchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  authorName: yup.string().required("Author's name is required"),
  genres: yup.string().required("Genres is required"),
  cover: yup.mixed().required("Avatar is required"),
  summarize: yup.string().required("Summarize is required"),
});

function StoryEdit({ story }) {
  const { isLoading } = useSelector((state) => state.story);
  const [allowGenres, setAllowGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const defaultValues = {
    title: story?.title || "",
    authorName: story?.authorName || "",
    artist: story?.artist || "",
    genres: story?.genres || "",
    minimumAge: story?.minimumAge || "",
    summarize: story?.summarize || "",
    cover: story?.cover || "",
  };

  useEffect(() => {
    setSelectedGenres(story?.genres);
  }, []);

  const methods = useForm({
    resolver: yupResolver(UpdateStorySchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,

    formState: { isSubmitting },
  } = methods;
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
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    data.storyId = story._id;

    dispatch(updateStory(data));
  };

  const handleGenresChange = (event, newValue) => {
    setSelectedGenres(newValue);
    setValue("genres", newValue);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} width="100vh">
        <Grid item xs={12} md={4}>
          <Card
            sx={{ py: 10, px: 3, textAlign: "center", justifyItems: "center" }}
          >
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
                    justifyItems: "center",
                  }}
                >
                  Allow *.jpeg, *.jpg, *.png, *.gif
                  <br /> Max size {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
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
                            multiple
                          />
                        }
                        label={option}
                        multiple
                      />
                    </FormGroup>
                  </li>
                )}
                renderInput={(params) => (
                  <FTextField {...params} name="genres" label="Genres" />
                )}
              />
              <FTextField name="minimumAge" label="Minimum age" />
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
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || isLoading}
              >
                Save
              </LoadingButton>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default StoryEdit;
