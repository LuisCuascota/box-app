import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";

export interface IBalanceState {
  getBalanceStatus: RequestStatusEnum;
  partnersBalance: PartnerBalance[];
  getPeriodListStatus: RequestStatusEnum;
  periodList: Period[];
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

export interface Period {
  id: number;
  start_date: string;
  enabled: boolean;
  end_date?: string;
}

export interface BalanceFilters {
  period: number;
}
