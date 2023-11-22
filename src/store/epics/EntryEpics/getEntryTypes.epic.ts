import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setGetEntryTypesStatus,
  setTypes,
} from "../../actions/entry.actions.ts";
import { EntryType } from "../../interfaces/EntryState.interfaces.ts";

export const getEntryTypes = createAction("GET_ENTRY_TYPES");

export const getEntryTypesEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getEntryTypes.match),
    tap(() => dispatch(setGetEntryTypesStatus(RequestStatusEnum.PENDING))),
    switchMap(() =>
      axios.get<EntryType[]>(ApiRoutes.GET_ENTRY_TYPES).pipe(
        tap(({ data }: { data: EntryType[] }) => {
          dispatch(setTypes(data));
          dispatch(setGetEntryTypesStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setGetEntryTypesStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
