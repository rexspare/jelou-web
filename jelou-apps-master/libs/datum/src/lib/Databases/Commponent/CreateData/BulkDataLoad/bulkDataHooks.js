import { t } from "i18next";
import isNil from "lodash/isNil";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import Fuse from "fuse.js";
import moment from "moment";

import { DATUM_TYPES, DAYS_TO_ADJUST, MIL_SECS_PER_DAY, FORMAT_DATE } from "libs/datum/src/lib/constants";


/** Updates the element of the array that has the index received as parameter
 * with the value of the other parameters received. */

export const updateArrayElement = ({
    arrayToUpdate,
    newValue,
    newType,
    newKey,
    index,
    hasDateFormat = false,
    isRequired = false,
    isLoading = false
}) => {
    arrayToUpdate[index] = {
        value: newValue,
        type: newType,
        key: newKey,
        hasDateFormat,
        isRequired,
        isLoading
    };
};

/** Returns the type of data contained by the column passed by parameter */

export const getColumnFileDataType = ({ columnName, dataRows }) => {
    let previewValue = "";
    let i = 0;

    while (i < dataRows?.length) {
        previewValue = dataRows[`${i}`][`${columnName}`];
        if (typeof previewValue !== "object") break;
        i++;
    }

    if (isNil(previewValue)) return DATUM_TYPES.EMPTY;
    switch (typeof previewValue) {
        case "string":
            return DATUM_TYPES.STRING;
        case "number":
            return DATUM_TYPES.NUMBER;
        default:
            return DATUM_TYPES.UNKNOWN;
    }
};

/** Receives an array of objects, each element having a key called "value".
 * Counts how many elements have an invalid value. */

export const countInvalidElements = (array) => {
    return array.reduce((acc, element) => {
        const isElementInvalid = element.value === "- - - -" || element.value === "" || isNil(element.value);
        if (isElementInvalid) {
            return acc + 1;
        };
        return acc;
    }, 0);
};


/** Receives an Excel date, time or date-time as param and returns it in the correct string format */

export const convertExcelDateToString = (number) => {
    if (typeof number === "string" && number.trim() === "") return "";

    const minExcelDate = new Date(1900, 0, 1); // Min valid Excel date
    let formattedNumber = t("datum.error.invalidDate");

    const convertDateToString = (integerNumber) => {
        const minDate = 1;
        const maxDate = 2958465;
        if(integerNumber >= minDate && integerNumber <= maxDate){
            const date = moment((integerNumber - DAYS_TO_ADJUST) * MIL_SECS_PER_DAY);
            return date.format(FORMAT_DATE.date);
        } else {
            return t("datum.error.invalidDate");
        }
    };
    const convertTimeToString = (floatNumber) => {
        const excelTime = new Date(minExcelDate.getTime() + floatNumber * MIL_SECS_PER_DAY);
        const time = moment(excelTime);
        return time.format(FORMAT_DATE.time);
    };

    if(!isNil(number)) {
        if (Number.isInteger(number)) {
            formattedNumber = convertDateToString(number); //Date to string
        } else {
            const integerNum = Math.trunc(number);
            if (integerNum === 0) {
                formattedNumber = convertTimeToString(number); //Time to string
            } else {
                const floatNum = +number.toString().replace(/^[^\.]+/,'0');
                formattedNumber = `${convertDateToString(integerNum)}T${convertTimeToString(floatNum)}`; //Date-time to string
            }
        }
    } else {
        return "";
    }
    return formattedNumber;
};

export const getSubstringBetweenSpaceAndDot = ({ inputString, type }) => {
    const timeIndex = inputString.indexOf('T')

    if (type === 'time' || type === 'date' || type === 'date-time') {
        if (timeIndex === -1 ) {
            return inputString; // Si no se encuentra la letra T, retorna la cadena.
        } else {
            return inputString.slice(timeIndex + 1);
        }
    }
};

/** Updates the preview data in pageList with converted dates (string or number) */

export const updateFileWithParsedTimeFormat = ({
    originalDatum,
    columnToConvert,
    file,
    page = 0,
    parseTime = true,
    type = 'date',
}) => {
    if (parseTime) {
        originalDatum?.forEach((fileRow, rowIndex) => {
            file[page].preview[rowIndex][columnToConvert] = getSubstringBetweenSpaceAndDot({ inputString: fileRow[columnToConvert], type });
        });
    } else {
        originalDatum?.forEach((fileRow, rowIndex) => {
            file[page].preview[rowIndex][columnToConvert] = fileRow[columnToConvert];
        });
    }
};

/** Counts the number of objects with date type that do not have their hasDateFormat=true */

export const countNonFormattedDateColumns = (arr) => {
    const nonFormatedDateColumns = arr?.reduce((acc, selectedCol) => {
        const isColSelected = !isNil(selectedCol.value) || selectedCol.value !== "";
        const isDate = selectedCol.type === "date" || selectedCol.type == "time" || selectedCol.type === "date-time";
        if (isColSelected && isDate ) {
            if (!selectedCol.hasDateFormat) {
                acc ++;
            }
        }
        return acc;
    }, 0);
    return nonFormatedDateColumns;
};

/** Counts the number of required selected fields */

export const countRequiredColumnsSelected = (arr) => {
    const selectedRequiredColumns = arr?.reduce((acc, selectedCol) => {
        const isColSelected = !isNil(selectedCol.value) || selectedCol.value !== "";
        const isRequired = selectedCol.isRequired === true;
        if (isColSelected && isRequired ) {
                acc ++;
        }
        return acc;
    }, 0);
    return selectedRequiredColumns;
};

/**This function searches each element of an array for matches with the elements of another array.
 * If there is a match, it updates the corresponding element of a third array, which at the end
 * of the process will be returned by the function. */

export const searchAndSelectOptionsAutomatically = ({
    fuseOptions,
    arrToBeSearched,
    arrToBeFused,
    selectedColArr,
    selectedDateTypeCol,
    originalData
}) => {
    let matchedDbCol, parsedColumnName;
    const fuse = new Fuse(arrToBeSearched, fuseOptions);
    const selectedParamUpdate = [...selectedColArr];
    const dateTypeUpdate = [...selectedDateTypeCol];
    const updateSelectedParam = (matchedCol, arrayToBeUpdated, dataType, dateTypeColumn, colIndex, columnName) => {
        const { type, key, isRequired} = matchedCol?.item;
        const { refIndex } = matchedCol;
        const isDate = type === "date" || type == "time" || type === "date-time";
        if (isNil(arrayToBeUpdated[refIndex]?.value)) {
            if (isDate) {
                if (dataType === "number") {
                    dateTypeColumn[colIndex] = columnName;
                    updateArrayElement({ arrayToUpdate: arrayToBeUpdated, newValue: columnName, newType: type, newKey: key, index: refIndex, hasDateFormat: isDate, isRequired });
                }
            } else {
                updateArrayElement({ arrayToUpdate: arrayToBeUpdated, newValue: columnName, newType: type, newKey: key, index: refIndex, hasDateFormat: isDate, isRequired });
            }
        }
    };
    arrToBeFused?.forEach((columnName, colIndex) => {
        if(!isEmpty(columnName)){
            const selectedOptionType = getColumnFileDataType(columnName, originalData);
            parsedColumnName = columnName.replaceAll("_", " ");
            matchedDbCol = fuse.search(parsedColumnName);
            if (!isEmpty(matchedDbCol)) {
                updateSelectedParam(matchedDbCol[0], selectedParamUpdate, selectedOptionType, dateTypeUpdate, colIndex, columnName);
            } else {
                const columnNameArr = columnName.split("_");
                columnNameArr?.forEach((keyWord) => {
                    matchedDbCol = fuse.search(keyWord);
                    if (!isEmpty(matchedDbCol)) {
                        matchedDbCol?.forEach((matchedCol) => {
                            updateSelectedParam(matchedCol, selectedParamUpdate, selectedOptionType, dateTypeUpdate, colIndex, columnName);
                        })
                    }
                });
            }
        }
    });
    return { selectedParamUpdate, dateTypeUpdate };
};
