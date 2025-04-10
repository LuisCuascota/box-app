import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/Store.hook.ts";
import { getPartners } from "../../../store/epics/PartnerEpics/getPartners.epic.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { EntryHeader } from "../../../store/interfaces/EntryState.interfaces.ts";
import { getEntryCount } from "../../../store/epics/EntryEpics/getEntryCount.epic.ts";
import { PartnerSelector } from "../../../components/input/PersonSearch/PartnerSearch.tsx";
import { getEntriesPaginated } from "../../../store/epics/EntryEpics/getEntriesPaginated.epic.ts";
import {
  selectEntriesPaginated,
  selectEntriesPaginatedStatus,
  selectEntryCount,
  selectEntryCountStatus,
} from "../../../store/selectors/selectors.ts";
import { ModePagination } from "../../../store/interfaces/PartnerState.interfaces.ts";
import { DefaultPagination } from "../../../shared/constants/KajaConfig.ts";
import { DateRange } from "../../../shared/utils/Date.utils.ts";
import { SelectType } from "../../../components/input/OptionsSelect/OptionsSelect.tsx";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { PaymentMethodEnum } from "../../../shared/enums/PaymentMethod.enum.ts";
import { isGetRequest } from "../../../shared/utils/Components.util.tsx";
import { getPeriodList } from "../../../store/epics/BalanceEpic/getPeriod.epic.ts";
import { PeriodSelector } from "../../../components/input/PeriodSearch/PeriodSearch.tsx";

export const entryTypeOptions: SelectType[] = [
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

export const useEntryHistoryState = () => {
  const dispatch = useAppDispatch();
  const entriesPaginated = useAppSelector(selectEntriesPaginated);
  const entriesPaginatedStatus = useAppSelector(selectEntriesPaginatedStatus);
  const entryCount = useAppSelector(selectEntryCount);
  const entryCountStatus = useAppSelector(selectEntryCountStatus);

  const [page, setPage] = useState<number>(DefaultPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    DefaultPagination.rowsPerPage
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowSelected, setRowSelected] = useState<EntryHeader>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [accountSelector, setAccountSelector] =
    useState<PartnerSelector | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [paymentType, setPaymentType] = useState<string | null>(null);
  const [periodSelector, setPeriodSelector] = useState<PeriodSelector | null>(
    null
  );

  const accountSelectorRef = useRef(accountSelector);

  const onChangeDateRange = (from: string, to: string) => {
    setDateRange({ from, to });
  };

  const onChangePaymentType = (type: string | null) => {
    setPaymentType(type);
  };

  const onPageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const onRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onOpenModal = (row: EntryHeader) => {
    setRowSelected(row);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setRowSelected(undefined);
    setIsModalOpen(false);
  };

  const onSelectPartner = (selected: PartnerSelector | null) => {
    setAccountSelector(selected);
  };

  const onSelectPeriod = (selected: PeriodSelector | null) => {
    setPeriodSelector(selected);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getPartners({ mode: ModePagination.SIMPLE }));
    dispatch(getPeriodList());
  }, []);

  useEffect(() => {
    setIsLoading(true);

    if (
      isGetRequest(accountSelectorRef, accountSelector, page, rowsPerPage) &&
      periodSelector
    )
      dispatch(
        getEntriesPaginated({
          account: accountSelector?.id,
          limit: rowsPerPage,
          offset: page * rowsPerPage,
          startDate: dateRange?.from,
          endDate: dateRange?.to,
          paymentType,
          period: periodSelector?.id,
        })
      );

    accountSelectorRef.current = accountSelector;
  }, [
    page,
    rowsPerPage,
    accountSelector,
    dateRange,
    paymentType,
    periodSelector,
  ]);

  useEffect(() => {
    if (periodSelector) {
      setPage(DefaultPagination.page);
      setRowsPerPage(DefaultPagination.rowsPerPage);

      dispatch(
        getEntryCount({
          account: accountSelector?.id,
          startDate: dateRange?.from,
          endDate: dateRange?.to,
          paymentType,
          period: periodSelector?.id,
        })
      );
    }
  }, [accountSelector, dateRange, paymentType, periodSelector]);

  useEffect(() => {
    if (
      entryCountStatus === RequestStatusEnum.SUCCESS &&
      entriesPaginatedStatus === RequestStatusEnum.SUCCESS
    )
      setIsLoading(false);
  }, [entryCountStatus, entriesPaginatedStatus]);

  return {
    entriesPaginated,
    isLoading,
    modal: {
      isModalOpen,
      onCloseModal,
      onOpenModal,
      rowSelected,
    },
    pagination: {
      entryCount,
      onPageChange,
      onRowsPerPageChange,
      page,
      rowsPerPage,
    },
    search: {
      onSelectPeriod,
      onSelectPartner,
      accountSelector,
      onChangeDateRange,
      onChangePaymentType,
    },
  };
};
