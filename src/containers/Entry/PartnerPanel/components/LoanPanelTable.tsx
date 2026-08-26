import {
  alpha,
  Box,
  Checkbox,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { LoanDetail } from "../../../../store/interfaces/LoanState.interfaces.ts";
import { ReactNode } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ScheduleIcon from "@mui/icons-material/Schedule";
import moment from "moment";

export interface LoanPanelTableProps {
  isLoading: boolean;
  loanDetail: LoanDetail[];
  selectedIds: Set<number>;
  onToggleFee: (detail: LoanDetail) => void;
}

export const LoanPanelTable = ({
  isLoading,
  loanDetail,
  selectedIds,
  onToggleFee,
}: LoanPanelTableProps) => {
  return (
    <TableContainer
      sx={(theme) => ({
        borderRadius: 1.5,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
      })}
    >
      <Table size="small">
        <TableHead>
          <TableRow
            sx={(theme) => ({
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            })}
          >
            <HeadCell align="center" width={28} />
            <HeadCell>Nº</HeadCell>
            <HeadCell>Fecha</HeadCell>
            <HeadCell align="right">Capital</HeadCell>
            <HeadCell align="right">Interés</HeadCell>
            <HeadCell align="right">Saldo</HeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    {Array(6)
                      .fill(0)
                      .map((_, j) => (
                        <TableCell key={j} sx={{ py: 0.5 }}>
                          <Skeleton animation="wave" height={20} />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            : loanDetail.map((detail, _idx, arr) => {
                const isSelected = selectedIds.has(detail.id!);
                const canSelect = !detail.is_paid;
                const currentFee = arr.find(
                  (d) =>
                    !d.is_paid &&
                    moment.utc().isSame(d.payment_date, "month")
                );
                const isCurrentFee = currentFee?.id === detail.id;

                return (
                  <TableRow
                    key={detail.fee_number}
                    selected={isSelected}
                    sx={(theme) => ({
                      cursor: canSelect ? "pointer" : "default",
                      "&:hover": {
                        backgroundColor: canSelect
                          ? alpha(theme.palette.primary.main, 0.04)
                          : undefined,
                      },
                      "&.Mui-selected": {
                        backgroundColor: alpha(
                          theme.palette.secondary.main,
                          0.08
                        ),
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.secondary.main,
                            0.12
                          ),
                        },
                      },
                    })}
                    onClick={() => canSelect && onToggleFee(detail)}
                  >
                    <TableCell sx={cellSx} align="center">
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        disabled={!canSelect}
                        sx={{ p: 0 }}
                      />
                    </TableCell>
                    <TableCell sx={cellSx}>{detail.fee_number}</TableCell>
                    <TableCell sx={cellSx}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {getFeeStatusIcon(detail, isCurrentFee)}
                        <Typography variant="caption" fontSize={10}>
                          {moment.utc(detail.payment_date).format("MMM/YY")}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={cellSx} align="right">
                      {detail.fee_value.toFixed(2)}
                    </TableCell>
                    <TableCell sx={cellSx} align="right">
                      {detail.interest.toFixed(2)}
                    </TableCell>
                    <TableCell sx={cellSx} align="right">
                      {detail.balance_after_pay.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const cellSx = { fontSize: 11, py: 0.5, px: 0.5 };

const getFeeStatusIcon = (detail: LoanDetail, isCurrentFee: boolean) => {
  if (detail.is_paid)
    return <CheckCircleIcon sx={{ fontSize: 12, color: "success.main" }} />;

  const isOverdue = moment.utc().isAfter(detail.payment_date, "day");

  if (isOverdue)
    return <ErrorIcon sx={{ fontSize: 12, color: "error.main" }} />;

  if (isCurrentFee)
    return <ScheduleIcon sx={{ fontSize: 12, color: "warning.main" }} />;

  return null;
};

const HeadCell = ({
  children,
  align = "left",
  width,
}: {
  children?: ReactNode;
  align?: "left" | "right" | "center";
  width?: number;
}) => (
  <TableCell
    align={align}
    sx={{ fontWeight: 700, fontSize: 11, py: 0.5, px: 0.75, width }}
  >
    {children}
  </TableCell>
);
