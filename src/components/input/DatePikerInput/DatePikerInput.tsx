import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { DATE_FORMAT } from "../../../shared/utils/Date.utils.ts";

export interface DatePikerInputProps {
  onChangeDate: (date: string) => void;
}
export const DatePikerInput = (props: DatePikerInputProps) => {
  const [dateValue, setDateValue] = useState<Moment | null>(moment());

  useEffect(() => {
    if (dateValue) props.onChangeDate(dateValue.format(DATE_FORMAT).toString());
  }, [dateValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
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
