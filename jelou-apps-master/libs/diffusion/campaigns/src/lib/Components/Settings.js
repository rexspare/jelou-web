/* eslint-disable react-hooks/exhaustive-deps */
import { ComboboxSelect } from "@apps/shared/common";
import isEmpty from "lodash/isEmpty";
import React from "react";
import { useTranslation } from "react-i18next";

const SettingsHeader = (props) => {
    const { configurations, handleConfigurations, addConfiguration, configuration } = props;
    const { t } = useTranslation();
    return (
        <div className="mb-10 max-w-sm">
            <ComboboxSelect
                options={configurations}
                value={!isEmpty(configuration) ? configuration : ""}
                label={t("CampaignSettings.searchConfiguration")}
                handleChange={handleConfigurations}
                name={"configurations"}
                background={"#fff"}
                hasCleanFilter={false}
            />
            <button
                className={`absolute top-0 right-0 h-11 w-44 rounded-full bg-primary-200 !text-11 font-bold text-white hover:bg-primary-100 focus:outline-none`}
                onClick={addConfiguration}>
                <span className="text-sm">{t("CampaignSettings.addConfiguration")}</span>
            </button>
        </div>
    );
};

export default SettingsHeader;
