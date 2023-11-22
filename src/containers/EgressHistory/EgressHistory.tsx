import {
  Box,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { getFormattedDate } from "../../shared/utils/Date.utils.ts";
import { useEgressHistoryState } from "./state/useEgressHistoryState.tsx";
import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import { ColorsEnum } from "../../shared/enums/Colors.enum.ts";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { EgressHeader } from "../../store/interfaces/EgressState.interfaces.ts";
import { EgressHistoryLabels } from "../../shared/labels/EgressHistory.labels.ts";
import { EgressModal } from "../../components/modals/Egress/EgressModal.tsx";

export const EgressHistory = () => {
  const { egressPaginated, pagination, isLoading, modal } =
    useEgressHistoryState();

  const getRowStyle = (isTransfer: boolean) => {
    if (isTransfer) return { backgroundColor: ColorsEnum.TRANSFER_LIGHT };
  };

  return (
    <PaperBase>
      <Box p={2}>
        <Typography textAlign={"center"} variant={"h6"}>
          {EgressHistoryLabels.TITLE}
        </Typography>
      </Box>
      <TableContainer>
        <EgressModal
          egressData={modal.rowSelected}
          open={modal.isModalOpen}
          handleClose={modal.onCloseModal}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <Typography color={"red"}>
                  <b>{"Nº"}</b>
                </Typography>
              </TableCell>
              <TableCell align="left">
                {EgressHistoryLabels.TH_BENEFICIARY}
              </TableCell>
              <TableCell align="left">{EgressHistoryLabels.TH_DATE}</TableCell>
              <TableCell align="left">
                {EgressHistoryLabels.TH_AMOUNT}
              </TableCell>
              <TableCell>{}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array(pagination.rowsPerPage)
                  .fill(0)
                  .map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Array(5)
                        .fill(0)
                        .map((_, colIndex) => (
                          <TableCell key={colIndex}>
                            <Skeleton animation="wave" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              : egressPaginated.map((row: EgressHeader) => (
                  <TableRow
                    key={row.number}
                    style={getRowStyle(row.is_transfer)}
                  >
                    <TableCell>
                      <b>{row.number}</b>
                    </TableCell>
                    <TableCell>
                      <i>{`${row.beneficiary}`}</i>
                    </TableCell>
                    <TableCell>{getFormattedDate(row.date)}</TableCell>
                    <TableCell>{`$${row.amount}`}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => modal.onOpenModal(row)}
                      >
                        <OpenInNewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                count={pagination.egressCount - 1}
                rowsPerPage={pagination.rowsPerPage}
                page={pagination.page}
                onPageChange={pagination.onPageChange}
                onRowsPerPageChange={pagination.onRowsPerPageChange}
              />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </PaperBase>
  );
};
