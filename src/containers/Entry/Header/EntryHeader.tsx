import {
  Backdrop,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { PartnerSearch } from "../../../components/input/PersonSearch/PartnerSearch.tsx";
import { useContext } from "react";
import { EntryContext } from "../EntryContext.tsx";
import { useAppSelector } from "../../../shared/hooks/Store.hook.ts";
import {
  selectEntryCount,
  selectEntryCountStatus,
} from "../../../store/selectors/selectors.ts";
import { EntryLabels } from "../../../shared/labels/Entry.labels.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { SelectPaymentMethod } from "../../../components/input/SelectPaymentMethod/SelectPaymentMethod.tsx";

export const EntryHeader = () => {
  const {
    disableSearch,
    onChangePaymentMethod,
    onChangePartnerSelector,
    paymentMethod,
    partnerSelected,
    isLoading,
  } = useContext(EntryContext);
  const count = useAppSelector(selectEntryCount);
  const countStatus = useAppSelector(selectEntryCountStatus);

  return (
    <Grid container p={2}>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress />
      </Backdrop>
      <Grid item md={12} xs={12}>
        <Typography textAlign={"center"} variant={"h5"}>
          {EntryLabels.TITLE}
        </Typography>
      </Grid>
      <Grid item md={5} xs={12}>
        <Typography>{EntryLabels.SUBTITLE}</Typography>
      </Grid>
      <Grid item md={5} xs={8}>
        <SelectPaymentMethod
          onChangePaymentMethod={onChangePaymentMethod}
          value={paymentMethod}
        />
      </Grid>
      <Grid item md={2} xs={4}>
        <Typography textAlign={"right"} color={"red"}>
          {countStatus === RequestStatusEnum.SUCCESS ? (
            <b>{`Nº${count}`}</b>
          ) : (
            <Skeleton height={40} />
          )}
        </Typography>
      </Grid>
      <Grid item md={5} xs={6}>
        <Typography>{EntryLabels.PARTNER_INPUT}</Typography>
      </Grid>
      <Grid item md={7} xs={6}>
        <PartnerSearch
          disableSearch={disableSearch}
          onChangeSelector={onChangePartnerSelector}
          value={partnerSelected}
        />
      </Grid>
    </Grid>
  );
};
