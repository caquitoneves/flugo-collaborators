import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#F9FAFB",
      paper: "#fff",
    },
    primary: {
      main: "#22C55E",
      contrastText: "#fff",
    },
    success: {
      main: "#22C55E",
      light: "#DEF7EC",
    },
    error: {
      main: "#EF4444",
      light: "#FEE2E2",
    },
    text: {
      primary: "#222",
      secondary: "#525252",
    },
    grey: {
      100: "#F3F4F6",
      200: "#ECECEC",
      300: "#A3A3A3",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;