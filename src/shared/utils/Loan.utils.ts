import { LoanDetail } from "../../store/interfaces/LoanState.interfaces.ts";
import { LoanCalcTypeEnum } from "../enums/LoanCalcTypeEnum.ts";
import { getFistSaturday } from "./Date.utils.ts";
import { Moment } from "moment";

export const calculateFeeList = (
  calcType: LoanCalcTypeEnum,
  loanId: number,
  paymentDate: Moment,
  amount: number,
  months: number,
  interest: number,
  initFeeNumber: number = 0
): LoanDetail[] => {
  const loanFeesCalc: LoanDetail[] = [];
  let feeValue = +(amount! / months!).toFixed(2);
  const interestValue = interest! / 100;
  let balance = amount!;
  let interestCalc = 0;

  if (calcType === LoanCalcTypeEnum.FIXED_FEE)
    interestCalc = amount! * interestValue;

  for (let value = 1; value <= months!; value++) {
    if (calcType === LoanCalcTypeEnum.VARIABLE_FEE) {
      interestCalc = balance * interestValue;
    }

    if (value === months) {
      feeValue = balance;
      balance = 0;
    } else balance -= feeValue;

    loanFeesCalc.push({
      balance_after_pay: +balance.toFixed(2),
      fee_number: value + initFeeNumber,
      fee_total: +(feeValue + interestCalc).toFixed(2),
      fee_value: +feeValue.toFixed(2),
      interest: +interestCalc.toFixed(2),
      is_paid: false,
      loan_number: loanId,
      payment_date: getFistSaturday(paymentDate),
    });
  }

  return loanFeesCalc;
};
