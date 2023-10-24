import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import lowerCase from "lodash/lowerCase";
import Tippy from "@tippyjs/react";

import { CubeIcon, DataBaseIcon, LeftArrow } from "@apps/shared/icons";
import { useSelector } from "react-redux";

const ReportCard = (props) => {
    const { report, setReport } = props;
    const theReport = get(report, "Report", "");
    const { t } = useTranslation();
    const navigate = useNavigate();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const urlGo = lowerCase(get(theReport, "name")).replaceAll(" ", "_");
    const description = get(theReport, "description", {});

    return (
        <div className="relative">
            <section
                className="group relative flex h-full min-h-card w-full flex-col rounded-xl border-3 border-transparent bg-white p-8 text-left hover:cursor-pointer hover:border-primary-200/15 hover:shadow-data-card"
                onClick={() => {
                    setReport(report);
                    navigate(`/datum/reports/${urlGo}`);
                }}>
                <div className="absolute right-0 top-35">
                    <CubeIcon width="72" height="100" />
                </div>
                <div className="absolute bottom-0 left-0">
                    <DataBaseIcon width="68" height="37" />
                </div>
                <div className="flex w-full flex-1 justify-between">
                    <div className="flex w-full flex-col">
                        <div className="flex w-full flex-col">
                            <div className="z-10 font-semibold text-gray-400 group-hover:text-primary-200">{get(theReport, "name", "")}</div>
                            <div className="pt-2">
                                <div className="text-sm text-gray-400 text-opacity-60 group-hover:text-opacity-90">
                                    {t("plugins.Creado")}: {dayjs(report.createdAt).format("DD/MM/YYYY")}
                                </div>
                            </div>
                            {!isEmpty(description) && !isEmpty(description[lang]) && (
                                <Tippy content={description[lang]} theme="tomato" arrow={false} placement="top" touch={false}>
                                    <p
                                        className="z-10 mt-1 w-60 overflow-hidden text-gray-400 text-opacity-60 group-hover:text-opacity-90"
                                        style={{ lineHeight: "1.3rem", maxHeight: "calc(1.3rem * 3)" }}>
                                        {description[lang].length > 80 ? description[lang].substring(0, 80) + " ..." : description[lang]}
                                    </p>
                                </Tippy>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-col">
                    <div className="border-t relative flex w-full items-center justify-end space-x-2 border-gray-400 border-opacity-15 pt-2">
                        <div className="absolute right-0 bottom-[30px] hidden group-hover:flex ">
                            <svg width="61" height="126" viewBox="0 0 61 126" fill="none">
                                <rect x="34" width="27" height="126" fill="#E6F7F9" />
                                <rect y="24" width="28" height="102" fill="#E6F7F9" />
                            </svg>
                        </div>
                        <span className="text-opacity-59 text-sm font-bold text-gray-400 group-hover:text-primary-200">
                            {t("dataReport.enterReport")}
                        </span>
                        <LeftArrow className="mt-1" width="10" height="8" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ReportCard;
