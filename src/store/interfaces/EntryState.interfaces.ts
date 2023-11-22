import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import { EntryLoanData, LoanDefinition } from "./LoanState.interfaces.ts";

export interface IEntryState {
  getEntryCountStatus: RequestStatusEnum;
  getEntryTypesStatus: RequestStatusEnum;
  getEntryAmountsStatus: RequestStatusEnum;
  postEntryStatus: RequestStatusEnum;
  getEntriesPaginatedStatus: RequestStatusEnum;
  getEntryDetailStatus: RequestStatusEnum;
  count: number;
  types: EntryType[];
  entryAmounts: EntryAmount[];
  entries: EntryHeader[];
  entryDetail: EntryDetail[];
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
  detail: EntryDetail[];
  entryLoanData?: EntryLoanData;
}

export interface EntryHeader {
  number: number;
  account_number: number;
  amount: number;
  date: string;
  place: string;
  is_transfer: boolean;
  names?: string;
  surnames?: string;
}

export interface EntryDetail {
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
