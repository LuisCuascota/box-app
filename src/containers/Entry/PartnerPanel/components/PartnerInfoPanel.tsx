import { alpha, Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import { PartnerDefinition } from "../../../../store/interfaces/EntryState.interfaces.ts";
import { getFormattedDate } from "../../../../shared/utils/Date.utils.ts";
import { AccountStatusEnum } from "../../../../shared/enums/LoanCalcTypeEnum.ts";
import PersonIcon from "@mui/icons-material/Person";

interface PartnerInfoPanelProps {
  partner: PartnerDefinition;
}

export const PartnerInfoPanel = ({ partner }: PartnerInfoPanelProps) => {
  const isOnTime = partner.savingStatus === AccountStatusEnum.OK;

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Box
            sx={(theme) => ({
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <PersonIcon sx={{ fontSize: 16, color: "primary.main" }} />
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle2" fontSize={12} fontWeight={700}>
              {partner.names} {partner.surnames}
            </Typography>
            <Typography variant="caption" fontSize={10} color="text.secondary">
              Cuenta Nº{partner.accountNumber}
            </Typography>
          </Box>
          <Chip
            label={isOnTime ? "Al día" : "Atrasado"}
            size="small"
            color={isOnTime ? "success" : "error"}
            sx={{ fontSize: 10, height: 20 }}
          />
        </Box>

        <Grid container spacing={1}>
          <Grid size={4}>
            <Stat label="Ahorro actual" value={`$${partner.currentSaving.toFixed(2)}`} />
          </Grid>
          <Grid size={4}>
            <Stat label="Pendientes" value={`${partner.pendingContributions}`} />
          </Grid>
          <Grid size={4}>
            <Stat label="Ingreso" value={getFormattedDate(partner.creationDate)} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <Box
    sx={(theme) => ({
      px: 1,
      py: 0.5,
      borderRadius: 1,
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    })}
  >
    <Typography variant="caption" fontSize={9} color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontSize={11} fontWeight={600}>
      {value}
    </Typography>
  </Box>
);
