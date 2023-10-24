/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Input } from "@apps/shared/common";
import { useTranslation } from "react-i18next";

const SelectCampaignName = (props) => {
    const { nextStep, handleCampaign, campaignName } = props;
    const [enable, setEnable] = useState(false);
    const campaign = campaignName;
    const { t } = useTranslation();

    useEffect(() => {
        const inputRef = document.getElementById("widget:campaign:title");
        if (campaign.length > 3 && /^[a-zA-Z0-9 ]+$/.test(`${inputRef.value}`)) {
            setEnable(true);
        } else {
            setEnable(false);
        }
    }, [campaign]);

    const gotNext = () => {
        nextStep(1);
    };

    return (
        <div className="min-h-1/3 flex w-full flex-row">
            <span className="w-24" />
            <div className="w-2/3 pb-4">
                <p className="text-2xl font-bold text-gray-400">{t("selectCampaign.chooseCampaign")}</p>
                <p className="my-2 pb-2 text-sm text-gray-450">{t("selectCampaign.messageInitial")}</p>
                <Input
                    id={"widget:campaign:title"}
                    className="input"
                    defaultValue={campaign}
                    autoFocus={true}
                    placeholder={t("selectCampaign.campaignName")}
                    onChange={handleCampaign}
                />
                <div className="flex w-full justify-end">
                    <button
                        className={`button-primary mt-6 h-12 w-40 !rounded-full text-sm text-white focus:outline-none focus:ring-4 ${
                            enable ? "bg-primary-200" : "bg-gray-60 cursor-not-allowed"
                        }`}
                        onClick={gotNext}
                        disabled={!enable}>
                        {t("buttons.next")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectCampaignName;
