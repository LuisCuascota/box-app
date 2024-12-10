import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";

export interface IBalanceState {
  getBalanceStatus: RequestStatusEnum;
  partnersBalance: PartnerBalance[];
}

export interface PartnerBalance {
  account: number;
  names: string;
  currentSaving: number;
  participationPercentage: number;
  entries: PartnerEntry[];
}

export interface PartnerEntry {
  value: number;
  date: string;
  monthCount: number;
}
