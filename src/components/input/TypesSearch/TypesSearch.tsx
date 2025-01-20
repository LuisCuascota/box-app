import { Autocomplete, Skeleton, TextField } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { useAppSelector } from "../../../shared/hooks/Store.hook.ts";
import { selectMetrics } from "../../../store/selectors/selectors.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { TypeMetric } from "../../../store/interfaces/MetricsState.interfaces.ts";

export interface TypesSelector {
  label: string;
  id: number;
}

export interface TypesSearchParams {
  disableSearch: boolean;
  onChangeSelector: (selected: TypesSelector | null) => void;
}
export const TypesSearch = (props: TypesSearchParams) => {
  const [typesList, setTypesList] = useState<TypesSelector[]>([]);
  const [value, setValue] = useState<TypesSelector | null>(null);

  const { getTypesMetricsStatus, typesMetrics } = useAppSelector(selectMetrics);

  const buildSelector = () => {
    setTypesList(
      typesMetrics.map((type: TypeMetric) => ({
        id: type.id,
        label: `${type.description}-($${type.sum})`,
      }))
    );
  };

  const onChangeSelector = (
    _event: SyntheticEvent,
    value: TypesSelector | null
  ): void => {
    props.onChangeSelector(value);
    setValue(value);
  };

  useEffect(() => {
    if (getTypesMetricsStatus === RequestStatusEnum.SUCCESS) buildSelector();
  }, [getTypesMetricsStatus]);

  return (
    <>
      {getTypesMetricsStatus === RequestStatusEnum.SUCCESS ? (
        <Autocomplete
          value={value}
          disabled={props.disableSearch}
          options={typesList}
          renderInput={(params) => (
            <TextField
              {...params}
              size={"small"}
              label={ComponentsLabels.CATEGORY}
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
