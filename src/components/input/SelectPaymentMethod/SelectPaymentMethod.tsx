import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { PaymentMethodEnum } from "../../../shared/enums/PaymentMethod.enum.ts";
import { EntryLabels } from "../../../shared/labels/Entry.labels.ts";
import { ChangeEvent } from "react";

export interface SelectPaymentMethodProps {
  onChangePaymentMethod: (method: PaymentMethodEnum) => void;
  value: string | null | undefined;
}

export const SelectPaymentMethod = (props: SelectPaymentMethodProps) => {
  const onChangeRadioButton = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChangePaymentMethod(event.target.value as PaymentMethodEnum);
  };

  return (
    <RadioGroup row onChange={onChangeRadioButton} value={props.value}>
      <FormControlLabel
        value={PaymentMethodEnum.CASH}
        control={<Radio size={"small"} />}
        label={EntryLabels.IS_CASH}
      />
      <FormControlLabel
        value={PaymentMethodEnum.TRANSFER}
        control={<Radio size={"small"} />}
        label={EntryLabels.IS_TRANSFER}
      />
    </RadioGroup>
  );
};
