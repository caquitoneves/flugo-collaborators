import { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logout, onUserStateChange } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

function stringToColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 60%, 70%)`;
  return color;
}

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onUserStateChange((user) => {
      if (user) {
        const fullName =
          user.displayName || user.email?.split("@")[0] || "Usuário";
        const firstName = fullName.split(" ")[0];
        setUserName(firstName);
      } else {
        setUserName(null);
      }
    });
    return () => unsubscribe();
  }, []);

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

  // Pega a inicial do primeiro nome para o avatar
  const getInitial = (name: string | null) =>
    name ? name[0].toUpperCase() : "?";

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
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {userName && (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              color: "#333",
              whiteSpace: "nowrap",
            }}
          >
            Olá, {userName}!
          </Typography>
        )}

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
              <AccountCircleIcon sx={{ fontSize: 38 }} />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 2,
          sx: { mt: 1.5, minWidth: 160 },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem sx={{ fontSize: "0.9rem", color: "#555" }}>
          <Person2RoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Perfil
        </MenuItem>
        <MenuItem sx={{ fontSize: "0.9rem", color: "#555" }}>
          <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
          Configurações
        </MenuItem>
        <MenuItem
          sx={{ fontSize: "0.9rem", color: "#555" }}
          onClick={handleLogout}
        >
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Sair
        </MenuItem>
      </Menu>
    </Box>
  );
};
