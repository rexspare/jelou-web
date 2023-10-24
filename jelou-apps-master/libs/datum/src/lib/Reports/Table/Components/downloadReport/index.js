import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
import React from "react";

import DelimSelector from "./DelimSelector";

export function DownloadReportButton({ onDownload, downloading, handleDelimChange }) {
    const { t } = useTranslation();

    return (
        <section className="flex justify-end">
            <div className="relative flex h-10 min-w-[75px] items-center justify-center  rounded-full  bg-primary-600 text-primary-200">
                {!downloading ? (
                    <>
                        <button className="flex items-center justify-center pl-6 font-bold" onClick={onDownload}>
                            <span>{t("dataReport.btnDownload")}</span>
                        </button>
                        <DelimSelector handleDelimChange={handleDelimChange} onDownload={onDownload} />
                    </>
                ) : (
                    <ClipLoader color="text-primary-200" size={20} />
                )}
            </div>
        </section>
    );
}
