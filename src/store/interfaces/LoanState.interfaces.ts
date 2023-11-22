import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";

export interface ILoanState {
  postLoanStatus: RequestStatusEnum;
  getLoanCountStatus: RequestStatusEnum;
  getLoansPaginatedStatus: RequestStatusEnum;
  getLoanDetailStatus: RequestStatusEnum;
  loanCount: number;
  loans: Loan[];
  loanDetail: LoanDetail[];
}

export interface Loan {
  number?: number;
  account: number;
  date: string;
  value: number;
  term: number;
  rate: number;
  is_end: boolean;
  guarantor1_account?: number;
  guarantor2_account?: number;
  names?: string;
  surnames?: string;
}

export interface LoanDetail {
  id?: number;
  fee_number: number;
  payment_date: string;
  fee_value: number;
  interest: number;
  fee_total: number;
  balance_after_pay: number;
  is_paid: boolean;
  loan_number?: number;
}

export interface LoanDefinition {
  loan: Loan;
  loanDetails?: LoanDetail[];
}

export interface LoanDetailToPay {
  id: number;
  entry: number;
}

export interface EntryLoanData {
  loanDetailToPay: LoanDetailToPay[];
  loanNumber: number;
  isFinishLoan: boolean;
}

export interface LoanPagination {
  limit: number;
  offset: number;
  account?: number;
}
