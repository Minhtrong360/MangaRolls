import React from "react";
import { FormProvider, FSelect, FTextField } from "../../components/form";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { Container } from "@mui/system";

import { Box, Button, Grid, Stack, Typography } from "@mui/material";

import apiService2 from "../../app/apiService2";
import { toast } from "react-toastify";

const subscriptionSchema = Yup.object().shape({
  bankingAccount: Yup.number()
    .required("Seri is required")
    .min(1, "Seri is required"),
  duration: Yup.string().required("Duration is required"),
});

const defaultValues = {
  bankingAccount: "",
  duration: "30",
};

function Subscription() {
  const auth = useAuth();
  let navigate = useNavigate();
  let location = useLocation(); // toask: tai sao location.state: null?

  const methods = useForm({
    resolver: yupResolver(subscriptionSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const handleClickConfirm = async (data) => {
    const from = location.state?.from?.pathname || "/";

    let userId = auth.user._id;
    const { duration } = data;

    try {
      await apiService2
        .post(`/subscriptions/${userId}`, {
          duration,
          time: Date.now(),
        })
        .then(async (data) => {
          const subscriptionResults = await apiService2.get(
            `/subscriptions/${auth.user._id}`
          );
          let subscription = subscriptionResults.data.data;
          await auth.updateSub(subscription);
        });

      toast.success("Subcription is success");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error);
    }
  };

  const handleClickCancel = async () => {
    navigate("/");
  };

  return (
    <Container maxWidth="xs">
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(handleClickConfirm)}
      >
        <Stack spacing={3} mt={15}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h5">ĐĂNG KÝ</Typography>
          </Box>

          <FTextField
            name="bankingAccount"
            label="Tài khoản"
            // value={bankingAccount}
            // onChange={handleSeriChange}
          />

          <FSelect
            name="duration"
            label="Thời hạn đăng ký"
            // value={duration}
            // onChange={handleDurationChange}
          >
            <option value="30">30 days - 1$</option>
            <option value="90">90 days - 2$</option>
            <option value="365">365 days - 5$</option>
          </FSelect>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        ></Stack>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              // onClick={(e) => handleClickConfirm(e)}
            >
              Xác nhận
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={() => handleClickCancel()}
            >
              Hủy
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}

export default Subscription;
