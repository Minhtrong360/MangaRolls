import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

function Notification({ message, onConfirm, onCancel }) {
  const [open, setOpen] = useState(true);

  const handleClickOk = () => {
    onConfirm();
    setOpen(false);
  };

  const handleClickHong = () => {
    onCancel();
    setOpen(false);
  };

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
          }}
        >
          <h2 id="parent-modal-title" style={{ marginBottom: "1rem" }}>
            THÔNG BÁO
          </h2>
          <p id="parent-modal-description">{message}</p>
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={handleClickOk}>Ok liền</Button>
            <Button onClick={handleClickHong}>Hong</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Notification;
