import "dayjs/locale/es";
import React from "react";
import dayjs from "dayjs";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";

dayjs.extend(relativeTime);

const DownloadItem = ({ download }) => {
    const { t } = useTranslation();
    const { totalFiles } = download;
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const filesGenerated = get(download, "filesGenerated", 0);
    const percentage = Math.round((filesGenerated / totalFiles) * 100);

    const createdAt = dayjs(download.createdAt);

    const name = get(download, "payload.displayName", download.name);

    return (
        <div className="border-b mb-4 flex flex-col items-start justify-start border-gray-200 px-6 pb-4 text-sm">
            <span className="mb-1 block truncate text-base font-semibold text-gray-400">
                {name} -{" "}
                {download.status === "FAILED" ? (
                    <i className="text-xs text-red-500 opacity-75">{t("Fallida")}</i>
                ) : (
                    <i className="text-xs opacity-75">{createdAt?.locale(lang || "es")?.fromNow() ?? createdAt.format()}</i>
                )}
            </span>
            {download.status === "DONE" && (
                <a
                    href={download.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center rounded-full bg-primary-200 px-4 py-1 font-semibold text-white">
                    {t("common.download")}
                </a>
            )}
            {download.status === "IN_PROGRESS" && (
                <div className="flex w-2/3 overflow-hidden rounded-default text-xs" style={{ height: "7px", backgroundColor: "#f2f2f2" }}>
                    <div
                        style={{ width: `${percentage}%` }}
                        className="flex flex-col justify-center whitespace-nowrap bg-primary-200 text-center text-white shadow-none"></div>
                </div>
            )}
        </div>
    );
};

export default DownloadItem;
