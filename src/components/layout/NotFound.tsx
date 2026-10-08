import { Box, Button, Card, Stack, Typography } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "background.default",
        px: 2,
        py: 4,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: {
            xs: 4,
            sm: 6,
          },
          border: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Stack spacing={3} sx={{alignItems: "center",
  }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "primary.main",
              color: "white",
            }}
          >
            <ErrorOutlineOutlinedIcon fontSize="large" />
          </Box>

          <Stack spacing={1}>
            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "4rem",
                  sm: "5rem",
                },
                lineHeight: 1,
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              404
            </Typography>

            <Typography variant="h4">
              Página no encontrada
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              La página que estás buscando no existe,
              fue movida o la dirección ingresada no es válida.
            </Typography>
          </Stack>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/dashboard")}
          >
            Volver al inicio
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};