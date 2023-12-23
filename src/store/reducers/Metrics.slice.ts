import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import {
  IMetricsState,
  Metrics,
  TypeMetric,
} from "../interfaces/MetricsState.interfaces.ts";

export const metricsInitialState: IMetricsState = {
  getMetricsStatus: RequestStatusEnum.PENDING,
  getTypesMetricsStatus: RequestStatusEnum.PENDING,
  typesMetrics: [],
};

export const metricsSlice = createSlice({
  initialState: metricsInitialState,
  name: "metrics",
  reducers: {
    setGetMetricsStatus: (state, action: PayloadAction<RequestStatusEnum>) => {
      state.getMetricsStatus = action.payload;
    },
    setMetrics: (state, action: PayloadAction<Metrics>) => {
      state.metrics = action.payload;
    },

    setGetTypesMetricsStatus: (
      state,
      action: PayloadAction<RequestStatusEnum>
    ) => {
      state.getTypesMetricsStatus = action.payload;
    },
    setTypesMetrics: (state, action: PayloadAction<TypeMetric[]>) => {
      state.typesMetrics = action.payload;
    },
  },
});

export default metricsSlice.reducer;
