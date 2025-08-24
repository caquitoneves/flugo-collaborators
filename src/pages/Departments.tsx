import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Chip,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Collaborator, Department } from "../types";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../firebase/departments";
import { getCollaborators } from "../firebase/collaborators";
import { DepartmentModal } from "../components/DepartmentModal";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [filterName, setFilterName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [form, setForm] = useState<{
    name: string;
    manager: string;
    collaborators: string[];
  }>({
    name: "",
    manager: "",
    collaborators: [],
  });

  useEffect(() => {
    fetchDepartments().then(setDepartments);
    getCollaborators().then(setCollaborators);
  }, []);

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(filterName.toLowerCase())
  );

  const handleAdd = () => {
    setEditDepartment(null);
    setForm({ name: "", manager: "", collaborators: [] });
    setOpenModal(true);
  };

  const handleEdit = (dept: Department) => {
    setEditDepartment(dept);
    setForm({
      name: dept.name,
      manager: dept.manager,
      collaborators: dept.collaborators,
    });
    setOpenModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.manager || form.collaborators.length === 0) return;

    // Remove cada colaborador selecionado de todos os outros departamentos
    for (const colabId of form.collaborators) {
      for (const dept of departments) {
        if (
          dept.id !== (editDepartment ? editDepartment.id : null) &&
          dept.collaborators.includes(colabId)
        ) {
          await updateDepartment(dept.id, {
            collaborators: dept.collaborators.filter((id) => id !== colabId),
          });
        }
      }
    }

    if (editDepartment) {
      await updateDepartment(editDepartment.id, { ...form });
    } else {
      await addDepartment({ ...form });
    }

    setOpenModal(false);
    fetchDepartments().then(setDepartments);
  };

  const handleDelete = async (id: string) => {
    await deleteDepartment(id);
    fetchDepartments().then(setDepartments);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar />
      <Box sx={{ flex: 1, position: "relative", minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar />
        <Box sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#222" }}>
              Departamentos
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: "#22C55E",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 0.5,
                boxShadow: "none",
                textTransform: "none",
                px: 2,
                py: 1.2,
                fontSize: 16,
                "&:hover": { bgcolor: "#16A34A" },
              }}
              onClick={handleAdd}
            >
              Novo Departamento
            </Button>
          </Box>

          <Box mb={2}>
            <TextField
              label="Filtrar por nome"
              variant="outlined"
              size="small"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
            />
          </Box>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 2.5,
              boxShadow: "0px 2px 15px 0px #0000000D",
              overflow: "hidden",
            }}
          >
            <Table sx={{ minWidth: 650, bgcolor: "#F9FAFB" }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F9FAFB", height: 56 }}>
                  <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                    Nome
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                    Gestor Responsável
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                    Colaboradores
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDepartments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, color: "#222" }}>{dept.name}</Typography>
                    </TableCell>
                    <TableCell>
                      {collaborators.find(c => c.id === dept.manager) ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar
                            src={collaborators.find(c => c.id === dept.manager)?.avatarUrl}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Typography sx={{ fontWeight: 500 }}>
                            {collaborators.find(c => c.id === dept.manager)?.name}
                          </Typography>
                        </Box>
                      ) : (
                        <Chip label="Não definido" color="warning" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {dept.collaborators.map(cid => {
                          const colab = collaborators.find(c => c.id === cid);
                          return colab ? (
                            <Chip
                              key={cid}
                              avatar={<Avatar src={colab.avatarUrl} sx={{ width: 24, height: 24 }} />}
                              label={colab.name}
                              sx={{ mb: 0.5 }}
                            />
                          ) : null;
                        })}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleEdit(dept)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(dept.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>

        <DepartmentModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSave={handleSave}
          form={form}
          setForm={setForm}
          collaborators={collaborators}
          editDepartment={!!editDepartment}
        />
      </Box>
    </Box>
  );
}