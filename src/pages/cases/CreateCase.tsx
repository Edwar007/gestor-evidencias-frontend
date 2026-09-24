import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { crearCaso } from "../../services/case.service";
import { useAuth } from "../../context/useAuth";

export const CreateCase = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) return;

    try {
      setLoading(true);
      setError("");

      await crearCaso(
        {
          titulo,
          descripcion,
        },
        token
      );

      navigate("/cases");
    } catch {
      setError("No se pudo crear el caso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Crear caso</h1>

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
            onChange={(event) => setDescripcion(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear caso"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/cases")}
          disabled={loading}
        >
          Cancelar
        </button>
      </form>
    </main>
  );
};