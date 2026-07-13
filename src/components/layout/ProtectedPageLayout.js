import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../../userpanelpages/Sidebar";

const DRAWER_WIDTH = 280;

const drawerPaperSx = {
  width: DRAWER_WIDTH,
  boxSizing: "border-box",
  borderRight: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
};

const ProtectedPageLayout = ({ fullName, userId, title, children }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleDrawerOpen = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const drawer = (
    <Sidebar fullName={fullName} userId={userId} onNavigate={handleDrawerClose} />
  );

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.subtle",
        minHeight: { xs: "auto", md: "calc(100vh - 80px)" },
        py: { xs: 2, md: 4 },
      }}
    >
      <Box component="nav" aria-label="Account sidebar" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
          aria-labelledby="account-nav-title"
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": drawerPaperSx,
          }}
        >
          <Typography
            id="account-nav-title"
            component="span"
            sx={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            }}
          >
            Account navigation
          </Typography>
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": drawerPaperSx,
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          px: { xs: 2, md: 3 },
          pb: 4,
        }}
      >
        {!isDesktop ? (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
            <IconButton
              color="primary"
              aria-label="Open account navigation"
              aria-expanded={mobileOpen}
              aria-controls="user-panel-navigation"
              onClick={handleDrawerOpen}
              sx={{ border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {fullName || "My Account"}
            </Typography>
          </Stack>
        ) : null}

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {title ? (
            <Typography variant="h5" component="h1" fontWeight={700} sx={{ mb: 3 }}>
              {title}
            </Typography>
          ) : null}
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default ProtectedPageLayout;
