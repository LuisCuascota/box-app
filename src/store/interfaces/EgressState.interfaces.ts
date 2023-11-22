import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";

export interface IEgressState {
  getEgressCountStatus: RequestStatusEnum;
  postEgressStatus: RequestStatusEnum;
  getEgressPaginatedStatus: RequestStatusEnum;
  getEgressDetailStatus: RequestStatusEnum;
  egressCount: number;
  egressList: EgressHeader[];
  egressDetail: EgressDetail[];
}

export interface NewEgress {
  header: EgressHeader;
  detail: EgressDetail[];
}

export interface EgressHeader {
  number: number;
  date: string;
  place: string;
  beneficiary: string;
  amount: number;
  is_transfer: boolean;
}

export interface EgressDetail {
  discharge_number: number;
  description: string;
  value: number;
}

export interface EgressPagination {
  limit: number;
  offset: number;
}
