import { renderMessage } from "@apps/shared/common";
import {
    CHANNELS_VIDEO_SUPORT,
    DOCUMENT_MESSAGE_TYPES,
    MAX_SIZE_MB,
    MAX_SIZE_MB_DOCUMENTS,
    MAX_SIZE_MB_WHATSAPP,
    unitInMB,
} from "@apps/shared/constants";

const SOURCE_SUPPORT_EXTRA_SIZE = {
    gupshup: "gupshup",
    web: "web",
};

const getMaxSize = ({ channel = "", source = "", type = "" } = {}) => {
    const sourceSupport = String(source).toLowerCase();
    if (type === DOCUMENT_MESSAGE_TYPES.document && SOURCE_SUPPORT_EXTRA_SIZE[sourceSupport]) {
        return MAX_SIZE_MB_DOCUMENTS;
    }

    if (type === DOCUMENT_MESSAGE_TYPES.video && channel === CHANNELS_VIDEO_SUPORT.WHATSAPP) {
        return MAX_SIZE_MB_WHATSAPP;
    }

    return MAX_SIZE_MB;
};

export function validateFile({ documentList = [], file = {}, t, ACCEPTED = {}, currentRoom = {}, skipExtensionValidation = false } = {}) {
    console.log("file", file);
    const isExists = documentList.some((doc) => doc.name === file.name);
    if (isExists) {
        renderMessage(`${file.name} ${t("pma.thisFileExists")}`, "error");
        return { hasError: true };
    }

    const [typeFile, extension] = file.type.split("/");

    const { type, accept: acceptances } = ACCEPTED[typeFile] || ACCEPTED.document;

    const { channel = "", source = "" } = currentRoom;

    console.error({ acceptances, extension, typeFile, validation: acceptances.includes(extension) }, "for testing");

    if (!skipExtensionValidation && !acceptances.includes(extension)) {
        renderMessage(`${t("pma.errorFileType")}: ${file.name}`, "error");
        console.error({ acceptances, extension, typeFile, validation: !acceptances.includes(extension) });
        return { hasError: true };
    }

    const maxSize = getMaxSize({ channel, source, type });
    const sizeOfFile = (file.size / unitInMB).toFixed(0);

    if (sizeOfFile > maxSize) {
        renderMessage(t("pma.errorFileSize"), "error");
        console.error({ file, currentSize: sizeOfFile > maxSize });
        return { hasError: true };
    }

    return { hasError: false };
}
