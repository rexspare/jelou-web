import React from "react";
import DecreaseIcon from "./Icon/DecreaseIcon";
import IncreaseIcon from "./Icon/IncreaseIcon";
import { useTranslation } from "react-i18next";

const GrowthPercent = (props) => {
    const { growthType, growthPercentage = 0, period } = props;
    const { t } = useTranslation();

    if (!growthType) {
        return <div></div>;
    }

    let periodMessage = "";
    switch (period.value) {
        case "currentWeek":
            periodMessage = t("plugins.que la semana pasada.");
            break;
        case "currentMonth":
            periodMessage = t("plugins.que el mes pasado.");
            break;
        case "currentYear":
            periodMessage = t("plugins.que el año pasado.");
            break;
        case "today":
            periodMessage = t("plugins.que ayer.");
            break;
        default:
            periodMessage = t("plugins.que el periodo pasado.");
            break;
    }

    const message = `${Math.round(growthPercentage)}% ${growthType === "negative" ? t("plugins.Menos") : t("plugins.Más")} ${periodMessage}`;

    return (
        <div className="flex items-center">
            {growthType === "negative" ? (
                <DecreaseIcon className="mr-3 fill-current text-red-400" width="20" height="12" />
            ) : (
                <IncreaseIcon className="mr-3 rotate-180 fill-current text-green-400" width="20" height="12" />
            )}
            <span className="text-gray-450">{message}</span>
        </div>
    );
};

export default GrowthPercent;
