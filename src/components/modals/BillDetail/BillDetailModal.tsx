import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import { EntryBillDetail } from "../../../store/interfaces/EntryState.interfaces.ts";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { PaymentMethodEnum } from "../../../shared/enums/PaymentMethod.enum.ts";

interface PaymentModalProps {
  open: boolean;
  onDispatchBillDetail: (billDetail: EntryBillDetail) => void;
  totalAmount: number;
  handleClose: () => void;
}

export const BillDetailModal: React.FC<PaymentModalProps> = ({
  open,
  onDispatchBillDetail,
  totalAmount,
  handleClose,
}) => {
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.CASH);
  const [cash, setCash] = useState(0);
  const [transfer, setTransfer] = useState(0);
  const isSubmitDisabled =
    paymentMethod === PaymentMethodEnum.MIXED && (cash === 0 || transfer === 0);

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const method = event.target.value;

    setPaymentMethod(method as PaymentMethodEnum);

    if (method === PaymentMethodEnum.CASH) {
      setCash(totalAmount);
      setTransfer(0);
    } else if (method === PaymentMethodEnum.TRANSFER) {
      setCash(0);
      setTransfer(totalAmount);
    } else {
      setCash(0);
      setTransfer(0);
    }
  };

  const handleCashChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);

    setCash(value);
    setTransfer(parseFloat((totalAmount - value).toFixed(2)));
  };

  const handleTransferChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);

    setTransfer(value);
    setCash(parseFloat((totalAmount - value).toFixed(2)));
  };

  const cleanValues = () => {
    setCash(0);
    setTransfer(0);
    setPaymentMethod(PaymentMethodEnum.CASH);
  };

  const handleSubmit = () => {
    const billDetail: EntryBillDetail = {
      cash: paymentMethod === PaymentMethodEnum.CASH ? totalAmount : cash,
      transfer:
        paymentMethod === PaymentMethodEnum.TRANSFER ? totalAmount : transfer,
    };

    onDispatchBillDetail(billDetail);
    cleanValues();
  };

  const handleCancel = () => {
    handleClose();
    cleanValues();
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
          p: 3,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Seleccione el método de pago
        </Typography>
        <Typography
          id="modal-description"
          sx={(theme) => ({
            mt: 0.5,
            color: theme.palette.primary.main,
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 0.2,
          })}
        >
          Total a pagar: ${totalAmount}
        </Typography>
        <Divider sx={{ my: 1.5 }} />
        <RadioGroup
          aria-label="payment-method"
          name="payment-method"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <FormControlLabel
            value={PaymentMethodEnum.CASH}
            control={<Radio />}
            label={ComponentsLabels.TYPE_CASH}
          />
          <FormControlLabel
            value={PaymentMethodEnum.TRANSFER}
            control={<Radio />}
            label={ComponentsLabels.TYPE_TRANSFER}
          />
          <FormControlLabel
            value={PaymentMethodEnum.MIXED}
            control={<Radio />}
            label={ComponentsLabels.TYPE_MIX}
          />
        </RadioGroup>
        {paymentMethod === PaymentMethodEnum.MIXED && (
          <Box>
            <TextField
              label={ComponentsLabels.TYPE_CASH}
              type="number"
              value={cash}
              onChange={handleCashChange}
              fullWidth
              margin="dense"
              inputProps={{ min: 0, max: totalAmount }}
            />
            <TextField
              label={ComponentsLabels.TYPE_TRANSFER}
              type="number"
              value={transfer}
              onChange={handleTransferChange}
              fullWidth
              margin="dense"
              inputProps={{ min: 0, max: totalAmount }}
            />
          </Box>
        )}
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            disabled={isSubmitDisabled}
          >
            OK
          </Button>
          <Button variant="outlined" onClick={handleCancel} fullWidth>
            Cancelar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
