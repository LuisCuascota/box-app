import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setEgressList,
  setGetEgressPaginatedStatus,
} from "../../actions/egress.actions.ts";
import {
  EgressHeader,
  EgressPagination,
} from "../../interfaces/EgressState.interfaces.ts";

export const getEgressPaginated = createAction<EgressPagination>(
  "GET_EGRESS_PAGINATED"
);

export const getEgressPaginatedEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getEgressPaginated.match),
    tap(() => dispatch(setGetEgressPaginatedStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios
        .get<EgressHeader[]>(ApiRoutes.GET_EGRESS, {
          params: payload,
        })
        .pipe(
          tap(({ data }: { data: EgressHeader[] }) => {
            dispatch(setEgressList(data));
            dispatch(setGetEgressPaginatedStatus(RequestStatusEnum.SUCCESS));
          }),
          catchError(() => {
            dispatch(setGetEgressPaginatedStatus(RequestStatusEnum.ERROR));

            return EMPTY;
          })
        )
    ),
    ignoreElements()
  );
