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
  const [overridesByKey, setOverridesByKey] = useState<
    Record<
      string,
      Partial<{
        names: string;
        surnames: string | null;
        dni: string | null;
        birthday: string;
        address: string | null;
        phone: string | null;
        initialAmount: number;
      }>
    >
  >({});
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const dataKey = props.partnerData?.number
    ? String(props.partnerData.number)
    : "new";
  const baseValues = {
    names: props.partnerData?.names ?? "",
    surnames: props.partnerData?.surnames ?? "",
    dni: props.partnerData?.dni ?? "",
    birthday: props.partnerData?.birth_day ?? "",
    address: props.partnerData?.address ?? "",
    phone: props.partnerData?.phone ?? "",
    initialAmount: props.partnerData?.start_amount ?? 0,
  };
  const overrides = overridesByKey[dataKey] ?? {};
  const names = overrides.names ?? baseValues.names;
  const surnames = overrides.surnames ?? baseValues.surnames;
  const dni = overrides.dni ?? baseValues.dni;
  const birthday = overrides.birthday ?? baseValues.birthday;
  const address = overrides.address ?? baseValues.address;
  const phone = overrides.phone ?? baseValues.phone;
  const initialAmount = overrides.initialAmount ?? baseValues.initialAmount;

  const onChangeInput = (input: PartnerInputEnum, value: string | number) => {
    switch (input) {
      case PartnerInputEnum.NAMES:
        setOverridesByKey((current) => ({
          ...current,
          [dataKey]: { ...current[dataKey], names: value as string },
        }));

        return;
      case PartnerInputEnum.SURNAMES:
        setOverridesByKey((current) => ({
          ...current,
          [dataKey]: { ...current[dataKey], surnames: value as string },
        }));

        return;
      case PartnerInputEnum.DNI:
        setOverridesByKey((current) => ({
          ...current,
          [dataKey]: { ...current[dataKey], dni: value as string },
        }));

        return;
      case PartnerInputEnum.BIRTHDAY:
        setOverridesByKey((current) => ({
          ...current,
          [dataKey]: { ...current[dataKey], birthday: value as string },
        }));

        return;
      case PartnerInputEnum.ADDRESS:
        setOverridesByKey((current) => ({
          ...current,
          [dataKey]: { ...current[dataKey], address: value as string },
        }));

        return;
      case PartnerInputEnum.PHONE:
        setOverridesByKey((current) => ({
          ...current,
          [dataKey]: { ...current[dataKey], phone: value as string },
        }));

        return;

      case PartnerInputEnum.INITIAL_AMOUNT:
        setOverridesByKey((current) => ({
          ...current,
          [dataKey]: {
            ...current[dataKey],
            initialAmount: value as number,
          },
        }));

        return;
    }
  };

  const handleSave = () => {
    setHasSubmitted(true);
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
    setHasSubmitted(true);
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

  const disableSave = !(
    names &&
    surnames &&
    dni &&
    birthday &&
    address &&
    phone &&
    initialAmount > 0
  );
  const disableUpdate = disableSave;

  useEffect(() => {
    if (
      postPartnerStatus === RequestStatusEnum.SUCCESS ||
      putPartnerStatus === RequestStatusEnum.SUCCESS
    ) {
      props.handleClose();
    }
  }, [postPartnerStatus, putPartnerStatus]);

  const isLoading =
    hasSubmitted &&
    (postPartnerStatus === RequestStatusEnum.PENDING ||
      putPartnerStatus === RequestStatusEnum.PENDING);

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
