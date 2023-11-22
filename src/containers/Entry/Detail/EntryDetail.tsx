import { EntryItem } from "./components/EntryItem.tsx";
import { Box, Skeleton } from "@mui/material";
import { EntryAmount } from "../../../store/interfaces/EntryState.interfaces.ts";
import { useContext } from "react";
import { EntryContext } from "../EntryContext.tsx";
import { useAppSelector } from "../../../shared/hooks/Store.hook.ts";
import { selectEntryTypesStatus } from "../../../store/selectors/selectors.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";

export const EntryDetail = () => {
  const { amountsToPay } = useContext(EntryContext);
  const entryTypesStatus = useAppSelector(selectEntryTypesStatus);

  return (
    <Box p={2}>
      {entryTypesStatus === RequestStatusEnum.SUCCESS
        ? amountsToPay.map((type: EntryAmount) => (
            <EntryItem key={type.id} entryType={type} />
          ))
        : Array(11)
            .fill(0)
            .map((_, index) => <Skeleton key={index} height={50} />)}
    </Box>
  );
};
