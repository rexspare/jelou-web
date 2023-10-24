import { useState } from "react";
import { t } from "i18next";

import { ImportDataWarning } from "../ImportDataWarning";

export const NavBtns = ({
    goBack,
    goNext,
    activateButton=true,
    notReady=false,
    allDateColumnsFormatted=true,
    labelBtnSecondary=t("buttons.cancel"),
    labelBtnPrincipal=t("buttons.save"),
    executeUploadDataOperation=false,
    uploadDataFile,
    selectedFileCol,
    numInvalidDates=0,
}) => {
    const [isOpenModal, setIsOpenModal] = useState(false);

    const importDataWarning = () => setIsOpenModal(false);

    return (
        <div className="flex items-center justify-end col-span-2 col-start-1 h-full min-h-[85px] w-full border-t-1 border-[#DCDEE4] pr-10">
            <footer className="flex justify-end gap-4 py-4">
                <button
                    type="button"
                    onClick={goBack}
                    className="h-9 w-28 rounded-3xl bg-gray-10 font-bold text-gray-400"
                >
                    {labelBtnSecondary}
                </button>
                <div>
                    <button
                        type="button"
                        disabled={!activateButton || notReady || !allDateColumnsFormatted || numInvalidDates > 0}
                        className="button-gradient disabled:cursor-not-allowed disabled:bg-opacity-60"
                        onClick={(e) => {
                            e.preventDefault();
                            executeUploadDataOperation ? uploadDataFile() : goNext();
                            }
                        }
                    >
                        {labelBtnPrincipal}
                    </button>
                    {isOpenModal && <ImportDataWarning showModal={isOpenModal} closeModal={importDataWarning} uploadDataToDb={uploadDataFile} selectedFileCol={selectedFileCol} />}
                </div>
            </footer>
        </div>
    );
};
