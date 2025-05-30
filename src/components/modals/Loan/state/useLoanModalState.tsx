import { useContext, useEffect, useMemo, useState } from "react";
import {
  Loan,
  LoanDetail,
  LoanDetailToPay,
} from "../../../../store/interfaces/LoanState.interfaces.ts";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../shared/hooks/Store.hook.ts";
import {
  selectEntryCount,
  selectLoanDetail,
  selectLoanDetailStatus,
} from "../../../../store/selectors/selectors.ts";
import { EntryContext } from "../../../../containers/Entry/EntryContext.tsx";
import { EntryTypesIdEnum } from "../../../../shared/enums/EntryTypes.enum.ts";
import { LoanModalProps } from "../LoanModal.tsx";
import moment from "moment";
import { getLoanDetail } from "../../../../store/epics/LoanEpics/getLoanDetail.epic.ts";
import { RequestStatusEnum } from "../../../../shared/enums/RequestStatus.enum.ts";
import { buildLoanPDFDoc } from "../../../../shared/utils/BuildLoanPdf.utils.ts";
import {
  setGetLoanDetailStatus,
  setLoanDetail,
} from "../../../../store/actions/loan.actions.ts";
import { useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../../../shared/enums/Routes.enum.ts";

export interface useLoanModalStateProps {
  finalLoanDetail: LoanDetail[];
  onClose: () => void;
  onPayButton: (loanDetail: LoanDetail) => void;
  onSave: () => void;
  onPreCancel: () => void;
  onPrintLoan: () => void;
  goToLoanUpdate: (loan: Loan, loanDetail: LoanDetail[]) => void;
}

export const useLoanModalState = (
  props: LoanModalProps
): useLoanModalStateProps => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [detailSelected, setDetailSelected] = useState<LoanDetail[]>([]);
  const [finalLoanDetail, setFinalLoanDetail] = useState<LoanDetail[]>([]);

  const loanDetailFromDB = useAppSelector(selectLoanDetail);
  const loanDetailStatus = useAppSelector(selectLoanDetailStatus);

  useMemo(() => {
    if (props.loanDetail) setFinalLoanDetail(props.loanDetail);
    else if (props.loan) dispatch(getLoanDetail(props.loan!.number!));
  }, [props.loan]);

  const entryNumber = useAppSelector(selectEntryCount);
  const { onUpdateAmounts, onUpdateLoanDetailsToPay } =
    useContext(EntryContext);

  const onPayButton = (loanDetail: LoanDetail) => {
    detailSelected.push(loanDetail);
    setDetailSelected(detailSelected);
  };

  const onClose = () => {
    if (!props.loanDetail) setFinalLoanDetail([]);
    dispatch(setLoanDetail([]));
    dispatch(setGetLoanDetailStatus(RequestStatusEnum.PENDING));
    setDetailSelected([]);
    props.handleClose();
  };

  const onSave = () => {
    let totalFee: number = 0;
    let totalInterest: number = 0;
    const detailToPay: LoanDetailToPay[] = [];

    detailSelected.map((loanDetail: LoanDetail) => {
      totalFee += loanDetail.fee_value;
      totalInterest += loanDetail.interest;
      detailToPay.push({
        entry: entryNumber.count + 1,
        id: loanDetail.id!,
        feeValue: loanDetail.fee_value,
        fee_number: loanDetail.fee_number,
        fee_total: loanDetail.fee_total,
        balance_after_pay: loanDetail.balance_after_pay,
      });
    });

    onUpdateAmounts(EntryTypesIdEnum.LOAN_CONTRIBUTION, +totalFee.toFixed(2));
    onUpdateAmounts(EntryTypesIdEnum.LOAN_INTEREST, +totalInterest.toFixed(2));
    onUpdateLoanDetailsToPay(detailToPay);

    setDetailSelected([]);
    props.handleClose();
  };

  const onPreCancel = () => {
    if (!props.viewMode && props.loanDetail) {
      const totalInterest = props.loanDetail
        .filter(
          (detail) =>
            !detail.is_paid &&
            moment.utc().isSameOrAfter(detail.payment_date, "month")
        )
        .reduce((acc, detail) => acc + detail.interest, 0);

      const detailToPay: LoanDetailToPay[] = props.loanDetail
        .filter((detail) => !detail.is_paid)
        .map((loanDetail: LoanDetail) => ({
          entry: entryNumber.count + 1,
          id: loanDetail.id!,
          feeValue: loanDetail.fee_value,
          fee_number: loanDetail.fee_number,
          fee_total: loanDetail.fee_total,
          balance_after_pay: loanDetail.balance_after_pay,
        }));

      onUpdateAmounts(
        EntryTypesIdEnum.LOAN_CONTRIBUTION,
        +props.loan!.debt.toFixed(2)
      );
      onUpdateAmounts(
        EntryTypesIdEnum.LOAN_INTEREST,
        +totalInterest.toFixed(2)
      );
      onUpdateLoanDetailsToPay(detailToPay);

      props.handleClose();
    }
  };

  const onPrintLoan = () => {
    buildLoanPDFDoc({ loan: props.loan!, loanDetails: finalLoanDetail });
  };

  const goToLoanUpdate = (loan: Loan, loanDetail: LoanDetail[]) => {
    navigate(RoutesEnum.LOAN_UPDATE, { state: { loan, loanDetail } });
  };

  useEffect(() => {
    if (loanDetailStatus === RequestStatusEnum.SUCCESS)
      setFinalLoanDetail(loanDetailFromDB);
  }, [loanDetailStatus]);

  return {
    finalLoanDetail,
    onClose,
    onPayButton,
    onSave,
    onPreCancel,
    onPrintLoan,
    goToLoanUpdate,
  };
};
