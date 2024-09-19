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
import { RegistryTypeEnum } from "../../../shared/enums/RegistryType.enum.ts";
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
    partner,
    guarantor1,
    guarantor2,
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
    onChangeLoanType(event.target.value as RegistryTypeEnum);
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
      <Grid item md={12} xs={12}>
        <Typography textAlign={"center"} variant={"h5"}>
          {LoanLabels.TITLE}
        </Typography>
      </Grid>
      <Grid item md={1} xs={2}>
        <Typography color={"red"}>
          {loanCountStatus === RequestStatusEnum.SUCCESS ? (
            <b>{`Nº${loanCount}`}</b>
          ) : (
            <Skeleton height={40} />
          )}
        </Typography>
      </Grid>
      <Grid item md={5} xs={10}>
        <Typography textAlign={"center"}>
          <b>{LoanLabels.SUB_TITLE}</b>
        </Typography>
      </Grid>
      <Grid
        item
        md={1}
        xs={2}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"end"}
      >
        <Typography pr={1}>{LoanLabels.DATE}</Typography>
      </Grid>
      <Grid item md={2} xs={4} display={"flex"} alignItems={"center"}>
        <DatePikerInput onChangeDate={onChangeLoanDate} />
      </Grid>
      <Grid
        item
        md={1}
        xs={2}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"end"}
      >
        <Typography pr={1}>{LoanLabels.INTEREST}</Typography>
      </Grid>
      <Grid item md={2} xs={4} display={"flex"} alignItems={"center"}>
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
      <Grid display={"flex"} alignItems={"center"} item md={2} xs={3}>
        <Typography pr={1}>{LoanLabels.DEBTOR}</Typography>
      </Grid>
      <Grid item md={4} xs={9}>
        <PartnerSearch
          disableSearch={false}
          onChangeSelector={onSelectPartner}
          value={partner}
        />
      </Grid>
      <Grid
        item
        md={1}
        xs={2}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"end"}
      >
        <Typography pr={1}>{LoanLabels.MONTHS}</Typography>
      </Grid>
      <Grid item md={2} xs={4} display={"flex"} alignItems={"center"}>
        <TextField
          type={"number"}
          size={"small"}
          onChange={onChangeMonthsInput}
          value={months}
        />
      </Grid>
      <Grid
        item
        md={1}
        xs={2}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"end"}
      >
        <Typography pr={1}>{LoanLabels.VALUE}</Typography>
      </Grid>
      <Grid item md={2} xs={4} display={"flex"} alignItems={"center"}>
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
      <Grid item md={2} xs={3} display={"flex"} alignItems={"center"}>
        <Typography pr={1}>{LoanLabels.GUARANTOR1}</Typography>
      </Grid>
      <Grid item md={4} xs={9}>
        <PartnerSearch
          disableSearch={false}
          onChangeSelector={onSelectGuarantor1}
          value={guarantor1}
        />
      </Grid>
      <Grid item md={2} xs={3} display={"flex"} alignItems={"center"}>
        <Typography textAlign={"center"} pr={1}>
          {LoanLabels.FEE_TYPE}
        </Typography>
      </Grid>
      <Grid item md={3} xs={9}>
        <RadioGroup row onChange={onChangeRadioButton} value={loanType}>
          <FormControlLabel
            value={RegistryTypeEnum.FIXED_FEE}
            control={<Radio size={"small"} />}
            label={LoanLabels.FEE_TYPE_FIXED}
          />
          <FormControlLabel
            value={RegistryTypeEnum.VARIABLE_FEE}
            control={<Radio size={"small"} />}
            label={LoanLabels.FEE_TYPE_VARIABLE}
          />
        </RadioGroup>
      </Grid>
      <Grid item md={2} xs={3} display={"flex"} alignItems={"center"}>
        <Typography pr={1}>{LoanLabels.GUARANTOR2}</Typography>
      </Grid>
      <Grid item md={4} xs={9}>
        <PartnerSearch
          disableSearch={false}
          onChangeSelector={onSelectGuarantor2}
          value={guarantor2}
        />
      </Grid>
      <Grid
        item
        md={6}
        xs={12}
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
