import { apiRequest } from "./api.service";

import type {
  LoginData,
  LoginResponse,
  RegisterData,
  User,
} from "../types/auth.types";

export const registrarUsuario = async (
  data: RegisterData
): Promise<void> => {
  await apiRequest<void>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const iniciarSesion = async (
  data: LoginData
): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const obtenerUsuarioActual = async (
  token: string
): Promise<User> => {
  return apiRequest<User>("/auth/me", {
    method: "GET",
    token,
  });
};