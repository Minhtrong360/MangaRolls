import { Box, Container, ButtonGroup, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import apiService2 from "../../app/apiService2";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import LoadingScreen from "../../components/LoadingScreen";
import AdminUser from "./AdminUser";

function ChartGeneral() {
  const [chartData, setChartData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("7days");
  const { user } = useAuth();
  useEffect(() => {
    const fetchChartData = async () => {
      if (user) {
        setIsLoading(true);
        const result = await apiService2.get(`/status/admin?limit=${300}`);

        const data = result.data.data
          .filter((item) => {
            const rangeEnd = moment();
            const rangeStart =
              timeRange === "7days"
                ? moment().subtract(7, "days")
                : moment().subtract(1, "month");

            return moment(item.date).isBetween(
              rangeStart,
              rangeEnd,
              null,
              "[]"
            );
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        const chartData = {
          labels: data.map((item) => moment(item.date).format("YYYY-MM-DD")),
          datasets: [
            {
              label: "Number of logins",
              data: data.map((item) => item.login),
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              pointRadius: 7,
              tension: 0.1,
            },
            {
              label: "Number of views",
              data: data.map((item) => item.view),
              fill: false,
              borderColor: "rgb(192, 75, 192)",
              pointRadius: 7,
              tension: 0.1,
            },
            {
              label: "Number of new users",
              data: data.map((item) => item.new_users.length),
              fill: false,
              borderColor: "rgb(192, 192, 75)",
              pointRadius: 5, // set point radius to 5
              tension: 0.1,
            },
          ],
        };
        setIsLoading(false);
        setChartData(chartData);
      }
    };

    fetchChartData();
  }, [user, timeRange]);

  useEffect(() => {
    if (chartData.datasets) {
      const chart = new Chart("myChart", {
        type: "line",
        data: chartData,
      });
    }
  }, [chartData]);

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ my: 3, fontSize: 30, fontWeight: 800 }}
      >
        ADMIN DASHBOARD
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
        }}
      >
        <Box sx={{ flex: 1, alignSelf: "flex-start" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: { xs: "90vw", md: "30vw" },
                height: "30vh",
                maxWidth: "500px",
                maxHeight: "1000px",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  paddingRight: 2,
                }}
              >
                {isLoading ? (
                  <LoadingScreen />
                ) : (
                  <>
                    <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                      GROWTH CHART
                    </Typography>
                    <ButtonGroup style={{ margin: "10px" }}>
                      <Button
                        variant={
                          timeRange === "7days" ? "contained" : "outlined"
                        }
                        onClick={() => handleTimeRangeChange("7days")}
                      >
                        Last 7 days
                      </Button>
                      <Button
                        variant={
                          timeRange === "month" ? "contained" : "outlined"
                        }
                        onClick={() => handleTimeRangeChange("month")}
                      >
                        Last month
                      </Button>
                    </ButtonGroup>
                    <canvas
                      id="myChart"
                      style={{ display: isLoading ? "none" : "block" }}
                    ></canvas>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <AdminUser />
      </Box>
    </Container>
  );
}

export default ChartGeneral;
