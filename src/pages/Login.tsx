import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Alert, Link } from "@mui/material";
import { login } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError("E-mail ou senha inválidos.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0px 4px 24px 0px #00000014",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <img
            src="/logo-flugo.png"
            alt="Flugo"
            style={{ width: 120, marginBottom: 8 }}
          />
        </Box>
        <Typography variant="h5" mb={2} align="center" sx={{ fontWeight: 700, color: "#22C55E" }}>
          Entre na sua conta
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            sx={{ bgcolor: "#F9FAFB", borderRadius: 2 }}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            sx={{ bgcolor: "#F9FAFB", borderRadius: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              bgcolor: "#22C55E",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: "none",
              textTransform: "none",
              fontSize: 16,
              "&:hover": { bgcolor: "#16A34A" },
            }}
          >
            Entrar
          </Button>
        </form>

        <Typography variant="body2" mt={3}>
          Não tem conta?{" "}
          <Link
            component="button"
            underline="hover"
            sx={{ fontWeight: 600, color: "#22C55E" }}
            onClick={() => navigate("/register")}
          >
            Criar conta
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}