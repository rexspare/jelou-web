import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FileDrop } from "react-file-drop";
import { IconArchiveFile, LoadingSpinner } from "@apps/shared/icons";

const FileDropUploader = (props) => {
    const { isLoading, handleFile, fileType, displayWarningColor, flexRow = false, isImage = false } = props;
    const { t } = useTranslation();
    const inputFileElement = useRef(null);

    const onDrop = (files) => {
        const dropFile = { target: { files: files } };
        handleFile(dropFile);
    };

    const handleOpenSearchFile = () => {
        inputFileElement.current.click();
    };

    return (
        <FileDrop className="w-full" onDrop={(files) => onDrop(files)}>
            <div
                className={`flex items-center rounded-20 border-[0.605322px] border-dashed ${
                    flexRow ? "flex-row justify-center space-x-3 py-4" : "flex-col py-9"
                } ${displayWarningColor ? "border-semantic-error bg-semantic-error-light" : "border-primary-75 bg-teal-5"}`}>
                <IconArchiveFile width={"62px"} height={"62px"} />
                <div className="flex flex-col items-center">
                    <h3 className="mt-1 w-2/3 text-center text-base font-medium leading-6 text-gray-400">{t("common.dragDocuments")}</h3>
                    <div className="mx-auto my-4 flex w-56 items-center gap-2 font-extrabold text-gray-400">
                        <span className="h-0.5 w-full bg-gray-100/25"></span>O<span className="h-0.5 w-full bg-gray-100/25"></span>
                    </div>
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleOpenSearchFile}
                        className={`py-1.5 flex h-8 w-36 items-center justify-center whitespace-nowrap rounded-xl border-1 border-primary-200 bg-transparent px-4 text-sm font-bold ${
                            displayWarningColor ? "border-semantic-error text-semantic-error" : "border-primary-200 text-primary-200"
                        }`}>
                        {isLoading ? <LoadingSpinner color={"white"} /> : t("common.searchFile")}
                    </button>
                    <input onChange={handleFile} ref={inputFileElement} type="file" className="hidden" id="pdfFile" accept={fileType} />
                    <div
                        className={`mt-2 ${
                            displayWarningColor
                                ? "border-semantic-error text-semantic-error"
                                : "border-primary-200 text-sm text-black text-opacity-40"
                        }`}>
                        {`${t("brain.maxFileSize")}, ${isImage ? fileType : fileType.slice(1)}`}
                    </div>
                </div>
            </div>
        </FileDrop>
    );
};

export default FileDropUploader;
