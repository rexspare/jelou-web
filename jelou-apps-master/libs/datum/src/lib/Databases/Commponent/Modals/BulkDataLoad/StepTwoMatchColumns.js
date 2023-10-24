/**
 * Renders information corresponding to the "Match columns" step.
 * This information is displayed in the middle of the modal, as the process' second step.
 */

import get from "lodash/get";
import isNil from "lodash/isNil";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";

import { STEPS_IDS } from "../../../../constants";
import {
    countNonFormattedDateColumns,
    countRequiredColumnsSelected,
    getColumnFileDataType,
    searchAndSelectOptionsAutomatically,
    updateArrayElement,
    updateFileWithParsedTimeFormat,
} from "../../CreateData/BulkDataLoad/bulkDataHooks";
import { NavBtns } from "./NavigationButtons";

export const MatchColumns = ({
    requiredDbColumns,
    dataBaseColumns,
    pageList,
    initPageList,
    page,
    selectedDateRows,
    setSelectedDateRows,
    selectedFileCol,
    setSelectedFileCol,
    goBackPanel,
    goToNextPanel,
}) => {
    const { t } = useTranslation();
    const uploadedFileColumns = get(pageList, `[${page}].columns`, []).sort();
    const originalFileDatum = get(initPageList, `preview`, []);
    const uploadedFileDatum = get(pageList, `[${page}].preview`, []);
    const [notReady, setNotReady] = useState(requiredDbColumns.length > 0 ? true : false);
    const [allDateColumnsFormatted, setAllDateColumnsFormatted] = useState(false);
    const tableHeadRow = ["datum.uploadModal.dataTableHead1", "datum.uploadModal.dataTableHead2", "datum.uploadModal.dataTableHead4"];

    const goNext = () => goToNextPanel(STEPS_IDS.COLUMN_MATCH, STEPS_IDS.DATA_PREVIEW);
    const goBack = () => goBackPanel(STEPS_IDS.COLUMN_MATCH, STEPS_IDS.FILE_UPLOAD);

    const handleSelectOption = (event, index, dataBaseColumn) => {
        const update = [...selectedFileCol];
        const selectedOption = event.target.value;
        const selectedOptionIndex = uploadedFileColumns.indexOf(selectedOption);
        const selectedOptionType = getColumnFileDataType({ columnName: selectedOption, dataRows: originalFileDatum });
        const { type: dbColType, key: dbColKey, isRequired } = dataBaseColumn;
        let isDate = false;

        if (dbColType === "date-time" || dbColType === "time" || dbColType === "date") {
            let dateTypeUpdate = [...selectedDateRows];
            const unselectedOption = update[index]?.value;
            if (selectedOptionType === "string") {
                updateFileWithParsedTimeFormat({
                    originalDatum: originalFileDatum,
                    columnToConvert: selectedOption,
                    file: pageList,
                    type: dbColType,
                });
                dateTypeUpdate[selectedOptionIndex] = selectedOption;
                isDate = true;
                setSelectedDateRows(dateTypeUpdate);
                updateArrayElement({
                    arrayToUpdate: update,
                    newValue: selectedOption,
                    newType: dbColType,
                    newKey: dbColKey,
                    index,
                    hasDateFormat: isDate,
                    isRequired,
                });
                setSelectedFileCol(update);
            } else if (selectedOption === "- - - -") {
                updateArrayElement({ arrayToUpdate: update, newValue: undefined, newType: "", newKey: "", index });
                setSelectedFileCol(update);
            } else {
                renderMessage(String(t("datum.error.onlyString")), MESSAGE_TYPES.ERROR);
                return;
            }
            const isTheFieldSelected = update?.reduce((acc, selectedCol) => {
                if (selectedCol.type === "date" || selectedCol.type === "time" || selectedCol.type === "date-time") {
                    if (selectedCol.value === unselectedOption) acc++;
                }
                return acc > 0 ? true : false;
            }, 0);
            if (!isTheFieldSelected) {
                dateTypeUpdate = dateTypeUpdate.map((selectedDateType) => {
                    return selectedDateType === unselectedOption ? "" : selectedDateType;
                });
                setSelectedDateRows(dateTypeUpdate);
            }
        } else {
            updateArrayElement({
                arrayToUpdate: update,
                newValue: selectedOption,
                newType: dbColType,
                newKey: dbColKey,
                index,
                hasDateFormat: isDate,
                isRequired,
            });
            setSelectedFileCol(update);
        }
    };

    useEffect(() => {
        setSelectedDateRows(
            uploadedFileColumns.map(() => {
                return "";
            })
        );
        const fuseOptions = {
            threshold: 0.3,
            caseSensitive: false,
            keys: ["name"],
        };
        const { selectedParamUpdate, dateTypeUpdate } = searchAndSelectOptionsAutomatically({
            fuseOptions,
            arrToBeSearched: dataBaseColumns,
            arrToBeFused: uploadedFileColumns,
            selectedColArr: selectedFileCol,
            selectedDateTypeCol: selectedDateRows,
            originalData: originalFileDatum,
        });
        setAllDateColumnsFormatted(countNonFormattedDateColumns(selectedParamUpdate) === 0);
        setSelectedFileCol(selectedParamUpdate);
        setSelectedDateRows(dateTypeUpdate);
    }, [page]);

    useEffect(() => {
        const numberOfRequiredColumns = requiredDbColumns.length;
        const selectedReqColsCount = countRequiredColumnsSelected(selectedFileCol);
        if (numberOfRequiredColumns > 0) {
            setNotReady(selectedReqColsCount !== numberOfRequiredColumns);
        }
        setAllDateColumnsFormatted(countNonFormattedDateColumns(selectedFileCol) === 0);
    }, [selectedFileCol]);

    return (
        <div className="grid grid-cols-1">
            <div className="h-[640px] w-full py-16 pr-16 pl-10 text-base text-[#727C94]">
                <h4 className="font-bold">{t("datum.uploadModal.matchCol")}</h4>
                <div className="mt-3 mb-5 text-justify text-sm">{t("datum.uploadModal.matchColNote")}</div>
                <div className="max-h-[440px] overflow-y-auto rounded-lg border-1 border-[#DCDEE4]">
                    <table className="divide-y text-left, min-w-full divide-gray-200 text-sm">
                        <thead className="sticky top-0 border-b-1 border-[#DCDEE4] bg-white">
                            <tr>
                                {tableHeadRow.map((tableHead, headRowIndex) => {
                                    return (
                                        <th key={`header-${headRowIndex}`} scope="col" className="px-6 py-3 font-bold text-[#00B3C7]">
                                            {t(tableHead)}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="text-[#727C94]">
                            {dataBaseColumns.map((dbCol, bodyRowIndex) => {
                                const selectedCol = selectedFileCol[bodyRowIndex];
                                return (
                                    <tr
                                        key={`${dbCol.name}-${bodyRowIndex}`}
                                        className={bodyRowIndex === dataBaseColumns.length - 1 ? "" : "border-b-1 border-[#DCDEE4]"}>
                                        <td className="px-6 py-3">
                                            {dbCol.isRequired && (isNil(selectedCol.value) || selectedCol.value === "- - - -") && (
                                                <span className="text-lg text-red-500">{"* "}</span>
                                            )}
                                            <span
                                                className={
                                                    !selectedCol.hasDateFormat &&
                                                    selectedCol.value !== "" &&
                                                    !isNil(selectedCol.value) &&
                                                    (dbCol.type === "date" || dbCol.type === "date-time" || dbCol.type === "time")
                                                        ? "text-red-500"
                                                        : ""
                                                }>
                                                {dbCol.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <label htmlFor={`select-row-${bodyRowIndex}`} className="flex w-full">
                                                <select
                                                    id={`select-row-${bodyRowIndex}`}
                                                    className="text-color-[#727C94] cursor-pointer rounded-lg border-none bg-[#F2F7FD]/[0.75] text-sm font-bold"
                                                    value={selectedCol.value || ""}
                                                    onChange={(e) => handleSelectOption(e, bodyRowIndex, dbCol)}>
                                                    <option id="defaultSelect" key={-1} value={undefined}>
                                                        {"- - - -"}
                                                    </option>
                                                    {uploadedFileColumns.map((colOption, optIdx) => {
                                                        return (
                                                            <option
                                                                key={`row-${bodyRowIndex}-option-${optIdx}`}
                                                                id={`row-${bodyRowIndex}-option-${colOption}-${optIdx}`}
                                                                value={colOption}
                                                                data-option={optIdx}
                                                                className="bg-[#F2F7FD]/[0.75]">
                                                                {colOption}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </label>
                                        </td>
                                        <td className="px-6 py-3">
                                            {uploadedFileDatum.slice(0, 3).map((fileDatum, idx) => {
                                                return <div key={idx}>{get(fileDatum, `${selectedCol.value}`, "")}</div>;
                                            })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {notReady && <div className="my-3 w-full text-sm text-red-600">{`* ${t("datum.error.missingColumn")}`}</div>}
                {!allDateColumnsFormatted && (
                    <div className="my-3 w-full text-sm text-red-600">{`${t("datum.error.notAllDateFieldsFormatted")}`}</div>
                )}
            </div>
            <NavBtns
                goBack={goBack}
                goNext={goNext}
                notReady={notReady}
                allDateColumnsFormatted={allDateColumnsFormatted}
                labelBtnSecondary={t("buttons.back")}
                labelBtnPrincipal={t("buttons.next")}
            />
        </div>
    );
};
