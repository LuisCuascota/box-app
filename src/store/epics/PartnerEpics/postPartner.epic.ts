import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { PartnerData } from "../../interfaces/PartnerState.interfaces.ts";
import { setPostPartnerStatus } from "../../actions/partner.actions.ts";

export const postPartner = createAction<PartnerData>("POST_PARTNER");

export const postPartnerEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(postPartner.match),
    tap(() => dispatch(setPostPartnerStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios.post<boolean>(ApiRoutes.POST_PARTNER, payload).pipe(
        tap(() => {
          dispatch(setPostPartnerStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setPostPartnerStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
