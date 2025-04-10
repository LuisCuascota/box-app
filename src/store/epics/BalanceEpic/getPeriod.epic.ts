import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { Period } from "../../interfaces/BalanceState.interfaces.ts";
import {
  setGetPeriodListStatus,
  setPeriodList,
} from "../../actions/balance.actions.ts";

export const getPeriodList = createAction("GET_PERIOD_LIST");

export const getPeriodListEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getPeriodList.match),
    tap(() => dispatch(setGetPeriodListStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios
        .get<Period[]>(ApiRoutes.GET_PERIOD_LIST, {
          params: payload,
        })
        .pipe(
          tap(({ data }: { data: Period[] }) => {
            dispatch(setPeriodList(data));
            dispatch(setGetPeriodListStatus(RequestStatusEnum.SUCCESS));
          }),
          catchError(() => {
            dispatch(setGetPeriodListStatus(RequestStatusEnum.ERROR));

            return EMPTY;
          })
        )
    ),
    ignoreElements()
  );
