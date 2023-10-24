/**
 * Renders the final information, which corresponds to the second "Upload file" view.
 * This information is displayed in the middle of the modal.
 */

import { useTranslation } from "react-i18next";

import { CloseIcon2 } from "@apps/shared/icons";

import ExcelIcon from "../../../Illustrations/ExcelIcon";

export const UploadFileSecondView = ({ fileName, colNumbers, rowNumbers, setPageList, setAllowGoingToNextPage, setTimeCurrent, setTimeLimit }) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="pl-5 pr-2 flex h-1/5 w-full flex-row place-items-center gap-x-7 rounded-lg border-1 border-[#DCDEE4]">
                <div className="w-fit flex-none">
                    <ExcelIcon />
                </div>
                <div className="grow place-items-start text-left text-sm text-[#727C94]">
                    <div className="font-bold">{fileName}</div>
                    <div>{`${t("datum.uploadModal.colNumbers")}: ${colNumbers}`}</div>
                    <div>{`${t("datum.uploadModal.rowNumbers")}: ${rowNumbers}`}</div>
                </div>
                <div className="relative mt-5 h-full w-1/12 flex-none">
                    <button
                        className="absolute top-0 right-0"
                        aria-label="Close"
                        onClick={(evt) => {
                            evt.preventDefault();
                            setPageList([]);
                            setAllowGoingToNextPage(false);
                            setTimeCurrent(0);
                            setTimeLimit(null);
                        }}>
                        <CloseIcon2 width={"1.1rem"} height={"1.1rem"} fillOpacity={0.5} />
                    </button>
                </div>
            </div>
            <div className="mt-2.5 ml-3 text-xs font-normal text-primary-200">
                {t("datum.uploadModal.colNrowNumbersNote")}
            </div>
        </>
    );
};
