import {
  Box,
  Typography,
  Button,
  LinearProgress,
  MenuItem,
  Select,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";

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
        <CheckCircleIcon sx={{
          width: 24,
          height: 24,
          color: "#22C55E",
          mr: "10px",
        }} />
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
            bgcolor: "#22C55E",
            color: "#fff",
            fontWeight: 700,
            fontSize: "13px",
            borderRadius: "50%",
            border: "2px solid #22C55E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: "10px",
          }}
        >
          2
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#22C55E" }}>
          Infos Profissionais
        </Typography>
      </Box>
    </Box>
  );
}

export function Step2({
  next,
  back,
  loading = false,
}: {
  next: (department: string) => Promise<unknown> | void;
  back: () => void;
  loading?: boolean;
}) {
  const [department, setDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successSnackbar, setSuccessSnackbar] = useState(false);

  const onFinish = async () => {
    if (!department) {
      setError("Selecione um departamento.");
      return;
    }
    setError(null);

    // next pode ser async (cadastra colaborador)
    const result = await next(department);
    // Se next for async, pode retornar sucesso/erro
    setSuccessSnackbar(true);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <Box sx={{ px: "64px", pt: "40px", display: "flex", alignItems: "center", mb: "8px" }}>
        <Typography sx={{ color: "#565c68ff", fontSize: "15px", fontWeight: 500 }}>Colaboradores</Typography>
        <ChevronRightIcon sx={{ color: "#A3A3A3", fontSize: 16, ml: 0.5 }} />
        <Typography sx={{ color: "#A3A3A3", fontSize: "15px", fontWeight: 500 }}>Cadastrar Colaborador</Typography>
      </Box>

      {/* Progress bar - 50% */}
      <Box sx={{ px: "64px", position: "relative", mb: "48px" }}>
        <LinearProgress
          variant="determinate"
          value={50}
          sx={{
            height: "3px",
            borderRadius: "2px",
            bgcolor: "#c3f5d9ff",
            "& .MuiLinearProgress-bar": { bgcolor: "#22C55E" },
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
          50%
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
            Informações Profissionais
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
            <Select
              displayEmpty
              value={department}
              onChange={e => setDepartment(e.target.value)}
              fullWidth
              sx={{
                bgcolor: "#fff",
                height: "54px",
                borderRadius: "9px",
                fontSize: "16px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E5E7EB",
                  borderWidth: "2px",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#22C55E",
                  borderWidth: "2px",
                },
                px: "16px",
              }}
              renderValue={selected => selected ? selected : "Selecione um departamento"}
              error={!!error}
            >
              <MenuItem value="" disabled>
                Selecione um departamento
              </MenuItem>
              <MenuItem value="Financeiro">Financeiro</MenuItem>
              <MenuItem value="RH">RH</MenuItem>
              <MenuItem value="TI">TI</MenuItem>
              <MenuItem value="Operações">Operações</MenuItem>
            </Select>
            {error && (
              <Typography sx={{ color: "error.main", fontSize: "13px", mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

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
            color: "#6b7989",
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
          onClick={onFinish}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Concluir"}
        </Button>
      </Box>
      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">Colaborador cadastrado com sucesso!</Alert>
      </Snackbar>
    </Box>
  );
}