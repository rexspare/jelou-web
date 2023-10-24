import axios from "axios";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";

export function useDownloadConversation() {
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [downloadIsReady, setDownloadIsReady] = useState(false);
    const { t } = useTranslation();

    const downloadConversation = useCallback(
        async ({ clientNames = "", operatorNames = "", wrapConversation = null, existOtherParams = null } = {}) => {
            if (!clientNames || !operatorNames || !wrapConversation) {
                renderMessage("Error con los datos de la conversación", MESSAGE_TYPES.ERROR);
                console.error("error", { clientNames, operatorNames, wrapConversation });
                return;
            }

            setLoadingDownload(true);
            renderMessage(t("conversationDownload.loadMessage"), MESSAGE_TYPES.SUCCESS);
            const nameOfDocument = `${clientNames.replaceAll(/\s/g, "")}-${operatorNames.replaceAll(/\s/g, "")}-${dayjs().format(
                "YYYY-MM-DD-HH-mm-ss-SSS"
            )}`;

            const height = wrapConversation.offsetHeight;

            const urlWith = `${window.location.href}&jwt=${localStorage.getItem("jwt")}&scrapper=true`;
            const urlWithout = `${window.location.href}?jwt=${localStorage.getItem("jwt")}&scrapper=true`;

            const dataPDF = {
                url: existOtherParams ? urlWith : urlWithout,
                name: nameOfDocument,
                width: 550,
                height,
                timeout: 8000,
            };

            try {
                const { data } = await axios.post("https://functions.jelou.ai/generatePDF", dataPDF);
                const link = document.createElement("a");
                link.href = data.data.location;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                setDownloadIsReady(true);
            } catch (error) {
                renderMessage(String(error), MESSAGE_TYPES.ERROR);
                console.error("de", error);
            } finally {
                setLoadingDownload(false);
            }
        },
        []
    );

    return { downloadConversation, loadingDownload, downloadIsReady };
}
