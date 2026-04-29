import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
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
    <>
      <Dialog open={isOpenSaveDialog} onClose={onCloseSaveDialog}>
        <DialogTitle>{EntryLabels.SUCCESS_SAVE_MODAL_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {EntryLabels.SUCCESS_SAVE_MODAL_MESSAGE}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onPrintEntry}>{EntryLabels.PRINT}</Button>
          <Button onClick={onCloseSaveDialog}>{EntryLabels.CLOSE}</Button>
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
          px: 3,
          py: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 100%)`,
        })}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant="body2"
                  sx={{ color: alpha("#fff", 0.85) }}
                >
                  {EntryLabels.DATE}
                </Typography>
                <Box sx={{ "& .MuiTextField-root": { width: 160 } }}>
                  <DatePikerInput onChangeDate={onChangeEntryDate} />
                </Box>
              </Box>
              <Box sx={{ ml: "auto" }}>
                <Box
                  sx={(theme) => ({
                    backgroundColor: "#fff",
                    borderRadius: 1.5,
                    px: 2,
                    py: 0.75,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.dark, 0.3)}`,
                  })}
                >
                  <Typography
                    variant="subtitle1"
                    sx={(theme) => ({
                      fontWeight: 800,
                      color: theme.palette.primary.main,
                      lineHeight: 1.2,
                    })}
                  >
                    ${totalToPay.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              gap={1.5}
            >
              <Button
                variant="outlined"
                onClick={onCancelEntry}
                size="small"
                sx={{
                  color: "#fff",
                  borderColor: alpha("#fff", 0.5),
                  "&:hover": {
                    borderColor: "#fff",
                    backgroundColor: alpha("#fff", 0.1),
                  },
                }}
              >
                {EntryLabels.CANCEL}
              </Button>
              <Button
                endIcon={<SaveIcon />}
                variant="contained"
                disabled={disableSave}
                onClick={onOpenBillDetailModal}
                size="small"
                sx={{
                  backgroundColor: "#fff",
                  color: "primary.main",
                  "&:hover": { backgroundColor: alpha("#fff", 0.9) },
                }}
              >
                {EntryLabels.SAVE}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
