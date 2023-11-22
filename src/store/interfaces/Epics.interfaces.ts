import { Action } from "@reduxjs/toolkit";
import { Observable } from "rxjs";
import { StateObservable } from "redux-observable";
import { AppDispatch } from "../store.ts";

interface EpicData<Input, State> {
  action$: Observable<Input>;
  state$?: StateObservable<State>;
  dispatch: AppDispatch;
}

export interface EpicCustom<Input = Action, Output = Action, State = any> {
  (epicData: EpicData<Input, State>): Observable<Output>;
}
