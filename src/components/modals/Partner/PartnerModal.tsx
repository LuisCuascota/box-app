import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  PartnerInputEnum,
  usePartnerModalState,
} from "./state/usePartnerModalState.tsx";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { PartnerData } from "../../../store/interfaces/PartnerState.interfaces.ts";
import { DatePikerInput } from "../../input/DatePikerInput/DatePikerInput.tsx";
import SaveIcon from "@mui/icons-material/Save";

export interface PartnerModalProps {
  open: boolean;
  handleClose: () => void;
  partnerData?: PartnerData;
}

export const PartnerModal = (props: PartnerModalProps) => {
  const {
    handleUpdate,
    handleSave,
    inputValues,
    disableSave,
    disableUpdate,
    isLoading,
  } = usePartnerModalState(props);

  return (
    <Dialog maxWidth={"md"} open={props.open} onClose={props.handleClose}>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress />
      </Backdrop>
      <DialogTitle>
        <Grid container>
          <Grid item md={6}>
            {props.partnerData
              ? ComponentsLabels.PARTNER_MODAL_TITLE_EDITION
              : ComponentsLabels.PARTNER_MODAL_TITLE_CREATION}
          </Grid>
          {props.partnerData && (
            <Grid item md={6}>
              <Typography color={"red"} textAlign={"right"}>
                <b>{`Nº${props.partnerData?.number}`}</b>
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} pt={2}>
          <Grid item md={6}>
            <TextField
              fullWidth
              size={"small"}
              type={"text"}
              label={ComponentsLabels.NAMES}
              value={inputValues.names}
              onChange={(event) =>
                inputValues.onChangeInput(
                  PartnerInputEnum.NAMES,
                  event.target.value.toUpperCase()
                )
              }
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              fullWidth
              size={"small"}
              type={"text"}
              label={ComponentsLabels.SURNAMES}
              value={inputValues.surnames}
              onChange={(event) =>
                inputValues.onChangeInput(
                  PartnerInputEnum.SURNAMES,
                  event.target.value.toUpperCase()
                )
              }
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              disabled={!!props.partnerData}
              fullWidth
              size={"small"}
              type={"text"}
              label={ComponentsLabels.DNI}
              value={inputValues.dni}
              onChange={(event) =>
                inputValues.onChangeInput(
                  PartnerInputEnum.DNI,
                  event.target.value.toUpperCase()
                )
              }
            />
          </Grid>
          <Grid item md={6}>
            <DatePikerInput
              label={ComponentsLabels.BIRTHDAY}
              value={props.partnerData?.birth_day}
              onChangeDate={(date) =>
                inputValues.onChangeInput(PartnerInputEnum.BIRTHDAY, date)
              }
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              fullWidth
              size={"small"}
              type={"text"}
              label={ComponentsLabels.ADDRESS}
              value={inputValues.address}
              onChange={(event) =>
                inputValues.onChangeInput(
                  PartnerInputEnum.ADDRESS,
                  event.target.value
                )
              }
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              fullWidth
              size={"small"}
              type={"text"}
              label={ComponentsLabels.PHONE}
              value={inputValues.phone}
              onChange={(event) =>
                inputValues.onChangeInput(
                  PartnerInputEnum.PHONE,
                  event.target.value.toUpperCase()
                )
              }
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              disabled={!!props.partnerData}
              fullWidth
              size={"small"}
              type={"text"}
              label={ComponentsLabels.INITIAL_AMOUNT}
              value={inputValues.initialAmount}
              onChange={(event) =>
                inputValues.onChangeInput(
                  PartnerInputEnum.INITIAL_AMOUNT,
                  event.target.value
                )
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container pl={2} pr={2} justifyContent={"space-between"}>
          <Button
            onClick={props.handleClose}
            variant={"outlined"}
            color={"inherit"}
          >
            {ComponentsLabels.CLOSE}
          </Button>
          {props.partnerData ? (
            <Button
              disabled={disableUpdate}
              variant={"contained"}
              color={"primary"}
              onClick={handleUpdate}
              endIcon={<SaveIcon />}
            >
              {ComponentsLabels.UPDATE}
            </Button>
          ) : (
            <Button
              disabled={disableSave}
              variant={"contained"}
              color={"primary"}
              onClick={handleSave}
              endIcon={<SaveIcon />}
            >
              {ComponentsLabels.SAVE}
            </Button>
          )}
        </Grid>
      </DialogActions>
    </Dialog>
  );
};
