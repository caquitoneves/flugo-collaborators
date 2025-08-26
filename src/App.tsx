import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CollaboratorsPage from "./pages/Collaborators";
import DepartmentsPage from "./pages/Departments";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route
            path="/colaboradores"
            element={
              <ProtectedRoute>
                <CollaboratorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departamentos"
            element={
              <ProtectedRoute>
                <DepartmentsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/colaboradores" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
