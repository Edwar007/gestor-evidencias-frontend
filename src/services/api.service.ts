import { ApiError } from "../errors/api.error";

const API_URL = import.meta.env.VITE_API_URL;

interface ApiRequestOptions extends RequestInit {
  token?: string;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { token, headers, ...requestOptions } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...headers,
    },
  });

  if (!response.ok) {
    let data: {
      mensaje?: string;
      errores?: unknown;
    } = {};

    try {
      data = await response.json();
    } catch {
      // La respuesta no contiene JSON.
    }

    throw new ApiError(
      data.mensaje || "Ocurrió un error en la solicitud",
      response.status,
      data.errores
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};