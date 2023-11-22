import { entrySlice } from "../reducers/Entry.slice.ts";

export const {
  setGetEntryCountStatus,
  setGetEntryTypesStatus,
  setGetEntryAmountsStatus,
  setPostEntryStatus,
  setGetEntriesPaginatedStatus,
  setGetEntryDetailStatus,
  setCount,
  setTypes,
  setEntryAmounts,
  setEntries,
  setEntryDetail,
} = entrySlice.actions;
