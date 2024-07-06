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
import { EntryContext } from "../EntryContext.tsx";
import { EntryLabels } from "../../../shared/labels/Entry.labels.ts";
import { BillDetailModal } from "../../../components/modals/BillDetail/BillDetailModal.tsx";

export const EntryFooter = () => {
  const {
    isOpenSaveDialog,
    disableSave,
    totalToPay,
    onChangeEntryDate,
    onCancelEntry,
    onSaveEntry,
    onCloseSaveDialog,
    onPrintEntry,
    onOpenBillDetailModal,
    isOpenBillDetailModal,
  } = useContext(EntryContext);

  return (
    <Box pl={2} pr={2}>
      <Dialog open={isOpenSaveDialog} onClose={onCloseSaveDialog}>
        <DialogTitle>{EntryLabels.SUCCESS_SAVE_MODAL_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {EntryLabels.SUCCESS_SAVE_MODAL_MESSAGE}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onPrintEntry}>{EntryLabels.PRINT}</Button>
          <Button onClick={onCloseSaveDialog}> {EntryLabels.CLOSE}</Button>
        </DialogActions>
      </Dialog>
      <BillDetailModal
        open={isOpenBillDetailModal}
        onDispatchBillDetail={onSaveEntry}
        totalAmount={totalToPay}
      />
      <Box display={"flex"} justifyContent={"space-between"} pb={2}>
        <Box display={"flex"}>
          <Typography pr={2}>{EntryLabels.DATE}</Typography>
          <DatePikerInput onChangeDate={onChangeEntryDate} />
        </Box>
        <Box display={"flex"}>
          <Typography pr={2}>{EntryLabels.TOTAL}</Typography>
          <TextField
            type={"number"}
            size={"small"}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            value={totalToPay}
          />
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} pb={2}>
        <Button variant={"outlined"} onClick={onCancelEntry}>
          {EntryLabels.CANCEL}
        </Button>
        <Button
          endIcon={<SaveIcon />}
          variant="contained"
          disabled={disableSave}
          onClick={onOpenBillDetailModal}
        >
          {EntryLabels.SAVE}
        </Button>
      </Box>
    </Box>
  );
};
