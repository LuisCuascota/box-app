import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setEntryDetail,
  setGetEntryDetailStatus,
} from "../../actions/entry.actions.ts";
import { EntryDetail } from "../../interfaces/EntryState.interfaces.ts";

export const getEntryDetail = createAction<number>("GET_ENTRY_DETAIL");

export const getEntryDetailEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getEntryDetail.match),
    tap(() => dispatch(setGetEntryDetailStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios.get<EntryDetail[]>(`${ApiRoutes.GET_ENTRY_DETAIL}/${payload}`).pipe(
        tap(({ data }: { data: EntryDetail[] }) => {
          dispatch(setEntryDetail(data));
          dispatch(setGetEntryDetailStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setGetEntryDetailStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
