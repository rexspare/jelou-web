import { useTranslation } from "react-i18next";
import { ssToMS } from "@apps/shared/utils";
import { TimeRestIcon } from "@apps/shared/icons";
import { Transition } from "@headlessui/react";
import { useState } from "react";

const OperatorAvgResponseTime = (props) => {
    const { t } = useTranslation();
    const { companyTime, operatorTime } = props;

    const [isShowing, setIsShowing] = useState(false);

    const percentageColor = (percentage, border = false) => {
        if (percentage >= 100) {
            return `bg-red-13 text-red-950 ${border && "border-default border-red-250"}`;
        } else if (percentage < 100 && percentage >= 50) {
            return `bg-yellow-90 text-secondary-150 ${border && "border-default border-secondary-150"}`;
        } else {
            return `bg-green-990 text-green-980 ${border && "border-default border-green-75"}`;
        }
    };

    const renderMessage = (percentage) => {
        if (percentage >= 100) {
            return (
                <span className="text-grey-300">
                    {t("pma.¡Te estás")} <span className="font-bold text-red-950">{t("pma.excediendo el tiempo")}</span>{" "}
                    {t("pma.designado por tu empresa!")}
                </span>
            );
        } else if (percentage < 100 && percentage >= 50) {
            return (
                <span className="text-grey-300">
                    {t("pma.¡Estás dentro")} <span className="font-bold text-secondary-150">{t("pma.del tiempo")}</span>{" "}
                    {t("pma.designado por tu empresa!")}
                </span>
            );
        } else {
            return (
                <span className="text-grey-300">
                    {t("pma.¡Estás dentro")} <span className="font-bold text-green-980">{t("pma.del tiempo")}</span>{" "}
                    {t("pma.designado por tu empresa!")}
                </span>
            );
        }
    };

    const percentage = Math.round((operatorTime / companyTime) * 100);

    return (
        <div
            className="relative mx-2 md:mx-0 md:pr-2"
            onMouseOver={() => {
                setIsShowing(true);
            }}
            onMouseLeave={() => {
                setIsShowing(false);
            }}>
            <Transition
                className={`absolute ${percentageColor(percentage, true)} right-0 z-60 mt-12 w-56 rounded-12 bg-white px-5 py-2 shadow-normal`}
                show={isShowing}>
                <div className="text-center">
                    <span className="text-grey-300 font-medium">
                        {t("pma.Tiempo designado")} <br />
                    </span>
                    <span className="text-xl font-bold">
                        {ssToMS(companyTime, t, true)} <br />
                    </span>
                    {renderMessage(percentage)}
                </div>
            </Transition>
            <div
                className={`flex items-center whitespace-nowrap rounded-full px-3 py-2 pl-2 text-center leading-4 shadow-none md:w-fit ${percentageColor(
                    percentage
                )}`}>
                <TimeRestIcon className="fill-current md:ml-2" width="10" height="11" />
                <div className="sm:text-12 hidden pl-2 text-sm font-bold leading-4 md:flex">{`${ssToMS(operatorTime, t)} / ${ssToMS(
                    companyTime,
                    t
                )}`}</div>
            </div>
        </div>
    );
};

export default OperatorAvgResponseTime;
