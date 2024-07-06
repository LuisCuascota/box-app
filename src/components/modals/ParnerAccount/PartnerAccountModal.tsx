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
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { PartnerData } from "../../../store/interfaces/PartnerState.interfaces.ts";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import {
  ContributionProcessed,
  UsePartnerAccountModalState,
} from "./state/usePartnerAccountModalState.tsx";

export interface PartnerAccountModalProps {
  open: boolean;
  handleClose: () => void;
  partnerData?: PartnerData;
}
export const PartnerAccountModal = (props: PartnerAccountModalProps) => {
  const { contributions, isLoading, onCloseModal } =
    UsePartnerAccountModalState(props);

  return (
    <Dialog maxWidth={"xl"} open={props.open} onClose={onCloseModal}>
      <DialogTitle>
        <Grid container>
          <Grid item textAlign={"center"} md={10}>
            {ComponentsLabels.PARTNER_MODAL_ACCOUNT_TITLE}
          </Grid>
          <Grid item md={2}>
            <Typography color={"red"} textAlign={"right"}>
              <b>{`Nº${props.partnerData?.number}`}</b>
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography>
              <b>{"Nombres:"}</b>
              {` ${props.partnerData?.names} ${props.partnerData?.surnames}`}
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography>
              <b>{"Cedula:"}</b>
              {` ${props.partnerData?.dni}`}
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  {ComponentsLabels.TH_ACCOUNT_DATE}
                </TableCell>
                <TableCell align="left">
                  {ComponentsLabels.TH_ACCOUNT_DESCRIPTION}
                </TableCell>
                <TableCell align="center">
                  {ComponentsLabels.TH_ACCOUNT_VOUCHER}
                </TableCell>
                <TableCell align="center">
                  {ComponentsLabels.TH_ENTRY_VALUE}
                </TableCell>
                <TableCell align="center">
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
        <Grid container pl={2} pr={2} justifyContent={"space-between"}>
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
        </Grid>
      </DialogActions>
    </Dialog>
  );
};
