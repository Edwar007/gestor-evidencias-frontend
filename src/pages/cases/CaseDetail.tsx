import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  obtenerCaso,
  eliminarCaso,
} from "../../services/case.service";
import { useAuth } from "../../context/useAuth";
import type { Case } from "../../types/case.types";

export const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [caso, setCaso] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCaso = async () => {
      if (!token || !id) return;

      try {
        setLoading(true);
        setError("");

        const data = await obtenerCaso(id, token);
        setCaso(data);
      } catch {
        setError("No se pudo obtener el caso");
      } finally {
        setLoading(false);
      }
    };

    cargarCaso();
  }, [id, token]);

  const handleDelete = async () => {
    if (!token || !id) return;

    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este caso?"
    );

    if (!confirmar) return;

    try {
      setDeleting(true);
      setError("");

      await eliminarCaso(id, token);

      navigate("/cases");
    } catch {
      setError("No se pudo eliminar el caso");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <p>Cargando caso...</p>;
  }

  if (error) {
    return (
      <main>
        <p>{error}</p>

        <button
          type="button"
          onClick={() => navigate("/cases")}
        >
          Volver
        </button>
      </main>
    );
  }

  if (!caso) {
    return <p>Caso no encontrado</p>;
  }

  return (
    <main>
      <h1>{caso.titulo}</h1>

      <p>{caso.descripcion}</p>

      <p>
        Estado: <strong>{caso.estado}</strong>
      </p>

      <p>Creado: {caso.createdAt}</p>
      <p>Actualizado: {caso.updatedAt}</p>

      <button
        type="button"
        onClick={() => navigate(`/cases/${caso.id}/edit`)}
      >
        Editar
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "Eliminando..." : "Eliminar"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/cases")}
        disabled={deleting}
      >
        Volver
      </button>
    </main>
  );
};

