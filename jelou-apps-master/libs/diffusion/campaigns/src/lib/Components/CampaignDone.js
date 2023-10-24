import React from "react";

import { CheerIcon } from "@apps/shared/icons";

import isEmpty from "lodash/isEmpty";

import { useTranslation } from "react-i18next";

const CampaignDone = (props) => {
    const { steps, setCampaignName, resetValues, setSteps } = props;
    const { t } = useTranslation();
    const closeClick = () => {
        const stepsList = [...steps];
        stepsList.forEach(function (part, index, theArray) {
            if (theArray[index].status !== "upcoming") theArray[index].status = "upcoming";
            if (!isEmpty(theArray[index].inputData)) theArray[index].inputData = "";
        });
        stepsList[0] = {
            name: steps[0].name,
            description: steps[0].description,
            status: "current",
            number: steps[0].number,
            inputData: steps[0].inputData,
        };

        setCampaignName("");
        setSteps(stepsList);
        // steps[0].status = "current";
        resetValues();
    };

    return (
        <div className="min-h-1/2 flex w-full flex-row">
            <div className="ml-20 flex w-full flex-col justify-center">
                <div className="mb-6 w-full">
                    <p className="text-lg font-bold text-gray-400">{t("CampaignDone.sentCampaign")}</p>
                    <div className="mt-12">
                        <div className="flex flex-col">
                            <CheerIcon height={245} width={323} />
                        </div>
                    </div>
                </div>
                <div className="mx-auto mt-2 flex w-full justify-start">
                    <button className="button-primary ml-4 w-32" onClick={closeClick}>
                        {t("CampaignDone.init")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignDone;
