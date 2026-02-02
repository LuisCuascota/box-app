import {
  alpha,
  Box,
  Backdrop,
  CircularProgress,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { cardContainerSx, subtitleSx, titleSx } from "../../../shared/styles/Ui.styles.ts";
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
    <Grid container p={1}>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress />
      </Backdrop>
      <Grid size={12}>
        <Box sx={(theme) => ({ ...cardContainerSx(theme), mb: 1 })}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid size={12}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant={"h6"} sx={(theme) => titleSx(theme)}>
                  {EgressLabels.TITLE}
                </Typography>
                {countStatus === RequestStatusEnum.SUCCESS ? (
                  <Box
                    sx={(theme) => ({
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.5
                      )}`,
                      color: theme.palette.primary.main,
                      borderRadius: 999,
                      px: 1.25,
                      py: 0.25,
                      fontWeight: 700,
                      fontSize: 12,
                    })}
                  >
                    {`Nº${count.count + 1}`}
                  </Box>
                ) : (
                  <Skeleton height={26} width={70} />
                )}
              </Box>
            </Grid>
            <Grid size={12}>
              <Typography variant="caption" sx={(theme) => subtitleSx(theme)}>
                {EgressLabels.SUBTITLE}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Box display="flex" flexDirection="column" gap={0.5} sx={{ width: "100%" }}>
                <Typography variant="caption" color="text.secondary">
                  {EgressLabels.INPUT_BENEFICIARY}
                </Typography>
                <TextField
                  fullWidth
                  size={"small"}
                  value={beneficiary}
                  onChange={onChangeBeneficiary}
                />
              </Box>
            </Grid>
            <Grid size={6}>
              <Box display="flex" flexDirection="column" gap={0.5} sx={{ width: "100%" }}>
                <Typography variant="caption" color="text.secondary">
                  {EgressLabels.INPUT_CATEGORY}
                </Typography>
                <TypesSearch
                  disableSearch={false}
                  onChangeSelector={onChangeCategorySelector}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
