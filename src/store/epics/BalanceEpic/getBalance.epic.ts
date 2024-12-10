import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { PartnerBalance } from "../../interfaces/BalanceState.interfaces.ts";
import {
  setGetBalanceStatus,
  setPartnersBalance,
} from "../../actions/balance.actions.ts";

export const getPartnersBalance = createAction("GET_PARTNERS_BALANCE");

export const getPartnersBalancesEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getPartnersBalance.match),
    tap(() => dispatch(setGetBalanceStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios
        .get<PartnerBalance[]>(ApiRoutes.GET_BALANCE, {
          params: payload,
        })
        .pipe(
          tap(({ data }: { data: PartnerBalance[] }) => {
            dispatch(setPartnersBalance(data));
            dispatch(setGetBalanceStatus(RequestStatusEnum.SUCCESS));
          }),
          catchError(() => {
            dispatch(setGetBalanceStatus(RequestStatusEnum.ERROR));

            return EMPTY;
          })
        )
    ),
    ignoreElements()
  );
