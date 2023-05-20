import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { Container } from "@mui/system";
import { STORIES_PER_PAGE } from "../../app/config";

export default function ClickableLinkChips({
  page,
  setPage,
  stories,
  totalPages,
}) {
  const [btns, setBtns] = useState([]);
  useEffect(() => {
    if (totalPages) {
      const newBtns = [];
      for (let i = 1; i <= totalPages; i++) {
        newBtns.push(
          <Button
            onClick={() => {
              setPage(i);
            }}
            id={i}
            key={i}
            variant="contained"
            color="error"
            sx={
              page === i
                ? { bgcolor: "white", color: "black", mr: "13px" }
                : { bgcolor: "red", color: "white", mr: "13px" }
            }
            size="small"
          >
            {i}
          </Button>
        );
      }
      setBtns(newBtns);
    } else {
      const btnCount = Math.ceil(stories.length / STORIES_PER_PAGE);
      const newBtns = [];
      for (let i = 1; i <= btnCount; i++) {
        newBtns.push(
          <Button
            onClick={() => {
              setPage(i);
            }}
            id={i}
            key={i}
            variant="contained"
            color="error"
            sx={
              page === i
                ? { bgcolor: "white", color: "black", mr: "13px" }
                : { bgcolor: "red", color: "white", mr: "13px" }
            }
            size="small"
          >
            {i}
          </Button>
        );
      }
      setBtns(newBtns);
    }
  }, [stories, page, setPage, totalPages]);

  return (
    <Container
      sx={{
        spacing: 2,
        padding: 5,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box>{btns}</Box>
    </Container>
  );
}
