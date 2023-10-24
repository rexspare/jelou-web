import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { JelouApiV1 } from "@apps/shared/modules";

export function useUploadFile({ databaseSlug = "" } = {}) {
    const companyId = useSelector((state) => state.company.id);

    const prepareFile = async ({ file = null } = {}) => {
        if (!file) {
            return Promise.reject("file is empty");
        }

        // datum-COMPANY_ID/DATABASE_SLUG/UUID.EXTENSION_ARCHIVO -> estructura del path
        const UUID = uuidv4();
        const withoutSpace = file.name.replace(/\s/g, '');
        const fileName = encodeURIComponent(withoutSpace.split(".xlsx")[0]);
        const path = `datum-${companyId}/${databaseSlug}/${fileName}-${UUID}.${
            file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? "xlsx" : file.type
        }`;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("path", path);

        try {
            const url = await uploadFile(formData);
            return url;
        } catch (error) {
            console.log("upload file to s3", { error });
            throw error;
        }
    };

    const uploadFile = (formData) => {
        const JWT = localStorage.getItem("jwt");

        const config = {
            headers: {
                Authorization: `Bearer ${JWT}`,
                "content-type": "multipart/form-data",
            },
        };

        return JelouApiV1.post(`/companies/${companyId}/datum/upload `, formData, config)
            .then(({ data }) => {
                return data;
            })
            .catch(({ err }) => {
                throw err;
            });
    };

    const deleteFile = ({ urlFile = null } = {}) => {
        if (!urlFile) {
            return Promise.reject("url is empty");
        }

        return JelouApiV1.delete(`/companies/${companyId}/datum?url=${urlFile}`)
            .then(() => true)
            .catch(() => false);
    };

    return { prepareFile, deleteFile };
}
