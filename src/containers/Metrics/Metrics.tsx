import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import {
  Backdrop,
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
import { ComponentsLabels } from "../../shared/labels/Components.labels.ts";
import { TypeMetric } from "../../store/interfaces/MetricsState.interfaces.ts";
import { useMetricsState } from "./useMetricsState.tsx";
import { PieDataChart } from "../../components/chart/PieDataChart/PieDataChart.tsx";

export const MetricsContainer = () => {
  const { isLoading, metrics, typesMetrics, utilsMetrics } = useMetricsState();

  return (
    <PaperBase>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress />
      </Backdrop>
      <Grid container spacing={1}>
        <Grid item md={12} xs={12}>
          <Typography textAlign={"center"} variant={"h5"}>
            {"MÉTRICAS"}
          </Typography>
        </Grid>
        {!isLoading && metrics && (
          <>
            <Grid item md={12} xs={12}>
              <PieDataChart
                data={[
                  {
                    id: 0,
                    value: metrics.cashTotal,
                    label: ComponentsLabels.TYPE_CASH,
                    color: "#1f3c55",
                  },
                  {
                    id: 1,
                    value: metrics.transferTotal,
                    label: ComponentsLabels.TYPE_TRANSFER,
                    color: "#d5a92b",
                  },
                ]}
                totalValue={metrics.total}
                totalLabel={"Total: $"}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography variant={"h6"}>{"RUBROS"}</Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">{"Descripción"}</TableCell>
                      <TableCell align="left">{"Valor"}</TableCell>
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
            <Grid item md={12} xs={12}>
              <Typography variant={"h6"}>{"VALORES DE UTILIDAD"}</Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">{"Descripción"}</TableCell>
                      <TableCell align="left">{"Valor"}</TableCell>
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
