import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../shared/hooks/Store.hook.ts";
import { getMetrics } from "../../store/epics/MetricsEpics/getMetrics.epic.ts";
import { selectMetrics } from "../../store/selectors/selectors.ts";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
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
import { PieChart } from "@mui/x-charts";
import { ComponentsLabels } from "../../shared/labels/Components.labels.ts";
import { getTypesMetrics } from "../../store/epics/MetricsEpics/getTypesMetrics.epic.ts";
import { TypeMetric } from "../../store/interfaces/MetricsState.interfaces.ts";

export const MetricsContainer = () => {
  const dispatch = useAppDispatch();

  const { metrics, getMetricsStatus, getTypesMetricsStatus, typesMetrics } =
    useAppSelector(selectMetrics);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getMetrics());
    dispatch(getTypesMetrics());
  }, []);

  useEffect(() => {
    if (
      getMetricsStatus === RequestStatusEnum.SUCCESS &&
      getTypesMetricsStatus === RequestStatusEnum.SUCCESS
    )
      setIsLoading(false);
  }, [getMetricsStatus, getTypesMetricsStatus]);

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
              <PieChart
                colors={["#1f3c55", "#d5a92b"]}
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: metrics.cashTotal,
                        label: ComponentsLabels.TYPE_CASH,
                      },
                      {
                        id: 1,
                        value: metrics.transferTotal,
                        label: ComponentsLabels.TYPE_TRANSFER,
                      },
                    ],
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                    arcLabel: (item) => `$${item.value}`,
                    innerRadius: 14,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  },
                ]}
                height={250}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography textAlign={"center"} variant={"h5"}>
                {`Total: $${metrics.total}`}
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">{"Rubro"}</TableCell>
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
          </>
        )}
      </Grid>
    </PaperBase>
  );
};
