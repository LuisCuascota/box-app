import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import {
  Backdrop,
  Box,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { UsePeriodState } from "./usePeriodState.ts";
import { PieChart } from "@mui/x-charts";
import { PartnerListLabels } from "../../shared/labels/PartnerList.labels.ts";
import {
  PartnerBalance,
  PartnerEntry,
} from "../../store/interfaces/BalanceState.interfaces.ts";
import moment from "moment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import { ColorsEnum } from "../../shared/enums/Colors.enum.ts";

interface BalanceDetailProps {
  balance: PartnerBalance;
  isLoading: boolean;
  headYearCount: object;
  totalRevenue: number;
}

const BalanceDetail = (props: BalanceDetailProps) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: ColorsEnum.PRIMARY_LIGHT,
            }}
          >
            {!props.isLoading &&
              Object.entries(props.headYearCount).map(([year, count]) => (
                <TableCell
                  key={year}
                  align="center"
                  colSpan={count as number}
                  sx={{ color: ColorsEnum.WHITE }}
                >
                  {year}
                </TableCell>
              ))}
          </TableRow>
          <TableRow
            sx={{
              backgroundColor: ColorsEnum.PRIMARY_LIGHT,
            }}
          >
            {!props.isLoading &&
              props.balance.entries.map((entry: PartnerEntry, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{ color: ColorsEnum.WHITE }}
                >
                  {moment(entry.date).format("MMM")}
                </TableCell>
              ))}
          </TableRow>
          <TableRow sx={{ backgroundColor: ColorsEnum.SECONDARY_LIGHT }}>
            {!props.isLoading &&
              props.balance.entries.map((entry: PartnerEntry, index) => (
                <TableCell key={index} align="center">
                  {entry.monthCount}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ backgroundColor: ColorsEnum.SECONDARY_LIGHT }}>
            {!props.isLoading &&
              props.balance.entries.map((entry: PartnerEntry, index) => (
                <TableCell key={index} align="center">
                  {entry.value}
                </TableCell>
              ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const BalanceRow = (props: BalanceDetailProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align={"center"}>
          <b>{props.balance.account}</b>
        </TableCell>
        <TableCell>
          <i>{props.balance.names}</i>
        </TableCell>
        <TableCell
          align={"center"}
        >{`$${props.balance.currentSaving}`}</TableCell>
        <TableCell align={"center"}>{`%${(
          props.balance.participationPercentage * 100
        ).toFixed(2)}`}</TableCell>
        <TableCell align={"center"}>{`$${(
          props.balance.participationPercentage * props.totalRevenue
        ).toFixed(2)}`}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <BalanceDetail {...props} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const PeriodContainer = () => {
  const {
    isLoading,
    revenueValues,
    totalRevenue,
    headYearCount,
    partnersBalance,
    validationAverage,
    validationRevenue,
  } = UsePeriodState();

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
            {"Balances del Periodo"}
          </Typography>
        </Grid>
        <Grid item md={12} xs={12}>
          <PieChart
            colors={["#d5a92b", "#1f3c55", "#808080"]}
            series={[
              {
                data: revenueValues.map((item, index) => ({
                  id: index,
                  value: item.sum,
                  label: item.description,
                })),
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
            {`Ganancias: $${totalRevenue}`}
          </Typography>
        </Grid>
      </Grid>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow key={"data-row"}>
              <TableCell />
              <TableCell align="center">
                <Typography color={"red"}>
                  {PartnerListLabels.TH_ACCOUNT}
                </Typography>
              </TableCell>
              <TableCell align="center">{PartnerListLabels.TH_NAMES}</TableCell>
              <TableCell align="center">
                {PartnerListLabels.TH_SAVING}
              </TableCell>
              <TableCell align="center">
                {PartnerListLabels.TH_AVERAGE}
              </TableCell>
              <TableCell align="center">
                {PartnerListLabels.TH_REVENUE}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              partnersBalance.map((row: PartnerBalance, index) => (
                <BalanceRow
                  key={index}
                  balance={row}
                  isLoading={isLoading}
                  headYearCount={headYearCount}
                  totalRevenue={totalRevenue}
                />
              ))}
            <TableRow>
              <TableCell colSpan={3} />
              <TableCell>TOTAL</TableCell>
              <TableCell align={"center"}>{`%${validationAverage}`}</TableCell>
              <TableCell align={"center"}>{`$${validationRevenue.toFixed(
                2
              )}`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </PaperBase>
  );
};
