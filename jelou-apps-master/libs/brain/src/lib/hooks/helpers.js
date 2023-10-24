import { t } from "i18next";
import capitalize from "lodash/capitalize";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import isString from "lodash/isString";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useSelector } from "react-redux";
import z from "zod";
// import urlRegex from "url-regex";
import dayjs from "dayjs";

import { COMPONENT_NAME, DATASOURCE_TEXT_MIN_LENGTH, DATASOURCE_TYPE_TRANSLATIONS, DATASOURCE_TYPES, DESCRIPTION_MIN_LENGTH, METADATA_TYPES, NAME_MIN_LENGTH } from "../constants";

/** Checks if a text string is a valid web address (URL) */
const isURL = (url) => {
    // return urlRegex({ exact: true }).test(url);
    return z.string().url().min(1).max(1000).safeParse(url).success;
};

/** Allows you to validate if an object has the minimum required
 * fields and that they comply with the pre-established rules */

export const validateObjectParams = ({ obj = {}, validate }) => {
    /** Validates if an object has a key, and if its corresponding value has a minimum length */
    const hasValidValue = ({ obj, key, minLength = 0 }) => {
        const value = get(obj, key, "");
        return isString(value) && value.length >= minLength;
    };
    /** Validates that a "metadata" type object, necessary to create a datasource, has valid information */
    const validateNestedObject = ({ obj = {}, key }) => {
        if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === "object") {
            const nestedObject = obj[key] || {};

            const textValue = get(nestedObject, METADATA_TYPES.TEXT, "");
            const urlValue = get(nestedObject, METADATA_TYPES.URL, "");
            // const skillValue = get(nestedObject, METADATA_TYPES.SKILL, "");
            const filesValue = get(nestedObject, METADATA_TYPES.FILES, []);
            const flowsValue = get(nestedObject, METADATA_TYPES.FLOWS, {});

            if (hasValidValue({ obj: nestedObject, key: METADATA_TYPES.TEXT, minLength: DATASOURCE_TEXT_MIN_LENGTH }) && isString(textValue) && textValue !== "<p><br></p>") {
                // The object has a key "text" with a value of type string, length greater than 0 and not equal to "<p><br></p>"
                return true;
            }

            if (isString(urlValue) && isURL(urlValue)) {
                // The object has a key "url" with a value of type string that is a valid web address
                return true;
            }

            if (Object.prototype.hasOwnProperty.call(nestedObject, METADATA_TYPES.SKILL)) {
                const skillIdValue = nestedObject[METADATA_TYPES.SKILL];
                if (skillIdValue !== null && skillIdValue !== undefined && skillIdValue !== "") {
                    // El objeto tiene una propiedad "skill_id" con un valor que no es null, undefined ni una cadena vacía
                    return true;
                }
            }

            if (Array.isArray(filesValue) && filesValue.length > 0 && filesValue.every((file) => isURL(file))) {
                // The object has a key "files" with a value of type array containing at least one element, and all elements are valid web addresses
                return true;
            }

            if (isObject(flowsValue) && Object.keys(flowsValue).length > 0) {
                // The object has a key "flows" with a value of type object containing at least one key-value pair
                return true;
            }
        }

        return false;
    };

    let requiredFieldsCount = Object.keys(validate).length;
    let completeFieldsCount = 0;

    let hasValidName = hasValidValue({ obj, key: COMPONENT_NAME.NAME, minLength: NAME_MIN_LENGTH });
    let hasValidDescription = hasValidValue({ obj, key: COMPONENT_NAME.DESCRIPTION, minLength: DESCRIPTION_MIN_LENGTH });
    let hasValidMetadata = validateNestedObject({ obj, key: COMPONENT_NAME.METADATA });

    if (validate?.name && hasValidName) {
        if (hasValidName) {
            completeFieldsCount++;
        }
    }

    if (validate?.description && hasValidDescription) {
        completeFieldsCount++;
    }

    if (validate?.metadata && hasValidMetadata) {
        completeFieldsCount++;
    }
    return completeFieldsCount === requiredFieldsCount;
};

/** Transforms the object sent by the Tester Chat into another object
 * with the information that will be rendered in this chat */

export const transformAnswerSources = ({ message, isMessageFromHistory }) => {
    const _answer = get(message, `${isMessageFromHistory ? "answer" : "messages[0].text"}`, "");
    const _sources = get(message, `${isMessageFromHistory ? "context" : "sources"}`, []);
    return {
        answer: _answer,
        sources: _sources.map((source) => {
            const isDatasourceTypeFlow = get(source, "type") === DATASOURCE_TYPES.WORKFLOW;
            const isDatasourceTypeSkill = get(source, "type") === DATASOURCE_TYPES.SKILL;
            const receivedSourceType = isDatasourceTypeFlow ? DATASOURCE_TYPES.WORKFLOW : isDatasourceTypeSkill ? DATASOURCE_TYPES.SKILL : get(source, "knowledge_source.type", "");

            const datasourceType = DATASOURCE_TYPE_TRANSLATIONS[receivedSourceType];
            const key = datasourceType ? datasourceType : t("common.type");

            const sourceObj = {
                source: receivedSourceType,
                [key]: get(source, "knowledge_source.name", ""),
                score: get(source, "score", 0),
                datastoreId: get(source, "knowledge.brain_id", ""),
                datasource: get(source, "knowledge", {}),
                sourceInfo: get(source, "knowledge_source", {}),
                blockId: get(source, "source_block.id", ""),
                isDatasourceTypeFlow,
            };

            if (isDatasourceTypeFlow || isDatasourceTypeSkill) {
                delete sourceObj[key];
            }

            return sourceObj;
        }),
    };
};

/** Compares if 2 objects are equal */

export const areObjectsEqual = (obj1, obj2) => {
    const areKeysEqual = (a, b) => JSON.stringify(Object.keys(a).sort()) === JSON.stringify(Object.keys(b).sort());

    if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
        return obj1 === obj2;
    }

    if (!areKeysEqual(obj1, obj2)) {
        return false;
    }

    for (const key in obj1) {
        if (key === "metadata") {
            if (!areObjectsEqual(obj1[key]?.flows, obj2[key]?.flows)) {
                return false;
            }
        } else {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
    }

    return true;
};

/** Compares if 2 primitive elements arrays are equal */

export const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false;
    }
    return arr1.every((element, index) => element === arr2[index]);
};

/**Given an initial array and a new array, returns an array containing
 * only the new elements, which are not in the initial array. */

export const getNewArrayElements = (currentArray, initialArray) => {
    return currentArray.filter((element, index) => element !== initialArray[index]);
};

/**Given an initial array and a new array, returns an array containing
 * only the removed elements, which are not in the current array. */

export const getRemovedArrayElements = (currentArray, initialArray) => {
    return initialArray.filter((element) => !currentArray.includes(element));
};

/**
 * Find the first valid phone number in a provided array and update
 * the variable related to the function passed as a parameter.
 */
export const findAndSetValidPhoneNumber = ({ phoneNumbersArr, setPhoneNumber, setShowCode }) => {
    if (!isEmpty(phoneNumbersArr)) {
        let foundValidNumber = false;
        phoneNumbersArr.forEach((phone) => {
            if (!foundValidNumber && !isEmpty(phone) && isValidPhoneNumber(phone)) {
                const phoneNumber = phone.replace("+", "");
                setPhoneNumber(phoneNumber);
                foundValidNumber = true;
                if (setShowCode) {
                    setShowCode(true);
                }
            }
        });
    }
};

export const useFormatDateAndCapitalize = (date) => {
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    dayjs.locale(lang);

    if (!date) {
        return dayjs().format("MMM DD, YYYY");
    }

    const formattedDate = dayjs(date).format("MMM DD, YYYY");
    return capitalize(formattedDate);
};

export const useFormattedCardTimestamps = (card) => {
    const createAtformatDateAndCapitalize = useFormatDateAndCapitalize(card?.created_at);
    const updateAtformatDateAndCapitalize = useFormatDateAndCapitalize(card?.updated_at);

    const formattedTimestamps = [
        { key: t("common.createdAt"), value: createAtformatDateAndCapitalize },
        { key: t("common.updatedAtShort"), value: updateAtformatDateAndCapitalize },
    ];
    return formattedTimestamps;
};
