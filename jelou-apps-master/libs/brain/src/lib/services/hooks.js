import { JelouApiV1 } from "@apps/shared/modules";
import { v4 as uuidv4 } from "uuid";

export async function useFileUploader({ url, apiToken }, { file }) {
    const options = {
        headers: {
            Authorization: `Bearer ${apiToken}`,
            "content-type": "multipart/form-data",
        },
    };

    const formData = new FormData();
    const cleanFileName = file?.name
        .replace(/ /g, "-")   // Replaces spaces with hyphens
        .normalize("NFD")   // Separate the accent marks and umlauts from their base vowel
        .replace(/[\u0300-\u036f]/g, "")   // Remove accent marks, umlauts, etc.
        .replace(/ñ/g, "n");   // Replace the letter "ñ" with "n"
    const fileName = `brains/${uuidv4()}/${cleanFileName}`;
    formData.append("image", file);
    formData.append("path", fileName);

    const response = JelouApiV1.post(url, formData, options);

    if (response.status === 401) {
        throw new Error("Unauthorized");
    }
    if (response.status >= 400 && response.status < 500) {
        throw new Error("Client error");
    }
    if (response.status >= 500 && response.status < 600) {
        throw new Error("Server error");
    }
    return response;
}

export async function useFileRemover({ url }) {
    const response = JelouApiV1.delete(url);

    if (response.status === 401) {
        throw new Error("Unauthorized");
    }
    if (response.status >= 400 && response.status < 500) {
        throw new Error("Client error");
    }
    if (response.status >= 500 && response.status < 600) {
        throw new Error("Server error");
    }

    return response;
}


