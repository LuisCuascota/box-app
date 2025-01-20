import { ChangeEvent, createContext, useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../shared/hooks/Store.hook.ts";
import { getEgressCount } from "../../store/epics/EgressEpics/getEgressCount.epic.ts";
import {
  EgressBillDetail,
  NewEgress,
} from "../../store/interfaces/EgressState.interfaces.ts";
import { KajaConfig } from "../../shared/constants/KajaConfig.ts";
import {
  selectEgressCount,
  selectPostEgressStatus,
} from "../../store/selectors/selectors.ts";
import { postEgress } from "../../store/epics/EgressEpics/postEgress.epic.ts";
import { RequestStatusEnum } from "../../shared/enums/RequestStatus.enum.ts";
import { setPostEgressStatus } from "../../store/actions/egress.actions.ts";
import { buildEgressPDFDoc } from "../../shared/utils/BuildEgressPdf.utils.ts";
import { getTypesMetrics } from "../../store/epics/MetricsEpics/getTypesMetrics.epic.ts";
import { TypesSelector } from "../../components/input/TypesSearch/TypesSearch.tsx";
import { EntryBillDetail } from "../../store/interfaces/EntryState.interfaces.ts";

export interface IEgressDetail {
  description: string;
  value: number;
}
export interface IEgressContext {
  isLoading: boolean;
  isOpenSaveDialog: boolean;
  disableSave: boolean;
  beneficiary: string;
  egressDetail: IEgressDetail[];
  totalDischarge: number;
  isOpenBillDetailModal: boolean;
  onChangeBeneficiary: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeCategorySelector: (categorySelected: TypesSelector | null) => void;
  onAddDetail: () => void;
  onDeleteDetail: (index: number) => void;
  onUpdateDetail: (index: number, description: string, value: number) => void;
  onChangeEgressDate: (date: string) => void;
  onCancelEgress: () => void;
  onSaveEgress: (billDetail: EgressBillDetail) => void;
  onCloseSaveDialog: () => void;
  onPrintEgress: () => void;
  onOpenBillDetailModal: () => void;
  categorySelected?: TypesSelector | null;
}

const initialEgressContext: IEgressContext = {
  isLoading: false,
  isOpenSaveDialog: false,
  disableSave: true,
  beneficiary: "",
  egressDetail: [],
  totalDischarge: 0,
  isOpenBillDetailModal: false,
  onChangeBeneficiary: () => {},
  onChangeCategorySelector: () => {},
  onAddDetail: () => {},
  onDeleteDetail: () => {},
  onUpdateDetail: () => {},
  onChangeEgressDate: () => {},
  onCancelEgress: () => {},
  onSaveEgress: () => {},
  onCloseSaveDialog: () => {},
  onPrintEgress: () => {},
  onOpenBillDetailModal: () => {},
};

const EgressContext = createContext<IEgressContext>(initialEgressContext);

const EgressContestProvider = ({ children }: any) => {
  const dispatch = useAppDispatch();

  const count = useAppSelector(selectEgressCount);
  const postEgressStatus = useAppSelector(selectPostEgressStatus);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenSaveDialog, setIsOpenSaveDialog] = useState<boolean>(false);
  const [disableSave, setDisableSave] = useState<boolean>(true);

  const [beneficiary, setBeneficiary] = useState<string>("");
  const [egressDetail, setEgressDetail] = useState<IEgressDetail[]>([
    { description: "", value: 0 },
  ]);
  const [totalDischarge, setTotalDischarge] = useState<number>(0);
  const [egressDate, setEgressDate] = useState<string>("");
  const [categorySelected, setCategorySelected] =
    useState<TypesSelector | null>(null);
  const [isOpenBillDetailModal, setOpenBillDetailModal] = useState(false);
  const [billDetail, setBillDetail] = useState<EgressBillDetail>();

  const onOpenBillDetailModal = () => {
    setOpenBillDetailModal(true);
  };

  const onChangeEgressDate = (date: string) => setEgressDate(date);

  const onAddDetail = () => {
    const details = [...egressDetail];

    details.push({ description: "", value: 0 });
    setEgressDetail(details);
  };

  const onDeleteDetail = (index: number) => {
    const details = [...egressDetail];

    details.splice(index, 1);
    setEgressDetail(details);
  };

  const onUpdateDetail = (
    index: number,
    description: string,
    value: number
  ) => {
    const details = [...egressDetail];

    details[index].description = description.toUpperCase();
    details[index].value = value;

    setEgressDetail(details);
  };

  const onChangeBeneficiary = (event: ChangeEvent<HTMLInputElement>) => {
    setBeneficiary(event.target.value.toUpperCase());
  };

  const onChangeCategorySelector = (categorySelected: TypesSelector | null) => {
    setCategorySelected(categorySelected);
  };

  const onCancelEgress = () => {
    clearStateForNew();
  };

  const buildNewEgress = (billDetail: EntryBillDetail): NewEgress => {
    return {
      header: {
        number: count.count + 1,
        date: egressDate,
        place: KajaConfig.defaultPlace,
        beneficiary: beneficiary,
        amount: totalDischarge,
        type_id: categorySelected!.id,
      },
      detail: egressDetail.map((detail) => ({
        discharge_number: count.count + 1,
        description: detail.description,
        value: detail.value,
      })),
      billDetail,
    };
  };

  const onSaveEgress = (billDetail: EgressBillDetail) => {
    setIsLoading(true);
    setOpenBillDetailModal(false);
    setBillDetail(billDetail);

    const newEgress: NewEgress = buildNewEgress(billDetail);

    dispatch(postEgress(newEgress));
  };
  const onCloseSaveDialog = () => {
    setIsOpenSaveDialog(false);
    clearStateForNew();
    dispatch(getEgressCount());
    dispatch(getTypesMetrics());
  };
  const onPrintEgress = () => {
    buildEgressPDFDoc(buildNewEgress(billDetail!));
    onCloseSaveDialog();
  };

  const isValidDetail = () => {
    for (let i = 0; i < egressDetail.length; i++) {
      if (egressDetail[i].value <= 0 || !egressDetail[i].description)
        return false;
    }

    return true;
  };

  const clearStateForNew = () => {
    dispatch(setPostEgressStatus(RequestStatusEnum.PENDING));
    setIsLoading(false);
    setBeneficiary("");
    setCategorySelected(null);
    setEgressDetail([{ description: "", value: 0 }]);
  };

  useEffect(() => {
    if (postEgressStatus === RequestStatusEnum.SUCCESS)
      setIsOpenSaveDialog(true);
  }, [postEgressStatus]);

  useEffect(() => {
    if (
      beneficiary &&
      egressDate &&
      categorySelected &&
      totalDischarge > 0 &&
      isValidDetail()
    )
      setDisableSave(false);
    else setDisableSave(true);
  }, [beneficiary, egressDate, totalDischarge, egressDetail, categorySelected]);

  useEffect(() => {
    setTotalDischarge(
      egressDetail.reduce(
        (total, detail) => +(total + detail.value).toFixed(2),
        0
      )
    );
  }, [egressDetail]);

  useEffect(() => {
    dispatch(getEgressCount());
    dispatch(getTypesMetrics());
  }, []);

  return (
    <EgressContext.Provider
      value={{
        isLoading,
        isOpenSaveDialog,
        disableSave,
        beneficiary,
        egressDetail,
        totalDischarge,
        isOpenBillDetailModal,
        onChangeBeneficiary,
        onChangeCategorySelector,
        onAddDetail,
        onDeleteDetail,
        onUpdateDetail,
        onChangeEgressDate,
        onCancelEgress,
        onSaveEgress,
        onCloseSaveDialog,
        onPrintEgress,
        onOpenBillDetailModal,
      }}
    >
      {children}
    </EgressContext.Provider>
  );
};

export { EgressContext, EgressContestProvider };
