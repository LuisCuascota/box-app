import { Divider, Grid, Typography } from "@mui/material";
import { LoanUpdateLabels } from "../../../shared/labels/LoanUpdate.labels.ts";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { getFormattedDate } from "../../../shared/utils/Date.utils.ts";
import {
  Loan,
  LoanDetail,
} from "../../../store/interfaces/LoanState.interfaces.ts";
import { LoanTable } from "../../../components/loan/loanTable/LoanTable.tsx";

interface UpdateLoanHeadProps {
  loan: Loan;
  loanDetail: LoanDetail[];
}

export const UpdateLoanHead = (props: UpdateLoanHeadProps) => {
  return (
    <Grid container p={2}>
      <Grid item md={12}>
        <Typography textAlign={"center"} variant={"h6"}>
          <b> {LoanUpdateLabels.TITLE}</b>
        </Typography>
      </Grid>
      <Grid item md={8}>
        <Typography color={"red"}>
          <b>{`Nº${props.loan.number}`}</b>
        </Typography>
      </Grid>
      <Grid item md={2}>
        <Typography>
          <b>{LoanUpdateLabels.INTEREST}</b>
          {` ${props.loan.rate}%`}
        </Typography>
      </Grid>
      <Grid item md={2}>
        <Typography>
          <b>{ComponentsLabels.DATE}</b>
          {` ${getFormattedDate(props.loan.date)}`}
        </Typography>
      </Grid>
      <Grid item md={6}>
        <Typography>
          <b>{LoanUpdateLabels.DEBTOR}</b>
          {` ${props.loan.names} ${props.loan.surnames}`}
        </Typography>
      </Grid>
      <Grid item md={2}>
        <Typography>
          <b>{LoanUpdateLabels.AMOUNT}</b>
          {` $${props.loan.value}`}
        </Typography>
      </Grid>
      <Grid item md={2}>
        <Typography>
          <b>{LoanUpdateLabels.MONTHS}</b>
          {` ${props.loan.term}`}
        </Typography>
      </Grid>
      <Grid item md={2}>
        <Typography>
          <b>{LoanUpdateLabels.DEBT}</b>
          {` $${props.loan.debt}`}
        </Typography>
      </Grid>
      <Grid item md={12}>
        <Divider>
          <Typography variant={"h6"}>{LoanUpdateLabels.SUB_TITLE_1}</Typography>
        </Divider>
        <LoanTable
          isLoading={false}
          loanDetail={props.loanDetail}
          loanBottom={true}
          withStatus={true}
        />
      </Grid>
    </Grid>
  );
};
