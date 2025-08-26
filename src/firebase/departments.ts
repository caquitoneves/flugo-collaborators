import { db } from "./config";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, QueryDocumentSnapshot, DocumentData, limit, query, orderBy, startAfter } from "firebase/firestore";
import { Department } from "../types";

const ref = collection(db, "departments");

export async function fetchDepartments(
  pageSize = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ departments: Department[]; lastDoc?: QueryDocumentSnapshot<DocumentData> }> {
  let q = query(ref, orderBy("name"), limit(pageSize));
  if (lastDoc) q = query(ref, orderBy("name"), startAfter(lastDoc), limit(pageSize));

  const snap = await getDocs(q);
  const departments = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Department, "id">),
  }));
  
  const lastVisible =
    snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;

  return { departments, lastDoc: lastVisible };
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