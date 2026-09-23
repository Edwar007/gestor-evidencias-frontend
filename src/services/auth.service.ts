const API_URL = import.meta.env.VITE_API_URL;
import type { LoginData, LoginResponse, RegisterData, User} from "../types/auth.types";

export const registrarUsuario = async (data: RegisterData): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.mensaje || "Error al registrar usuario");
  }

  return result;
};

export const iniciarSesion = async (data: LoginData): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.mensaje || "Credenciales inválidas");
  }

  return result;
};

export const obtenerUsuarioActual = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.mensaje || "No se pudo obtener el usuario");
  }

  return result;
};
