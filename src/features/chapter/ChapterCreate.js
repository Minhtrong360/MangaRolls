import React, { useCallback, useState } from "react";
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, FTextField, FUploadImage } from "../../components/form";
import { fData } from "../../utils/numberFormat";
import { useDispatch, useSelector } from "react-redux";

import { createChapter, updateChapter } from "./chapterSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateUserSchema = yup.object().shape({
  title: yup.string().required("Chapter also needs a title"),
});

function ChapterCreate({ chapter, isEditing, storyEditing, setIsEditing }) {
  const { isLoading, error } = useSelector((state) => state.chapter);
  const { story } = useSelector((state) => state.story);
  const params = useParams();
  const [avatar, setAvatar] = useState([chapter?.avatar[0]]);
  const [content, setContent] = useState(chapter?.content);
  const [cancel, setCancel] = useState(false);

  let storyId = story?._id ? story?._id : params.id;

  const defaultValues = {
    title: chapter?.title || "",
    avatar: chapter?.avatar || "",
    content: chapter?.content || "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const dispatch = useDispatch();

  const handleDropAvatar = useCallback(
    (acceptedFiles) => {
      const contentFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue("avatar", [
        ...(methods.getValues().content || []),
        ...contentFiles,
      ]);
      setAvatar(acceptedFiles);
    },
    [setValue, methods]
  );

  const handleDropContent = useCallback(
    (acceptedFiles) => {
      const contentFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      if (!isEditing) {
        setValue("content", [
          ...(methods.getValues().content || []),
          ...contentFiles,
        ]);
      }
      if (isEditing) {
        setValue("content", [...contentFiles]);
      }
      setContent(methods.getValues().content);
    },

    [setValue, methods]
  );
  const handleClickCancel = async () => {
    reset();
    setAvatar([]);
    setContent([]);
    setCancel(true);
    setIsEditing(false);
  };

  const onSubmit = (data) => {
    if (!isEditing) {
      if (!cancel) {
        dispatch(createChapter([{ storyId }, { ...data }]));
      }
      reset(defaultValues);
      setAvatar([]);
      setContent([]);
    }
    if (isEditing) {
      try {
        if (!cancel) {
          dispatch(updateChapter({ chapterId: chapter._id }, { data }));
        }
      } catch (error) {
        toast(error);
      }
      if (!error && !cancel) {
        setIsEditing(false);
        // toask: muốn sau khi update thành công thì mới setIsEditing = false và tải lại Chapters
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        spacing={3}
        width={storyEditing ? "none" : "80vh"}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={8} lg={12}>
          {!storyEditing && story?.title && (
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: 2,
                alignItems: "center",
                alignContent: "center",
                textAlign: "center",
                fontSize: { xs: "1em", md: "1.5em" },
              }}
            >
              {story?.title.toUpperCase()}
            </Typography>
          )}
          {storyEditing && (
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
                alignItems: "center",
                alignContent: "center",
                textAlign: "center",
                fontSize: { xs: "1em", md: "1.5em" },
              }}
            >
              New chapter
            </Typography>
          )}
          <Card sx={{ p: 1 }}>
            <Stack spacing={3} alignItems="center" sx={{ mt: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "50%",
                }}
              >
                <Typography
                  sx={{ mb: 2, fontSize: { xs: "1em", md: "1.5em" } }}
                >
                  {" "}
                  Chapter title{" "}
                </Typography>
                <FTextField name="title" label="Title" />
              </Box>

              <Grid item xs={12} md={4}>
                <Card sx={{ py: 1, px: 1, textAlign: "center" }}>
                  <Typography
                    sx={{
                      py: 2,
                      px: 2,
                      textAlign: "center",
                      fontSize: { xs: "1em", md: "1.5em" },
                    }}
                  >
                    Cover
                  </Typography>

                  {avatar.length > 0 && (
                    <img
                      src={avatar[0]?.preview ? avatar[0]?.preview : avatar}
                      alt=""
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  )}

                  <FUploadImage
                    name="avatar"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDropAvatar}
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
                <Card sx={{ py: 1, px: 1, textAlign: "center" }}>
                  <Typography
                    sx={{
                      py: 2,
                      px: 2,
                      textAlign: "center",
                      fontSize: { xs: "1em", md: "1.5em" },
                    }}
                  >
                    Chapter content
                  </Typography>
                  {content?.map((file) => (
                    <img
                      key={file?.preview}
                      src={file?.preview ? file?.preview : file}
                      alt=""
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        marginBottom: 10,
                      }}
                    />
                  ))}

                  <FUploadImage
                    name="content"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDropContent}
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
                      </Typography>
                    }
                    multiple
                  />
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  sx={{ minWidth: "100px" }}
                  loading={isSubmitting || isLoading}
                >
                  Upload
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  sx={{ minWidth: "100px", marginLeft: 2 }}
                  onClick={() => handleClickCancel()}
                >
                  Cancel
                </LoadingButton>
              </Grid>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ChapterCreate;
