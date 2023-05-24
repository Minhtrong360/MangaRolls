import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { deepOrange } from "@mui/material/colors";

import { SelectAutoWidth } from "../components/form";

import { useNavigate } from "react-router-dom";
import { Avatar, Divider, FormControlLabel, Menu, Stack } from "@mui/material";

import MenuItem from "@mui/material/MenuItem";

import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import SearchInput from "../components/SearchInput";
import { useTheme } from "@emotion/react";
import ToggleTheme from "../components/ToggleTheme";

function MainHeader() {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const navigate = useNavigate();

  let auth = useAuth();

  let location = useLocation();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose(); //menu close before signout so that login won't pop up.
    auth.logout();
    navigate("/");
  };

  const isMenuOpen = Boolean(anchorEl);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        theme.palette.setMode((prevMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    [theme.palette]
  );

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Stack flexDirection="column" minWidth={100}>
        {auth.user ? (
          <Box>
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                {auth.user?.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {auth.user?.email}
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: "dashed" }} />

            <MenuItem
              onClick={handleMenuClose}
              to="/account"
              component={Link}
              sx={{ mx: 1 }}
            >
              Account
            </MenuItem>
            {/* <MenuItem
              onClick={handleMenuClose}
              to="/subscription"
              component={Link}
              sx={{ mx: 1 }}
            >
              Register
            </MenuItem> */}

            <MenuItem
              onClick={handleMenuClose}
              to="/favorite"
              component={Link}
              sx={{ mx: 1 }}
            >
              Saved
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              to="/story/create"
              component={Link}
              sx={{ mx: 1 }}
            >
              Post your manga
            </MenuItem>

            {auth.user?.admin && (
              <MenuItem
                onClick={handleMenuClose}
                to="/admin"
                component={Link}
                sx={{ mx: 1 }}
              >
                Admin Dashboard
              </MenuItem>
            )}

            <Divider sx={{ borderStyle: "dashed" }} />

            <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
              Log out
            </MenuItem>
            <Divider sx={{ borderStyle: "dashed" }} />
          </Box>
        ) : (
          <MenuItem
            onClick={handleMenuClose}
            component={Link}
            to="/login"
            state={{ backgroundLocation: location, from: location }}
          >
            Login
          </MenuItem>
        )}
        <MenuItem>
          <FormControlLabel
            control={<ToggleTheme defaultChecked />}
            onClick={colorMode.toggleColorMode}
            color="inherit"
          />
        </MenuItem>
      </Stack>
    </Menu>
  );

  const menuItems = [
    {
      label: "POPULAR",
      link: "/stories/hot-stories",
    },
    {
      label: "FAVOURITES",
      link: "/stories/love-stories",
    },
  ];
  return (
    // <Box sx={{ minWidth: 400 }}>
    <>
      <AppBar position="static">
        <Toolbar variant="regular">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            component={Link}
            to="/"
            disableFocusRipple
            disableRipple
            children={
              <Typography
                variant="h5"
                children={"💥MangaRolls"}
                color={deepOrange[800]}
                fontWeight={600}
              />
            }
            sx={{ textDecoration: "none" }}
          />

          <Stack
            flexDirection="row"
            alignItems="flex-end"
            display={{ xs: "none", md: "flex" }}
            ml={5}
          >
            {menuItems.map((item) => (
              <Typography
                component={Link}
                key={item.label}
                variant="body2"
                color="inherit"
                sx={{
                  mr: 3,
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": { color: "orange" },
                  fontWeight: "bold",
                }}
                to={item.link}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>
          <Box sx={{ flexGrow: 1 }} />

          <Stack flexDirection="row">
            {/* <FormControlLabel
              control={<ToggleTheme defaultChecked />}
              onClick={colorMode.toggleColorMode}
              color="inherit"
            /> */}
            <Box>
              <SelectAutoWidth />
            </Box>
            <Box px={2}>
              <SearchInput />
            </Box>
          </Stack>
          <Stack flexDirection="row">
            <Avatar
              onClick={handleProfileMenuOpen}
              src={`${auth?.user?.cover}`}
              alt={auth?.user?.username}

              // sx={{ width: 52, height: 52 }}
            />
          </Stack>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </>
    // </Box>
  );
}

export default MainHeader;
