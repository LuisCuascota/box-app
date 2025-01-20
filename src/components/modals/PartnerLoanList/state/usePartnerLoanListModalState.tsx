import { PartnerData } from "../../../../store/interfaces/PartnerState.interfaces.ts";
import { useEffect, useMemo, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../shared/hooks/Store.hook.ts";
import {
  selectLoansPaginated,
  selectLoansPaginatedStatus,
} from "../../../../store/selectors/selectors.ts";
import { RequestStatusEnum } from "../../../../shared/enums/RequestStatus.enum.ts";
import { setLoans } from "../../../../store/actions/loan.actions.ts";
import { getLoansPaginated } from "../../../../store/epics/LoanEpics/getLoansPaginated.epic.ts";
export interface ContributionProcessed {
  date: string;
  description: string;
  entryNumber: number;
  value: number;
  accumulate: number;
}

export interface UsePartnerAccountModalStateProps {
  handleClose: () => void;
  partnerData?: PartnerData;
}

export const UsePartnerLoanListModalState = (
  props: UsePartnerAccountModalStateProps
) => {
  const dispatch = useAppDispatch();

  const loanList = useAppSelector(selectLoansPaginated);
  const loanListStatus = useAppSelector(selectLoansPaginatedStatus);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onCloseModal = () => {
    props.handleClose();
    dispatch(setLoans([]));
  };

  useMemo(() => {
    if (props.partnerData && props.partnerData.number) {
      dispatch(getLoansPaginated({ account: props.partnerData.number }));
      setIsLoading(true);
    }
  }, [props.partnerData?.number]);

  useEffect(() => {
    if (loanListStatus === RequestStatusEnum.SUCCESS) {
      setIsLoading(false);
    }
  }, [loanListStatus]);

  return {
    loanList,
    isLoading,
    onCloseModal,
  };
};
