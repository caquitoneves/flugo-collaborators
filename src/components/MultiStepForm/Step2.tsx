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
import { Collaborator, Department } from "../../types";

type Step2Props = {
  next: (data: {
    seniority?: "junior" | "pleno" | "senior" | "gestor";
    departmentId?: string;
    departmentName?: string;
    role?: string;
    admissionDate?: string;
    managerId?: string;
    salaryBase?: number;
  }) => void;
  back: () => void;
  loading?: boolean;
  editData?: Collaborator | null;
  collaborators: Collaborator[];
  departments: Department[];
};

const hierarchyLevels: { label: string; value: Collaborator["seniority"] }[] = [
  { label: "Júnior", value: "junior" },
  { label: "Pleno", value: "pleno" },
  { label: "Sênior", value: "senior" },
  { label: "Gestor", value: "gestor" },
];

export function Step2({
  next,
  back,
  loading = false,
  editData = null,
  collaborators = [],
  departments = [],
}: Step2Props) {
  const [seniority, setSeniority] = useState<Collaborator["seniority"] | "">(
    editData?.seniority || ""
  );
  const [departmentId, setDepartmentId] = useState(editData?.departmentId || "");
  const [role, setRole] = useState(editData?.role || "");
  const [admissionDate, setAdmissionDate] = useState(editData?.admissionDate || "");
  const [managerId, setManagerId] = useState(editData?.managerId || "");
  const [salaryBase, setSalaryBase] = useState<string>(
    editData?.salaryBase?.toString() || ""
  );
  const [error, setError] = useState<{ seniority?: string; departmentId?: string }>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  // Atualiza gestor responsável automaticamente ao trocar departamento
  useEffect(() => {
    if (departmentId && seniority !== "gestor") {
      const dept = departments.find((d) => d.id === departmentId);
      setManagerId(dept?.manager || "");
    } else {
      setManagerId("");
    }
  }, [departmentId, departments, seniority]);

  useEffect(() => {
    if (editData) {
      setSeniority(editData.seniority || "");
      setDepartmentId(editData.departmentId || "");
      setRole(editData.role || "");
      setAdmissionDate(editData.admissionDate || "");
      setManagerId(editData.managerId || "");
      setSalaryBase(editData.salaryBase?.toString() || "");
    }
  }, [editData]);

  const validate = () => {
    let valid = true,
      err: typeof error = {};
    if (!seniority) {
      valid = false;
      err.seniority = "Nível hierárquico é obrigatório.";
    }
    if (seniority !== "gestor" && !departmentId.trim()) {
      valid = false;
      err.departmentId = "Departamento é obrigatório.";
    }
    setError(err);
    return valid;
  };

  const onNext = () => {
    if (validate()) {
      // Buscar o nome do departamento selecionado
      const selectedDepartment = departments.find(d => d.id === departmentId);
      
      next({
        seniority: seniority as Collaborator["seniority"],
        departmentId: seniority !== "gestor" ? departmentId : undefined,
        departmentName: seniority !== "gestor" ? selectedDepartment?.name : undefined, // Corrigido
        role,
        admissionDate,
        managerId: seniority !== "gestor" ? managerId : undefined,
        salaryBase: salaryBase ? Number(salaryBase) : undefined,
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
        <Typography sx={{ color: "#565c68ff", fontSize: "15px", fontWeight: 500 }}>
          Colaboradores
        </Typography>
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
            fontWeight: 500,
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
        {/* Stepper lateral */}
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
              label="Nível Hierárquico"
              variant="outlined"
              select
              value={seniority}
              onChange={(e) => setSeniority(e.target.value as Collaborator["seniority"])}
              fullWidth
              required
              error={!!error.seniority}
              helperText={error.seniority}
            >
              {hierarchyLevels.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MenuItem>
              ))}
            </TextField>
            {seniority && seniority !== "gestor" && (
              <TextField
                label="Departamento"
                variant="outlined"
                select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                fullWidth
                error={!!error.departmentId}
                helperText={error.departmentId}
                required
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField
              label="Cargo"
              variant="outlined"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
            />
            <TextField
              label="Data de Admissão"
              variant="outlined"
              type="date"
              value={admissionDate}
              onChange={(e) => setAdmissionDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            {seniority && seniority !== "gestor" && departmentId && (
              <TextField
                label="Gestor Responsável"
                variant="outlined"
                value={
                  managerId ? collaborators.find((c) => c.id === managerId)?.name || "" : ""
                }
                fullWidth
                disabled
                helperText="Gestor do departamento selecionado"
              />
            )}
            <TextField
              label="Salário Base"
              variant="outlined"
              type="number"
              value={salaryBase}
              onChange={(e) => setSalaryBase(e.target.value)}
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
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : editData ? (
            "Salvar"
          ) : (
            "Finalizar"
          )}
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