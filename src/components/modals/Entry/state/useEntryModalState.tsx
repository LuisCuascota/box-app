import { EntryModalProps } from "../EntryModal";
import { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBuildDoc = () => {
    if (props.entryData)
      buildEntryPDFDoc({ header: props.entryData, detail: entryDetail });
  };

  useEffect(() => {
    if (props.entryData) {
      setIsLoading(true);
      dispatch(getEntryDetail(props.entryData.number));
    }
  }, [props.entryData]);

  useEffect(() => {
    if (entryDetailStatus === RequestStatusEnum.SUCCESS) setIsLoading(false);
  }, [entryDetailStatus]);

  return {
    entryDetail,
    handleBuildDoc,
    isLoading,
  };
};
