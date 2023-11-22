import { loanSlice } from "../reducers/Loan.slice.ts";

export const {
  setPostLoanStatus,
  setGetLoanCountStatus,
  setGetLoansPaginatedStatus,
  setGetLoanDetailStatus,
  setLoanCount,
  setLoans,
  setLoanDetail,
} = loanSlice.actions;
