import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setGetMetricsStatus,
  setMetrics,
} from "../../actions/metrics.actions.ts";
import {
  Metrics,
  MetricsFilters,
} from "../../interfaces/MetricsState.interfaces.ts";

export const getMetrics = createAction<MetricsFilters>("GET_METRICS");

export const getMetricsEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getMetrics.match),
    tap(() => dispatch(setGetMetricsStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios
        .get<Metrics>(ApiRoutes.GET_METRICS, {
          params: payload,
        })
        .pipe(
          tap(({ data }: { data: Metrics }) => {
            dispatch(setMetrics(data));
            dispatch(setGetMetricsStatus(RequestStatusEnum.SUCCESS));
          }),
          catchError(() => {
            dispatch(setGetMetricsStatus(RequestStatusEnum.ERROR));

            return EMPTY;
          })
        )
    ),
    ignoreElements()
  );
