import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  obtenerCaso,
  eliminarCaso,
  obtenerUploadUrl,
  subirArchivo,
  completarArchivo,
  obtenerDownloadUrl,
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

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");

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

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setFileError("");
  };

  const handleUpload = async () => {
    if (!token || !id || !file) return;

    try {
      setUploading(true);
      setFileError("");

      const { uploadUrl, key } = await obtenerUploadUrl(
        id,
        {
          fileName: file.name,
          contentType: file.type,
        },
        token
      );

      await subirArchivo(uploadUrl, file);

      const casoActualizado = await completarArchivo(
        id,
        { key },
        token
      );

      setCaso(casoActualizado);
      setFile(null);
    } catch {
      setFileError("No se pudo subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!token || !id) return;

    try {
      setFileError("");

      const { downloadUrl } = await obtenerDownloadUrl(
        id,
        token
      );

      window.open(downloadUrl, "_blank");
    } catch {
      setFileError("No se pudo obtener el archivo");
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

      <hr />

      <h2>Archivo</h2>

      {caso.fileKey ? (
        <div>
          <p>Archivo adjunto ✓</p>

          <button
            type="button"
            onClick={handleDownload}
            disabled={uploading || deleting}
          >
            Abrir archivo
          </button>
        </div>
      ) : (
        <p>No hay archivo adjunto.</p>
      )}

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
        disabled={uploading || deleting}
      />

      {file && (
        <div>
          <p>Archivo seleccionado: {file.name}</p>

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Subiendo..." : "Subir archivo"}
          </button>
        </div>
      )}

      {fileError && <p>{fileError}</p>}

      <hr />

      <button
        type="button"
        onClick={() => navigate(`/cases/${caso.id}/edit`)}
        disabled={uploading || deleting}
      >
        Editar
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting || uploading}
      >
        {deleting ? "Eliminando..." : "Eliminar"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/cases")}
        disabled={deleting || uploading}
      >
        Volver
      </button>
    </main>
  );
};
