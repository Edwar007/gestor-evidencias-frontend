import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { useAuth } from "../../context/useAuth";

import {
  obtenerCaso,
  actualizarCaso,
} from "../../services/case.service";

import type { CaseStatus } from "../../types/case.types";

import { ApiError } from "../../errors/api.error";

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
        setLoading(true);
        setError("");

        const caso = await obtenerCaso(id, token);

        setTitulo(caso.titulo);
        setDescripcion(caso.descripcion);
        setEstado(caso.estado);
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

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (!titulo.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    if (!descripcion.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    if (!token || !id) {
      setError(
        "Tu sesión ha expirado. Inicia sesión nuevamente."
      );
      return;
    }

    try {
      setSaving(true);

      await actualizarCaso(
        id,
        {
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          estado,
        },
        token
      );

      navigate(`/cases/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError(
          "No se pudo actualizar el caso. Inténtalo nuevamente."
        );
      }
    } finally {
      setSaving(false);
    }
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
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/cases/${id}`)}
          sx={{ mb: 2 }}
        >
          Volver al caso
        </Button>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          Editar caso
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          Actualiza la información del caso.
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
          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <Stack spacing={3}>
              {error && (
                <Alert
                  severity="error"
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              <TextField
                label="Título"
                value={titulo}
                onChange={(event) => {
                  setTitulo(event.target.value);
                  setError("");
                }}
                disabled={saving}
                required
                slotProps={{
                  htmlInput: {
                    maxLength: 150,
                  },
                }}
                helperText={`${titulo.length}/150`}
              />

              <TextField
                label="Descripción"
                value={descripcion}
                onChange={(event) => {
                  setDescripcion(event.target.value);
                  setError("");
                }}
                disabled={saving}
                required
                multiline
                minRows={6}
                slotProps={{
                  htmlInput: {
                    maxLength: 1000,
                  },
                }}
                helperText={`${descripcion.length}/1000`}
              />

              <TextField
                select
                label="Estado"
                value={estado}
                onChange={(event) => {
                  setEstado(
                    event.target.value as CaseStatus
                  );
                  setError("");
                }}
                disabled={saving}
              >
                <MenuItem value="OPEN">
                  Abierto
                </MenuItem>

                <MenuItem value="CLOSED">
                  Cerrado
                </MenuItem>
              </TextField>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column-reverse",
                    sm: "row",
                  },
                  justifyContent: "flex-end",
                  gap: 1.5,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate(`/cases/${id}`)
                  }
                  disabled={saving}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    saving ? (
                      <CircularProgress
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <SaveOutlinedIcon />
                    )
                  }
                  disabled={saving}
                >
                  {saving
                    ? "Guardando..."
                    : "Guardar cambios"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};