import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import { EntryLoanData, LoanDefinition } from "./LoanState.interfaces.ts";

export interface IEntryState {
  getEntryCountStatus: RequestStatusEnum;
  getEntryTypesStatus: RequestStatusEnum;
  getEntryAmountsStatus: RequestStatusEnum;
  postEntryStatus: RequestStatusEnum;
  getEntriesPaginatedStatus: RequestStatusEnum;
  getEntryDetailStatus: RequestStatusEnum;
  getContributionListStatus: RequestStatusEnum;
  count: EntryCounter;
  types: EntryType[];
  entryAmounts: EntryAmount[];
  entries: EntryHeader[];
  entryDetail: EntryDetail;
  contributionList: Contribution[];
}

export interface EntryType {
  id: number;
  description: string;
}

export interface EntryAmount {
  id: number;
  description: string;
  value: number;
  amountDefinition?: LoanDefinition;
}

export interface NewEntry {
  header: EntryHeader;
  detail: EntryAmountDetail[];
  billDetail: EntryBillDetail;
  entryLoanData?: EntryLoanData;
}

export interface EntryHeader {
  number: number;
  account_number: number;
  amount: number;
  date: string;
  place: string;
  period_id: number;
  names?: string;
  surnames?: string;
  status?: string;
}

export interface EntryAmountDetail {
  entry_number: number;
  type_id: number;
  value: number;
  description?: string;
  currentSaving?: number;
}

export interface EntryPagination {
  limit: number;
  offset: number;
  account?: number;
  startDate?: string;
  endDate?: string;
  paymentType: string | null;
  period?: number;
}

export interface Contribution {
  date: string;
  number: number;
  value: number;
  type_id: number;
}

export interface EntryBillDetail {
  cash: number;
  transfer: number;
}

export interface EntryDetail {
  billDetail: EntryBillDetail;
  amountDetail: EntryAmountDetail[];
}

export interface CountFilter {
  account?: number;
  startDate?: string;
  endDate?: string;
  paymentType?: string | null;
  period?: number;
}

export interface EntryCounter {
  count: number;
  cash: number;
  transfer: number;
  total: number;
}
