import { useState } from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logout } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleCloseMenu();
    await logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        bgcolor: "#fff",
        px: 4,
        boxSizing: "border-box",
      }}
    >
      <Tooltip title="Opções">
        <IconButton onClick={handleOpenMenu} size="small">
          <Avatar
            sx={{
              width: 40,
              height: 40,
              border: "2px solid #ECECEC",
              bgcolor: "#f5f5f5",
              color: "#666",
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 28 }} />
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        PaperProps={{
          elevation: 2,
          sx: {
            mt: 1.5,
            minWidth: 160,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem sx={{ fontSize: "0.9rem", color: "#A3A3A3" }}>
          <Person2RoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Perfil
        </MenuItem>
        <MenuItem sx={{ fontSize: "0.9rem", color: "#A3A3A3" }}>
          <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
          Configurações
        </MenuItem>
        <MenuItem
          sx={{ fontSize: "0.9rem", color: "#A3A3A3" }}
          onClick={handleLogout}
        >
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Sair
        </MenuItem>
      </Menu>
    </Box>
  );
};