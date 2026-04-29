import { EntryItem } from "./components/EntryItem.tsx";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { EntryAmount } from "../../../store/interfaces/EntryState.interfaces.ts";
import { useContext, useMemo } from "react";
import { EntryContext } from "../EntryContext.tsx";
import { useAppSelector } from "../../../shared/hooks/Store.hook.ts";
import { selectEntryTypesStatus } from "../../../store/selectors/selectors.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { EntryTypesIdEnum } from "../../../shared/enums/EntryTypes.enum.ts";

const LOAN_IDS = [
  EntryTypesIdEnum.LOAN_CONTRIBUTION,
  EntryTypesIdEnum.LOAN_INTEREST,
  EntryTypesIdEnum.LOAN_CONTRIBUTION_PENALTY,
];

interface EntryGroupProps {
  title: string;
  items: EntryAmount[];
}

const EntryGroup = ({ title, items }: EntryGroupProps) => {
  if (items.length === 0) return null;

  return (
    <Box>
      <Typography
        variant="caption"
        fontWeight={600}
        color="text.secondary"
        sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        {title}
      </Typography>
      <Stack spacing={0.5} mt={0.5}>
        {items.map((type) => (
          <EntryItem key={type.id} entryType={type} />
        ))}
      </Stack>
    </Box>
  );
};

export const EntryDetail = () => {
  const { amountsToPay } = useContext(EntryContext);
  const entryTypesStatus = useAppSelector(selectEntryTypesStatus);

  const groups = useMemo(() => {
    const loan = amountsToPay.filter((a) => LOAN_IDS.includes(a.id));
    const others = amountsToPay.filter((a) => !LOAN_IDS.includes(a.id));

    return { loan, others };
  }, [amountsToPay]);

  if (entryTypesStatus !== RequestStatusEnum.SUCCESS) {
    return (
      <Stack spacing={0.5}>
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} height={44} sx={{ borderRadius: 1 }} />
          ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <EntryGroup title="Aportes y obligaciones" items={groups.others} />
      {groups.loan.length > 0 && (
        <EntryGroup title="Préstamo" items={groups.loan} />
      )}
    </Stack>
  );
};
