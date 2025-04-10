import { loanSlice } from "../reducers/Loan.slice.ts";

export const {
  setUpdateLoanStatus,
  setPostLoanStatus,
  setGetLoanCountStatus,
  setGetLoansPaginatedStatus,
  setGetLoanDetailStatus,
  setLoanCount,
  setLoans,
  setLoanDetail,
} = loanSlice.actions;
