import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import { EgressHeader } from "./Header/EgressHeader.tsx";
import { EgressContestProvider } from "./EgressContext.tsx";
import { EgressFooter } from "./Footer/EgressFooter.tsx";
import { EgressDetail } from "./Detail/EgressDetail.tsx";

export const EgressContainer = () => {
  return (
    <PaperBase>
      <EgressContestProvider>
        <EgressHeader />
        <EgressDetail />
        <EgressFooter />
      </EgressContestProvider>
    </PaperBase>
  );
};
