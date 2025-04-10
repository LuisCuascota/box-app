import {
  Button,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { LoanUpdateLabels } from "../../../shared/labels/LoanUpdate.labels.ts";
import { LoanTable } from "../../../components/loan/loanTable/LoanTable.tsx";
import {
  LoanCalcTypeEnum,
  UpdateLoanType,
} from "../../../shared/enums/LoanCalcTypeEnum.ts";
import ListIcon from "@mui/icons-material/ListAlt";
import { LoanLabels } from "../../../shared/labels/Loan.labels.ts";
import SaveIcon from "@mui/icons-material/Save";
import {
  Loan,
  LoanDetail,
} from "../../../store/interfaces/LoanState.interfaces.ts";
import { useEffect, useState } from "react";
import { calculateFeeList } from "../../../shared/utils/Loan.utils.ts";
import moment from "moment";

interface UpdateLoanDetailProps {
  loan: Loan;
  loanDetail: LoanDetail[];
  onUpdateLoan: (updatedFees: LoanDetail[], payment: number) => void;
}

export const UpdateLoanDetail = ({
  loan,
  loanDetail,
  onUpdateLoan,
}: UpdateLoanDetailProps) => {
  const [disableCalc, setDisableCalc] = useState<boolean>(true);
  const [disableUpdate, setDisableUpdate] = useState<boolean>(true);
  const [amount, setAmount] = useState<number>(0);
  const [calcType, setCalcType] = useState<UpdateLoanType | null>(null);
  const [updatedFees, setUpdatedFees] = useState<LoanDetail[]>([]);

  const getFeeNumber = (pendingAmount: number): number => {
    if (calcType === UpdateLoanType.EQA_LF)
      return +((pendingAmount * loan.term) / loan.value).toFixed(0);

    return loanDetail.filter((detail) => !detail.is_paid).length;
  };

  const calculateNewLoan = () => {
    const pendingAmount = loan.debt - amount;
    const suggestedFeeCount = getFeeNumber(pendingAmount);
    const loanDetailCopy = JSON.parse(
      JSON.stringify(loanDetail)
    ) as LoanDetail[];
    let paidFees = loanDetailCopy.filter((detail) => detail.is_paid);
    const feeList = calculateFeeList(
      LoanCalcTypeEnum.VARIABLE_FEE,
      loan.number!,
      moment.utc(),
      pendingAmount,
      suggestedFeeCount,
      2,
      paidFees.length
    );

    paidFees[paidFees.length - 1].fee_value += amount;
    paidFees[paidFees.length - 1].fee_total += amount;
    paidFees[paidFees.length - 1].balance_after_pay -= amount;

    paidFees = paidFees.concat(feeList);

    const reduceFeeCount = loanDetailCopy.length - paidFees.length;
    const deletedFee =
      reduceFeeCount === 0
        ? []
        : loanDetailCopy.slice(-reduceFeeCount).map((detail) => ({
            ...detail,
            fee_value: 0,
            fee_total: 0,
            interest: 0,
            balance_after_pay: 0,
            is_paid: true,
          }));

    paidFees = paidFees.concat(deletedFee);

    setUpdatedFees(paidFees);
  };

  const handleUpdateLoan = () => {
    onUpdateLoan(updatedFees, amount);
  };

  useEffect(() => {
    if (amount > 0 && calcType) setDisableCalc(false);
    else setDisableCalc(true);
  }, [amount, calcType]);

  useEffect(() => {
    if (!disableCalc && updatedFees.length > 0) setDisableUpdate(false);
    else setDisableUpdate(true);
  }, [updatedFees, disableCalc]);

  return (
    <>
      <Divider>
        <Typography variant={"h6"}>{LoanUpdateLabels.SUB_TITLE_2}</Typography>
      </Divider>
      <Grid container p={2}>
        <Grid item md={1} display={"flex"} alignItems={"center"}>
          <Typography>{LoanUpdateLabels.AMOUNT}</Typography>
        </Grid>
        <Grid item md={3} display={"flex"} alignItems={"center"}>
          <TextField
            type={"number"}
            size={"small"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
          />
        </Grid>
        <Grid item md={1} display={"flex"} alignItems={"center"}>
          <Typography>{LoanUpdateLabels.CALC_TYPE}</Typography>
        </Grid>
        <Grid item md={3}>
          <RadioGroup
            row
            value={calcType}
            onChange={(e) => setCalcType(e.target.value as UpdateLoanType)}
          >
            <FormControlLabel
              value={UpdateLoanType.EQA_LF}
              control={<Radio size={"small"} />}
              label={LoanUpdateLabels.CALC_TYPE_1}
            />
            <FormControlLabel
              value={UpdateLoanType.LA_EQF}
              control={<Radio size={"small"} />}
              label={LoanUpdateLabels.CALC_TYPE_2}
            />
          </RadioGroup>
        </Grid>
        <Grid
          item
          md={4}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button
            endIcon={<ListIcon />}
            variant="outlined"
            onClick={calculateNewLoan}
            disabled={disableCalc}
          >
            {LoanLabels.CALCULATE}
          </Button>
          <Button
            endIcon={<SaveIcon />}
            variant="contained"
            disabled={disableUpdate}
            onClick={handleUpdateLoan}
          >
            {LoanLabels.SAVE}
          </Button>
        </Grid>
        <Grid item md={1} display={"flex"} alignItems={"center"}>
          <Typography>{LoanUpdateLabels.NEW_AMOUNT}</Typography>
        </Grid>
        <Grid item md={3} display={"flex"} alignItems={"center"}>
          <Typography>{`$${loan.debt - amount}`}</Typography>
        </Grid>
        {updatedFees.length > 0 && (
          <LoanTable
            isLoading={false}
            loanDetail={updatedFees}
            loanBottom={true}
          />
        )}
      </Grid>
    </>
  );
};
