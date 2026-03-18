import { Action, combineReducers, configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { Observable } from "rxjs";
import partnerReducer from "./reducers/Partner.slice.ts";
import entryReducer from "./reducers/Entry.slice.ts";
import loanReducer from "./reducers/Loan.slice.ts";
import egressReducer from "./reducers/Egress.slice.ts";
import metricsReducer from "./reducers/Metrics.slice.ts";
import balanceReducer from "./reducers/Balance.slice.ts";

import appEpic from "./epics/epics";

const rootReducer = combineReducers({
  partner: partnerReducer,
  entry: entryReducer,
  loan: loanReducer,
  egress: egressReducer,
  metrics: metricsReducer,
  balance: balanceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }).concat(epicMiddleware),
  reducer: rootReducer,
});

epicMiddleware.run(
  (action$, state$) =>
    appEpic({ action$, dispatch: store.dispatch, state$ }) as Observable<Action>
);

export type AppDispatch = typeof store.dispatch;
