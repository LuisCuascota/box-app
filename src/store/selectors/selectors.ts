import { RootState } from "../store";

export const selectPartners = (state: RootState) => state.partner;

export const selectEntryCount = (state: RootState) => state.entry.count;
export const selectEntryCountStatus = (state: RootState) =>
  state.entry.getEntryCountStatus;

export const selectEntryTypes = (state: RootState) => state.entry.types;
export const selectEntryTypesStatus = (state: RootState) =>
  state.entry.getEntryTypesStatus;

export const selectAmounts = (state: RootState) => state.entry.entryAmounts;
export const selectAmountsStatus = (state: RootState) =>
  state.entry.getEntryAmountsStatus;

export const selectPostEntryStatus = (state: RootState) =>
  state.entry.postEntryStatus;

export const selectLoanCount = (state: RootState) => state.loan.loanCount;
export const selectLoanCountStatus = (state: RootState) =>
  state.loan.getLoanCountStatus;

export const selectPostLoanStatus = (state: RootState) =>
  state.loan.postLoanStatus;

export const selectEntriesPaginatedStatus = (state: RootState) =>
  state.entry.getEntriesPaginatedStatus;
export const selectEntriesPaginated = (state: RootState) => state.entry.entries;

export const selectEntryDetailStatus = (state: RootState) =>
  state.entry.getEntryDetailStatus;
export const selectEntryDetail = (state: RootState) => state.entry.entryDetail;

export const selectLoansPaginatedStatus = (state: RootState) =>
  state.loan.getLoansPaginatedStatus;
export const selectLoansPaginated = (state: RootState) => state.loan.loans;

export const selectLoanDetailStatus = (state: RootState) =>
  state.loan.getLoanDetailStatus;
export const selectLoanDetail = (state: RootState) => state.loan.loanDetail;

export const selectEgressCount = (state: RootState) => state.egress.egressCount;
export const selectEgressCountStatus = (state: RootState) =>
  state.egress.getEgressCountStatus;

export const selectPostEgressStatus = (state: RootState) =>
  state.egress.postEgressStatus;

export const selectEgressPaginatedStatus = (state: RootState) =>
  state.egress.getEgressPaginatedStatus;
export const selectEgressPaginated = (state: RootState) =>
  state.egress.egressList;

export const selectEgressDetailStatus = (state: RootState) =>
  state.egress.getEgressDetailStatus;
export const selectEgressDetail = (state: RootState) =>
  state.egress.egressDetail;

export const selectMetrics = (state: RootState) => state.metrics;
