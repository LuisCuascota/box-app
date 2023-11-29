import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IPartnerState,
  PartnerData,
} from "../interfaces/PartnerState.interfaces.ts";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";

export const partnerInitialState: IPartnerState = {
  getPartnersStatus: RequestStatusEnum.PENDING,
  getPartnersCountStatus: RequestStatusEnum.PENDING,
  postPartnerStatus: RequestStatusEnum.PENDING,
  putPartnerStatus: RequestStatusEnum.PENDING,
  deletePartnerStatus: RequestStatusEnum.PENDING,
  partners: [],
  partnersCount: 0,
};

export const partnerSlice = createSlice({
  initialState: partnerInitialState,
  name: "partner",
  reducers: {
    setGetPartnerStatus: (state, action: PayloadAction<RequestStatusEnum>) => {
      state.getPartnersStatus = action.payload;
    },
    setPartners: (state, action: PayloadAction<PartnerData[]>) => {
      state.partners = action.payload;
    },
    setGetPartnersCountStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getPartnersCountStatus = action.payload;
    },
    setPartnersCount: (state, action: PayloadAction<number>) => {
      state.partnersCount = action.payload;
    },
    setPostPartnerStatus: (state, action: PayloadAction<RequestStatusEnum>) => {
      state.postPartnerStatus = action.payload;
    },
    setPutPartnerStatus: (state, action: PayloadAction<RequestStatusEnum>) => {
      state.putPartnerStatus = action.payload;
    },
    setDeletePartnerStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.deletePartnerStatus = action.payload;
    },
  },
});

export default partnerSlice.reducer;
