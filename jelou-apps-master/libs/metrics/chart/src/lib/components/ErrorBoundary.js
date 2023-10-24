import React from "react";
import Lottie from "react-lottie";
// import metricsAnimation from "../../../../metrics/metricas.json";
import metricsAnimation from "./metrics/metricas.json";
import { useTranslation } from "react-i18next";

export default function Error(props) {
    const { invokeMetric, chartProperties } = props;
    const { width } = chartProperties;
    const { t } = useTranslation();
    // const metricsAnimation = "/assets/metrics/metricsAnimation.json";

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: metricsAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div className={`flex w-2/3 items-center justify-center`}>
            <div className="flex w-1/2 flex-col justify-center space-y-2">
                <span className="text-left text-xl font-bold text-primary-200">{t("plugins.error1")}</span>
                <span className={`text-13 text-gray-500 lg:text-base`}>{t("plugins.error2")}</span>
                <button className="w-32 rounded-full bg-primary-200 px-2 py-1 text-13 font-semibold text-white lg:text-sm" onClick={invokeMetric}>
                    {t("plugins.Reload")}
                </button>
            </div>
            <div className="cursor-default flex w-1/2 items-center justify-center">
                <Lottie
                    className="cursor-default"
                    options={defaultOptions}
                    height={width === "full" ? 230 : 130}
                    width={width === "full" ? 230 : 130}
                />
            </div>
        </div>
    );
}
