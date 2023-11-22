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

export const getLoanCount = createAction("GET_LOAN_COUNT");

export const getLoanCountEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getLoanCount.match),
    tap(() => dispatch(setGetLoanCountStatus(RequestStatusEnum.PENDING))),
    switchMap(() =>
      axios.get<number>(ApiRoutes.GET_LOAN_COUNT).pipe(
        tap(({ data }: { data: number }) => {
          dispatch(setLoanCount(data + 1));
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
