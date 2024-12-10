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
import { environment } from "../../../environments/environment.ts";
import moment from "moment";
import { DATE_FORMAT } from "../../../shared/utils/Date.utils.ts";

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
  const [accountSelector, setAccountSelector] = useState<
    PartnerSelector | undefined
  >();
  const [dateRange, setDateRange] = useState<string[]>([
    environment.startDate,
    moment().format(DATE_FORMAT),
  ]);
  const accountSelectorRef = useRef(accountSelector);

  const onChangeDateRange = (from: string, to: string) => {
    setDateRange([from, to]);
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

  const onSelectPartner = (selected: PartnerSelector) => {
    setAccountSelector(selected);
  };
  const onClearPartner = () => {
    setAccountSelector(undefined);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getPartners({ mode: ModePagination.SIMPLE }));
  }, []);

  useEffect(() => {
    setIsLoading(true);

    const isGetRequest = () => {
      return (
        accountSelectorRef.current === accountSelector ||
        (accountSelectorRef.current != accountSelector &&
          page === DefaultPagination.page &&
          rowsPerPage === DefaultPagination.rowsPerPage)
      );
    };

    if (isGetRequest())
      dispatch(
        getEntriesPaginated({
          account: accountSelector?.id,
          limit: rowsPerPage,
          offset: page * rowsPerPage,
          startDate: dateRange[0],
          endDate: dateRange[1],
        })
      );

    accountSelectorRef.current = accountSelector;
  }, [page, rowsPerPage, accountSelector, dateRange]);

  useEffect(() => {
    setPage(DefaultPagination.page);
    setRowsPerPage(DefaultPagination.rowsPerPage);

    dispatch(
      getEntryCount({
        account: accountSelector?.id,
        startDate: dateRange[0],
        endDate: dateRange[1],
      })
    );
  }, [accountSelector, dateRange]);

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
      onClearPartner,
      onSelectPartner,
      accountSelector,
      onChangeDateRange,
      dateRange,
    },
  };
};
