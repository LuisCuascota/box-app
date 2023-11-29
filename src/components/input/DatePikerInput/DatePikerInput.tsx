import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { DATE_FORMAT } from "../../../shared/utils/Date.utils.ts";

export interface DatePikerInputProps {
  onChangeDate: (date: string) => void;
  value?: string | null;
  label?: string;
}
export const DatePikerInput = (props: DatePikerInputProps) => {
  const [dateValue, setDateValue] = useState<Moment | null>(
    moment(props.value ? props.value : undefined)
  );

  useEffect(() => {
    if (dateValue) props.onChangeDate(dateValue.format(DATE_FORMAT).toString());
    else props.onChangeDate("");
  }, [dateValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={props.label}
        format={DATE_FORMAT}
        slotProps={{
          textField: {
            size: "small",
          },
        }}
        value={dateValue}
        onChange={(newValue) => {
          setDateValue(newValue);
        }}
      />
    </LocalizationProvider>
  );
};
