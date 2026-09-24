import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  obtenerCaso,
  actualizarCaso,
} from "../../services/case.service";
import { useAuth } from "../../context/useAuth";
import type { CaseStatus } from "../../types/case.types";

export const EditCase = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<CaseStatus>("OPEN");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCaso = async () => {
      if (!token || !id) return;

      try {
        const caso = await obtenerCaso(id, token);

        setTitulo(caso.titulo);
        setDescripcion(caso.descripcion);
        setEstado(caso.estado);
      } catch {
        setError("No se pudo cargar el caso");
      } finally {
        setLoading(false);
      }
    };

    cargarCaso();
  }, [id, token]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!token || !id) return;

    try {
      setSaving(true);
      setError("");

      await actualizarCaso(
        id,
        {
          titulo,
          descripcion,
          estado,
        },
        token
      );

      navigate(`/cases/${id}`);
    } catch {
      setError("No se pudo actualizar el caso");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Cargando caso...</p>;
  }

  return (
    <main>
      <h1>Editar caso</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Título</label>

          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="descripcion">Descripción</label>

          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(event) =>
              setDescripcion(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="estado">Estado</label>

          <select
            id="estado"
            value={estado}
            onChange={(event) =>
              setEstado(event.target.value as CaseStatus)
            }
          >
            <option value="OPEN">Abierto</option>
            <option value="CLOSED">Cerrado</option>
          </select>
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>

        <button
          type="button"
          onClick={() => navigate(`/cases/${id}`)}
          disabled={saving}
        >
          Cancelar
        </button>
      </form>
    </main>
  );
};