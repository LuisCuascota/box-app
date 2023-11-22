import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import {
  EntryType,
  IEntryState,
  EntryAmount,
  EntryHeader,
  EntryDetail,
} from "../interfaces/EntryState.interfaces.ts";

export const entryInitialState: IEntryState = {
  getEntryCountStatus: RequestStatusEnum.PENDING,
  getEntryTypesStatus: RequestStatusEnum.PENDING,
  getEntryAmountsStatus: RequestStatusEnum.PENDING,
  postEntryStatus: RequestStatusEnum.PENDING,
  getEntriesPaginatedStatus: RequestStatusEnum.PENDING,
  getEntryDetailStatus: RequestStatusEnum.PENDING,
  count: 0,
  types: [],
  entryAmounts: [],
  entries: [],
  entryDetail: [],
};

export const entrySlice = createSlice({
  initialState: entryInitialState,
  name: "entry",
  reducers: {
    setGetEntryCountStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getEntryCountStatus = action.payload;
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    setGetEntryTypesStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getEntryTypesStatus = action.payload;
    },
    setTypes: (state, action: PayloadAction<EntryType[]>) => {
      state.types = action.payload;
    },
    setGetEntryAmountsStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getEntryAmountsStatus = action.payload;
    },
    setEntryAmounts: (state, action: PayloadAction<EntryAmount[]>) => {
      state.entryAmounts = action.payload;
    },
    setPostEntryStatus: (state, action: PayloadAction<RequestStatusEnum>) => {
      state.postEntryStatus = action.payload;
    },
    setGetEntriesPaginatedStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getEntriesPaginatedStatus = action.payload;
    },
    setEntries: (state, action: PayloadAction<EntryHeader[]>) => {
      state.entries = action.payload;
    },
    setGetEntryDetailStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getEntryDetailStatus = action.payload;
    },
    setEntryDetail: (state, action: PayloadAction<EntryDetail[]>) => {
      state.entryDetail = action.payload;
    },
  },
});

export default entrySlice.reducer;
