import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { Collaborator } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  form: { name: string; manager: string; collaborators: string[] };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; manager: string; collaborators: string[] }>>;
  collaborators: Collaborator[];
  editDepartment: boolean;
};

export function DepartmentModal({
  open,
  onClose,
  onSave,
  form,
  setForm,
  collaborators,
  editDepartment,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editDepartment ? "Editar Departamento" : "Novo Departamento"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nome"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Gestor Responsável (opcional)"
          select
          value={form.manager}
          onChange={e => setForm(f => ({ ...f, manager: e.target.value }))}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Nenhum</MenuItem>
          {collaborators
            .filter(c => c.seniority === "gestor")
            .map(c => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          label="Colaboradores (opcional)"
          select
          SelectProps={{ multiple: true }}
          value={form.collaborators}
          onChange={e => setForm(f => ({
            ...f,
            collaborators: Array.isArray(e.target.value) ? e.target.value : [e.target.value]
          }))}
          fullWidth
          margin="normal"
        >
          {collaborators.map(c => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#22C55E", color: "#fff", "&:hover": { bgcolor: "#16A34A" } }}
          onClick={onSave}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
