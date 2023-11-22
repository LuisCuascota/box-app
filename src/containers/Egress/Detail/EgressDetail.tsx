import { Grid, IconButton, TextField, Typography } from "@mui/material";
import { EgressLabels } from "../../../shared/labels/Egress.labels.ts";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useContext } from "react";
import { EgressContext } from "../EgressContext.tsx";
export const EgressDetail = () => {
  const { egressDetail, onAddDetail, onDeleteDetail, onUpdateDetail } =
    useContext(EgressContext);

  return (
    <Grid container p={2} justifyContent={"space-between"}>
      <Grid item md={8}>
        <Typography>{EgressLabels.INPUT_REASON}</Typography>
      </Grid>
      <Grid item md={3}>
        <Typography>{EgressLabels.INPUT_VALUE}</Typography>
      </Grid>
      {egressDetail.map((detail, index) => (
        <Grid
          key={index}
          item
          md={12}
          container
          justifyContent={"space-between"}
          pb={1}
        >
          <Grid item md={7}>
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
          <Grid item md={3}>
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
          <Grid item md={1}>
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
      <Grid item md={12}>
        <IconButton size={"small"} color={"success"} onClick={onAddDetail}>
          <AddCircleIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};
