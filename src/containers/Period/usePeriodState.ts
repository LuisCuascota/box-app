import {
  useAppDispatch,
  useAppSelector,
} from "../../shared/hooks/Store.hook.ts";
import {
  selectBalance,
  selectMetrics,
} from "../../store/selectors/selectors.ts";
import { useEffect, useState } from "react";
import { getTypesMetrics } from "../../store/epics/MetricsEpics/getTypesMetrics.epic.ts";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import { TypeMetric } from "../../store/interfaces/MetricsState.interfaces.ts";
import { getPartnersBalance } from "../../store/epics/BalanceEpic/getBalance.epic.ts";
import { PartnerEntry } from "../../store/interfaces/BalanceState.interfaces.ts";
import moment from "moment/moment";
import { PeriodSelector } from "../../components/input/PeriodSearch/PeriodSearch.tsx";
import { getPeriodList } from "../../store/epics/BalanceEpic/getPeriod.epic.ts";

export const UsePeriodState = () => {
  const dispatch = useAppDispatch();

  const { getTypesMetricsStatus, typesMetrics } = useAppSelector(selectMetrics);
  const { getBalanceStatus, partnersBalance } = useAppSelector(selectBalance);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [revenueValues, setRevenueValues] = useState<TypeMetric[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [headYearCount, setHeadYearCount] = useState({});
  const [validationRevenue, setValidationRevenue] = useState<number>(0);
  const [validationAverage, setValidationAverage] = useState<number>(0);
  const [periodSelector, setPeriodSelector] = useState<PeriodSelector | null>(
    null
  );

  const onSelectPeriod = (selected: PeriodSelector | null) => {
    setPeriodSelector(selected);
  };

  const buildRevenueFields = () => {
    const revenueValues = typesMetrics.filter((item) =>
      [4, 5, 6].includes(item.id)
    );
    const totalRevenue = revenueValues.reduce(
      (accumulator, currentItem) => accumulator + currentItem.sum,
      0
    );

    setRevenueValues(revenueValues);
    setTotalRevenue(totalRevenue);
  };

  const buildHeadDate = () => {
    const yearCounters = partnersBalance[0].entries.reduce(
      (
        acc: {
          [key: string]: number;
        },
        item: PartnerEntry
      ) => {
        const year = moment(item.date).year();

        if (!acc[year]) acc[year] = 0;

        acc[year]++;

        return acc;
      },
      {}
    );

    setHeadYearCount(yearCounters);
  };

  const buildValidationValues = () => {
    const average =
      partnersBalance.reduce(
        (acc, balance) => acc + +balance.participationPercentage,
        0
      ) * 100;

    setValidationAverage(average);
  };

  useEffect(() => {
    if (totalRevenue > 0) {
      const revenue = partnersBalance.reduce(
        (acc, balance) => acc + balance.participationPercentage * totalRevenue,
        0
      );

      setValidationRevenue(revenue);
    }
  }, [totalRevenue]);

  useEffect(() => {
    if (periodSelector) {
      setIsLoading(true);
      dispatch(getTypesMetrics({ period: periodSelector.id }));
      dispatch(getPartnersBalance({ period: periodSelector.id }));
    }
  }, [periodSelector]);

  useEffect(() => {
    dispatch(getPeriodList());
  }, []);

  useEffect(() => {
    if (
      getTypesMetricsStatus === RequestStatusEnum.SUCCESS &&
      getBalanceStatus === RequestStatusEnum.SUCCESS
    ) {
      buildRevenueFields();
      buildHeadDate();
      buildValidationValues();
      setIsLoading(false);
    }
  }, [getTypesMetricsStatus, getBalanceStatus]);

  return {
    isLoading,
    revenueValues,
    totalRevenue,
    partnersBalance,
    headYearCount,
    validationAverage,
    validationRevenue,
    search: {
      onSelectPeriod,
    },
  };
};
