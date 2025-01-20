import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import {
  EgressDetail,
  EgressHeader,
  IEgressState,
  LoanCounter,
} from "../interfaces/EgressState.interfaces.ts";

export const egressInitialState: IEgressState = {
  getEgressCountStatus: RequestStatusEnum.PENDING,
  postEgressStatus: RequestStatusEnum.PENDING,
  getEgressPaginatedStatus: RequestStatusEnum.PENDING,
  getEgressDetailStatus: RequestStatusEnum.PENDING,
  egressCount: {
    count: 0,
    cash: 0,
    transfer: 0,
    total: 0,
  },
  egressList: [],
  egressDetail: {
    amountDetail: [],
    billDetail: {
      cash: 0,
      transfer: 0,
    },
  },
};

export const egressSlice = createSlice({
  initialState: egressInitialState,
  name: "egress",
  reducers: {
    setGetEgressCountStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getEgressCountStatus = action.payload;
    },
    setEgressCount: (state, action: PayloadAction<LoanCounter>) => {
      state.egressCount = action.payload;
    },
    setPostEgressStatus: (state, action: PayloadAction<RequestStatusEnum>) => {
      state.postEgressStatus = action.payload;
    },
    setGetEgressPaginatedStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getEgressPaginatedStatus = action.payload;
    },
    setEgressList: (state, action: PayloadAction<EgressHeader[]>) => {
      state.egressList = action.payload;
    },
    setGetEgressDetailStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getEgressDetailStatus = action.payload;
    },
    setEgressDetail: (state, action: PayloadAction<EgressDetail>) => {
      state.egressDetail = action.payload;
    },
  },
});

export default egressSlice.reducer;
