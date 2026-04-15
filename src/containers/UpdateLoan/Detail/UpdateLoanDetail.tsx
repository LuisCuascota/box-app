import {
  alpha,
  Box,
  Button,
  Divider,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
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
import { useState } from "react";
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
  const [amount, setAmount] = useState<number>(0);
  const [calcType, setCalcType] = useState<UpdateLoanType | null>(null);
  const [updatedFees, setUpdatedFees] = useState<LoanDetail[]>([]);
  const disableCalc = amount <= 0 || !calcType;
  const disableUpdate = disableCalc || updatedFees.length === 0;

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

  return (
    <>
      <Divider>
        <Typography variant={"h6"}>{LoanUpdateLabels.SUB_TITLE_2}</Typography>
      </Divider>
      <Box
        sx={(theme) => ({
          p: 1,
          borderRadius: 1.5,
          backgroundColor: "#fff",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
          mb: 1,
        })}
      >
        <Grid container spacing={1} alignItems="flex-end">
          <Grid size={3}>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Typography variant="caption" color="text.secondary">
                {LoanUpdateLabels.AMOUNT}
              </Typography>
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
            </Box>
          </Grid>
          <Grid size={6}>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Typography variant="caption" color="text.secondary">
                {LoanUpdateLabels.CALC_TYPE}
              </Typography>
              <Box
                sx={(theme) => ({
                  borderRadius: 1,
                  border: `1px solid ${alpha(
                    theme.palette.primary.main,
                    0.35
                  )}`,
                  px: 1,
                  py: 0.25,
                })}
              >
                <RadioGroup
                  row
                  value={calcType}
                  onChange={(e) =>
                    setCalcType(e.target.value as UpdateLoanType)
                  }
                >
                  <FormControlLabel
                    value={UpdateLoanType.EQA_LF}
                    control={
                      <Radio
                        size={"small"}
                        sx={(theme) => ({
                          color: alpha(theme.palette.primary.main, 0.6),
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
                        })}
                      />
                    }
                    label={LoanUpdateLabels.CALC_TYPE_1}
                    sx={{ "& .MuiTypography-root": { fontSize: 12 } }}
                  />
                  <FormControlLabel
                    value={UpdateLoanType.LA_EQF}
                    control={
                      <Radio
                        size={"small"}
                        sx={(theme) => ({
                          color: alpha(theme.palette.primary.main, 0.6),
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
                        })}
                      />
                    }
                    label={LoanUpdateLabels.CALC_TYPE_2}
                    sx={{ "& .MuiTypography-root": { fontSize: 12 } }}
                  />
                </RadioGroup>
              </Box>
            </Box>
          </Grid>
          <Grid size={3}>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Typography variant="caption" color="text.secondary">
                {LoanUpdateLabels.NEW_AMOUNT}
              </Typography>
              <TextField
                type={"number"}
                size={"small"}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                value={(loan.debt - amount).toFixed(2)}
              />
            </Box>
          </Grid>
          <Grid
            size={12}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            gap={1}
            pt={0.5}
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
        </Grid>
      </Box>
      {updatedFees.length > 0 && (
        <LoanTable
          isLoading={false}
          loanDetail={updatedFees}
          loanBottom={true}
          withStatus={true}
        />
      )}
    </>
  );
};
