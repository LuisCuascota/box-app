import { Box, IconButton, TextField, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { EntryAmount } from "../../../../store/interfaces/EntryState.interfaces.ts";
import { ChangeEvent, useContext } from "react";
import { EntryContext } from "../../EntryContext.tsx";
import { EntryTypesIdEnum } from "../../../../shared/enums/EntryTypes.enum.ts";
import { LoanModal } from "../../../../components/modals/Loan/LoanModal.tsx";

export interface EntryItemProps {
  entryType: EntryAmount;
}

export const EntryItem = (props: EntryItemProps) => {
  const { onUpdateAmounts, isOpenLoanModal, onActionLoanModal } =
    useContext(EntryContext);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onUpdateAmounts(props.entryType.id, +event.target.value);
  };

  return (
    <Box display={"flex"} justifyContent={"space-between"} pt={1}>
      <Typography>{props.entryType.description}</Typography>
      <Box display={"flex"}>
        <TextField
          type={"number"}
          size={"small"}
          value={props.entryType.value}
          onChange={onChange}
          InputProps={{ inputProps: { min: 0 } }}
        />
        {props.entryType.amountDefinition ? (
          <>
            <IconButton color="primary" onClick={() => onActionLoanModal(true)}>
              <VisibilityIcon />
            </IconButton>
            {props.entryType.id === EntryTypesIdEnum.LOAN_CONTRIBUTION && (
              <LoanModal
                open={isOpenLoanModal}
                handleClose={() => onActionLoanModal(false)}
                loan={props.entryType.amountDefinition.loan}
                loanDetail={props.entryType.amountDefinition.loanDetails}
              />
            )}
          </>
        ) : (
          <Box m={2.5} />
        )}
      </Box>
    </Box>
  );
};
