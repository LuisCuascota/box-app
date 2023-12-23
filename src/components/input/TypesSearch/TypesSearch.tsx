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
  value: TypesSelector | null | undefined;
  disableSearch: boolean;
  onChangeSelector: (selected: TypesSelector) => void;
  onCleanSelector?: () => void;
}
export const TypesSearch = (props: TypesSearchParams) => {
  const [typesList, setTypesList] = useState<TypesSelector[]>([]);

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
    if (value) props.onChangeSelector(value);
    else if (props.onCleanSelector) props.onCleanSelector();
  };

  useEffect(() => {
    if (getTypesMetricsStatus === RequestStatusEnum.SUCCESS) buildSelector();
  }, [getTypesMetricsStatus]);

  return (
    <>
      {getTypesMetricsStatus === RequestStatusEnum.SUCCESS ? (
        <Autocomplete
          value={props.value}
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
