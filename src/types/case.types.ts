export type CaseStatus = "OPEN" | "CLOSED";

export interface Case {
  id: string;
  titulo: string;
  descripcion: string;
  estado: CaseStatus;
  fileKey: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateCaseData {
  titulo: string;
  descripcion: string;
}

export interface UpdateCaseData {
  titulo?: string;
  descripcion?: string;
  estado?: CaseStatus;
}