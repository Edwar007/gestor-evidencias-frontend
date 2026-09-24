import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { ApiError } from "../../errors/api.error";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Completa el correo y la contraseña.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError(
          "No se pudo iniciar sesión. Verifica tu correo y contraseña."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 50%, #f8fafc 100%)",
        px: 2,
        py: 4,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: {
            xs: 3,
            sm: 5,
          },
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                backgroundColor: "primary.main",
                color: "white",
              }}
            >
              <FolderSharedOutlinedIcon fontSize="large" />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Bienvenido
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Inicia sesión en tu Gestor de Evidencias
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

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <Stack spacing={2.5}>
              <TextField
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                autoComplete="email"
                disabled={loading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                autoComplete="current-password"
                disabled={loading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  minHeight: 48,
                  mt: 1,
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              ¿No tienes una cuenta?{" "}
              <Typography
                component={Link}
                to="/register"
                variant="body2"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Crear cuenta
              </Typography>
            </Typography>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};