// src/types.ts
export type Collaborator = {
  id: string;
  name: string;
  email: string;
  status: "ativo" | "inativo";
  avatarUrl?: string;

  // Campos profissionais
  role?: string; // Cargo
  admissionDate?: string; // Data de admissão (formato ISO)

  // Nível hierárquico usado no resto do código
  seniority?: "junior" | "pleno" | "senior" | "gestor";

  // Relacionamentos
  managerId?: string; // ID do gestor
  departmentId?: string; // ID do departamento
  departmentName?: string; // Nome do departamento (para exibição)

  // Compensação
  salaryBase?: number;
};

export type Department = {
  id: string;
  name: string;
  manager: string; // ID do gestor
  collaborators: string[]; // IDs dos colaboradores
};
