import { partnerSlice } from "../reducers/Partner.slice.ts";

export const {
  setGetPartnerStatus,
  setGetPartnersCountStatus,
  setPartners,
  setPartnersCount,
  setPostPartnerStatus,
  setPutPartnerStatus,
  setDeletePartnerStatus,
} = partnerSlice.actions;
