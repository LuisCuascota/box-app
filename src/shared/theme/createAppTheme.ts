import { alpha, createTheme } from "@mui/material";
import { BrandConfig } from "./brand.config.ts";

export const createAppTheme = (brand: BrandConfig) =>
  createTheme({
    typography: {
      fontFamily: brand.typography.fontFamily,
      h5: { fontWeight: brand.typography.headingWeight },
      h6: { fontWeight: brand.typography.headingWeight },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
    },
    palette: {
      primary: brand.palette.primary,
      secondary: brand.palette.secondary,
      success: brand.palette.success,
      warning: brand.palette.warning,
      background: brand.palette.background,
      text: brand.palette.text,
    },
    shape: {
      borderRadius: brand.shape.borderRadius,
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 10,
            fontWeight: 600,
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: "small" },
        styleOverrides: {
          root: ({ theme }) => ({
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              backgroundColor: theme.palette.background.paper,
              "& fieldset": {
                borderColor: alpha(theme.palette.primary.main, 0.35),
              },
              "&:hover fieldset": {
                borderColor: alpha(theme.palette.primary.main, 0.6),
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.08)}`,
              },
            },
            "& .MuiInputBase-input": {
              color: theme.palette.text.primary,
              fontSize: 13,
            },
            "& .MuiInputLabel-root": { fontSize: 12 },
            "& .MuiInputAdornment-root": {
              color: alpha(theme.palette.primary.main, 0.7),
            },
          }),
        },
      },
      // @ts-ignore
      MuiPickersTextField: {
        defaultProps: { size: "small" },
        styleOverrides: {
          root: ({ theme }: any) => ({
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              backgroundColor: theme.palette.background.paper,
              "& fieldset": {
                borderColor: alpha(theme.palette.primary.main, 0.35),
              },
              "&:hover fieldset": {
                borderColor: alpha(theme.palette.primary.main, 0.6),
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.08)}`,
              },
            },
            "& .MuiInputBase-input": {
              color: theme.palette.text.primary,
              fontSize: 12,
              paddingTop: 6,
              paddingBottom: 6,
            },
            "& .MuiInputLabel-root": { fontSize: 12 },
            "& .MuiSvgIcon-root": {
              color: alpha(theme.palette.primary.main, 0.7),
            },
          }),
        },
      },
      // @ts-ignore
      MuiPickersInputBase: {
        styleOverrides: {
          root: ({ theme }: any) => ({
            color: theme.palette.text.primary,
            fontSize: 12,
          }),
          input: { fontSize: 12 },
          sectionsContainer: { fontSize: 12 },
        },
      },
      // @ts-ignore
      MuiPickersOutlinedInput: {
        styleOverrides: {
          root: ({ theme }: any) => ({
            borderRadius: 8,
            backgroundColor: theme.palette.background.paper,
            "& fieldset": {
              borderColor: alpha(theme.palette.primary.main, 0.35),
            },
            "&:hover fieldset": {
              borderColor: alpha(theme.palette.primary.main, 0.6),
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.08)}`,
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: brand.shape.borderRadius },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: brand.shape.borderRadius,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: { root: { padding: "4px" } },
      },
      // @ts-ignore
      MuiPieArcLabel: {
        styleOverrides: {
          root: { fill: "#FFF", fontFamily: brand.typography.fontFamily },
        },
      },
      MuiChartsTooltip: {
        styleOverrides: {
          root: { fill: "#FFF", fontFamily: brand.typography.fontFamily },
        },
      },
    },
  });
