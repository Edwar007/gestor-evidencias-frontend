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
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password || !confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      await register({
        email: email.trim(),
        password,
      });

      navigate("/login");
    } catch {
      setError(
        "No se pudo crear la cuenta. Verifica los datos e inténtalo nuevamente."
      );
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
                backgroundColor: "secondary.main",
                color: "white",
              }}
            >
              <PersonAddOutlinedIcon fontSize="large" />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Crear cuenta
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Regístrate para gestionar tus evidencias
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
                autoComplete="new-password"
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

              <TextField
                label="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError("");
                }}
                autoComplete="new-password"
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
                color="secondary"
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
                  "Crear cuenta"
                )}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              ¿Ya tienes una cuenta?{" "}
              <Typography
                component={Link}
                to="/login"
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
                Iniciar sesión
              </Typography>
            </Typography>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};