import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onUserStateChange } from "./firebase/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CollaboratorsPage from "./pages/Collaborators";
import DepartmentsPage from "./pages/Departments";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onUserStateChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Você pode colocar um loading spinner aqui se quiser
    return <div>Carregando...</div>;
  }

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
          {/* Rota raiz corrigida */}
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/colaboradores" replace /> : <Navigate to="/login" replace />
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;