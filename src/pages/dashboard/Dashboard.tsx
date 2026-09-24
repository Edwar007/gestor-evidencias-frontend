import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useAuth } from "../../context/useAuth";
import { listarCasos } from "../../services/case.service";
import type { Case } from "../../types/case.types";
import { ApiError } from "../../errors/api.error";

export const Dashboard = () => {
  const { user, token } = useAuth();
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
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("No se pudieron cargar los casos.");
        }
      } finally {
        setLoading(false);
      }
    };

    cargarCasos();
  }, [token]);

  const estadisticas = useMemo(() => {
    const abiertos = casos.filter(
      (caso) => caso.estado === "OPEN"
    ).length;

    const cerrados = casos.filter(
      (caso) => caso.estado === "CLOSED"
    ).length;

    const conArchivo = casos.filter(
      (caso) => caso.fileKey
    ).length;

    return {
      total: casos.length,
      abiertos,
      cerrados,
      conArchivo,
    };
  }, [casos]);

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
    <Stack spacing={4}>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Hola, {user?.email}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          Aquí tienes un resumen de tus casos y evidencias.
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "primary.50",
                    color: "primary.main",
                  }}
                >
                  <FolderOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Total de casos
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700 }}
                  >
                    {estadisticas.total}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "success.50",
                    color: "success.main",
                  }}
                >
                  <FolderOpenOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Casos abiertos
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700 }}
                  >
                    {estadisticas.abiertos}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "warning.50",
                    color: "warning.main",
                  }}
                >
                  <CheckCircleIcon />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Casos cerrados
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700 }}
                  >
                    {estadisticas.cerrados}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "secondary.50",
                    color: "secondary.main",
                  }}
                >
                  <AttachFileOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Con evidencia
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700 }}
                  >
                    {estadisticas.conArchivo}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack
            spacing={2}
            sx={{
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                Gestiona tus casos
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Crea nuevos casos o consulta las evidencias existentes.
              </Typography>
            </Box>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
            >
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/cases")}
              >
                Ver casos
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/cases/new")}
              >
                Nuevo caso
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};