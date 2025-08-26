import { db } from "./config";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Department } from "../types";

const ref = collection(db, "departments");

export async function fetchDepartments(): Promise<Department[]> {
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Department, "id">) }));
}

export async function addDepartment(data: Omit<Department, "id">): Promise<Department> {
  const docRef = await addDoc(ref, data);
  return { id: docRef.id, ...data };
}

export async function updateDepartment(id: string, data: Partial<Department>) {
  await updateDoc(doc(ref, id), data);
}

export async function deleteDepartment(id: string) {
  await deleteDoc(doc(ref, id));
}