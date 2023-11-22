import { EntryHeader } from "./Header/EntryHeader.tsx";
import { EntryContextProvider } from "./EntryContext.tsx";
import { EntryDetail } from "./Detail/EntryDetail.tsx";
import { EntryFooter } from "./Footer/EntryFooter.tsx";
import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
export const EntryContainer = () => {
  return (
    <PaperBase>
      <EntryContextProvider>
        <EntryHeader />
        <EntryDetail />
        <EntryFooter />
      </EntryContextProvider>
    </PaperBase>
  );
};
