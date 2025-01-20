import {
  Backdrop,
  CircularProgress,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { EgressLabels } from "../../../shared/labels/Egress.labels.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { useContext } from "react";
import { EgressContext } from "../EgressContext.tsx";
import { useAppSelector } from "../../../shared/hooks/Store.hook.ts";
import {
  selectEgressCount,
  selectEgressCountStatus,
} from "../../../store/selectors/selectors.ts";
import { TypesSearch } from "../../../components/input/TypesSearch/TypesSearch.tsx";

export const EgressHeader = () => {
  const {
    beneficiary,
    onChangeBeneficiary,
    isLoading,
    onChangeCategorySelector,
  } = useContext(EgressContext);

  const count = useAppSelector(selectEgressCount);
  const countStatus = useAppSelector(selectEgressCountStatus);

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
          {EgressLabels.TITLE}
        </Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Typography>{EgressLabels.SUBTITLE}</Typography>
      </Grid>
      <Grid item md={2} xs={4}>
        <Typography textAlign={"right"} color={"red"}>
          {countStatus === RequestStatusEnum.SUCCESS ? (
            <b>{`Nº${count.count + 1}`}</b>
          ) : (
            <Skeleton height={40} />
          )}
        </Typography>
      </Grid>
      <Grid item md={12} xs={12} pt={2}>
        <TextField
          fullWidth
          label={EgressLabels.INPUT_BENEFICIARY}
          size={"small"}
          value={beneficiary}
          onChange={onChangeBeneficiary}
        />
      </Grid>
      <Grid item md={12} xs={12} pt={2}>
        <TypesSearch
          disableSearch={false}
          onChangeSelector={onChangeCategorySelector}
        />
      </Grid>
    </Grid>
  );
};
