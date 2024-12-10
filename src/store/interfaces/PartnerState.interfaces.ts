import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";

export interface IPartnerState {
  getPartnersStatus: RequestStatusEnum;
  getPartnersCountStatus: RequestStatusEnum;
  postPartnerStatus: RequestStatusEnum;
  putPartnerStatus: RequestStatusEnum;
  deletePartnerStatus: RequestStatusEnum;
  partners: PartnerData[];
  partnersCount: number;
}

export interface PartnerData {
  number?: number;
  dni: string;
  names: string;
  surnames: string;
  phone: string;
  birth_day: string;
  address: string;
  current_saving?: number;
  start_amount: number;
  is_disabled?: boolean;
  status?: string;
}

export interface PartnerPagination {
  limit?: number;
  offset?: number;
  mode: ModePagination;
}

export enum ModePagination {
  FULL = "full",
  SIMPLE = "simple",
  ACTIVE_ONLY = "activeOnly",
}
