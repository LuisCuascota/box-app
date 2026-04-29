export interface BrandPalette {
  primary: { light: string; main: string; dark: string; contrastText: string };
  secondary: {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  success: { light: string; main: string; dark: string; contrastText: string };
  warning: { light: string; main: string; dark: string; contrastText: string };
  background: { default: string; paper: string };
  text: { primary: string; secondary: string };
}

export interface BrandTypography {
  fontFamily: string;
  headingWeight: number;
  bodyWeight: number;
}

export interface BrandConfig {
  name: string;
  palette: BrandPalette;
  typography: BrandTypography;
  shape: { borderRadius: number };
}

export const kajaBrand: BrandConfig = {
  name: "Kaja",
  palette: {
    primary: {
      light: "#3F6B8A",
      main: "#1B3A57",
      dark: "#112B40",
      contrastText: "#FFFFFF",
    },
    secondary: {
      light: "#FFD08A",
      main: "#FFB347",
      dark: "#E0881D",
      contrastText: "#1B3A57",
    },
    success: {
      light: "#86D3B1",
      main: "#2F855A",
      dark: "#276749",
      contrastText: "#FFFFFF",
    },
    warning: {
      light: "#FCD38D",
      main: "#F59E0B",
      dark: "#D97706",
      contrastText: "#000000",
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
  typography: {
    fontFamily: "Libre Franklin, sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
  shape: {
    borderRadius: 12,
  },
};
