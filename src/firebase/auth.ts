// src/firebase/auth.ts
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "./config";

// Login com email e senha
export const login = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Criar conta
export const signup = async (email: string, password: string, name?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // Atualiza o nome do usuário no Firebase
  if (name) {
    await updateProfile(userCredential.user, { displayName: name });
  }

  return userCredential;
};

// Logout
export const logout = async () => {
  return signOut(auth);
};

// Observar mudanças de autenticação (login/logout)
export const onUserStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
