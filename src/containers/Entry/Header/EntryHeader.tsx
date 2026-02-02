import {
  alpha,
  Backdrop,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Skeleton,
  Typography,
} from "@mui/material";
import { cardContainerSx, titleSx } from "../../../shared/styles/Ui.styles.ts";
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

export const EntryHeader = () => {
  const { disableSearch, onChangePartnerSelector, isLoading } =
    useContext(EntryContext);
  const count = useAppSelector(selectEntryCount);
  const countStatus = useAppSelector(selectEntryCountStatus);

  return (
    <Grid container p={1} spacing={1}>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress />
      </Backdrop>
      <Grid size={12}>
        <Box sx={(theme) => cardContainerSx(theme)}>
          <Stack spacing={0.5}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" sx={(theme) => titleSx(theme)}>
                {EntryLabels.TITLE}
              </Typography>
              {countStatus === RequestStatusEnum.SUCCESS ? (
                <Chip
                  color="secondary"
                  variant="outlined"
                  label={`Nº${count.count + 1}`}
                  size="small"
                  sx={(theme) => ({
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  })}
                />
              ) : (
                <Skeleton height={26} width={70} />
              )}
            </Stack>
            <Grid container spacing={1} alignItems="center">
              <Grid size={5}>
                <Typography variant="caption" color="text.secondary">
                  {EntryLabels.PARTNER_INPUT}
                </Typography>
              </Grid>
              <Grid size={7}>
                <PartnerSearch
                  disableSearch={disableSearch}
                  onChangeSelector={onChangePartnerSelector}
                />
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};
