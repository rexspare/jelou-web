/**
 * Renders the initial information, which corresponds to the first "Upload file" view.
 * This information is displayed in the middle of the modal.
 */

import { useRef } from "react";
import { FileDrop } from "react-file-drop";
import { useTranslation } from "react-i18next";

import { LoadingSpinner } from "@apps/shared/icons";

import ExcelFilesIcon from "../../../Illustrations/ExcelFilesIcon";
import { SyncUp } from "@apps/shared/common";

const downloadFileTest = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/datum-135/DatumExampleTypes.xlsx"

export const UploadFileFirstView = ({ handleFile, loadingFile, timeCurrent }) => {
    const { t } = useTranslation();
    const inputFileElement = useRef(null);

    const handleInputFileClick = () => inputFileElement.current.click();

    const onDrop = (files) => {
        const dropFile = { target: { files: files } };
        handleFile(dropFile);
    };

    return (
        <>
            <FileDrop className="grid h-3/4 w-full place-items-center rounded-lg border-1 border-[#DCDEE4]" onDrop={(files) => onDrop(files)}>
                <div className="flex flex-col items-center">
                    {loadingFile ? <SyncUp currentProgress={timeCurrent} text={t("common.synchronizing") + " " + t("pma.Archivo")}  /> : <ExcelFilesIcon />}
                    <div className="mt-3 mb-2 w-3/5 text-center text-sm font-bold text-[#727C94]">
                        {t("datum.uploadModal.dragNdrop")}
                    </div>
                    <button onClick={handleInputFileClick} className="button-gradient-xl flex w-auto items-center justify-center whitespace-nowrap">
                        {t("shop.modal.findFile")}
                    </button>
                    <input onChange={handleFile} ref={inputFileElement} type="file" className="hidden" accept=".xlsx" />
                </div>
            </FileDrop>
            <div className="mt-2.5 ml-3 text-xs font-normal text-primary-200">
                <span>{t("datum.uploadModal.allowedFileType")}.
                  <a className="text-primary-200 font-bold" href={downloadFileTest} target="_blank">{t("datum.uploadModal.testFile")}</a>
                </span>
            </div>
        </>
    );
};
