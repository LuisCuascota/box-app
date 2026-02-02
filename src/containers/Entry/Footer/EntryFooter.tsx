import {
  alpha,
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
    onCloseBillDetailModal,
  } = useContext(EntryContext);

  return (
    <Box p={1} pb={1.5}>
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
        handleClose={onCloseBillDetailModal}
      />
      <Box
        sx={(theme) => ({
          width: "100%",
          borderRadius: 1.5,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
          backgroundColor: "#fff",
          p: 1,
          mb: 0.5,
        })}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="caption"
              sx={(theme) => ({
                minWidth: 44,
                color: alpha(theme.palette.primary.main, 0.75),
              })}
            >
              {EntryLabels.DATE}
            </Typography>
            <Box sx={{ "& .MuiTextField-root": { width: 160 } }}>
              <DatePikerInput onChangeDate={onChangeEntryDate} />
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1} sx={{ ml: "auto" }}>
            <Box display={"flex"} gap={1} alignItems="center">
              <Button variant={"outlined"} onClick={onCancelEntry} size="small">
                {EntryLabels.CANCEL}
              </Button>
              <Button
                endIcon={<SaveIcon />}
                variant="contained"
                disabled={disableSave}
                onClick={onOpenBillDetailModal}
                size="small"
              >
                {EntryLabels.SAVE}
              </Button>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="caption"
                sx={(theme) => ({
                  minWidth: 44,
                  textAlign: "right",
                  color: alpha(theme.palette.primary.main, 0.75),
                })}
              >
                {EntryLabels.TOTAL}
              </Typography>
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
                sx={{ width: 120 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
