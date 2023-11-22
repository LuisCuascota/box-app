import { egressSlice } from "../reducers/Egress.slice.ts";

export const {
  setGetEgressCountStatus,
  setPostEgressStatus,
  setGetEgressPaginatedStatus,
  setGetEgressDetailStatus,
  setEgressCount,
  setEgressList,
  setEgressDetail,
} = egressSlice.actions;
