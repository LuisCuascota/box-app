import { IconButton } from "@mui/material";
import { useState } from "react";
import { LoanDetail } from "../../../store/interfaces/LoanState.interfaces.ts";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

export interface PayButtonProps {
  loanDetail: LoanDetail;
  onPayAction: (detail: LoanDetail) => void;
}

export const PayButton = (props: PayButtonProps) => {
  const [disable, setDisable] = useState<boolean>(false);

  return (
    <IconButton
      color="info"
      disabled={disable}
      onClick={() => {
        props.onPayAction(props.loanDetail);
        setDisable(true);
      }}
    >
      <CurrencyExchangeIcon />
    </IconButton>
  );
};
