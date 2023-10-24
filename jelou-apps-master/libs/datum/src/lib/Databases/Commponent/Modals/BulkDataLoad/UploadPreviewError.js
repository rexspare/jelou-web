/**
 * Displays an error message when there is a problem with the file (format, extension, content)
 */
import { useTranslation } from "react-i18next";

import { CloseIcon2 } from "@apps/shared/icons";

import AttentionIcon from "../../../Illustrations/AttentionIcon";
import { useRef } from "react";

export const UploadPreviewError = ({
    setPageList, setFormatError, isFileSizeLimit,
    setIsFileSizeLimit, maxFileSize,
}) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="flex min-h-fit-content w-full flex-row place-items-start gap-x-7 rounded-lg border-1 border-[#DCDEE4] pt-2 pr-2 pl-5 pb-5">
                <div className="w-fit flex-none pt-4">
                    <AttentionIcon />
                </div>
                <div className="pt-3 grow place-items-start text-left text-sm text-red-500">
                    <div className="text-lg mb-3 text-justify font-bold">{t("datum.error.warning")}</div>
                    {isFileSizeLimit ? <>
                        <div className="mb-2">{t("datum.error.actions1")}</div>
                        <div>{t("datum.error.fileExtension")}</div>
                        <div>{t("datum.error.emptyFile")}</div>
                    </>: <>
                        <div className="mb-2">{t("datum.error.actions2")}</div>
                        <div>{`${t("datum.error.fileSizeLimit")} ${maxFileSize/1000000}mb.`}</div>
                    </>
                    }
                </div>
                <div className="relative h-full w-fit flex-none">
                    <button
                        className="absolute top-0 right-0"
                        aria-label="Close"
                        onClick={(evt) => {
                            evt.preventDefault();
                            setPageList([]);
                            setFormatError("");
                            setIsFileSizeLimit(true);
                        }}>
                        <CloseIcon2 width={"1.1rem"} height={"1.1rem"} fillOpacity={0.5} />
                    </button>
                </div>
            </div>
            <button
              onClick={()=>{
                            setPageList([]);
                            setFormatError("");
                            setIsFileSizeLimit(true);
                            }}
              className="button-gradient-xl mt-6 flex w-auto items-center justify-center whitespace-nowrap"
            >
              {t("datum.retryUpload")}
            </button>
        </>
    );
};
