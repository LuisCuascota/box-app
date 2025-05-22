import { useLocation, useNavigate } from "react-router-dom";
import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import { UpdateLoanHead } from "./Header/UpdateLoanHead.tsx";
import {
  Loan,
  LoanDefinition,
  LoanDetail,
  LoanPayment,
} from "../../store/interfaces/LoanState.interfaces.ts";
import { UpdateLoanDetail } from "./Detail/UpdateLoanDetail.tsx";
import {
  useAppDispatch,
  useAppSelector,
} from "../../shared/hooks/Store.hook.ts";
import { updateLoan } from "../../store/epics/LoanEpics/updateLoan.epic.ts";
import { selectUpdateLoanStatus } from "../../store/selectors/selectors.ts";
import { useEffect, useState } from "react";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { EgressLabels } from "../../shared/labels/Egress.labels.ts";
import { LoanUpdateLabels } from "../../shared/labels/LoanUpdate.labels.ts";
import { buildLoanPDFDoc } from "../../shared/utils/BuildLoanPdf.utils.ts";
import { getFormattedDate } from "../../shared/utils/Date.utils.ts";
import { setUpdateLoanStatus } from "../../store/actions/loan.actions.ts";

export const UpdateLoan = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { loan, loanDetail } = location.state as {
    loan: Loan;
    loanDetail: LoanDetail[];
  };
  const updateLoanStatus = useAppSelector(selectUpdateLoanStatus);
  const [updatedLoan, setUpdatedLoan] = useState<LoanDefinition>();
  const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState<boolean>(false);

  const onUpdateLoan = (updatedFees: LoanDetail[], payment: number) => {
    const newLoanHead: Loan = {
      number: loan.number,
      account: loan.account,
      date: loan.date,
      value: loan.value,
      term: updatedFees.filter((fee) => fee.fee_value > 0).length,
      rate: loan.rate,
      is_end: loan.is_end,
      debt: loan.debt - payment,
    };

    const loanPayment: LoanPayment = {
      loan_number: loan.number!,
      payment_date: getFormattedDate(),
      payment_amount: payment,
      old_debt: loan.debt,
    };

    setUpdatedLoan({
      loan: { ...newLoanHead, names: loan.names, surnames: loan.surnames },
      loanDetails: updatedFees,
      loanPayment,
    });

    dispatch(
      updateLoan({ loan: newLoanHead, loanDetails: updatedFees, loanPayment })
    );
  };

  const onCloseUpdateDialog = () => {
    setIsOpenUpdateDialog(false);
    dispatch(setUpdateLoanStatus(RequestStatusEnum.PENDING));
    navigate(-1);
  };

  const onPrintLoan = () => {
    buildLoanPDFDoc(updatedLoan!, true);
    onCloseUpdateDialog();
  };

  useEffect(() => {
    if (updateLoanStatus === RequestStatusEnum.SUCCESS)
      setIsOpenUpdateDialog(true);
  }, [updateLoanStatus]);

  return (
    <PaperBase>
      <Dialog open={isOpenUpdateDialog} onClose={onCloseUpdateDialog}>
        <DialogTitle>{LoanUpdateLabels.SUCCESS_UPDATE_MODAL_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {LoanUpdateLabels.SUCCESS_UPDATE_MODAL_SUBTITLE}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onPrintLoan}>{EgressLabels.PRINT}</Button>
          <Button onClick={onCloseUpdateDialog}> {EgressLabels.CLOSE}</Button>
        </DialogActions>
      </Dialog>
      <UpdateLoanHead loan={loan} loanDetail={loanDetail} />
      <UpdateLoanDetail
        loan={loan}
        loanDetail={loanDetail}
        onUpdateLoan={onUpdateLoan}
      />
    </PaperBase>
  );
};
