import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { PartnerData } from "../../../store/interfaces/PartnerState.interfaces.ts";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { UsePartnerLoanListModalState } from "./state/usePartnerLoanListModalState.tsx";
import { getFormattedDate } from "../../../shared/utils/Date.utils.ts";
import { Loan } from "../../../store/interfaces/LoanState.interfaces.ts";
import {
  getLoanAccountStatusIcon,
  getLoanStatusTypeIcon,
} from "../../../shared/utils/Components.util.tsx";
import { LoanStatusEnum } from "../../../shared/enums/RegistryType.enum.ts";

export interface PartnerLoanListModalProps {
  open: boolean;
  handleClose: () => void;
  partnerData?: PartnerData;
}

export const PartnerLoanListModal = (props: PartnerLoanListModalProps) => {
  const { loanList, isLoading, onCloseModal } =
    UsePartnerLoanListModalState(props);

  const getChipLabel = (status?: string) => {
    if (status)
      switch (status) {
        case LoanStatusEnum.FREE:
          return ComponentsLabels.FREE_LOAN;
        case LoanStatusEnum.DEBT:
          return ComponentsLabels.CURRENT_LOAN;
        case LoanStatusEnum.LATE:
          return ComponentsLabels.LATE_LOAN;
      }
  };

  const getChipColor = (status?: string) => {
    if (status)
      switch (status) {
        case LoanStatusEnum.FREE:
          return "info";
        case LoanStatusEnum.DEBT:
          return "success";
        case LoanStatusEnum.LATE:
          return "error";
      }
  };

  return (
    <Dialog maxWidth={"md"} open={props.open} onClose={onCloseModal}>
      <DialogTitle>
        <Grid container>
          <Grid item textAlign={"center"} md={12}>
            {ComponentsLabels.PARTNER_MODAL_LOAN_TITLE}
          </Grid>
          <Grid item md={7}>
            <Typography>
              <b>{"Nombres:"}</b>
              {` ${props.partnerData?.names} ${props.partnerData?.surnames}`}
            </Typography>
          </Grid>
          <Grid item md={3}>
            <Typography>
              <b>{"Cedula:"}</b>
              {` ${props.partnerData?.dni}`}
            </Typography>
          </Grid>
          <Grid item md={2}>
            <Typography>
              <Chip
                color={getChipColor(props.partnerData?.loanStatus)}
                icon={getLoanAccountStatusIcon(props.partnerData?.loanStatus)}
                label={getChipLabel(props.partnerData?.loanStatus)}
              />
            </Typography>
          </Grid>
          <Grid item md={4}>
            <Typography>
              <b>{"Créditos realizados:"}</b>
              {` ${loanList.length}`}
            </Typography>
          </Grid>
          <Grid item md={3}>
            <Typography>
              <b>{"Desembolzado: "}</b>
              {` $${loanList.reduce((sum, loan) => loan.value + sum, 0)}`}
            </Typography>
          </Grid>
          <Grid item md={5}>
            <Typography>
              <b>{"Pendiente: "}</b>
              {` $${loanList.reduce((sum, loan) => loan.debt + sum, 0)}`}
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{ComponentsLabels.TH_ACCOUNT_DATE}</TableCell>
                <TableCell align="center">
                  {ComponentsLabels.TH_STATUS}
                </TableCell>
                <TableCell>{ComponentsLabels.TH_ENTRY_VALUE}</TableCell>
                <TableCell>{ComponentsLabels.TH_DEBT}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Array(5)
                          .fill(0)
                          .map((_, colIndex) => (
                            <TableCell key={colIndex}>
                              <Skeleton animation="wave" />
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                : loanList.map((row: Loan, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{getFormattedDate(row.date)}</TableCell>
                      <TableCell align="center">
                        {getLoanStatusTypeIcon(row.status)}
                      </TableCell>
                      <TableCell>{row.value}</TableCell>
                      <TableCell>{row.debt}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Grid container pl={2} pr={2} justifyContent={"space-between"}>
          <Button onClick={onCloseModal} variant={"outlined"} color={"inherit"}>
            {ComponentsLabels.CLOSE}
          </Button>

          <Button
            variant={"contained"}
            color={"primary"}
            onClick={() => {}}
            disabled={true}
            endIcon={<LocalPrintshopIcon />}
          >
            {ComponentsLabels.PRINT}
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};
