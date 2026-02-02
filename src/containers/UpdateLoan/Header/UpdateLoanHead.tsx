import { alpha, Box, Divider, Grid, Typography } from "@mui/material";
import {
  cardContainerSx,
  summaryCardSx,
  titleSx,
} from "../../../shared/styles/Ui.styles.ts";
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
    <Grid container p={1}>
      <Grid size={12}>
        <Box sx={(theme) => ({ ...cardContainerSx(theme), mb: 1 })}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid size={12}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant={"h6"} sx={(theme) => titleSx(theme)}>
                  {LoanUpdateLabels.TITLE}
                </Typography>
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
                  {`Nº${props.loan.number}`}
                </Box>
              </Box>
            </Grid>
            <Grid size={6}>
              <Box sx={(theme) => summaryCardSx(theme)}>
                <Typography variant="caption" color="text.secondary">
                  {LoanUpdateLabels.DEBTOR}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {`${props.loan.names} ${props.loan.surnames}`}
                </Typography>
              </Box>
            </Grid>
            <Grid size={2}>
              <Box sx={(theme) => summaryCardSx(theme)}>
                <Typography variant="caption" color="text.secondary">
                  {LoanUpdateLabels.INTEREST}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {`${props.loan.rate}%`}
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box sx={(theme) => summaryCardSx(theme)}>
                <Typography variant="caption" color="text.secondary">
                  {ComponentsLabels.DATE}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {getFormattedDate(props.loan.date)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={2}>
              <Box sx={(theme) => summaryCardSx(theme)}>
                <Typography variant="caption" color="text.secondary">
                  {LoanUpdateLabels.AMOUNT}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {`$${props.loan.value}`}
                </Typography>
              </Box>
            </Grid>
            <Grid size={2}>
              <Box sx={(theme) => summaryCardSx(theme)}>
                <Typography variant="caption" color="text.secondary">
                  {LoanUpdateLabels.MONTHS}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {props.loan.term}
                </Typography>
              </Box>
            </Grid>
            <Grid size={2}>
              <Box sx={(theme) => summaryCardSx(theme)}>
                <Typography variant="caption" color="text.secondary">
                  {LoanUpdateLabels.DEBT}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {`$${props.loan.debt}`}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid size={12}>
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
