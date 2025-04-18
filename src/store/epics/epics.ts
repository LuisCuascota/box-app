import { combineEpics } from "redux-observable";
import { EpicCustom } from "../interfaces/Epics.interfaces.ts";
import { getPartnersEpic } from "./PartnerEpics/getPartners.epic.ts";
import { getEntryCountEpic } from "./EntryEpics/getEntryCount.epic.ts";
import { getEntryTypesEpic } from "./EntryEpics/getEntryTypes.epic.ts";
import { getEntryAmountsEpic } from "./EntryEpics/getEntryAmounts.epic.ts";
import { postEntryEpic } from "./EntryEpics/postEntry.epic.ts";
import { getLoanCountEpic } from "./LoanEpics/getLoanCount.epic.ts";
import { postLoanEpic } from "./LoanEpics/postLoan.epic.ts";
import { getEntriesPaginatedEpic } from "./EntryEpics/getEntriesPaginated.epic.ts";
import { getEntryDetailEpic } from "./EntryEpics/getEntryDetail.epic.ts";
import { getLoansPaginatedEpic } from "./LoanEpics/getLoansPaginated.epic.ts";
import { getLoanDetailEpic } from "./LoanEpics/getLoanDetail.epic.ts";
import { getEgressCountEpic } from "./EgressEpics/getEgressCount.epic.ts";
import { postEgressEpic } from "./EgressEpics/postEgress.epic.ts";
import { getEgressPaginatedEpic } from "./EgressEpics/getEgressPaginated.epic.ts";
import { getEgressDetailEpic } from "./EgressEpics/getEgressDetail.epic.ts";
import { getPartnersCountEpic } from "./PartnerEpics/getPartnersCount.epic.ts";
import { postPartnerEpic } from "./PartnerEpics/postPartner.epic.ts";
import { putPartnerEpic } from "./PartnerEpics/putPartner.epic.ts";
import { deletePartnerEpic } from "./PartnerEpics/deletePartner.epic.ts";
import { getMetricsEpic } from "./MetricsEpics/getMetrics.epic.ts";
import { getTypesMetricsEpic } from "./MetricsEpics/getTypesMetrics.epic.ts";
import { getContributionListEpic } from "./EntryEpics/getContributionList.epic.ts";
import { getPartnersBalancesEpic } from "./BalanceEpic/getBalance.epic.ts";
import { getPeriodListEpic } from "./BalanceEpic/getPeriod.epic.ts";
import { updateLoanEpic } from "./LoanEpics/updateLoan.epic.ts";

export default combineEpics(
  // @ts-ignore
  getPartnersEpic,
  getPartnersCountEpic,
  getEntryCountEpic,
  getEntryTypesEpic,
  getEntryAmountsEpic,
  postEntryEpic,
  getLoanCountEpic,
  postLoanEpic,
  getEntriesPaginatedEpic,
  getEntryDetailEpic,
  getLoansPaginatedEpic,
  getLoanDetailEpic,
  getEgressCountEpic,
  postEgressEpic,
  getEgressPaginatedEpic,
  getEgressDetailEpic,
  postPartnerEpic,
  putPartnerEpic,
  deletePartnerEpic,
  getMetricsEpic,
  getTypesMetricsEpic,
  getContributionListEpic,
  getPartnersBalancesEpic,
  getPeriodListEpic,
  updateLoanEpic
) as unknown as EpicCustom;
