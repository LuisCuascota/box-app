import { PartnerModalProps } from "../PartnerModal.tsx";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../shared/hooks/Store.hook.ts";
import { useEffect, useState } from "react";
import { postPartner } from "../../../../store/epics/PartnerEpics/postPartner.epic.ts";
import { selectPartners } from "../../../../store/selectors/selectors.ts";
import { RequestStatusEnum } from "../../../../shared/enums/RequestStatus.enum.ts";
import { putPartner } from "../../../../store/epics/PartnerEpics/putPartner.epic.ts";

export enum PartnerInputEnum {
  NAMES = "names",
  SURNAMES = "surnames",
  DNI = "dni",
  BIRTHDAY = "birthday",
  ADDRESS = "address",
  PHONE = "phone",
  INITIAL_AMOUNT = "initialAmount",
}
export const usePartnerModalState = (props: PartnerModalProps) => {
  const dispatch = useAppDispatch();
  const { postPartnerStatus, putPartnerStatus } =
    useAppSelector(selectPartners);
  const [names, setNames] = useState<string>();
  const [surnames, setSurnames] = useState<string | null>();
  const [dni, setDni] = useState<string | null>();
  const [birthday, setBirthday] = useState<string>();
  const [address, setAddress] = useState<string | null>();
  const [phone, setPhone] = useState<string | null>();
  const [initialAmount, setInitialAmount] = useState<number>(0);

  const [disableSave, setDisableSave] = useState<boolean>(true);
  const [disableUpdate, setDisableUpdate] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangeInput = (input: PartnerInputEnum, value: string | number) => {
    switch (input) {
      case PartnerInputEnum.NAMES:
        setNames(value as string);

        return;
      case PartnerInputEnum.SURNAMES:
        setSurnames(value as string);

        return;
      case PartnerInputEnum.DNI:
        setDni(value as string);

        return;
      case PartnerInputEnum.BIRTHDAY:
        setBirthday(value as string);

        return;
      case PartnerInputEnum.ADDRESS:
        setAddress(value as string);

        return;
      case PartnerInputEnum.PHONE:
        setPhone(value as string);

        return;

      case PartnerInputEnum.INITIAL_AMOUNT:
        setInitialAmount(value as number);

        return;
    }
  };

  const handleSave = () => {
    setIsLoading(true);
    dispatch(
      postPartner({
        dni: dni!,
        names: names!,
        surnames: surnames!,
        phone: phone!,
        birth_day: birthday!,
        address: address!,
        start_amount: initialAmount!,
      })
    );
  };

  const handleUpdate = () => {
    setIsLoading(true);
    dispatch(
      putPartner({
        number: props.partnerData?.number,
        dni: dni!,
        names: names!,
        surnames: surnames!,
        phone: phone!,
        birth_day: birthday!,
        address: address!,
        start_amount: initialAmount!,
      })
    );
  };

  useEffect(() => {
    if (props.partnerData) {
      setNames(props.partnerData?.names);
      setSurnames(props.partnerData?.surnames);
      setDni(props.partnerData?.dni);
      setBirthday(props.partnerData?.birth_day);
      setAddress(props.partnerData?.address);
      setPhone(props.partnerData?.phone);
      setInitialAmount(props.partnerData?.start_amount);
    } else {
      setNames("");
      setSurnames("");
      setDni("");
      setBirthday("");
      setAddress("");
      setPhone("");
      setInitialAmount(0);
    }
  }, [props.partnerData]);

  useEffect(() => {
    if (
      names &&
      surnames &&
      dni &&
      birthday &&
      address &&
      phone &&
      initialAmount > 0
    ) {
      setDisableSave(false);
      setDisableUpdate(false);
    } else {
      setDisableSave(true);
      setDisableUpdate(true);
    }
  }, [names, surnames, dni, birthday, address, phone, initialAmount]);

  useEffect(() => {
    if (
      postPartnerStatus === RequestStatusEnum.SUCCESS ||
      putPartnerStatus === RequestStatusEnum.SUCCESS
    ) {
      props.handleClose();
      setIsLoading(false);
    }
  }, [postPartnerStatus, putPartnerStatus]);

  return {
    handleSave,
    disableSave,
    handleUpdate,
    disableUpdate,
    isLoading,
    inputValues: {
      names,
      surnames,
      dni,
      birthday,
      address,
      phone,
      initialAmount,
      onChangeInput,
    },
  };
};
