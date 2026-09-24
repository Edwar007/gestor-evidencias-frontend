import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import { Cases } from "../pages/cases/Cases";
import { CreateCase } from "../pages/cases/CreateCase";
import { CaseDetail } from "../pages/cases/CaseDetail";
import { EditCase } from "../pages/cases/EditCase";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/new" element={<CreateCase />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/cases/:id/edit"element={<EditCase />}/>
        </Route>
        <Route
          path="*"
          element={<div>Página no encontrada</div>}
        />
      </Routes>
    </BrowserRouter>
  );
};