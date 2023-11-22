import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  setGetPartnerStatus,
  setPartners,
} from "../../actions/partner.actions.ts";
import { PartnerData } from "../../interfaces/PartnerState.interfaces.ts";

export const getPartners = createAction("GET_PARTNERS");

export const getPartnersEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getPartners.match),
    tap(() => dispatch(setGetPartnerStatus(RequestStatusEnum.PENDING))),
    switchMap(() =>
      axios.get<PartnerData[]>(ApiRoutes.GET_PARTNER).pipe(
        tap(({ data }: { data: PartnerData[] }) => {
          dispatch(setPartners(data));
          dispatch(setGetPartnerStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setGetPartnerStatus(RequestStatusEnum.ERROR));

          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
