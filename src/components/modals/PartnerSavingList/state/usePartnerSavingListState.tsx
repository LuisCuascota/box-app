import { PartnerData } from "../../../../store/interfaces/PartnerState.interfaces.ts";
import { useEffect, useMemo, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../shared/hooks/Store.hook.ts";
import { getContributionList } from "../../../../store/epics/EntryEpics/getContributionList.epic.ts";
import {
  selectContributionList,
  selectContributionListStatus,
} from "../../../../store/selectors/selectors.ts";
import { RequestStatusEnum } from "../../../../shared/enums/RequestStatus.enum.ts";
import { Contribution } from "../../../../store/interfaces/EntryState.interfaces.ts";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import { environment } from "../../../../environments/environment.ts";
import { setContributionList } from "../../../../store/actions/entry.actions.ts";
import { DATE_FORMAT } from "../../../../shared/utils/Date.utils.ts";
import { EntryTypesIdEnum } from "../../../../shared/enums/EntryTypes.enum.ts";
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
  open: boolean;
}

export const UsePartnerSavingListState = (
  props: UsePartnerAccountModalStateProps
) => {
  const dispatch = useAppDispatch();

  const contributionListStatus = useAppSelector(selectContributionListStatus);
  const contributionList = useAppSelector(selectContributionList);

  const [contributions, setContributions] = useState<ContributionProcessed[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const buildContributions = () => {
    let accumulate = 0;

    const contributionsTransformed: ContributionProcessed[] =
      contributionList.map((contribution: Contribution) => {
        moment.locale("es-us");

        const formattedDate = moment.utc(contribution.date).format(DATE_FORMAT);
        const monthName = moment.utc(contribution.date).format("MMMM");
        const monthDetailMessage =
          contribution.value > environment.contributionAmount
            ? " + Regularización"
            : "";
        const description =
          contribution.type_id === EntryTypesIdEnum.CONTRIBUTION
            ? `Pago del mes (${monthName} ${monthDetailMessage})`
            : `Depósito ahorro (${monthName})`;

        accumulate += contribution.value;

        return {
          date: formattedDate,
          description: description,
          entryNumber: contribution.number,
          value: contribution.value,
          accumulate: accumulate,
        };
      });

    setContributions(contributionsTransformed);
  };

  const onCloseModal = () => {
    props.handleClose();
    setContributions([]);
    dispatch(setContributionList([]));
  };

  useMemo(() => {
    if (props.partnerData && props.partnerData.number && props.open) {
      dispatch(getContributionList(props.partnerData.number));
      setIsLoading(true);
    }
  }, [props.partnerData?.number]);

  useEffect(() => {
    if (contributionListStatus === RequestStatusEnum.SUCCESS) {
      buildContributions();
      setIsLoading(false);
    }
  }, [contributionListStatus]);

  return {
    contributions,
    isLoading,
    onCloseModal,
  };
};
