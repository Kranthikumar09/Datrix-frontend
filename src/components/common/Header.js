import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import config from "../../config/config";
import { BRAND } from "../../config/brand";
import { useAuth } from "../../context/AuthContext";
import fallbackLogoAsset from "../../assets/images/logo.png";

const FALLBACK_LOGO = fallbackLogoAsset;

const NAV_ITEMS = [
  { label: "Home", to: "/", end: true },
  { label: "Study", to: "/study", match: "study" },
  { label: "Work", to: "/work", match: "work" },
  { label: "Travel", to: "/travel" },
  { label: "Blogs", to: "/blog", match: "blog" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const pillButtonSx = {
  borderRadius: "50px",
  px: 3.5,
  py: 1.25,
  fontWeight: 600,
  textTransform: "none",
  borderWidth: 2,
  borderStyle: "solid",
  minHeight: 48,
  "&:hover": {
    borderWidth: 2,
  },
};

const Header = () => {
  const [siteLogo, setSiteLogo] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!config.baseURL) return undefined;

    axios
      .get(`${config.baseURL}/site-content/general-content/get`)
      .then((response) => {
        setSiteLogo(response.data?.data?.site_logo || null);
      })
      .catch((err) => console.error("API Error:", err));

    return undefined;
  }, []);

  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = () => {
    closeMobileMenu();
    logout();
    navigate("/");
  };

  const isItemActive = useMemo(() => {
    const path = location.pathname;
    return (item) => {
      if (item.end) return path === "/";
      if (item.match === "study") {
        return (
          path === "/study" ||
          path.startsWith("/study-filter") ||
          path.startsWith("/study-details") ||
          path.startsWith("/why-choose-study")
        );
      }
      if (item.match === "work") {
        return (
          path === "/work" ||
          path.startsWith("/work-filter") ||
          path.startsWith("/job-details") ||
          path.startsWith("/why-choose-work")
        );
      }
      if (item.match === "blog") {
        return path.startsWith("/blog");
      }
      return path === item.to || path.startsWith(`${item.to}/`);
    };
  }, [location.pathname]);

  const logoSrc = siteLogo
    ? config.assetUrl(`uploads/general-content/${siteLogo}`)
    : FALLBACK_LOGO;

  const authActions = (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: "stretch" }}>
      {isAuthenticated ? (
        <>
          <Button
            component={RouterLink}
            to="/my-account"
            variant="outlined"
            color="secondary"
            onClick={closeMobileMenu}
            sx={{
              ...pillButtonSx,
              borderColor: "secondary.main",
              color: "secondary.main",
              bgcolor: "background.paper",
              "&:hover": {
                borderWidth: 2,
                bgcolor: "secondary.main",
                color: "secondary.contrastText",
              },
            }}
          >
            My Account
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{
              ...pillButtonSx,
              borderColor: "primary.main",
            }}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            color="secondary"
            onClick={closeMobileMenu}
            sx={{
              ...pillButtonSx,
              borderColor: "secondary.main",
              color: "secondary.main",
              bgcolor: "background.paper",
              "&:hover": {
                borderWidth: 2,
                bgcolor: "secondary.main",
                color: "secondary.contrastText",
              },
            }}
          >
            Login
          </Button>
          <Button
            component={RouterLink}
            to="/signup"
            variant="contained"
            color="primary"
            onClick={closeMobileMenu}
            sx={{
              ...pillButtonSx,
              borderColor: "primary.main",
            }}
          >
            Sign Up
          </Button>
        </>
      )}
    </Stack>
  );

  const drawer = (
    <Box
      sx={{ width: 300, height: "100%", display: "flex", flexDirection: "column" }}
      role="presentation"
    >
      <Stack direction="row" sx={{ p: 2, alignItems: "center", justifyContent: "space-between" }}>
        <Box
          component={RouterLink}
          to="/"
          onClick={closeMobileMenu}
          sx={{ display: "inline-flex", alignItems: "center" }}
        >
          <Box
            component="img"
            src={logoSrc}
            alt={BRAND.name}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_LOGO;
            }}
            sx={{ maxHeight: 40, width: "auto" }}
          />
        </Box>
        <IconButton aria-label="Close navigation menu" onClick={closeMobileMenu}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider />
      <List sx={{ flexGrow: 1, py: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = isItemActive(item);
          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={Boolean(item.end)}
              onClick={closeMobileMenu}
              selected={active}
              sx={{
                mx: 1,
                borderRadius: 2,
                "&.Mui-selected": {
                  color: "primary.main",
                  bgcolor: "rgba(226, 64, 60, 0.08)",
                },
              }}
            >
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { sx: { fontWeight: active ? 600 : 500 } } }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>{authActions}</Box>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      component="header"
      sx={{
        bgcolor: "background.paper",
        py: 1.5,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 72, md: 100 },
            px: { xs: 2, md: 3.75 },
            borderRadius: "100px",
            boxShadow: "0px 20px 15px rgba(0, 0, 0, 0.05)",
            bgcolor: "background.paper",
            gap: 2,
          }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: "inline-flex", alignItems: "center", mr: { md: 2 } }}
          >
            <Box
              component="img"
              src={logoSrc}
              alt={BRAND.name}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_LOGO;
              }}
              sx={{ maxHeight: { xs: 40, md: 52 }, width: "auto" }}
            />
          </Box>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              display: { xs: "none", lg: "flex" },
              flexGrow: 1,
              ml: 2,
              alignItems: "center",
            }}
            component="nav"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item);
              return (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  end={Boolean(item.end)}
                  color="inherit"
                  sx={{
                    color: active ? "primary.main" : "secondary.main",
                    fontWeight: active ? 600 : 500,
                    fontSize: 18,
                    px: 1.5,
                    minWidth: "auto",
                    textTransform: "none",
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          <Box sx={{ display: { xs: "none", lg: "flex" }, ml: "auto" }}>{authActions}</Box>

          <IconButton
            color="inherit"
            aria-label="Open navigation menu"
            edge="end"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { lg: "none" }, ml: "auto", color: "secondary.main" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobileMenu}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
