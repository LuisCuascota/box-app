import { ChangeEvent, useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../shared/hooks/Store.hook.ts";
import { getPartners } from "../../../store/epics/PartnerEpics/getPartners.epic.ts";
import { RequestStatusEnum } from "../../../shared/enums/RequestStatus.enum.ts";
import { PartnerSelector } from "../../../components/input/PersonSearch/PartnerSearch.tsx";
import {
  selectLoanCount,
  selectLoanCountStatus,
  selectLoansPaginated,
  selectLoansPaginatedStatus,
} from "../../../store/selectors/selectors.ts";
import { getLoanCount } from "../../../store/epics/LoanEpics/getLoanCount.epic.ts";
import { getLoansPaginated } from "../../../store/epics/LoanEpics/getLoansPaginated.epic.ts";
import { Loan } from "../../../store/interfaces/LoanState.interfaces.ts";

export const useLoanHistoryState = () => {
  const dispatch = useAppDispatch();
  const loansPaginated = useAppSelector(selectLoansPaginated);
  const loansPaginatedStatus = useAppSelector(selectLoansPaginatedStatus);
  const loanCount = useAppSelector(selectLoanCount);
  const loanCountStatus = useAppSelector(selectLoanCountStatus);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowSelected, setRowSelected] = useState<Loan>();
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

  const onOpenModal = (row: Loan) => {
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
    dispatch(getLoanCount());
    dispatch(getPartners());
  }, []);

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getLoansPaginated({
        account: accountSelector?.id,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      })
    );
  }, [page, rowsPerPage, accountSelector]);

  useEffect(() => {
    if (
      loanCountStatus === RequestStatusEnum.SUCCESS &&
      loansPaginatedStatus === RequestStatusEnum.SUCCESS
    )
      setIsLoading(false);
  }, [loanCountStatus, loansPaginatedStatus]);

  return {
    loansPaginated,
    isLoading,
    modal: {
      isModalOpen,
      onCloseModal,
      onOpenModal,
      rowSelected,
    },
    pagination: {
      loanCount,
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
