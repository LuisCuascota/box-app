import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { setPostEntryStatus } from "../../actions/entry.actions.ts";
import { NewEntry } from "../../interfaces/EntryState.interfaces.ts";

export const postEntry = createAction<NewEntry>("POST_ENTRY");

export const postEntryEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(postEntry.match),
    tap(() => dispatch(setPostEntryStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios.post<boolean>(ApiRoutes.POST_ENTRY, payload).pipe(
        tap(() => {
          dispatch(setPostEntryStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setPostEntryStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
