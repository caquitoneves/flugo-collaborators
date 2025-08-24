export type Collaborator = {
  id: string;
  name: string;
  email: string;
  status: "ativo" | "inativo";
  avatarUrl?: string;
  department: string;
  // Campos profissionais
  role?: string; // Cargo
  admissionDate?: string; // Data de admissão (formato ISO)
  hierarchy?: "Júnior" | "Pleno" | "Sênior" | "Gestor"; // Nível hierárquico
  manager?: string; // ID do gestor responsável
  salary?: string; // Salário base
};

export type Department = {
  id: string;
  name: string;
  manager: string;
  collaborators: string[]; // IDs dos colaboradores
};