import { EntryContainer } from "./containers/Entry/Entry.tsx";
import { Route, Routes } from "react-router-dom";
import { RoutesEnum } from "./shared/enums/Routes.enum.ts";
import { LoanContainer } from "./containers/Loan/Loan.tsx";
import { NavigationBar } from "./components/navigation/NavigationBar.tsx";
import { EntryHistory } from "./containers/EntryHistory/EntryHistory.tsx";
import { LoanHistory } from "./containers/LoanHistory/LoanHistory.tsx";
import { EgressContainer } from "./containers/Egress/Egress.tsx";
import { EgressHistory } from "./containers/EgressHistory/EgressHistory.tsx";

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path={RoutesEnum.ENTRY} element={<EntryContainer />} />
        <Route path={RoutesEnum.LOAN} element={<LoanContainer />} />
        <Route path={RoutesEnum.EGRESS} element={<EgressContainer />} />
        <Route path={RoutesEnum.ENTRY_HISTORY} element={<EntryHistory />} />
        <Route path={RoutesEnum.LOAN_HISTORY} element={<LoanHistory />} />
        <Route path={RoutesEnum.EGRESS_HISTORY} element={<EgressHistory />} />
      </Routes>
    </>
  );
}

export default App;
