import { useState, useEffect } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { CollaboratorList } from "../components/CollaboratorList";
import { Step1 } from "../components/MultiStepForm/Step1";
import { Step2 } from "../components/MultiStepForm/Step2";
import {
  addCollaborator,
  existsCollaboratorEmail,
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

export default function Home() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [formStep, setFormStep] = useState<1 | 2 | null>(null);
  const [formData, setFormData] = useState<Omit<Collaborator, "id"> | null>(
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

  // Função para buscar colaboradores, loadMore indica se acumula ou substitui
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

  const handleAdd = () => setFormStep(1);

  const handleBack = () => {
    if (formStep === 2) setFormStep(1);
    else {
      setFormStep(null);
      setFormData(null);
    }
  };

  // Avança do Step1 guardando dados
  const handleNextStep1 = (data: {
    name: string;
    email: string;
    active: boolean;
  }) => {
    setFormData({
      name: data.name,
      email: data.email,
      status: data.active ? "ativo" : "inativo",
      avatarUrl: "",
      department: "",
    });
    setFormStep(2);
  };

  // Step2: persiste no Firebase, checa duplicidade
  const handleFinish = async (department: string) => {
    if (!formData) return;
    setLoading(true);
    try {
      // Checa duplicidade de email
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

      const collaboratorToSave = {
        ...formData,
        department,
      };
      await addCollaborator(collaboratorToSave as Collaborator);

      setFeedback({
        open: true,
        type: "success",
        message: "Colaborador cadastrado com sucesso!",
      });
      setFormStep(null);
      setFormData(null);

      // Atualiza lista após cadastro (substitui, sem duplicação)
      await fetchCollaborators(false);
    } catch (e) {
      setFeedback({
        open: true,
        type: "error",
        message: "Erro ao cadastrar colaborador.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar mais colaboradores (paginação)
  const handleLoadMore = () => {
    if (!loading && hasMore) fetchCollaborators(true);
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
        {formStep === null ? (
          <CollaboratorList
            collaborators={collaborators}
            onAdd={handleAdd}
            onLoadMore={handleLoadMore}
            loading={loading}
            hasMore={hasMore}
          />
        ) : formStep === 1 ? (
          <Step1 next={handleNextStep1} back={handleBack} loading={loading} />
        ) : (
          <Step2 next={handleFinish} back={handleBack} loading={loading} />
        )}

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
