import { Box, Container, Paper } from "@mui/material";
import { FC, ReactNode } from "react";

interface PaperBaseProps {
  children: ReactNode;
}

export const PaperBase: FC<PaperBaseProps> = ({ children }) => {
  return (
    <Container fixed sx={{ mt: 2 }}>
      <Paper
        elevation={0}
        sx={(theme) => ({
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
        })}
      >
        <Box m={2}>{children}</Box>
      </Paper>
    </Container>
  );
};
