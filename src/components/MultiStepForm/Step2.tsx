import {
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Collaborator } from "../../types";

type Step2Props = {
  next: (data: {
    department: string;
    role?: string;
    admissionDate?: string;
    hierarchy?: string;
    manager?: string;
    salary?: string;
  }) => void;
  back: () => void;
  loading?: boolean;
  editData?: Collaborator | null;
  collaborators: Collaborator[]; // Adicione esta prop!
};

const hierarchyLevels = [
  "Júnior",
  "Pleno",
  "Sênior",
  "Gestor"
];

export function Step2({
  next,
  back,
  loading = false,
  editData = null,
  collaborators = [],
}: Step2Props) {
  const [department, setDepartment] = useState(editData?.department || "");
  const [role, setRole] = useState(editData?.role || "");
  const [admissionDate, setAdmissionDate] = useState(editData?.admissionDate || "");
  const [hierarchy, setHierarchy] = useState(editData?.hierarchy || "");
  const [manager, setManager] = useState(editData?.manager || "");
  const [salary, setSalary] = useState(editData?.salary || "");
  const [error, setError] = useState<{ department?: string }>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  useEffect(() => {
    if (editData) {
      setDepartment(editData.department || "");
      setRole(editData.role || "");
      setAdmissionDate(editData.admissionDate || "");
      setHierarchy(editData.hierarchy || "");
      setManager(editData.manager || "");
      setSalary(editData.salary || "");
    }
  }, [editData]);

  const validate = () => {
    let valid = true, err: typeof error = {};
    if (!department.trim()) {
      valid = false;
      err.department = "Departamento é obrigatório.";
    }
    setError(err);
    return valid;
  };

  const onNext = () => {
    if (validate()) {
      next({
        department,
        role,
        admissionDate,
        hierarchy,
        manager,
        salary,
      });
    } else {
      setSnackbarMsg("Preencha todos os campos obrigatórios.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <Box sx={{ px: "64px", pt: "40px", display: "flex", alignItems: "center", mb: "8px" }}>
        <Typography sx={{ color: "#565c68ff", fontSize: "15px", fontWeight: 500 }}>Colaboradores</Typography>
        <ChevronRightIcon sx={{ color: "#A3A3A3", fontSize: 16, ml: 0.5 }} />
        <Typography sx={{ color: "#A3A3A3", fontSize: "15px", fontWeight: 500 }}>
          {editData ? "Editar Colaborador" : "Cadastrar Colaborador"}
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ px: "64px", position: "relative", mb: "48px" }}>
        <LinearProgress
          variant="determinate"
          value={50}
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
        {/* Stepper lateral pode ser igual ao Step1 */}
        <Box sx={{ width: 170, mr: 8, pt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: "24px" }}>
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
              1
            </Box>
            <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#A3A3A3" }}>
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
                border: "2px solid #DEF7EC",
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
            <TextField
              label="Departamento"
              variant="outlined"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              fullWidth
              error={!!error.department}
              helperText={error.department}
              required
            />
            <TextField
              label="Cargo"
              variant="outlined"
              value={role}
              onChange={e => setRole(e.target.value)}
              fullWidth
            />
            <TextField
              label="Data de Admissão"
              variant="outlined"
              type="date"
              value={admissionDate}
              onChange={e => setAdmissionDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Nível Hierárquico"
              variant="outlined"
              select
              value={hierarchy}
              onChange={e => setHierarchy(e.target.value)}
              fullWidth
            >
              {hierarchyLevels.map(level => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Gestor Responsável"
              variant="outlined"
              select
              value={manager}
              onChange={e => setManager(e.target.value)}
              fullWidth
              helperText="Selecione o colaborador gestor responsável"
              required
            >
              {collaborators
                .filter(c => c.hierarchy === "Gestor")
                .map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              label="Salário Base"
              variant="outlined"
              type="number"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              fullWidth
            />
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
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : editData ? "Salvar" : "Finalizar"}
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