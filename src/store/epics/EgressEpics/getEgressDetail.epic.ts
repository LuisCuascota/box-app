import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setEgressDetail,
  setGetEgressDetailStatus,
} from "../../actions/egress.actions.ts";
import { EgressDetail } from "../../interfaces/EgressState.interfaces.ts";

export const getEgressDetail = createAction<number>("GET_EGRESS_DETAIL");

export const getEgressDetailEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getEgressDetail.match),
    tap(() => dispatch(setGetEgressDetailStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios
        .get<EgressDetail[]>(`${ApiRoutes.GET_EGRESS_DETAIL}/${payload}`)
        .pipe(
          tap(({ data }: { data: EgressDetail[] }) => {
            dispatch(setEgressDetail(data));
            dispatch(setGetEgressDetailStatus(RequestStatusEnum.SUCCESS));
          }),
          catchError(() => {
            dispatch(setGetEgressDetailStatus(RequestStatusEnum.ERROR));

            return EMPTY;
          })
        )
    ),
    ignoreElements()
  );
