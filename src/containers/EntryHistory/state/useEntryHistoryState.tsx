import { ChangeEvent, useEffect, useState } from "react";
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

export const useEntryHistoryState = () => {
  const dispatch = useAppDispatch();
  const entriesPaginated = useAppSelector(selectEntriesPaginated);
  const entriesPaginatedStatus = useAppSelector(selectEntriesPaginatedStatus);
  const entryCount = useAppSelector(selectEntryCount);
  const entryCountStatus = useAppSelector(selectEntryCountStatus);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowSelected, setRowSelected] = useState<EntryHeader>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [accountSelector, setAccountSelector] = useState<
    PartnerSelector | undefined
  >();

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
    dispatch(getEntryCount());
    dispatch(getPartners());
  }, []);

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getEntriesPaginated({
        account: accountSelector?.id,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      })
    );
  }, [page, rowsPerPage, accountSelector]);

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
    },
  };
};
