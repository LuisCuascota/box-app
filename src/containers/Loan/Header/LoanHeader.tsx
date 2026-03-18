import {
  alpha,
  Box,
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
import {
  cardContainerSx,
  subtitleSx,
  titleSx,
} from "../../../shared/styles/Ui.styles.ts";
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
        <Box sx={(theme) => cardContainerSx(theme)}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid size={12}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant={"h6"} sx={(theme) => titleSx(theme)}>
                  {LoanLabels.TITLE}
                </Typography>
                {loanCountStatus === RequestStatusEnum.SUCCESS ? (
                  <Box
                    sx={(theme) => ({
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.5
                      )}`,
                      color: theme.palette.primary.main,
                      borderRadius: 999,
                      px: 1.25,
                      py: 0.25,
                      fontWeight: 700,
                      fontSize: 12,
                    })}
                  >
                    {`Nº${loanCount.count + 1}`}
                  </Box>
                ) : (
                  <Skeleton height={26} width={70} />
                )}
              </Box>
            </Grid>
            <Grid size={12}>
              <Typography variant="caption" sx={(theme) => subtitleSx(theme)}>
                {LoanLabels.SUB_TITLE}
              </Typography>
            </Grid>
            <Grid size={2}>
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {LoanLabels.DATE}
                </Typography>
                <DatePikerInput onChangeDate={onChangeLoanDate} />
              </Box>
            </Grid>
            <Grid size={2}>
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {LoanLabels.INTEREST}
                </Typography>
                <TextField
                  type={"number"}
                  size={"small"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                  onChange={onChangeInterestInput}
                  value={interest}
                />
              </Box>
            </Grid>
            <Grid size={2}>
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {LoanLabels.MONTHS}
                </Typography>
                <TextField
                  type={"number"}
                  size={"small"}
                  onChange={onChangeMonthsInput}
                  value={months}
                />
              </Box>
            </Grid>
            <Grid size={2}>
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {LoanLabels.VALUE}
                </Typography>
                <TextField
                  type={"number"}
                  size={"small"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  onChange={onChangeAmountInput}
                  value={amount}
                />
              </Box>
            </Grid>
            <Grid size={4}>
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {LoanLabels.DEBTOR}
                </Typography>
                <PartnerSearch
                  disableSearch={false}
                  onChangeSelector={onSelectPartner}
                />
              </Box>
            </Grid>
            <Grid size={6}>
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {LoanLabels.GUARANTOR1}
                </Typography>
                <PartnerSearch
                  disableSearch={false}
                  onChangeSelector={onSelectGuarantor1}
                />
              </Box>
            </Grid>
            <Grid size={6}>
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {LoanLabels.GUARANTOR2}
                </Typography>
                <PartnerSearch
                  disableSearch={false}
                  onChangeSelector={onSelectGuarantor2}
                />
              </Box>
            </Grid>
            <Grid size={6}>
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {LoanLabels.FEE_TYPE}
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
                  <RadioGroup row onChange={onChangeRadioButton} value={loanType}>
                    <FormControlLabel
                      value={LoanCalcTypeEnum.FIXED_FEE}
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
                      label={LoanLabels.FEE_TYPE_FIXED}
                      sx={{ "& .MuiTypography-root": { fontSize: 12 } }}
                    />
                    <FormControlLabel
                      value={LoanCalcTypeEnum.VARIABLE_FEE}
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
                      label={LoanLabels.FEE_TYPE_VARIABLE}
                      sx={{ "& .MuiTypography-root": { fontSize: 12 } }}
                    />
                  </RadioGroup>
                </Box>
              </Box>
            </Grid>
            <Grid
              size={6}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"flex-end"}
              gap={1}
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
        </Box>
      </Grid>
    </Grid>
  );
};
