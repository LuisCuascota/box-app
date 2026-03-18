import { alpha } from "@mui/material";
import { Theme } from "@mui/material/styles";

export const cardContainerSx = (theme: Theme, padding = 1.25) => ({
  p: padding,
  borderRadius: 1.5,
  backgroundColor: "#fff",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
});

export const summaryCardSx = (theme: Theme, padding = 0.75) => ({
  p: padding,
  borderRadius: 1.5,
  backgroundColor: "#fff",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
});

export const tableContainerSx = (theme: Theme) => ({
  borderRadius: 2,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
  overflow: "hidden",
});

export const tableHeadRowSx = (theme: Theme) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.04),
});

export const titleSx = (theme: Theme) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
});

export const subtitleSx = (theme: Theme) => ({
  color: alpha(theme.palette.primary.main, 0.6),
});

export const tableHeadCellSx = { fontWeight: 700, fontSize: 12 };
