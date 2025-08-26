import { useState, useEffect } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { CollaboratorList } from "../components/CollaboratorList";
import { Step1 } from "../components/MultiStepForm/Step1";
import { Step2 } from "../components/MultiStepForm/Step2";
import EditCollaboratorModal from "../components/EditCollaboratorModal";
import {
  addCollaborator,
  existsCollaboratorEmail,
  deleteCollaborator,
  deleteCollaboratorsBatch,
  updateCollaborator,
} from "../firebase/collaborators";
import { Collaborator, Department } from "../types";
import { fetchDepartments } from "../firebase/departments";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Limpa undefined/null e string vazia
function cleanObject<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  ) as T;
}

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [formStep, setFormStep] = useState<1 | 2 | null>(null);
  const [formData, setFormData] = useState<
    Partial<Omit<Collaborator, "id">> | null
  >(null);

  const [feedback, setFeedback] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  // Modal edição rápida
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalLoading, setEditModalLoading] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] =
    useState<Collaborator | null>(null);

  // Edição completa
  const [editCollaborator, setEditCollaborator] =
    useState<Collaborator | null>(null);

  // Paginação
  const fetchCollaboratorsPaged = async (loadMore = false) => {
    setLoading(true);
    const ref = collection(db, "collaborators");
    let q = query(ref, orderBy("name"), limit(10));
    if (loadMore && lastDoc) {
      q = query(ref, orderBy("name"), startAfter(lastDoc), limit(10));
    }

    try {
      const snapshot = await getDocs(q);
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Collaborator, "id">),
      }));

      setCollaborators((prev) => (loadMore ? [...prev, ...newData] : newData));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 10);
    } catch (error) {
      setFeedback({
        open: true,
        type: "error",
        message: "Erro ao carregar colaboradores.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDepartments = async () => {
    const depts = await fetchDepartments();
    setDepartments(depts);
  };

  useEffect(() => {
    fetchCollaboratorsPaged(false);
    fetchAllDepartments();
  }, []);

  // Multi-step cadastro
  const handleAdd = () => {
    setFormStep(1);
    setEditCollaborator(null);
  };
  const handleBack = () => {
    setFormStep(null);
    setFormData(null);
    setEditCollaborator(null);
  };

  const handleNextStep1 = (data: {
    name: string;
    email: string;
    active: boolean;
    avatarUrl?: string;
  }) => {
    setFormData({
      name: data.name,
      email: data.email,
      status: data.active ? "ativo" : "inativo",
      avatarUrl: data.avatarUrl || "",
    });
    setFormStep(2);
  };

  const handleFinish = async (
    data: Partial<Collaborator> & { departmentName?: string }
  ) => {
    if (!formData?.email || !formData?.name) {
      setFeedback({
        open: true,
        type: "error",
        message: "Preencha nome e e-mail.",
      });
      return;
    }

    setLoading(true);
    try {
      const seniority = data.seniority || "junior";
      const isGestor = seniority === "gestor";

      let departmentId: string | undefined;
      let departmentName: string | undefined;
      if (!isGestor && data.departmentId) {
        departmentId = data.departmentId;
        departmentName =
          data.departmentName ||
          departments.find((d) => d.id === departmentId)?.name;
      }

      const collaboratorToSave: Omit<Collaborator, "id"> = {
        name: formData.name!,
        email: formData.email!,
        status: formData.status ?? "ativo",
        avatarUrl: formData.avatarUrl || "",
        role: data.role || "Colaborador",
        admissionDate:
          data.admissionDate || new Date().toISOString().slice(0, 10),
        seniority,
        managerId: isGestor ? undefined : data.managerId,
        salaryBase: data.salaryBase ?? 0,
        departmentId: departmentId || "",
        departmentName: departmentName || "",
      };

      if (editCollaborator) {
        await updateCollaborator(
          editCollaborator.id,
          cleanObject(collaboratorToSave)
        );

        // Se definiu manager + dept, garante dept no manager
        if (data.managerId && departmentId) {
          const manager = collaborators.find((c) => c.id === data.managerId);
          if (manager) {
            await updateCollaborator(manager.id, {
              departmentId: departmentId,
              departmentName: departmentName || "",
            });
          }
        }

        setFeedback({
          open: true,
          type: "success",
          message: "Colaborador atualizado com sucesso!",
        });
      } else {
        const alreadyExists = await existsCollaboratorEmail(formData.email!);
        if (alreadyExists) {
          setFeedback({
            open: true,
            type: "error",
            message: "Já existe colaborador com este e-mail!",
          });
          setLoading(false);
          return;
        }
        await addCollaborator(cleanObject(collaboratorToSave));
        setFeedback({
          open: true,
          type: "success",
          message: "Colaborador cadastrado com sucesso!",
        });
      }

      setFormStep(null);
      setFormData(null);
      setEditCollaborator(null);
      await fetchCollaboratorsPaged(false);
      await fetchAllDepartments();
    } catch (e) {
      console.error(e);
      setFeedback({
        open: true,
        type: "error",
        message: "Erro ao salvar colaborador.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Paginação
  const handleLoadMore = () => {
    if (!loading && hasMore) fetchCollaboratorsPaged(true);
  };

  // --- Modal edição rápida ---
  const handleEditModalOpen = (collaborator: Collaborator) => {
    setSelectedCollaborator(collaborator);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedCollaborator(null);
  };

  const handleEditModalSave = async (data: Partial<Collaborator>) => {
    if (!selectedCollaborator) return;
    setEditModalLoading(true);
    try {
      const seniority = data.seniority || selectedCollaborator.seniority;
      const isGestor = seniority === "gestor";

      let departmentName = data.departmentId
        ? departments.find((d) => d.id === data.departmentId)?.name
        : selectedCollaborator.departmentName;

      const patch: Partial<Collaborator> = cleanObject({
        ...data,
        seniority,
        managerId: isGestor
          ? undefined
          : data.managerId ?? selectedCollaborator.managerId,
        departmentId: isGestor
          ? ""
          : data.departmentId ?? selectedCollaborator.departmentId,
        departmentName: isGestor ? "" : departmentName,
      });

      await updateCollaborator(selectedCollaborator.id, patch);

      if (data.managerId && patch.departmentId) {
        const manager = collaborators.find((c) => c.id === data.managerId);
        if (manager) {
          await updateCollaborator(manager.id, {
            departmentId: patch.departmentId,
            departmentName: departmentName || "",
          });
        }
      }

      setFeedback({
        open: true,
        type: "success",
        message: "Colaborador atualizado com sucesso!",
      });
      await fetchCollaboratorsPaged(false);
      await fetchAllDepartments();
      handleEditModalClose();
    } catch (e) {
      console.error(e);
      setFeedback({
        open: true,
        type: "error",
        message: "Erro ao editar colaborador.",
      });
    } finally {
      setEditModalLoading(false);
    }
  };

  // Exclusão individual
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteCollaborator(id);
      setFeedback({
        open: true,
        type: "success",
        message: "Colaborador excluído com sucesso!",
      });
      await fetchCollaboratorsPaged(false);
      await fetchAllDepartments();
    } catch (e) {
      console.error(e);
      setFeedback({
        open: true,
        type: "error",
        message: "Erro ao excluir colaborador.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Exclusão em massa
  const handleDeleteSelected = async (ids: string[]) => {
    setLoading(true);
    try {
      await deleteCollaboratorsBatch(ids);
      setFeedback({
        open: true,
        type: "success",
        message: "Colaboradores excluídos com sucesso!",
      });
      await fetchCollaboratorsPaged(false);
      await fetchAllDepartments();
    } catch (e) {
      console.error(e);
      setFeedback({
        open: true,
        type: "error",
        message: "Erro ao excluir colaboradores.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}
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

        {formStep === null ? (
          <CollaboratorList
            collaborators={collaborators}
            departments={departments} // 👈 passa para a lista
            onAdd={handleAdd}
            onEditModal={handleEditModalOpen}
            onDelete={handleDelete}
            onDeleteSelected={handleDeleteSelected}
            onLoadMore={handleLoadMore}
            loading={loading}
            hasMore={hasMore}
          />
        ) : formStep === 1 ? (
          <Step1
            next={handleNextStep1}
            back={handleBack}
            loading={loading}
            editData={editCollaborator || undefined}
          />
        ) : (
          <Step2
            next={handleFinish}
            back={handleBack}
            loading={loading}
            editData={editCollaborator || undefined}
            collaborators={collaborators}
            departments={departments}
          />
        )}

        <EditCollaboratorModal
          open={editModalOpen}
          collaborator={selectedCollaborator || null}
          collaborators={collaborators}
          loading={editModalLoading}
          onClose={handleEditModalClose}
          onSave={handleEditModalSave}
          departments={departments}
        />

        <Snackbar
          open={feedback.open}
          autoHideDuration={4000}
          onClose={() => setFeedback((f) => ({ ...f, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={feedback.type}>{feedback.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
