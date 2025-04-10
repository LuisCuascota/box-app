import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { LoanDefinition } from "../../interfaces/LoanState.interfaces.ts";
import { setUpdateLoanStatus } from "../../actions/loan.actions.ts";

export const updateLoan = createAction<LoanDefinition>("UPDATE_LOAN");

export const updateLoanEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(updateLoan.match),
    tap(() => dispatch(setUpdateLoanStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios.put<boolean>(ApiRoutes.UPDATE_LOAN, payload).pipe(
        tap(() => {
          dispatch(setUpdateLoanStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setUpdateLoanStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
