import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ListIcon from "@mui/icons-material/ListAlt";
import { DatePikerInput } from "../../../components/input/DatePikerInput/DatePikerInput.tsx";
import { PartnerSearch } from "../../../components/input/PersonSearch/PartnerSearch.tsx";
import { LoanCalcTypeEnum } from "../../../shared/enums/LoanCalcTypeEnum.ts";
import { LoanLabels } from "../../../shared/labels/Loan.labels.ts";
import { ChangeEvent, useContext } from "react";
import { LoanContext } from "../LoanContext.tsx";
import { useAppSelector } from "../../../shared/hooks/Store.hook.ts";
import {
  selectLoanCount,
  selectLoanCountStatus,
} from "../../../store/selectors/selectors.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";

export const LoanHeader = () => {
  const {
    months,
    amount,
    interest,
    loanType,
    disableSave,
    disableCalculate,
    isOpenSaveDialog,
    onChangeLoanType,
    onChangeMonths,
    onChangeAmount,
    onChangeInterest,
    onSelectPartner,
    onSelectGuarantor1,
    onSelectGuarantor2,
    onChangeLoanDate,
    onCalculate,
    onSaveLoan,
    onPrintLoan,
    onCloseSaveDialog,
  } = useContext(LoanContext);
  const loanCount = useAppSelector(selectLoanCount);
  const loanCountStatus = useAppSelector(selectLoanCountStatus);

  const onChangeRadioButton = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeLoanType(event.target.value as LoanCalcTypeEnum);
  };
  const onChangeMonthsInput = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeMonths(+event.target.value);
  };
  const onChangeAmountInput = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeAmount(+event.target.value);
  };
  const onChangeInterestInput = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeInterest(+event.target.value);
  };

  return (
    <Grid container spacing={1}>
      <Dialog open={isOpenSaveDialog} onClose={onCloseSaveDialog}>
        <DialogTitle>{LoanLabels.SUCCESS_SAVE_MODAL_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {LoanLabels.SUCCESS_SAVE_MODAL_MESSAGE}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onPrintLoan}>{LoanLabels.PRINT}</Button>
          <Button onClick={onCloseSaveDialog}> {LoanLabels.CLOSE}</Button>
        </DialogActions>
      </Dialog>
      <Grid size={12}>
        <Typography textAlign={"center"} variant={"h5"}>
          {LoanLabels.TITLE}
        </Typography>
      </Grid>
      <Grid size={1}>
        <Typography color={"red"}>
          {loanCountStatus === RequestStatusEnum.SUCCESS ? (
            <b>{`Nº${loanCount.count + 1}`}</b>
          ) : (
            <Skeleton height={40} />
          )}
        </Typography>
      </Grid>
      <Grid size={5}>
        <Typography textAlign={"center"}>
          <b>{LoanLabels.SUB_TITLE}</b>
        </Typography>
      </Grid>
      <Grid
        size={1}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"end"}
      >
        <Typography pr={1}>{LoanLabels.DATE}</Typography>
      </Grid>
      <Grid size={2} display={"flex"} alignItems={"center"}>
        <DatePikerInput onChangeDate={onChangeLoanDate} />
      </Grid>
      <Grid
        size={1}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"end"}
      >
        <Typography pr={1}>{LoanLabels.INTEREST}</Typography>
      </Grid>
      <Grid size={2} display={"flex"} alignItems={"center"}>
        <TextField
          type={"number"}
          size={"small"}
          InputProps={{
            startAdornment: <InputAdornment position="start">%</InputAdornment>,
          }}
          onChange={onChangeInterestInput}
          value={interest}
        />
      </Grid>
      <Grid display={"flex"} alignItems={"center"} size={2}>
        <Typography pr={1}>{LoanLabels.DEBTOR}</Typography>
      </Grid>
      <Grid size={4}>
        <PartnerSearch
          disableSearch={false}
          onChangeSelector={onSelectPartner}
        />
      </Grid>
      <Grid
        size={1}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"end"}
      >
        <Typography pr={1}>{LoanLabels.MONTHS}</Typography>
      </Grid>
      <Grid size={2} display={"flex"} alignItems={"center"}>
        <TextField
          type={"number"}
          size={"small"}
          onChange={onChangeMonthsInput}
          value={months}
        />
      </Grid>
      <Grid
        size={1}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"end"}
      >
        <Typography pr={1}>{LoanLabels.VALUE}</Typography>
      </Grid>
      <Grid size={2} display={"flex"} alignItems={"center"}>
        <TextField
          type={"number"}
          size={"small"}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          onChange={onChangeAmountInput}
          value={amount}
        />
      </Grid>
      <Grid size={2} display={"flex"} alignItems={"center"}>
        <Typography pr={1}>{LoanLabels.GUARANTOR1}</Typography>
      </Grid>
      <Grid size={4}>
        <PartnerSearch
          disableSearch={false}
          onChangeSelector={onSelectGuarantor1}
        />
      </Grid>
      <Grid size={2} display={"flex"} alignItems={"center"}>
        <Typography textAlign={"center"} pr={1}>
          {LoanLabels.FEE_TYPE}
        </Typography>
      </Grid>
      <Grid size={3}>
        <RadioGroup row onChange={onChangeRadioButton} value={loanType}>
          <FormControlLabel
            value={LoanCalcTypeEnum.FIXED_FEE}
            control={<Radio size={"small"} />}
            label={LoanLabels.FEE_TYPE_FIXED}
          />
          <FormControlLabel
            value={LoanCalcTypeEnum.VARIABLE_FEE}
            control={<Radio size={"small"} />}
            label={LoanLabels.FEE_TYPE_VARIABLE}
          />
        </RadioGroup>
      </Grid>
      <Grid size={2} display={"flex"} alignItems={"center"}>
        <Typography pr={1}>{LoanLabels.GUARANTOR2}</Typography>
      </Grid>
      <Grid size={4}>
        <PartnerSearch
          disableSearch={false}
          onChangeSelector={onSelectGuarantor2}
        />
      </Grid>
      <Grid
        size={6}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-evenly"}
      >
        <Button
          endIcon={<ListIcon />}
          variant="outlined"
          disabled={disableCalculate}
          onClick={onCalculate}
        >
          {LoanLabels.CALCULATE}
        </Button>
        <Button
          endIcon={<SaveIcon />}
          variant="contained"
          disabled={disableSave}
          onClick={onSaveLoan}
        >
          {LoanLabels.SAVE}
        </Button>
      </Grid>
    </Grid>
  );
};
