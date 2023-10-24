import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ListDataCard } from "../../../common/DataCardList";
import { useStructureList } from "../../../Hooks/estructureList";
import ReportCard from "../ReportCard";

export function ReportInfo({ isBlockViewActive, isListViewActive, searchData = [], setReport } = {}) {
    const [showAllReport, setShowAllReport] = useState(false);
    const { reportStructure } = useStructureList();
    const navigate = useNavigate();
    const { t } = useTranslation()

    const handleShowReportClick = (evt) => {
        evt.preventDefault();
        setShowAllReport((preState) => !preState);
    };

    const handleGoToReportClick = (row) => {
        const { Report } = row.original;
        const { name } = Report;
        const goUrl = name.replaceAll(" ", "_");

        setReport(row.original);
        navigate(`/datum/reports/${goUrl}`);
    };

    const numShowCardsReport = searchData.length - 10;

    return isBlockViewActive ? (
        <>
            <GridCards>
                {searchData && searchData.length > 0 && showAllReport === false
                    ? searchData.slice(0, 10).map((report, index) => <ReportCard report={report} key={index} setReport={setReport} />)
                    : searchData.map((report, index) => <ReportCard report={report} key={index} setReport={setReport} />)}
            </GridCards>
            <div className="flex justify-end mt-5">
                <button onClick={handleShowReportClick} className="text-base font-bold text-primary-200">
                    {numShowCardsReport > 0 && (showAllReport ?  t("dataReport.seeLess") : `${t("dataReport.seeAll")} (${numShowCardsReport})`)}
                </button>
            </div>
        </>
    ) : (
        searchData && searchData.length > 0 && isListViewActive && (
            <section className="pr-2">
                <ListDataCard datalist={searchData} handleRowClick={handleGoToReportClick} structureColums={reportStructure} />
            </section>
        )
    );
}

export function GridCards({ children }) {
    return (
        <div className="grid grid-flow-row gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minMax(18.125rem, 1fr))" }}>
            {children}
        </div>
    );
}
