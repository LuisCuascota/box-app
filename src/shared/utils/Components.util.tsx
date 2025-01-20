import { PaymentMethodEnum } from "../enums/PaymentMethod.enum.ts";
import { Tooltip } from "@mui/material";
import { ComponentsLabels } from "../labels/Components.labels.ts";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { ColorsEnum } from "../enums/Colors.enum.ts";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import {
  AccountStatusEnum,
  LoanStatusEnum,
} from "../enums/RegistryType.enum.ts";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { DefaultPagination } from "../constants/KajaConfig.ts";
import { MutableRefObject } from "react";
import { PartnerSelector } from "../../components/input/PersonSearch/PartnerSearch.tsx";
import { TypesSelector } from "../../components/input/TypesSearch/TypesSearch.tsx";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";

export const getPaymentTypeIcon = (status?: string) => {
  if (status)
    switch (status) {
      case PaymentMethodEnum.CASH:
        return (
          <Tooltip title={ComponentsLabels.TYPE_CASH}>
            <PriceCheckIcon sx={{ color: ColorsEnum.CASH }} />
          </Tooltip>
        );
      case PaymentMethodEnum.TRANSFER:
        return (
          <Tooltip title={ComponentsLabels.TYPE_TRANSFER}>
            <CreditScoreIcon sx={{ color: ColorsEnum.TRANSFER }} />
          </Tooltip>
        );
      case PaymentMethodEnum.MIXED:
        return (
          <>
            <Tooltip title={ComponentsLabels.TYPE_MIX}>
              <CreditScoreIcon sx={{ color: ColorsEnum.MIXED }} />
            </Tooltip>
            <Tooltip title={ComponentsLabels.TYPE_MIX}>
              <PriceCheckIcon sx={{ color: ColorsEnum.MIXED }} />
            </Tooltip>
          </>
        );
    }
};

export const getLoanStatusTypeIcon = (status?: string) => {
  if (status)
    switch (status) {
      case LoanStatusEnum.PAID:
        return (
          <Tooltip title={ComponentsLabels.PAID}>
            <PriceCheckIcon sx={{ color: ColorsEnum.PAID }} />
          </Tooltip>
        );
      case LoanStatusEnum.CURRENT:
        return (
          <Tooltip title={ComponentsLabels.CURRENT}>
            <CurrencyExchangeIcon sx={{ color: ColorsEnum.CURRENT }} />
          </Tooltip>
        );
      case LoanStatusEnum.LATE:
        return (
          <Tooltip title={ComponentsLabels.LATE}>
            <ReportProblemRoundedIcon sx={{ color: ColorsEnum.LATE }} />
          </Tooltip>
        );
    }
};

export const geSavingStatusIcon = (status?: string, isDisabled?: boolean) => {
  if (isDisabled)
    return (
      <Tooltip title={ComponentsLabels.ACCOUNT_DISABLED}>
        <PersonOffIcon sx={{ color: ColorsEnum.LATE }} fontSize={"small"} />
      </Tooltip>
    );

  if (status)
    switch (status) {
      case AccountStatusEnum.OK:
        return (
          <Tooltip title={ComponentsLabels.ACCOUNT_OK}>
            <PriceCheckIcon
              sx={{ color: ColorsEnum.PAID }}
              fontSize={"small"}
            />
          </Tooltip>
        );
      case AccountStatusEnum.LATE:
        return (
          <Tooltip title={ComponentsLabels.ACCOUNT_LATE}>
            <ReportProblemRoundedIcon
              sx={{ color: ColorsEnum.LATE }}
              fontSize={"small"}
            />
          </Tooltip>
        );
    }
};

export const getLoanAccountStatusIcon = (status?: string) => {
  if (status)
    switch (status) {
      case LoanStatusEnum.FREE:
        return (
          <Tooltip title={ComponentsLabels.FREE_LOAN}>
            <TaskAltIcon sx={{ color: ColorsEnum.MIXED }} fontSize={"small"} />
          </Tooltip>
        );
      case LoanStatusEnum.DEBT:
        return (
          <Tooltip title={ComponentsLabels.CURRENT_LOAN}>
            <PublishedWithChangesIcon
              sx={{ color: ColorsEnum.CASH }}
              fontSize={"small"}
            />
          </Tooltip>
        );
      case LoanStatusEnum.LATE:
        return (
          <Tooltip title={ComponentsLabels.LATE_LOAN}>
            <ReportProblemRoundedIcon
              sx={{ color: ColorsEnum.LATE }}
              fontSize={"small"}
            />
          </Tooltip>
        );
    }
};

export const isGetRequest = (
  currentSelector: MutableRefObject<PartnerSelector | TypesSelector | null>,
  newSelector: PartnerSelector | TypesSelector | null,
  page: number,
  rowsPerPage: number
) => {
  return (
    currentSelector.current === newSelector ||
    (currentSelector.current != newSelector &&
      page === DefaultPagination.page &&
      rowsPerPage === DefaultPagination.rowsPerPage)
  );
};
