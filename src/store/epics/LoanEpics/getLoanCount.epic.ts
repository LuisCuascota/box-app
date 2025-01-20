import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setGetLoanCountStatus,
  setLoanCount,
} from "../../actions/loan.actions.ts";
import { CountFilter } from "../../interfaces/EntryState.interfaces.ts";
import { LoanCounter } from "../../interfaces/LoanState.interfaces.ts";

export const getLoanCount = createAction<CountFilter | undefined>(
  "GET_LOAN_COUNT"
);

export const getLoanCountEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getLoanCount.match),
    tap(() => dispatch(setGetLoanCountStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios
        .get<LoanCounter>(ApiRoutes.GET_LOAN_COUNT, { params: payload })
        .pipe(
          tap(({ data }: { data: LoanCounter }) => {
            dispatch(setLoanCount(data));
            dispatch(setGetLoanCountStatus(RequestStatusEnum.SUCCESS));
          }),
          catchError(() => {
            dispatch(setGetLoanCountStatus(RequestStatusEnum.ERROR));

            return EMPTY;
          })
        )
    ),
    ignoreElements()
  );
