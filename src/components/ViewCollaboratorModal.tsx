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
import { Collaborator } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  collaborator: Collaborator | null;
};

export function ViewCollaboratorModal({ open, onClose, collaborator }: Props) {
  if (!collaborator) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Dados do Colaborador</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar src={collaborator.avatarUrl} sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography variant="h6">{collaborator.name}</Typography>
            <Chip
              label={collaborator.status === "ativo" ? "Ativo" : "Inativo"}
              sx={{
                bgcolor: collaborator.status === "ativo" ? "#DEF7EC" : "#FEE2E2",
                color: collaborator.status === "ativo" ? "#22C55E" : "#EF4444",
                fontWeight: 600,
                fontSize: 12,
                borderRadius: 0.5,
                mt: 1,
              }}
            />
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography><strong>Email:</strong> {collaborator.email}</Typography>
        <Typography><strong>Departamento:</strong> {collaborator.department}</Typography>
        <Typography><strong>Cargo:</strong> {collaborator.role || "-"}</Typography>
        <Typography><strong>Data de Admissão:</strong> {collaborator.admissionDate || "-"}</Typography>
        <Typography><strong>Nível Hierárquico:</strong> {collaborator.hierarchy || "-"}</Typography>
        <Typography><strong>Gestor Responsável:</strong> {collaborator.manager ? collaborator.manager : "-"}</Typography>
        <Typography><strong>Salário Base:</strong> {collaborator.salary ? `R$ ${collaborator.salary}` : "-"}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}