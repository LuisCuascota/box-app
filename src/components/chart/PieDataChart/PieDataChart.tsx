import { Grid, Typography } from "@mui/material";
import { ChartsColorPalette, PieChart, PieValueType } from "@mui/x-charts";

export interface PieDataChartProps {
  data: PieValueType[];
  totalValue: number;
  totalLabel: string;
  colors?: ChartsColorPalette;
}

export const PieDataChart = (props: PieDataChartProps) => {
  return (
    <Grid container spacing={1}>
      <Grid item md={12} xs={12}>
        <PieChart
          colors={props.colors}
          series={[
            {
              data: props.data,
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
          {`${props.totalLabel}${props.totalValue.toFixed(2)}`}
        </Typography>
      </Grid>
    </Grid>
  );
};
