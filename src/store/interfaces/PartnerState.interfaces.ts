import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";

export interface IPartnerState {
  getPartnersStatus: RequestStatusEnum;
  partners: PartnerData[];
}

export interface PartnerData {
  number: number;
  dni: string;
  names: string;
  surnames: string;
}
