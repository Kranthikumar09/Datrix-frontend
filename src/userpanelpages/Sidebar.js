import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export const USER_PANEL_NAV_ITEMS = [
  {
    id: "profile",
    label: "Profile",
    to: "/my-account",
    icon: ManageAccountsIcon,
    isActive: (pathname) => pathname === "/my-account",
  },
  {
    id: "study-applications",
    label: "Study Applications",
    to: "/study-applications",
    icon: SchoolIcon,
    isActive: (pathname) =>
      pathname === "/study-applications" ||
      pathname.startsWith("/study-application-details") ||
      pathname.startsWith("/edit-study-application"),
  },
  {
    id: "work-applications",
    label: "Work Applications",
    to: "/work-applications",
    icon: WorkIcon,
    isActive: (pathname) =>
      pathname === "/work-applications" ||
      pathname.startsWith("/work-application-details") ||
      pathname.startsWith("/edit-work-application"),
  },
  {
    id: "applied-jobs",
    label: "Applied Jobs",
    to: "/applied-jobs",
    icon: PlaylistAddCheckIcon,
    isActive: (pathname) => pathname === "/applied-jobs" || pathname.startsWith("/job-apply-form"),
  },
  {
    id: "documents",
    label: "Documents",
    to: "/upload-documents",
    icon: UploadFileIcon,
    isActive: (pathname) => pathname === "/upload-documents",
  },
];

const Sidebar = ({ fullName, userId, onNavigate }) => {
  const { pathname } = useLocation();

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          m: 2,
          mb: 1,
          borderRadius: 3,
          bgcolor: "background.soft",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" component="h2" fontWeight={700} noWrap title={fullName || "Account"}>
          {fullName || "Account"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {userId || "N/A"}
        </Typography>
      </Paper>

      <Divider sx={{ mx: 2 }} />

      <List component="nav" id="user-panel-navigation" aria-label="Account navigation" sx={{ px: 1, py: 1, flex: 1 }}>
        {USER_PANEL_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const selected = item.isActive(pathname);

          return (
            <ListItemButton
              key={item.id}
              component={NavLink}
              to={item.to}
              selected={selected}
              onClick={onNavigate}
              aria-current={selected ? "page" : undefined}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                  "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
