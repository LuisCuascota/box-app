import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setGetTypesMetricsStatus,
  setTypesMetrics,
} from "../../actions/metrics.actions.ts";
import { TypeMetric } from "../../interfaces/MetricsState.interfaces.ts";

export const getTypesMetrics = createAction("GET_TYPES_METRICS");

export const getTypesMetricsEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getTypesMetrics.match),
    tap(() => dispatch(setGetTypesMetricsStatus(RequestStatusEnum.PENDING))),
    switchMap(() =>
      axios.get<TypeMetric[]>(ApiRoutes.GET_TYPES_METRICS).pipe(
        tap(({ data }: { data: TypeMetric[] }) => {
          dispatch(setTypesMetrics(data));
          dispatch(setGetTypesMetricsStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setGetTypesMetricsStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
