import { useTranslation } from "react-i18next";
import { PDFGenericIcon, CloseIcon1, WarningIcon, CheckCircleIcon } from "@apps/shared/icons";
import { isEmpty } from "lodash";

const FileUploadStatus = (props) => {
    const { fileName = "Jelou.png", fileSize = "5", handleResetFile, isError, isImage = false, url } = props;
    const { t } = useTranslation();

    return (
        <div className="border-primary-34 w-full resize-none rounded-xl border-1 p-6">
            <div className="flex w-full gap-x-3">
                {isImage ? <img alt="" width="50" height="48" src={url} /> : <PDFGenericIcon />}
                <div className="w-2/5 grow text-black">
                    <div className="flex place-content-between gap-x-1">
                        <div className="w-2/5 grow">
                            {!isEmpty(fileName) && <span className="break-words font-bold">{fileName}</span>}
                            {fileSize && <span>&nbsp;&nbsp;|&nbsp;&nbsp;{`${fileSize} MB`}</span>}
                        </div>
                        <button className="flex items-start" onClick={handleResetFile}>
                            <CloseIcon1 width={"12px"} height={"12px"} className="fill-current text-[#B0B6C2]" />
                        </button>
                    </div>
                    <div className={`${isError ? "bg-semantic-error" : "bg-semantic-success"} my-1 h-1 w-full rounded-full`}></div>
                    <div className={`${isError ? "text-semantic-error" : "text-semantic-success"} flex w-full gap-x-3`}>
                        {isError ? (
                            <WarningIcon width="1.2rem" height="1.2rem" className="fill-current" />
                        ) : (
                            <CheckCircleIcon height="1.2rem" width="1.2rem" className="fill-current" fillOpacity={"1"} />
                        )}
                        <span>{isError ? t("common.isError") : t("common.completed")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUploadStatus;
