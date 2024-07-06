import { entrySlice } from "../reducers/Entry.slice.ts";

export const {
  setGetEntryCountStatus,
  setGetEntryTypesStatus,
  setGetEntryAmountsStatus,
  setPostEntryStatus,
  setGetEntriesPaginatedStatus,
  setGetEntryDetailStatus,
  setGetContributionListStatus,
  setCount,
  setTypes,
  setEntryAmounts,
  setEntries,
  setEntryDetail,
  setContributionList,
} = entrySlice.actions;
