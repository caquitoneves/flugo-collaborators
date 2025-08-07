import { db } from "./config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Collaborator } from "../types";

const COLLABORATORS_COLLECTION = "collaborators";

export const addCollaborator = async (data: Collaborator) => {
  return await addDoc(collection(db, COLLABORATORS_COLLECTION), data);
};

export const getCollaborators = async (): Promise<Collaborator[]> => {
  const snapshot = await getDocs(collection(db, COLLABORATORS_COLLECTION));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Collaborator, "id">)
  }));
};

export const existsCollaboratorEmail = async (email: string): Promise<boolean> => {
  const q = query(
    collection(db, COLLABORATORS_COLLECTION),
    where("email", "==", email)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};
