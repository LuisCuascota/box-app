import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { Authenticator } from "@aws-amplify/ui-react";

const theme = createTheme({
  typography: {
    fontFamily: "Libre Franklin, sans-serif",
  },
  palette: {
    primary: {
      light: "#7089a4",
      main: "#1f3c55",
      dark: "#112a40",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffed75",
      main: "#eac030",
      dark: "#d5a92b",
      contrastText: "#000",
    },
  },
  components: {
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
    <Authenticator.Provider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </Authenticator.Provider>
  </ThemeProvider>
);
