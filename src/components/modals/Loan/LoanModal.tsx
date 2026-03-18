import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Chip,
  Divider,
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
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { LoanStatusEnum } from "../../../shared/enums/LoanCalcTypeEnum.ts";

export interface LoanModalProps {
  open: boolean;
  handleClose: () => void;
  viewMode?: boolean;
  loan?: Loan;
  loanDetail?: LoanDetail[];
  loanBottom?: boolean;
}

export const LoanModal = (props: LoanModalProps) => {
  const {
    finalLoanDetail,
    onClose,
    onPayButton,
    onSave,
    onPreCancel,
    onPrintLoan,
    goToLoanUpdate,
  } = useLoanModalState(props);

  return (
    <Dialog
      maxWidth={"xl"}
      open={props.open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.primary.contrastText,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          py: 1.25,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <CreditScoreIcon fontSize="small" />
          {ComponentsLabels.LOAN_MODAL_TITLE}
        </Box>
        {props.loan && (
          <Chip
            size="small"
            label={`Crédito Nº${props.loan.number}`}
            color="secondary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        )}
      </DialogTitle>
      <DialogContent>
        {props.loan && (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ pt: 1.25, pb: 0.75 }}
            >
              <Box />
            </Stack>
            <Grid container spacing={0.75} pb={0.75}>
              <Grid size={4}>
                <Box
                  sx={(theme) => ({
                    p: 0.75,
                    borderRadius: 1.5,
                    backgroundColor: "#fff",
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.35
                    )}`,
                  })}
                >
                  <Typography
                    variant="caption"
                    sx={(theme) => ({
                      color: alpha(theme.palette.primary.main, 0.75),
                    })}
                  >
                    {ComponentsLabels.DATE}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={(theme) => ({
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    })}
                  >
                    {getFormattedDate(props.loan.date)}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={4}>
                <Box
                  sx={(theme) => ({
                    p: 0.75,
                    borderRadius: 1.5,
                    backgroundColor: "#fff",
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.35
                    )}`,
                  })}
                >
                  <Typography
                    variant="caption"
                    sx={(theme) => ({
                      color: alpha(theme.palette.primary.main, 0.75),
                    })}
                  >
                    {ComponentsLabels.AMOUNT}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={(theme) => ({
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    })}
                  >
                    {`$${props.loan.value}`}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={4}>
                <Box
                  sx={(theme) => ({
                    p: 0.75,
                    borderRadius: 1.5,
                    backgroundColor: "#fff",
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.35
                    )}`,
                  })}
                >
                  <Typography
                    variant="caption"
                    sx={(theme) => ({
                      color: alpha(theme.palette.primary.main, 0.75),
                    })}
                  >
                    {ComponentsLabels.INTEREST}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={(theme) => ({
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    })}
                  >
                    {`${props.loan.rate}%`}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={4}>
                <Box
                  sx={(theme) => ({
                    p: 0.75,
                    borderRadius: 1.5,
                    backgroundColor: "#fff",
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.45
                    )}`,
                  })}
                >
                  <Typography
                    variant="caption"
                    sx={(theme) => ({
                      color: alpha(theme.palette.primary.main, 0.75),
                    })}
                  >
                    {ComponentsLabels.DEBT}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={(theme) => ({
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                    })}
                  >
                    {`$${props.loan.debt}`}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={4}>
                <Box
                  sx={(theme) => ({
                    p: 0.75,
                    borderRadius: 1.5,
                    backgroundColor: "#fff",
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.35
                    )}`,
                  })}
                >
                  <Typography
                    variant="caption"
                    sx={(theme) => ({
                      color: alpha(theme.palette.primary.main, 0.75),
                    })}
                  >
                    {ComponentsLabels.MONTHS}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={(theme) => ({
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    })}
                  >
                    {props.loan.term}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 1 }} />
          </>
        )}
        <LoanTable
          isLoading={finalLoanDetail.length == 0}
          loanDetail={finalLoanDetail}
          onPayButton={onPayButton}
          withActions={!props.viewMode}
          loanBottom={props.loanBottom}
          withStatus={true}
        />
      </DialogContent>
      <DialogActions>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%", px: 2, py: 1 }}
        >
          <Button onClick={onClose} variant={"outlined"} color={"inherit"}>
            {ComponentsLabels.CLOSE}
          </Button>
          <Box display="flex" gap={1} alignItems="center">
            {props.viewMode ? (
              <>
                {props.loan &&
                  finalLoanDetail &&
                  props.loan.status === LoanStatusEnum.CURRENT &&
                  props.loan.value > props.loan.debt && (
                    <Button
                      onClick={() =>
                        goToLoanUpdate(props.loan!, finalLoanDetail)
                      }
                      variant={"contained"}
                      color={"secondary"}
                      endIcon={<RequestQuoteIcon />}
                    >
                      {ComponentsLabels.LOAN_PAYMENT}
                    </Button>
                  )}
                <Button
                  onClick={onPrintLoan}
                  variant={"contained"}
                  color={"primary"}
                  endIcon={<Print />}
                >
                  {ComponentsLabels.PRINT}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onPreCancel}
                  variant={"contained"}
                  color={"success"}
                  endIcon={<CreditScoreIcon />}
                >
                  {ComponentsLabels.PRE_CANCEL}
                </Button>
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
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
