import React from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-number-input";
import get from "lodash/get";

import { TextInput } from "@apps/shared/common";
import { CHANNEL, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "../../../../constants";
import NameComponent from "../../../../Modal/nameComponent";
import DeleteButton from "../../../../Common/deleteButton";

export default function WhatsappCloud(props) {
    const { onChangeName, channelSelected, setChannelSelected, openDeleteModal } = props;
    const { t } = useTranslation();

    const access_token = get(channelSelected, "metadata.access_token", "");
    const displayPhoneNumber = `+${get(channelSelected, "metadata.properties.provider.displayPhoneNumber", "")}`;
    const phoneNumberID = get(channelSelected, "metadata.properties.provider.phoneNumberID", "");
    const businessAccountID = get(channelSelected, "metadata.properties.provider.businessAccountID", "");

    const changePhoneNumber = (value) => {
        setChannelSelected((prevState) => ({
            ...prevState,
            metadata: {
                ...prevState.metadata,
                properties: { ...prevState.properties, provider: { ...prevState.provider, displayPhoneNumber: value } },
            },
        }));
    };

    const handleOnChange = (evt) => {
        const { name = "", value = "" } = evt?.target || {};
        switch (name) {
            case "access_token":
                setChannelSelected((prevState) => ({ ...prevState, metadata: { ...prevState.metadata, [name]: value } }));
                break;
            case "businessAcountId":
                setChannelSelected((prevState) => ({
                    ...prevState,
                    metadata: { ...prevState.metadata, properties: { ...prevState.properties, provider: { ...prevState.provider, [name]: value } } },
                }));
                break;
            case "phoneNumberID":
                setChannelSelected((prevState) => ({
                    ...prevState,
                    metadata: { ...prevState.metadata, properties: { ...prevState.properties, provider: { ...prevState.provider, [name]: value } } },
                }));
                break;
            default:
                setChannelSelected((prevState) => ({
                    ...prevState,
                    metadata: {
                        ...prevState.metadata,
                        properties: { ...prevState.properties, provider: { ...prevState.provider, displayPhoneNumber: value } },
                    },
                }));
                break;
        }
    };

    return (
        <div className="flex h-[60vh] flex-col space-y-4 p-10 py-8">
            <div className="w-1/2 space-y-5 pb-4">
                <div className="flex w-full flex-col text-sm">
                    <NameComponent
                        title={t("common.channelName")}
                        placeholder={CHANNEL.SINGULAR_CAPITALIZED}
                        onChange={onChangeName}
                        itemValues={channelSelected}
                        maxLength={NAME_MAX_LENGTH}
                        length={channelSelected.name?.length}
                        minLength={NAME_MIN_LENGTH}
                    />
                </div>
                <TextInput
                    name={"produccion"}
                    label={"Producción tipo"}
                    readOnly={true}
                    labelClassName="mb-1 block items-center gap-2 text-sm font-bold text-gray-610"
                    defaultValue="Cloud"
                />
                <div className="flex flex-col">
                    <span className="mb-1 block items-center gap-2 text-sm font-bold text-gray-610">{t("common.channelPhone")}</span>
                    <div className="flex h-11 grow rounded-lg border-1 border-neutral-200 px-4 py-3 font-medium text-gray-610">
                        <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="EC"
                            value={displayPhoneNumber}
                            onChange={changePhoneNumber}
                        />
                    </div>
                </div>
                <TextInput
                    name={"businessAccountID"}
                    label={t("brain.Account ID")}
                    defaultValue={businessAccountID}
                    labelClassName="mb-1 block items-center gap-2 text-sm font-bold text-gray-610"
                    onChange={handleOnChange}
                />
                <TextInput
                    name={"phoneNumberID"}
                    label={t("brain.Phone Number ID")}
                    defaultValue={phoneNumberID}
                    labelClassName="mb-1 block items-center gap-2 text-sm font-bold text-gray-610"
                    onChange={handleOnChange}
                />
                <TextInput
                    name={"access_token"}
                    label={t("brain.Access token")}
                    defaultValue={access_token}
                    labelClassName="mb-1 block items-center gap-2 text-sm font-bold text-gray-610"
                    onChange={handleOnChange}
                />
            </div>
            <div className="flex flex-col gap-5 border-t-1 border-gray-34 py-8">
                <div className="flex flex-col space-y-2">
                    <span className="text-base font-bold text-gray-610">{t("common.deleteChannel")}</span>
                    <span className="mb-2 text-sm text-gray-400">{t("brain.deleteChannelInstruction")}</span>
                </div>
                <DeleteButton onClick={openDeleteModal} buttonText={`${t("common.delete")} ${t(CHANNEL.SINGULAR_LOWER)}`} showIcon={true} />
            </div>
        </div>
    );
}
