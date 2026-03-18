import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/Store.hook.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import {
  selectEgressCount,
  selectEgressCountStatus,
  selectEgressPaginated,
  selectEgressPaginatedStatus,
  selectGetPeriodList,
} from "../../../store/selectors/selectors.ts";
import { EgressHeader } from "../../../store/interfaces/EgressState.interfaces.ts";
import { getEgressCount } from "../../../store/epics/EgressEpics/getEgressCount.epic.ts";
import { getEgressPaginated } from "../../../store/epics/EgressEpics/getEgressPaginated.epic.ts";
import { SelectType } from "../../../components/input/OptionsSelect/OptionsSelect.tsx";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { PaymentMethodEnum } from "../../../shared/enums/PaymentMethod.enum.ts";
import { getTypesMetrics } from "../../../store/epics/MetricsEpics/getTypesMetrics.epic.ts";
import { DateRange } from "../../../shared/utils/Date.utils.ts";
import { TypesSelector } from "../../../components/input/TypesSearch/TypesSearch.tsx";
import { isGetRequest } from "../../../shared/utils/Components.util.tsx";
import { DefaultPagination } from "../../../shared/constants/KajaConfig.ts";
import { PeriodSelector } from "../../../components/input/PeriodSearch/PeriodSearch.tsx";
import { getPeriodList } from "../../../store/epics/BalanceEpic/getPeriod.epic.ts";

export const egressTypeOptions: SelectType[] = [
  {
    label: ComponentsLabels.TYPE_CASH,
    id: PaymentMethodEnum.CASH,
  },
  {
    label: ComponentsLabels.TYPE_TRANSFER,
    id: PaymentMethodEnum.TRANSFER,
  },
  {
    label: ComponentsLabels.TYPE_MIX,
    id: PaymentMethodEnum.MIXED,
  },
];

export const useEgressHistoryState = () => {
  const dispatch = useAppDispatch();
  const egressPaginated = useAppSelector(selectEgressPaginated);
  const egressPaginatedStatus = useAppSelector(selectEgressPaginatedStatus);
  const egressCount = useAppSelector(selectEgressCount);
  const egressCountStatus = useAppSelector(selectEgressCountStatus);
  const { getPeriodListStatus } = useAppSelector(selectGetPeriodList);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [rowSelected, setRowSelected] = useState<EgressHeader>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [typeSelector, setTypeSelector] = useState<TypesSelector | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [paymentType, setPaymentType] = useState<string | null>(null);
  const [periodSelector, setPeriodSelector] = useState<PeriodSelector | null>(
    null
  );

  const typeSelectorRef = useRef(typeSelector);

  const onChangeDateRange = (from: string, to: string) => {
    setDateRange({ from, to });
    setPage(DefaultPagination.page);
    setRowsPerPage(DefaultPagination.rowsPerPage);
  };

  const onChangePaymentType = (type: string | null) => {
    setPaymentType(type);
    setPage(DefaultPagination.page);
    setRowsPerPage(DefaultPagination.rowsPerPage);
  };

  const onSelectType = (selected: TypesSelector | null) => {
    setTypeSelector(selected);
    setPage(DefaultPagination.page);
    setRowsPerPage(DefaultPagination.rowsPerPage);
  };

  const onSelectPeriod = (selected: PeriodSelector | null) => {
    setPeriodSelector(selected);
    setPage(DefaultPagination.page);
    setRowsPerPage(DefaultPagination.rowsPerPage);
  };

  const onPageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const onRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onOpenModal = (row: EgressHeader) => {
    setRowSelected(row);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setRowSelected(undefined);
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(getPeriodList());
  }, [dispatch]);

  useEffect(() => {
    if (getPeriodListStatus === RequestStatusEnum.SUCCESS && periodSelector)
      dispatch(getTypesMetrics({ period: periodSelector.id }));
  }, [dispatch, getPeriodListStatus, periodSelector]);

  useEffect(() => {
    if (
      isGetRequest(typeSelectorRef, typeSelector, page, rowsPerPage) &&
      periodSelector
    )
      dispatch(
        getEgressPaginated({
          limit: rowsPerPage,
          offset: page * rowsPerPage,
          type: typeSelector?.id,
          startDate: dateRange?.from,
          endDate: dateRange?.to,
          paymentType,
          period: periodSelector?.id,
        })
      );

    typeSelectorRef.current = typeSelector;
  }, [
    dateRange,
    dispatch,
    page,
    paymentType,
    periodSelector,
    rowsPerPage,
    typeSelector,
  ]);

  useEffect(() => {
    if (periodSelector) {
      dispatch(
        getEgressCount({
          type: typeSelector?.id,
          startDate: dateRange?.from,
          endDate: dateRange?.to,
          paymentType: paymentType,
          period: periodSelector?.id,
        })
      );
    }
  }, [dateRange, dispatch, paymentType, periodSelector, typeSelector]);

  return {
    egressPaginated,
    isLoading:
      egressCountStatus === RequestStatusEnum.PENDING ||
      egressPaginatedStatus === RequestStatusEnum.PENDING,
    modal: {
      isModalOpen,
      onCloseModal,
      onOpenModal,
      rowSelected,
    },
    pagination: {
      egressCount,
      onPageChange,
      onRowsPerPageChange,
      page,
      rowsPerPage,
    },
    search: {
      onSelectPeriod,
      onSelectType,
      onChangeDateRange,
      onChangePaymentType,
    },
  };
};
