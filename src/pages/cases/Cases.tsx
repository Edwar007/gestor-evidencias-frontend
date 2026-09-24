import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

import { useAuth } from "../../context/useAuth";
import {
  eliminarCaso,
  listarCasos,
} from "../../services/case.service";
import type { Case } from "../../types/case.types";

export const Cases = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [casos, setCasos] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const cargarCasos = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const data = await listarCasos(token);
        setCasos(data);
      } catch {
        setError("No se pudieron cargar los casos.");
      } finally {
        setLoading(false);
      }
    };

    cargarCasos();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token) return;

    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este caso?"
    );

    if (!confirmar) return;

    try {
      setDeletingId(id);
      setError("");

      await eliminarCaso(id, token);

      setCasos((casosActuales) =>
        casosActuales.filter((caso) => caso.id !== id)
      );
    } catch {
      setError("No se pudo eliminar el caso.");
    } finally {
      setDeletingId(null);
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

  return (
    <Stack spacing={3}>
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
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Casos
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            Administra tus casos y evidencias.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/cases/new")}
        >
          Nuevo caso
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {casos.length === 0 ? (
        <Card>
          <CardContent>
            <Stack
              spacing={2}
              sx={{
                py: 6,
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <FolderOpenOutlinedIcon
                sx={{
                  fontSize: 64,
                  color: "text.secondary",
                }}
              />

              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  No tienes casos todavía
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Crea tu primer caso para comenzar a gestionar
                  evidencias.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/cases/new")}
              >
                Crear primer caso
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {casos.map((caso) => (
            <Card key={caso.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      md: "row",
                    },
                    gap: 2,
                    alignItems: {
                      xs: "stretch",
                      md: "center",
                    },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack spacing={1.2}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
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

                        {caso.fileKey && (
                          <Tooltip title="Tiene evidencia adjunta">
                            <AttachFileOutlinedIcon
                              fontSize="small"
                              color="action"
                            />
                          </Tooltip>
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {caso.descripcion}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Creado:{" "}
                        {new Date(
                          caso.createdAt
                        ).toLocaleDateString("es-CO")}
                      </Typography>
                    </Stack>
                  </Box>

                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: "row",
                      justifyContent: {
                        xs: "flex-end",
                        md: "initial",
                      },
                    }}
                  >
                    <Tooltip title="Ver caso">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(`/cases/${caso.id}`)
                        }
                      >
                        <VisibilityOutlinedIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Editar caso">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            `/cases/${caso.id}/edit`
                          )
                        }
                        disabled={deletingId === caso.id}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar caso">
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDelete(caso.id)
                        }
                        disabled={deletingId === caso.id}
                      >
                        {deletingId === caso.id ? (
                          <CircularProgress size={22} />
                        ) : (
                          <DeleteIcon  />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
};