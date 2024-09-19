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
import { useEntryHistoryState } from "./state/useEntryHistoryState.tsx";
import { PartnerSearch } from "../../components/input/PersonSearch/PartnerSearch.tsx";
import { EntryModal } from "../../components/modals/Entry/EntryModal.tsx";
import { EntryHeader } from "../../store/interfaces/EntryState.interfaces.ts";
import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { EntryHistoryLabels } from "../../shared/labels/EntryHistory.labels.ts";
import { getPaymentTypeIcon } from "../../shared/utils/Components.util.tsx";

export const EntryHistory = () => {
  const { entriesPaginated, pagination, isLoading, modal, search } =
    useEntryHistoryState();

  return (
    <PaperBase>
      <Box p={2}>
        <Typography textAlign={"center"} variant={"h6"}>
          {EntryHistoryLabels.TITLE}
        </Typography>
        <PartnerSearch
          value={search.accountSelector}
          disableSearch={false}
          onChangeSelector={search.onSelectPartner}
          onCleanSelector={search.onClearPartner}
        />
      </Box>
      <TableContainer>
        <EntryModal
          entryData={modal.rowSelected}
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
                {EntryHistoryLabels.TH_PARTNER}
              </TableCell>
              <TableCell align="left">{EntryHistoryLabels.TH_DATE}</TableCell>
              <TableCell align="left">{EntryHistoryLabels.TH_AMOUNT}</TableCell>
              <TableCell align="center">{EntryHistoryLabels.TH_TYPE}</TableCell>
              <TableCell>{}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array(pagination.rowsPerPage)
                  .fill(0)
                  .map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Array(6)
                        .fill(0)
                        .map((_, colIndex) => (
                          <TableCell key={colIndex}>
                            <Skeleton animation="wave" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              : entriesPaginated.map((row: EntryHeader) => (
                  <TableRow key={row.number}>
                    <TableCell>
                      <b>{row.number}</b>
                    </TableCell>
                    <TableCell>
                      <i>{`${row.names} ${row.surnames}`}</i>
                    </TableCell>
                    <TableCell>{getFormattedDate(row.date)}</TableCell>
                    <TableCell>{`$${row.amount}`}</TableCell>
                    <TableCell align="center">
                      {getPaymentTypeIcon(row.status)}
                    </TableCell>
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
                count={pagination.entryCount - 1}
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
