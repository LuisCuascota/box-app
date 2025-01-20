import {
  Grid,
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
import {
  DATE_FORMAT,
  getFormattedDate,
} from "../../shared/utils/Date.utils.ts";
import {
  loanStatusOptions,
  useLoanHistoryState,
} from "./state/useLoanHistoryState.tsx";
import { PartnerSearch } from "../../components/input/PersonSearch/PartnerSearch.tsx";
import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { LoanHistoryLabels } from "../../shared/labels/LoanHistory.labels.ts";
import { LoanModal } from "../../components/modals/Loan/LoanModal.tsx";
import { Loan } from "../../store/interfaces/LoanState.interfaces.ts";
import { getLoanStatusTypeIcon } from "../../shared/utils/Components.util.tsx";
import { OptionsSelect } from "../../components/input/OptionsSelect/OptionsSelect.tsx";
import { DateRangePikerInput } from "../../components/input/DateRangePikerInput/DateRangePikerInput.tsx";
import { environment } from "../../environments/environment.ts";
import moment from "moment/moment";
import { PieDataChart } from "../../components/chart/PieDataChart/PieDataChart.tsx";
import { ComponentsLabels } from "../../shared/labels/Components.labels.ts";

export const LoanHistory = () => {
  const { loansPaginated, pagination, isLoading, modal, search } =
    useLoanHistoryState();

  return (
    <PaperBase>
      <Grid container p={1}>
        <Grid item md={12} xs={12}>
          <Typography textAlign={"center"} variant={"h6"}>
            {LoanHistoryLabels.TITLE}
          </Typography>
        </Grid>
        <Grid item md={6} xs={12} pr={1}>
          <PartnerSearch
            disableSearch={false}
            onChangeSelector={search.onSelectPartner}
          />
        </Grid>
        <Grid item md={2} pr={1}>
          <OptionsSelect
            label={"Estado"}
            options={loanStatusOptions}
            onSelect={search.onChangePaymentStatus}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <DateRangePikerInput
            defaultFrom={environment.startDate}
            defaultTo={moment().format(DATE_FORMAT)}
            onChangeDate={search.onChangeDateRange}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <PieDataChart
            data={[
              {
                id: 0,
                value: +pagination.loanCount.debt.toFixed(2),
                label: ComponentsLabels.DEBT,
                color: "#1f3c55",
              },
              {
                id: 1,
                value: +(
                  pagination.loanCount.total - pagination.loanCount.debt
                ).toFixed(2),
                label: ComponentsLabels.PAID,
                color: "#d5a92b",
              },
            ]}
            totalValue={+pagination.loanCount.total.toFixed(2)}
            totalLabel={"Total: $"}
          />
        </Grid>
      </Grid>
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
                      {getLoanStatusTypeIcon(row.status)}
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
                count={pagination.loanCount.count}
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
