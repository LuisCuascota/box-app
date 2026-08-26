import { useContext, useMemo, useState } from "react";
import {
  LoanDefinition,
  LoanDetail,
  LoanDetailToPay,
} from "../../../../store/interfaces/LoanState.interfaces.ts";
import { EntryContext } from "../../EntryContext.tsx";
import { EntryTypesIdEnum } from "../../../../shared/enums/EntryTypes.enum.ts";
import { useAppSelector } from "../../../../shared/hooks/Store.hook.ts";
import { selectEntryCount } from "../../../../store/selectors/selectors.ts";
import { environment } from "../../../../environments/environment.ts";
import moment from "moment";

export interface SelectionSummary {
  count: number;
  capital: number;
  interest: number;
  penalty: number;
  total: number;
}

export interface UseEntryLoanPanelResult {
  loanDefinition: LoanDefinition | undefined;
  loanDetail: LoanDetail[];
  selectedIds: Set<number>;
  summary: SelectionSummary;
  isPreCancelled: boolean;
  onToggleFee: (detail: LoanDetail) => void;
  onPreCancel: () => void;
  onClearSelection: () => void;
  onApply: () => void;
}

const isDueOrCurrent = (d: LoanDetail) =>
  !d.is_paid && moment.utc().isSameOrAfter(d.payment_date, "day");

const isOverdue = (d: LoanDetail) =>
  !d.is_paid && moment.utc().isAfter(d.payment_date, "day");

export const useEntryLoanPanel = (): UseEntryLoanPanelResult => {
  const { amountsToPay, onUpdateAmounts, onUpdateLoanDetailsToPay } =
    useContext(EntryContext);
  const entryNumber = useAppSelector(selectEntryCount);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isPreCancelled, setIsPreCancelled] = useState(false);

  const loanDefinition = useMemo(() => {
    const loanAmount = amountsToPay.find(
      (a) => a.id === EntryTypesIdEnum.LOAN_CONTRIBUTION && a.amountDefinition
    );

    return loanAmount?.amountDefinition as LoanDefinition | undefined;
  }, [amountsToPay]);

  const loanDetail = useMemo(
    () => loanDefinition?.loanDetails ?? [],
    [loanDefinition]
  );

  const summary = useMemo((): SelectionSummary => {
    const { loanPenaltyRate } = environment;

    if (isPreCancelled && loanDefinition?.loan) {
      const dueFees = loanDetail.filter(isDueOrCurrent);
      const overdueFees = loanDetail.filter(isOverdue);
      const interest = dueFees.reduce((acc, d) => acc + d.interest, 0);
      const penalty = overdueFees.reduce(
        (acc, d) => acc + d.fee_value * loanPenaltyRate,
        0
      );

      return {
        count: loanDetail.filter((d) => !d.is_paid).length,
        capital: +loanDefinition.loan.debt.toFixed(2),
        interest: +interest.toFixed(2),
        penalty: +penalty.toFixed(2),
        total: +(loanDefinition.loan.debt + interest + penalty).toFixed(2),
      };
    }

    const selected = loanDetail.filter((d) => selectedIds.has(d.id!));
    const capital = selected.reduce((acc, d) => acc + d.fee_value, 0);
    const interest = selected.reduce((acc, d) => acc + d.interest, 0);
    const overdue = selected.filter(isOverdue);
    const penalty = overdue.reduce(
      (acc, d) => acc + d.fee_value * loanPenaltyRate,
      0
    );

    return {
      count: selected.length,
      capital: +capital.toFixed(2),
      interest: +interest.toFixed(2),
      penalty: +penalty.toFixed(2),
      total: +(capital + interest + penalty).toFixed(2),
    };
  }, [selectedIds, loanDetail, isPreCancelled, loanDefinition]);

  const onToggleFee = (detail: LoanDetail) => {
    setIsPreCancelled(false);
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(detail.id!)) {
        next.delete(detail.id!);
      } else {
        next.add(detail.id!);
      }

      return next;
    });
  };

  const onPreCancel = () => {
    if (!loanDefinition?.loanDetails || !loanDefinition.loan) return;

    const allPendingIds = loanDefinition.loanDetails
      .filter((d) => !d.is_paid)
      .map((d) => d.id!);

    setSelectedIds(new Set(allPendingIds));
    setIsPreCancelled(true);
  };

  const onClearSelection = () => {
    setSelectedIds(new Set());
    setIsPreCancelled(false);
    onUpdateAmounts(EntryTypesIdEnum.LOAN_CONTRIBUTION, 0);
    onUpdateAmounts(EntryTypesIdEnum.LOAN_INTEREST, 0);
    onUpdateAmounts(EntryTypesIdEnum.LOAN_CONTRIBUTION_PENALTY, 0);
    onUpdateLoanDetailsToPay([]);
  };

  const onApply = () => {
    if (selectedIds.size === 0) return;

    const selected = loanDetail.filter((d) => selectedIds.has(d.id!));

    const detailToPay: LoanDetailToPay[] = selected.map((detail) => ({
      entry: entryNumber.count + 1,
      id: detail.id!,
      feeValue: detail.fee_value,
      fee_number: detail.fee_number,
      fee_total: detail.fee_total,
      balance_after_pay: detail.balance_after_pay,
    }));

    onUpdateAmounts(EntryTypesIdEnum.LOAN_CONTRIBUTION, summary.capital);
    onUpdateAmounts(EntryTypesIdEnum.LOAN_INTEREST, summary.interest);
    onUpdateAmounts(EntryTypesIdEnum.LOAN_CONTRIBUTION_PENALTY, summary.penalty);

    onUpdateLoanDetailsToPay(detailToPay);
    setSelectedIds(new Set());
    setIsPreCancelled(false);
  };

  return {
    loanDefinition,
    loanDetail,
    selectedIds,
    summary,
    isPreCancelled,
    onToggleFee,
    onPreCancel,
    onClearSelection,
    onApply,
  };
};
