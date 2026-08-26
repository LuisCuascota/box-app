import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { UseEntryLoanPanelResult } from "../state/useEntryLoanPanel.ts";
import { LoanPanelTable } from "./LoanPanelTable.tsx";
import { getFormattedDate } from "../../../../shared/utils/Date.utils.ts";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";

type LoanPanelProps = UseEntryLoanPanelResult;

export const LoanPanel = ({
  loanDefinition,
  loanDetail,
  selectedIds,
  summary,
  isPreCancelled,
  onToggleFee,
  onPreCancel,
  onClearSelection,
  onApply,
}: LoanPanelProps) => {
  const loan = loanDefinition!.loan;
  const paidCount = loanDetail.filter((d) => d.is_paid).length;
  const progress =
    loanDetail.length > 0 ? (paidCount / loanDetail.length) * 100 : 0;

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        {/* Header: número + stats inline */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" fontSize={12} fontWeight={700}>
            Crédito Nº{loan.number}
          </Typography>
          <Typography
            variant="caption"
            fontWeight={600}
            sx={(theme) => ({ color: theme.palette.warning.dark })}
          >
            Deuda: ${loan.debt}
          </Typography>
        </Box>

        {/* Stats compactas */}
        <Grid container spacing={0.5} mt={0.5}>
          <Grid size={3}>
            <Stat label="Monto" value={`$${loan.value}`} />
          </Grid>
          <Grid size={3}>
            <Stat label="Tasa" value={`${loan.rate}%`} />
          </Grid>
          <Grid size={3}>
            <Stat label="Plazo" value={`${loan.term}m`} />
          </Grid>
          <Grid size={3}>
            <Stat label="Fecha" value={getFormattedDate(loan.date)} />
          </Grid>
        </Grid>

        {/* Barra de progreso */}
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={(theme) => ({
              flex: 1,
              height: 5,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            })}
          />
          <Typography variant="caption" fontSize={10} fontWeight={600}>
            {paidCount}/{loanDetail.length}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Tabla */}
        <Box sx={{ maxHeight: 240, overflow: "auto" }}>
          <LoanPanelTable
            isLoading={loanDetail.length === 0}
            loanDetail={loanDetail}
            selectedIds={selectedIds}
            onToggleFee={onToggleFee}
          />
        </Box>

        {/* Resumen de selección */}
        {summary.count > 0 && (
          <Box
            sx={(theme) => ({
              mt: 1,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.secondary.main, 0.08),
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.25)}`,
            })}
          >
            <Box display="flex" justifyContent="space-between">
              <Typography
                variant="caption"
                fontSize={10}
                color="text.secondary"
              >
                {summary.count} cuota{summary.count > 1 ? "s" : ""} — Capital: $
                {summary.capital} | Interés: ${summary.interest}
                {summary.penalty > 0 ? ` | Multa: $${summary.penalty}` : ""}
              </Typography>
              <Typography variant="caption" fontSize={10} fontWeight={700}>
                ${summary.total}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Acciones */}
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Box display="flex" gap={0.5}>
            <Button
              onClick={onPreCancel}
              variant="outlined"
              size="small"
              disabled={isPreCancelled}
              sx={{ fontSize: 11, px: 1 }}
              endIcon={<CreditScoreIcon sx={{ fontSize: "14px !important" }} />}
            >
              Precancelar
            </Button>
            <Button
              onClick={onClearSelection}
              variant="outlined"
              color="inherit"
              size="small"
              sx={{ fontSize: 11, px: 1 }}
              endIcon={<ClearIcon sx={{ fontSize: "14px !important" }} />}
            >
              Limpiar
            </Button>
          </Box>
          <Button
            onClick={onApply}
            variant="contained"
            size="small"
            disabled={summary.count === 0}
            sx={{ fontSize: 11, px: 1.5 }}
            endIcon={<SaveIcon sx={{ fontSize: "14px !important" }} />}
          >
            Aplicar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography variant="caption" fontSize={9} color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontSize={11} fontWeight={600}>
      {value}
    </Typography>
  </Box>
);
