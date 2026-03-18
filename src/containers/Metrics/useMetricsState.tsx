import {
  useAppDispatch,
  useAppSelector,
} from "../../shared/hooks/Store.hook.ts";
import { selectMetrics } from "../../store/selectors/selectors.ts";
import { useEffect, useMemo, useState } from "react";
import { getMetrics } from "../../store/epics/MetricsEpics/getMetrics.epic.ts";
import { getTypesMetrics } from "../../store/epics/MetricsEpics/getTypesMetrics.epic.ts";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import { TypeMetric } from "../../store/interfaces/MetricsState.interfaces.ts";
import { getPeriodList } from "../../store/epics/BalanceEpic/getPeriod.epic.ts";
import { PeriodSelector } from "../../components/input/PeriodSearch/PeriodSearch.tsx";

export const useMetricsState = () => {
  const dispatch = useAppDispatch();

  const { metrics, getMetricsStatus, getTypesMetricsStatus, typesMetrics } =
    useAppSelector(selectMetrics);

  const [periodSelector, setPeriodSelector] = useState<PeriodSelector | null>(
    null
  );

  const utilsMetrics = useMemo(() => {
    if (!metrics || typesMetrics.length === 0) return [];
    const calculated: TypeMetric[] = [];
    const revenueValue = typesMetrics
      .filter((item) => [4, 5, 6].includes(item.id))
      .reduce((accumulator, currentItem) => accumulator + currentItem.sum, 0);
    const capitalValue = typesMetrics
      .filter((item) => [8, 3].includes(item.id))
      .reduce((accumulator, currentItem) => accumulator + currentItem.sum, 0);

    calculated.push(
      {
        id: 1,
        description: "Valor acumulado por intereses y multas",
        sum: +revenueValue.toFixed(2),
      },
      {
        id: 1,
        description: "Valor acumulado por capital y aportes",
        sum: +capitalValue.toFixed(2),
      },
      {
        id: 1,
        description: "Valor actual despachado en créditos",
        sum: metrics.loanTotalDispatched,
      }
    );

    return calculated;
  }, [metrics, typesMetrics]);

  const onSelectPeriod = (selected: PeriodSelector | null) => {
    setPeriodSelector(selected);
  };

  useEffect(() => {
    if (periodSelector) {
      dispatch(getMetrics({ period: periodSelector.id }));
      dispatch(getTypesMetrics({ period: periodSelector.id }));
    }
  }, [dispatch, periodSelector]);

  useEffect(() => {
    dispatch(getPeriodList());
  }, [dispatch]);

  return {
    metrics,
    typesMetrics,
    utilsMetrics,
    isLoading:
      getMetricsStatus === RequestStatusEnum.PENDING ||
      getTypesMetricsStatus === RequestStatusEnum.PENDING,
    search: {
      onSelectPeriod,
    },
  };
};
