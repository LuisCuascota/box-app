import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import {
  alpha,
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
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
import { ComponentsLabels } from "../../shared/labels/Components.labels.ts";
import { TypeMetric } from "../../store/interfaces/MetricsState.interfaces.ts";
import { useMetricsState } from "./useMetricsState.tsx";
import { PieDataChart } from "../../components/chart/PieDataChart/PieDataChart.tsx";
import { PeriodSearch } from "../../components/input/PeriodSearch/PeriodSearch.tsx";
import { DateRangePikerInput } from "../../components/input/DateRangePikerInput/DateRangePikerInput.tsx";
import { environment } from "../../environments/environment.ts";
import moment from "moment/moment";
import { DATE_FORMAT } from "../../shared/utils/Date.utils.ts";

export const MetricsContainer = () => {
  const { isLoading, metrics, typesMetrics, utilsMetrics, search } =
    useMetricsState();

  return (
    <PaperBase>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress />
      </Backdrop>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Box sx={(theme) => cardContainerSx(theme)}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid size={12}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant={"h6"} sx={(theme) => titleSx(theme)}>
                    {"MÉTRICAS"}
                  </Typography>
                  <Typography variant="caption" sx={(theme) => subtitleSx(theme)}>
                    {ComponentsLabels.FILTERS}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={8} pr={1}>
                <PeriodSearch
                  disableSearch={false}
                  onChangeSelector={search.onSelectPeriod}
                />
              </Grid>
              <Grid size={4}>
                <DateRangePikerInput
                  defaultFrom={environment.startDate}
                  defaultTo={moment().format(DATE_FORMAT)}
                  onChangeDate={() => {}}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {!isLoading && metrics && (
          <>
            <Grid size={12}>
              <PieDataChart
                data={[
                  {
                    id: 0,
                    value: metrics.cashTotal,
                    label: ComponentsLabels.TYPE_CASH,
                    color: "#1B3A57",
                  },
                  {
                    id: 1,
                    value: metrics.transferTotal,
                    label: ComponentsLabels.TYPE_TRANSFER,
                    color: "#FFB347",
                  },
                ]}
                totalValue={metrics.total}
                totalLabel={"Total: $"}
              />
            </Grid>
            <Grid size={12}>
              <Typography variant={"h6"} sx={{ color: "text.primary" }}>
                {"RUBROS"}
              </Typography>
            </Grid>
            <Grid size={12}>
              <TableContainer sx={(theme) => tableContainerSx(theme)}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={(theme) => tableHeadRowSx(theme)}>
                      <TableCell align="left" sx={tableHeadCellSx}>
                        {"Descripción"}
                      </TableCell>
                      <TableCell align="left" sx={tableHeadCellSx}>
                        {"Valor"}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {typesMetrics.map((row: TypeMetric) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{`$${row.sum}`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid size={12}>
              <Typography variant={"h6"} sx={{ color: "text.primary" }}>
                {"VALORES DE UTILIDAD"}
              </Typography>
            </Grid>
            <Grid size={12}>
              <TableContainer sx={(theme) => tableContainerSx(theme)}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={(theme) => tableHeadRowSx(theme)}>
                      <TableCell align="left" sx={tableHeadCellSx}>
                        {"Descripción"}
                      </TableCell>
                      <TableCell align="left" sx={tableHeadCellSx}>
                        {"Valor"}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {utilsMetrics.map((row: TypeMetric, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{`$${row.sum}`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        )}
      </Grid>
    </PaperBase>
  );
};
