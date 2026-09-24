import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

import { Navbar } from "./Navbar";

export const AppLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 3,
            md: 5,
          },
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};