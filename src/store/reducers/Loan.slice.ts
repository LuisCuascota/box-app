import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import {
  ILoanState,
  Loan,
  LoanCounter,
  LoanDetail,
} from "../interfaces/LoanState.interfaces.ts";

export const loanInitialState: ILoanState = {
  postLoanStatus: RequestStatusEnum.PENDING,
  updateLoanStatus: RequestStatusEnum.PENDING,
  getLoanCountStatus: RequestStatusEnum.PENDING,
  getLoansPaginatedStatus: RequestStatusEnum.PENDING,
  getLoanDetailStatus: RequestStatusEnum.PENDING,
  loanCount: {
    total: 0,
    debt: 0,
    count: 0,
  },
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
    setLoanCount: (state, action: PayloadAction<LoanCounter>) => {
      state.loanCount = action.payload;
    },
    setPostLoanStatus: (state, action: PayloadAction<RequestStatusEnum>) => {
      state.postLoanStatus = action.payload;
    },
    setUpdateLoanStatus: (state, action: PayloadAction<RequestStatusEnum>) => {
      state.updateLoanStatus = action.payload;
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
