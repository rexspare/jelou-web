import * as Sentry from "@sentry/react";
import { useSelector } from "react-redux";
import has from "lodash/has";
import get from "lodash/get";
import { JelouApiV1 } from "@apps/shared/modules";
import { v4 as uuidv4 } from "uuid";

export function useUploadFile() {
    const currentRoom = useSelector((state) => state.currentRoom);
    const { id: companyId } = useSelector((state) => state.company);

    const uploadFile = async (formData) => {
        const { appId } = currentRoom;

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        try {
            const { data } = await JelouApiV1.post(`/bots/${appId}/images/upload`, formData, config);
            return data;
        } catch ({ error }) {
            if (has(error, "response.data")) {
                Sentry.setExtra("error", get(error, "response.data"));
            } else {
                Sentry.setExtra("error", error);
            }

            Sentry.captureException(new Error("Error uploading file."));
            return error;
        }
    };

    const prepareAndUploadFile = async (file) => {
        console.log("file", file);
        const cleanFileName = file.name.replace(/ /g, "_");
        const fileName = uuidv4() + `-${cleanFileName}`;
        const [typeFile] = file.type.split("/");

        // {dropzone}-COMPANY_ID/{image|video|document}/UUID.EXTENSION_ARCHIVO -> estructura del path
        const UUID = uuidv4();
        const path = `dropzone-${companyId}/${typeFile}/${UUID}-${fileName}`;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("path", path);

        const mediaUrl = await uploadFile(formData);
        console.log("mediaUrl", mediaUrl);
        return { mediaUrl };
    };

    const deleteFile = ({ mediaUrl = null, currentRoom } = {}) => {
        if (!mediaUrl) {
            return Promise.reject("url is empty");
        }

        const {
            bot: { id = "" },
        } = currentRoom;
        const path = mediaUrl.split(".tech/")[1];

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            data: { path },
        };

        return JelouApiV1.delete(`/bots/${id}/images`, config)
            .then(({ data }) => {
                return data.message[0];
            })
            .catch(() => {
                throw new Error("Error deleting file.");
            });
    };

    return { uploadFile, prepareAndUploadFile, deleteFile };
}
