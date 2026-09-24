import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "68px",
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          onClick={() => navigate("/dashboard")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            cursor: "pointer",
            flexGrow: 1,
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              backgroundColor: "primary.main",
            }}
          >
            <FolderOutlinedIcon />
          </Avatar>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Gestor de Evidencias
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Gestión de casos
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {user && (
            <Box
              sx={{
                display: { xs: "none", sm: "block" },
                textAlign: "right",
                mr: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                    fontWeight: 600,
                }}
                >
                Usuario
                </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {user.email}
              </Typography>
            </Box>
          )}

          <Tooltip title="Cerrar sesión">
            <IconButton
              onClick={handleLogout}
              color="primary"
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};