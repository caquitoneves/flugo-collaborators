import {
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Switch customizado igual ao mockup
const FlugoSwitch = styled(Switch)(({ theme }) => ({
  width: 40,
  height: 24,
  padding: 0,
  display: "flex",
  alignItems: "center",
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#22C55E",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#fff",
    width: 18,
    height: 18,
    boxShadow: "0 1px 3px 0 #0000001a",
  },
  "& .MuiSwitch-track": {
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 200,
    }),
  },
}));

function VerticalStepper() {
  return (
    <Box sx={{
      width: 170,
      mr: 8,
      pt: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start"
    }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: "24px" }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            bgcolor: "#22C55E",
            color: "#fff",
            fontWeight: 700,
            fontSize: "13px",
            borderRadius: "50%",
            border: "2px solid #DEF7EC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: "10px",
          }}
        >
          1
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#22C55E" }}>
          Infos Básicas
        </Typography>
      </Box>
      <Box
        sx={{
          width: "1.5px",
          height: "100px",
          bgcolor: "#E5E7EB",
          ml: "11px",
          mt: "-20px",
          mb: "8px",
        }}
      />
      <Box sx={{ display: "flex", alignItems: "center", mb: "32px" }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            bgcolor: "#F3F4F6",
            color: "#A3A3A3",
            fontWeight: 700,
            fontSize: "13px",
            borderRadius: "50%",
            border: "2px solid #F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: "10px",
          }}
        >
          2
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#A3A3A3" }}>
          Infos Profissionais
        </Typography>
      </Box>
    </Box>
  );
}

export function Step1({
  next,
  back,
  loading = false,
}: {
  next: (data: { name: string; email: string; active: boolean }) => void;
  back: () => void;
  loading?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState<{ name?: string; email?: string }>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const validate = () => {
    let valid = true, err: typeof error = {};
    if (!name.trim()) {
      valid = false;
      err.name = "Nome é obrigatório.";
    }
    if (!email.trim()) {
      valid = false;
      err.email = "E-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      valid = false;
      err.email = "E-mail inválido.";
    }
    setError(err);
    return valid;
  };

  const onNext = () => {
    if (validate()) {
      next({ name, email, active });
    } else {
      setSnackbarMsg("Preencha todos os campos corretamente.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <Box sx={{ px: "64px", pt: "40px", display: "flex", alignItems: "center", mb: "8px" }}>
        <Typography sx={{ color: "#565c68ff", fontSize: "15px", fontWeight: 500 }}>Colaboradores</Typography>
        <ChevronRightIcon sx={{ color: "#A3A3A3", fontSize: 16, ml: 0.5 }} />
        <Typography sx={{ color: "#A3A3A3", fontSize: "15px", fontWeight: 500 }}>Cadastrar Colaborador</Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ px: "64px", position: "relative", mb: "48px" }}>
        <LinearProgress
          variant="determinate"
          value={0}
          sx={{
            height: "3px",
            borderRadius: "2px",
            bgcolor: "#c3f5d9ff",
            "& .MuiLinearProgress-bar": { bgcolor: "#2fe791ff" },
            mt: "20px",
          }}
        />
        <Typography
          sx={{
            color: "#A3A3A3",
            fontSize: "13px",
            position: "absolute",
            right: 30,
            top: "-8px",
            letterSpacing: "0.5px",
            fontWeight: 500
          }}
        >
          0%
        </Typography>
      </Box>

      {/* Layout principal */}
      <Box
        sx={{
          display: "flex",
          px: "64px",
          mt: 0,
          alignItems: "flex-start",
          minHeight: "480px",
        }}
      >
        <VerticalStepper />

        {/* Formulário */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            maxWidth: "900px",
          }}
        >
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#6b7989",
              mb: "32px",
            }}
          >
            Informações Básicas
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              mb: "25px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <TextField
              label="Nome"
              variant="outlined"
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
              error={!!error.name}
              helperText={error.name}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "15px",
                  borderRadius: "8px",
                  bgcolor: "#fff",
                  height: "48px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#22C55E",
                    borderWidth: "2px",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#22C55E",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  color: "#22C55E",
                  fontWeight: 600,
                  mt: "-2px",
                  letterSpacing: "0.4px",
                },
              }}
              InputProps={{
                sx: { fontSize: "15px", fontWeight: 500, height: "48px", paddingY: "0px" },
              }}
              InputLabelProps={{ sx: { fontSize: "13px" } }}
            />
            <TextField
              label="E-mail"
              variant="outlined"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              error={!!error.email}
              helperText={error.email}
              placeholder="e.g. john@gmail.com"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "15px",
                  borderRadius: "8px",
                  bgcolor: "#fff",
                  height: "48px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E5E7EB",
                    borderWidth: "2px",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#22C55E",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  color: "#6B7280",
                  fontWeight: 600,
                  mt: "-2px",
                  letterSpacing: "0.4px",
                },
              }}
              InputProps={{
                sx: { fontSize: "15px", fontWeight: 500, height: "48px", paddingY: "0px" },
              }}
              InputLabelProps={{ sx: { fontSize: "13px" } }}
            />
          </Box>
          <Box sx={{ width: "100%", display: "flex", alignItems: "center", mb: "60px", mt: "0px" }}>
            <FlugoSwitch
              checked={active}
              onChange={e => setActive(e.target.checked)}
              disabled={loading}
            />
            <Typography sx={{ color: "#39444c", fontSize: "15px", fontWeight: 500, ml: "10px" }}>
              Ativar ao criar
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Container separado para botões */}
      <Box
        sx={{
          px: "64px",
          mt: "32px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="text"
          sx={{
            color: "#A3A3A3",
            fontWeight: 600,
            fontSize: "15px",
            textTransform: "none",
            pl: 0,
          }}
          onClick={back}
          disabled={loading}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#22C55E",
            color: "#fff",
            fontWeight: 600,
            fontSize: "15px",
            px: "36px",
            py: "8px",
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { bgcolor: "#16A34A" },
          }}
          onClick={onNext}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Próximo"}
        </Button>
      </Box>
      {/* Snackbar para feedback de erro */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">{snackbarMsg}</Alert>
      </Snackbar>
    </Box>
  );
}