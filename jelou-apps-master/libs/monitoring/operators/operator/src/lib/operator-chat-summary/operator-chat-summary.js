import get from "lodash/get";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

import { ssToHMS } from "@apps/shared/utils";
import { CardWrapper } from "@apps/shared/common";
import { DownloadIcon5 } from "@apps/shared/icons";
import { ActualCasesTable } from "@apps/monitoring/ui-shared";

const OperatorChatSummary = (props) => {
    const {
        casesData,
        chatsTrend,
        attentionTrend,
        casesPage,
        casesMaxPage,
        setCasesPage,
        casesRows,
        setCasesRows,
        loadingCases,
        casesTotal,
        downloadActualCases,
        isLoadingChatTrends,
    } = props;
    const { t } = useTranslation();
    const { actual = 0, realTotal = 0, total = 0, attended = 0, notAttended = 0, actualNotReplied = 0 } = chatsTrend;
    const { avgConversationTime = 0, avgOperatorResponseTime = 0, avgReplyTime = 0 } = attentionTrend;

    const company = useSelector((state) => state.company);
    const hasDifMetrics = get(company, "properties.monitoring.hasPersonalizedMetrics", false);

    const isLoadingOrShow = (metric, color) => {
        return isLoadingChatTrends ? <BeatLoader color={color} size={10} /> : metric;
    };

    const totalSummary = hasDifMetrics ? realTotal : total;

    const chatsCard = useMemo(() => {
        return (
            <CardWrapper
                title="Chats"
                titleColor="text-gray-100"
                className="flex h-full w-1/2 flex-col rounded-xl bg-white lg:h-1/3 lg:w-full 2xl:h-2/5">
                <div className="grid h-full place-content-center">
                    <div className="flex w-72 gap-24">
                        <span className="flex w-1/3 flex-col items-center justify-center lg:w-auto">
                            <span className="whitespace-nowrap text-2xl font-bold text-primary-200 lg:text-3xl">
                                {isLoadingOrShow(totalSummary, "#00B3C7")}
                            </span>
                            <span className="whitespace-nowrap text-lg font-bold text-gray-400 lg:text-xl">{t("monitoring.Totales")}</span>
                        </span>
                        <span className="mx-auto grid grid-cols-2 gap-3">
                            <span className="flex flex-col">
                                <span className="whitespace-nowrap text-sm font-light text-gray-400">{t("monitoring.Actuales")}</span>
                                <span className="whitespace-nowrap text-15 font-bold text-gray-400 lg:text-[1.375rem]">
                                    {isLoadingOrShow(actual, "#727c94")}
                                </span>
                            </span>
                            <span className="flex flex-col">
                                <span className="whitespace-nowrap text-sm font-light text-red-1010 lg:text-15">{t("monitoring.Pendientes")}</span>
                                <span className="whitespace-nowrap text-15 font-bold text-red-950 lg:text-[1.375rem]">
                                    {isLoadingOrShow(actualNotReplied, "#a83927")}
                                </span>
                            </span>
                            <span className="flex flex-col">
                                <span className="whitespace-nowrap text-sm font-light text-gray-400">{t("monitoring.Atendidos")}</span>
                                <span className="whitespace-nowrap text-15 font-bold text-gray-400 lg:text-[1.375rem]">
                                    {isLoadingOrShow(attended, "#727c94")}
                                </span>
                            </span>
                            <span className="flex flex-col">
                                <span className="whitespace-nowrap text-sm font-light text-gray-400">{t("monitoring.No atendidos")}</span>
                                <span className="whitespace-nowrap text-15 font-bold text-gray-400 lg:text-[1.375rem]">
                                    {isLoadingOrShow(notAttended, "#727c94")}
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
            </CardWrapper>
        );
    }, [chatsTrend, isLoadingChatTrends]);

    const attentionTimeCard = useMemo(() => {
        return (
            <CardWrapper
                title={t("monitoring.Tiempo de atencion")}
                titleColor="text-gray-100"
                className="flex h-full w-1/2 flex-col rounded-xl bg-white lg:h-1/3 lg:w-full 2xl:h-2/5">
                <div className="grid h-full place-content-center">
                    <div className="flex w-72 gap-12">
                        <span className="flex w-1/2 flex-col justify-center lg:w-auto">
                            <span className="text-xl font-bold text-primary-200 lg:text-2xl xl:text-[1.3rem]">
                                {isLoadingOrShow(ssToHMS(avgReplyTime), "#00B3C7")}
                            </span>
                            <span className="text-sm font-bold text-gray-400 lg:text-15">{t("monitoring.Prim. Respuesta")}</span>
                        </span>
                        <span className="flex w-1/2 flex-col space-y-4">
                            <span className="flex flex-col">
                                <span className="text-sm font-light text-gray-400">{t("monitoring.Prom. respuesta")}</span>
                                <span className="text-base font-bold text-gray-400 lg:text-[1.3rem]">
                                    {isLoadingOrShow(ssToHMS(avgOperatorResponseTime), "#727c94")}
                                </span>
                            </span>
                            <span className="flex flex-col">
                                <span className="text-sm font-light text-gray-400">{t("monitoring.Prom. duración")}</span>
                                <span className="text-base font-bold text-gray-400 lg:text-[1.3rem]">
                                    {isLoadingOrShow(ssToHMS(avgConversationTime), "#727c94")}
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
            </CardWrapper>
        );
    }, [attentionTrend, isLoadingChatTrends]);

    return (
        <div className="mt-5 flex h-[17rem] min-h-600 flex-1 flex-col space-y-4 lg:h-modal lg:flex-row lg:space-x-6 lg:space-y-0">
            <div className="flex space-x-4 lg:w-2/5 lg:flex-col lg:space-x-0 lg:space-y-4">
                {chatsCard}
                {attentionTimeCard}
            </div>
            <div className="flex w-full flex-col overflow-hidden rounded-xl lg:max-h-65">
                <div className="sticky inset-x-0 top-0 z-10 flex w-full items-center justify-between rounded-t-xl border-b-default border-gray-100/50 bg-white px-5 py-3">
                    <p className="text-xl font-bold text-gray-100">{t("monitoring.Casos")}</p>
                    <button onClick={() => downloadActualCases()}>
                        <DownloadIcon5 width="1.875rem" height="1.875rem" />
                    </button>
                </div>
                {/* <CasesTable /> */}
                <ActualCasesTable
                    data={casesData}
                    nrows={casesRows}
                    page={casesPage}
                    maxPage={casesMaxPage}
                    setPage={setCasesPage}
                    setRows={setCasesRows}
                    loading={loadingCases}
                    totalResults={casesTotal}
                />
            </div>
        </div>
    );
};

export default OperatorChatSummary;
