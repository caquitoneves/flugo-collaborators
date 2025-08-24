import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 220,
        height: "100vh",
        borderRight: "1px solid #ECECEC",
        px: 0,
        py: 3,
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Box sx={{ px: 3 }}>
        <a href="/" style={{ textDecoration: "none", display: "inline-block" }}>
          <img src="/logo-flugo.png" alt="Flugo" style={{ width: 112 }} />
        </a>
      </Box>
      <List sx={{ px: 1 }}>
        <ListItemButton
          sx={{
            borderRadius: 2,
            px: 2,
            py: 0.5,
            bgcolor: "#fff",
            gap: 0.5,
            minHeight: 42,
          }}
          disableRipple
          onClick={() => navigate("/")}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: "#d6dbdb",
                borderRadius: "2px",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Person2RoundedIcon sx={{ color: "#6b7a8a", fontSize: 18 }} />
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                sx={{
                  color: "#6B7280",
                  fontWeight: 500,
                  fontSize: 15,
                }}
              >
                Colaboradores
              </Typography>
            }
          />
          <ChevronRightIcon sx={{ color: "#A3A3A3", fontSize: 16, ml: 0.5 }} />
        </ListItemButton>
        <ListItemButton
          sx={{
            borderRadius: 2,
            px: 2,
            py: 0.5,
            bgcolor: "#fff",
            gap: 0.5,
            minHeight: 42,
            mt: 1,
          }}
          disableRipple
          onClick={() => navigate("/departamentos")}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: "#d6dbdb",
                borderRadius: "2px",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ApartmentIcon sx={{ color: "#6b7a8a", fontSize: 18 }} />
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                sx={{
                  color: "#6B7280",
                  fontWeight: 500,
                  fontSize: 15,
                }}
              >
                Departamentos
              </Typography>
            }
          />
          <ChevronRightIcon sx={{ color: "#A3A3A3", fontSize: 16, ml: 0.5 }} />
        </ListItemButton>
      </List>
    </Box>
  );
};