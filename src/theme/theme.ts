import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563eb",
    },

    secondary: {
      main: "#7c3aed",
    },

    success: {
      main: "#16a34a",
    },

    warning: {
      main: "#f59e0b",
    },

    error: {
      main: "#dc2626",
    },

    background: {
      default: "#f5f7fb",
      paper: "#ffffff",
    },

    text: {
      primary: "#172033",
      secondary: "#667085",
    },
  },

  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(16, 24, 40, 0.06)",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
});