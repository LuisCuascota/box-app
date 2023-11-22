import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import partnerReducer from "./reducers/Partner.slice.ts";
import entryReducer from "./reducers/Entry.slice.ts";
import loanReducer from "./reducers/Loan.slice.ts";
import egressReducer from "./reducers/Egress.slice.ts";
import appEpic from "./epics/epics";

export const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }).concat(epicMiddleware),
  reducer: {
    partner: partnerReducer,
    entry: entryReducer,
    loan: loanReducer,
    egress: egressReducer,
  },
});

epicMiddleware.run((action$, state$) =>
  appEpic({ action$, dispatch: store.dispatch, state$ })
);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
