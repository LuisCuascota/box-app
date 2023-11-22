import moment, { Moment } from "moment";

export const DATE_FORMAT = "YYYY-MM-DD";

export const getFistSaturday = (date: Moment): string => {
  date.add(1, "month");
  date.date(1).day(6);

  return date.format(DATE_FORMAT).toString();
};

export const getFormattedDate = (date?: string): string => {
  if (date) {
    return moment(date).isValid()
      ? moment(date).format(DATE_FORMAT).toString()
      : date;
  } else return moment().format(DATE_FORMAT).toString();
};
