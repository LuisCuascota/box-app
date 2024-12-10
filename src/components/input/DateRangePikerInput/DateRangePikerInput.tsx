import AdapterMoment from "@mui/lab/AdapterMoment";
import { FormEvent, useState } from "react";
import moment, { Moment } from "moment";
import { DateRange, DateRangePicker, LocalizationProvider } from "@mui/lab";
import { Box, IconButton, TextField } from "@mui/material";
import { DATE_FORMAT } from "../../../shared/utils/Date.utils.ts";
import SearchIcon from "@mui/icons-material/Search";

export interface DatePikerInputProps {
  onChangeDate: (from: string, to: string) => void;
  from: string;
  to: string;
}

export const DateRangePikerInput = (props: DatePikerInputProps) => {
  const [rangeDate, setRangeDate] = useState<DateRange<Moment>>(() => {
    console.log("INIT");
    const fromDate: Moment = moment(props.from);
    const toDate: Moment = moment(props.to);

    return [fromDate, toDate];
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const [fromDate, toDate] = rangeDate;

    if (fromDate?.isValid() && toDate?.isValid()) {
      console.log(rangeDate);
      setRangeDate(rangeDate);

      props.onChangeDate(
        fromDate.format(DATE_FORMAT),
        toDate.format(DATE_FORMAT)
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box display={"flex"}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateRangePicker
            disableOpenPicker={true}
            onChange={(newValue: DateRange<Moment>) => {
              console.log("-->", newValue);
              setRangeDate(newValue);
            }}
            value={rangeDate}
            inputFormat={DATE_FORMAT}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} size={"small"} label={"Desde"} />
                <Box pl={1} />
                <TextField {...endProps} size={"small"} label={"Hasta"} />
              </>
            )}
          />
        </LocalizationProvider>
        <IconButton color={"primary"} type={"submit"}>
          <SearchIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
