import {
  Button,
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
import { useEntryModalState } from "./state/useEntryModalState";
import { getFormattedDate } from "../../../shared/utils/Date.utils.ts";
import {
  EntryAmountDetail,
  EntryHeader,
} from "../../../store/interfaces/EntryState.interfaces.ts";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";

export interface EntryModalProps {
  open: boolean;
  handleClose: () => void;
  entryData?: EntryHeader;
}

export const EntryModal = (props: EntryModalProps) => {
  const { isLoading, entryDetail, handleBuildDoc } = useEntryModalState(props);

  return (
    <Dialog maxWidth={"md"} open={props.open} onClose={props.handleClose}>
      <DialogTitle
        textAlign={"center"}
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.primary.contrastText,
        }}
      >
        {ComponentsLabels.ENTRY_MODAL_TITLE}
      </DialogTitle>
      <DialogContent>
        {props.entryData && (
          <Grid container pt={2}>
            <Grid item md={10} xs={10}>
              <Typography>
                <b>{ComponentsLabels.PARTNER}</b>
                {` ${props.entryData.names} ${props.entryData.surnames}`}
              </Typography>
            </Grid>
            <Grid item md={2} xs={2}>
              <Typography color={"red"} textAlign={"right"}>
                <b>{`Nº${props.entryData.number}`}</b>
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography>
                <b>{ComponentsLabels.DATE}</b>
                {` ${getFormattedDate(props.entryData.date)}`}
              </Typography>
            </Grid>
          </Grid>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  {ComponentsLabels.TH_ENTRY_TYPE}
                </TableCell>
                <TableCell align="left">
                  {ComponentsLabels.TH_ENTRY_VALUE}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array(11)
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
                : entryDetail.amountDetail.map(
                    (row: EntryAmountDetail, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.value ? row.value : 0}</TableCell>
                      </TableRow>
                    )
                  )}
            </TableBody>
          </Table>
        </TableContainer>
        {props.entryData && (
          <Grid border={"1px solid grey"} borderRadius={1} container p={1}>
            <Grid item md={6}>
              <Typography>
                <b>Detalles del Pago</b>
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {ComponentsLabels.TYPE_CASH}:
                </Typography>
                <Typography variant="body2">
                  ${entryDetail.billDetail.cash.toFixed(2)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {ComponentsLabels.TYPE_TRANSFER}:
                </Typography>
                <Typography variant="body2">
                  ${entryDetail.billDetail.transfer.toFixed(2)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  <b>{ComponentsLabels.TOTAL}</b>
                </Typography>
                <Typography textAlign={"right"}>
                  ${props.entryData.amount.toFixed(2)}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        )}
        {entryDetail.entryLoanDetail && (
          <Grid
            border={"1px solid grey"}
            marginTop={1}
            borderRadius={1}
            container
            p={1}
          >
            <Grid item md={6}>
              <Typography>
                <b>Detalles del Crédito</b>
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Stack spacing={0}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Monto original:
                  </Typography>
                  <Typography variant="body2">
                    {`$${entryDetail.entryLoanDetail.value}`}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Cuota:
                  </Typography>
                  <Typography variant="body2">
                    {`${entryDetail.entryLoanDetail.fee_number}/${entryDetail.entryLoanDetail.term}`}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Cuota + Interés:
                  </Typography>
                  <Typography variant="body2">
                    {`$${entryDetail.entryLoanDetail.fee_total}`}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Capital restante:
                  </Typography>
                  <Typography variant="body2">
                    {`$${entryDetail.entryLoanDetail.balance_after_pay}`}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Grid container pl={2} pr={2} justifyContent={"space-between"}>
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
        </Grid>
      </DialogActions>
    </Dialog>
  );
};
