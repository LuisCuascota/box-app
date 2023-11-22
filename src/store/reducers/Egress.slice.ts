import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import {
  EgressDetail,
  EgressHeader,
  IEgressState,
} from "../interfaces/EgressState.interfaces.ts";

export const egressInitialState: IEgressState = {
  getEgressCountStatus: RequestStatusEnum.PENDING,
  postEgressStatus: RequestStatusEnum.PENDING,
  getEgressPaginatedStatus: RequestStatusEnum.PENDING,
  getEgressDetailStatus: RequestStatusEnum.PENDING,
  egressCount: 0,
  egressList: [],
  egressDetail: [],
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
    setEgressCount: (state, action: PayloadAction<number>) => {
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
    setEgressDetail: (state, action: PayloadAction<EgressDetail[]>) => {
      state.egressDetail = action.payload;
    },
  },
});

export default egressSlice.reducer;
