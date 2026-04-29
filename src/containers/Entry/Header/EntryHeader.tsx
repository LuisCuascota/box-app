import {
  alpha,
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Stack,
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

export const EntryHeader = () => {
  const { disableSearch, onChangePartnerSelector, isLoading } =
    useContext(EntryContext);
  const count = useAppSelector(selectEntryCount);
  const countStatus = useAppSelector(selectEntryCountStatus);

  return (
    <>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress />
      </Backdrop>
      <Box
        sx={(theme) => ({
          px: 3,
          py: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 100%)`,
          color: theme.palette.primary.contrastText,
        })}
      >
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight={700} color="inherit">
              {EntryLabels.TITLE}
            </Typography>
            {countStatus === RequestStatusEnum.SUCCESS ? (
              <Box
                sx={(theme) => ({
                  display: "flex",
                  alignItems: "baseline",
                  gap: 0.5,
                  backgroundColor: "#fff",
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 0.5,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.dark, 0.3)}`,
                })}
              >
                <Typography
                  variant="body2"
                  sx={(theme) => ({
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  })}
                >
                  Nº
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "#D32F2F",
                    lineHeight: 1.2,
                  }}
                >
                  {count.count + 1}
                </Typography>
              </Box>
            ) : (
              <Skeleton
                height={36}
                width={90}
                sx={{ bgcolor: alpha("#fff", 0.2), borderRadius: 1.5 }}
              />
            )}
          </Stack>
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="body2" color="inherit" sx={{ opacity: 0.85 }}>
                {EntryLabels.PARTNER_INPUT}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
              <PartnerSearch
                disableSearch={disableSearch}
                onChangeSelector={onChangePartnerSelector}
              />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
};
