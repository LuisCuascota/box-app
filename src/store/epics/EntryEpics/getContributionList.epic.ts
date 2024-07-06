import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setContributionList,
  setGetContributionListStatus,
} from "../../actions/entry.actions.ts";
import { Contribution } from "../../interfaces/EntryState.interfaces.ts";

export const getContributionList = createAction<number>(
  "GET_CONTRIBUTION_LIST"
);

export const getContributionListEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getContributionList.match),
    tap(() =>
      dispatch(setGetContributionListStatus(RequestStatusEnum.PENDING))
    ),
    switchMap(({ payload }) =>
      axios
        .get<Contribution[]>(`${ApiRoutes.GET_CONTRIBUTIONS}/${payload}`)
        .pipe(
          tap(({ data }: { data: Contribution[] }) => {
            dispatch(setContributionList(data));
            dispatch(setGetContributionListStatus(RequestStatusEnum.SUCCESS));
          }),
          catchError(() => {
            dispatch(setGetContributionListStatus(RequestStatusEnum.ERROR));

            return EMPTY;
          })
        )
    ),
    ignoreElements()
  );
