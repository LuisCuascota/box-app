import { PartnerModalProps } from "../PartnerModal.tsx";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../shared/hooks/Store.hook.ts";
import { useEffect, useState } from "react";
import { postPartner } from "../../../../store/epics/PartnerEpics/postPartner.epic.ts";
import { selectPartners } from "../../../../store/selectors/selectors.ts";
import { RequestStatusEnum } from "../../../../shared/enums/RequestStatus.enum.ts";
import {putPartner} from "../../../../store/epics/PartnerEpics/putPartner.epic.ts";

export enum PartnerInputEnum {
  NAMES = "names",
  SURNAMES = "surnames",
  DNI = "dni",
  BIRTHDAY = "birthday",
  ADDRESS = "address",
  PHONE = "phone",
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

  const [disableSave, setDisableSave] = useState<boolean>(true);
  const [disableUpdate, setDisableUpdate] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangeInput = (input: PartnerInputEnum, value: string) => {
    switch (input) {
      case PartnerInputEnum.NAMES:
        setNames(value);

        return;
      case PartnerInputEnum.SURNAMES:
        setSurnames(value);

        return;
      case PartnerInputEnum.DNI:
        setDni(value);

        return;
      case PartnerInputEnum.BIRTHDAY:
        setBirthday(value);

        return;
      case PartnerInputEnum.ADDRESS:
        setAddress(value);

        return;
      case PartnerInputEnum.PHONE:
        setPhone(value);

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
    } else {
      setNames("");
      setSurnames("");
      setDni("");
      setBirthday("");
      setAddress("");
      setPhone("");
    }
  }, [props.partnerData]);

  useEffect(() => {
    if (names && surnames && dni && birthday && address && phone) {
      setDisableSave(false);
      setDisableUpdate(false);
    } else {
      setDisableSave(true);
      setDisableUpdate(true);
    }
  }, [names, surnames, dni, birthday, address, phone]);

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
      onChangeInput,
    },
  };
};
