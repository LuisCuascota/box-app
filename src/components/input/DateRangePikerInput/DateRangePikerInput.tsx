import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { FormEvent, useState } from "react";
import moment, { Moment } from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Box, IconButton } from "@mui/material";
import { DATE_FORMAT } from "../../../shared/utils/Date.utils.ts";
import SearchIcon from "@mui/icons-material/Search";
import {
  DatePicker,
  DatePickerSlotsComponentsProps,
} from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";

export interface DatePikerInputProps {
  onChangeDate: (from: string, to: string) => void;
  defaultFrom: string;
  defaultTo: string;
}

const rangeSlotProps: DatePickerSlotsComponentsProps<Moment> = {
  textField: {
    size: "small",
    sx: {
      "& .MuiInputBase-root": {
        paddingRight: "4px",
        "& .MuiInputBase-input": {
          paddingLeft: "7px",
        },
      },
    },
  },
  openPickerButton: {
    size: "small",
  },
  openPickerIcon: {
    fontSize: "small",
  },
};

export const DateRangePikerInput = (props: DatePikerInputProps) => {
  const [fromDate, setFromDate] = useState<Moment | null>(
    moment(props.defaultFrom)
  );
  const [toDate, setToDate] = useState<Moment | null>(moment(props.defaultTo));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (fromDate?.isValid() && toDate?.isValid()) {
      props.onChangeDate(
        fromDate?.format(DATE_FORMAT),
        toDate?.format(DATE_FORMAT)
      );
    }
  };

  const handleClear = (e: FormEvent) => {
    e.preventDefault();

    const defaultFromDate = moment(props.defaultFrom);
    const defaultToDate = moment(props.defaultTo);

    setFromDate(defaultFromDate);
    setToDate(defaultToDate);

    props.onChangeDate(
      defaultFromDate.format(DATE_FORMAT),
      defaultToDate.format(DATE_FORMAT)
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} onReset={handleClear}>
      <Box display={"flex"}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label={"Desde"}
            format={DATE_FORMAT}
            slotProps={rangeSlotProps}
            value={fromDate}
            onChange={(newValue) => {
              setFromDate(newValue);
            }}
          />
          <Box pr={1} />
          <DatePicker
            label={"Hasta"}
            format={DATE_FORMAT}
            slotProps={rangeSlotProps}
            value={toDate}
            onChange={(newValue) => {
              setToDate(newValue);
            }}
          />
        </LocalizationProvider>
        <IconButton color={"primary"} type={"submit"} size={"small"}>
          <SearchIcon />
        </IconButton>
        <IconButton color={"error"} type={"reset"} size={"small"}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
