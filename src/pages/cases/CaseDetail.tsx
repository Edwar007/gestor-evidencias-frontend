import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import { useAuth } from "../../context/useAuth";
import { ApiError } from "../../errors/api.error";

import type { Case } from "../../types/case.types";

import {
  obtenerCaso,
  eliminarCaso,
  obtenerUploadUrl,
  subirArchivo,
  completarArchivo,
  obtenerDownloadUrl,
} from "../../services/case.service";

export const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [caso, setCaso] = useState<Case | null>(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [file, setFile] = useState<File | null>(null);

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
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("No se pudo obtener el caso.");
        }
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
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("No se pudo eliminar el caso.");
      }
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
    } catch (error) {
      if (error instanceof ApiError) {
        setFileError(error.message);
      } else {
        setFileError("No se pudo subir el archivo.");
      }
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
    } catch (error) {
      if (error instanceof ApiError) {
        setFileError(error.message);
      } else {
        setFileError("No se pudo obtener el archivo.");
      }
    }
  };

  const getStatusLabel = (estado: Case["estado"]) => {
    return estado === "OPEN" ? "Abierto" : "Cerrado";
  };

  const getStatusColor = (
    estado: Case["estado"]
  ): "success" | "default" => {
    return estado === "OPEN" ? "success" : "default";
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !caso) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">
          {error || "Caso no encontrado."}
        </Alert>

        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/cases")}
          >
            Volver a casos
          </Button>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/cases")}
          sx={{ mb: 2 }}
        >
          Volver a casos
        </Button>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          Detalle del caso
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          Consulta la información y administra la evidencia.
        </Typography>
      </Box>

      <Card>
        <CardContent
          sx={{
            p: {
              xs: 3,
              sm: 4,
            },
          }}
        >
          <Stack spacing={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    wordBreak: "break-word",
                  }}
                >
                  {caso.titulo}
                </Typography>

                <Chip
                  label={getStatusLabel(caso.estado)}
                  color={getStatusColor(caso.estado)}
                  size="small"
                />
              </Box>

              <Stack
                spacing={1}
                sx={{
                  flexDirection: "row",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() =>
                    navigate(`/cases/${caso.id}/edit`)
                  }
                  disabled={deleting || uploading}
                >
                  Editar
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  disabled={deleting || uploading}
                >
                  {deleting ? "Eliminando..." : "Eliminar"}
                </Button>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Descripción
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {caso.descripcion}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Fecha de creación
                </Typography>

                <Typography variant="body2">
                  {new Date(
                    caso.createdAt
                  ).toLocaleString("es-CO")}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Última actualización
                </Typography>

                <Typography variant="body2">
                  {new Date(
                    caso.updatedAt
                  ).toLocaleString("es-CO")}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent
          sx={{
            p: {
              xs: 3,
              sm: 4,
            },
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Stack
                spacing={1}
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <AttachFileOutlinedIcon color="primary" />

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  Evidencia
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Adjunta una imagen JPG, PNG o un documento PDF.
              </Typography>
            </Box>

            {caso.fileKey ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  alignItems: {
                    xs: "stretch",
                    sm: "center",
                  },
                  justifyContent: "space-between",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.default",
                }}
              >
                <Stack
                  spacing={1}
                  sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >
                  <InsertDriveFileOutlinedIcon color="action" />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      Evidencia adjunta
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      El archivo está almacenado de forma privada.
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="outlined"
                  startIcon={<OpenInNewOutlinedIcon />}
                  onClick={handleDownload}
                  disabled={uploading}
                >
                  Abrir archivo
                </Button>
              </Box>
            ) : (
              <Alert severity="info">
                Este caso todavía no tiene una evidencia adjunta.
              </Alert>
            )}

            <Divider />

            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadOutlinedIcon />}
                disabled={uploading || deleting}
              >
                Seleccionar archivo

                <input
                  hidden
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
              </Button>

              {file && (
                <Stack
                  spacing={2}
                  sx={{
                    mt: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "background.default",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600 }}
                    >
                      {file.name}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={
                      uploading ? (
                        <CircularProgress
                          size={18}
                          color="inherit"
                        />
                      ) : (
                        <CloudUploadOutlinedIcon />
                      )
                    }
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading
                      ? "Subiendo..."
                      : caso.fileKey
                        ? "Reemplazar evidencia"
                        : "Subir evidencia"}
                  </Button>
                </Stack>
              )}

              {fileError && (
                <Alert
                  severity="error"
                  sx={{ mt: 2 }}
                  onClose={() => setFileError("")}
                >
                  {fileError}
                </Alert>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};