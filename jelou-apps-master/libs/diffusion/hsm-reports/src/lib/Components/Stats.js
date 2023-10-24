/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";
import { CheckIcon2, DoubleCheckmarkIcon1, WarningIcon2 } from "@apps/shared/icons";
import { BeatLoader, GridLoader } from "react-spinners";
import { CardWrapper } from "@apps/shared/common";
import LoadingPerformance from "./LoadingPerformance";
import PerformanceStat from "./PerformanceStat";

Chart.register(ChartDataLabels);

const COLORS = ["#00BC2A", "#00B3C7", "#EC5F4F"];

const Stats = (props) => {
    const { loadingWidgets, metadata } = props;
    const { stats = {}, performance = {} } = props.metadata;
    const { t } = useTranslation();
    const [noHsmData, setNohsmData] = useState(true);
    const chartTotal = useRef(null);
    const {
        USER_REPLIED: replied = 0,
        FAILED: failed = 0,
        DELIVERED_CHANNEL: delivered = 0,
        DELIVERED_USER: deliveredUser = 0,
        USER_READ: userRead = 0,
        TOTAL_HSM: totalHsm = 0,
        TOTAL_DELIVERED: totalDelivered = 0,
    } = stats;
    const {
        FAILED: failedPercentage = 0,
        CREATED: createdPercentage = 0,
        DELIVERED_USER: deliveredPercentage = 0,
        DELIVERED_CHANNEL: deliveredChannelPercentage = 0,
        USER_READ: userReadPercentage = 0,
        USER_REPLIED: repliedPercentage = 0,
    } = performance;

    useEffect(() => {
        setNohsmData(totalDelivered === 0);
    }, [totalDelivered]);

    useEffect(() => {
        const totalHsmChart = chartTotal.current.getContext("2d");
        let pieChartTotalHsm;

        Chart.defaults.font.family = "Manrope";
        Chart.defaults.color = "#7e89a2";
        const dataset = {
            labels: [t("HSMTable.delivered"), t("HSMTable.deliveredUser"), t("HSMTable.failed")],
            datasets: [
                {
                    data: [delivered, deliveredUser, failed],
                    backgroundColor: COLORS,
                },
            ],
        };
        const config = {
            type: "doughnut",
            data: dataset,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: false,
                    },
                    datalabels: {
                        display: false,
                    },
                    tooltip: {
                        backgroundColor: "#E7F6F8",
                        bodyColor: "#727C94",
                        padding: 5,
                        boxWidth: 10,
                        bodyFont: {
                            size: 10,
                        },
                    },
                },
            },
        };
        pieChartTotalHsm = new Chart(totalHsmChart, config);
        return () => {
            if (!isEmpty(pieChartTotalHsm)) pieChartTotalHsm.destroy();
        };
    }, [metadata]);

    const tittleMessage = (msg, number) => (
        <span className="flex space-x-2">
            {loadingWidgets ? loadingQuantity() : <span className="text-primary-200">{numberFormat(number)}</span>}
            <span className="mid:text-lg xl:text-xl">{msg}</span>
        </span>
    );

    const loadingQuantity = (color = "#727c94") => {
        return <BeatLoader color={color} size={8} />;
    };

    const loadingCharts = (color = "") => {
        return <GridLoader color={color} size={16} />;
    };

    function numberFormat(number) {
        const formatted = number.toLocaleString("en-US");
        return formatted;
    }

    return (
        <div className="flex flex-col space-y-2 p-1 lg:flex-row lg:space-y-0 lg:space-x-3 lg:p-0">
            <div className="flex h-[18rem] min-h-[18rem] flex-1 flex-row rounded-xl border-default border-gray-100/50">
                <div className="relative flex h-[18rem] min-h-[18rem] w-2/5 flex-col items-center justify-center overflow-hidden border-r-default py-3">
                    {loadingWidgets ? (
                        loadingCharts("#00B3C7")
                    ) : (
                        <>
                            <div className="max-h-[calc(100%-40px)] max-w-[calc(100%-1rem)] px-2 pb-3 pt-2">
                                <canvas className="flex h-full" ref={chartTotal}></canvas>
                            </div>
                            <div className="mt-2 flex w-full justify-around rounded-1 bg-white">
                                <div className="flex w-min justify-center text-10 text-gray-400">
                                    <div className="mr-1 flex h-[15px] items-center">
                                        <div className="h-2 w-2 rounded-[50%] bg-stat-total" />
                                    </div>
                                    <div className="flex w-min flex-col leading-3">
                                        <p className="text-xs font-bold leading-4 text-stat-total">
                                            {`${totalHsm === 0 ? "0" : ((delivered / totalHsm) * 100).toFixed(2)}%`}
                                        </p>
                                        {t("HSMTable.delivered")}
                                    </div>
                                </div>
                                <div className="flex w-min justify-center text-10 text-gray-400">
                                    <div className="mr-1 flex h-[15px] items-center">
                                        <div className="h-2 w-2 rounded-[50%] bg-primary-200" />
                                    </div>
                                    <div className="flex w-min flex-col leading-3">
                                        <p className="text-xs font-bold leading-4 text-primary-200">
                                            {`${totalHsm === 0 ? "0" : ((deliveredUser / totalHsm) * 100).toFixed(2)}%`}
                                        </p>
                                        {t("HSMTable.deliveredUser")}
                                    </div>
                                </div>
                                <div className="flex w-min justify-center text-10 text-gray-400">
                                    <div className="mr-1 flex h-[15px] items-center">
                                        <div className="h-2 w-2 rounded-[50%] bg-red-1050" />
                                    </div>

                                    <div className="flex w-min flex-col leading-3">
                                        <p className="text-xs font-bold leading-4 text-red-1050">
                                            {`${totalHsm === 0 ? "0" : ((failed / totalHsm) * 100).toFixed(2)}%`}
                                        </p>
                                        {t("HSMTable.failed")}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="flex h-full w-3/5 flex-col items-center border-gray-100/50">
                    <span className={`w-full border-b-default px-5 py-3 text-xl font-bold text-gray-400`}>
                        {tittleMessage(t("HSMTable.Mensajes Totales"), totalHsm)}
                    </span>
                    <span className="mx-auto grid grid-cols-2 gap-3 p-4">
                        <span className="flex space-x-2 p-1">
                            <CheckIcon2 className="mt-2 flex items-start justify-center" />
                            <span className="flex flex-col">
                                <span className="text-15 font-light text-gray-400">
                                    <span className="w-12 text-ellipsis">{t("HSMTable.Entregado a Whatsapp")}</span>
                                </span>
                                {loadingWidgets ? (
                                    loadingQuantity()
                                ) : (
                                    <span className="text-2xl font-bold text-gray-400">{numberFormat(delivered)}</span>
                                )}
                            </span>
                        </span>
                        <span className="flex space-x-2 p-1">
                            <DoubleCheckmarkIcon1 className="mt-2 flex items-start justify-center" />
                            <span className="flex flex-col">
                                <span className="text-15 font-light text-gray-400">
                                    <span className="w-12 text-ellipsis">{t("HSMTable.deliveredUser")}</span>
                                </span>
                                {loadingWidgets ? (
                                    loadingQuantity()
                                ) : (
                                    <span className="text-2xl font-bold text-gray-400">{numberFormat(deliveredUser)}</span>
                                )}
                            </span>
                        </span>
                        <span className="flex space-x-2 p-1">
                            <WarningIcon2 height={"1.0625rem"} width={"1.0625rem"} className="mt-1 flex items-start justify-center" />
                            <span className="flex flex-col">
                                <span className="text-15 font-light text-red-1050">{t("HSMTable.Fallidos")}</span>
                                {loadingWidgets ? (
                                    loadingQuantity("#EC5F4F")
                                ) : (
                                    <span className="text-2xl font-bold text-red-1050">{numberFormat(failed)}</span>
                                )}
                            </span>
                        </span>
                    </span>
                </div>
            </div>
            <CardWrapper
                title={t("HSMTable.Rendimiento de campaña")}
                titleColor="text-gray-400 px-3 py-1"
                className="mt-4 min-h-[18rem] flex-1 overflow-hidden rounded-xl border-default border-gray-100/50 mid:mt-0">
                {loadingWidgets ? (
                    <LoadingPerformance />
                ) : (
                    <PerformanceStat
                        noHsmData={noHsmData}
                        stats={stats}
                        deliveredPercentage={deliveredPercentage}
                        userReadPercentage={userReadPercentage}
                        repliedPercentage={repliedPercentage}
                        numberFormat={numberFormat}
                    />
                )}
            </CardWrapper>
        </div>
    );
};
export default Stats;
