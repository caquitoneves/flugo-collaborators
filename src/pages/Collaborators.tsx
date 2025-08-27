import { useState, useEffect } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
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

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";

// Remove undefined, null, or empty strings
const cleanObject = <T extends Record<string, any>>(obj: T): T =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) => v !== undefined && v !== null && v !== ""
    )
  ) as T;

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formStep, setFormStep] = useState<1 | 2 | null>(null);
  const [formData, setFormData] = useState<Partial<
    Omit<Collaborator, "id">
  > | null>(null);
  const [editCollaborator, setEditCollaborator] = useState<Collaborator | null>(
    null
  );

  const [feedback, setFeedback] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalLoading, setEditModalLoading] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] =
    useState<Collaborator | null>(null);

  // =======================
  // FETCH
  // =======================
  const fetchCollaborators = async () => {
    setLoading(true);
    try {
      const ref = collection(db, "collaborators");
      const q = query(ref, orderBy("name"));
      const snapshot = await getDocs(q);

      const data: Collaborator[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Collaborator, "id">),
      }));
      setCollaborators(data);
    } catch (e) {
      console.error(e);
      setFeedback({
        open: true,
        type: "error",
        message: "Erro ao carregar colaboradores.",
      });
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const fetchAllDepartments = async () => {
    try {
      const depts = await fetchDepartments();
      setDepartments(depts);
    } catch (e) {
      console.error(e);
      setFeedback({
        open: true,
        type: "error",
        message: "Erro ao carregar departamentos.",
      });
    }
  };

  useEffect(() => {
    fetchCollaborators();
    fetchAllDepartments();
  }, []);

  // =======================
  // FORM HANDLERS
  // =======================
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

      const collaboratorToSave: Omit<Collaborator, "id"> = cleanObject({
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
      });

      if (editCollaborator) {
        await updateCollaborator(editCollaborator.id, collaboratorToSave);
        setFeedback({
          open: true,
          type: "success",
          message: "Colaborador atualizado com sucesso!",
        });
      } else {
        if (await existsCollaboratorEmail(formData.email!)) {
          setFeedback({
            open: true,
            type: "error",
            message: "Já existe colaborador com este e-mail!",
          });
          return;
        }
        await addCollaborator(collaboratorToSave);
        setFeedback({
          open: true,
          type: "success",
          message: "Colaborador cadastrado com sucesso!",
        });
      }

      setFormStep(null);
      setFormData(null);
      setEditCollaborator(null);
      await fetchCollaborators();
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

  // =======================
  // EDIT MODAL
  // =======================
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

      const departmentName = data.departmentId
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
      setFeedback({
        open: true,
        type: "success",
        message: "Colaborador atualizado com sucesso!",
      });
      await fetchCollaborators();
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

  // =======================
  // DELETE
  // =======================
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteCollaborator(id);
      setFeedback({
        open: true,
        type: "success",
        message: "Colaborador excluído com sucesso!",
      });
      await fetchCollaborators();
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
  const handleDeleteSelected = async (ids: string[]) => {
    setLoading(true);
    try {
      await deleteCollaboratorsBatch(ids);
      setFeedback({
        open: true,
        type: "success",
        message: "Colaboradores excluídos com sucesso!",
      });
      await fetchCollaborators();
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
          {formStep === null ? (
            <motion.div
              key="collaborator-list"
              initial={{ opacity: 0, y: 30 }}
              animate={
                !initialLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CollaboratorList
                collaborators={collaborators}
                departments={departments}
                onAdd={handleAdd}
                onEditModal={handleEditModalOpen}
                onDelete={handleDelete}
                onDeleteSelected={handleDeleteSelected}
                loading={loading}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
            </motion.div>
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
        </AnimatePresence>

        <EditCollaboratorModal
          open={editModalOpen}
          collaborator={selectedCollaborator || null}
          collaborators={collaborators}
          departments={departments}
          loading={editModalLoading}
          onClose={handleEditModalClose}
          onSave={handleEditModalSave}
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
