import { alpha, Box, Stack } from "@mui/material";
import { useContext, useMemo } from "react";
import { EntryContext } from "../EntryContext.tsx";
import { LoanPanel } from "./components/LoanPanel.tsx";
import { PartnerInfoPanel } from "./components/PartnerInfoPanel.tsx";
import { useEntryLoanPanel } from "./state/useEntryLoanPanel.ts";
import { EntryTypesIdEnum } from "../../../shared/enums/EntryTypes.enum.ts";
import { PartnerDefinition } from "../../../store/interfaces/EntryState.interfaces.ts";

export const EntryPartnerPanel = () => {
  const { partnerSelected, amountsToPay } = useContext(EntryContext);
  const loanPanelState = useEntryLoanPanel();

  const partnerDefinition = useMemo(() => {
    const contributionAmount = amountsToPay.find(
      (a) => a.id === EntryTypesIdEnum.CONTRIBUTION && a.amountDefinition
    );

    return contributionAmount?.amountDefinition as PartnerDefinition | undefined;
  }, [amountsToPay]);

  if (!partnerSelected) {
    return (
      <Box
        sx={(theme) => ({
          height: "100%",
          minHeight: 300,
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.palette.text.secondary,
          fontSize: 13,
        })}
      >
        Seleccione un socio para ver su información
      </Box>
    );
  }

  return (
    <Stack spacing={1.5}>
      {partnerDefinition && <PartnerInfoPanel partner={partnerDefinition} />}
      {loanPanelState.loanDefinition && <LoanPanel {...loanPanelState} />}
    </Stack>
  );
};
