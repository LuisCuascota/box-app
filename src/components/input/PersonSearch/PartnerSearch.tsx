import { Autocomplete, Skeleton, TextField } from "@mui/material";
import { SyntheticEvent, useMemo, useState } from "react";
import { useAppSelector } from "../../../shared/hooks/Store.hook.ts";
import { selectPartners } from "../../../store/selectors/selectors.ts";
import { PartnerData } from "../../../store/interfaces/PartnerState.interfaces.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";

export interface PartnerSelector {
  label: string;
  id: number;
  currentSaving: number;
}

export interface PartnerSearchParams {
  disableSearch: boolean;
  onChangeSelector: (selected: PartnerSelector | null) => void;
}
export const PartnerSearch = (props: PartnerSearchParams) => {
  const [value, setValue] = useState<PartnerSelector | null>(null);
  const { getPartnersStatus, partners } = useAppSelector(selectPartners);

  const personList = useMemo(
    () =>
      partners.map((person: PartnerData) => ({
        id: person.number ? person.number : 0,
        label: `${person.number ? person.number : 0}-${person.names} ${
          person.surnames
        }`,
        currentSaving: person.current_saving!,
      })),
    [partners]
  );

  const onChangeSelector = (
    _event: SyntheticEvent,
    value: PartnerSelector | null
  ): void => {
    props.onChangeSelector(value);
    setValue(value);
  };

  return (
    <>
      {getPartnersStatus === RequestStatusEnum.SUCCESS ? (
        <Autocomplete
          value={value}
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
