import { createContext, useEffect, useMemo, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../shared/hooks/Store.hook.ts";
import { getPartners } from "../../store/epics/PartnerEpics/getPartners.epic.ts";
import { getEntryCount } from "../../store/epics/EntryEpics/getEntryCount.epic.ts";
import { getEntryTypes } from "../../store/epics/EntryEpics/getEntryTypes.epic.ts";
import { getEntryAmounts } from "../../store/epics/EntryEpics/getEntryAmounts.epic.ts";
import {
  EntryAmount,
  EntryAmountDetail,
  EntryBillDetail,
  EntryHeader,
  EntryLoanDetail,
  EntryType,
  NewEntry,
} from "../../store/interfaces/EntryState.interfaces.ts";
import {
  selectAmounts,
  selectAmountsStatus,
  selectEntryCount,
  selectEntryTypes,
  selectEntryTypesStatus,
  selectGetPeriodList,
  selectPostEntryStatus,
} from "../../store/selectors/selectors.ts";
import {
  EntryLoanData,
  LoanDefinition,
  LoanDetailToPay,
} from "../../store/interfaces/LoanState.interfaces.ts";
import { EntryTypesIdEnum } from "../../shared/enums/EntryTypes.enum.ts";
import { PartnerSelector } from "../../components/input/PersonSearch/PartnerSearch.tsx";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import { KajaConfig } from "../../shared/constants/KajaConfig.ts";
import { postEntry } from "../../store/epics/EntryEpics/postEntry.epic.ts";
import { buildEntryPDFDoc } from "../../shared/utils/BuildEntryPdf.utils.ts";
import {
  setEntryAmounts,
  setPostEntryStatus,
} from "../../store/actions/entry.actions.ts";
import { ModePagination } from "../../store/interfaces/PartnerState.interfaces.ts";
import { getPeriodList } from "../../store/epics/BalanceEpic/getPeriod.epic.ts";

export interface IEntryContext {
  disableSearch: boolean;
  disableSave: boolean;
  isLoading: boolean;
  isOpenLoanModal: boolean;
  isOpenSaveDialog: boolean;
  isOpenBillDetailModal: boolean;
  amountsToPay: EntryAmount[];
  totalToPay: number;
  onChangePartnerSelector: (partnerSelected: PartnerSelector | null) => void;
  onChangeEntryDate: (date: string) => void;
  onUpdateAmounts: (id: number, value: number) => void;
  onUpdateLoanDetailsToPay: (detailsToPay: LoanDetailToPay[]) => void;
  onSaveEntry: (billDetail: EntryBillDetail) => void;
  onCancelEntry: () => void;
  onPrintEntry: () => void;
  onActionLoanModal: (value: boolean) => void;
  onCloseSaveDialog: () => void;
  onOpenBillDetailModal: () => void;
  onCloseBillDetailModal: () => void;
  partnerSelected?: PartnerSelector | null;
}

const initialEntryContext: IEntryContext = {
  disableSearch: false,
  disableSave: false,
  isLoading: false,
  isOpenLoanModal: false,
  isOpenSaveDialog: false,
  isOpenBillDetailModal: false,
  amountsToPay: [],
  totalToPay: 0,
  onChangePartnerSelector: () => {},
  onChangeEntryDate: () => {},
  onUpdateAmounts: () => {},
  onUpdateLoanDetailsToPay: () => {},
  onSaveEntry: () => {},
  onCancelEntry: () => {},
  onPrintEntry: () => {},
  onActionLoanModal: () => {},
  onCloseSaveDialog: () => {},
  onOpenBillDetailModal: () => {},
  onCloseBillDetailModal: () => {},
};
const EntryContext = createContext<IEntryContext>(initialEntryContext);

const EntryContextProvider = ({ children }: any) => {
  const dispatch = useAppDispatch();

  const entryNumber = useAppSelector(selectEntryCount);
  const entryTypes = useAppSelector(selectEntryTypes);
  const entryTypesStatus = useAppSelector(selectEntryTypesStatus);
  const amountsCalculated = useAppSelector(selectAmounts);
  const amountsCalculatedStatus = useAppSelector(selectAmountsStatus);
  const postEntryStatus = useAppSelector(selectPostEntryStatus);
  const { periodList } = useAppSelector(selectGetPeriodList);

  const [disableSearch, setDisableSearch] = useState<boolean>(false);
  const [hasRequestedAmounts, setHasRequestedAmounts] =
    useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isOpenLoanModal, setIsOpenLoanModal] = useState<boolean>(false);

  const [partnerSelected, setPartnerSelected] =
    useState<PartnerSelector | null>(null);
  const [entryDate, setEntryDate] = useState<string>();
  const [amountOverrides, setAmountOverrides] = useState<
    Record<number, number>
  >({});
  const [loanDetailToPay, setLoanDetailToPay] = useState<LoanDetailToPay[]>();
  const [isOpenBillDetailModal, setOpenBillDetailModal] = useState(false);
  const [billDetail, setBillDetail] = useState<EntryBillDetail>();
  const periodId = useMemo(
    () => periodList.find((period) => period.enabled)?.id,
    [periodList]
  );

  const onOpenBillDetailModal = () => {
    setOpenBillDetailModal(true);
  };

  const onCloseBillDetailModal = () => {
    setOpenBillDetailModal(false);
  };

  const onChangePartnerSelector = (partnerSelected: PartnerSelector | null) => {
    if (partnerSelected) {
      setHasRequestedAmounts(true);
      setAmountOverrides({});
      setPartnerSelected(partnerSelected);
      setDisableSearch(true);

      dispatch(getEntryAmounts(partnerSelected.id));
    }
  };

  const onChangeEntryDate = (date: string) => {
    setEntryDate(date);
  };

  const onUpdateAmounts = (id: number, newValue: number) => {
    setAmountOverrides((current) => ({
      ...current,
      [id]: newValue,
    }));
  };

  const onActionLoanModal = (value: boolean) => setIsOpenLoanModal(value);

  const onCloseSaveDialog = () => {
    clearStateForNew();
    dispatch(getEntryCount());
  };

  const onUpdateLoanDetailsToPay = (detailsToPay: LoanDetailToPay[]) => {
    setLoanDetailToPay(detailsToPay);
  };


  const baseAmounts = useMemo(() => {
    if (entryTypesStatus !== RequestStatusEnum.SUCCESS) return [];

    return entryTypes.map((type: EntryType) => {
      const existingAmount =
        amountsCalculatedStatus === RequestStatusEnum.SUCCESS
          ? amountsCalculated.find((amount) => amount.id === type.id)
          : undefined;

      return {
        id: type.id,
        description: type.description,
        value: existingAmount?.value ?? 0,
        amountDefinition: existingAmount?.amountDefinition,
      };
    });
  }, [
    amountsCalculated,
    amountsCalculatedStatus,
    entryTypes,
    entryTypesStatus,
  ]);

  const amountsToPay = useMemo(
    () =>
      baseAmounts.map((amount) => {
        const override = amountOverrides[amount.id];

        return override === undefined ? amount : { ...amount, value: override };
      }),
    [amountOverrides, baseAmounts]
  );

  const buildLoanToPay = () => {
    if (
      loanDefinitionFromAmounts &&
      loanDetailToPay &&
      loanDetailToPay.length > 0
    ) {
      const paidDetails = loanDefinitionFromAmounts.loanDetails!.filter(
        (detail) => detail.is_paid
      ).length;

      const entryLoanData: EntryLoanData = {
        currentDebt: loanDefinitionFromAmounts.loan.debt,
        loanNumber: loanDefinitionFromAmounts.loan.number!,
        isFinishLoan: false,
        loanDetailToPay,
      };

      if (
        paidDetails + loanDetailToPay.length ===
        loanDefinitionFromAmounts.loanDetails!.length
      )
        entryLoanData.isFinishLoan = true;

      return {
        entryLoanData,
      };
    }

    return {};
  };

  const buildNewEntry = (
    billDetail: EntryBillDetail,
    isPrint?: boolean
  ): NewEntry => {
    const header: EntryHeader = {
      number: entryNumber.count + 1,
      account_number: partnerSelected!.id,
      amount: totalToPay,
      date: entryDate!,
      period_id: periodId!,
      place: KajaConfig.defaultPlace,
      ...(isPrint ? { names: partnerSelected!.label.split("-")[1] } : {}),
    };
    const detail: EntryAmountDetail[] = (
      isPrint ? amountsToPay : amountsToPay.filter((amount) => amount.value > 0)
    ).map((amount) => ({
      entry_number: entryNumber.count + 1,
      type_id: amount.id,
      value: amount.value,
      ...(amount.id === EntryTypesIdEnum.CONTRIBUTION
        ? { currentSaving: partnerSelected?.currentSaving }
        : {}),
      ...(isPrint ? { description: amount.description } : {}),
    }));

    return {
      header,
      detail,
      billDetail,
      ...(isPrint ? {} : buildLoanToPay()),
    };
  };

  const buildEntryLoanDetail = (): EntryLoanDetail | undefined => {
    if (
      loanDefinitionFromAmounts &&
      loanDetailToPay &&
      loanDetailToPay.length > 0
    ) {
      loanDetailToPay.sort((a, b) => b.fee_number - a.fee_number);
      const topFee = loanDetailToPay[0];

      return {
        term: loanDefinitionFromAmounts.loan.term,
        value: loanDefinitionFromAmounts.loan.value,
        fee_number: topFee.fee_number,
        fee_total: topFee.fee_total,
        balance_after_pay: topFee.balance_after_pay,
      };
    }

    return undefined;
  };

  const clearStateForNew = () => {
    dispatch(setPostEntryStatus(RequestStatusEnum.PENDING));
    dispatch(setEntryAmounts([]));
    setDisableSearch(false);
    setLoanDetailToPay(undefined);
    setPartnerSelected(null);
    setAmountOverrides({});
    setHasRequestedAmounts(false);
    setIsSaving(false);
  };

  const onPrintEntry = () => {
    buildEntryPDFDoc(buildNewEntry(billDetail!, true), buildEntryLoanDetail());
    onCloseSaveDialog();
  };

  const onSaveEntry = (billDetail: EntryBillDetail) => {
    setIsSaving(true);
    setOpenBillDetailModal(false);
    setBillDetail(billDetail);

    const newEntry = buildNewEntry(billDetail);

    dispatch(postEntry(newEntry));
  };

  const onCancelEntry = () => clearStateForNew();

  useEffect(() => {
    dispatch(getPartners({ mode: ModePagination.ACTIVE_ONLY }));
    dispatch(getEntryCount());
    dispatch(getEntryTypes());
    dispatch(getPeriodList());
  }, [dispatch]);

  const loanDefinitionFromAmounts = (
    amountsCalculatedStatus === RequestStatusEnum.SUCCESS
      ? amountsCalculated.find(
          (amount) =>
            amount.id === EntryTypesIdEnum.LOAN_CONTRIBUTION &&
            amount.amountDefinition
        )?.amountDefinition
      : undefined
  ) as LoanDefinition | undefined;

  const totalToPay = amountsToPay.reduce(
    (total, amount) => +(total + amount.value).toFixed(2),
    0
  );

  const disableSave = !(
    partnerSelected &&
    entryDate &&
    entryNumber.count > 0 &&
    totalToPay > 0 &&
    periodId
  );

  const isOpenSaveDialog = postEntryStatus === RequestStatusEnum.SUCCESS;
  const isLoading =
    (hasRequestedAmounts &&
      amountsCalculatedStatus === RequestStatusEnum.PENDING) ||
    (isSaving && postEntryStatus === RequestStatusEnum.PENDING);

  return (
    <EntryContext.Provider
      value={{
        disableSearch,
        disableSave,
        isLoading,
        isOpenLoanModal,
        isOpenSaveDialog,
        isOpenBillDetailModal,
        amountsToPay,
        totalToPay,
        partnerSelected,
        onChangePartnerSelector,
        onChangeEntryDate,
        onUpdateAmounts,
        onUpdateLoanDetailsToPay,
        onCancelEntry,
        onSaveEntry,
        onPrintEntry,
        onActionLoanModal,
        onCloseSaveDialog,
        onOpenBillDetailModal,
        onCloseBillDetailModal,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export { EntryContext, EntryContextProvider };
