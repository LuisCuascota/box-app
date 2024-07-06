import { PartnerSelector } from "../../components/input/PersonSearch/PartnerSearch.tsx";
import { createContext, useEffect, useState } from "react";
import { getPartners } from "../../store/epics/PartnerEpics/getPartners.epic.ts";
import {
  useAppDispatch,
  useAppSelector,
} from "../../shared/hooks/Store.hook.ts";
import { LoanTypeEnum } from "../../shared/enums/LoanType.enum.ts";
import { getLoanCount } from "../../store/epics/LoanEpics/getLoanCount.epic.ts";
import {
  LoanDefinition,
  LoanDetail,
} from "../../store/interfaces/LoanState.interfaces.ts";
import moment from "moment";
import { getFistSaturday } from "../../shared/utils/Date.utils.ts";
import {
  selectLoanCount,
  selectPostLoanStatus,
} from "../../store/selectors/selectors.ts";
import { postLoan } from "../../store/epics/LoanEpics/postLoan.epic.ts";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import { buildLoanPDFDoc } from "../../shared/utils/BuildLoanPdf.utils.ts";
import { setPostLoanStatus } from "../../store/actions/loan.actions.ts";

export interface ILoanContext {
  disableCalculate: boolean;
  disableSave: boolean;
  isOpenSaveDialog: boolean;
  isLoading: boolean;
  loanFees: LoanDetail[];
  onSelectPartner: (selected: PartnerSelector) => void;
  onSelectGuarantor1: (selected: PartnerSelector) => void;
  onSelectGuarantor2: (selected: PartnerSelector) => void;
  onChangeLoanType: (type: LoanTypeEnum) => void;
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
  partner?: PartnerSelector | null;
  guarantor1?: PartnerSelector | null;
  guarantor2?: PartnerSelector | null;
  loanType?: LoanTypeEnum | null;
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
  const [loanType, setLoanType] = useState<LoanTypeEnum | null>(null);
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
        number: loanCount,
        account: partner!.id,
        date: date!,
        value: amount,
        term: months,
        rate: interest,
        is_end: false,
        guarantor1_account: guarantor1?.id,
        guarantor2_account: guarantor2?.id,
        ...(isPrint ? { names: partner!.label.split("-")[1] } : {}),
      },
      loanDetails: loanFees,
    };
  };
  const isValidValue = (value?: number) => value && value > 0;

  const onCalculate = () => {
    const loanFeesCalc: LoanDetail[] = [];
    const paymentDate = moment.utc(date);
    let feeValue = +(amount! / months!).toFixed(2);
    const interestValue = interest! / 100;
    let balance = amount!;
    let interestCalc = 0;
    let feeTotal = 0;
    let interestTotal = 0;

    if (loanType === LoanTypeEnum.FIXED_FEE)
      interestCalc = amount! * interestValue;

    for (let value = 1; value <= months!; value++) {
      if (loanType === LoanTypeEnum.VARIABLE_FEE) {
        interestCalc = balance * interestValue;
      }

      if (value === months) {
        feeValue = balance;
        balance = 0;
      } else balance -= feeValue;

      loanFeesCalc.push({
        balance_after_pay: +balance.toFixed(2),
        fee_number: value,
        fee_total: +(feeValue + interestCalc).toFixed(2),
        fee_value: +feeValue.toFixed(2),
        interest: +interestCalc.toFixed(2),
        is_paid: false,
        loan_number: loanCount,
        payment_date: getFistSaturday(paymentDate),
      });

      feeTotal += feeValue;
      interestTotal += +interestCalc.toFixed(2);

      setLoanFees(loanFeesCalc);
    }
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

  const onSelectPartner = (selected: PartnerSelector) => setPartner(selected);
  const onSelectGuarantor1 = (selected: PartnerSelector) =>
    setGuarantor1(selected);
  const onSelectGuarantor2 = (selected: PartnerSelector) =>
    setGuarantor2(selected);
  const onChangeLoanType = (type: LoanTypeEnum) => setLoanType(type);
  const onChangeAmount = (value: number) => setAmount(value);
  const onChangeMonths = (value: number) => setMonths(value);
  const onChangeInterest = (value: number) => setInterest(value);
  const onChangeLoanDate = (date: string) => {
    setDate(date);
  };

  useEffect(() => {
    dispatch(getPartners());
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
        partner,
        guarantor1,
        guarantor2,
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
