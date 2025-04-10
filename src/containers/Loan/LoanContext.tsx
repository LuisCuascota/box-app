import { PartnerSelector } from "../../components/input/PersonSearch/PartnerSearch.tsx";
import { createContext, useEffect, useState } from "react";
import { getPartners } from "../../store/epics/PartnerEpics/getPartners.epic.ts";
import {
  useAppDispatch,
  useAppSelector,
} from "../../shared/hooks/Store.hook.ts";
import { LoanCalcTypeEnum } from "../../shared/enums/LoanCalcTypeEnum.ts";
import { getLoanCount } from "../../store/epics/LoanEpics/getLoanCount.epic.ts";
import {
  LoanDefinition,
  LoanDetail,
} from "../../store/interfaces/LoanState.interfaces.ts";
import moment from "moment";
import {
  selectLoanCount,
  selectPostLoanStatus,
} from "../../store/selectors/selectors.ts";
import { postLoan } from "../../store/epics/LoanEpics/postLoan.epic.ts";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import { buildLoanPDFDoc } from "../../shared/utils/BuildLoanPdf.utils.ts";
import { setPostLoanStatus } from "../../store/actions/loan.actions.ts";
import { ModePagination } from "../../store/interfaces/PartnerState.interfaces.ts";
import { calculateFeeList } from "../../shared/utils/Loan.utils.ts";

export interface ILoanContext {
  disableCalculate: boolean;
  disableSave: boolean;
  isOpenSaveDialog: boolean;
  isLoading: boolean;
  loanFees: LoanDetail[];
  onSelectPartner: (selected: PartnerSelector | null) => void;
  onSelectGuarantor1: (selected: PartnerSelector | null) => void;
  onSelectGuarantor2: (selected: PartnerSelector | null) => void;
  onChangeLoanType: (type: LoanCalcTypeEnum) => void;
  onChangeAmount: (value: number) => void;
  onChangeMonths: (value: number) => void;
  onChangeInterest: (value: number) => void;
  onChangeLoanDate: (date: string) => void;
  onCloseSaveDialog: () => void;
  onCalculate: () => void;
  onSaveLoan: () => void;
  onPrintLoan: () => void;
  amount: number;
  months: number;
  interest: number;
  loanType?: LoanCalcTypeEnum | null;
}

const initialLoanContext: ILoanContext = {
  disableCalculate: true,
  disableSave: true,
  isOpenSaveDialog: false,
  isLoading: false,
  amount: 0,
  months: 0,
  interest: 0,
  loanFees: [],
  onSelectPartner: () => {},
  onSelectGuarantor1: () => {},
  onSelectGuarantor2: () => {},
  onChangeLoanType: () => {},
  onChangeAmount: () => {},
  onChangeMonths: () => {},
  onChangeInterest: () => {},
  onChangeLoanDate: () => {},
  onCalculate: () => {},
  onSaveLoan: () => {},
  onCloseSaveDialog: () => {},
  onPrintLoan: () => {},
};

const LoanContext = createContext<ILoanContext>(initialLoanContext);

const LoanContextProvider = ({ children }: any) => {
  const dispatch = useAppDispatch();
  const loanCount = useAppSelector(selectLoanCount);
  const postLoanStatus = useAppSelector(selectPostLoanStatus);

  const [disableCalculate, setDisableCalculate] = useState<boolean>(true);
  const [disableSave, setDisableSave] = useState<boolean>(true);
  const [isOpenSaveDialog, setIsOpenSaveDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [partner, setPartner] = useState<PartnerSelector | null>(null);
  const [guarantor1, setGuarantor1] = useState<PartnerSelector | null>(null);
  const [guarantor2, setGuarantor2] = useState<PartnerSelector | null>(null);
  const [loanType, setLoanType] = useState<LoanCalcTypeEnum | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [months, setMonths] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [date, setDate] = useState<string>();
  const [loanFees, setLoanFees] = useState<LoanDetail[]>([]);

  const clearStateForNew = () => {
    dispatch(setPostLoanStatus(RequestStatusEnum.PENDING));
    setIsLoading(false);
    setPartner(null);
    setGuarantor1(null);
    setGuarantor2(null);
    setLoanType(null);
    setAmount(0);
    setInterest(0);
    setMonths(0);
    setLoanFees([]);
  };

  const buildNewLoan = (isPrint?: boolean): LoanDefinition => {
    return {
      loan: {
        number: loanCount.count + 1,
        account: partner!.id,
        date: date!,
        value: amount,
        term: months,
        rate: interest,
        is_end: false,
        debt: amount,
        guarantor1_account: guarantor1?.id,
        guarantor2_account: guarantor2?.id,
        ...(isPrint ? { names: partner!.label.split("-")[1] } : {}),
      },
      loanDetails: loanFees,
    };
  };
  const isValidValue = (value?: number) => value && value > 0;

  const onCalculate = () => {
    const feeList = calculateFeeList(
      loanType!,
      loanCount.count + 1,
      moment.utc(date),
      amount,
      months,
      interest
    );

    setLoanFees(feeList);
  };

  const onSaveLoan = () => {
    setIsLoading(true);
    dispatch(postLoan(buildNewLoan()));
  };

  const onPrintLoan = () => {
    buildLoanPDFDoc(buildNewLoan(true));
    onCloseSaveDialog();
  };

  const onCloseSaveDialog = () => {
    setIsOpenSaveDialog(false);
    clearStateForNew();
    dispatch(getLoanCount());
  };

  const onSelectPartner = (selected: PartnerSelector | null) =>
    setPartner(selected);
  const onSelectGuarantor1 = (selected: PartnerSelector | null) =>
    setGuarantor1(selected);
  const onSelectGuarantor2 = (selected: PartnerSelector | null) =>
    setGuarantor2(selected);
  const onChangeLoanType = (type: LoanCalcTypeEnum) => setLoanType(type);
  const onChangeAmount = (value: number) => setAmount(value);
  const onChangeMonths = (value: number) => setMonths(value);
  const onChangeInterest = (value: number) => setInterest(value);
  const onChangeLoanDate = (date: string) => {
    setDate(date);
  };

  useEffect(() => {
    dispatch(getPartners({ mode: ModePagination.ACTIVE_ONLY }));
    dispatch(getLoanCount());
  }, []);

  useEffect(() => {
    if (
      partner &&
      loanType &&
      date &&
      isValidValue(amount) &&
      isValidValue(months) &&
      isValidValue(interest)
    )
      setDisableCalculate(false);
    else setDisableCalculate(true);
  }, [partner, loanType, date, amount, months, interest]);

  useEffect(() => {
    if (disableCalculate) setDisableSave(true);
    else if (loanFees.length > 0) setDisableSave(false);
  }, [disableCalculate, loanFees]);

  useEffect(() => {
    if (postLoanStatus === RequestStatusEnum.SUCCESS) setIsOpenSaveDialog(true);
  }, [postLoanStatus]);

  return (
    <LoanContext.Provider
      value={{
        disableCalculate,
        disableSave,
        isOpenSaveDialog,
        isLoading,
        amount,
        months,
        interest,
        loanType,
        loanFees,
        onSelectPartner,
        onSelectGuarantor1,
        onSelectGuarantor2,
        onChangeLoanType,
        onChangeAmount,
        onChangeMonths,
        onChangeInterest,
        onChangeLoanDate,
        onCalculate,
        onSaveLoan,
        onCloseSaveDialog,
        onPrintLoan,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export { LoanContext, LoanContextProvider };
