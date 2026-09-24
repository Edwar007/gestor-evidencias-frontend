import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { useAuth } from "../../context/useAuth";
import { crearCaso } from "../../services/case.service";

export const CreateCase = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (!token) {
      setError("Tu sesión ha expirado. Inicia sesión nuevamente.");
      return;
    }

    try {
      setLoading(true);

      const caso = await crearCaso(
        {
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
        },
        token
      );

      navigate(`/cases/${caso.id}`);
    } catch {
      setError("No se pudo crear el caso. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/cases")}
          sx={{
            mb: 2,
          }}
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
          Nuevo caso
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          Registra un nuevo caso para gestionar sus evidencias.
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
                disabled={loading}
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
                disabled={loading}
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
                  onClick={() => navigate("/cases")}
                  disabled={loading}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    loading ? (
                      <CircularProgress
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <SaveOutlinedIcon />
                    )
                  }
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear caso"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};