import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { Loan, LoanPagination } from "../../interfaces/LoanState.interfaces.ts";
import {
  setGetLoansPaginatedStatus,
  setLoans,
} from "../../actions/loan.actions.ts";

export const getLoansPaginated = createAction<LoanPagination>(
  "GET_LOANS_PAGINATED"
);

export const getLoansPaginatedEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getLoansPaginated.match),
    tap(() => dispatch(setGetLoansPaginatedStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios
        .get<Loan[]>(ApiRoutes.GET_LOAN, {
          params: payload,
        })
        .pipe(
          tap(({ data }: { data: Loan[] }) => {
            dispatch(setLoans(data));
            dispatch(setGetLoansPaginatedStatus(RequestStatusEnum.SUCCESS));
          }),
          catchError(() => {
            dispatch(setGetLoansPaginatedStatus(RequestStatusEnum.ERROR));

            return EMPTY;
          })
        )
    ),
    ignoreElements()
  );
