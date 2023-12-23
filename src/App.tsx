import { EntryContainer } from "./containers/Entry/Entry.tsx";
import { Route, Routes } from "react-router-dom";
import { RoutesEnum } from "./shared/enums/Routes.enum.ts";
import { LoanContainer } from "./containers/Loan/Loan.tsx";
import { NavigationBar } from "./components/navigation/NavigationBar.tsx";
import { EntryHistory } from "./containers/EntryHistory/EntryHistory.tsx";
import { LoanHistory } from "./containers/LoanHistory/LoanHistory.tsx";
import { EgressContainer } from "./containers/Egress/Egress.tsx";
import { EgressHistory } from "./containers/EgressHistory/EgressHistory.tsx";
import { PartnerList } from "./containers/PartnerList/PartnerList.tsx";
import { MetricsContainer } from "./containers/Metrics/Metrics.tsx";
import { Amplify } from "aws-amplify";
import { AwsConfig } from "./environment/BoxConfig.env.ts";
import { Login } from "./containers/Login/Login.tsx";

Amplify.configure(AwsConfig);

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path={RoutesEnum.INDEX} element={<Login />} />
        <Route path={RoutesEnum.ENTRY} element={<EntryContainer />} />
        <Route path={RoutesEnum.LOAN} element={<LoanContainer />} />
        <Route path={RoutesEnum.EGRESS} element={<EgressContainer />} />
        <Route path={RoutesEnum.ENTRY_HISTORY} element={<EntryHistory />} />
        <Route path={RoutesEnum.LOAN_HISTORY} element={<LoanHistory />} />
        <Route path={RoutesEnum.EGRESS_HISTORY} element={<EgressHistory />} />
        <Route path={RoutesEnum.PARTNER_LIST} element={<PartnerList />} />
        <Route path={RoutesEnum.METRICS} element={<MetricsContainer />} />
      </Routes>
    </>
  );
}

export default App;
