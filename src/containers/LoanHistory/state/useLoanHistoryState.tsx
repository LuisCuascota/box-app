import { ChangeEvent, useEffect, useRef, useState } from "react";
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
import { ModePagination } from "../../../store/interfaces/PartnerState.interfaces.ts";
import { SelectType } from "../../../components/input/OptionsSelect/OptionsSelect.tsx";
import { ComponentsLabels } from "../../../shared/labels/Components.labels.ts";
import { LoanStatusEnum } from "../../../shared/enums/LoanCalcTypeEnum.ts";
import { DefaultPagination } from "../../../shared/constants/KajaConfig.ts";
import { DateRange } from "../../../shared/utils/Date.utils.ts";
import { isGetRequest } from "../../../shared/utils/Components.util.tsx";

export const loanStatusOptions: SelectType[] = [
  {
    label: ComponentsLabels.PAID,
    id: LoanStatusEnum.PAID,
  },
  {
    label: ComponentsLabels.CURRENT,
    id: LoanStatusEnum.CURRENT,
  },
  {
    label: ComponentsLabels.LATE,
    id: LoanStatusEnum.LATE,
  },
];

export const useLoanHistoryState = () => {
  const dispatch = useAppDispatch();
  const loansPaginated = useAppSelector(selectLoansPaginated);
  const loansPaginatedStatus = useAppSelector(selectLoansPaginatedStatus);
  const loanCount = useAppSelector(selectLoanCount);
  const loanCountStatus = useAppSelector(selectLoanCountStatus);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowSelected, setRowSelected] = useState<Loan>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [accountSelector, setAccountSelector] =
    useState<PartnerSelector | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const accountSelectorRef = useRef(accountSelector);

  const onChangeDateRange = (from: string, to: string) => {
    setDateRange({ from, to });
  };

  const onChangePaymentStatus = (type: string | null) => {
    setPaymentStatus(type);
  };

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

  const onSelectPartner = (selected: PartnerSelector | null) => {
    setAccountSelector(selected);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getPartners({ mode: ModePagination.SIMPLE }));
  }, []);

  useEffect(() => {
    setIsLoading(true);

    if (isGetRequest(accountSelectorRef, accountSelector, page, rowsPerPage))
      dispatch(
        getLoansPaginated({
          account: accountSelector?.id,
          limit: rowsPerPage,
          offset: page * rowsPerPage,
          startDate: dateRange?.from,
          endDate: dateRange?.to,
          paymentType: paymentStatus,
        })
      );

    accountSelectorRef.current = accountSelector;
  }, [page, rowsPerPage, accountSelector, dateRange, paymentStatus]);

  useEffect(() => {
    setPage(DefaultPagination.page);
    setRowsPerPage(DefaultPagination.rowsPerPage);

    dispatch(
      getLoanCount({
        account: accountSelector?.id,
        startDate: dateRange?.from,
        endDate: dateRange?.to,
        paymentType: paymentStatus,
      })
    );
  }, [accountSelector, dateRange, paymentStatus]);

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
      onSelectPartner,
      accountSelector,
      onChangeDateRange,
      onChangePaymentStatus,
    },
  };
};
