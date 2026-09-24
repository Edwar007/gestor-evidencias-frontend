import type {
  Case,
  CreateCaseData,
  UpdateCaseData,
  UploadFileData,
  UploadUrlResponse,
  CompleteFileData,
} from "../types/case.types";

const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const listarCasos = async (token: string): Promise<Case[]> => {
  const response = await fetch(`${API_URL}/cases`, {
    method: "GET",
    headers: getHeaders(token),
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los casos");
  }

  return response.json();
};

export const obtenerCaso = async (
  id: string,
  token: string
): Promise<Case> => {
  const response = await fetch(`${API_URL}/cases/${id}`, {
    method: "GET",
    headers: getHeaders(token),
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el caso");
  }

  return response.json();
};

export const crearCaso = async (
  data: CreateCaseData,
  token: string
): Promise<Case> => {
  const response = await fetch(`${API_URL}/cases`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear el caso");
  }

  return response.json();
};

export const actualizarCaso = async (
  id: string,
  data: UpdateCaseData,
  token: string
): Promise<Case> => {
  const response = await fetch(`${API_URL}/cases/${id}`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el caso");
  }

  return response.json();
};

export const eliminarCaso = async (
  id: string,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/cases/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el caso");
  }
};

export const obtenerUploadUrl = async (
  id: string,
  data: UploadFileData,
  token: string
): Promise<UploadUrlResponse> => {
  const response = await fetch(
    `${API_URL}/cases/${id}/file/upload-url`,
    {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo obtener la URL de subida");
  }

  return response.json();
};

export const completarArchivo = async (
  id: string,
  data: CompleteFileData,
  token: string
): Promise<Case> => {
  const response = await fetch(
    `${API_URL}/cases/${id}/file/complete`,
    {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo completar la subida");
  }

  return response.json();
};

export const obtenerDownloadUrl = async (
  id: string,
  token: string
): Promise<{ downloadUrl: string; expiresIn: number }> => {
  const response = await fetch(
    `${API_URL}/cases/${id}/file/download-url`,
    {
      method: "GET",
      headers: getHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo obtener la URL de descarga");
  }

  return response.json();
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