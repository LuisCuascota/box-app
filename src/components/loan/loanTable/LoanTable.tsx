import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { PayButton } from "../payButton/PayButton";
import { LoanDetail } from "../../../store/interfaces/LoanState.interfaces.ts";
import { getFormattedDate } from "../../../shared/utils/Date.utils.ts";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { getLoanFeeIcon } from "../../../shared/utils/Components.util.tsx";

export interface LoanTableProps {
  isLoading: boolean;
  loanDetail: LoanDetail[];
  onPayButton?: (loanDetail: LoanDetail) => void;
  withActions?: boolean;
  withStatus?: boolean;
  loanBottom?: boolean;
}

export const LoanTable = (props: LoanTableProps) => {
  const calcFeeTotal = () =>
    props.loanDetail
      .reduce((sum, detail) => sum + detail.fee_value, 0)
      .toFixed(2);
  const calcInterestTotal = () =>
    props.loanDetail
      .reduce((sum, detail) => sum + detail.interest, 0)
      .toFixed(2);
  const calcTotal = () =>
    props.loanDetail
      .reduce((sum, detail) => sum + detail.fee_total, 0)
      .toFixed(2);

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
            {props.withStatus && (
              <TableCell align="center">{ComponentsLabels.TH_STATUS}</TableCell>
            )}
            {props.withActions && (
              <TableCell align="right">
                {ComponentsLabels.TH_LOAN_ACTION}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.isLoading ? (
            Array(5)
              .fill(0)
              .map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array(7)
                    .fill(0)
                    .map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton animation="wave" />
                      </TableCell>
                    ))}
                </TableRow>
              ))
          ) : (
            <>
              {props.loanDetail.map((loanDetail: LoanDetail) => (
                <TableRow key={loanDetail.fee_number}>
                  <TableCell align={"center"}>
                    {loanDetail.fee_number}
                  </TableCell>
                  <TableCell>
                    {getFormattedDate(loanDetail.payment_date)}
                  </TableCell>
                  <TableCell>{loanDetail.fee_value.toFixed(2)}</TableCell>
                  <TableCell>{loanDetail.interest.toFixed(2)}</TableCell>
                  <TableCell>{loanDetail.fee_total.toFixed(2)}</TableCell>
                  <TableCell>
                    {loanDetail.balance_after_pay.toFixed(2)}
                  </TableCell>
                  {props.withStatus && (
                    <TableCell align={"center"}>
                      {getLoanFeeIcon(loanDetail)}
                    </TableCell>
                  )}
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
              {props.loanBottom && (
                <TableRow>
                  <TableCell colSpan={1} />
                  <TableCell sx={{ fontWeight: "bolder" }}>TOTAL</TableCell>
                  <TableCell>{`$${calcFeeTotal()}`}</TableCell>
                  <TableCell>{`$${calcInterestTotal()}`}</TableCell>
                  <TableCell>{`$${calcTotal()}`}</TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
