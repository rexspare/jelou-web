import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";

import { DataBaseIcon, CubeIcon, LeftArrow, LoadingSpinner } from "@apps/shared/icons";
import { useDataBases } from "./services/databases";
import { useReports } from "./services/reports";

export default function DatumHome() {
    const { t } = useTranslation();
    const { getReports } = useReports();
    const { LoadAllDatabases } = useDataBases();

    const [loadingDatabases, setLoadingDatabases] = useState(true);
    const [loadingReports, setLoadingReports] = useState(true);

    const reports = useSelector((state) => state.reports);
    const databases = useSelector((state) => state.databases);
    const permissions = useSelector((state) => state.permissions);

    const databasePermissions = permissions?.some((permission) => permission === "datum:view_databases");
    const reportPermissions = permissions?.some((permission) => permission === "report:view_report");

    const navigate = useNavigate();

    useEffect(() => {
        if (reportPermissions) {
            getReports().finally(() => setLoadingReports(false));
        } else {
            setLoadingReports(false);
        }

        if (databasePermissions) {
            LoadAllDatabases().finally(() => setLoadingDatabases(false));
        } else {
            setLoadingDatabases(false);
        }
    }, [databasePermissions, reportPermissions]);

    const goToDatabases = () => {
        if (!databasePermissions) return;
        navigate("databases");
    };

    const goToReport = () => {
        if (!reportPermissions) return;
        navigate("reports");
    };

    return (
        <div className="iconDatum flex h-screen justify-around py-6 pl-8 pr-12">
            <section className="grid w-90 place-content-center gap-5">
                <div>
                    <p className="block text-xl font-bold text-gray-400">{t("datum.welcomeTo")}</p>
                    <span className="text-5xl font-extrabold text-primary-200">Jelou® Datum</span>
                </div>

                <Tippy
                    arrow={false}
                    theme="tomato"
                    content={t("datum.warning.permissionDB")}
                    placement="top"
                    touch={false}
                    disabled={databasePermissions}>
                    <button onClick={goToDatabases} title={t("dataReport.goToDatabases")}>
                        <section className="group relative flex h-40 w-70 flex-col rounded-xl border-3 border-transparent bg-white p-8 text-left hover:cursor-pointer hover:border-primary-200/15 hover:shadow-data-card">
                            <div className="absolute right-0 top-35">
                                <CubeIcon width="72" height="100" />
                            </div>

                            <div className="absolute bottom-0 left-0">
                                <DataBaseIcon width="68" height="37" />
                            </div>
                            <div className="flex w-full flex-1 justify-between">
                                <div className="flex w-full flex-col">
                                    <div className="flex w-full flex-col">
                                        <h3 className="!text-base font-semibold text-gray-400 group-hover:text-primary-200">
                                            {t("dataReport.databases")}
                                        </h3>
                                        <div className="mb-3 pt-2">
                                            <p className="flex items-center gap-2 text-sm font-bold text-gray-400 text-opacity-60">
                                                {loadingDatabases === false && databasePermissions === false ? (
                                                    " "
                                                ) : loadingDatabases ? (
                                                    <LoadingSpinner />
                                                ) : (
                                                    databases?.length || 0
                                                )}{" "}
                                                {databasePermissions && t("datum.databases")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex w-full flex-col">
                                <div className="relative flex w-full items-center justify-end space-x-2 border-t-0.5 border-gray-400 border-opacity-15 pt-4">
                                    <span className="text-opacity-59 !text-sm font-bold text-gray-400 group-hover:text-primary-200">
                                        {t("dataReport.goToDatabases")}
                                    </span>
                                    <LeftArrow className="mt-1" width="10" height="8" />
                                </div>
                            </div>
                        </section>
                    </button>
                </Tippy>

                <Tippy
                    arrow={false}
                    theme="tomato"
                    content={t("datum.warning.permissionRP")}
                    placement="top"
                    touch={false}
                    disabled={reportPermissions}>
                    <button onClick={goToReport} title={t("dataReport.goToReports")}>
                        <section className="group relative flex h-40 w-70 flex-col rounded-xl border-3 border-transparent bg-white p-8 text-left hover:cursor-pointer hover:border-primary-200/15 hover:shadow-data-card">
                            <div className="absolute right-0 top-35">
                                <CubeIcon width="72" height="100" />
                            </div>
                            <div className="absolute bottom-0 left-0">
                                <DataBaseIcon width="68" height="37" />
                            </div>
                            <div className="flex w-full flex-1 justify-between">
                                <div className="flex w-full flex-col">
                                    <div className="flex w-full flex-col">
                                        <h3 className="text-base font-semibold text-gray-400 group-hover:text-primary-200">
                                            {t("dataReport.reports")}
                                        </h3>
                                        <div className="mb-3 pt-2">
                                            <p className="flex items-center gap-2 text-sm font-bold text-gray-400 text-opacity-60">
                                                {loadingReports === false && reportPermissions === false ? (
                                                    ""
                                                ) : loadingReports ? (
                                                    <LoadingSpinner />
                                                ) : (
                                                    (reports && reports.length) || 0
                                                )}{" "}
                                                {reportPermissions && t("datum.reports")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex w-full flex-col">
                                <div className="relative flex w-full items-center justify-end space-x-2 border-t-0.5 border-gray-400 border-opacity-15 pt-3">
                                    <span className="text-opacity-59 text-sm font-bold text-gray-400 group-hover:text-primary-200">
                                        {t("dataReport.goToReports")}
                                    </span>
                                    <LeftArrow className="mt-1" width="10" height="8" />
                                </div>
                            </div>
                        </section>
                    </button>
                </Tippy>
            </section>
            <section className="w-1/2"></section>
        </div>
    );
}
