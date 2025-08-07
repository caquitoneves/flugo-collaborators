import { Box, Avatar } from "@mui/material";

export const Navbar = () => (
  <Box
    sx={{
      width: "100%",
      height: 72,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      bgcolor: "#fff",
      borderBottom: "none",
      px: 4,
      boxSizing: "border-box",
    }}
  >
    <Avatar
      src="/avatars/avatar-user.png"
      sx={{
        width: 40,
        height: 40,
        border: "2px solid #ECECEC",
        bgcolor: "#fff",
      }}
    />
  </Box>
);