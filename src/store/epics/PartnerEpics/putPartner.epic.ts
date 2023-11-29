import { createAction } from "@reduxjs/toolkit";
import { catchError, EMPTY, ignoreElements, switchMap, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { EpicCustom } from "../../interfaces/Epics.interfaces.ts";
import { ApiRoutes } from "../../../shared/constants/ApiRoutes.ts";
import axios from "../../../shared/utils/Axios.util.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { PartnerData } from "../../interfaces/PartnerState.interfaces.ts";
import { setPutPartnerStatus } from "../../actions/partner.actions.ts";

export const putPartner = createAction<PartnerData>("PUT_PARTNER");

export const putPartnerEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(putPartner.match),
    tap(() => dispatch(setPutPartnerStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios
        .put<boolean>(`${ApiRoutes.PUT_PARTNER}/${payload.dni}`, payload)
        .pipe(
          tap(() => {
            dispatch(setPutPartnerStatus(RequestStatusEnum.SUCCESS));
          }),
          catchError(() => {
            dispatch(setPutPartnerStatus(RequestStatusEnum.ERROR));

            return EMPTY;
          })
        )
    ),
    ignoreElements()
  );
