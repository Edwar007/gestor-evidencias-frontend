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

export interface UploadFileData {
  fileName: string;
  contentType: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

export interface CompleteFileData {
  key: string;
}