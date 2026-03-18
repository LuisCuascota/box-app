import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { alpha, createTheme, ThemeProvider } from "@mui/material";
import { Authenticator } from "@aws-amplify/ui-react";

const theme = createTheme({
  typography: {
    fontFamily: "Libre Franklin, sans-serif",
  },
  palette: {
    primary: {
      light: "#3F6B8A",
      main: "#1B3A57",
      dark: "#112B40",
      contrastText: "#fff",
    },
    secondary: {
      light: "#FFD08A",
      main: "#FFB347",
      dark: "#E0881D",
      contrastText: "#1B3A57",
    },
    warning: {
      light: "#FCD38D",
      main: "#F59E0B",
      dark: "#D97706",
      contrastText: "#000",
    },
    success: {
      light: "#86D3B1",
      main: "#2F855A",
      dark: "#276749",
      contrastText: "#fff",
    },
    background: {
      default: "#F6F7FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2933",
      secondary: "#6B7280",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#fff",
            "& fieldset": {
              borderColor: alpha(theme.palette.primary.main, 0.35),
            },
            "&:hover fieldset": {
              borderColor: alpha(theme.palette.primary.main, 0.6),
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 0 3px ${alpha(
                theme.palette.primary.main,
                0.08
              )}`,
            },
          },
          "& .MuiInputBase-input": {
            color: theme.palette.primary.main,
            fontSize: 13,
          },
          "& .MuiInputLabel-root": {
            fontSize: 12,
          },
          "& .MuiInputAdornment-root": {
            color: alpha(theme.palette.primary.main, 0.7),
          },
        }),
      },
    },
    MuiPickersTextField: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#fff",
            "& fieldset": {
              borderColor: alpha(theme.palette.primary.main, 0.35),
            },
            "&:hover fieldset": {
              borderColor: alpha(theme.palette.primary.main, 0.6),
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 0 3px ${alpha(
                theme.palette.primary.main,
                0.08
              )}`,
            },
          },
          "& .MuiInputBase-input": {
            color: theme.palette.primary.main,
            fontSize: 12,
            paddingTop: 6,
            paddingBottom: 6,
          },
          "& .MuiInputLabel-root": {
            fontSize: 12,
          },
          "& .MuiSvgIcon-root": {
            color: alpha(theme.palette.primary.main, 0.7),
          },
        }),
      },
    },
    MuiPickersInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: 12,
        }),
        input: {
          fontSize: 12,
        },
        sectionsContainer: {
          fontSize: 12,
        },
      },
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          backgroundColor: "#fff",
          "& fieldset": {
            borderColor: alpha(theme.palette.primary.main, 0.35),
          },
          "&:hover fieldset": {
            borderColor: alpha(theme.palette.primary.main, 0.6),
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 3px ${alpha(
              theme.palette.primary.main,
              0.08
            )}`,
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "4px",
        },
      },
    },
    // @ts-ignore
    MuiPieArcLabel: {
      styleOverrides: {
        root: {
          fill: "#FFF",
          fontFamily: "Libre Franklin, sans-serif",
        },
      },
    },
    MuiChartsTooltip: {
      styleOverrides: {
        root: {
          fill: "#FFF",
          fontFamily: "Libre Franklin, sans-serif",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Authenticator.Provider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Authenticator.Provider>
    </Provider>
  </ThemeProvider>
);
