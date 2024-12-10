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

export const getStatusTypeIcon = (status?: string) => {
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

export const geAccountStatusIcon = (status?: string, isDisabled?: boolean) => {
  if (isDisabled)
    return (
      <Tooltip title={ComponentsLabels.ACCOUNT_DISABLED}>
        <PersonOffIcon sx={{ color: ColorsEnum.LATE }} />
      </Tooltip>
    );

  if (status)
    switch (status) {
      case AccountStatusEnum.OK:
        return (
          <Tooltip title={ComponentsLabels.ACCOUNT_OK}>
            <PriceCheckIcon sx={{ color: ColorsEnum.PAID }} />
          </Tooltip>
        );
      case AccountStatusEnum.LATE:
        return (
          <Tooltip title={ComponentsLabels.ACCOUNT_LATE}>
            <ReportProblemRoundedIcon sx={{ color: ColorsEnum.LATE }} />
          </Tooltip>
        );
    }
};
