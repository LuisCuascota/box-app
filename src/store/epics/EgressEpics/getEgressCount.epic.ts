import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setEgressCount,
  setGetEgressCountStatus,
} from "../../actions/egress.actions.ts";

export const getEgressCount = createAction("GET_EGRESS_COUNT");

export const getEgressCountEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getEgressCount.match),
    tap(() => dispatch(setGetEgressCountStatus(RequestStatusEnum.PENDING))),
    switchMap(() =>
      axios.get<number>(ApiRoutes.GET_EGRESS_COUNT).pipe(
        tap(({ data }: { data: number }) => {
          dispatch(setEgressCount(data));
          dispatch(setGetEgressCountStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setGetEgressCountStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
