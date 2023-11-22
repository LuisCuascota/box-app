import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setGetLoanDetailStatus,
  setLoanDetail,
} from "../../actions/loan.actions.ts";
import { LoanDetail } from "../../interfaces/LoanState.interfaces.ts";

export const getLoanDetail = createAction<number>("GET_LOAN_DETAIL");

export const getLoanDetailEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getLoanDetail.match),
    tap(() => dispatch(setGetLoanDetailStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios.get<LoanDetail[]>(`${ApiRoutes.GET_LOAN_DETAIL}/${payload}`).pipe(
        tap(({ data }: { data: LoanDetail[] }) => {
          dispatch(setLoanDetail(data));
          dispatch(setGetLoanDetailStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setGetLoanDetailStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
