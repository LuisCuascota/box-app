import { ChangeEvent, useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/Store.hook.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { selectPartners } from "../../../store/selectors/selectors.ts";
import { PartnerData } from "../../../store/interfaces/PartnerState.interfaces.ts";
import { getPartners } from "../../../store/epics/PartnerEpics/getPartners.epic.ts";
import { getPartnersCount } from "../../../store/epics/PartnerEpics/getPartnersCount.epic.ts";
import { deletePartner } from "../../../store/epics/PartnerEpics/deletePartner.epic.ts";

export const usePartnerListState = () => {
  const dispatch = useAppDispatch();
  const {
    partners,
    getPartnersStatus,
    partnersCount,
    getPartnersCountStatus,
    deletePartnerStatus,
  } = useAppSelector(selectPartners);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(30);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowSelected, setRowSelected] = useState<PartnerData>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [rowToDelete, setRowToDelete] = useState<PartnerData>();
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [isModalAccountOpen, setIsModalAccountOpen] = useState<boolean>(false);

  const onPageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const onRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onOpenAlert = (row?: PartnerData) => {
    setRowToDelete(row);
    setIsAlertOpen(true);
  };

  const onCloseAlert = () => {
    setRowToDelete(undefined);
    setIsAlertOpen(false);
  };

  const onAcceptDelete = () => {
    setIsLoading(true);
    dispatch(deletePartner(rowToDelete!.number!));
  };

  const onOpenModal = (row?: PartnerData) => {
    setRowSelected(row);
    setIsModalOpen(true);
  };

  const onOpenAccountModal = (row: PartnerData) => {
    setRowSelected(row);
    setIsModalAccountOpen(true);
  };

  const searchPartners = () => {
    dispatch(
      getPartners({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      })
    );
  };

  const onCloseModal = () => {
    setRowSelected(undefined);
    setIsModalOpen(false);
    setIsModalAccountOpen(false);
    setIsLoading(true);
    searchPartners();
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getPartnersCount());
  }, []);

  useEffect(() => {
    setIsLoading(true);
    searchPartners();
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (
      getPartnersCountStatus === RequestStatusEnum.SUCCESS &&
      getPartnersStatus === RequestStatusEnum.SUCCESS
    )
      setIsLoading(false);
  }, [getPartnersCountStatus, getPartnersStatus]);

  useEffect(() => {
    if (deletePartnerStatus === RequestStatusEnum.SUCCESS) {
      dispatch(getPartnersCount());
      setRowToDelete(undefined);
      setIsAlertOpen(false);
      searchPartners();
    }
  }, [deletePartnerStatus]);

  return {
    partners,
    isLoading,
    alert: {
      rowToDelete,
      isAlertOpen,
      onOpenAlert,
      onCloseAlert,
      onAcceptDelete,
    },
    modal: {
      isModalOpen,
      isModalAccountOpen,
      onCloseModal,
      onOpenModal,
      onOpenAccountModal,
      rowSelected,
    },
    pagination: {
      partnersCount,
      onPageChange,
      onRowsPerPageChange,
      page,
      rowsPerPage,
    },
  };
};
