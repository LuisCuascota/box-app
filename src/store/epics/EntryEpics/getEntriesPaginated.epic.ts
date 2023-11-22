import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setEntries,
  setGetEntriesPaginatedStatus,
} from "../../actions/entry.actions.ts";
import {
  EntryHeader,
  EntryPagination,
} from "../../interfaces/EntryState.interfaces.ts";

export const getEntriesPaginated = createAction<EntryPagination>(
  "GET_ENTRIES_PAGINATED"
);

export const getEntriesPaginatedEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getEntriesPaginated.match),
    tap(() =>
      dispatch(setGetEntriesPaginatedStatus(RequestStatusEnum.PENDING))
    ),
    switchMap(({ payload }) =>
      axios
        .get<EntryHeader[]>(ApiRoutes.GET_ENTRIES, {
          params: payload,
        })
        .pipe(
          tap(({ data }: { data: EntryHeader[] }) => {
            dispatch(setEntries(data));
            dispatch(setGetEntriesPaginatedStatus(RequestStatusEnum.SUCCESS));
          }),
          catchError(() => {
            dispatch(setGetEntriesPaginatedStatus(RequestStatusEnum.ERROR));

            return EMPTY;
          })
        )
    ),
    ignoreElements()
  );
