import { ChangeEvent, useEffect, useState } from "react";
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
} from "../../../store/selectors/selectors.ts";
import { EgressHeader } from "../../../store/interfaces/EgressState.interfaces.ts";
import { getEgressCount } from "../../../store/epics/EgressEpics/getEgressCount.epic.ts";
import { getEgressPaginated } from "../../../store/epics/EgressEpics/getEgressPaginated.epic.ts";

export const useEgressHistoryState = () => {
  const dispatch = useAppDispatch();
  const egressPaginated = useAppSelector(selectEgressPaginated);
  const egressPaginatedStatus = useAppSelector(selectEgressPaginatedStatus);
  const egressCount = useAppSelector(selectEgressCount);
  const egressCountStatus = useAppSelector(selectEgressCountStatus);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowSelected, setRowSelected] = useState<EgressHeader>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    setIsLoading(true);
    dispatch(getEgressCount());
  }, []);

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getEgressPaginated({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      })
    );
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (
      egressCountStatus === RequestStatusEnum.SUCCESS &&
      egressPaginatedStatus === RequestStatusEnum.SUCCESS
    )
      setIsLoading(false);
  }, [egressCountStatus, egressPaginatedStatus]);

  return {
    egressPaginated,
    isLoading,
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
  };
};
