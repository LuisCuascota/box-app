import { PaymentMethodEnum } from "../enums/PaymentMethod.enum.ts";
import { alpha, Chip, Tooltip } from "@mui/material";
import { ComponentsLabels } from "../labels/Components.labels.ts";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { ColorsEnum } from "../enums/Colors.enum.ts";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import {
  AccountStatusEnum,
  LoanStatusEnum,
} from "../enums/LoanCalcTypeEnum.ts";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { DefaultPagination } from "../constants/KajaConfig.ts";
import { MutableRefObject } from "react";
import { PartnerSelector } from "../../components/input/PersonSearch/PartnerSearch.tsx";
import { TypesSelector } from "../../components/input/TypesSearch/TypesSearch.tsx";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import { LoanDetail } from "../../store/interfaces/LoanState.interfaces.ts";
import moment from "moment/moment";

export const getPaymentTypeIcon = (status?: string) => {
  if (status)
    switch (status) {
      case PaymentMethodEnum.CASH:
        return (
          <Chip
            variant="outlined"
            color="success"
            size="small"
            icon={<PriceCheckIcon />}
            label={ComponentsLabels.TYPE_CASH}
            sx={(theme) => ({
              fontWeight: 600,
              minWidth: 96,
              justifyContent: "center",
              backgroundColor: alpha(theme.palette.success.main, 0.12),
              borderColor: alpha(theme.palette.success.main, 0.45),
            })}
          />
        );
      case PaymentMethodEnum.TRANSFER:
        return (
          <Chip
            variant="outlined"
            color="info"
            size="small"
            icon={<CreditScoreIcon />}
            label={ComponentsLabels.TYPE_TRANSFER}
            sx={(theme) => ({
              fontWeight: 600,
              minWidth: 96,
              justifyContent: "center",
              backgroundColor: alpha(theme.palette.info.main, 0.12),
              borderColor: alpha(theme.palette.info.main, 0.45),
            })}
          />
        );
      case PaymentMethodEnum.MIXED:
        return (
          <Chip
            variant="outlined"
            color="primary"
            size="small"
            icon={<SwapHorizontalCircleIcon />}
            label={ComponentsLabels.TYPE_MIX}
            sx={(theme) => ({
              fontWeight: 600,
              minWidth: 96,
              justifyContent: "center",
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
              borderColor: alpha(theme.palette.primary.main, 0.45),
            })}
          />
        );
    }
};

export const getLoanStatusTypeIcon = (status?: string) => {
  if (status)
    switch (status) {
      case LoanStatusEnum.PAID:
        return (
          <Chip
            variant="outlined"
            color="success"
            size="small"
            icon={<PriceCheckIcon />}
            label={ComponentsLabels.PAID}
            sx={(theme) => ({
              fontWeight: 600,
              minWidth: 96,
              justifyContent: "center",
              backgroundColor: alpha(theme.palette.success.main, 0.12),
              borderColor: alpha(theme.palette.success.main, 0.45),
            })}
          />
        );
      case LoanStatusEnum.CURRENT:
        return (
          <Chip
            variant="outlined"
            color="info"
            size="small"
            icon={<CurrencyExchangeIcon />}
            label={ComponentsLabels.CURRENT}
            sx={(theme) => ({
              fontWeight: 600,
              minWidth: 96,
              justifyContent: "center",
              backgroundColor: alpha(theme.palette.info.main, 0.12),
              borderColor: alpha(theme.palette.info.main, 0.45),
            })}
          />
        );
      case LoanStatusEnum.LATE:
        return (
          <Chip
            variant="outlined"
            color="error"
            size="small"
            icon={<ReportProblemRoundedIcon />}
            label={ComponentsLabels.LATE}
            sx={(theme) => ({
              fontWeight: 600,
              minWidth: 96,
              justifyContent: "center",
              backgroundColor: alpha(theme.palette.error.main, 0.12),
              borderColor: alpha(theme.palette.error.main, 0.45),
            })}
          />
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

export const getLoanFeeIcon = (loanDetail: LoanDetail) => {
  if (
    loanDetail.is_paid &&
    loanDetail.fee_total === 0 &&
    loanDetail.fee_value === 0 &&
    loanDetail.interest === 0
  )
    return (
      <Chip
        variant="outlined"
        color="warning"
        size="small"
        icon={<CurrencyExchangeIcon />}
        label={ComponentsLabels.REDUCED}
        sx={(theme) => ({
          fontWeight: 600,
          backgroundColor: alpha(theme.palette.warning.main, 0.12),
          borderColor: alpha(theme.palette.warning.main, 0.45),
        })}
      />
    );

  if (loanDetail.is_paid)
    return (
      <Chip
        variant="outlined"
        color="success"
        size="small"
        icon={<PriceCheckIcon />}
        label={ComponentsLabels.PAID}
        sx={(theme) => ({
          fontWeight: 600,
          backgroundColor: alpha(theme.palette.success.main, 0.12),
          borderColor: alpha(theme.palette.success.main, 0.45),
        })}
      />
    );

  if (
    !loanDetail.is_paid &&
    moment.utc().isSameOrAfter(loanDetail.payment_date, "month") &&
    moment.utc().isAfter(loanDetail.payment_date, "day")
  ) {
    return (
      <Chip
        variant="outlined"
        color="error"
        size="small"
        icon={<ReportProblemRoundedIcon />}
        label={ComponentsLabels.LATE}
        sx={(theme) => ({
          fontWeight: 600,
          backgroundColor: alpha(theme.palette.error.main, 0.12),
          borderColor: alpha(theme.palette.error.main, 0.45),
        })}
      />
    );
  }
  if (
    !loanDetail.is_paid &&
    moment.utc().isSame(loanDetail.payment_date, "month")
  )
    return (
      <Chip
        variant="outlined"
        color="info"
        size="small"
        icon={<CurrencyExchangeIcon />}
        label={ComponentsLabels.ACTUAL}
        sx={(theme) => ({
          fontWeight: 600,
          backgroundColor: alpha(theme.palette.info.main, 0.12),
          borderColor: alpha(theme.palette.info.main, 0.45),
        })}
      />
    );
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
