import ow from "ow";

import { JelouApiV1 } from "@apps/shared/modules";

/**
 * Service to uploads a file to s3 and returns the url of the file
 * @param {string} companyId the id of the company to get the operators
 * @param {FormData} formData the form data to upload to s3
 * @returns {Promise<string>} the url of the file uploaded
 */
export async function uploadToS3Service(companyId, formData) {
    ow(companyId, ow.string.nonEmpty);
    ow(formData, ow.object.instanceOf(FormData));

    try {
        const { data, status } = await JelouApiV1.post(`/companies/${companyId}/datum/upload`, formData);
        if (status === 200) return data;

        return Promise.reject(new Error("Tuvimos un error al subir el archivo, por favor refresque la página").message);
    } catch (error) {
        throw new Error("Tuvimos un error al intentar subir el archivo, por favor refresque la página e intente nuevamente");
    }
}

/**
 * Service to delete a file from s3 and returns a boolean
 * @param {string} companyId - The company id
 * @param {string} url - The url of the file you want to delete
 * @returns A promise that resolves to a boolean
 */
export async function deleteToS3Service(companyId, url) {
    ow(url, ow.string.nonEmpty);
    ow(companyId, ow.string.nonEmpty);

    try {
        const { status } = await JelouApiV1.delete(`/companies/${companyId}/datum?url=${url}`);

        if (status === 200) return true;

        return Promise.reject(new Error("Tuvimos un error al eliminar el archivo, por favor refresque la página").message);
    } catch (error) {
        throw new Error("Tuvimos un error al intentar eliminar el archivo, por favor refresque la página e intente nuevamente");
    }
}
