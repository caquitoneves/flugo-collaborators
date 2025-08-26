import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Alert, Link, InputAdornment } from "@mui/material";
import { signup } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const emailPrefixRegex = /^[a-zA-Z0-9._-]+$/;
  const fullEmail = emailPrefix ? `${emailPrefix}@flugo.com.br` : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailPrefixRegex.test(emailPrefix)) {
      setError("O e-mail deve conter apenas letras, números, pontos, hífens ou underscores.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await signup(fullEmail, password, name);
      navigate("/");
    } catch (err: any) {
      setError("Erro ao criar conta. Tente novamente.");
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
          Criar conta
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Nome"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            sx={{ bgcolor: "#F9FAFB", borderRadius: 2 }}
          />

          <TextField
            label="E-mail"
            type="text"
            fullWidth
            margin="normal"
            value={emailPrefix}
            onChange={e => setEmailPrefix(e.target.value)}
            required
            sx={{ bgcolor: "#F9FAFB", borderRadius: 2 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">@flugo.com.br</InputAdornment>,
            }}
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
          <TextField
            label="Confirmar Senha"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
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
            Cadastrar
          </Button>
        </form>

        <Typography variant="body2" mt={3}>
          Já tem conta?{" "}
          <Link
            component="button"
            underline="hover"
            sx={{ fontWeight: 600, color: "#22C55E" }}
            onClick={() => navigate("/login")}
          >
            Entrar
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
