import { db } from "./config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { Collaborator } from "../types";

const COLLABORATORS_COLLECTION = "collaborators";

export const addCollaborator = async (data: Omit<Collaborator, "id">) => {
  return await addDoc(collection(db, COLLABORATORS_COLLECTION), data);
};

export const updateCollaborator = async (
  id: string,
  data: Partial<Collaborator>
) => {
  return await updateDoc(doc(db, COLLABORATORS_COLLECTION, id), data as any);
};

export const deleteCollaborator = async (id: string) => {
  await deleteDoc(doc(db, COLLABORATORS_COLLECTION, id));
};

export const deleteCollaboratorsBatch = async (ids: string[]) => {
  const batch = writeBatch(db);
  ids.forEach((id) => batch.delete(doc(db, COLLABORATORS_COLLECTION, id)));
  await batch.commit();
};

export const existsCollaboratorEmail = async (email: string) => {
  const q = query(
    collection(db, COLLABORATORS_COLLECTION),
    where("email", "==", email)
  );
  const snap = await getDocs(q);
  return !snap.empty;
};

export const getCollaborators = async (): Promise<Collaborator[]> => {
  const snap = await getDocs(collection(db, COLLABORATORS_COLLECTION));
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Collaborator, "id">),
  }));
};
