import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

import { NavBtns } from "./NavigationButtons";
import { STEPS_IDS } from "libs/datum/src/lib/constants";

export const DataPreview = ({
    dataBaseColumns, pageList, page, selectedFileCol,
    goBackPanel, goToNextPanel, uploadDataFile
}) => {
    const { t } = useTranslation();
    const uploadedFileDatum = get(pageList, `[${page}].preview`, []);
    const [ numInvalidDates, setNumInvalidDates ] = useState(0);
    let invalidDateCount = 0;

    const goNext = () => goToNextPanel(STEPS_IDS.COLUMN_MATCH, STEPS_IDS.DATA_PREVIEW);
    const goBack = () => goBackPanel(STEPS_IDS.DATA_PREVIEW, STEPS_IDS.COLUMN_MATCH);

    const isInvalidDateValue = (value) => value === t("datum.error.invalidDate");

    useEffect(() => {
        setNumInvalidDates(invalidDateCount);
    }, [invalidDateCount]);

    return (
        <div className="grid grid-cols-1">
            <div className="h-[640px] w-full py-16 pr-16 pl-10 text-base text-[#727C94]">
                <h4 className="font-bold">{t("datum.uploadModal.previewDb")}</h4>
                <div className="mt-3 mb-5 text-justify text-sm">{t("datum.uploadModal.previewDataNote")}</div>
                <div className="max-h-[440px] max-w-full overflow-auto rounded-lg border-1 border-[#DCDEE4]">
                    <table className="divide-y min-w-full divide-gray-200 text-left, text-sm">
                        <thead className="border-b-1 border-[#DCDEE4] sticky top-0 bg-white">
                            <tr>
                                {dataBaseColumns.map((dbCol, headRowIndex) => {
                                    return (
                                        <th key={`header-${headRowIndex}`} scope="col" className="px-6 py-3 font-bold text-[#00B3C7]">
                                            {t(dbCol.name)}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="text-[#727C94]">
                            {uploadedFileDatum.map((rowFileDatum, rowIndex) => {
                                return(
                                    <tr key={`row-${rowIndex}`}>
                                        {selectedFileCol.map((column, dbColIndex) => {
                                            const colToBeUploaded = column.value;
                                            const dataToBeUploaded = rowFileDatum[colToBeUploaded];
                                            const isInvalidDate = isInvalidDateValue(dataToBeUploaded);
                                            if (isInvalidDate) {
                                                invalidDateCount++;
                                            }
                                            return(
                                                <td key={`data-${colToBeUploaded}-${dbColIndex}`}
                                                className={`p-6 ${isInvalidDate ? "text-red-675" : ""}`} >
                                                    {dataToBeUploaded}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {numInvalidDates > 0 && <div className="my-3 w-full text-sm text-red-600">{`${t("datum.error.invalidExcelDate")}`}</div>}
            </div>
            <NavBtns
                goBack={goBack}
                goNext={goNext}
                labelBtnSecondary={t("buttons.back")}
                labelBtnPrincipal={t("buttons.import")}
                uploadDataFile={uploadDataFile}
                executeUploadDataOperation={true}
                selectedFileCol={selectedFileCol}
                numInvalidDates={numInvalidDates}
            />
        </div>
    );
};
