import {
  alpha,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { PartnerData } from "../../../store/interfaces/PartnerState.interfaces.ts";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { UsePartnerLoanListModalState } from "./state/usePartnerLoanListModalState.tsx";
import { getFormattedDate } from "../../../shared/utils/Date.utils.ts";
import { Loan } from "../../../store/interfaces/LoanState.interfaces.ts";
import { getLoanStatusTypeIcon } from "../../../shared/utils/Components.util.tsx";
import { LoanStatusEnum } from "../../../shared/enums/LoanCalcTypeEnum.ts";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";

export interface PartnerLoanListModalProps {
  open: boolean;
  handleClose: () => void;
  partnerData?: PartnerData;
}

export const PartnerLoanListModal = (props: PartnerLoanListModalProps) => {
  const { loanList, isLoading, onCloseModal } =
    UsePartnerLoanListModalState(props);
  const theme = useTheme();

  const getChipLabel = (status?: string) => {
    if (status)
      switch (status) {
        case LoanStatusEnum.FREE:
          return ComponentsLabels.FREE_LOAN;
        case LoanStatusEnum.DEBT:
          return ComponentsLabels.CURRENT_LOAN;
        case LoanStatusEnum.LATE:
          return ComponentsLabels.LATE_LOAN;
      }
  };

  const getChipColor = (status?: string) => {
    if (status)
      switch (status) {
        case LoanStatusEnum.FREE:
          return "info";
        case LoanStatusEnum.DEBT:
          return "success";
        case LoanStatusEnum.LATE:
          return "error";
      }
  };

  const getStatusPalette = (status?: string) => {
    const color = getChipColor(status);

    if (color === "success") return theme.palette.success;
    if (color === "error") return theme.palette.error;

    return theme.palette.info;
  };

  const getStatusIcon = (status?: string) => {
    if (status)
      switch (status) {
        case LoanStatusEnum.FREE:
          return <TaskAltIcon fontSize="small" />;
        case LoanStatusEnum.DEBT:
          return <PublishedWithChangesIcon fontSize="small" />;
        case LoanStatusEnum.LATE:
          return <ReportProblemRoundedIcon fontSize="small" />;
      }
  };

  return (
    <Dialog
      maxWidth={false}
      open={props.open}
      onClose={onCloseModal}
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          width: "900px",
          maxWidth: "96vw",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.primary.contrastText,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1.25,
        }}
      >
        {ComponentsLabels.PARTNER_MODAL_LOAN_TITLE}
        {props.partnerData && (
          <Chip
            size="small"
            label={`Socio Nº${props.partnerData.number}`}
            color="secondary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        )}
      </DialogTitle>
      <DialogContent>
        {props.partnerData && (
          <Grid container spacing={0.75} pt={1.5} pb={0.75}>
            <Grid size={8}>
              <Box
                sx={(theme) => ({
                  p: 0.75,
                  borderRadius: 1.5,
                  backgroundColor: "#fff",
                  border: `1px solid ${alpha(
                    theme.palette.primary.main,
                    0.35
                  )}`,
                })}
              >
                <Typography variant="caption" color="text.secondary">
                  Nombres
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {`${props.partnerData.names} ${props.partnerData.surnames}`}
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box
                sx={(theme) => ({
                  p: 0.75,
                  borderRadius: 1.5,
                  backgroundColor: "#fff",
                  border: `1px solid ${alpha(
                    theme.palette.primary.main,
                    0.35
                  )}`,
                })}
              >
                <Typography variant="caption" color="text.secondary">
                  Cédula
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {props.partnerData.dni}
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box
                sx={() => {
                  const palette = getStatusPalette(
                    props.partnerData?.loanStatus
                  );

                  return {
                    p: 0.75,
                    borderRadius: 1.5,
                    backgroundColor: alpha(palette.main, 0.12),
                    border: `1px solid ${alpha(palette.main, 0.45)}`,
                  };
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Estado
                </Typography>
                <Box
                  mt={0.25}
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  sx={{ minHeight: 20 }}
                >
                  <Box
                    sx={() => ({
                      color: getStatusPalette(props.partnerData?.loanStatus)
                        .main,
                      display: "flex",
                      alignItems: "center",
                    })}
                  >
                    {getStatusIcon(props.partnerData.loanStatus)}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: getStatusPalette(props.partnerData?.loanStatus)
                        .main,
                      lineHeight: 1.2,
                    }}
                  >
                    {getChipLabel(props.partnerData.loanStatus)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box
                sx={(theme) => ({
                  p: 0.75,
                  borderRadius: 1.5,
                  backgroundColor: "#fff",
                  border: `1px solid ${alpha(
                    theme.palette.primary.main,
                    0.35
                  )}`,
                })}
              >
                <Typography variant="caption" color="text.secondary">
                  Créditos realizados
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {loanList.length}
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box
                sx={(theme) => ({
                  p: 0.75,
                  borderRadius: 1.5,
                  backgroundColor: "#fff",
                  border: `1px solid ${alpha(
                    theme.palette.primary.main,
                    0.35
                  )}`,
                })}
              >
                <Typography variant="caption" color="text.secondary">
                  Desembolsado
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ${loanList.reduce((sum, loan) => loan.value + sum, 0)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box
                sx={(theme) => ({
                  p: 0.75,
                  borderRadius: 1.5,
                  backgroundColor: "#fff",
                  border: `1px solid ${alpha(
                    theme.palette.primary.main,
                    0.35
                  )}`,
                })}
              >
                <Typography variant="caption" color="text.secondary">
                  Pendiente
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  ${loanList.reduce((sum, loan) => loan.debt + sum, 0)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
        <TableContainer
          sx={(theme) => ({
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            overflow: "hidden",
          })}
        >
          <Table size="small">
            <TableHead>
              <TableRow
                sx={(theme) => ({
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                })}
              >
                <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>
                  {ComponentsLabels.TH_ACCOUNT_DATE}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, fontSize: 12 }}
                >
                  {ComponentsLabels.TH_STATUS}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>
                  {ComponentsLabels.TH_ENTRY_VALUE}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>
                  {ComponentsLabels.TH_DEBT}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Array(5)
                          .fill(0)
                          .map((_, colIndex) => (
                            <TableCell key={colIndex}>
                              <Skeleton animation="wave" />
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                : loanList.map((row: Loan, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{getFormattedDate(row.date)}</TableCell>
                      <TableCell align="center">
                        {getLoanStatusTypeIcon(row.status)}
                      </TableCell>
                      <TableCell>{row.value}</TableCell>
                      <TableCell>{row.debt}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%", px: 2, py: 1 }}
        >
          <Button onClick={onCloseModal} variant={"outlined"} color={"inherit"}>
            {ComponentsLabels.CLOSE}
          </Button>

          <Button
            variant={"contained"}
            color={"primary"}
            onClick={() => {}}
            disabled={true}
            endIcon={<LocalPrintshopIcon />}
          >
            {ComponentsLabels.PRINT}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
