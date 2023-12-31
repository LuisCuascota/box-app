import {
  useAppDispatch,
  useAppSelector,
} from "../../shared/hooks/Store.hook.ts";
import { selectMetrics } from "../../store/selectors/selectors.ts";
import { useEffect, useState } from "react";
import { getMetrics } from "../../store/epics/MetricsEpics/getMetrics.epic.ts";
import { getTypesMetrics } from "../../store/epics/MetricsEpics/getTypesMetrics.epic.ts";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import { TypeMetric } from "../../store/interfaces/MetricsState.interfaces.ts";

export const useMetricsState = () => {
  const dispatch = useAppDispatch();

  const { metrics, getMetricsStatus, getTypesMetricsStatus, typesMetrics } =
    useAppSelector(selectMetrics);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [utilsMetrics, setUtilsMetrics] = useState<TypeMetric[]>([]);

  const buildUtilsMetrics = () => {
    const utilsMetrics: TypeMetric[] = [];
    const revenueValue = typesMetrics
      .filter((item) => [4, 5, 6].includes(item.id))
      .reduce((accumulator, currentItem) => accumulator + currentItem.sum, 0);
    const capitalValue = typesMetrics
      .filter((item) => [8, 3].includes(item.id))
      .reduce((accumulator, currentItem) => accumulator + currentItem.sum, 0);

    utilsMetrics.push(
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
        sum: metrics!.loanTotalDispatched,
      }
    );

    setUtilsMetrics(utilsMetrics);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getMetrics());
    dispatch(getTypesMetrics());
  }, []);

  useEffect(() => {
    if (
      getMetricsStatus === RequestStatusEnum.SUCCESS &&
      getTypesMetricsStatus === RequestStatusEnum.SUCCESS
    ) {
      buildUtilsMetrics();
      setIsLoading(false);
    }
  }, [getMetricsStatus, getTypesMetricsStatus]);

  return {
    metrics,
    typesMetrics,
    utilsMetrics,
    isLoading,
  };
};
