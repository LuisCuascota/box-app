import {
  alpha,
  Box,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { EntryAmount } from "../../../../store/interfaces/EntryState.interfaces.ts";
import { ChangeEvent, useContext } from "react";
import { EntryContext } from "../../EntryContext.tsx";

export interface EntryItemProps {
  entryType: EntryAmount;
}

export const EntryItem = (props: EntryItemProps) => {
  const { onUpdateAmounts } = useContext(EntryContext);

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
    </Box>
  );
};
