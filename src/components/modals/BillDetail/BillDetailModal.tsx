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
} from "@mui/material";
import { EntryBillDetail } from "../../../store/interfaces/EntryState.interfaces.ts";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";

interface PaymentModalProps {
  open: boolean;
  onDispatchBillDetail: (billDetail: EntryBillDetail) => void;
  totalAmount: number;
}

export const BillDetailModal: React.FC<PaymentModalProps> = ({
  open,
  onDispatchBillDetail,
  totalAmount,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cash, setCash] = useState(0);
  const [transfer, setTransfer] = useState(0);
  const isSubmitDisabled =
    paymentMethod === "combined" && (cash === 0 || transfer === 0);

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const method = event.target.value;

    setPaymentMethod(method);

    if (method === "cash") {
      setCash(totalAmount);
      setTransfer(0);
    } else if (method === "transfer") {
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

  const handleSubmit = () => {
    const billDetail: EntryBillDetail = {
      cash: paymentMethod === "cash" ? totalAmount : cash,
      transfer: paymentMethod === "transfer" ? totalAmount : transfer,
    };

    onDispatchBillDetail(billDetail);
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
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Seleccione el método de pago
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          Total a pagar: ${totalAmount}
        </Typography>
        <RadioGroup
          aria-label="payment-method"
          name="payment-method"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <FormControlLabel
            value="cash"
            control={<Radio />}
            label={ComponentsLabels.TYPE_CASH}
          />
          <FormControlLabel
            value="transfer"
            control={<Radio />}
            label={ComponentsLabels.TYPE_TRANSFER}
          />
          <FormControlLabel
            value="combined"
            control={<Radio />}
            label={ComponentsLabels.TYPE_MIX}
          />
        </RadioGroup>
        {paymentMethod === "combined" && (
          <Box>
            <TextField
              label="Efectivo"
              type="number"
              value={cash}
              onChange={handleCashChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 0, max: totalAmount }}
            />
            <TextField
              label="Transferencia"
              type="number"
              value={transfer}
              onChange={handleTransferChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 0, max: totalAmount }}
            />
          </Box>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          disabled={isSubmitDisabled}
        >
          OK
        </Button>
      </Box>
    </Modal>
  );
};
