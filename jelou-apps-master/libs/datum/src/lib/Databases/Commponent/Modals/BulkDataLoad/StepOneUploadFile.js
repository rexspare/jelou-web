/**
 * Renders information corresponding to the "Upload file" step.
 * This information is displayed in the middle of the modal, as the process' first step.
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { STEPS_IDS, FILE_SIZE_MAX } from "libs/datum/src/lib/constants";
import { UploadFileFirstView } from "./UploadFileFirstView";
import { UploadFileSecondView } from "./UploadFileSecondView";
import { UploadPreviewError } from "./UploadPreviewError";
import { UserHelpTips } from "./UserHelpTips";
import { NavBtns } from "./NavigationButtons";

export const UploadFile = ({
    handleFile, pageList, setPageList, page, fileName, formatError, setFormatError,
    loadingFile, allowGoingToNextPage, setAllowGoingToNextPage, closeAndClear, goToNextPanel, timeCurrent,
    setTimeLimit, setTimeCurrent,
}) => {
    const { t } = useTranslation();
    const [ totalColumns, setTotalColumns ] = useState(0);
    const [ totalRows, setTotalRows ] = useState(0);
    const [ isFileSizeLimit , setIsFileSizeLimit ] = useState(true);


    const goNext = () => {
        goToNextPanel(STEPS_IDS.FILE_UPLOAD, STEPS_IDS.COLUMN_MATCH);
        setTimeLimit(null);
        setTimeCurrent(0)
    };

    useEffect(() => {
        if (!isEmpty(pageList)) {
            setTotalColumns(get(pageList[page], "totalColumns", 0));
            setTotalRows(get(pageList[page], "totalRows", 0));
            setIsFileSizeLimit(get(pageList[page], "fileSize", 0) < FILE_SIZE_MAX);
            setAllowGoingToNextPage(true);
        }
    }, [page, pageList]);

    return (
        <div className="grid grid-cols-[1fr_1fr]">
            <div className="h-[640px] w-full py-16 pr-10 pl-10 text-base text-[#727C94]">
                <h4 className="mb-5 font-bold">{t("datum.uploadModal.uploadDb")}</h4>
                {isEmpty(formatError) && isFileSizeLimit ? (
                        !pageList?.length > 0 ? (
                            <UploadFileFirstView
                                handleFile={handleFile}
                                timeCurrent={timeCurrent}
                                loadingFile={loadingFile}
                        />
                        ) : (
                            <UploadFileSecondView
                                fileName={fileName}
                                colNumbers={totalColumns}
                                rowNumbers={totalRows}
                                setPageList={setPageList}
                                setAllowGoingToNextPage={setAllowGoingToNextPage}
                                setTimeCurrent={setTimeCurrent}
                                setTimeLimit={setTimeLimit}
                            />
                        )
                ) : (
                    <UploadPreviewError
                        setPageList={setPageList}
                        setFormatError={setFormatError}
                        isFileSizeLimit={isFileSizeLimit}
                        setIsFileSizeLimit={setIsFileSizeLimit}
                        maxFileSize={FILE_SIZE_MAX}
                    />
                )}
            </div>
            <div className="h-[640px] w-full border-l-1 border-[#DCDEE4] py-16 pr-16 pl-10 text-primary-200">
                <UserHelpTips />
            </div>
            <NavBtns
                goBack={closeAndClear}
                goNext={goNext}
                activateButton={allowGoingToNextPage}
                labelBtnPrincipal={t("buttons.next")}
            />
        </div>
    );
};
