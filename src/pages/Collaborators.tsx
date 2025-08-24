import { useState, useEffect } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { CollaboratorList } from "../components/CollaboratorList";
import { Step1 } from "../components/MultiStepForm/Step1";
import { Step2 } from "../components/MultiStepForm/Step2";
import { EditCollaboratorModal } from "../components/EditCollaboratorModal";
import {
  addCollaborator,
  existsCollaboratorEmail,
  deleteCollaborator,
  deleteCollaboratorsBatch,
  updateCollaborator,
} from "../firebase/collaborators";
import { Collaborator } from "../types";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase/config";

const allowedHierarchies = ["Júnior", "Pleno", "Sênior", "Gestor"];

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [formStep, setFormStep] = useState<1 | 2 | null>(null);
  const [formData, setFormData] = useState<Omit<Collaborator, "id"> | null>(null);

  const [feedback, setFeedback] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  // Modal de edição rápida
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalLoading, setEditModalLoading] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);

  // Multi-step cadastro
  const [editCollaborator, setEditCollaborator] = useState<Collaborator | null>(null);

  // Buscar colaboradores
  const fetchCollaborators = async (loadMore = false) => {
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

  useEffect(() => {
    fetchCollaborators(false);
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
    department?: string;
    avatarUrl?: string;
    status?: string;
  }) => {
    setFormData({
      name: data.name,
      email: data.email,
      status: data.active ? "ativo" : "inativo",
      avatarUrl: data.avatarUrl || "",
      department: data.department || "",
    });
    setFormStep(2);
  };

  const handleFinish = async (data: {
    department: string;
    role?: string;
    admissionDate?: string;
    hierarchy?: string;
    managerId?: string;
    salary?: string;
  }) => {
    if (!formData) return;
    setLoading(true);
    try {
      const collaboratorToSave = {
        ...formData,
        ...data,
        hierarchy: allowedHierarchies.includes(data.hierarchy || "")
          ? (data.hierarchy as "Júnior" | "Pleno" | "Sênior" | "Gestor")
          : undefined,
      };
      if (editCollaborator) {
        await updateCollaborator(editCollaborator.id, collaboratorToSave);
        setFeedback({
          open: true,
          type: "success",
          message: "Colaborador atualizado com sucesso!",
        });
      } else {
        const alreadyExists = await existsCollaboratorEmail(formData.email);
        if (alreadyExists) {
          setFeedback({
            open: true,
            type: "error",
            message: "Já existe colaborador com este e-mail!",
          });
          setLoading(false);
          return;
        }
        await addCollaborator(collaboratorToSave as Collaborator);
        setFeedback({
          open: true,
          type: "success",
          message: "Colaborador cadastrado com sucesso!",
        });
      }
      setFormStep(null);
      setFormData(null);
      setEditCollaborator(null);
      await fetchCollaborators(false);
    } catch (e) {
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
    if (!loading && hasMore) fetchCollaborators(true);
  };

  // Modal edição rápida
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
      await updateCollaborator(selectedCollaborator.id, {
        ...data,
        hierarchy: allowedHierarchies.includes(data.hierarchy || "")
          ? (data.hierarchy as "Júnior" | "Pleno" | "Sênior" | "Gestor")
          : undefined,
      });
      setFeedback({
        open: true,
        type: "success",
        message: "Colaborador atualizado com sucesso!",
      });
      await fetchCollaborators(false);
      handleEditModalClose();
    } catch (e) {
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
      await fetchCollaborators(false);
    } catch (e) {
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
      await fetchCollaborators(false);
    } catch (e) {
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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar />
      <Box sx={{ flex: 1, position: "relative", minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar />
        {formStep === null ? (
          <CollaboratorList
            collaborators={collaborators}
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
            editData={editCollaborator}
          />
        ) : (
          <Step2
            next={handleFinish}
            back={handleBack}
            loading={loading}
            editData={editCollaborator}
            collaborators={collaborators}
          />
        )}

        {/* Modal de edição rápida */}
        <EditCollaboratorModal
          open={editModalOpen}
          collaborator={selectedCollaborator}
          loading={editModalLoading}
          onClose={handleEditModalClose}
          onSave={handleEditModalSave}
        />

        {/* Feedback visual */}
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