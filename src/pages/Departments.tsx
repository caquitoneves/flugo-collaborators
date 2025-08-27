import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useState, useEffect } from "react";
import {
  Box,
  Snackbar,
  Alert,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { DepartmentList } from "../components/DepartmentList";
import { DepartmentModal } from "../components/DepartmentModal";
import { Department, Collaborator } from "../types";
import {
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../firebase/departments";
import {
  getCollaborators,
  updateCollaborator,
} from "../firebase/collaborators";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [lastDocs, setLastDocs] = useState<
    Map<number, QueryDocumentSnapshot | null>
  >(new Map());
  const [loading, setLoading] = useState(false);

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

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);
  const [confirmNameInput, setConfirmNameInput] = useState("");

  const [feedback, setFeedback] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // =====================
  // Função paginada chamada pelo filho
  // =====================
  const fetchMoreDepartments = async (
    page: number,
    pageSize: number
  ): Promise<Department[]> => {
    if (loading) return [];
    setLoading(true);
    try {
      const ref = collection(db, "departments");
      let q = query(ref, orderBy("name"), limit(pageSize));

      // usa o último documento da página anterior para startAfter
      const lastDoc = lastDocs.get(page - 1);
      if (lastDoc)
        q = query(ref, orderBy("name"), startAfter(lastDoc), limit(pageSize));

      const snapshot = await getDocs(q);
      const newData: Department[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Department, "id">),
      }));

      // atualiza mapa de últimos documentos por página
      setLastDocs((prev) =>
        new Map(prev).set(page, snapshot.docs[snapshot.docs.length - 1] ?? null)
      );

      return newData;
    } catch (error) {
      console.error(error);
      setFeedback({
        open: true,
        message: "Erro ao carregar departamentos.",
        severity: "error",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // Colaboradores
  // =====================
  const loadCollaborators = async () => {
    try {
      const cols = await getCollaborators();
      setCollaborators(cols);
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
      setFeedback({
        open: true,
        message: "Erro ao carregar colaboradores.",
        severity: "error",
      });
    }
  };

  const refreshData = async () => {
    setLastDocs(new Map());
    const initialDepts = await fetchMoreDepartments(1, 10);
    setDepartments(initialDepts);
    await loadCollaborators();
  };

  useEffect(() => {
    refreshData();
  }, []);

  // =====================
  // Handlers CRUD
  // =====================
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
    if (!form.name) {
      setFeedback({
        open: true,
        message: "Nome do departamento é obrigatório!",
        severity: "warning",
      });
      return;
    }
    try {
      const isDuplicate = departments.some(
        (d) =>
          d.name.toLowerCase() === form.name.toLowerCase() &&
          d.id !== editDepartment?.id
      );
      if (isDuplicate) {
        setFeedback({
          open: true,
          message: "Já existe um departamento com este nome!",
          severity: "warning",
        });
        return;
      }

      let deptId: string;
      if (editDepartment) {
        await updateDepartment(editDepartment.id, { ...form });
        deptId = editDepartment.id;
        setFeedback({
          open: true,
          message: "Departamento atualizado com sucesso!",
          severity: "success",
        });
      } else {
        const newDept = await addDepartment({ ...form });
        deptId = newDept.id;
        setFeedback({
          open: true,
          message: "Departamento criado com sucesso!",
          severity: "success",
        });
      }

      // Atualiza colaboradores
      for (const colab of collaborators) {
        const shouldBelong =
          form.collaborators.includes(colab.id) || colab.id === form.manager;
        if (shouldBelong) {
          await updateCollaborator(colab.id, {
            departmentId: deptId,
            departmentName: form.name,
            managerId: form.manager,
          });
        } else if (colab.departmentId === deptId) {
          await updateCollaborator(colab.id, {
            departmentId: "",
            departmentName: "",
            managerId: "",
          });
        }
      }

      setOpenModal(false);
      await refreshData();
    } catch (error) {
      console.error(error);
      setFeedback({
        open: true,
        message: "Erro ao salvar departamento.",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const dept = departments.find((d) => d.id === id);
    if (!dept) return;

    const allColabs = collaborators.filter((c) => c.departmentId === id);
    const nonManagerColabs = allColabs.filter((c) => c.id !== dept.manager);

    if (nonManagerColabs.length > 0) {
      setTransferFromDeptId(id);
      setTransferColabs(nonManagerColabs);
      setTransferDialogOpen(true);
      return;
    }

    setDepartmentToDelete(dept);
    setConfirmDeleteDialogOpen(true);
  };

  const handleConfirmTransfer = async () => {
    if (!transferFromDeptId || !transferToDeptId) return;
    try {
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
        severity: "success",
      });

      await refreshData();
    } catch (error) {
      console.error(error);
      setFeedback({
        open: true,
        message: "Erro ao transferir colaboradores.",
        severity: "error",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return;
    try {
      await deleteDepartment(departmentToDelete.id);
      setConfirmDeleteDialogOpen(false);
      setDepartmentToDelete(null);
      setConfirmNameInput("");
      setFeedback({
        open: true,
        message: "Departamento excluído com sucesso!",
        severity: "success",
      });
      await refreshData();
    } catch (error) {
      console.error(error);
      setFeedback({
        open: true,
        message: "Erro ao excluir departamento.",
        severity: "error",
      });
    }
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

        <AnimatePresence mode="wait">
          <motion.div
            key="department-list"
            initial={{ opacity: 0, y: 30 }}
            animate={!loading ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DepartmentList
              collaborators={collaborators}
              departments={departments}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
              fetchMoreDepartments={fetchMoreDepartments}
            />
          </motion.div>
        </AnimatePresence>

        <DepartmentModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSave={handleSave}
          form={form}
          setForm={setForm}
          collaborators={collaborators}
          editDepartment={!!editDepartment}
        />

        {/* Transfer Dialog */}
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
            <Button onClick={() => setTransferDialogOpen(false)}>
              Cancelar
            </Button>
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

        {/* Confirm Delete Dialog */}
        <Dialog
          open={confirmDeleteDialogOpen}
          onClose={() => setConfirmDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Tem certeza que deseja excluir o departamento{" "}
              <strong>{departmentToDelete?.name}</strong>? Digite o nome para
              confirmar.
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={confirmNameInput}
              onChange={(e) => setConfirmNameInput(e.target.value)}
              placeholder={`Digite "${departmentToDelete?.name}" para confirmar`}
              disabled={!departmentToDelete}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={confirmNameInput !== departmentToDelete?.name}
              onClick={handleConfirmDelete}
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={feedback.open}
          autoHideDuration={4000}
          onClose={() =>
            setFeedback({ open: false, message: "", severity: "success" })
          }
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={feedback.severity}>{feedback.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
