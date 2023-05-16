import React, { useCallback } from "react";
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, FTextField, FUploadAvatar } from "../../components/form";
import { fData } from "../../utils/numberFormat";
import { useDispatch, useSelector } from "react-redux";
import { updateStory } from "./storySlice";

const UpdateStorySchema = yup.object().shape({
  title: yup.string().required("Title is required"),
});

function StoryGenenal({ setIsEditing }) {
  const { isLoading, storiesById, currentPageStories } = useSelector(
    (state) => state.story
  );
  const stories = currentPageStories.map((story) => storiesById[story]);
  const defaultValues = {
    title: stories?.title || "",
    author: stories?.author || "",
    artist: stories?.artist || "",
    genres: stories?.genres || "",
    minimumAge: stories?.minimumAge || "",
    summarize: stories?.summarize || "",
    cover: stories?.cover || "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdateStorySchema),
    defaultValues,
  });
  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const dispatch = useDispatch();

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "cover",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const onSubmit = (data) => {
    dispatch(updateStory({ storyId: stories._id, ...data }));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        spacing={3}
        width="100vh"
        sx={{
          display: "flex",
          justifyContent: "center",
          left: "50%",
          height: "100vh",
        }}
      >
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
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
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
              <FTextField name="authorName" label="Author Name" />

              <FTextField name="artist" label="Artist" />
              <FTextField name="genres" label="Genres" />

              <FTextField name="minimumAge" label="Minimum Age" />
              <FTextField
                name="summarize"
                multiline
                rows={4}
                label="Summarize"
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || isLoading}
              >
                Save
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default StoryGenenal;
