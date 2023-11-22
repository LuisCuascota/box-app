import { Box, Container, Paper } from "@mui/material";
import { FC, ReactNode } from "react";

interface PaperBaseProps {
  children: ReactNode;
}

export const PaperBase: FC<PaperBaseProps> = ({ children }) => {
  return (
    <Container fixed>
      <Paper elevation={2}>
        <Box m={2}>{children}</Box>
      </Paper>
    </Container>
  );
};
