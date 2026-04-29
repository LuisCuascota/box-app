import {
  alpha,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
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
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={1.5}
      py={0.75}
      sx={(theme) => ({
        borderRadius: 1.5,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        transition: "all 0.15s ease",
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.35),
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
        },
      })}
    >
      <Typography variant="body2" color="text.primary" sx={{ pr: 1 }}>
        {props.entryType.description}
      </Typography>
      <Box display="flex" alignItems="center" gap={0.75}>
        <TextField
          type="number"
          size="small"
          value={props.entryType.value}
          onChange={onChange}
          sx={{ width: 120 }}
          InputProps={{
            inputProps: { min: 0 },
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        {props.entryType.amountDefinition ? (
          <>
            <Tooltip title="Detalle de Valores" placement="left">
              <IconButton
                color="primary"
                onClick={() => onActionLoanModal(true)}
                size="small"
                sx={(theme) => ({
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  width: 28,
                  height: 28,
                })}
              >
                <VisibilityIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
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
          <Box width={28} />
        )}
      </Box>
    </Box>
  );
};
