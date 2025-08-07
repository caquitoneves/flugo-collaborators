export type Collaborator = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  department: string;
  status: "ativo" | "inativo";
};