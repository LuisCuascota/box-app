import { EntryHeader } from "./Header/EntryHeader.tsx";
import { EntryContextProvider } from "./EntryContext.tsx";
import { EntryDetail } from "./Detail/EntryDetail.tsx";
import { EntryFooter } from "./Footer/EntryFooter.tsx";
import { EntryPartnerPanel } from "./PartnerPanel/EntryPartnerPanel.tsx";
import { Box, Container, Grid, Paper } from "@mui/material";

export const EntryContainer = () => {
  return (
    <Container fixed sx={{ mt: 2 }}>
      <Paper
        elevation={0}
        sx={(theme) => ({
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
          overflow: "hidden",
        })}
      >
        <EntryContextProvider>
          <EntryHeader />
          <Box p={2} pb={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 7 }}>
                <EntryDetail />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <EntryPartnerPanel />
              </Grid>
            </Grid>
          </Box>
          <EntryFooter />
        </EntryContextProvider>
      </Paper>
    </Container>
  );
};
