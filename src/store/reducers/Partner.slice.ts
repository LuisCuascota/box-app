import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IPartnerState,
  PartnerData,
} from "../interfaces/PartnerState.interfaces.ts";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";

export const partnerInitialState: IPartnerState = {
  getPartnersStatus: RequestStatusEnum.PENDING,
  partners: [],
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
  },
});

export default partnerSlice.reducer;
