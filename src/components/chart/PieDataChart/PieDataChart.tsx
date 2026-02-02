import { Box, Grid, Typography } from "@mui/material";
import { ChartsColorPalette, PieChart, PieValueType } from "@mui/x-charts";

export interface PieDataChartProps {
  data: PieValueType[];
  totalValue: number;
  totalLabel: string;
  colors?: ChartsColorPalette;
}

export const PieDataChart = (props: PieDataChartProps) => {
  const fallbackColors = ["#1B3A57", "#FFB347", "#2F855A", "#D97706"];
  const legendColors =
    props.colors && props.colors.length > 0 ? props.colors : fallbackColors;

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Box display="flex" justifyContent="center">
          <PieChart
            colors={props.colors ?? fallbackColors}
            series={[
              {
                data: props.data,
                highlightScope: { fade: "global", highlight: "item" },
                faded: {
                  innerRadius: 44,
                  additionalRadius: -18,
                  color: "gray",
                },
                arcLabel: (item) => `$${item.value}`,
                arcLabelMinAngle: 20,
                innerRadius: 44,
                paddingAngle: 3,
                cornerRadius: 6,
              },
            ]}
            height={230}
            width={360}
            slotProps={{
              legend: { hidden: true },
            }}
            sx={{
              "& .MuiChartsLegend-root": {
                display: "none",
              },
            }}
          />
        </Box>
        <Box display="flex" gap={2} justifyContent="center" mt={0.5}>
          {props.data.map((item, index) => (
            <Box key={item.id} display="flex" alignItems="center" gap={0.5}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: legendColors[index],
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Grid>
      <Grid size={12}>
        <Typography textAlign={"center"} variant={"h6"}>
          {`${props.totalLabel}${props.totalValue.toFixed(2)}`}
        </Typography>
      </Grid>
    </Grid>
  );
};
