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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Collaborator, Department } from "../types";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../firebase/departments";
import {
  getCollaborators,
  updateCollaborator,
} from "../firebase/collaborators";
import { DepartmentModal } from "../components/DepartmentModal";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [filterName, setFilterName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [form, setForm] = useState({
    name: "",
    manager: "",
    collaborators: [] as string[],
  });

  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferFromDeptId, setTransferFromDeptId] = useState<string | null>(
    null
  );
  const [transferToDeptId, setTransferToDeptId] = useState("");
  const [transferColabs, setTransferColabs] = useState<Collaborator[]>([]);
  const [feedback, setFeedback] = useState<{ open: boolean; message: string }>(
    {
      open: false,
      message: "",
    }
  );

  const refreshData = async () => {
    const depts = await fetchDepartments();
    const cols = await getCollaborators();
    setDepartments(depts);
    setCollaborators(cols);
  };

  useEffect(() => {
    refreshData();
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

    // 1) Cria/atualiza departamento e obtém deptId
    let deptId: string;
    if (editDepartment) {
      await updateDepartment(editDepartment.id, { ...form });
      deptId = editDepartment.id;
    } else {
      const newDept = await addDepartment({ ...form });
      deptId = newDept.id;
    }

    // 2) Atualiza colaboradores (entra/sai do departamento)
    for (const colab of collaborators) {
      const shouldBelong =
        form.collaborators.includes(colab.id) || colab.id === form.manager;

      if (shouldBelong) {
        await updateCollaborator(colab.id, {
          departmentId: deptId,
          departmentName: form.name,
          managerId: form.manager,
        });
      } else if (
        colab.departmentId === deptId &&
        !form.collaborators.includes(colab.id)
      ) {
        // estava neste dept e saiu
        await updateCollaborator(colab.id, {
          departmentId: "",
          departmentName: "",
          managerId: "",
        });
      }
    }

    setOpenModal(false);
    await refreshData();
  };

  const handleDelete = async (id: string) => {
    const affectedColabs = collaborators.filter((c) => c.departmentId === id);
    if (affectedColabs.length > 0) {
      setTransferFromDeptId(id);
      setTransferColabs(affectedColabs);
      setTransferDialogOpen(true);
      return;
    }

    await deleteDepartment(id);
    await refreshData();
  };

  const handleConfirmTransfer = async () => {
    if (!transferFromDeptId || !transferToDeptId) return;

    const newDept = departments.find((d) => d.id === transferToDeptId);
    const newManagerId = newDept?.manager || "";
    const newDeptName = newDept?.name || "";

    for (const colab of transferColabs) {
      await updateCollaborator(colab.id, {
        departmentId: transferToDeptId,
        departmentName: newDeptName,
        managerId: newManagerId,
      });
    }

    await deleteDepartment(transferFromDeptId);

    setTransferDialogOpen(false);
    setTransferFromDeptId(null);
    setTransferToDeptId("");
    setTransferColabs([]);
    setFeedback({
      open: true,
      message:
        "Colaboradores transferidos e departamento excluído com sucesso!",
    });

    await refreshData();
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          position: "relative",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Navbar />
        <Box sx={{ p: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
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

          <TextField
            label="Filtrar por nome"
            variant="outlined"
            size="small"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            sx={{ mb: 2 }}
          />

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
                    Nome <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                    Gestor Responsável <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                    Colaboradores <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
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
                      <Typography sx={{ fontWeight: 500, color: "#222" }}>
                        {dept.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {collaborators.find((c) => c.id === dept.manager) ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar
                            src={
                              collaborators.find((c) => c.id === dept.manager)
                                ?.avatarUrl
                            }
                            sx={{ width: 32, height: 32 }}
                          />
                          <Typography sx={{ fontWeight: 500 }}>
                            {
                              collaborators.find((c) => c.id === dept.manager)
                                ?.name
                            }
                          </Typography>
                        </Box>
                      ) : (
                        <Chip label="Não definido" color="warning" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {collaborators
                          .filter((c) => c.departmentId === dept.id)
                          .map((colab) => (
                            <Chip
                              key={colab.id}
                              avatar={
                                <Avatar
                                  src={colab.avatarUrl}
                                  sx={{ width: 24, height: 24 }}
                                />
                              }
                              label={colab.name}
                              sx={{ mb: 0.5 }}
                            />
                          ))}
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

        <Dialog
          open={transferDialogOpen}
          onClose={() => setTransferDialogOpen(false)}
        >
          <DialogTitle>Transferir colaboradores</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Existem colaboradores vinculados a este departamento. Selecione
              para qual departamento eles devem ser transferidos antes da
              exclusão.
            </Typography>
            <TextField
              select
              label="Departamento de destino"
              value={transferToDeptId}
              onChange={(e) => setTransferToDeptId(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              {departments
                .filter((d) => d.id !== transferFromDeptId)
                .map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
            </TextField>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              Colaboradores a transferir:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {transferColabs.map((colab) => (
                <Chip
                  key={colab.id}
                  avatar={
                    <Avatar
                      src={colab.avatarUrl}
                      sx={{ width: 24, height: 24 }}
                    />
                  }
                  label={colab.name}
                  sx={{ mb: 0.5 }}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTransferDialogOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleConfirmTransfer}
              variant="contained"
              disabled={!transferToDeptId}
              sx={{
                bgcolor: "#22C55E",
                color: "#fff",
                "&:hover": { bgcolor: "#16A34A" },
              }}
            >
              Transferir e Excluir
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={feedback.open}
          autoHideDuration={4000}
          onClose={() => setFeedback({ open: false, message: "" })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success">{feedback.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
