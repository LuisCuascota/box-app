import { alpha, Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import { EgressLabels } from "../../../shared/labels/Egress.labels.ts";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useContext } from "react";
import { EgressContext } from "../EgressContext.tsx";
export const EgressDetail = () => {
  const { egressDetail, onAddDetail, onDeleteDetail, onUpdateDetail } =
    useContext(EgressContext);

  return (
    <Grid
      container
      p={1}
      justifyContent={"space-between"}
      sx={(theme) => ({
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 1.5,
        backgroundColor: "#fff",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
        mb: 1,
      })}
    >
      <Grid size={8}>
        <Typography variant="caption" color="text.secondary">
          {EgressLabels.INPUT_REASON}
        </Typography>
      </Grid>
      <Grid size={3}>
        <Typography variant="caption" color="text.secondary">
          {EgressLabels.INPUT_VALUE}
        </Typography>
      </Grid>
      {egressDetail.map((detail, index) => (
        <Grid
          key={index}
          size={12}
          container
          spacing={1}
          alignItems="center"
          pb={1}
        >
          <Grid size={8}>
            <TextField
              type={"text"}
              fullWidth
              size={"small"}
              value={detail.description}
              onChange={(event) =>
                onUpdateDetail(index, event.target.value, detail.value)
              }
            />
          </Grid>
          <Grid size={3}>
            <TextField
              type={"number"}
              fullWidth
              size={"small"}
              value={detail.value}
              onChange={(event) =>
                onUpdateDetail(index, detail.description, +event.target.value)
              }
            />
          </Grid>
          <Grid size={1}>
            {egressDetail.length > 1 && (
              <IconButton
                size={"small"}
                color={"error"}
                onClick={() => onDeleteDetail(index)}
              >
                <CancelIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      ))}
      <Grid size={12}>
        <Box display="flex" justifyContent="flex-start">
          <IconButton size={"small"} color={"success"} onClick={onAddDetail}>
            <AddCircleIcon />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
};
