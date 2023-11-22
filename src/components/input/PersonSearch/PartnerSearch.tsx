import { Autocomplete, Skeleton, TextField } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { useAppSelector } from "../../../shared/hooks/Store.hook.ts";
import { selectPartners } from "../../../store/selectors/selectors.ts";
import { PartnerData } from "../../../store/interfaces/PartnerState.interfaces.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";

export interface PartnerSelector {
  label: string;
  id: number;
}

export interface PartnerSearchParams {
  value: PartnerSelector | null | undefined;
  disableSearch: boolean;
  onChangeSelector: (selected: PartnerSelector) => void;
  onCleanSelector?: () => void;
}
export const PartnerSearch = (props: PartnerSearchParams) => {
  const [personList, setPersonList] = useState<PartnerSelector[]>([]);

  const { getPartnersStatus, partners } = useAppSelector(selectPartners);

  const buildSelector = () => {
    setPersonList(
      partners.map((person: PartnerData) => ({
        id: person.number ? person.number : 0,
        label: `${person.number ? person.number : 0}-${person.names} ${
          person.surnames
        }`,
      }))
    );
  };

  const onChangeSelector = (
    _event: SyntheticEvent,
    value: PartnerSelector | null
  ): void => {
    if (value) props.onChangeSelector(value);
    else if (props.onCleanSelector) props.onCleanSelector();
  };

  useEffect(() => {
    if (getPartnersStatus === RequestStatusEnum.SUCCESS) buildSelector();
  }, [getPartnersStatus]);

  return (
    <>
      {getPartnersStatus === RequestStatusEnum.SUCCESS ? (
        <Autocomplete
          value={props.value}
          disabled={props.disableSearch}
          options={personList}
          renderInput={(params) => (
            <TextField
              {...params}
              size={"small"}
              label={ComponentsLabels.PARTNER}
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
