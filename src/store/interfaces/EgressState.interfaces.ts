import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";

export interface IEgressState {
  getEgressCountStatus: RequestStatusEnum;
  postEgressStatus: RequestStatusEnum;
  getEgressPaginatedStatus: RequestStatusEnum;
  getEgressDetailStatus: RequestStatusEnum;
  egressCount: LoanCounter;
  egressList: EgressHeader[];
  egressDetail: EgressDetail;
}

export interface NewEgress {
  header: EgressHeader;
  detail: EgressAmountDetail[];
  billDetail: EgressBillDetail;
}

export interface EgressHeader {
  number: number;
  date: string;
  place: string;
  beneficiary: string;
  amount: number;
  type_id: number;
  period_id: number;
  status?: string;
}

export interface EgressAmountDetail {
  discharge_number: number;
  description: string;
  value: number;
}

export interface EgressPagination {
  limit: number;
  offset: number;
  type?: number;
  startDate?: string;
  endDate?: string;
  paymentType?: string | null;
  period?: number;
}

export interface EgressBillDetail {
  cash: number;
  transfer: number;
}

export interface EgressDetail {
  billDetail: EgressBillDetail;
  amountDetail: EgressAmountDetail[];
}

export interface LoanCounter {
  count: number;
  cash: number;
  transfer: number;
  total: number;
}

export interface EgressCountFilter {
  type?: number;
  startDate?: string;
  endDate?: string;
  paymentType?: string | null;
  period?: number;
}
