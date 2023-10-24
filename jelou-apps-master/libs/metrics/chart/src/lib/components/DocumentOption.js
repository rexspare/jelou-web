import Tippy from "@tippyjs/react";
import React from "react";
import { withTranslation } from "react-i18next";
import "tippy.js/dist/tippy.css"; // optional
import DocumentIcon from "./Icon/DocumentIcon";

const DocumentOption = ({ downloadChartDocument, setOpenDownloadOptions, openDownloadOptions, t }) => {
    return (
        <Tippy theme={"jelou"} content={t("plugins.document")} placement={"right"} touch={false}>
            <div
                className={
                    `flex items-center justify-center rounded-full bg-white text-primary-400 hover:bg-primary-200 hover:text-white ` +
                    `px-auto border-buttons btn mt-2 h-10 w-10 cursor-pointer md:h-12 md:w-12`
                }
                onClick={() => {
                    setOpenDownloadOptions(!openDownloadOptions);
                    downloadChartDocument();
                }}
            >
                <label className="flex cursor-pointer">
                    <DocumentIcon className="m-2 fill-current" width="22" height="22" strokeWidth="1.5" />
                </label>
            </div>
        </Tippy>
    );
};

export default withTranslation()(DocumentOption);
