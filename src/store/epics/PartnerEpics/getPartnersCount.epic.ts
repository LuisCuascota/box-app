import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setGetPartnersCountStatus,
  setPartnersCount,
} from "../../actions/partner.actions.ts";

export const getPartnersCount = createAction("GET_PARTNER_COUNT");

export const getPartnersCountEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getPartnersCount.match),
    tap(() => dispatch(setGetPartnersCountStatus(RequestStatusEnum.PENDING))),
    switchMap(() =>
      axios.get<number>(ApiRoutes.GET_PARTNER_COUNT).pipe(
        tap(({ data }: { data: number }) => {
          dispatch(setPartnersCount(data + 1));
          dispatch(setGetPartnersCountStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setGetPartnersCountStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
