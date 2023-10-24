import { LogsTable } from "libs/monitoring/ui-shared/src";
import { CardWrapper } from "@apps/shared/common";
import { DownloadIcon5 } from "@apps/shared/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { BeatLoader, ClipLoader } from "react-spinners";

const OperatorConnections = (props) => {
    const {
        logsData,
        logsPageLimit,
        logsMaxPage,
        setLogsPageLimit,
        logsRows,
        setLogsRows,
        operatorId,
        logsTrend,
        isLoadingLogs,
        logsTotal,
        downloadLogs,
        loadingLogsDownload,
        isLoadingLogTrends,
    } = props;
    const { t } = useTranslation();

    const { onlinePercent = 0, busyPercent = 0, offlinePercent = 0 } = logsTrend;

    const isLoadingOrShow = (metric, color) => {
        return isLoadingLogTrends ? <BeatLoader color={color} size={10} /> : metric;
    };

    return (
        <div className="mt-5 flex min-h-600 flex-1 flex-col space-x-4 md:flex-row lg:h-modal lg:space-x-8">
            <CardWrapper title={t("monitoring.Conexiones")} titleColor="text-gray-100" className="flex h-1/3 w-2/5 flex-col rounded-xl bg-white">
                <div className="grid h-full place-content-center">
                    <div className="flex items-center gap-24">
                        <span className="flex w-1/3 flex-col items-center">
                            <span className="text-xl font-bold text-primary-200 lg:text-2xl">{isLoadingOrShow(onlinePercent, "#00B3C7")}</span>
                            <span className="text-base font-bold text-gray-400">{t("monitoring.Conectado")}</span>
                        </span>
                        <span className="flex w-1/2 flex-col">
                            <span className="flex flex-col">
                                <span className="text-sm font-light text-gray-400 lg:text-15">{t("monitoring.Ocupado")}</span>
                                <span className="text-base font-bold text-gray-400 lg:text-[1.375rem]">
                                    {isLoadingOrShow(busyPercent, "#727c94")}
                                </span>
                            </span>
                            <span className="flex flex-col">
                                <span className="text-sm font-light text-gray-400 lg:text-15">{t("monitoring.Desconectado")}</span>
                                <span className="text-base font-bold text-gray-400 lg:text-[1.375rem]">
                                    {isLoadingOrShow(offlinePercent, "#727c94")}
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
            </CardWrapper>
            <div className="flex w-full flex-col overflow-y-auto rounded-b-xl lg:max-h-65">
                <div className="flex w-full items-center justify-between rounded-t-xl border-b-default border-gray-100/25 bg-white px-5 py-3">
                    <p className="text-xl font-bold text-gray-100">{t("monitoring.Status Conexiones")}</p>
                    <button onClick={() => downloadLogs()} disabled={loadingLogsDownload}>
                        {loadingLogsDownload ? <ClipLoader color={"white"} size="1.1875rem" /> : <DownloadIcon5 width="1.875rem" height="1.875rem" />}
                    </button>
                </div>
                {/* <ConnectionTable /> */}
                <LogsTable
                    operatorId={operatorId}
                    data={logsData}
                    nrows={logsRows}
                    pageLimit={logsPageLimit}
                    maxPage={logsMaxPage}
                    setPageLimit={setLogsPageLimit}
                    setRows={setLogsRows}
                    isLoadingLogs={isLoadingLogs}
                    totalResults={logsTotal}
                />
            </div>
        </div>
    );
};

export default OperatorConnections;
