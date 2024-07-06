import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import { PayButton } from "../payButton/PayButton";
import { LoanDetail } from "../../../store/interfaces/LoanState.interfaces.ts";
import { getFormattedDate } from "../../../shared/utils/Date.utils.ts";
import { ColorsEnum } from "../../../shared/enums/Colors.enum.ts";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";

export interface LoanTableProps {
  loanDetail: LoanDetail[];
  onPayButton?: (loanDetail: LoanDetail) => void;
  withActions?: boolean;
}

export const LoanTable = (props: LoanTableProps) => {
  const getRowStyle = (loanDetail: LoanDetail) => {
    if (loanDetail.is_paid)
      return { backgroundColor: ColorsEnum.SUCCESS_LIGHT };

    if (
      !loanDetail.is_paid &&
      moment.utc().isSameOrAfter(loanDetail.payment_date, "month") &&
      moment.utc().isAfter(loanDetail.payment_date, "day")
    ) {
      return { backgroundColor: ColorsEnum.ERROR_LIGHT };
    }
    if (
      !loanDetail.is_paid &&
      moment.utc().isSame(loanDetail.payment_date, "month")
    )
      return { backgroundColor: ColorsEnum.PRIMARY_LIGHT };
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">{ComponentsLabels.TH_LOAN_FEE}</TableCell>
            <TableCell align="left">{ComponentsLabels.TH_LOAN_DATE}</TableCell>
            <TableCell align="left">
              {ComponentsLabels.TH_LOAN_FEE_VALUE}
            </TableCell>
            <TableCell align="left">
              {ComponentsLabels.TH_LOAN_INTEREST}
            </TableCell>
            <TableCell align="left">{ComponentsLabels.TH_LOAN_TOTAL}</TableCell>
            <TableCell align="left">
              {ComponentsLabels.TH_LOAN_BALANCE}
            </TableCell>
            {props.withActions && (
              <TableCell align="right">
                {ComponentsLabels.TH_LOAN_ACTION}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        {props.loanDetail && (
          <TableBody>
            {props.loanDetail.map((loanDetail: LoanDetail) => (
              <TableRow
                key={loanDetail.fee_number}
                style={getRowStyle(loanDetail)}
              >
                <TableCell align={"center"}>{loanDetail.fee_number}</TableCell>
                <TableCell>
                  {getFormattedDate(loanDetail.payment_date)}
                </TableCell>
                <TableCell>{loanDetail.fee_value}</TableCell>
                <TableCell>{loanDetail.interest}</TableCell>
                <TableCell>{loanDetail.fee_total}</TableCell>
                <TableCell>{loanDetail.balance_after_pay}</TableCell>
                {props.withActions && (
                  <TableCell>
                    {!loanDetail.is_paid && props.onPayButton && (
                      <PayButton
                        loanDetail={loanDetail}
                        onPayAction={props.onPayButton}
                      />
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};
