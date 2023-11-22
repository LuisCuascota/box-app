import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import { LoanHeader } from "./Header/LoanHeader.tsx";
import { LoanContextProvider } from "./LoanContext.tsx";
import { LoanDetail } from "./Detail/LoanDetail.tsx";

export const LoanContainer = () => {
  return (
    <PaperBase>
      <LoanContextProvider>
        <LoanHeader />
        <LoanDetail />
      </LoanContextProvider>
    </PaperBase>
  );
};
