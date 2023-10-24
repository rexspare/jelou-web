import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";

import { SectionWrapper } from "@apps/shared/common";
import { DataPic } from "@apps/shared/icons";
import { SearchAndLayout } from "../common/SearchAndLayout";
import { homeTabDatum, homeTabReport } from "../constants";
import { useSearchData } from "../Hooks/searchData";
import { useReports } from "../services/reports";
import Downloads from "./Components/DownloadReport";
import { ReportInfo } from "./Components/ReportInfo";
import Table from "./Table";

export default function ReportsDashboard() {
    const [isBlockViewActive, setIsBlockViewActive] = useState(true);
    const [isListViewActive, setIsListViewActive] = useState(false);
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const reports = useSelector((state) => state.reports);

    const { handleSearch, resetData, searchData } = useSearchData({ dataForSearch: reports, keysForSearch: ["Report.name"] });

    const { t } = useTranslation();

    const { getReports } = useReports();

    useEffect(() => {
        if (reports.length === 0) getReports().finally(() => setLoading(false));
        else setLoading(false);
    }, [reports]);

    const handleBlockViewCards = () => {
        setIsBlockViewActive(true);
        setIsListViewActive(false);
    };

    const handleListViewCards = () => {
        setIsBlockViewActive(false);
        setIsListViewActive(true);
    };

    const handleBackReportsListClick = () => {
        setReport([]);
        resetData();
        navigate(homeTabReport);
    };

    const handleGoDatosClick = () => {
        navigate(homeTabDatum);
    };

    if (loading) {
        return (
            <div className="absolute left-0 flex h-full w-full items-center justify-center" id="loading-metrics">
                <GridLoader size={15} color={"#00B3C7"} loading={loading} />
            </div>
        );
    }

    return (
        <SectionWrapper className="py-6 pl-8 pr-12">
            <div className="mb-4 flex justify-between sm:text-2xl">
                <h1 className="flex items-start text-xl">
                    <p className="cursor-pointer font-normal text-gray-400 text-opacity-75" onClick={handleGoDatosClick}>
                        {t("dataReport.myData")}
                    </p>
                    <span className="px-2 font-normal text-gray-400 text-opacity-75"> {" / "} </span>
                    <p
                        onClick={handleBackReportsListClick}
                        className={`${
                            !isEmpty(report) && pathname !== homeTabReport
                                ? "cursor-pointer font-normal text-gray-400 text-opacity-75"
                                : "font-bold text-primary-200"
                        } `}>
                        {t("dataReport.myReports")}
                    </p>
                    {!isEmpty(report) && pathname !== homeTabReport && report.Report.displayName && (
                        <>
                            <span className={"px-2 font-normal text-gray-400 text-opacity-75"}> {" / "} </span>
                            <span className="font-bold text-primary-200">{report.Report.displayName}</span>
                        </>
                    )}
                </h1>
                <div className="flex justify-end gap-3">
                    <div className="flex h-full items-center">
                        <div className="h-10">
                            <Downloads />
                        </div>
                    </div>
                    <SearchAndLayout
                        handleActiveBlockView={handleBlockViewCards}
                        handleActiveListView={handleListViewCards}
                        handleSearch={handleSearch}
                        isBlockViewActive={isBlockViewActive}
                        isListViewActive={isListViewActive}
                        path={homeTabReport}
                        placeholder={t("dataReport.placeholderSearch")}
                    />
                </div>
            </div>

            {pathname === homeTabReport ? (
                searchData.length === 0 ? (
                    <section className="grid h-[65vh] place-content-center">
                        <DataPic width="30rem" />
                        <p className="pt-4 text-center text-2xl font-semibold text-gray-500">{t("dataReport.empty")}</p>
                    </section>
                ) : (
                    <ReportInfo
                        isBlockViewActive={isBlockViewActive}
                        isListViewActive={isListViewActive}
                        searchData={searchData}
                        setReport={setReport}
                    />
                )
            ) : (
                <Table report={report} />
            )}
        </SectionWrapper>
    );
}
