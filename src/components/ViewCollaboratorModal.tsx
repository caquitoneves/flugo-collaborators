import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { Person } from "@mui/icons-material";
import { Collaborator, Department } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  collaborator: Collaborator | null;
  collaborators: Collaborator[];
  departments: Department[];
};

export function ViewCollaboratorModal({
  open,
  onClose,
  collaborator,
  collaborators,
  departments,
}: Props) {
  if (!collaborator) return null;

  const gestor = collaborator.managerId
    ? collaborators.find((c) => c.id === collaborator.managerId)?.name || "-"
    : "-";

  const department = collaborator.departmentId
    ? departments.find((d) => d.id === collaborator.departmentId)?.name || "-"
    : collaborator.departmentName || "-";

  const seniorityMap: Record<NonNullable<Collaborator["seniority"]>, string> = {
    junior: "Júnior",
    pleno: "Pleno",
    senior: "Sênior",
    gestor: "Gestor",
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Dados do Colaborador</DialogTitle>
      <DialogContent>
        {/* Avatar e Nome */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: "#E5E7EB" }}>
            {collaborator.avatarUrl ? null : <Person sx={{ color: "#6B7280" }} />}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {collaborator.name}
            </Typography>
            <Chip
              label={collaborator.status === "ativo" ? "Ativo" : "Inativo"}
              sx={{
                bgcolor:
                  collaborator.status === "ativo" ? "#DEF7EC" : "#FEE2E2",
                color:
                  collaborator.status === "ativo" ? "#22C55E" : "#EF4444",
                fontWeight: 600,
                fontSize: 12,
                borderRadius: 1,
                mt: 1,
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Grid de informações */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography>{collaborator.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Departamento
            </Typography>
            <Typography>{department}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Cargo
            </Typography>
            <Typography>{collaborator.role || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Data de Admissão
            </Typography>
            <Typography>{collaborator.admissionDate || "-"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Nível Hierárquico
            </Typography>
            <Typography>
              {collaborator.seniority
                ? seniorityMap[collaborator.seniority]
                : "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Gestor Responsável
            </Typography>
            <Typography>{gestor}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Salário Base
            </Typography>
            <Typography>
              {collaborator.salaryBase
                ? `R$ ${collaborator.salaryBase.toFixed(2)}`
                : "-"}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
