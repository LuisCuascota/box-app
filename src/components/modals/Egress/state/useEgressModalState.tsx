import { EgressModalProps } from "../EgressModal.tsx";
import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../shared/hooks/Store.hook.ts";
import { RequestStatusEnum } from "../../../../shared/enums/RequestStatus.enum.ts";
import {
  selectEgressDetail,
  selectEgressDetailStatus,
} from "../../../../store/selectors/selectors.ts";
import { getEgressDetail } from "../../../../store/epics/EgressEpics/getEgressDetail.epic.ts";
import { buildEgressPDFDoc } from "../../../../shared/utils/BuildEgressPdf.utils.ts";

export const useEgressModalState = (props: EgressModalProps) => {
  const dispatch = useAppDispatch();
  const egressDetail = useAppSelector(selectEgressDetail);
  const egressDetailStatus = useAppSelector(selectEgressDetailStatus);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBuildDoc = () => {
    if (props.egressData)
      buildEgressPDFDoc({
        header: props.egressData,
        detail: egressDetail.amountDetail,
        billDetail: egressDetail.billDetail,
      });
  };

  useEffect(() => {
    if (props.egressData) {
      setIsLoading(true);
      dispatch(getEgressDetail(props.egressData.number));
    }
  }, [props.egressData]);

  useEffect(() => {
    if (egressDetailStatus === RequestStatusEnum.SUCCESS) setIsLoading(false);
  }, [egressDetailStatus]);

  return {
    egressDetail,
    handleBuildDoc,
    isLoading,
  };
};
