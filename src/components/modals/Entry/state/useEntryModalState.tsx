import { EntryModalProps } from "../EntryModal";
import { useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../shared/hooks/Store.hook.ts";
import { buildEntryPDFDoc } from "../../../../shared/utils/BuildEntryPdf.utils.ts";
import { RequestStatusEnum } from "../../../../shared/enums/RequestStatus.enum.ts";
import {
  selectEntryDetail,
  selectEntryDetailStatus,
} from "../../../../store/selectors/selectors.ts";
import { getEntryDetail } from "../../../../store/epics/EntryEpics/getEntryDetail.epic.ts";

export const useEntryModalState = (props: EntryModalProps) => {
  const dispatch = useAppDispatch();
  const entryDetail = useAppSelector(selectEntryDetail);
  const entryDetailStatus = useAppSelector(selectEntryDetailStatus);

  const handleBuildDoc = () => {
    if (props.entryData)
      buildEntryPDFDoc(
        {
          header: props.entryData,
          detail: entryDetail.amountDetail,
          billDetail: entryDetail.billDetail,
        },
        entryDetail.entryLoanDetail
      );
  };

  useEffect(() => {
    if (props.entryData) dispatch(getEntryDetail(props.entryData.number));
  }, [dispatch, props.entryData]);

  return {
    entryDetail,
    handleBuildDoc,
    isLoading:
      Boolean(props.entryData) &&
      entryDetailStatus === RequestStatusEnum.PENDING,
  };
};
