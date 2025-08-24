import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
      <Typography variant="h2" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Página não encontrada
      </Typography>
      <Typography variant="body1" mb={3}>
        O endereço acessado não existe ou foi removido.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Voltar para o início
      </Button>
    </Box>
  );
}