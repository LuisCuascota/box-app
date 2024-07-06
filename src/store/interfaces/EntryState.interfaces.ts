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
  count: number;
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
  names?: string;
  surnames?: string;
}

export interface EntryAmountDetail {
  entry_number: number;
  type_id: number;
  value: number;
  description?: string;
}

export interface EntryPagination {
  limit: number;
  offset: number;
  account?: number;
}

export interface Contribution {
  date: string;
  number: number;
  value: number;
}

export interface EntryBillDetail {
  cash: number;
  transfer: number;
}

export interface EntryDetail {
  billDetail: EntryBillDetail;
  amountDetail: EntryAmountDetail[];
}
