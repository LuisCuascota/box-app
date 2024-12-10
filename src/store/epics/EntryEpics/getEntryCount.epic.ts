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
import { CountFilter } from "../../interfaces/EntryState.interfaces.ts";

export const getEntryCount = createAction<CountFilter | undefined>(
  "GET_ENTRY_COUNT"
);

export const getEntryCountEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getEntryCount.match),
    tap(() => dispatch(setGetEntryCountStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios.get<number>(ApiRoutes.GET_ENTRY_COUNT, { params: payload }).pipe(
        tap(({ data }: { data: number }) => {
          dispatch(setCount(data));
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
