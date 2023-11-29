import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { setDeletePartnerStatus } from "../../actions/partner.actions.ts";

export const deletePartner = createAction<number>("DELETE_PARTNER");

export const deletePartnerEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(deletePartner.match),
    tap(() => dispatch(setDeletePartnerStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios.delete<boolean>(`${ApiRoutes.DELETE_PARTNER}/${payload}`).pipe(
        tap(() => {
          dispatch(setDeletePartnerStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setDeletePartnerStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
