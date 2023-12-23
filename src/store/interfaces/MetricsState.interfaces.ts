import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";

export interface IMetricsState {
  getMetricsStatus: RequestStatusEnum;
  getTypesMetricsStatus: RequestStatusEnum;
  metrics?: Metrics;
  typesMetrics: TypeMetric[];
}

export interface Metrics {
  total: number;
  cashTotal: number;
  transferTotal: number;
}

export interface TypeMetric {
  id: number;
  description: string;
  sum: number;
}
