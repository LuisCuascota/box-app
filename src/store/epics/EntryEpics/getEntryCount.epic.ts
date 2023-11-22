import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setCount,
  setGetEntryCountStatus,
} from "../../actions/entry.actions.ts";

export const getEntryCount = createAction("GET_ENTRY_COUNT");

export const getEntryCountEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getEntryCount.match),
    tap(() => dispatch(setGetEntryCountStatus(RequestStatusEnum.PENDING))),
    switchMap(() =>
      axios.get<number>(ApiRoutes.GET_ENTRY_COUNT).pipe(
        tap(({ data }: { data: number }) => {
          dispatch(setCount(data - 1));
          dispatch(setGetEntryCountStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setGetEntryCountStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
