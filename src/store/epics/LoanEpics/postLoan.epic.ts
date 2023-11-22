import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { LoanDefinition } from "../../interfaces/LoanState.interfaces.ts";
import { setPostLoanStatus } from "../../actions/loan.actions.ts";

export const postLoan = createAction<LoanDefinition>("POST_LOAN");

export const postLoanEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(postLoan.match),
    tap(() => dispatch(setPostLoanStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios.post<boolean>(ApiRoutes.POST_LOAN, payload).pipe(
        tap(() => {
          dispatch(setPostLoanStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setPostLoanStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
