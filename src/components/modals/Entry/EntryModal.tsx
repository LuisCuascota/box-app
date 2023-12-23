import {
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
import { useEntryModalState } from "./state/useEntryModalState";
import { getFormattedDate } from "../../../shared/utils/Date.utils.ts";
import {
  EntryDetail,
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
            <Grid item md={7}>
              <Typography>
                <b>{ComponentsLabels.PARTNER}</b>
                {` ${props.entryData.names} ${props.entryData.surnames}`}
              </Typography>
            </Grid>
            <Grid item md={3}>
              <Typography>
                <b>{ComponentsLabels.DATE}</b>
                {` ${getFormattedDate(props.entryData.date)}`}
              </Typography>
            </Grid>
            <Grid item md={2}>
              <Typography color={"red"} textAlign={"right"}>
                <b>{`Nº${props.entryData.number}`}</b>
              </Typography>
            </Grid>
            <Grid item md={7} display={"flex"}>
              <Typography>
                <b>{ComponentsLabels.TYPE}</b>
              </Typography>
              <Chip
                sx={{ marginLeft: 1 }}
                size="small"
                label={
                  props.entryData.is_transfer
                    ? ComponentsLabels.TYPE_TRANSFER
                    : ComponentsLabels.TYPE_CASH
                }
                color={props.entryData.is_transfer ? "warning" : "success"}
              />
            </Grid>
            <Grid item md={5}>
              <Typography>
                <b>{ComponentsLabels.AMOUNT}</b>
                {` $${props.entryData.amount}`}
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
                : entryDetail.map((row: EntryDetail, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.value ? row.value : 0}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
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
