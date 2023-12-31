import {
  Authenticator,
  View,
  useTheme,
  translations,
  Heading,
  Theme,
  ThemeProvider,
} from "@aws-amplify/ui-react";
import Logo from "../../assets/caja_logo.png";
import "@aws-amplify/ui-react/styles.css";
import { I18n } from "aws-amplify/utils";
import { Grid } from "@mui/material";
import Container from "@mui/material/Container";
import { CardItem, CardItemProps } from "./CardItem.tsx";
import { ModulesEnum, RoutesEnum } from "../../shared/enums/Routes.enum.ts";
import entryImg from "../../assets/entry.png";
import egressImg from "../../assets/egress.png";
import loanImg from "../../assets/loan.png";
import partnersImg from "../../assets/partners.png";
import metricsImg from "../../assets/metrics.png";

export const Login = () => {
  I18n.putVocabularies(translations);
  I18n.setLanguage("es");

  const theme: Theme = {
    name: "Auth Example Theme",
    tokens: {
      colors: {
        font: {
          interactive: {
            value: "#1f3c55",
          },
        },
      },
      components: {
        button: {
          primary: {
            backgroundColor: {
              value: "#1f3c55",
            },
          },
        },
      },
    },
  };

  const components = {
    Header() {
      const { tokens } = useTheme();

      return (
        <View textAlign="center" padding={tokens.space.large}>
          <img
            alt="Kaja Logo"
            src={Logo}
            style={{ width: "200px", marginTop: "20px" }}
          />
        </View>
      );
    },
    ForgotPassword: {
      Header() {
        return (
          <Heading level={4} textAlign={"center"}>
            Recuperar contraseña
          </Heading>
        );
      },
    },
  };

  const cardItems: CardItemProps[] = [
    {
      title: ModulesEnum.ENTRY,
      description: "Registra nuevos aportes, pagar creditos y otros rubros.",
      image: entryImg,
      primaryButton: "Nuevo",
      primaryButtonLink: RoutesEnum.ENTRY,
      secondaryButton: "Historial",
      secondaryButtonLink: RoutesEnum.ENTRY_HISTORY,
    },
    {
      title: ModulesEnum.EGRESS,
      description:
        "Registra nuevos egresos, cada centavo que sale debe quedar registrado.",
      image: egressImg,
      primaryButton: "Nuevo",
      primaryButtonLink: RoutesEnum.EGRESS,
      secondaryButton: "Historial",
      secondaryButtonLink: RoutesEnum.EGRESS_HISTORY,
    },
    {
      title: ModulesEnum.LOAN,
      description:
        "Registra nuevos créditos, calcula e imprime tablas de amortizción.",
      image: loanImg,
      primaryButton: "Nuevo",
      primaryButtonLink: RoutesEnum.LOAN,
      secondaryButton: "Historial",
      secondaryButtonLink: RoutesEnum.LOAN_HISTORY,
    },
    {
      title: ModulesEnum.PARTNERS,
      description:
        "Gestiona la informacion de los miembros de la Caja de Ahorro.",
      image: partnersImg,
      primaryButton: "Gestionar",
      primaryButtonLink: RoutesEnum.PARTNER_LIST,
    },
    {
      title: ModulesEnum.METRICS,
      description:
        "Visualiza todas las métricas, dinero desponible y otros valores de utilidad.",
      image: metricsImg,
      primaryButton: "Revisar",
      primaryButtonLink: RoutesEnum.METRICS,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Authenticator components={components} hideSignUp={true}>
        {() => (
          <Container>
            <Grid container>
              {cardItems.map((item, index) => (
                <CardItem
                  key={index}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  primaryButton={item.primaryButton}
                  primaryButtonLink={item.primaryButtonLink}
                  secondaryButton={item.secondaryButton}
                  secondaryButtonLink={item.secondaryButtonLink}
                />
              ))}
            </Grid>
          </Container>
        )}
      </Authenticator>
    </ThemeProvider>
  );
};
