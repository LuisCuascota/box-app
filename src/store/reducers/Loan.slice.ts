import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import {
  ILoanState,
  Loan,
  LoanDetail,
} from "../interfaces/LoanState.interfaces.ts";

export const loanInitialState: ILoanState = {
  postLoanStatus: RequestStatusEnum.PENDING,
  getLoanCountStatus: RequestStatusEnum.PENDING,
  getLoansPaginatedStatus: RequestStatusEnum.PENDING,
  getLoanDetailStatus: RequestStatusEnum.PENDING,
  loanCount: 0,
  loans: [],
  loanDetail: [],
};

export const loanSlice = createSlice({
  initialState: loanInitialState,
  name: "loan",
  reducers: {
    setGetLoanCountStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getLoanCountStatus = action.payload;
    },
    setLoanCount: (state, action: PayloadAction<number>) => {
      state.loanCount = action.payload;
    },
    setPostLoanStatus: (state, action: PayloadAction<RequestStatusEnum>) => {
      state.postLoanStatus = action.payload;
    },
    setGetLoansPaginatedStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getLoansPaginatedStatus = action.payload;
    },
    setLoans: (state, action: PayloadAction<Loan[]>) => {
      state.loans = action.payload;
    },
    setGetLoanDetailStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getLoanDetailStatus = action.payload;
    },
    setLoanDetail: (state, action: PayloadAction<LoanDetail[]>) => {
      state.loanDetail = action.payload;
    },
  },
});

export default loanSlice.reducer;
