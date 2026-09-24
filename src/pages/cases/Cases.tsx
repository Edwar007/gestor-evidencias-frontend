import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { listarCasos } from "../../services/case.service";
import { useAuth } from "../../context/useAuth";
import type { Case } from "../../types/case.types";

export const Cases = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [casos, setCasos] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCasos = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const data = await listarCasos(token);
        setCasos(data);
      } catch {
        setError("No se pudieron cargar los casos");
      } finally {
        setLoading(false);
      }
    };

    cargarCasos();
  }, [token]);

  if (loading) {
    return <p>Cargando casos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>Mis casos</h1>

      <button type="button" onClick={() => navigate("/cases/new")}>
        Crear caso
      </button>

      {casos.length === 0 ? (
        <p>No tienes casos registrados.</p>
      ) : (
        <ul>
          {casos.map((caso) => (
            <li key={caso.id}>
              <h2>{caso.titulo}</h2>

              <p>{caso.descripcion}</p>

              <p>Estado: {caso.estado}</p>

              <button
                type="button"
                onClick={() => navigate(`/cases/${caso.id}`)}
              >
                Ver caso
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};