import React from "react";
import { useTranslation } from "react-i18next";

import { Tabs } from "@apps/shared/common";
import { SpinnerIcon } from "@apps/shared/icons";
import { CHANNEL_TYPES } from "../../../../constants";

export default function HeaderEditChannel(props) {
    const {
        type = "",
        showPrincipalData,
        showSecondTab,
        showThirdTab,
        viewWidgetConfiguration,
        showFirstView,
        showSecondView,
        showThirdView,
        handleEditChannel,
        updateChannelLoading,
        isSaveButtonDisabled
    } = props;

    const { t } = useTranslation();

    return (
        <header className="border-gray flex h-18 items-center justify-between space-x-3 border-b-1 px-6 py-4">
            <div className="flex items-center">
                <span className="mr-6 text-xl font-bold text-primary-200">{t("brain.Configuracion de canal")}</span>
                {type === CHANNEL_TYPES.WEB && (
                    <Tabs
                        marked1={showPrincipalData}
                        marked2={showSecondTab}
                        marked3={showThirdTab}
                        title1={t("common.principalData")}
                        title2={viewWidgetConfiguration ? t("common.appearance") : ""}
                        title3={t("common.integration")}
                        showFirstTab={showFirstView}
                        showSecondTab={showSecondView}
                        showThirdTab={showThirdView}
                        padding="sm"
                    />
                )}
            </div>
            <button
                disabled={updateChannelLoading || isSaveButtonDisabled}
                onClick={handleEditChannel}
                className="rounded-full bg-primary-200 p-2 px-5 font-semibold text-white hover:bg-primary-100 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50">
                {updateChannelLoading ? <SpinnerIcon /> : `${t("common.save")}`}
            </button>
        </header>
    );
}
