import { apiRequest } from "./api.service";

import type {
  Case,
  CreateCaseData,
  UpdateCaseData,
  UploadFileData,
  UploadUrlResponse,
  CompleteFileData,
} from "../types/case.types";

export const listarCasos = async (
  token: string
): Promise<Case[]> => {
  return apiRequest<Case[]>("/cases", {
    method: "GET",
    token,
  });
};

export const obtenerCaso = async (
  id: string,
  token: string
): Promise<Case> => {
  return apiRequest<Case>(`/cases/${id}`, {
    method: "GET",
    token,
  });
};

export const crearCaso = async (
  data: CreateCaseData,
  token: string
): Promise<Case> => {
  return apiRequest<Case>("/cases", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
};

export const actualizarCaso = async (
  id: string,
  data: UpdateCaseData,
  token: string
): Promise<Case> => {
  return apiRequest<Case>(`/cases/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
};

export const eliminarCaso = async (
  id: string,
  token: string
): Promise<void> => {
  await apiRequest<void>(`/cases/${id}`, {
    method: "DELETE",
    token,
  });
};

export const obtenerUploadUrl = async (
  id: string,
  data: UploadFileData,
  token: string
): Promise<UploadUrlResponse> => {
  return apiRequest<UploadUrlResponse>(
    `/cases/${id}/file/upload-url`,
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
};

export const completarArchivo = async (
  id: string,
  data: CompleteFileData,
  token: string
): Promise<Case> => {
  return apiRequest<Case>(
    `/cases/${id}/file/complete`,
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
};

export const obtenerDownloadUrl = async (
  id: string,
  token: string
): Promise<{ downloadUrl: string; expiresIn: number }> => {
  return apiRequest<{
    downloadUrl: string;
    expiresIn: number;
  }>(`/cases/${id}/file/download-url`, {
    method: "GET",
    token,
  });
};

export const subirArchivo = async (
  uploadUrl: string,
  file: File
): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("No se pudo subir el archivo");
  }
};