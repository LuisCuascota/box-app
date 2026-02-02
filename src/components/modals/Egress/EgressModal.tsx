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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEgressModalState } from "./state/useEgressModalState.tsx";
import { getFormattedDate } from "../../../shared/utils/Date.utils.ts";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import {
  EgressAmountDetail,
  EgressHeader,
} from "../../../store/interfaces/EgressState.interfaces.ts";

export interface EgressModalProps {
  open: boolean;
  handleClose: () => void;
  egressData?: EgressHeader;
}

export const EgressModal = (props: EgressModalProps) => {
  const { isLoading, egressDetail, handleBuildDoc } =
    useEgressModalState(props);

  return (
    <Dialog
      maxWidth={false}
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          width: "820px",
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
        {ComponentsLabels.EGRESS_MODAL_TITLE}
        {props.egressData && (
          <Chip
            size="small"
            label={`Egreso Nº${props.egressData.number}`}
            color="secondary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        )}
      </DialogTitle>
      <DialogContent>
        {props.egressData && (
          <Grid container spacing={0.75} pt={1.5} pb={0.75}>
            <Grid size={7}>
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
                  {ComponentsLabels.PARTNER}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {props.egressData.beneficiary}
                </Typography>
              </Box>
            </Grid>
            <Grid size={5}>
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
                  {ComponentsLabels.DATE}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {getFormattedDate(props.egressData.date)}
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
                <TableCell align="left" sx={{ fontWeight: 700, fontSize: 12 }}>
                  {ComponentsLabels.TH_ENTRY_TYPE}
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: 700, fontSize: 12 }}>
                  {ComponentsLabels.TH_ENTRY_VALUE}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array(2)
                    .fill(0)
                    .map((_, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Array(2)
                          .fill(0)
                          .map((_, colIndex) => (
                            <TableCell key={colIndex}>
                              <Skeleton animation="wave" />
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                  : egressDetail.amountDetail.map(
                      (row: EgressAmountDetail, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{row.description}</TableCell>
                          <TableCell>{row.value ? row.value : 0}</TableCell>
                        </TableRow>
                      )
                    )}
            </TableBody>
          </Table>
        </TableContainer>
        {props.egressData && (
          <Grid
            container
            p={1}
            mt={1}
            sx={(theme) => ({
              borderRadius: 1.5,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
              backgroundColor: "#fff",
            })}
          >
            <Grid size={6}>
              <Typography sx={{ fontWeight: 700 }}>
                Detalles del Pago
              </Typography>
            </Grid>
            <Grid size={6}>
              <Stack spacing={0}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {ComponentsLabels.TYPE_CASH}:
                  </Typography>
                  <Typography variant="body2">
                    ${egressDetail.billDetail.cash.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {ComponentsLabels.TYPE_TRANSFER}:
                  </Typography>
                  <Typography variant="body2">
                    ${egressDetail.billDetail.transfer.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    <b>{ComponentsLabels.TOTAL}</b>
                  </Typography>
                  <Typography textAlign={"right"}>
                    ${props.egressData.amount.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%", px: 2, py: 1 }}
        >
          <Button
            onClick={props.handleClose}
            variant={"outlined"}
            color={"inherit"}
          >
            {ComponentsLabels.CLOSE}
          </Button>
          <Button
            variant={"contained"}
            color={"primary"}
            disabled={isLoading}
            onClick={handleBuildDoc}
            endIcon={<LocalPrintshopIcon />}
          >
            {ComponentsLabels.PRINT}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
