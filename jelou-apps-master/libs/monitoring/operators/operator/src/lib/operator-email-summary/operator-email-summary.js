import { CardWrapper } from "@apps/shared/common";
import { CheckCircleIcon, ClockIcon, ClosedMailIcon, NotAssignedicon, OpenMailIcon, ReloadIcon } from "@apps/shared/icons";
import React, { useMemo } from "react";
import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { msToHMS } from "@apps/shared/utils";
import OperatorEmailTable from "../operator-email-table/operator-email-table";
import OperatorEmailFilter from "../operator-email-filter/operator-email-filter";
import { DownloadIcon5 } from "@apps/shared/icons";
import isEmpty from "lodash/isEmpty";

const OperatorEmailSummary = (props) => {
    const {
        emailAttention,
        emailStats,
        isLoadingEmailAttention,
        isLoadingEmailStats,
        emailsData,
        emailsPage,
        setEmailsPage,
        emailsMaxPage,
        emailsRows,
        setEmailsRows,
        emailsTotal,
        isLoadingEmails,
        setEmailStatus,
        emailStatus,
        teamOptions,
        downloadActualEmails,
    } = props;
    const { t } = useTranslation();

    const {
        Closed: closedEmails = 0,
        New: newEmails = 0,
        NotAssigned: notAssignedEmails = 0,
        Open: openEmails = 0,
        Pending: pendingEmails = 0,
        Resolved: solvedEmails = 0,
        Total: totalEmails = 0,
    } = emailAttention;

    const { firstResponseTimeAverage = 0, solutionTimeAverage = 0 } = emailStats;

    const isLoadingOrShow = (isLoading, metric, color) => {
        return isLoading ? <BeatLoader color={color} size={10} /> : metric;
    };

    const ticketsToAttendCard = useMemo(() => {
        return (
            <CardWrapper
                className="flex h-full w-full flex-col justify-between overflow-hidden rounded-1 bg-white shadow-card md:w-[57%]"
                titleColor="text-gray-100"
                title={t("Emails")}>
                <div className="flex h-full">
                    <div className="flex w-1/3 items-center justify-center lg:w-[35%]">
                        <div className="flex h-full flex-col items-center justify-center space-y-3">
                            <div className="flex items-center justify-center space-x-1">
                                <dd id="card" className={`text-[2.25rem] font-bold leading-9 text-primary-200`}>
                                    {isLoadingOrShow(isLoadingEmailAttention, totalEmails, "#00B3C7")}
                                </dd>
                            </div>
                            <dt className="text-lg font-bold text-gray-400">{t("monitoring.Totales")}</dt>
                        </div>
                    </div>

                    <div className="grid h-full flex-1 grid-cols-3 grid-rows-2 items-center justify-center">
                        <div className="flex items-center">
                            <dl className="flex space-x-1">
                                <div className="flex pt-[0.1313rem]">
                                    <ReloadIcon height="1rem" width="1.15rem" className="fill-current leading-normal text-yellow-1020" />
                                </div>

                                <div className="flex flex-col">
                                    <dt className="text-13 leading-5 text-yellow-1020 lg:text-15">{t("monitoring.Nuevos")}</dt>
                                    <dd className="text-[1.375rem] font-bold leading-9 text-yellow-1020">
                                        {isLoadingOrShow(isLoadingEmailAttention, newEmails, "#D39C00")}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="flex items-center">
                            <dl className="flex space-x-1">
                                <div className="flex">
                                    <NotAssignedicon height="1rem" width="1.15rem" className="fill-current leading-normal text-red-950" />
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-13 leading-5 text-red-950 lg:text-15">{t("monitoring.Sin Asignar")}</dt>
                                    <dd className="text-[1.375rem] font-bold leading-9 text-red-950">
                                        {isLoadingOrShow(isLoadingEmailAttention, notAssignedEmails, "#a83927")}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="flex items-center">
                            <dl className="flex space-x-1">
                                <div className="flex">
                                    <OpenMailIcon height="1rem" width="1.15rem" className="fill-current leading-normal text-gray-400" />
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-13 leading-5 text-gray-400 lg:text-15">{t("monitoring.Abiertos")}</dt>
                                    <dd className="text-[1.375rem] font-bold leading-9 text-gray-400">
                                        {isLoadingOrShow(isLoadingEmailAttention, openEmails, "#727C94")}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="flex items-center">
                            <dl className="flex space-x-1">
                                <div className="flex">
                                    <ClockIcon height="1rem" width="1.15rem" className="fill-current leading-normal text-gray-400" />
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-13 leading-5 text-gray-400 lg:text-15">{t("monitoring.Pendientes")}</dt>

                                    <dd className="text-[1.375rem] font-bold leading-9 text-gray-400">
                                        {isLoadingOrShow(isLoadingEmailAttention, pendingEmails, "#727C94")}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="flex items-center">
                            <dl className="flex space-x-1">
                                <div className="flex">
                                    <CheckCircleIcon height="1rem" width="1.15rem" className="fill-current leading-normal text-gray-400 " />
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-13 leading-5 text-gray-400 lg:text-15">{t("monitoring.Resueltos")}</dt>
                                    <dd className="text-[1.375rem] font-bold leading-9 text-gray-400">
                                        {isLoadingOrShow(isLoadingEmailAttention, solvedEmails, "#727C94")}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="flex items-center">
                            <dl className="flex space-x-1">
                                <div className="flex">
                                    <ClosedMailIcon height="1rem" width="1.15rem" className="fill-current leading-normal text-gray-400" />
                                </div>
                                <div className="flex flex-col">
                                    <dt className="text-13 leading-5 text-gray-400 lg:text-15">{t("monitoring.Cerrados")}</dt>
                                    <dd className="text-[1.375rem] font-bold leading-9 text-gray-400">
                                        {isLoadingOrShow(isLoadingEmailAttention, closedEmails, "#727C94")}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </CardWrapper>
        );
    }, [emailAttention, isLoadingEmailAttention]);

    const attentionTimeCard = useMemo(() => {
        return (
            <CardWrapper
                className="flex h-full w-full flex-col justify-between overflow-hidden rounded-1 bg-white shadow-card md:w-[43%]"
                titleColor="text-gray-100"
                title={t("monitoring.Tiempo de Atención")}>
                <div className="flex h-full">
                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex h-full flex-col items-center justify-center space-y-3">
                            <div className="flex items-center justify-center space-x-1">
                                <dd id="card" className={`text-2xl font-bold leading-9 text-primary-200 lg:text-4xl`}>
                                    {isLoadingOrShow(isLoadingEmailStats, msToHMS(firstResponseTimeAverage), "#00B3C7")}
                                </dd>
                            </div>
                            <dt className="font-bold text-gray-400 lg:text-lg">{t("monitoring.Primera Respuesta")}</dt>
                        </div>
                    </div>
                    <div className="grid w-[40%] grid-flow-row grid-cols-1 items-center justify-center">
                        <div className="flex items-center">
                            <dl className="flex flex-col items-center">
                                <dt className="text-sm leading-5 text-gray-400 lg:text-15">{t("monitoring.Tiempo de solución")}</dt>
                                <dd className="font-bold text-gray-400 lg:text-[1.375rem]">
                                    {isLoadingOrShow(isLoadingEmailStats, msToHMS(solutionTimeAverage), "#727C94")}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </CardWrapper>
        );
    }, [firstResponseTimeAverage, solutionTimeAverage, emailStats, isLoadingEmailStats, isLoadingOrShow, msToHMS]);

    return (
        <div className="mt-5 flex flex-col space-y-4">
            <div className="flex h-[16rem] w-full flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                {ticketsToAttendCard}
                {attentionTimeCard}
            </div>
            <div className="rounded-xl bg-white">
                <div className="flex items-center justify-between px-6 py-4">
                    <span className="text-xl font-bold text-gray-100">{t("monitoring.Emails en atención")}</span>
                    <button className="lg:hidden" onClick={() => downloadActualEmails()}>
                        <DownloadIcon5 width="1.875rem" height="1.875rem" />
                    </button>
                </div>
                <OperatorEmailFilter emailAttention={emailAttention} setEmailStatus={setEmailStatus} downloadActualEmails={downloadActualEmails} />
                <OperatorEmailTable
                    data={isEmpty(emailStatus) ? emailsData.filter((data) => data.status !== "draft") : emailsData}
                    nrows={emailsRows}
                    pageLimit={emailsPage}
                    maxPage={emailsMaxPage}
                    setPage={setEmailsPage}
                    setRows={setEmailsRows}
                    loading={isLoadingEmails}
                    totalResults={emailsTotal}
                    teamOptions={teamOptions}
                />
            </div>
        </div>
    );
};

export default OperatorEmailSummary;
