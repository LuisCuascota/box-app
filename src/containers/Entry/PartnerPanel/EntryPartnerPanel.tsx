import {
  alpha,
  Box,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
} from "@mui/material";
import { useContext } from "react";
import { EntryContext } from "../EntryContext.tsx";

export const EntryPartnerPanel = () => {
  const { partnerSelected } = useContext(EntryContext);

  if (!partnerSelected) {
    return (
      <Box
        sx={(theme) => ({
          height: "100%",
          minHeight: 300,
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.palette.text.secondary,
          fontSize: 13,
        })}
      >
        Seleccione un socio para ver su información
      </Box>
    );
  }

  return (
    <Stack spacing={1.5}>
      <Card variant="outlined">
        <CardHeader
          title="Últimos aportes"
          titleTypographyProps={{ variant: "subtitle2", fontSize: 13 }}
          sx={{ pb: 0, pt: 1.5, px: 2 }}
        />
        <CardContent sx={{ pt: 1 }}>
          <Skeleton
            variant="rectangular"
            height={100}
            sx={{ borderRadius: 1 }}
          />
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardHeader
          title="Estado de crédito"
          titleTypographyProps={{ variant: "subtitle2", fontSize: 13 }}
          sx={{ pb: 0, pt: 1.5, px: 2 }}
        />
        <CardContent sx={{ pt: 1 }}>
          <Skeleton
            variant="rectangular"
            height={60}
            sx={{ borderRadius: 1 }}
          />
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardHeader
          title="Tabla de amortización"
          titleTypographyProps={{ variant: "subtitle2", fontSize: 13 }}
          sx={{ pb: 0, pt: 1.5, px: 2 }}
        />
        <CardContent sx={{ pt: 1 }}>
          <Skeleton
            variant="rectangular"
            height={120}
            sx={{ borderRadius: 1 }}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};
