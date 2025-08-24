import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Collaborator } from "../types";

const hierarchyLevels = ["Júnior", "Pleno", "Sênior", "Gestor"];

type Props = {
  open: boolean;
  collaborator: Collaborator | null;
  loading: boolean;
  onClose: () => void;
  onSave: (data: Partial<Collaborator>) => void;
};

export function EditCollaboratorModal({
  open,
  collaborator,
  loading,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Partial<Collaborator>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string }>({ open: false, msg: "" });

  useEffect(() => {
    if (collaborator) setForm(collaborator);
  }, [collaborator]);

  const handleChange = (field: keyof Collaborator) => (e: any) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.department) {
      setSnackbar({ open: true, msg: "Preencha nome, e-mail e departamento." });
      return;
    }
    onSave(form);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Colaborador</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            value={form.name || ""}
            onChange={handleChange("name")}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="E-mail"
            value={form.email || ""}
            onChange={handleChange("email")}
            fullWidth
            margin="normal"
            required
            disabled
          />
          <TextField
            label="Departamento"
            value={form.department || ""}
            onChange={handleChange("department")}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Cargo"
            value={form.role || ""}
            onChange={handleChange("role")}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Data de Admissão"
            type="date"
            value={form.admissionDate || ""}
            onChange={handleChange("admissionDate")}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Nível Hierárquico"
            select
            value={form.hierarchy || ""}
            onChange={handleChange("hierarchy")}
            fullWidth
            margin="normal"
          >
            {hierarchyLevels.map(level => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Gestor Responsável (ID)"
            value={form.manager || ""}
            onChange={handleChange("manager")}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Salário Base"
            type="number"
            value={form.salary || ""}
            onChange={handleChange("salary")}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, msg: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">{snackbar.msg}</Alert>
      </Snackbar>
    </>
  );
}