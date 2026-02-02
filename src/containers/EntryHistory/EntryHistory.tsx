import {
  alpha,
  Box,
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
  cardContainerSx,
  subtitleSx,
  tableContainerSx,
  tableHeadCellSx,
  tableHeadRowSx,
  titleSx,
} from "../../shared/styles/Ui.styles.ts";
import {
  DATE_FORMAT,
  getFormattedDate,
} from "../../shared/utils/Date.utils.ts";
import {
  entryTypeOptions,
  useEntryHistoryState,
} from "./state/useEntryHistoryState.tsx";
import { PartnerSearch } from "../../components/input/PersonSearch/PartnerSearch.tsx";
import { EntryModal } from "../../components/modals/Entry/EntryModal.tsx";
import { EntryHeader } from "../../store/interfaces/EntryState.interfaces.ts";
import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { EntryHistoryLabels } from "../../shared/labels/EntryHistory.labels.ts";
import { getPaymentTypeIcon } from "../../shared/utils/Components.util.tsx";
import { DateRangePikerInput } from "../../components/input/DateRangePikerInput/DateRangePikerInput.tsx";
import { environment } from "../../environments/environment.ts";
import moment from "moment";
import { ComponentsLabels } from "../../shared/labels/Components.labels.ts";
import { PieDataChart } from "../../components/chart/PieDataChart/PieDataChart.tsx";
import { OptionsSelect } from "../../components/input/OptionsSelect/OptionsSelect.tsx";
import { PeriodSearch } from "../../components/input/PeriodSearch/PeriodSearch.tsx";

export const EntryHistory = () => {
  const { entriesPaginated, pagination, isLoading, modal, search } =
    useEntryHistoryState();

  return (
    <PaperBase>
      <Grid container p={1}>
        <Grid size={12}>
          <Box sx={(theme) => cardContainerSx(theme)}>
            <Grid container spacing={1} alignItems="center">
              <Grid size={12}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography textAlign={"left"} variant={"h6"} sx={(theme) => titleSx(theme)}>
                    {EntryHistoryLabels.TITLE}
                  </Typography>
                  <Typography variant="caption" sx={(theme) => subtitleSx(theme)}>
                    {ComponentsLabels.FILTERS}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={2} pr={1}>
                <PeriodSearch
                  disableSearch={false}
                  onChangeSelector={search.onSelectPeriod}
                />
              </Grid>
              <Grid size={4} pr={1}>
                <PartnerSearch
                  disableSearch={false}
                  onChangeSelector={search.onSelectPartner}
                />
              </Grid>
              <Grid size={2} pr={1}>
                <OptionsSelect
                  label={"Tipo"}
                  options={entryTypeOptions}
                  onSelect={search.onChangePaymentType}
                />
              </Grid>
              <Grid size={4}>
                <DateRangePikerInput
                  defaultFrom={environment.startDate}
                  defaultTo={moment().format(DATE_FORMAT)}
                  onChangeDate={search.onChangeDateRange}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid size={12}>
          <PieDataChart
            data={[
              {
                id: 0,
                value: +pagination.entryCount.cash.toFixed(2),
                label: ComponentsLabels.TYPE_CASH,
                color: "#1B3A57",
              },
              {
                id: 1,
                value: +pagination.entryCount.transfer.toFixed(2),
                label: ComponentsLabels.TYPE_TRANSFER,
                color: "#FFB347",
              },
            ]}
            totalValue={+pagination.entryCount.total.toFixed(2)}
            totalLabel={"Total: $"}
          />
        </Grid>
      </Grid>
      <TableContainer sx={(theme) => tableContainerSx(theme)}>
        <EntryModal
          entryData={modal.rowSelected}
          open={modal.isModalOpen}
          handleClose={modal.onCloseModal}
        />
        <Table size="small">
          <TableHead>
            <TableRow sx={(theme) => tableHeadRowSx(theme)}>
              <TableCell align="left">
                <Typography sx={(theme) => ({ ...tableHeadCellSx, color: theme.palette.primary.main })}>
                  {"Nº"}
                </Typography>
              </TableCell>
              <TableCell align="left" sx={tableHeadCellSx}>
                {EntryHistoryLabels.TH_PARTNER}
              </TableCell>
              <TableCell align="left" sx={tableHeadCellSx}>
                {EntryHistoryLabels.TH_DATE}
              </TableCell>
              <TableCell align="left" sx={tableHeadCellSx}>
                {EntryHistoryLabels.TH_AMOUNT}
              </TableCell>
              <TableCell align="center" sx={tableHeadCellSx}>
                {EntryHistoryLabels.TH_TYPE}
              </TableCell>
              <TableCell sx={tableHeadCellSx} />
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
                count={pagination.entryCount.count}
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
