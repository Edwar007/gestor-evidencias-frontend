import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  iniciarSesion,
  obtenerUsuarioActual,
  registrarUsuario,
} from "../services/auth.service";

import type {
  LoginData,
  RegisterData,
  User,
} from "../types/auth.types";

import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const usuario = await obtenerUsuarioActual(token);
        setUser(usuario);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [token]);

  const login = async (data: LoginData) => {
    const resultado = await iniciarSesion(data);

    localStorage.setItem("token", resultado.token);
    setToken(resultado.token);

    const usuario = await obtenerUsuarioActual(resultado.token);
    setUser(usuario);
  };

  const register = async (data: RegisterData) => {
    await registrarUsuario(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};