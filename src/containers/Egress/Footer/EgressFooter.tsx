import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { DatePikerInput } from "../../../components/input/DatePikerInput/DatePikerInput.tsx";
import { useContext } from "react";
import { EgressContext } from "../EgressContext.tsx";
import { EgressLabels } from "../../../shared/labels/Egress.labels.ts";
import { BillDetailModal } from "../../../components/modals/BillDetail/BillDetailModal.tsx";

export const EgressFooter = () => {
  const {
    isOpenSaveDialog,
    disableSave,
    totalDischarge,
    onChangeEgressDate,
    onCancelEgress,
    onSaveEgress,
    onCloseSaveDialog,
    onPrintEgress,
    isOpenBillDetailModal,
    onOpenBillDetailModal,
  } = useContext(EgressContext);

  return (
    <Box pl={2} pr={2}>
      <Dialog open={isOpenSaveDialog} onClose={onCloseSaveDialog}>
        <DialogTitle>{EgressLabels.SUCCESS_SAVE_MODAL_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {EgressLabels.SUCCESS_SAVE_MODAL_MESSAGE}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onPrintEgress}>{EgressLabels.PRINT}</Button>
          <Button onClick={onCloseSaveDialog}> {EgressLabels.CLOSE}</Button>
        </DialogActions>
      </Dialog>
      <BillDetailModal
        open={isOpenBillDetailModal}
        onDispatchBillDetail={onSaveEgress}
        totalAmount={totalDischarge}
      />
      <Box display={"flex"} justifyContent={"space-between"} pb={2}>
        <Box display={"flex"}>
          <Typography pr={2}>{EgressLabels.DATE}</Typography>
          <DatePikerInput onChangeDate={onChangeEgressDate} />
        </Box>
        <Box display={"flex"}>
          <Typography pr={2}>{EgressLabels.TOTAL}</Typography>
          <TextField
            type={"number"}
            size={"small"}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            value={totalDischarge}
          />
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} pb={2}>
        <Button variant={"outlined"} onClick={onCancelEgress}>
          {EgressLabels.CANCEL}
        </Button>
        <Button
          endIcon={<SaveIcon />}
          variant="contained"
          disabled={disableSave}
          onClick={onOpenBillDetailModal}
        >
          {EgressLabels.SAVE}
        </Button>
      </Box>
    </Box>
  );
};
