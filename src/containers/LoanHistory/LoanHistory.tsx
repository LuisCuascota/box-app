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
import { useLoanHistoryState } from "./state/useLoanHistoryState.tsx";
import { PartnerSearch } from "../../components/input/PersonSearch/PartnerSearch.tsx";
import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { LoanHistoryLabels } from "../../shared/labels/LoanHistory.labels.ts";
import { LoanModal } from "../../components/modals/Loan/LoanModal.tsx";
import { Loan } from "../../store/interfaces/LoanState.interfaces.ts";
import { getStatusTypeIcon } from "../../shared/utils/Components.util.tsx";

export const LoanHistory = () => {
  const { loansPaginated, pagination, isLoading, modal, search } =
    useLoanHistoryState();

  return (
    <PaperBase>
      <Box p={2}>
        <Typography textAlign={"center"} variant={"h6"}>
          {LoanHistoryLabels.TITLE}
        </Typography>
        <PartnerSearch
          value={search.accountSelector}
          disableSearch={false}
          onChangeSelector={search.onSelectPartner}
          onCleanSelector={search.onClearPartner}
        />
      </Box>
      <TableContainer>
        <LoanModal
          viewMode={true}
          loan={modal.rowSelected}
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
              <TableCell align="left">{LoanHistoryLabels.TH_PARTNER}</TableCell>
              <TableCell align="left">{LoanHistoryLabels.TH_DATE}</TableCell>
              <TableCell align="left">{LoanHistoryLabels.TH_AMOUNT}</TableCell>
              <TableCell align="left">{LoanHistoryLabels.TH_DEBT}</TableCell>
              <TableCell align="center">
                {LoanHistoryLabels.TH_STATUS}
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
                      {Array(7)
                        .fill(0)
                        .map((_, colIndex) => (
                          <TableCell key={colIndex}>
                            <Skeleton animation="wave" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              : loansPaginated.map((row: Loan) => (
                  <TableRow key={row.number}>
                    <TableCell>
                      <b>{row.number}</b>
                    </TableCell>
                    <TableCell>
                      <i>{`${row.names} ${row.surnames}`}</i>
                    </TableCell>
                    <TableCell>{getFormattedDate(row.date)}</TableCell>
                    <TableCell>{`$${row.value}`}</TableCell>
                    <TableCell>{`$${row.debt}`}</TableCell>
                    <TableCell align="center">
                      {getStatusTypeIcon(row.status)}
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
                count={pagination.loanCount}
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
