import {
  Button,
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
    <Dialog maxWidth={"md"} open={props.open} onClose={props.handleClose}>
      <DialogTitle textAlign={"center"}>
        {ComponentsLabels.EGRESS_MODAL_TITLE}
      </DialogTitle>
      <DialogContent>
        {props.egressData && (
          <Grid container>
            <Grid item md={10} xs={10}>
              <Typography>
                <b>{ComponentsLabels.PARTNER}</b>
                {` ${props.egressData.beneficiary}`}
              </Typography>
            </Grid>
            <Grid item md={2} xs={2}>
              <Typography color={"red"} textAlign={"right"}>
                <b>{`Nº${props.egressData.number}`}</b>
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography>
                <b>{ComponentsLabels.DATE}</b>
                {` ${getFormattedDate(props.egressData.date)}`}
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
          <Grid border={"1px solid grey"} borderRadius={1} container p={1}>
            <Grid item md={7}>
              <Typography>
                <b>Detalles del Pago</b>
              </Typography>
            </Grid>
            <Grid item md={2} xs={9}>
              <Typography textAlign={"right"}>
                {ComponentsLabels.TYPE_CASH}:
              </Typography>
            </Grid>
            <Grid item md={3} xs={3}>
              <Typography textAlign={"right"}>
                ${egressDetail.billDetail.cash.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item md={9} xs={9}>
              <Typography textAlign={"right"}>
                {ComponentsLabels.TYPE_TRANSFER}:
              </Typography>
            </Grid>
            <Grid item md={3} xs={3}>
              <Typography textAlign={"right"}>
                ${egressDetail.billDetail.transfer.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item md={9} xs={9}>
              <Typography textAlign={"right"}>
                <b>{ComponentsLabels.TOTAL}</b>
              </Typography>
            </Grid>
            <Grid item md={3} xs={3}>
              <Typography textAlign={"right"}>
                ${props.egressData.amount.toFixed(2)}
              </Typography>
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
