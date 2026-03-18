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
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { PartnerData } from "../../../store/interfaces/PartnerState.interfaces.ts";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import {
  ContributionProcessed,
  UsePartnerSavingListState,
} from "./state/usePartnerSavingListState.tsx";
import { getFormattedDate } from "../../../shared/utils/Date.utils.ts";
import { buildSavingCard } from "../../../shared/utils/BuildSavingCard.ts";
import { AccountStatusEnum } from "../../../shared/enums/LoanCalcTypeEnum.ts";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import PersonOffIcon from "@mui/icons-material/PersonOff";

export interface PartnerAccountModalProps {
  open: boolean;
  handleClose: () => void;
  partnerData?: PartnerData;
}
export const PartnerSavingListModal = (props: PartnerAccountModalProps) => {
  const { contributions, isLoading, onCloseModal } =
    UsePartnerSavingListState(props);

  const getSavingStatus = (partner?: PartnerData) => {
    if (partner?.is_disabled) {
      return {
        label: ComponentsLabels.ACCOUNT_DISABLED,
        color: "error",
        icon: <PersonOffIcon fontSize="small" />,
      };
    }

    if (partner?.savingStatus === AccountStatusEnum.LATE) {
      return {
        label: ComponentsLabels.ACCOUNT_LATE,
        color: "warning",
        icon: <ReportProblemRoundedIcon fontSize="small" />,
      };
    }

    return {
      label: ComponentsLabels.ACCOUNT_OK,
      color: "success",
      icon: <PriceCheckIcon fontSize="small" />,
    };
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
        {ComponentsLabels.PARTNER_MODAL_ACCOUNT_TITLE}
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
                  Fecha de creación
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {getFormattedDate(props.partnerData.creation_date)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box
                sx={(theme) => {
                  const status = getSavingStatus(props.partnerData);
                  const palette =
                    status.color === "success"
                      ? theme.palette.success
                      : status.color === "warning"
                        ? theme.palette.warning
                        : theme.palette.error;

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
                    sx={(theme) => {
                      const status = getSavingStatus(props.partnerData);
                      const palette =
                        status.color === "success"
                          ? theme.palette.success
                          : status.color === "warning"
                            ? theme.palette.warning
                            : theme.palette.error;

                      return {
                        display: "flex",
                        alignItems: "center",
                        color: palette.main,
                      };
                    }}
                  >
                    {getSavingStatus(props.partnerData).icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={(theme) => {
                      const status = getSavingStatus(props.partnerData);
                      const palette =
                        status.color === "success"
                          ? theme.palette.success
                          : status.color === "warning"
                            ? theme.palette.warning
                            : theme.palette.error;

                      return {
                        fontWeight: 700,
                        color: palette.main,
                        lineHeight: 1.2,
                      };
                    }}
                  >
                    {getSavingStatus(props.partnerData).label}
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
                  Ahorro actual
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  ${props.partnerData.current_saving}
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
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, fontSize: 12 }}
                >
                  {ComponentsLabels.TH_ACCOUNT_DATE}
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: 700, fontSize: 12 }}>
                  {ComponentsLabels.TH_ACCOUNT_DESCRIPTION}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, fontSize: 12 }}
                >
                  {ComponentsLabels.TH_ACCOUNT_VOUCHER}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, fontSize: 12 }}
                >
                  {ComponentsLabels.TH_ENTRY_VALUE}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, fontSize: 12 }}
                >
                  {ComponentsLabels.TH_ACCOUNT_TOTAL}
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
                : contributions.map(
                    (row: ContributionProcessed, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="center">{row.entryNumber}</TableCell>
                        <TableCell>{row.value}</TableCell>
                        <TableCell>{row.accumulate}</TableCell>
                      </TableRow>
                    )
                  )}
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
            onClick={() =>
              props.partnerData &&
              buildSavingCard(
                props.partnerData,
                contributions[contributions.length - 1]
              )
            }
            disabled={!props.partnerData}
            endIcon={<LocalPrintshopIcon />}
          >
            {ComponentsLabels.PRINT}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
