import { Button, Tooltip } from "@mui/material";
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
    <Tooltip title="Pagar cuota" placement="left">
      <span>
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          startIcon={<CurrencyExchangeIcon />}
          disabled={disable}
          onClick={() => {
            props.onPayAction(props.loanDetail);
            setDisable(true);
          }}
          sx={{
            minWidth: 0,
            px: 1.25,
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          Pagar
        </Button>
      </span>
    </Tooltip>
  );
};
