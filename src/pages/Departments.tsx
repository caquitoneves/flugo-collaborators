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
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { DepartmentList } from "../components/DepartmentList";
import { DepartmentModal } from "../components/DepartmentModal";
import { Department, Collaborator } from "../types";
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
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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
  const [transferFromDeptId, setTransferFromDeptId] = useState<string | null>(null);
  const [transferToDeptId, setTransferToDeptId] = useState("");
  const [transferColabs, setTransferColabs] = useState<Collaborator[]>([]);

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [confirmNameInput, setConfirmNameInput] = useState("");

  const [feedback, setFeedback] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  // =====================
  // Lazy loading
  // =====================
  const loadDepartments = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const { departments: newDepts, lastDoc: newLastDoc } = await fetchDepartments(
      10,
      lastDoc ?? undefined
    );

    setDepartments((prev) => [...prev, ...newDepts]);
    setLastDoc(newLastDoc);
    setHasMore(!!newLastDoc); // só mostra botão se houver próximo lote

    setLoading(false);
    setInitialLoading(false);
  };

  const loadCollaborators = async () => {
    const cols = await getCollaborators();
    setCollaborators(cols);
  };

  useEffect(() => {
    // reset antes de carregar
    setDepartments([]);
    setLastDoc(undefined);
    setHasMore(true);
    setInitialLoading(true);

    loadDepartments();
    loadCollaborators();
  }, []);

  // =====================
  // Handlers
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
    if (!form.name || !form.manager) return;

    const isDuplicate = departments.some(
      (d) =>
        d.name.toLowerCase() === form.name.toLowerCase() &&
        d.id !== editDepartment?.id
    );
    if (isDuplicate) {
      setFeedback({ open: true, message: "Já existe um departamento com este nome!" });
      return;
    }

    let deptId: string;
    if (editDepartment) {
      await updateDepartment(editDepartment.id, { ...form });
      deptId = editDepartment.id;
    } else {
      const newDept = await addDepartment({ ...form });
      deptId = newDept.id;
    }

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
        await updateCollaborator(colab.id, { departmentId: "", departmentName: "", managerId: "" });
      }
    }

    setOpenModal(false);
    // reset e recarrega
    setDepartments([]);
    setLastDoc(undefined);
    setHasMore(true);
    setInitialLoading(true);
    await loadDepartments();
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
    setFeedback({ open: true, message: "Colaboradores transferidos e departamento excluído com sucesso!" });

    setDepartments([]);
    setLastDoc(undefined);
    setHasMore(true);
    setInitialLoading(true);
    await loadDepartments();
  };

  // =====================
  // JSX
  // =====================
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar />
      <Box sx={{ flex: 1, position: "relative", minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar />

        {initialLoading ? (
          <Typography sx={{ p: 2 }}>Carregando departamentos...</Typography>
        ) : (
          <DepartmentList
            departments={departments}
            collaborators={collaborators}
            filterName={filterName}
            setFilterName={setFilterName}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        )}

        {hasMore && !initialLoading && (
          <Box display="flex" justifyContent="center" my={2}>
            <Button onClick={loadDepartments} disabled={loading}>
              {loading ? "Carregando..." : "Carregar mais"}
            </Button>
          </Box>
        )}

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
              onClick={async () => {
                if (!departmentToDelete) return;
                await deleteDepartment(departmentToDelete.id);
                setConfirmDeleteDialogOpen(false);
                setDepartmentToDelete(null);

                setDepartments([]);
                setLastDoc(undefined);
                setHasMore(true);
                await loadDepartments();
              }}
            >
              Excluir
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
