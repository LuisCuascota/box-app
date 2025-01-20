import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setEgressCount,
  setGetEgressCountStatus,
} from "../../actions/egress.actions.ts";
import {
  EgressCountFilter,
  LoanCounter,
} from "../../interfaces/EgressState.interfaces.ts";

export const getEgressCount = createAction<EgressCountFilter | undefined>(
  "GET_EGRESS_COUNT"
);

export const getEgressCountEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getEgressCount.match),
    tap(() => dispatch(setGetEgressCountStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios
        .get<LoanCounter>(ApiRoutes.GET_EGRESS_COUNT, { params: payload })
        .pipe(
          tap(({ data }: { data: LoanCounter }) => {
            dispatch(setEgressCount(data));
            dispatch(setGetEgressCountStatus(RequestStatusEnum.SUCCESS));
          }),
          catchError(() => {
            dispatch(setGetEgressCountStatus(RequestStatusEnum.ERROR));

            return EMPTY;
          })
        )
    ),
    ignoreElements()
  );
