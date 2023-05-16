import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import { Box, Button, Modal } from "@mui/material";
import { useState } from "react";

function SubRequire({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  let from = location.state?.from?.pathname || "/";
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleClickOk = () => {
    console.log("handleClickOk");
    navigate("/subscription", { state: { from: location }, replace: true });
  };
  const handleClickHong = () => {
    console.log("handleClickHong");
    navigate(from, { replace: true });
  };

  if (!user?.subscription?.isSubscription) {
    return (
      <div>
        <Modal
          open={open}
          // onClose={handleClose}
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
            <p id="parent-modal-description">
              {`BẠN ƠI, MÌNH CẦN PHẢI ĐĂNG KÝ ĐỂ TẠO TRUYỆN ẤY.
              BẠN ĐĂNG KÝ GIÚP MÌNH NHA!?!`}
            </p>
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
  return children;
}

export default SubRequire;
