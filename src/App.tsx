import { EntryContainer } from "./containers/Entry/Entry.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
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
import { AwsConfig } from "./shared/constants/KajaConfig.ts";
import { Login } from "./containers/Login/Login.tsx";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import instance from "./shared/utils/Axios.util.ts";

Amplify.configure(AwsConfig);

function App() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const setJwt = async () => {
    const jwt = await fetchAuthSession();

    if (jwt && jwt.tokens)
      instance.defaults.headers["Authorization"] =
        jwt.tokens.accessToken.toString();
  };

  useEffect(() => {
    if (authStatus === "authenticated") {
      setJwt();
    }
  }, [authStatus]);

  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path={RoutesEnum.INDEX} element={<Login />} />
        {authStatus === "authenticated" ? (
          <>
            <Route path={RoutesEnum.ENTRY} element={<EntryContainer />} />
            <Route path={RoutesEnum.LOAN} element={<LoanContainer />} />
            <Route path={RoutesEnum.EGRESS} element={<EgressContainer />} />
            <Route path={RoutesEnum.ENTRY_HISTORY} element={<EntryHistory />} />
            <Route path={RoutesEnum.LOAN_HISTORY} element={<LoanHistory />} />
            <Route
              path={RoutesEnum.EGRESS_HISTORY}
              element={<EgressHistory />}
            />
            <Route path={RoutesEnum.PARTNER_LIST} element={<PartnerList />} />
            <Route path={RoutesEnum.METRICS} element={<MetricsContainer />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to={RoutesEnum.INDEX} />} />
        )}
      </Routes>
    </>
  );
}

export default App;
