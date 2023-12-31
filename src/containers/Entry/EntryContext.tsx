import { createContext, useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../shared/hooks/Store.hook.ts";
import { getPartners } from "../../store/epics/PartnerEpics/getPartners.epic.ts";
import { PaymentMethodEnum } from "../../shared/enums/PaymentMethod.enum.ts";
import { getEntryCount } from "../../store/epics/EntryEpics/getEntryCount.epic.ts";
import { getEntryTypes } from "../../store/epics/EntryEpics/getEntryTypes.epic.ts";
import { getEntryAmounts } from "../../store/epics/EntryEpics/getEntryAmounts.epic.ts";
import {
  EntryAmount,
  EntryDetail,
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
import { setPostEntryStatus } from "../../store/actions/entry.actions.ts";

export interface IEntryContext {
  disableSearch: boolean;
  disableSave: boolean;
  isLoading: boolean;
  isOpenLoanModal: boolean;
  isOpenSaveDialog: boolean;
  amountsToPay: EntryAmount[];
  totalToPay: number;
  onChangePaymentMethod: (paymentMethod: PaymentMethodEnum) => void;
  onChangePartnerSelector: (partnerSelected: PartnerSelector) => void;
  onChangeEntryDate: (date: string) => void;
  onUpdateAmounts: (id: number, value: number) => void;
  onUpdateLoanDetailsToPay: (detailsToPay: LoanDetailToPay[]) => void;
  onSaveEntry: () => void;
  onCancelEntry: () => void;
  onPrintEntry: () => void;
  onActionLoanModal: (value: boolean) => void;
  onCloseSaveDialog: () => void;
  paymentMethod?: PaymentMethodEnum | null;
  partnerSelected?: PartnerSelector | null;
}

const initialEntryContext: IEntryContext = {
  disableSearch: false,
  disableSave: false,
  isLoading: false,
  isOpenLoanModal: false,
  isOpenSaveDialog: false,
  amountsToPay: [],
  totalToPay: 0,
  onChangePaymentMethod: () => {},
  onChangePartnerSelector: () => {},
  onChangeEntryDate: () => {},
  onUpdateAmounts: () => {},
  onUpdateLoanDetailsToPay: () => {},
  onSaveEntry: () => {},
  onCancelEntry: () => {},
  onPrintEntry: () => {},
  onActionLoanModal: () => {},
  onCloseSaveDialog: () => {},
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
  const [disableSave, setDisabeSave] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenLoanModal, setIsOpenLoanModal] = useState<boolean>(false);
  const [isOpenSaveDialog, setIsOpenSaveDialog] = useState<boolean>(false);
  const [loanDefinition, setloanDefinition] = useState<LoanDefinition>();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum | null>(
    null
  );
  const [partnerSelected, setPartnerSelected] =
    useState<PartnerSelector | null>(null);
  const [entryDate, setEntryDate] = useState<string>();
  const [amountsToPay, setAmountsToPay] = useState<EntryAmount[]>([]);
  const [loanDetailToPay, setLoanDetailToPay] = useState<LoanDetailToPay[]>();
  const [totalToPay, setTotalToPay] = useState<number>(0);

  const onChangePaymentMethod = (paymentMethod: PaymentMethodEnum) => {
    setPaymentMethod(paymentMethod);
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

  const buildNewEntry = (isPrint?: boolean): NewEntry => {
    const header: EntryHeader = {
      number: entryNumber,
      account_number: partnerSelected!.id,
      amount: totalToPay,
      date: entryDate!,
      place: KajaConfig.defaultPlace,
      is_transfer: paymentMethod === PaymentMethodEnum.TRANSFER ? true : false,
      ...(isPrint ? { names: partnerSelected!.label.split("-")[1] } : {}),
    };
    const detail: EntryDetail[] = (
      isPrint ? amountsToPay : amountsToPay.filter((amount) => amount.value > 0)
    ).map((amount) => ({
      entry_number: entryNumber,
      type_id: amount.id,
      value: amount.value,
      ...(isPrint ? { description: amount.description } : {}),
    }));

    return {
      header,
      detail,
      ...(isPrint ? {} : buildLoanToPay()),
    };
  };

  const clearStateForNew = () => {
    dispatch(setPostEntryStatus(RequestStatusEnum.PENDING));
    setIsLoading(false);
    setDisableSearch(false);
    setDisabeSave(true);
    setloanDefinition(undefined);
    setLoanDetailToPay(undefined);
    setPaymentMethod(null);
    setPartnerSelected(null);
    cleanEntryAmounts();
  };

  const onPrintEntry = () => {
    buildEntryPDFDoc(buildNewEntry(true));
    onCloseSaveDialog();
  };

  const onSaveEntry = () => {
    setIsLoading(true);
    const newEntry = buildNewEntry();

    console.log(newEntry);
    dispatch(postEntry(newEntry));
  };

  const onCancelEntry = () => clearStateForNew();

  useEffect(() => {
    dispatch(getPartners());
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
      paymentMethod &&
      entryNumber > 0 &&
      totalToPay > 0 &&
      validationWhenAmountDefinitionExist()
    )
      setDisabeSave(false);
    else setDisabeSave(true);
  }, [
    paymentMethod,
    partnerSelected,
    entryDate,
    loanDetailToPay,
    entryNumber,
    totalToPay,
  ]);

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
        amountsToPay,
        totalToPay,
        onChangePaymentMethod,
        onChangePartnerSelector,
        onChangeEntryDate,
        onUpdateAmounts,
        onUpdateLoanDetailsToPay,
        onCancelEntry,
        onSaveEntry,
        onPrintEntry,
        onActionLoanModal,
        onCloseSaveDialog,
        paymentMethod,
        partnerSelected,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export { EntryContext, EntryContextProvider };
