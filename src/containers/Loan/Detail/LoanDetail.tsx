import { LoanTable } from "../../../components/loan/loanTable/LoanTable.tsx";
import { useContext } from "react";
import { LoanContext } from "../LoanContext.tsx";
import { Backdrop, Box, CircularProgress } from "@mui/material";

export const LoanDetail = () => {
  const { loanFees, isLoading } = useContext(LoanContext);

  return (
    <Box pt={2} pb={2}>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress />
      </Backdrop>
      <LoanTable
        isLoading={isLoading}
        loanDetail={loanFees}
        withActions={false}
      />
    </Box>
  );
};
