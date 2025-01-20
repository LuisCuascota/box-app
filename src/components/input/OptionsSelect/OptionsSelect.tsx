import { Autocomplete, TextField } from "@mui/material";
import { SyntheticEvent, useState } from "react";

export interface SelectType {
  label: string;
  id: string;
}

export interface OptionsSelectProps {
  label: string;
  onSelect: (option: string | null) => void;
  options: SelectType[];
}

export const OptionsSelect = (props: OptionsSelectProps) => {
  const [value, setValue] = useState<SelectType | null>(null);

  const onSelect = (event: SyntheticEvent, value: SelectType | null): void => {
    event.preventDefault();

    setValue(value);
    props.onSelect(value ? value.id : null);
  };

  return (
    <Autocomplete
      value={value}
      options={props.options}
      renderInput={(params) => (
        <TextField {...params} size={"small"} label={props.label} />
      )}
      onChange={onSelect}
    />
  );
};
