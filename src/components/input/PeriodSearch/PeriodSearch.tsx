import { Autocomplete, Skeleton, TextField } from "@mui/material";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../shared/hooks/Store.hook.ts";
import { selectGetPeriodList } from "../../../store/selectors/selectors.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { Period } from "../../../store/interfaces/BalanceState.interfaces.ts";
import { getFormattedDate } from "../../../shared/utils/Date.utils.ts";

export interface PeriodSelector {
  label: string;
  id: number;
}

export interface PeriodSearchParams {
  disableSearch: boolean;
  onChangeSelector: (selected: PeriodSelector | null) => void;
}
export const PeriodSearch = (props: PeriodSearchParams) => {
  const [value, setValue] = useState<PeriodSelector | null>(null);
  const { getPeriodListStatus, periodList } =
    useAppSelector(selectGetPeriodList);

  const buildItem = (period: Period): PeriodSelector => ({
    id: period.id,
    label: `${getFormattedDate(period.start_date)}-${period.end_date ? getFormattedDate(period.end_date) : "ACTUAL"}`,
  });

  const periodSelector = useMemo(
    () => periodList.map((period: Period) => buildItem(period)),
    [periodList]
  );

  const defaultPeriod = useMemo(() => {
    const currentPeriod = periodList.find((period) => period.enabled);

    return currentPeriod ? buildItem(currentPeriod) : null;
  }, [periodList]);

  const onChangeSelector = (
    _event: SyntheticEvent,
    value: PeriodSelector | null
  ): void => {
    props.onChangeSelector(value);
    setValue(value);
  };

  useEffect(() => {
    if (
      getPeriodListStatus === RequestStatusEnum.SUCCESS &&
      !value &&
      defaultPeriod
    ) {
      props.onChangeSelector(defaultPeriod);
    }
  }, [defaultPeriod, getPeriodListStatus, props, value]);

  return (
    <>
      {getPeriodListStatus === RequestStatusEnum.SUCCESS ? (
        <Autocomplete
          disableClearable={true}
          value={value ?? defaultPeriod ?? undefined}
          disabled={props.disableSearch}
          options={periodSelector}
          renderInput={(params) => (
            <TextField
              {...params}
              size={"small"}
              label={ComponentsLabels.PERIOD}
            />
          )}
          onChange={onChangeSelector}
        />
      ) : (
        <Skeleton height={50} />
      )}
    </>
  );
};
