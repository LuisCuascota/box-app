import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import {
  Loan,
  LoanDetail,
} from "../../../store/interfaces/LoanState.interfaces.ts";
import { getFormattedDate } from "../../../shared/utils/Date.utils.ts";
import { LoanTable } from "../../loan/loanTable/LoanTable.tsx";
import { useLoanModalState } from "./state/useLoanModalState.tsx";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import SaveIcon from "@mui/icons-material/Save";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { Print } from "@mui/icons-material";

export interface LoanModalProps {
  open: boolean;
  handleClose: () => void;
  viewMode?: boolean;
  loan?: Loan;
  loanDetail?: LoanDetail[];
}

export const LoanModal = (props: LoanModalProps) => {
  const {
    finalLoanDetail,
    onClose,
    onPayButton,
    onSave,
    onPreCancel,
    onPrintLoan,
    currentCapital,
  } = useLoanModalState(props);

  return (
    <Dialog maxWidth={"xl"} open={props.open} onClose={props.handleClose}>
      <DialogTitle textAlign={"center"}>
        {ComponentsLabels.LOAN_MODAL_TITLE}
      </DialogTitle>
      <DialogContent>
        {props.loan && (
          <Grid container spacing={0} pb={2}>
            <Grid item md={4} xs={12}>
              <Typography color={"red"}>
                <b>{`Nº${props.loan.number}`}</b>
              </Typography>
            </Grid>
            <Grid item md={4} xs={6}>
              <Typography>
                <b>{ComponentsLabels.AMOUNT}</b>
                {` $${props.loan.value}`}
              </Typography>
            </Grid>
            <Grid item md={4} xs={6}>
              <Typography>
                <b>{ComponentsLabels.INTEREST}</b>
                {` ${props.loan.rate}%`}
              </Typography>
            </Grid>
            <Grid item md={4} xs={6}>
              <Typography>
                <b>{ComponentsLabels.DATE}</b>
                {` ${getFormattedDate(props.loan.date)}`}
              </Typography>
            </Grid>
            <Grid item md={4} xs={6}>
              <Typography>
                <b>{ComponentsLabels.DEBT}</b>
                {` $${currentCapital}`}
              </Typography>
            </Grid>
            <Grid item md={4} xs={6}>
              <Typography>
                <b>{ComponentsLabels.MONTHS}</b>
                {` ${props.loan.term}`}
              </Typography>
            </Grid>
          </Grid>
        )}
        {finalLoanDetail && (
          <LoanTable
            loanDetail={finalLoanDetail}
            onPayButton={onPayButton}
            withActions={props.viewMode ? false : true}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Grid container spacing={0} pl={2} pr={2}>
          <Grid item xs={4}>
            <Button onClick={onClose} variant={"outlined"} color={"inherit"}>
              {ComponentsLabels.CLOSE}
            </Button>
          </Grid>
          <Grid item xs={8} display={"flex"} justifyContent={"end"}>
            {props.viewMode ? (
              <Button
                onClick={onPrintLoan}
                variant={"contained"}
                color={"primary"}
                endIcon={<Print />}
              >
                {ComponentsLabels.PRINT}
              </Button>
            ) : (
              <>
                <Box pr={1}>
                  <Button
                    onClick={onPreCancel}
                    variant={"contained"}
                    color={"success"}
                    endIcon={<CreditScoreIcon />}
                  >
                    {ComponentsLabels.PRE_CANCEL}
                  </Button>
                </Box>
                <Button
                  onClick={onSave}
                  variant={"contained"}
                  color={"primary"}
                  endIcon={<SaveIcon />}
                >
                  {ComponentsLabels.SAVE}
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};
