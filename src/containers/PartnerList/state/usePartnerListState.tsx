import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/Store.hook.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { selectPartners } from "../../../store/selectors/selectors.ts";
import {
  ModePagination,
  PartnerData,
} from "../../../store/interfaces/PartnerState.interfaces.ts";
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
  const [rowSelected, setRowSelected] = useState<PartnerData>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [rowToDeleteState, setRowToDeleteState] = useState<PartnerData>();
  const [isAlertOpenState, setIsAlertOpenState] = useState<boolean>(false);
  const [isSavingModalOpen, setIsSavingModalOpen] = useState<boolean>(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState<boolean>(false);
  const prevDeleteStatusRef = useRef<RequestStatusEnum>(deletePartnerStatus);

  const onPageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const onRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onOpenAlert = (row?: PartnerData) => {
    setRowToDeleteState(row);
    setIsAlertOpenState(true);
  };

  const onCloseAlert = () => {
    setRowToDeleteState(undefined);
    setIsAlertOpenState(false);
  };

  const onAcceptDelete = () => {
    setRowToDeleteState(undefined);
    setIsAlertOpenState(false);
    dispatch(deletePartner(rowToDeleteState!.number!));
  };

  const onOpenModal = (row?: PartnerData) => {
    setRowSelected(row);
    setIsModalOpen(true);
  };

  const onOpenSavingModal = (row: PartnerData) => {
    setRowSelected(row);
    setIsSavingModalOpen(true);
  };

  const onOpenLoanModal = (row: PartnerData) => {
    setRowSelected(row);
    setIsLoanModalOpen(true);
  };

  const searchPartners = useCallback(() => {
    dispatch(
      getPartners({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        mode: ModePagination.FULL,
      })
    );
  }, [dispatch, page, rowsPerPage]);

  const onCloseModal = () => {
    setRowSelected(undefined);
    setIsModalOpen(false);
    searchPartners();
  };

  const onCloseSavingModal = () => {
    setRowSelected(undefined);
    setIsSavingModalOpen(false);
  };

  const onCloseLoanModal = () => {
    setRowSelected(undefined);
    setIsLoanModalOpen(false);
  };

  useEffect(() => {
    dispatch(getPartnersCount());
  }, [dispatch]);

  useEffect(() => {
    searchPartners();
  }, [searchPartners]);

  useEffect(() => {
    if (
      prevDeleteStatusRef.current !== RequestStatusEnum.SUCCESS &&
      deletePartnerStatus === RequestStatusEnum.SUCCESS
    ) {
      dispatch(getPartnersCount());
      searchPartners();
    }
    prevDeleteStatusRef.current = deletePartnerStatus;
  }, [deletePartnerStatus, dispatch, searchPartners]);

  return {
    partners,
    isLoading:
      getPartnersStatus === RequestStatusEnum.PENDING ||
      getPartnersCountStatus === RequestStatusEnum.PENDING,
    isDeleting: deletePartnerStatus === RequestStatusEnum.PENDING,
    alert: {
      rowToDelete: rowToDeleteState,
      isAlertOpen: isAlertOpenState,
      onOpenAlert,
      onCloseAlert,
      onAcceptDelete,
    },
    modal: {
      isModalOpen,
      onCloseModal,
      onOpenModal,
      isSavingModalOpen,
      onOpenSavingModal,
      onCloseSavingModal,
      isLoanModalOpen,
      onOpenLoanModal,
      onCloseLoanModal,
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
