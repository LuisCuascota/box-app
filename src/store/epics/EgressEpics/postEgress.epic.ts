import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { NewEgress } from "../../interfaces/EgressState.interfaces.ts";
import { setPostEgressStatus } from "../../actions/egress.actions.ts";

export const postEgress = createAction<NewEgress>("POST_EGRESS");

export const postEgressEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(postEgress.match),
    tap(() => dispatch(setPostEgressStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios.post<boolean>(ApiRoutes.POST_EGRESS, payload).pipe(
        tap(() => {
          dispatch(setPostEgressStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setPostEgressStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
