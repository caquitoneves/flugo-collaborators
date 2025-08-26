import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Collaborator, Department } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (collaborator: Collaborator) => void;
  collaborator: Collaborator | null;
  departments: Department[];
  collaborators: Collaborator[];
  loading?: boolean;
}

export default function EditCollaboratorModal({
  open,
  onClose,
  onSave,
  collaborator,
  departments,
  collaborators,
  loading = false, // 🔹 valor default
}: Props) {
  const [form, setForm] = useState<Partial<Collaborator>>({});

  useEffect(() => {
    if (collaborator) {
      setForm(collaborator);
    } else {
      setForm({});
    }
  }, [collaborator]);

  const handleChange =
    (field: keyof Collaborator) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = () => {
    if (!form.name || !form.email || !form.departmentId) return;
    onSave(form as Collaborator);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Editar Colaborador</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Nome"
          value={form.name || ""}
          onChange={handleChange("name")}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={form.email || ""}
          onChange={handleChange("email")}
        />

        <TextField
          select
          fullWidth
          margin="normal"
          label="Departamento"
          value={form.departmentId || ""}
          onChange={handleChange("departmentId")}
        >
          {departments.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          margin="normal"
          label="Senioridade"
          value={form.seniority || ""}
          onChange={handleChange("seniority")}
        >
          <MenuItem value="junior">Júnior</MenuItem>
          <MenuItem value="pleno">Pleno</MenuItem>
          <MenuItem value="senior">Sênior</MenuItem>
          <MenuItem value="gestor">Gestor</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          margin="normal"
          label="Gestor"
          value={form.managerId || ""}
          onChange={handleChange("managerId")}
        >
          {collaborators
            .filter((c) => c.seniority === "gestor")
            .map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          type="number"
          label="Salário Base"
          value={form.salaryBase || ""}
          onChange={handleChange("salaryBase")}
        />
        
        <TextField
          select
          fullWidth
          margin="normal"
          label="Status"
          value={form.status || "ativo"}
          onChange={handleChange("status")}
        >
          <MenuItem value="ativo">Ativo</MenuItem>
          <MenuItem value="inativo">Inativo</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
