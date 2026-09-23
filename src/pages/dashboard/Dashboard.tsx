import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main>
      <h1>Dashboard</h1>

      <p>
        Bienvenido, <strong>{user?.email}</strong>
      </p>

      <button type="button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </main>
  );
};