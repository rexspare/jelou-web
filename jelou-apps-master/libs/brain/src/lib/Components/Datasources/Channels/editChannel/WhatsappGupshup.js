import React from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-number-input";
import get from "lodash/get";
import isNil from "lodash/isNil";
import "react-phone-number-input/style.css";

import { CHANNEL, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "../../../../constants";
import NameComponent from "../../../../Modal/nameComponent";
import DeleteButton from "../../../../Common/deleteButton";

export default function WhatsappGupshup(props) {
    const { onChangeName, channelSelected, openDeleteModal } = props;
    const { phone } = get(channelSelected,"metadata.gupshup_app_response","");
    const { t } = useTranslation();

    return (
        <div className="flex h-[60vh] flex-col space-y-4 p-10 py-8">
            <div className="flex flex-col gap-x-4 w-1/2">
                <div className="w-full text-sm">
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
                <div className="my-8 space-y-6">
                    <div className="w-full">
                        <span className="text-gray-610 font-bold text-sm pb-2">{t("common.channelPhone")}</span>
                        <div className="flex h-11 grow rounded-lg border-1 border-neutral-200 px-4 py-3 font-medium text-gray-610">
                            <PhoneInput
                                international
                                countryCallingCodeEditable={false}
                                defaultCountry="EC"
                                value={isNil("+"+phone) ? "" : "+"+phone}
                            />
                        </div>
                    </div>
                   <div className="w-full">
                      <span className="text-gray-610 font-bold text-sm pb-2">{t("common.productionType")}</span>
                        <input
                            className="w-full text-gray-610 border-1 rounded-10 px-4 py-2 border-neutral-200 disabled:bg-transparent"
                            value={"On premise"}
                            disabled
                        />
                   </div>
                </div>
            </div>
            <div className="mb-4 flex flex-col gap-5 pb-8 pt-10 border-t-1 border-neutral-200">
                <div className="flex flex-col space-y-2">
                    <span className="text-base font-bold text-gray-610">{t("common.deleteChannel")}</span>
                    <span className="mb-2 text-sm text-gray-400">{t("brain.deleteChannelInstruction")}</span>
                </div>
                <DeleteButton onClick={openDeleteModal} buttonText={`${t("common.delete")} ${t(CHANNEL.SINGULAR_LOWER)}`} showIcon={true} />
            </div>
        </div>
    );
}
