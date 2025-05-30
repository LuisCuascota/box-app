import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { ModulesEnum, RoutesEnum } from "../../shared/enums/Routes.enum.ts";
import React, { useState } from "react";
import {
  Collapse,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { AccountCircle, ExpandLess, ExpandMore } from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import Logo from "../../assets/caja_logo_2.png";
import { useAuthenticator } from "@aws-amplify/ui-react";

interface navPages {
  icon: any;
  title: ModulesEnum;
  child: {
    icon: any;
    title: string;
    link: string;
  }[];
}

const pages: navPages[] = [
  {
    icon: <PointOfSaleIcon fontSize="small" />,
    title: ModulesEnum.ENTRY,
    child: [
      {
        icon: <AddCircleIcon fontSize="small" />,
        link: RoutesEnum.ENTRY,
        title: "Nuevo",
      },
      {
        icon: <FormatListNumberedIcon fontSize="small" />,
        link: RoutesEnum.ENTRY_HISTORY,
        title: "Historial",
      },
    ],
  },
  {
    icon: <CreditScoreIcon fontSize="small" />,
    title: ModulesEnum.LOAN,
    child: [
      {
        icon: <AddCircleIcon fontSize="small" />,
        link: RoutesEnum.LOAN,
        title: "Nuevo",
      },
      {
        icon: <FormatListNumberedIcon fontSize="small" />,
        link: RoutesEnum.LOAN_HISTORY,
        title: "Historial",
      },
    ],
  },
  {
    icon: <CreditScoreIcon fontSize="small" />,
    title: ModulesEnum.EGRESS,
    child: [
      {
        icon: <AddCircleIcon fontSize="small" />,
        link: RoutesEnum.EGRESS,
        title: "Nuevo",
      },
      {
        icon: <FormatListNumberedIcon fontSize="small" />,
        link: RoutesEnum.EGRESS_HISTORY,
        title: "Historial",
      },
    ],
  },
  {
    icon: <CreditScoreIcon fontSize="small" />,
    title: ModulesEnum.PARTNERS,
    child: [
      {
        icon: <FormatListNumberedIcon fontSize="small" />,
        link: RoutesEnum.PARTNER_LIST,
        title: "Listado",
      },
    ],
  },
  {
    icon: <BarChartIcon fontSize="small" />,
    title: ModulesEnum.METRICS,
    child: [
      {
        icon: <BarChartIcon fontSize="small" />,
        link: RoutesEnum.METRICS,
        title: "Datos",
      },
    ],
  },
  {
    icon: <BarChartIcon fontSize="small" />,
    title: ModulesEnum.PERIOD,
    child: [
      {
        icon: <BarChartIcon fontSize="small" />,
        link: RoutesEnum.PERIOD,
        title: "Balances",
      },
    ],
  },
];

export const NavigationBar = (props: { isOffLine: boolean }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
  const { authStatus, signOut } = props.isOffLine
    ? { authStatus: "authenticated", signOut: () => {} }
    : useAuthenticator((context) => [context.authStatus]);

  const [anchorElEntry, setAnchorElEntry] = useState<null | HTMLElement>(null);
  const [anchorElLoan, setAnchorElLoan] = useState<null | HTMLElement>(null);
  const [anchorElEgress, setAnchorElEgress] = useState<null | HTMLElement>(
    null
  );
  const [anchorElPartner, setAnchorElPartner] = useState<null | HTMLElement>(
    null
  );
  const [anchorElMetrics, setAnchorElMetrics] = useState<null | HTMLElement>(
    null
  );
  const [anchorElLogin, setAnchorElLogin] = useState<null | HTMLElement>(null);
  const [anchorElPeriod, setAnchorElPeriod] = useState<null | HTMLElement>(
    null
  );

  const [openSideBar, setOpenSidebar] = useState<boolean>(false);

  const handleActionMenu = (
    title: string,
    event?: React.MouseEvent<HTMLElement>
  ) => {
    switch (title) {
      case ModulesEnum.ENTRY:
        setAnchorElEntry((prevState) =>
          prevState ? null : event!.currentTarget
        );

        return;
      case ModulesEnum.LOAN:
        setAnchorElLoan((prevState) =>
          prevState ? null : event!.currentTarget
        );

        return;
      case ModulesEnum.EGRESS:
        setAnchorElEgress((prevState) =>
          prevState ? null : event!.currentTarget
        );

        return;
      case ModulesEnum.PARTNERS:
        setAnchorElPartner((prevState) =>
          prevState ? null : event!.currentTarget
        );

        return;

      case ModulesEnum.METRICS:
        setAnchorElMetrics((prevState) =>
          prevState ? null : event!.currentTarget
        );

        return;
      case ModulesEnum.LOGIN:
        setAnchorElLogin((prevState) =>
          prevState ? null : event!.currentTarget
        );

        return;

      case ModulesEnum.PERIOD:
        setAnchorElPeriod((prevState) =>
          prevState ? null : event!.currentTarget
        );
    }
  };

  const getAnchorEl = (title: string) => {
    switch (title) {
      case ModulesEnum.ENTRY:
        return anchorElEntry;
      case ModulesEnum.LOAN:
        return anchorElLoan;
      case ModulesEnum.EGRESS:
        return anchorElEgress;
      case ModulesEnum.PARTNERS:
        return anchorElPartner;
      case ModulesEnum.METRICS:
        return anchorElMetrics;
      case ModulesEnum.LOGIN:
        return anchorElLogin;
      case ModulesEnum.PERIOD:
        return anchorElPeriod;
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {!isMdScreen && authStatus === "authenticated" && (
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => setOpenSidebar(true)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <SwipeableDrawer
                anchor={"left"}
                open={openSideBar}
                onClose={() => setOpenSidebar(false)}
                onOpen={() => {}}
              >
                <List>
                  {pages.map((page) => (
                    <ListItem key={page.title} sx={{ flexDirection: "column" }}>
                      <ListItemButton
                        onClick={(event) => handleActionMenu(page.title, event)}
                      >
                        <ListItemIcon>{page.icon}</ListItemIcon>
                        <ListItemText primary={page.title} />
                        {getAnchorEl(page.title) ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItemButton>
                      <Collapse
                        in={getAnchorEl(page.title) ? true : false}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List>
                          {page.child.map((child) => (
                            <ListItemButton
                              key={child.link}
                              sx={{ pl: 4 }}
                              onClick={(event) => {
                                navigate(child.link);
                                handleActionMenu(page.title, event);
                                setOpenSidebar(false);
                              }}
                            >
                              <ListItemIcon>{child.icon}</ListItemIcon>
                              <ListItemText primary={child.title} />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    </ListItem>
                  ))}
                </List>
              </SwipeableDrawer>
            </Box>
          )}
          <img src={Logo} style={{ display: "flex", width: "60px" }} />
          <Link
            variant="h6"
            href="/"
            underline={"none"}
            color={"white"}
            display={"flex"}
            flexGrow={1}
            fontWeight={600}
            m={2}
          >
            {"Kaja TFM"}
          </Link>
          {isMdScreen && authStatus === "authenticated" && (
            <Box sx={{ display: "flex" }}>
              {pages.map((page) => (
                <Box key={page.title}>
                  <Button
                    onClick={(event) => handleActionMenu(page.title, event)}
                    sx={{ color: "white" }}
                  >
                    {page.title}
                  </Button>
                  <Menu
                    anchorEl={getAnchorEl(page.title)}
                    open={getAnchorEl(page.title) ? true : false}
                    onClose={() => handleActionMenu(page.title)}
                  >
                    {page.child.map((child) => (
                      <MenuItem
                        key={child.link}
                        onClick={(event) => {
                          navigate(child.link);
                          handleActionMenu(page.title, event);
                        }}
                      >
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        <ListItemText>{child.title}</ListItemText>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ))}
            </Box>
          )}
          {authStatus === "authenticated" && (
            <div>
              <IconButton
                size="large"
                onClick={(event) => {
                  handleActionMenu(ModulesEnum.LOGIN, event);
                }}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={getAnchorEl(ModulesEnum.LOGIN)}
                open={Boolean(getAnchorEl(ModulesEnum.LOGIN))}
                onClose={() => handleActionMenu(ModulesEnum.LOGIN)}
              >
                <MenuItem onClick={signOut}>Cerrar Sesión</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
