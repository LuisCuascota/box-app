import { createContext, useEffect, useState } from "react";
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
  EntryType,
  NewEntry,
} from "../../store/interfaces/EntryState.interfaces.ts";
import {
  selectAmounts,
  selectAmountsStatus,
  selectEntryCount,
  selectEntryTypes,
  selectEntryTypesStatus,
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

export interface IEntryContext {
  disableSearch: boolean;
  disableSave: boolean;
  isLoading: boolean;
  isOpenLoanModal: boolean;
  isOpenSaveDialog: boolean;
  isOpenBillDetailModal: boolean;
  amountsToPay: EntryAmount[];
  totalToPay: number;
  onChangePartnerSelector: (partnerSelected: PartnerSelector) => void;
  onChangeEntryDate: (date: string) => void;
  onUpdateAmounts: (id: number, value: number) => void;
  onUpdateLoanDetailsToPay: (detailsToPay: LoanDetailToPay[]) => void;
  onSaveEntry: (billDetail: EntryBillDetail) => void;
  onCancelEntry: () => void;
  onPrintEntry: () => void;
  onActionLoanModal: (value: boolean) => void;
  onCloseSaveDialog: () => void;
  onOpenBillDetailModal: () => void;
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

  const [disableSearch, setDisableSearch] = useState<boolean>(false);
  const [disableSave, setDisableSave] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenLoanModal, setIsOpenLoanModal] = useState<boolean>(false);
  const [isOpenSaveDialog, setIsOpenSaveDialog] = useState<boolean>(false);
  const [loanDefinition, setloanDefinition] = useState<LoanDefinition>();

  const [partnerSelected, setPartnerSelected] =
    useState<PartnerSelector | null>(null);
  const [entryDate, setEntryDate] = useState<string>();
  const [amountsToPay, setAmountsToPay] = useState<EntryAmount[]>([]);
  const [loanDetailToPay, setLoanDetailToPay] = useState<LoanDetailToPay[]>();
  const [totalToPay, setTotalToPay] = useState<number>(0);
  const [isOpenBillDetailModal, setOpenBillDetailModal] = useState(false);
  const [billDetail, setBillDetail] = useState<EntryBillDetail>();

  const onOpenBillDetailModal = () => {
    setOpenBillDetailModal(true);
  };

  const onChangePartnerSelector = (partnerSelected: PartnerSelector) => {
    setPartnerSelected(partnerSelected);
    setDisableSearch(true);
    setIsLoading(true);

    dispatch(getEntryAmounts(partnerSelected.id));
  };

  const onChangeEntryDate = (date: string) => {
    setEntryDate(date);
  };

  const onUpdateAmounts = (id: number, newValue: number) => {
    const updatedAMounts = amountsToPay.map((amount) => {
      if (amount.id === id) amount.value = newValue;

      return amount;
    });

    setAmountsToPay(updatedAMounts);
  };

  const onActionLoanModal = (value: boolean) => setIsOpenLoanModal(value);

  const onCloseSaveDialog = () => {
    setIsOpenSaveDialog(false);
    clearStateForNew();
    dispatch(getEntryCount());
  };

  const onUpdateLoanDetailsToPay = (detailsToPay: LoanDetailToPay[]) => {
    setLoanDetailToPay(detailsToPay);
  };

  const validationWhenAmountDefinitionExist = () => {
    if (loanDefinition) {
      if (loanDetailToPay) return true;
      else return false;
    }

    return true;
  };

  const cleanEntryAmounts = () => {
    const newAmounts: EntryAmount[] = entryTypes.map((type: EntryType) => ({
      id: type.id,
      description: type.description,
      value: 0,
    }));

    setAmountsToPay(newAmounts);
  };

  const buildLoanToPay = () => {
    if (loanDefinition && loanDetailToPay && loanDetailToPay.length > 0) {
      const paidDetails = loanDefinition.loanDetails!.filter(
        (detail) => detail.is_paid
      ).length;

      const entryLoanData: EntryLoanData = {
        currentDebt: loanDefinition.loan.debt,
        loanNumber: loanDefinition.loan.number!,
        isFinishLoan: false,
        loanDetailToPay,
      };

      if (
        paidDetails + loanDetailToPay.length ===
        loanDefinition.loanDetails!.length
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
      number: entryNumber + 1,
      account_number: partnerSelected!.id,
      amount: totalToPay,
      date: entryDate!,
      place: KajaConfig.defaultPlace,
      ...(isPrint ? { names: partnerSelected!.label.split("-")[1] } : {}),
    };
    const detail: EntryAmountDetail[] = (
      isPrint ? amountsToPay : amountsToPay.filter((amount) => amount.value > 0)
    ).map((amount) => ({
      entry_number: entryNumber + 1,
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

  const clearStateForNew = () => {
    dispatch(setPostEntryStatus(RequestStatusEnum.PENDING));
    dispatch(setEntryAmounts([]));
    setIsLoading(false);
    setDisableSearch(false);
    setDisableSave(true);
    setloanDefinition(undefined);
    setLoanDetailToPay(undefined);
    setPartnerSelected(null);
    cleanEntryAmounts();
  };

  const onPrintEntry = () => {
    buildEntryPDFDoc(buildNewEntry(billDetail!, true));
    onCloseSaveDialog();
  };

  const onSaveEntry = (billDetail: EntryBillDetail) => {
    setIsLoading(true);
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
  }, []);

  useEffect(() => {
    if (postEntryStatus === RequestStatusEnum.SUCCESS)
      setIsOpenSaveDialog(true);
  }, [postEntryStatus]);

  useEffect(() => {
    if (entryTypesStatus === RequestStatusEnum.SUCCESS) cleanEntryAmounts();
  }, [entryTypesStatus]);

  useEffect(() => {
    if (amountsCalculatedStatus === RequestStatusEnum.SUCCESS) {
      setAmountsToPay((currentAmountsToPay) =>
        currentAmountsToPay.map((type) => {
          const existingAmount = amountsCalculated.find(
            (amount) => amount.id === type.id
          );

          if (existingAmount) {
            if (
              existingAmount.amountDefinition &&
              type.id === EntryTypesIdEnum.LOAN_CONTRIBUTION
            )
              setloanDefinition(existingAmount.amountDefinition);

            return {
              ...type,
              value: existingAmount.value,
              amountDefinition: existingAmount.amountDefinition,
            };
          }

          return type;
        })
      );
      setIsLoading(false);
    }
  }, [amountsCalculatedStatus]);

  useEffect(() => {
    if (
      partnerSelected &&
      entryDate &&
      entryNumber > 0 &&
      totalToPay > 0 &&
      validationWhenAmountDefinitionExist()
    )
      setDisableSave(false);
    else setDisableSave(true);
  }, [partnerSelected, entryDate, loanDetailToPay, entryNumber, totalToPay]);

  useEffect(() => {
    setTotalToPay(
      amountsToPay.reduce(
        (total, amount) => +(total + amount.value).toFixed(2),
        0
      )
    );
  }, [amountsToPay]);

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
        partnerSelected,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export { EntryContext, EntryContextProvider };
