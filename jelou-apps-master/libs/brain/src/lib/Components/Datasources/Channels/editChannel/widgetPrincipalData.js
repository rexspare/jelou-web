import React from "react";
import NameComponent from "../../../../Modal/nameComponent";
import { CopyIcon } from "@apps/shared/icons";
import { CHANNEL, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "../../../../constants";
import DeleteButton from "../../../../Common/deleteButton";
import { useTranslation } from "react-i18next";
export default function WidgetPrincipalData(props) {
    const { onChangeName, channelSelected, handleOpenDeleteModal } = props;
    const { t } = useTranslation();

    return (
        <div className="h-[60vh] p-10 py-8">
            <div className="flex w-1/2 flex-col space-y-4">
                <div className="flex flex-row items-center gap-x-4">
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
                </div>
            </div>
            <div className="my-4 flex flex-col gap-5 border-t-1 border-gray-34 py-8">
                <div className="flex flex-col space-y-2">
                    <span className="text-base font-bold text-gray-610">{t("common.deleteChannel")}</span>
                    <span className="mb-2 text-sm text-gray-400">{t("brain.deleteChannelInstruction")}</span>
                </div>
                <DeleteButton onClick={handleOpenDeleteModal} buttonText={`${t("common.delete")} ${t(CHANNEL.SINGULAR_LOWER)}`} showIcon={true} />
            </div>
        </div>
    );
}
