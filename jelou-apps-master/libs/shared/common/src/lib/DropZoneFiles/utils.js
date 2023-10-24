import { unitInMB } from "@apps/shared/constants";
import { t } from "i18next";

/**
 * It validates a file based on the following criteria:
 *
 * - The file exists
 * - The file is not already in the list of images
 * - The file size is less than 25MB
 * - The file type is in the list of accepted file types
 *
 * The function returns an object with two properties:
 *
 * - hasError: a boolean indicating whether the file is valid or not
 * - message: a string containing the error message
 *
 * @param {File} file - The file to be validated
 * @param {File[]} imagesList - The list of images that are already uploaded.
 * @param {String} accept - The file types that are accepted.
 * @returns {{message: String, hasError: Boolean}} An object with two properties: hasError and message.
 */
export const validatorFile = (file, imagesList, accept) => {
    let message = null;

    if (!file) {
        message = "No file selected";
    }

    const isImageExist = imagesList.some((img) => img.name === file.name);
    if (isImageExist) {
        message = `${[file.name]} ${t("shop.errors.alreadyExists")}`;
    }

    if ((file.size / unitInMB).toFixed(0) > 25) {
        message = t("datum.error.fileSize");
    }

    const extension = file.type.split("/")[1];
    if (accept && !accept.includes(extension)) {
        message = t("datum.error.fileType");
    }

    const hasError = message !== null;
    return { hasError, message };
};
