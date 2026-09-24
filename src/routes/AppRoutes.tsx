import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Dashboard } from "../pages/dashboard/Dashboard";

import { Cases } from "../pages/cases/Cases";
import { CreateCase } from "../pages/cases/CreateCase";
import { CaseDetail } from "../pages/cases/CaseDetail";
import { EditCase } from "../pages/cases/EditCase";

import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../components/layout/AppLayout";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas privadas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/new" element={<CreateCase />} />
            <Route path="/cases/:id" element={<CaseDetail />} />
            <Route path="/cases/:id/edit" element={<EditCase />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<div>Página no encontrada</div>}
        />
      </Routes>
    </BrowserRouter>
  );
};