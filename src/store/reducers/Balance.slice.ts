import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import {
  IBalanceState,
  PartnerBalance,
} from "../interfaces/BalanceState.interfaces.ts";

export const balanceInitialState: IBalanceState = {
  getBalanceStatus: RequestStatusEnum.PENDING,
  partnersBalance: [],
};

export const balanceSlice = createSlice({
  initialState: balanceInitialState,
  name: "balance",
  reducers: {
    setGetBalanceStatus: (state, action: PayloadAction<RequestStatusEnum>) => {
      state.getBalanceStatus = action.payload;
    },
    setPartnersBalance: (state, action: PayloadAction<PartnerBalance[]>) => {
      state.partnersBalance = action.payload;
    },
  },
});

export default balanceSlice.reducer;
