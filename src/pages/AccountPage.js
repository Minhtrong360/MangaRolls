import React, { useState } from "react";
import { Container, Tab, Box, Tabs, Typography } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountGeneral from "../features/user/AccountGeneral";
import StoriesListOfUser from "../features/story/StoriesListOfUser";

function AccountPage() {
  const [currentTab, setCurrentTab] = useState("general");

  const ACCOUNT_TABS = [
    {
      value: "general",
      icon: <AccountBoxIcon sx={{ fontSize: 30, marginTop: 4 }} />,
      component: <AccountGeneral />,
    },
    // {
    //   value: "liên kết",
    //   icon: <ShareIcon sx={{ fontSize: 30, marginTop: 4 }} />,
    //   component: <AccountSocialLinks profile={{}} />,
    // },
    {
      value: "your stories",
      icon: <MenuBookIcon sx={{ fontSize: 30, marginTop: 4 }} />,
      component: <StoriesListOfUser />,
    },
  ];

  return (
    <Container>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ my: 3, fontSize: 30, fontWeight: 800 }}
      >
        ACCOUNT
      </Typography>
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
      >
        {ACCOUNT_TABS.map((tab) => (
          <Tab
            disableRipple
            key={tab.value}
            label={tab.value.toUpperCase()}
            icon={tab.icon}
            value={tab.value}
          />
        ))}
      </Tabs>

      <Box sx={{ mb: 5 }} />

      {ACCOUNT_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Container>
  );
}

export default AccountPage;
