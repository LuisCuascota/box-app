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
    onCloseBillDetailModal,
  } = useContext(EgressContext);

  return (
    <Box p={1} pb={1.5}>
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
        handleClose={onCloseBillDetailModal}
      />
      <Box
        sx={(theme) => ({
          borderRadius: 1.5,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
          backgroundColor: "#fff",
          p: 1,
        })}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto auto",
            alignItems: "center",
            columnGap: 16,
          }}
        >
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Typography variant="caption" color="text.secondary">
              {EgressLabels.DATE}
            </Typography>
            <DatePikerInput onChangeDate={onChangeEgressDate} />
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button variant={"outlined"} onClick={onCancelEgress} size="small">
              {EgressLabels.CANCEL}
            </Button>
            <Button
              endIcon={<SaveIcon />}
              variant="contained"
              disabled={disableSave}
              onClick={onOpenBillDetailModal}
              size="small"
            >
              {EgressLabels.SAVE}
            </Button>
          </Box>
          <Box display="flex" flexDirection="column" gap={0.5} alignItems="flex-end">
            <Typography variant="caption" color="text.secondary">
              {EgressLabels.TOTAL}
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
              value={totalDischarge}
              sx={{ width: 120 }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
