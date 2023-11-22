import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setEntryAmounts,
  setGetEntryAmountsStatus,
} from "../../actions/entry.actions.ts";
import { EntryAmount } from "../../interfaces/EntryState.interfaces.ts";

export const getEntryAmounts = createAction<number>("GET_ENTRY_AMOUNTS");

export const getEntryAmountsEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getEntryAmounts.match),
    tap(() => dispatch(setGetEntryAmountsStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios
        .get<EntryAmount[]>(`${ApiRoutes.GET_ENTRY_AMOUNTS}/${payload}`)
        .pipe(
          tap(({ data }: { data: EntryAmount[] }) => {
            dispatch(setEntryAmounts(data));
            dispatch(setGetEntryAmountsStatus(RequestStatusEnum.SUCCESS));
          }),
          catchError(() => {
            dispatch(setGetEntryAmountsStatus(RequestStatusEnum.ERROR));

            return EMPTY;
          })
        )
    ),
    ignoreElements()
  );
